
import { state } from '../state.js';

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full"><div class="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mb-4"></div>Synchronisation...</div>';
    
    let content = '';

    // --- TAB: OVERVIEW ---
    if (state.activeBankTab === 'overview') {
        content = `
            <div class="space-y-8 animate-in pb-10">
                <!-- Main Balance Display -->
                <div class="flex flex-col items-center justify-center py-12">
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Capital Total Net</div>
                    <div class="text-7xl font-mono font-black text-gov-text tracking-tighter mb-8">$ ${(state.bankAccount.bank_balance + state.bankAccount.cash_balance).toLocaleString()}</div>
                    <div class="flex gap-4">
                        <button onclick="actions.setBankTab('operations')" class="px-8 py-3 bg-gov-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-105 transition-all">Nouveau Virement</button>
                        <button onclick="actions.setBankTab('savings')" class="px-8 py-3 bg-white border border-gray-100 text-gov-text rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">Gérer l'Épargne</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Glass Bank Card -->
                    <div class="relative group h-64">
                        <div class="h-full p-10 rounded-[40px] bg-gradient-to-br from-indigo-950 via-blue-900 to-black relative overflow-hidden shadow-2xl transition-all duration-500">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                            <div class="flex justify-between items-start mb-12 relative z-10">
                                <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                    <i data-lucide="landmark" class="w-6 h-6 text-blue-200"></i>
                                </div>
                                <div class="text-[10px] font-black text-blue-200 uppercase tracking-widest">Compte National</div>
                            </div>
                            <div class="mb-10 relative z-10">
                                <div class="text-[9px] text-blue-200/60 uppercase font-black tracking-widest mb-1 italic">Solde Bancaire</div>
                                <div class="text-4xl font-mono font-black text-white tracking-tighter">$ ${state.bankAccount.bank_balance.toLocaleString()}</div>
                            </div>
                            <div class="flex justify-between items-end relative z-10">
                                <div class="text-xs font-mono text-white/50 tracking-widest">**** **** **** ${state.activeCharacter.id.substring(0,4).toUpperCase()}</div>
                                <div class="w-12 h-8 bg-yellow-500/80 rounded-md shadow-lg border border-yellow-400/50"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Cash Asset Card -->
                    <div class="h-64 p-10 rounded-[40px] bg-white border border-gray-100 relative overflow-hidden shadow-xl flex flex-col justify-between group">
                         <div class="flex justify-between items-start">
                            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <i data-lucide="wallet" class="w-6 h-6"></i>
                            </div>
                            <span class="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-full tracking-widest">Liquide</span>
                        </div>
                        <div>
                            <div class="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1 italic">Cash disponible</div>
                            <div class="text-4xl font-mono font-black text-gov-text tracking-tighter">$ ${state.bankAccount.cash_balance.toLocaleString()}</div>
                        </div>
                        <div class="flex items-center gap-2 text-orange-500">
                            <i data-lucide="shield-alert" class="w-4 h-4"></i>
                            <span class="text-[8px] font-black uppercase tracking-widest">Fonds non assurés</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions / ATM Integration -->
                <div class="bg-gray-50/50 p-10 rounded-[48px] border border-gray-100">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div class="space-y-6">
                            <div class="flex items-center gap-3 text-emerald-600">
                                <i data-lucide="arrow-down-to-line" class="w-5 h-5"></i>
                                <h4 class="text-xs font-black uppercase tracking-[0.2em]">Dépôt Rapide</h4>
                            </div>
                            <form onsubmit="actions.bankDeposit(event)" class="flex gap-3">
                                <div class="relative flex-1">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-lg">$</span>
                                    <input type="number" name="amount" placeholder="0" min="1" max="${state.bankAccount.cash_balance}" class="w-full h-14 pl-10 pr-4 rounded-2xl text-xl font-mono font-black bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all shadow-sm" required>
                                </div>
                                <button type="submit" class="h-14 px-8 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10">Valider</button>
                            </form>
                        </div>

                        <div class="space-y-6">
                            <div class="flex items-center gap-3 text-gov-red">
                                <i data-lucide="arrow-up-from-line" class="w-5 h-5"></i>
                                <h4 class="text-xs font-black uppercase tracking-[0.2em]">Retrait ATM</h4>
                            </div>
                            <form onsubmit="actions.bankWithdraw(event)" class="flex gap-3">
                                <div class="relative flex-1">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gov-red font-black text-lg">$</span>
                                    <input type="number" name="amount" placeholder="0" min="1" max="${state.bankAccount.bank_balance}" class="w-full h-14 pl-10 pr-4 rounded-2xl text-xl font-mono font-black bg-white border border-gray-100 focus:border-gov-red outline-none transition-all shadow-sm" required>
                                </div>
                                <button type="submit" class="h-14 px-8 rounded-2xl bg-gov-red text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-red-900/10">Valider</button>
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
        content = `
            <div class="max-w-4xl mx-auto space-y-8 animate-in py-10">
                <div class="p-12 rounded-[48px] bg-white border border-gray-100 shadow-xl relative overflow-hidden text-center">
                    <div class="absolute -right-20 -top-20 w-96 h-96 bg-blue-50 rounded-full blur-[100px] pointer-events-none"></div>
                    <div class="relative z-10">
                        <div class="w-20 h-20 bg-blue-50 text-gov-blue rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-100">
                            <i data-lucide="piggy-bank" class="w-10 h-10"></i>
                        </div>
                        <h3 class="text-4xl font-black text-gov-text italic uppercase tracking-tighter mb-2 leading-none">Livret de Placement</h3>
                        <p class="text-gray-400 text-sm font-medium mb-12">Rémunération hebdomadaire garantie à <span class="text-gov-blue font-bold">${state.savingsRate}%</span> par l'État.</p>
                        
                        <div class="text-[10px] text-gray-400 uppercase font-black tracking-[0.4em] mb-2">Capital Placé</div>
                        <div class="text-7xl font-mono font-black text-gov-blue tracking-tighter mb-12">$ ${savingsBalance.toLocaleString()}</div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                                <div class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Investissement</div>
                                <form onsubmit="actions.transferToSavings(event)" class="space-y-4">
                                    <input type="number" name="amount" placeholder="Montant" min="1" max="${state.bankAccount.bank_balance}" class="w-full h-14 px-6 rounded-2xl font-mono font-black text-center bg-white border border-gray-100 focus:border-gov-blue outline-none" required>
                                    <button type="submit" class="w-full h-14 bg-gov-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-black transition-all">Alimenter</button>
                                </form>
                            </div>
                            <div class="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                                <div class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Liquidation</div>
                                <form onsubmit="actions.withdrawFromSavings(event)" class="space-y-4">
                                    <input type="number" name="amount" placeholder="Montant" min="1" max="${savingsBalance}" class="w-full h-14 px-6 rounded-2xl font-mono font-black text-center bg-white border border-gray-100 focus:border-gov-red outline-none" required>
                                    <button type="submit" class="w-full h-14 bg-white border-2 border-gray-200 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-gov-red hover:border-gov-red transition-all">Récupérer</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB: OPERATIONS ---
    else if (state.activeBankTab === 'operations') {
        content = `
             <div class="flex items-center justify-center h-full animate-in py-10">
                 <div class="p-12 rounded-[48px] w-full max-w-2xl border border-gray-100 bg-white shadow-2xl relative overflow-hidden">
                    <div class="text-center mb-10">
                        <div class="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-gov-blue mx-auto mb-6 shadow-inner border border-gray-100">
                            <i data-lucide="send" class="w-10 h-10"></i>
                        </div>
                        <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter">Transfert Instantané</h3>
                        <p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Transaction sécurisée chiffrée</p>
                    </div>
                    <form onsubmit="actions.bankTransfer(event)" class="space-y-8" autocomplete="off">
                        <div class="relative">
                            <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Bénéficiaire</label>
                            <input type="hidden" name="target_id" value="${state.selectedRecipient ? state.selectedRecipient.id : ''}" required>
                            <div class="relative group">
                                <i data-lucide="search" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                <input type="text" id="recipient_search" placeholder="Rechercher par nom..." value="${state.selectedRecipient ? state.selectedRecipient.name : ''}" oninput="actions.searchRecipients(this.value)" class="w-full h-14 pl-12 pr-4 rounded-2xl text-sm bg-gray-50 border border-gray-100 focus:border-gov-blue outline-none transition-all ${state.selectedRecipient ? 'text-gov-blue font-black border-gov-blue/50 bg-blue-50 uppercase italic' : ''}" autocomplete="off" ${state.selectedRecipient ? 'readonly' : ''}>
                                ${state.selectedRecipient ? `<button type="button" onclick="actions.clearRecipient()" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gov-red"><i data-lucide="x" class="w-5 h-5"></i></button>` : ''}
                            </div>
                            <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-2xl mt-2 max-h-48 overflow-y-auto shadow-2xl z-50 hidden animate-in"></div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Somme ($)</label>
                                <div class="relative">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gov-blue font-black">$</span>
                                    <input type="number" name="amount" placeholder="0.00" min="1" max="${state.bankAccount.bank_balance}" class="w-full h-14 pl-10 rounded-2xl font-mono text-xl font-black bg-gray-50 border border-gray-100 focus:border-gov-blue outline-none" required>
                                </div>
                            </div>
                            <div>
                                <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Libellé</label>
                                <input type="text" name="description" placeholder="Ex: Salaire..." maxlength="50" class="w-full h-14 px-4 rounded-2xl text-sm bg-gray-50 border border-gray-100 focus:border-gov-blue outline-none italic">
                            </div>
                        </div>
                        <button type="submit" class="w-full h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] bg-gov-blue hover:bg-black text-white shadow-xl shadow-blue-900/20 flex items-center justify-center gap-4 transition-all transform active:scale-95">
                            TRANSMETTRE LES FONDS <i data-lucide="chevron-right" class="w-5 h-5"></i>
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
            let icon, color, label, sign, bgIcon;
            if (t.type === 'deposit') {
                icon = 'plus'; color = 'text-emerald-600'; label = 'Alimentation Compte'; sign = '+'; bgIcon = 'bg-emerald-50 text-emerald-600';
            } else if (t.type === 'withdraw') {
                icon = 'minus'; color = 'text-gray-400'; label = 'Retrait Espèces'; sign = '-'; bgIcon = 'bg-gray-50 text-gray-500';
            } else if (t.type === 'transfer') {
                if (t.receiver_id === state.activeCharacter.id) {
                    icon = 'arrow-down-left'; color = 'text-blue-600'; label = 'Virement Reçu'; sign = '+'; bgIcon = 'bg-blue-50 text-blue-600';
                } else {
                    icon = 'arrow-up-right'; color = 'text-gov-red'; label = 'Virement Émis'; sign = '-'; bgIcon = 'bg-red-50 text-gov-red';
                }
            } else if (t.type === 'admin_adjustment') {
                icon = 'shield'; label = 'Régularisation État'; bgIcon = 'bg-purple-50 text-purple-600';
                if (t.amount >= 0) { color = 'text-emerald-600'; sign = '+'; } else { color = 'text-gov-red'; sign = '-'; }
            }
            return `
                <div class="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-50 hover:border-gov-blue/20 transition-all group shadow-sm">
                    <div class="flex items-center gap-6">
                        <div class="w-14 h-14 rounded-2xl ${bgIcon} flex items-center justify-center border border-transparent shadow-sm group-hover:scale-110 transition-transform">
                            <i data-lucide="${icon}" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <div class="font-black text-gov-text text-base uppercase italic tracking-tight mb-0.5">${label}</div>
                            <div class="text-[9px] text-gray-400 font-mono uppercase font-bold">${new Date(t.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-mono font-black text-2xl ${color} tracking-tighter">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                        <div class="text-[9px] text-gray-300 font-bold uppercase truncate max-w-[150px]">${t.description || '---'}</div>
                    </div>
                </div>
            `;
        }).join('') 
        : '<div class="text-center text-gray-400 py-32 opacity-60 italic text-sm">Aucune activité enregistrée sur ce compte.</div>';

        content = `
            <div class="flex flex-col h-full animate-in max-w-5xl mx-auto pb-10">
                <div class="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-4 pb-12">
                    ${historyHtml}
                </div>
            </div>
        `;
    }

    const tabs = [
        { id: 'overview', label: 'Mon Compte', icon: 'layout-grid' },
        { id: 'savings', label: 'Placement', icon: 'piggy-bank' },
        { id: 'operations', label: 'Nouveau Virement', icon: 'send' },
        { id: 'history', label: 'Archives', icon: 'scroll-text' }
    ];

    return `
        <div class="h-full flex flex-col bg-[#FCFCFC] overflow-hidden animate-in">
            <div class="px-8 pt-8 pb-4 shrink-0 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-100 mb-4 bg-white">
                <h2 class="text-3xl font-black text-gov-text flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                    <i data-lucide="landmark" class="w-8 h-8 text-gov-blue"></i> Banque Nationale
                </h2>
                
                <div class="flex gap-1 p-1.5 bg-gray-100 rounded-[20px] w-fit">
                    ${tabs.map(t => `
                        <button onclick="actions.setBankTab('${t.id}')" class="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${state.activeBankTab === t.id ? 'bg-white text-gov-blue shadow-md' : 'text-gray-400 hover:text-gov-text'}">
                            ${t.label}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="flex-1 p-8 overflow-y-auto custom-scrollbar relative min-h-0">
                <div class="max-w-7xl mx-auto h-full">
                    ${content}
                </div>
            </div>
        </div>
    `;
};
