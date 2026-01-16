
import { state } from '../state.js';
import { render } from '../utils.js';
import { ui } from '../ui.js';
import { loadCharacters, fetchBankData, fetchInventory, fetchCharacterReports } from '../services.js';

export const loadUserSanctions = async () => {
    if (!state.user || !state.supabase) return;
    const { data } = await state.supabase.from('sanctions').select('*').eq('user_id', state.user.id).order('created_at', { ascending: false });
    state.userSanctions = data || [];
    render();
};

export const showGlobalAudit = async (charId) => {
    const char = state.characters.find(c => c.id === charId);
    if (!char) return;

    ui.showToast("Génération de l'audit...", "info");

    let bankData = null;
    let invData = [];
    let reportsData = [];

    try {
        // Tentative de récupération multi-sources
        const [bank, inv, reports] = await Promise.allSettled([
            state.supabase.from('bank_accounts').select('*').eq('character_id', charId).maybeSingle(),
            state.supabase.from('inventory').select('*').eq('character_id', charId),
            state.supabase.from('police_report_suspects').select('report_id').eq('character_id', charId)
        ]);

        bankData = bank.status === 'fulfilled' ? bank.value.data : null;
        invData = inv.status === 'fulfilled' ? (inv.value.data || []) : [];
        
        if (reports.status === 'fulfilled' && reports.value.data?.length > 0) {
            const ids = reports.value.data.map(r => r.report_id);
            const { data: fullReports } = await state.supabase.from('police_reports').select('title, fine_amount').in('id', ids);
            reportsData = fullReports || [];
        }
    } catch (e) {
        console.warn("Audit partiel :", e);
    }

    const totalMoney = (bankData?.bank_balance || 0) + (bankData?.cash_balance || 0) + (bankData?.savings_balance || 0);
    const totalFines = reportsData.reduce((sum, r) => sum + (r.fine_amount || 0), 0);

    ui.showModal({
        title: `Audit : ${char.first_name} ${char.last_name}`,
        content: `
            <div class="space-y-6 text-left">
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gov-light p-4 rounded-2xl border border-gray-100">
                        <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Fortune Liquide</div>
                        <div class="text-lg font-mono font-black text-emerald-600">$${totalMoney.toLocaleString()}</div>
                    </div>
                    <div class="bg-gov-light p-4 rounded-2xl border border-gray-100">
                        <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Dettes de Justice</div>
                        <div class="text-lg font-mono font-black text-red-600">$${totalFines.toLocaleString()}</div>
                    </div>
                </div>

                <div>
                    <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2 ml-1">Inventaire physique (${invData.length} objets)</div>
                    <div class="bg-gov-light p-4 rounded-2xl border border-gray-100 max-h-32 overflow-y-auto custom-scrollbar">
                        ${invData.length > 0 ? invData.map(i => `<div class="text-xs font-bold text-gov-text border-b border-gray-200/50 py-1 last:border-0">${i.quantity}x ${i.name}</div>`).join('') : '<div class="text-xs text-gray-400 italic">Sac vide ou données protégées.</div>'}
                    </div>
                </div>

                <div>
                    <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2 ml-1">Résumé Judiciaire</div>
                    <div class="bg-gov-light p-4 rounded-2xl border border-gray-100">
                        <div class="text-xs font-bold text-gov-text">Rapports au casier : <span class="text-blue-600">${reportsData.length}</span></div>
                        <div class="text-[10px] text-gray-500 mt-1 italic">L'audit global ne liste que les éléments indexés dans le CAD national.</div>
                    </div>
                </div>
            </div>
        `,
        confirmText: "Fermer l'Audit"
    });
};

export const submitSanctionAppeal = async (sanctionId, text) => {
    if (!state.supabase || text.length > 350) return;
    const { data: sanction } = await state.supabase.from('sanctions').select('appeal_at').eq('id', sanctionId).single();
    if (sanction?.appeal_at) {
        const lastAppeal = new Date(sanction.appeal_at);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        if (lastAppeal > oneYearAgo) {
            ui.showToast("Vous ne pouvez contester qu'une fois par an.", "error");
            return;
        }
    }
    const { error } = await state.supabase.from('sanctions').update({ appeal_text: text, appeal_at: new Date().toISOString() }).eq('id', sanctionId);
    if (!error) { ui.showToast("Contestation envoyée au Conseil.", "success"); await loadUserSanctions(); }
    else { ui.showToast("Erreur lors de l'envoi de l'appel.", "error"); }
};

export const openAppealModal = (sanctionId) => {
    ui.showModal({
        title: "Contester la Sanction",
        content: `
            <div class="space-y-4">
                <p class="text-xs text-gray-400">Exposez vos arguments de façon concise (Max 350 caractères).</p>
                <textarea id="appeal-text" maxlength="350" class="glass-input w-full p-4 rounded-2xl h-40 text-sm italic" placeholder="Votre défense..."></textarea>
                <div id="char-count" class="text-right text-[10px] text-gray-600 font-mono">0 / 350</div>
            </div>
        `,
        confirmText: "Envoyer l'appel",
        onConfirm: async () => {
            const text = document.getElementById('appeal-text').value;
            if (text.trim().length > 0) await submitSanctionAppeal(sanctionId, text);
        }
    });
    setTimeout(() => {
        const area = document.getElementById('appeal-text');
        const counter = document.getElementById('char-count');
        if(area && counter) area.oninput = () => { counter.textContent = `${area.value.length} / 350`; };
    }, 100);
};

export const requestDataDeletion = async () => {
    ui.showModal({
      title: "⚠️ Suppression Définitive",
      content: "Cette action supprimera l'intégralité de votre existence sur TFRP sous 72h.",
      confirmText: "Confirmer la demande",
      type: "danger",
      onConfirm: async () => {
        const now = new Date().toISOString();
        const { error } = await state.supabase.from('profiles').update({ deletion_requested_at: now }).eq('id', state.user.id);
        if (!error) { state.user.deletion_requested_at = now; ui.showToast("Demande de suppression enregistrée.", "warning"); render(); }
      }
    });
};

export const cancelDataDeletion = async () => {
    const { error } = await state.supabase.from('profiles').update({ deletion_requested_at: null }).eq('id', state.user.id);
    if (!error) { state.user.deletion_requested_at = null; ui.showToast("Suppression annulée.", "success"); render(); }
};

export const requestCharacterDeletion = async (charId) => {
    const char = state.characters.find(c => c.id === charId);
    if (!char) return;
    ui.showModal({
        title: "Purger l'Identité",
        content: `Voulez-vous marquer le dossier de <b>${char.first_name} ${char.last_name}</b> pour suppression sous 3 jours ?`,
        confirmText: "Confirmer la purge",
        type: "danger",
        onConfirm: async () => {
            const now = new Date().toISOString();
            const { error } = await state.supabase.from('characters').update({ deletion_requested_at: now }).eq('id', charId).eq('user_id', state.user.id);
            if (!error) { ui.showToast("Demande de suppression envoyée.", "warning"); await loadCharacters(); render(); }
        }
    });
};

export const cancelCharacterDeletion = async (charId) => {
    const { error } = await state.supabase.from('characters').update({ deletion_requested_at: null }).eq('id', charId).eq('user_id', state.user.id);
    if (!error) { ui.showToast("Suppression annulée.", "success"); await loadCharacters(); render(); }
};
