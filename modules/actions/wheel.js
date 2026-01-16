
import { state } from '../state.js';
import { render, router } from '../utils.js';
import { ui } from '../ui.js';

const SoundEngine = {
    ctx: null,
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    tick(freq = 150) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 0.1);
    },
    success() {
        if (!this.ctx) return;
        const playNote = (freq, start, duration) => {
            const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + start);
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime + start);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + start); osc.stop(this.ctx.currentTime + start + duration);
        };
        playNote(440, 0, 0.2); playNote(554, 0.1, 0.2); playNote(659, 0.2, 0.4);
    }
};

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
    { label: 'VIP Argent', weight: 2.6, type: 'role', color: '#c0c0c0', rarity: 'Premium' },
    { label: 'VIP Or', weight: 1.95, type: 'role', color: '#ffd700', rarity: 'Premium' },
    { label: 'VIP Platine', weight: 1.3, type: 'role', color: '#e5e4e2', rarity: 'Elite' },
    { label: 'Rôle Légende', weight: 0.65, type: 'role', color: '#a855f7', rarity: 'Divin' },
    { label: '???', weight: 0.975, type: 'special', color: '#f472b6', rarity: 'Unique' }
];

export const openCrate = async (crateIdx) => {
    SoundEngine.init();
    const turns = state.user.whell_turn || 0;
    if (state.isOpening || turns <= 0) return;
    if (state.characters.length === 0) return ui.showToast("Dossier citoyen requis.", "error");

    state.isOpening = true;
    state.openingCrateIdx = crateIdx;
    render();

    // Séquence audio Sonar
    let currentFreq = 200;
    const audioInterval = setInterval(() => {
        SoundEngine.tick(currentFreq);
        currentFreq += 100;
    }, 150);

    setTimeout(async () => {
        clearInterval(audioInterval);
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
        state.lastWheelWinner = currentWinner;
        
        SoundEngine.success();
        
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
    }, 2000);
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
                <div class="text-4xl font-black text-emerald-600 tracking-tighter drop-shadow-sm">+$ ${reward.value.toLocaleString()}</div>
                <p class="text-gray-500 text-xs mt-3 italic font-medium">Sélectionnez le bénéficiaire de ce gain immédiat :</p>
            </div>
            <div class="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">${charsHtml}</div>
        `,
        confirmText: null
    });
};

const generateClaimCertificate = (reward) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    const verificationCode = Math.random().toString(36).substring(2, 12).toUpperCase();

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 800, 500);

    // Diagonal Watermark Pattern (Anti-falsification)
    ctx.save();
    ctx.rotate(-Math.PI / 6);
    ctx.font = 'black 14px Inter';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let x = -500; x < 1500; x += 150) {
        for (let y = -500; y < 1500; y += 80) {
            ctx.fillText('TFRP OFFICIAL CLAIM • ', x, y);
        }
    }
    ctx.restore();

    // Border
    ctx.strokeStyle = reward.color || '#3b82f6';
    ctx.lineWidth = 15;
    ctx.strokeRect(0, 0, 800, 500);

    // Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Inter';
    ctx.fillText('CERTIFICAT DE GAIN OFFICIEL', 50, 60);
    ctx.fillStyle = reward.color || '#3b82f6';
    ctx.font = 'black 12px Inter';
    ctx.fillText('TEAM FRENCH ROLEPLAY • PROTOCOLE v6.4', 50, 85);

    // Identity
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px Inter';
    ctx.fillText('IDENTITÉ DISCORD VÉRIFIÉE', 50, 150);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Inter';
    ctx.fillText(state.user.username.toUpperCase(), 50, 185);
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'mono 12px Courier';
    ctx.fillText('UID: ' + state.user.id, 50, 210);

    // Reward
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px Inter';
    ctx.fillText('LOT ATTRIBUÉ', 50, 280);
    ctx.fillStyle = reward.color || '#ffffff';
    ctx.font = 'italic black 48px Inter';
    ctx.fillText(reward.label.toUpperCase(), 50, 340);

    // Footer Info
    const dateStr = new Date().toLocaleString();
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10px Inter';
    ctx.fillText('GÉNÉRÉ LE : ' + dateStr, 50, 450);
    ctx.fillText('VALIDE UNIQUEMENT VIA TICKET SUPPORT DISCORD', 50, 465);

    // Verification Code (Unique)
    ctx.fillStyle = reward.color || '#ffffff';
    ctx.font = 'mono 10px Courier';
    ctx.fillText('AUTH_CODE: ' + verificationCode, 550, 465);

    // Download
    const link = document.createElement('a');
    link.download = `TFRP_CERTIFICATE_${verificationCode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    return verificationCode;
};

const showSecureScreenshotModal = (reward) => {
    let downloaded = false;
    
    ui.showModal({
        title: "LOT D'EXCEPTION DÉVÉROUILLÉ",
        isClosable: false,
        type: 'warning',
        content: `
            <div id="reward-certificate-box" class="text-center p-8 bg-[#0f172a] rounded-[40px] border border-white/5 relative overflow-hidden shadow-2xl">
                <div class="absolute -right-20 -top-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                
                <div class="mb-8">
                    <div class="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em] mb-2">Preuve de Gain Certifiée</div>
                    <div class="text-4xl font-black text-white italic tracking-tighter uppercase leading-none" style="color: ${reward.color}">${reward.label}</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left border-t border-b border-white/5 py-8 mb-8">
                    <div>
                        <div class="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Bénéficiaire</div>
                        <div class="text-sm font-bold text-white truncate">${state.user.username}</div>
                    </div>
                    <div>
                        <div class="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">UID Discord</div>
                        <div class="text-sm font-mono font-bold text-blue-400">${state.user.id}</div>
                    </div>
                </div>

                <div class="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl">
                    <p class="text-[10px] text-red-400 font-black uppercase leading-relaxed">
                        VERROUILLAGE SYSTÈME : <br>Téléchargez votre certificat pour débloquer la session.
                    </p>
                </div>
            </div>
            
            <div class="mt-8">
                <button id="download-btn-secure" onclick="actions.handleSecureDownload('${reward.label}')" class="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-3">
                    <i data-lucide="download" class="w-5 h-5"></i> TÉLÉCHARGER LE CERTIFICAT
                </button>
            </div>
        `,
        confirmText: "Fermer (Verrouillé)"
    });

    const confirmBtn = document.getElementById('modal-confirm');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.classList.add('opacity-30', 'cursor-not-allowed');
    }

    window.actions.handleSecureDownload = () => {
        generateClaimCertificate(reward);
        downloaded = true;
        ui.showToast("Certificat authentifié et téléchargé.", "success");
        
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('opacity-30', 'cursor-not-allowed');
            confirmBtn.classList.add('bg-emerald-600', 'text-white');
            confirmBtn.textContent = "SESSION TERMINÉE";
            confirmBtn.onclick = () => {
                ui.forceCloseModal();
                render();
            };
        }
    };
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
                description: 'Gain Loterie TFRP (Lootbox)' 
            });
            ui.showToast(`$${value.toLocaleString()} versés avec succès.`, "success");
        }
    } catch(e) { ui.showToast("Erreur versement.", "error"); }
    
    ui.forceCloseModal();
    render();
};

export const openWheel = () => { actions.setProfileTab('lootbox'); };
export const closeWheel = () => { actions.setProfileTab('identity'); };
export const showProbabilities = () => {
    const totalWeight = WHEEL_REWARDS.reduce((acc, r) => acc + r.weight, 0);
    const sorted = [...WHEEL_REWARDS].sort((a,b) => b.weight - a.weight);
    ui.showModal({ title: "Algorithme de Probabilités", content: `<div class="bg-gov-light rounded-[24px] border border-gray-200 overflow-hidden max-h-96 overflow-y-auto custom-scrollbar">${sorted.map(r => `<div class="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-white transition-colors"><div class="flex items-center gap-3"><div class="w-2 h-2 rounded-full" style="background: ${r.color}"></div><span class="text-[10px] font-black text-gov-text uppercase tracking-tight">${r.label}</span></div><span class="text-[10px] font-mono text-gov-blue font-bold">${((r.weight/totalWeight)*100).toFixed(1)}%</span></div>`).join('')}</div>` });
};
