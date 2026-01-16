
import { state } from '../state.js';
import { render, router } from '../utils.js';
import { ui } from '../ui.js';

export const WHEEL_REWARDS = [
    { label: '1 000 $', weight: 12, type: 'money', value: 1000, color: '#10b981', rarity: 'Commun' },
    { label: '5 000 $', weight: 10, type: 'money', value: 5000, color: '#10b981', rarity: 'Commun' },
    { label: '7 500 $', weight: 8, type: 'money', value: 7500, color: '#10b981', rarity: 'Commun' },
    { label: '10 000 $', weight: 8, type: 'money', value: 10000, color: '#10b981', rarity: 'Commun' },
    { label: '12 500 $', weight: 6, type: 'money', value: 12500, color: '#10b981', rarity: 'Commun' },
    { label: '15 000 $', weight: 3.9, type: 'money', value: 15000, color: '#059669', rarity: 'Peu Commun' },
    { label: '20 000 $', weight: 3.9, type: 'money', value: 20000, color: '#059669', rarity: 'Peu Commun' },
    { label: '25 000 $', weight: 3.25, type: 'money', value: 25000, color: '#3b82f6', rarity: 'Rare' },
    { label: '30 000 $', weight: 3.25, type: 'money', value: 30000, color: '#3b82f6', rarity: 'Rare' },
    { label: '40 000 $', weight: 2.6, type: 'money', value: 40000, color: '#3b82f6', rarity: 'Rare' },
    { label: '50 000 $', weight: 2.6, type: 'money', value: 50000, color: '#3b82f6', rarity: 'Très Rare' },
    { label: '60 000 $', weight: 1.95, type: 'money', value: 60000, color: '#8b5cf6', rarity: 'Mythique' },
    { label: '75 000 $', weight: 1.95, type: 'money', value: 75000, color: '#8b5cf6', rarity: 'Mythique' },
    { label: '100 000 $', weight: 1.95, type: 'money', value: 100000, color: '#8b5cf6', rarity: 'Mythique' },
    { label: '150 000 $', weight: 1.3, type: 'money', value: 150000, color: '#fbbf24', rarity: 'Légendaire' },
    { label: '200 000 $', weight: 1.3, type: 'money', value: 200000, color: '#fbbf24', rarity: 'Légendaire' },
    { label: '300 000 $', weight: 0.65, type: 'money', value: 300000, color: '#ef4444', rarity: 'Relique' },
    { label: '500 000 $', weight: 0.325, type: 'money', value: 500000, color: '#ef4444', rarity: 'Ancestral' },
    { label: 'VIP Bronze', weight: 3.25, type: 'role', color: '#cd7f32', rarity: 'Premium' },
    { label: 'VIP Or', weight: 1.95, type: 'role', color: '#ffd700', rarity: 'Premium' },
    { label: 'Rôle Légende', weight: 0.65, type: 'role', color: '#a855f7', rarity: 'Divin' }
];

export const openCrate = async (crateIdx) => {
    const turns = state.user.whell_turn || 0;
    if (state.isOpening || turns <= 0) return;
    if (state.characters.length === 0) return ui.showToast("Dossier citoyen requis.", "error");

    state.isOpening = true;
    state.openingCrateIdx = crateIdx;
    render();

    // Animation simplifiée : 1.5s de pulse léger
    setTimeout(async () => {
        const totalWeight = WHEEL_REWARDS.reduce((acc, r) => acc + r.weight, 0);
        let randomVal = Math.random() * totalWeight;
        let winner = WHEEL_REWARDS[0];
        for (const reward of WHEEL_REWARDS) {
            randomVal -= reward.weight;
            if (randomVal <= 0) { winner = reward; break; }
        }

        const currentWinner = { ...winner };
        state.lastWheelWinner = currentWinner;
        
        const newTurns = turns - 1;
        await state.supabase.from('profiles').update({ whell_turn: newTurns }).eq('id', state.user.id);
        state.user.whell_turn = newTurns;

        state.isOpening = false;
        state.openingCrateIdx = null;

        if (currentWinner.type === 'money') {
            showCharacterChoiceModal(currentWinner);
        } else {
            showSecureScreenshotModal(currentWinner);
        }
        render();
    }, 1500);
};

const showCharacterChoiceModal = (reward) => {
    const charsHtml = state.characters.map(c => `
        <button onclick="actions.claimMoneyReward(${reward.value}, '${c.id}')" 
            class="w-full p-5 rounded-[24px] bg-gov-light border border-gray-100 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-left flex items-center justify-between group">
            <div>
                <div class="font-black text-gov-text uppercase italic group-hover:text-emerald-600">${c.first_name} ${c.last_name}</div>
                <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">ID Citoyen : #${c.id.substring(0,8).toUpperCase()}</div>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-gray-300 group-hover:text-emerald-500"></i>
        </button>`).join('');

    ui.showModal({
        title: "ATTRIBUER LE GAIN",
        isClosable: false,
        content: `
            <div class="text-center mb-10">
                <div class="text-7xl mb-6">💰</div>
                <div class="text-4xl font-black text-emerald-600 tracking-tighter">+$ ${reward.value.toLocaleString()}</div>
                <p class="text-gray-500 text-xs mt-3 italic">Sélectionnez le bénéficiaire :</p>
            </div>
            <div class="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">${charsHtml}</div>
        `,
        confirmText: null
    });
};

const showSecureScreenshotModal = (reward) => {
    ui.showModal({
        title: "LOT D'EXCEPTION DÉVÉROUILLÉ",
        isClosable: false,
        type: 'warning',
        content: `
            <div class="text-center p-8 bg-[#000091] rounded-[40px] border border-white/10 relative overflow-hidden shadow-2xl">
                <div class="mb-8">
                    <div class="text-[10px] text-white/60 font-black uppercase tracking-[0.4em] mb-2">Preuve de Gain Certifiée</div>
                    <div class="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">${reward.label}</div>
                </div>
                <div class="bg-red-600 text-white p-4 rounded-2xl text-[10px] font-black uppercase">Faites une capture d'écran pour réclamer sur Discord.</div>
            </div>
        `,
        confirmText: "Compris"
    });
};

export const claimMoneyReward = async (value, charId) => {
    try {
        const { data: bank } = await state.supabase.from('bank_accounts').select('bank_balance').eq('character_id', charId).single();
        if (bank) {
            await state.supabase.from('bank_accounts').update({ bank_balance: (bank.bank_balance || 0) + value }).eq('character_id', charId);
            await state.supabase.from('transactions').insert({ 
                receiver_id: charId, amount: value, type: 'admin_adjustment', description: 'Gain Loterie TFRP' 
            });
            ui.showToast(`$${value.toLocaleString()} versés.`, "success");
        }
    } catch(e) { ui.showToast("Erreur versement.", "error"); }
    ui.forceCloseModal();
    render();
};

export const setProfileTab = (tab) => {
    state.activeProfileTab = tab;
    render();
};

export const showProbabilities = () => {
    const totalWeight = WHEEL_REWARDS.reduce((acc, r) => acc + r.weight, 0);
    const sorted = [...WHEEL_REWARDS].sort((a,b) => b.weight - a.weight);
    ui.showModal({ title: "Algorithme de Probabilités", content: `<div class="bg-gov-light rounded-[24px] border border-gray-200 overflow-hidden max-h-96 overflow-y-auto custom-scrollbar">${sorted.map(r => `<div class="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-white transition-colors"><div class="flex items-center gap-3"><div class="w-2 h-2 rounded-full" style="background: ${r.color}"></div><span class="text-[10px] font-black text-gov-text uppercase tracking-tight">${r.label}</span></div><span class="text-[10px] font-mono text-gov-blue font-bold">${((r.weight/totalWeight)*100).toFixed(1)}%</span></div>`).join('')}</div>` });
};
