
import { state } from '../state.js';
import { render, router } from '../utils.js';
import { ui, toggleBtnLoading } from '../ui.js';
import { loadCharacters, adminCreateCharacter } from '../services.js';

let holdTimer = null;
let holdStartTime = 0;

export const startEditCharacter = (charId) => {
    const char = state.characters.find(c => c.id === charId);
    if (char) {
        state.editingCharacter = char;
        router('create');
    }
};

export const viewCensusDetails = (charId) => {
    const char = state.characters.find(c => c.id === charId);
    if (!char || !char.infos) {
        ui.showToast("Détails de recensement non disponibles.", "info");
        return;
    }

    const info = char.infos;
    let detailsHtml = '';

    if (info.type === 'permanent') {
        detailsHtml = `
            <div class="space-y-4">
                <div class="text-[10px] font-black text-gov-blue uppercase tracking-widest border-b border-gray-100 pb-2">Note d'intention (Permanent)</div>
                <div class="p-6 bg-gov-light rounded-2xl border border-gray-200 italic text-sm leading-relaxed text-gray-600">
                    "${info.reason || 'Non renseignée.'}"
                </div>
            </div>
        `;
    } else {
        detailsHtml = `
            <div class="space-y-6">
                <div class="text-[10px] font-black text-orange-600 uppercase tracking-widest border-b border-gray-100 pb-2">Détails de Session (Temporaire)</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div class="text-[8px] text-orange-400 font-black uppercase mb-1">Objectif</div>
                        <div class="text-xs font-bold text-gray-700">${info.goal || 'N/A'}</div>
                    </div>
                    <div class="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div class="text-[8px] text-orange-400 font-black uppercase mb-1">Partenaires</div>
                        <div class="text-xs font-bold text-gray-700">${info.partners || 'N/A'}</div>
                    </div>
                </div>
                <div class="p-6 bg-gov-light rounded-2xl border border-gray-200 italic text-xs leading-relaxed text-gray-600">
                    <div class="text-[8px] text-gray-400 font-black uppercase mb-2 not-italic">Contexte Scénaristique</div>
                    "${info.context || 'Aucun contexte fourni.'}"
                </div>
            </div>
        `;
    }

    ui.showModal({
        title: "Dossier de Recensement",
        content: detailsHtml,
        confirmText: "Fermer"
    });
};

// --- LOGIQUE HOLD-TO-PURGE ---
export const startHoldPurge = (e, charId) => {
    if (e.cancelable) e.preventDefault();
    holdStartTime = Date.now();
    
    const progressEl = document.getElementById(`hold-progress-${charId}`);
    const progressElSec = document.getElementById(`hold-progress-sec-${charId}`);
    
    holdTimer = setInterval(() => {
        const elapsed = Date.now() - holdStartTime;
        const percent = Math.min((elapsed / 5000) * 100, 100);
        
        if (progressEl) progressEl.style.width = `${percent}%`;
        if (progressElSec) progressElSec.style.width = `${percent}%`;

        if (elapsed >= 5000) {
            clearInterval(holdTimer);
            executeFlashWipe(charId);
        }
    }, 50);
};

export const stopHoldPurge = () => {
    if (holdTimer) clearInterval(holdTimer);
    const elements = document.querySelectorAll('[id^="hold-progress-"]');
    elements.forEach(el => el.style.width = '0%');
};

const executeFlashWipe = async (charId) => {
    ui.showToast("Wipe Flash en cours...", "warning");
    const { error } = await state.supabase.from('characters').delete().eq('id', charId).eq('user_id', state.user.id);
    if (!error) {
        ui.showToast("Dossier temporaire effacé avec succès.", "success");
        await loadCharacters();
        render();
    } else {
        ui.showToast("Erreur lors de la suppression.", "error");
    }
};

export const deleteCharacterImmediate = async (charId) => {
    ui.showModal({
        title: "SUPPRESSION DÉFINITIVE",
        content: "Souhaitez-vous supprimer ce dossier définitivement ? Cette action est immédiate et irréversible.",
        confirmText: "Supprimer",
        type: "danger",
        onConfirm: async () => {
            const { error } = await state.supabase.from('characters').delete().eq('id', charId).eq('user_id', state.user.id);
            if (!error) { 
                ui.showToast("Dossier effacé.", 'info');
                await loadCharacters(); 
                render(); 
            } else {
                ui.showToast("Erreur système.", 'error');
            }
        }
    });
};

export const submitCharacter = async (e) => {
    e.preventDefault();
    const btn = e.submitter;
    toggleBtnLoading(btn, true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const today = new Date();
    const birthDate = new Date(data.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age < 13) { 
        ui.showToast('Personnage trop jeune (13 ans minimum).', 'error');
        toggleBtnLoading(btn, false);
        return; 
    }

    const targetUserId = state.isAdminEditing ? state.adminTargetUserId : state.user.id;

    let status = state.isAdminEditing ? 'accepted' : 'pending';
    let job = 'unemployed';
    let isNotified = false;
    let verifiedBy = null;

    if (state.editingCharacter) {
        const oldChar = state.editingCharacter;
        status = oldChar.status;
        job = oldChar.job;
        isNotified = oldChar.is_notified;
        verifiedBy = oldChar.verifiedby;

        if (!state.isAdminEditing && (data.first_name !== oldChar.first_name || data.last_name !== oldChar.last_name)) {
            status = 'pending';
            isNotified = false;
            verifiedBy = null;
        }

        if (data.alignment !== oldChar.alignment) {
            job = 'unemployed';
        }
    }

    // Gestion du champ 'infos'
    const charInfos = {};
    if (!state.editingCharacter && state.characters.length > 0 && !state.isAdminEditing) {
        charInfos.type = data.char_type;
        if (data.char_type === 'permanent') {
            charInfos.reason = data.info_permanent_reason;
        } else {
            charInfos.goal = data.info_temp_goal;
            charInfos.partners = data.info_temp_partners;
            charInfos.context = data.info_temp_context;
        }
    }

    const charData = {
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        birth_place: data.birth_place,
        age: age,
        status: status,
        user_id: targetUserId,
        alignment: data.alignment,
        job: job,
        infos: charInfos,
        is_notified: state.isAdminEditing ? true : isNotified,
        verifiedby: state.isAdminEditing ? state.user.id : verifiedBy
    };

    let error = null;

    if (state.editingCharacter) {
        const { error: updateError } = await state.supabase
            .from('characters')
            .update(charData)
            .eq('id', state.editingCharacter.id);
        error = updateError;
    } else {
        const { error: insertError } = await state.supabase
            .from('characters')
            .insert([charData]);
        error = insertError;
    }
    
    toggleBtnLoading(btn, false);

    if (!error) {
        if(state.isAdminEditing) {
            ui.showToast("Dossier administratif traité.", 'success');
            state.isAdminEditing = false;
            state.editingCharacter = null;
            router('hub');
        } else {
            ui.showToast("Dossier transmis pour validation.", 'success');
            state.editingCharacter = null;
            await loadCharacters();
            router('profile_hub');
        }
    } else {
        ui.showToast("Erreur lors de l'enregistrement.", 'error');
        console.error(error);
    }
};

export const requestCharacterDeletion = async (charId) => {
    const char = state.characters.find(c => c.id === charId);
    if (!char) return;

    ui.showModal({
        title: "PURGER L'IDENTITÉ",
        content: `Voulez-vous marquer <b>${char.first_name} ${char.last_name}</b> pour suppression ? Les données seront effacées dans 72h.`,
        confirmText: "Confirmer la purge",
        type: "danger",
        onConfirm: async () => {
            const now = new Date().toISOString();
            await state.supabase.from('characters').update({ deletion_requested_at: now }).eq('id', charId);
            await loadCharacters();
            render();
        }
    });
};

export const cancelCharacterDeletion = async (charId) => {
    await state.supabase.from('characters').update({ deletion_requested_at: null }).eq('id', charId);
    await loadCharacters();
    render();
};
