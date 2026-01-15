
import { state } from '../state.js';

const refreshBanner = `
    <div class="flex flex-col md:flex-row items-center justify-between px-6 py-3 mb-6 bg-blue-50 border-y border-blue-100 gap-3 shrink-0">
        <div class="text-[10px] text-gov-blue flex items-center gap-2 font-black uppercase tracking-widest">
             <div class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-gov-blue"></span>
            </div>
            <span><span class="font-bold">Banque Nationale</span> • Connexion Gouvernementale Sécurisée</span>
        </div>
        <button onclick="actions.refreshCurrentView()" id="refresh-data-btn" class="text-[10px] font-black uppercase tracking-widest text-gov-blue/60 hover:text-gov-blue flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap">
            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Synchroniser les flux financiers
        </button>
    </div>
`;

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full"><div class="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mb-4"></div>Établissement du canal sécurisé...</div>';
    
    let content = '';

    // --- TAB: OVERVIEW ---
    if (state.activeBankTab === 'overview') {
        content = `
            <div class="space-y-8 animate-in pb-10">
                 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Premium Bank Card -->
                    <div class="relative group">
                        <div class="p-10 rounded-[40px] bg-gradient-to-br from-gov-blue via-blue-900 to-black relative overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                            <div class="flex justify-between items-start mb-12 relative z-10">
                                <div class="flex items-center gap-4">
                                    <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 shadow-inner">
                                        <i data-lucide="landmark" class="w-8 h-8"></i>
                                    </div>
                                    <div>
                                        <div class="text-[10px] font-black text-blue-200 uppercase tracking-[0.3em] mb-1">Compte Courant National</div>
                                        <div class="text-sm font-bold text-white tracking-widest font-mono">**** **** **** ${state.activeCharacter.id.substring(0,4).toUpperCase()}</div>
                                    </div>
                                </div>
                                <div class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] text-emerald-400 font-black uppercase tracking-widest animate-pulse">Liaison Active</div>
                            </div>
                            <div class="mb-12 relative z-10">
                                <div class="text-[10px] text-blue-200/60 uppercase font-black tracking-widest mb-2">Solde Créditeur</div>
                                <div class="text-6xl font-mono font-black text-white tracking-tighter drop-shadow-2xl">$ ${state.bankAccount.bank_balance.toLocaleString()}</div>
                            </div>
                            <div class="flex justify-between items-end relative z-10">
                                <div>
                                    <div class="text-[9px] text-blue-200/40 uppercase font-bold tracking-widest mb-1">Titulaire Certifié</div>
                                    <div class="text-base font-black text-white uppercase italic tracking-tight">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                                </div>
                                <div class="flex flex-col items-end">
                                     <div class="w-12 h-8 bg-yellow-500/90 rounded-md mb-2 shadow-lg relative overflow-hidden">
                                        <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                     </div>
                                     <div class="text-[8px] text-white/40 font-black uppercase tracking-widest italic">TFRP PLATINUM PRIVILEGE</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cash Visual Card -->
                    <div class="relative group">
                        <div class="p-10 rounded-[40px] bg-white border border-gray-100 relative overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1">
                            <div class="absolute top-0 right-0 w-48 h-48 bg-gov-light rounded-full blur-[60px] -mr-10 -mt-10"></div>
                            <div class="flex justify-between items-start mb-12 relative z-10">
                                <div class="flex items-center gap-4">
                                    <div class="w-14 h-14 rounded-2xl bg-gov-light flex items-center justify-center text-gov-text border border-gray-100 shadow-sm">
                                        <i data-lucide="wallet" class="w-8 h-8"></i>
                                    </div>
                                    <div>
                                        <div class="text-[10px] text-gray-400 uppercase font-black tracking-[0.3em] mb-1">Fonds de Poche</div>
                                        <div class="text-sm font-bold text-gov-text tracking-widest">ESPÈCES PHYSIQUES</div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-12 relative z-10">
                                <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Cash Liquide</div>
                                <div class="text-6xl font-mono font-black text-gov-text tracking-tighter">$ ${state.bankAccount.cash_balance.toLocaleString()}</div>
                            </div>
                            <div class="bg-orange-50 p-4 rounded-2xl border border-orange-100 relative z-10 flex items-center gap-3">
                                <i data-lucide="shield-alert" class="w-5 h-5 text-orange-500"></i>
                                <div class="text-[10px] text-orange-800 font-bold uppercase leading-relaxed tracking-wide italic">
                                    "Avertissement : Les fonds liquides ne sont pas couverts par l'assurance de l'État."
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-lg">
                    <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                        <span class="flex-1 h-px bg-gray-100"></span>
                        GUICHET AUTOMATIQUE (ATM)
                        <span class="flex-1 h-px bg-gray-100"></span>
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-4">
                            <div class="flex items-center gap-3 text-emerald-600">
                                <i data-lucide="arrow-down-to-line" class="w-5 h-5"></i>
                                <span class="text-xs font-black uppercase tracking-widest italic">Dépôt sur compte</span>
                            </div>
                            <form onsubmit="actions.bankDeposit(event)" class="flex gap-3">
                                <div class="relative flex-1">
                                    <span class="absolute left-4 top-4 text-emerald-600 font-black text-lg">$</span>
                                    <input type="number" name="amount" placeholder="Somme à déposer..." min="1" max="${state.bankAccount.cash_balance}" class="w-full p-4 pl-10 rounded-2xl text-lg font-mono font-black bg-gov-light border border-gray-100 focus:border-emerald-500 outline-none transition-all" required>
                                </div>
                                <button type="submit" class="px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/10 transition-all">Valider</button>
                            </form>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-center gap-3 text-gov-red">
                                <i data-lucide="arrow-up-from-line" class="w-5 h-5"></i>
                                <span class="text-xs font-black uppercase tracking-widest italic">Retrait d'espèces</span>
                            </div>
                            <form onsubmit="actions.bankWithdraw(event)" class="flex gap-3">
                                <div class="relative flex-1">
                                    <span class="absolute left-4 top-4 text-gov-red font-black text-lg">$</span>
                                    <input type="number" name="amount" placeholder="Somme à retirer..." min="1" max="${state.bankAccount.bank_balance}" class="w-full p-4 pl-10 rounded-2xl text-lg font-mono font-black bg-gov-light border border-gray-100 focus:border-gov-red outline-none transition-all" required>
                                </div>
                                <button type="submit" class="px-8 rounded-2xl bg-gov-red hover:bg-black text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/10 transition-all">Valider</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB: SAVINGS ---
    else if (state.activeBankTab === 'savings') {
        const savingsBalance = state.bankAccount.savings_balance || 0;
        const weeklyEstimate = Math.floor(savingsBalance * (state.savingsRate / 100));

        content = `
            <div class="space-y-8 animate-in pb-10">
                <div class="p-10 rounded-[40px] bg-white border border-gray-100 shadow-2xl relative overflow-hidden">
                    <div class="absolute -right-20 -top-20 w-96 h-96 bg-blue-50 rounded-full blur-[100px] pointer-events-none"></div>
                    <div class="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                        <div class="text-center md:text-left">
                            <div class="inline-flex items-center gap-2 px-3 py-1 bg-gov-blue/10 text-gov-blue text-[10px] font-black uppercase tracking-[0.2em] border border-gov-blue/20 mb-4 rounded-lg">
                                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Épargne Garantie
                            </div>
                            <h3 class="text-4xl font-black text-gov-text italic uppercase tracking-tighter mb-2 leading-none">Livret de Placement</h3>
                            <p class="text-gray-400 text-sm font-medium">Capitaux productifs générant des dividendes hebdomadaires.</p>
                        </div>
                        <div class="bg-gov-light p-8 rounded-[32px] border border-gray-100 text-center min-w-[280px]">
                            <div class="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Capital Actuellement Placé</div>
                            <div class="text-5xl font-mono font-black text-gov-blue tracking-tighter">$ ${savingsBalance.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl">
                        <h4 class="text-xs font-black text-gov-text uppercase tracking-[0.2em] mb-8 flex items-center gap-3"><i data-lucide="plus-circle" class="w-5 h-5 text-gov-blue"></i> Alimenter l'épargne</h4>
                        <form onsubmit="actions.transferToSavings(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-5 top-4 text-gov-blue font-black text-lg">$</span>
                                <input type="number" name="amount" placeholder="Montant à placer..." min="1" max="${state.bankAccount.bank_balance}" class="w-full p-5 pl-12 rounded-2xl font-mono text-gov-text text-xl font-black bg-gov-light border border-gray-100 focus:border-gov-blue outline-none transition-all" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-2xl bg-gov-blue hover:bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/10">RATIFIER LE PLACEMENT</button>
                        </form>
                    </div>
                    <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl">
                        <h4 class="text-xs font-black text-gov-text uppercase tracking-[0.2em] mb-8 flex items-center gap-3"><i data-lucide="minus-circle" class="w-5 h-5 text-gov-red"></i> Liquidation d'épargne</h4>
                        <form onsubmit="actions.withdrawFromSavings(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-5 top-4 text-gov-red font-black text-lg">$</span>
                                <input type="number" name="amount" placeholder="Montant à débloquer..." min="1" max="${savingsBalance}" class="w-full p-5 pl-12 rounded-2xl font-mono text-gov-text text-xl font-black bg-gov-light border border-gray-100 focus:border-gov-red outline-none transition-all" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-2xl bg-white border-2 border-gray-100 text-gray-400 hover:text-gov-red hover:border-gov-red font-black text-[10px] uppercase tracking-[0.3em] transition-all">RETOUR AU COMPTE COURANT</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB: OPERATIONS (TRANSFER) ---
    else if (state.activeBankTab === 'operations') {
        content = `
             <div class="flex items-center justify-center h-full animate-in pb-20">
                 <div class="p-12 rounded-[48px] w-full max-w-2xl border border-gray-100 bg-white shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gov-blue to-blue-500"></div>
                    <div class="text-center mb-10">
                        <div class="w-20 h-20 bg-gov-light rounded-3xl flex items-center justify-center text-gov-blue mx-auto mb-6 shadow-sm">
                            <i data-lucide="send" class="w-10 h-10"></i>
                        </div>
                        <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter">Virement de Fonds</h3>
                        <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Protocole de transfert certifié inter-citoyens</p>
                    </div>
                    <form onsubmit="actions.bankTransfer(event)" class="space-y-8" autocomplete="off">
                        <div class="relative">
                            <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Identité du Bénéficiaire</label>
                            <input type="hidden" name="target_id" value="${state.selectedRecipient ? state.selectedRecipient.id : ''}" required>
                            <div class="relative group">
                                <i data-lucide="search" class="w-5 h-5 absolute left-4 top-4 text-gray-300 group-focus-within:text-gov-blue transition-colors"></i>
                                <input type="text" id="recipient_search" placeholder="Commencez à saisir un nom..." value="${state.selectedRecipient ? state.selectedRecipient.name : ''}" oninput="actions.searchRecipients(this.value)" class="w-full p-4 pl-12 rounded-2xl text-sm bg-gov-light border border-gray-100 focus:border-gov-blue outline-none transition-all ${state.selectedRecipient ? 'text-gov-blue font-black border-gov-blue/50 bg-blue-50 uppercase italic' : ''}" autocomplete="off" ${state.selectedRecipient ? 'readonly' : ''}>
                                ${state.selectedRecipient ? `<button type="button" onclick="actions.clearRecipient()" class="absolute right-4 top-4 text-gray-400 hover:text-gov-red"><i data-lucide="x" class="w-5 h-5"></i></button>` : ''}
                            </div>
                            <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-2xl mt-2 max-h-48 overflow-y-auto shadow-2xl custom-scrollbar hidden z-50 animate-in"></div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Montant ($)</label>
                                <div class="relative">
                                    <span class="absolute left-5 top-4 text-gov-blue font-black text-xl">$</span>
                                    <input type="number" name="amount" placeholder="0.00" min="1" max="${state.bankAccount.bank_balance}" class="w-full p-4 pl-12 rounded-2xl font-mono text-xl font-black bg-gov-light border border-gray-100 focus:border-gov-blue outline-none" required>
                                </div>
                            </div>
                            <div>
                                <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Libellé de l'opération</label>
                                <input type="text" name="description" placeholder="Ex: Honoraires..." maxlength="50" class="w-full p-4 rounded-2xl text-sm bg-gov-light border border-gray-100 focus:border-gov-blue outline-none italic">
                            </div>
                        </div>
                        <button type="submit" class="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] bg-gov-blue hover:bg-black text-white shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 mt-4 transform active:scale-95 transition-all">
                            DÉLIVRER LES FONDS <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </form>
                 </div>
             </div>
        `;
    }

    // --- TAB: HISTORY ---
    else if (state.activeBankTab === 'history') {
        const historyHtml = state.transactions.length > 0 
        ? state.transactions.map(t => {
            let icon, color, label, sign, bgIcon, borderColor;
            if (t.type === 'deposit') {
                icon = 'arrow-down-left'; color = 'text-emerald-600'; label = 'Crédit (Guichet)'; sign = '+'; bgIcon = 'bg-emerald-50 text-emerald-600'; borderColor='border-emerald-100';
            } else if (t.type === 'withdraw') {
                icon = 'arrow-up-right'; color = 'text-gray-500'; label = 'Débit (ATM)'; sign = '-'; bgIcon = 'bg-gov-light text-gray-500'; borderColor='border-gray-100';
            } else if (t.type === 'transfer') {
                if (t.receiver_id === state.activeCharacter.id) {
                    icon = 'download'; color = 'text-blue-600'; label = 'Virement Reçu'; sign = '+'; bgIcon = 'bg-blue-50 text-blue-600'; borderColor='border-blue-100';
                } else {
                    icon = 'upload'; color = 'text-gov-red'; label = 'Virement Émis'; sign = '-'; bgIcon = 'bg-red-50 text-gov-red'; borderColor='border-red-100';
                }
            } else if (t.type === 'admin_adjustment') {
                icon = 'shield-check'; label = 'Régularisation d\'État'; bgIcon = 'bg-purple-50 text-purple-600'; borderColor='border-purple-100';
                if (t.amount >= 0) { color = 'text-emerald-600'; sign = '+'; } else { color = 'text-gov-red'; sign = '-'; }
            }
            return `
                <div class="flex items-center justify-between p-6 bg-white rounded-3xl border ${borderColor} hover:shadow-xl transition-all group">
                    <div class="flex items-center gap-6">
                        <div class="w-14 h-14 rounded-2xl ${bgIcon} flex items-center justify-center border border-transparent shadow-sm group-hover:scale-110 transition-transform">
                            <i data-lucide="${icon}" class="w-7 h-7"></i>
                        </div>
                        <div>
                            <div class="font-black text-gov-text text-base uppercase italic tracking-tight mb-1">${label}</div>
                            <div class="text-[9px] text-gray-400 font-mono uppercase font-bold">${new Date(t.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-mono font-black text-2xl ${color} tracking-tighter">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                    </div>
                </div>
            `;
        }).join('') 
        : '<div class="text-center text-gray-400 py-32 flex flex-col items-center justify-center opacity-60"><i data-lucide="history" class="w-16 h-16 mb-4"></i><span class="text-xs font-black uppercase tracking-[0.4em]">Aucune archive monétaire</span></div>';

        content = `
            <div class="flex flex-col h-full animate-in max-w-5xl mx-auto pb-10">
                <div class="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-4 pb-12">
                    ${historyHtml}
                </div>
            </div>
        `;
    }

    return `
        <div class="h-full flex flex-col bg-[#F6F6F6] overflow-hidden animate-in">
            ${refreshBanner}
            <div class="px-8 pb-8 shrink-0 relative z-10">
                <h2 class="text-4xl font-black text-gov-text flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                    <i data-lucide="landmark" class="w-10 h-10 text-gov-blue"></i> Terminal Bancaire
                </h2>
                <p class="text-[10px] text-gov-blue font-black uppercase tracking-widest mt-2">Accès Gouvernemental Unifié — Section : ${state.activeBankTab.toUpperCase()}</p>
            </div>
            <div class="flex-1 p-8 overflow-y-auto custom-scrollbar relative min-h-0">
                <div class="max-w-7xl mx-auto h-full">
                    ${content}
                </div>
            </div>
        </div>
    `;
};
