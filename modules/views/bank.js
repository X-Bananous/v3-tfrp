
import { state } from '../state.js';

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full"><div class="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mb-4"></div>Établissement du canal sécurisé...</div>';
    
    const activeTab = state.activeBankTab || 'overview';
    
    const tabs = [
        { id: 'overview', label: 'Compte', icon: 'layout-grid' },
        { id: 'savings', label: 'Épargne', icon: 'piggy-bank' },
        { id: 'operations', label: 'Virement', icon: 'send' },
        { id: 'history', label: 'Historique', icon: 'scroll-text' }
    ];

    // --- RENDER SUB-NAVBAR ---
    const subNavbar = `
        <div class="bg-white border-b border-gray-100 px-4 md:px-10 py-3 sticky top-0 z-[40] shrink-0">
            <div class="max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
                ${tabs.map(t => `
                    <button onclick="actions.setBankTab('${t.id}')" 
                        class="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
                        ${activeTab === t.id ? 'bg-[#0f172a] text-white shadow-lg' : 'bg-gov-light text-gray-400 hover:text-gov-text hover:bg-gray-200'}">
                        <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i>
                        ${t.label}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    let content = '';

    // --- TAB: OVERVIEW ---
    if (activeTab === 'overview') {
        content = `
            <div class="space-y-8 animate-in pb-10">
                 <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-10">
                    <!-- Physical Card -->
                    <div class="relative group perspective-1000">
                        <div class="p-8 md:p-10 rounded-[35px] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#000000] relative overflow-hidden shadow-2xl border border-white/10 transition-transform duration-500 hover:scale-[1.01]">
                            <div class="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            
                            <div class="flex justify-between items-start mb-12 md:mb-16 relative z-10">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-9 md:w-14 md:h-11 rounded-lg bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 flex items-center justify-center border border-yellow-200/50">
                                        <div class="w-8 h-6 border border-black/10 rounded flex flex-col justify-between p-1">
                                            <div class="h-[1px] bg-black/20 w-full"></div>
                                            <div class="h-[1px] bg-black/20 w-full"></div>
                                        </div>
                                    </div>
                                    <div class="hidden sm:block">
                                        <div class="text-[8px] font-black text-blue-200 uppercase tracking-[0.4em] mb-1">PLATINUM WORLD ELITE</div>
                                        <div class="text-xs font-bold text-white tracking-[0.2em] font-mono">**** **** **** ${state.activeCharacter.id.substring(0,4).toUpperCase()}</div>
                                    </div>
                                </div>
                                <div class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                                    <i data-lucide="landmark" class="w-7 h-7 text-white opacity-40"></i>
                                </div>
                            </div>

                            <div class="mb-10 md:mb-12 relative z-10">
                                <div class="text-[9px] text-blue-200/50 uppercase font-black tracking-[0.3em] mb-2">Solde Courant</div>
                                <div class="text-4xl md:text-6xl font-mono font-black text-white tracking-tighter drop-shadow-2xl">$ ${state.bankAccount.bank_balance.toLocaleString()}</div>
                            </div>

                            <div class="flex justify-between items-end relative z-10">
                                <div>
                                    <div class="text-[7px] text-blue-200/40 uppercase font-bold tracking-widest mb-1">Titulaire</div>
                                    <div class="text-sm md:text-lg font-black text-white uppercase italic tracking-tight">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                                </div>
                                <div class="flex gap-1 mb-1">
                                    <div class="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-600/80 blur-[1px]"></div>
                                    <div class="w-6 h-6 md:w-8 md:h-8 rounded-full bg-orange-500/80 blur-[1px] -ml-3 md:-ml-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cash Balance -->
                    <div class="relative h-full">
                        <div class="p-8 md:p-10 rounded-[35px] bg-white border border-gray-100 relative overflow-hidden shadow-xl h-full flex flex-col justify-between">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-gov-light rounded-full blur-[70px] -mr-16 -mt-16"></div>
                            <div class="flex justify-between items-start relative z-10">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-2xl bg-gov-light flex items-center justify-center text-gov-text border border-gray-100">
                                        <i data-lucide="wallet" class="w-6 h-6"></i>
                                    </div>
                                    <div>
                                        <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Argent Liquide</h3>
                                        <p class="text-[9px] text-gray-500 font-bold uppercase">En main</p>
                                    </div>
                                </div>
                                <button onclick="actions.refreshCurrentView()" class="p-2.5 rounded-xl bg-gov-light text-gray-400 hover:text-gov-blue transition-all">
                                    <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                </button>
                            </div>

                            <div class="my-8 relative z-10">
                                <div class="text-4xl md:text-6xl font-mono font-black text-gov-text tracking-tighter">$ ${state.bankAccount.cash_balance.toLocaleString()}</div>
                            </div>

                            <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 relative z-10 flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shrink-0 shadow-sm"><i data-lucide="shield-check" class="w-4 h-4"></i></div>
                                <p class="text-[10px] text-emerald-800 font-bold uppercase tracking-tight">Fonds sécurisés par chiffrage local.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ATM Forms -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div class="bg-white p-8 md:p-10 rounded-[35px] border border-gray-100 shadow-xl relative group">
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><i data-lucide="arrow-down-circle" class="w-6 h-6"></i></div>
                            <h3 class="text-base font-black text-gov-text uppercase italic tracking-tighter">Dépôt Guichet</h3>
                        </div>
                        <form onsubmit="actions.bankDeposit(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">$</span>
                                <input type="number" name="amount" placeholder="0" min="1" max="${state.bankAccount.cash_balance}" class="w-full py-5 pl-12 pr-6 rounded-2xl text-2xl font-mono font-black bg-gov-light border-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" required>
                            </div>
                            <button type="submit" class="w-full py-4 rounded-2xl bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl">CONFIRMER DÉPÔT</button>
                        </form>
                    </div>

                    <div class="bg-white p-8 md:p-10 rounded-[35px] border border-gray-100 shadow-xl relative group">
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100"><i data-lucide="arrow-up-circle" class="w-6 h-6"></i></div>
                            <h3 class="text-base font-black text-gov-text uppercase italic tracking-tighter">Retrait ATM</h3>
                        </div>
                        <form onsubmit="actions.bankWithdraw(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-red-600 font-black text-xl">$</span>
                                <input type="number" name="amount" placeholder="0" min="1" max="${state.bankAccount.bank_balance}" class="w-full py-5 pl-12 pr-6 rounded-2xl text-2xl font-mono font-black bg-gov-light border-none focus:ring-2 focus:ring-red-500/20 outline-none transition-all" required>
                            </div>
                            <button type="submit" class="w-full py-4 rounded-2xl bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-600 transition-all shadow-xl">VALIDER RETRAIT</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB: SAVINGS ---
    else if (activeTab === 'savings') {
        const savingsBalance = state.bankAccount.savings_balance || 0;
        content = `
            <div class="max-w-5xl mx-auto space-y-8 animate-in pb-10">
                <div class="p-8 md:p-12 rounded-[40px] bg-[#020617] text-white shadow-2xl relative overflow-hidden border border-white/5">
                    <div class="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div class="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10 text-center md:text-left">
                        <div class="flex-1">
                            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border border-blue-500/20 mb-6">
                                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> PLACEMENT SÉCURISÉ
                            </div>
                            <h2 class="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">Livret<br><span class="text-emerald-400">Épargne.</span></h2>
                            <p class="text-gray-400 text-sm max-w-xs font-medium italic">Rendement de <span class="text-white font-bold">${state.savingsRate}%</span> par cycle.</p>
                        </div>
                        <div class="bg-white/5 backdrop-blur-xl p-8 rounded-[35px] border border-white/10 text-center min-w-[280px]">
                            <div class="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2">Capital Placé</div>
                            <div class="text-4xl md:text-5xl font-mono font-black text-emerald-400 tracking-tighter">$ ${savingsBalance.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div class="bg-white p-8 rounded-[35px] border border-gray-100 shadow-xl">
                        <h3 class="text-sm font-black text-gov-text uppercase italic tracking-widest mb-8 flex items-center gap-3"><i data-lucide="trending-up" class="w-5 h-5 text-blue-600"></i> Alimenter l'épargne</h3>
                        <form onsubmit="actions.transferToSavings(event)" class="space-y-6">
                            <input type="number" name="amount" placeholder="Montant..." min="1" max="${state.bankAccount.bank_balance}" class="w-full py-4 px-6 rounded-2xl text-xl font-mono font-black bg-gov-light border-none outline-none focus:ring-2 focus:ring-blue-500/20" required>
                            <button type="submit" class="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-lg">TRANSFÉRER</button>
                        </form>
                    </div>
                    <div class="bg-white p-8 rounded-[35px] border border-gray-100 shadow-xl">
                        <h3 class="text-sm font-black text-gov-text uppercase italic tracking-widest mb-8 flex items-center gap-3"><i data-lucide="trending-down" class="w-5 h-5 text-gray-400"></i> Liquidation</h3>
                        <form onsubmit="actions.withdrawFromSavings(event)" class="space-y-6">
                            <input type="number" name="amount" placeholder="Montant..." min="1" max="${savingsBalance}" class="w-full py-4 px-6 rounded-2xl text-xl font-mono font-black bg-gov-light border-none outline-none focus:ring-2 focus:ring-gray-300" required>
                            <button type="submit" class="w-full py-4 rounded-2xl bg-white border-2 border-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-black transition-all">DÉBLOQUER FONDS</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB: OPERATIONS ---
    else if (activeTab === 'operations') {
        content = `
            <div class="flex items-center justify-center min-h-full animate-in pb-10">
                <div class="p-8 md:p-12 rounded-[45px] w-full max-w-2xl border border-gray-100 bg-white shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-2 bg-[#0f172a]"></div>
                    <div class="text-center mb-10">
                        <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 mx-auto mb-6 shadow-inner"><i data-lucide="send" class="w-8 h-8"></i></div>
                        <h2 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter">Nouveau Virement</h2>
                        <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">Transfert inter-citoyen chiffré</p>
                    </div>
                    
                    <form onsubmit="actions.bankTransfer(event)" class="space-y-8" autocomplete="off">
                        <div class="relative">
                            <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Cible du transfert</label>
                            <input type="hidden" name="target_id" value="${state.selectedRecipient ? state.selectedRecipient.id : ''}" required>
                            <div class="relative group">
                                <i data-lucide="user" class="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors"></i>
                                <input type="text" id="recipient_search" placeholder="Rechercher citoyen..." value="${state.selectedRecipient ? state.selectedRecipient.name : ''}" oninput="actions.searchRecipients(this.value)" class="w-full py-5 pl-14 pr-6 rounded-2xl text-sm font-bold bg-gov-light border-none outline-none focus:ring-4 focus:ring-blue-600/5 transition-all ${state.selectedRecipient ? 'text-blue-700 uppercase' : ''}" ${state.selectedRecipient ? 'readonly' : ''}>
                                ${state.selectedRecipient ? `<button type="button" onclick="actions.clearRecipient()" class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><i data-lucide="x-circle" class="w-5 h-5"></i></button>` : ''}
                            </div>
                            <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-3xl mt-2 max-h-52 overflow-y-auto shadow-2xl custom-scrollbar hidden z-50"></div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1">Montant ($)</label>
                                <input type="number" name="amount" placeholder="0" min="1" max="${state.bankAccount.bank_balance}" class="w-full py-5 px-6 rounded-2xl font-mono text-xl font-black bg-gov-light border-none outline-none focus:ring-4 focus:ring-blue-600/5" required>
                            </div>
                            <div class="space-y-2">
                                <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1">Référence</label>
                                <input type="text" name="description" placeholder="Ex: Services..." maxlength="50" class="w-full py-5 px-6 rounded-2xl text-sm italic font-medium bg-gov-light border-none outline-none focus:ring-4 focus:ring-blue-600/5">
                            </div>
                        </div>

                        <button type="submit" class="w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] bg-[#0f172a] hover:bg-blue-600 text-white shadow-xl transition-all transform active:scale-[0.98]">EXÉCUTER LE TRANSFERT</button>
                    </form>
                </div>
            </div>
        `;
    }

    // --- TAB: HISTORY ---
    else if (activeTab === 'history') {
        const historyHtml = state.transactions.length > 0 
        ? state.transactions.map(t => {
            let icon, color, label, sign, bgIcon;
            if (t.type === 'deposit') { icon = 'plus'; color = 'text-emerald-500'; label = 'Crédit Cash'; sign = '+'; bgIcon = 'bg-emerald-50 text-emerald-600'; }
            else if (t.type === 'withdraw') { icon = 'minus'; color = 'text-gray-400'; label = 'Débit Cash'; sign = '-'; bgIcon = 'bg-gray-50 text-gray-400'; }
            else if (t.type === 'transfer') {
                if (t.receiver_id === state.activeCharacter.id) { icon = 'download'; color = 'text-blue-500'; label = 'Reçu'; sign = '+'; bgIcon = 'bg-blue-50 text-blue-600'; }
                else { icon = 'upload'; color = 'text-red-500'; label = 'Envoyé'; sign = '-'; bgIcon = 'bg-red-50 text-red-600'; }
            } else { icon = 'shield-check'; label = 'Ajustement'; color = t.amount >= 0 ? 'text-emerald-500' : 'text-red-500'; sign = t.amount >= 0 ? '+' : '-'; bgIcon = 'bg-purple-50 text-purple-600'; }

            return `
                <div class="flex items-center justify-between p-5 bg-white rounded-[28px] border border-gray-100 hover:shadow-lg transition-all group border-l-8 ${t.amount < 0 || (t.type === 'transfer' && t.sender_id === state.activeCharacter.id) ? 'border-l-red-500/30' : 'border-l-emerald-500/30'}">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl ${bgIcon} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform"><i data-lucide="${icon}" class="w-6 h-6"></i></div>
                        <div>
                            <div class="font-black text-gov-text text-base uppercase italic tracking-tight mb-0.5">${label}</div>
                            <div class="text-[9px] text-gray-400 font-mono uppercase font-bold tracking-widest">${new Date(t.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-mono font-black text-xl md:text-2xl ${color} tracking-tighter">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                        <div class="text-[8px] text-gray-400 uppercase font-black tracking-widest mt-1 italic">${t.description || 'Transaction'}</div>
                    </div>
                </div>
            `;
        }).join('') 
        : '<div class="text-center text-gray-400 py-32 flex flex-col items-center justify-center opacity-30"><i data-lucide="history" class="w-16 h-16 mb-4"></i><span class="text-xs font-black uppercase tracking-[0.4em]">Aucune transaction</span></div>';

        content = `
            <div class="max-w-4xl mx-auto space-y-6 animate-in pb-10">
                <div class="text-center mb-8">
                    <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter">Relevé de Compte</h3>
                    <p class="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mt-1">Audit certifié des flux monétaires</p>
                </div>
                <div class="space-y-4">
                    ${historyHtml}
                </div>
            </div>
        `;
    }

    return `
        <div class="h-full flex flex-col bg-[#F8FAFC] overflow-hidden animate-fade-in">
            <!-- Header -->
            <div class="px-6 md:px-10 pt-8 pb-4 shrink-0 flex flex-col md:flex-row justify-between items-end gap-6 bg-white">
                <div>
                    <div class="flex items-center gap-2 mb-1.5">
                        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span class="text-[9px] text-emerald-600 font-black uppercase tracking-[0.3em]">Canal Financier Sécurisé</span>
                    </div>
                    <h2 class="text-3xl md:text-4xl font-black text-gov-text flex items-center gap-3 uppercase italic tracking-tighter leading-none">
                        <i data-lucide="landmark" class="w-9 h-9 text-[#0f172a]"></i> Portefeuille
                    </h2>
                </div>
                <div class="text-right hidden sm:block">
                    <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest">Patrimoine Bancaire Global</div>
                    <div class="text-2xl font-mono font-black text-gov-text">$ ${(state.bankAccount.bank_balance + (state.bankAccount.savings_balance || 0)).toLocaleString()}</div>
                </div>
            </div>

            ${subNavbar}

            <div class="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
                <div class="max-w-7xl mx-auto h-full">
                    ${content}
                </div>
            </div>
            
            <!-- Mobile Bottom Bar Summary (Optional context) -->
            <div class="md:hidden bg-white border-t border-gray-100 p-4 flex justify-between items-center shrink-0">
                <div>
                    <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest">Liquidité en main</div>
                    <div class="text-lg font-mono font-black text-gov-text">$ ${state.bankAccount.cash_balance.toLocaleString()}</div>
                </div>
                <i data-lucide="shield-check" class="w-5 h-5 text-emerald-500 opacity-50"></i>
            </div>
        </div>
    `;
};
