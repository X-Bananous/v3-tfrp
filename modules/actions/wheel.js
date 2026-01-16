
import { state } from '../state.js';
import { render, router } from '../utils.js';
import { ui } from '../ui.js';

export const WHEEL_REWARDS = [
    { label: '1 000 $', weight: 20, type: 'money', value: 1000, color: '#10b981' },
    { label: '5 000 $', weight: 15, type: 'money', value: 5000, color: '#10b981' },
    { label: '10 000 $', weight: 10, type: 'money', value: 10000, color: '#10b981' },
    { label: '25 000 $', weight: 5, type: 'money', value: 25000, color: '#3b82f6' },
    { label: '50 000 $', weight: 3, type: 'money', value: 50000, color: '#8b5cf6' },
    { label: 'VIP Bronze', weight: 5, type: 'role', color: '#cd7f32' },
    { label: 'VIP Argent', weight: 3, type: 'role', color: '#c0c0c0' },
    { label: 'VIP Or', weight: 2, type: 'role', color: '#ffd700' },
    { label: 'Rôle Légende', weight: 1, type: 'role', color: '#a855f7' }
];

export const openCrate = async (crateIdx) => {
    const turns = state.user.whell_turn || 0;
    if (state.isOpening || turns <= 0) return;
    if (state.characters.length === 0) return ui.showToast("Un personnage accepté est requis pour attribuer les gains.", "error");

    state.isOpening = true;
    state.openingCrateIdx = crateIdx;
    render();

    // Animation ultra simple de 1.2s
    setTimeout(async () => {
        const totalWeight = WHEEL_REWARDS.reduce((acc, r) => acc + r.weight, 0);
        let randomVal = Math.random() * totalWeight;
        let winner = WHEEL_REWARDS[0];
        
        for (const reward of WHEEL_REWARDS) {
            randomVal -= reward.weight;
            if (randomVal <= 0) { 
                winner = reward; 
                break; 
            }
        }

        const currentWinner = { ...winner };
        const newTurns = turns - 1;
        
        // Update Base
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
    }, 1200);
};

const showCharacterChoiceModal = (reward) => {
    const charsHtml = state.characters.filter(c => c.status === 'accepted').map(c => `
        <button onclick="actions.claimMoneyReward(${reward.value}, '${c.id}')" 
            class="w-full p-4 rounded-2xl bg-gov-light border border-gray-100 hover:bg-emerald-50 hover:border-emerald-500 transition-all text-left flex items-center justify-between group mb-2">
            <div>
                <div class="font-black text-gov-text uppercase italic group-hover:text-emerald-600">${c.first_name} ${c.last_name}</div>
                <div class="text-[8px] text-gray-400 font-black uppercase mt-1">ID : #${c.id.substring(0,8)}</div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-300"></i>
        </button>`).join('');

    ui.showModal({
        title: "LOT DÉVÉROUILLÉ",
        isClosable: false,
        content: `
            <div class="text-center mb-8">
                <div class="text-6xl mb-4">💰</div>
                <div class="text-3xl font-black text-emerald-600 uppercase italic">+$ ${reward.value.toLocaleString()}</div>
                <p class="text-gray-500 text-xs mt-2 italic font-medium">Sélectionnez le bénéficiaire :</p>
            </div>
            <div class="space-y-1">${charsHtml}</div>
        `,
        confirmText: null
    });
};

const showSecureScreenshotModal = (reward) => {
    ui.showModal({
        title: "LOT D'EXCEPTION",
        isClosable: false,
        content: `
            <div class="text-center p-8 bg-blue-900 rounded-[32px] text-white border border-blue-400/30">
                <div class="text-[10px] text-blue-400 font-black uppercase mb-2">Preuve de Gain Certifiée</div>
                <div class="text-3xl font-black uppercase italic leading-none">${reward.label}</div>
            </div>
            <p class="text-center text-[10px] text-gray-500 mt-6 font-bold uppercase">Prenez une capture d'écran et ouvrez un ticket pour réclamer.</p>
        `,
        confirmText: "J'AI PRIS LA CAPTURE",
        onConfirm: () => ui.forceCloseModal()
    });
};

export const claimMoneyReward = async (value, charId) => {
    try {
        const { data: bank } = await state.supabase.from('bank_accounts').select('bank_balance').eq('character_id', charId).single();
        if (bank) {
            await state.supabase.from('bank_accounts').update({ bank_balance: (bank.bank_balance || 0) + value }).eq('character_id', charId);
            await state.supabase.from('transactions').insert({ 
                receiver_id: charId, 
                amount: value, 
                type: 'admin_adjustment', 
                description: 'Gain Lootbox TFRP' 
            });
            ui.showToast(`Gain crédité.`, "success");
        }
    } catch(e) { ui.showToast("Erreur crédit.", "error"); }
    ui.forceCloseModal();
    render();
};
