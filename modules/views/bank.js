
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

    // --- SUB-NAVBAR (RESPONSIVE & SCROLLABLE ON MOBILE) ---
    const subNavbar = `
        <div class="bg-white border-b border-gray-100 px-6 md:px-10 py-3 sticky top-0 z-[40] shrink-0 overflow-x-auto no-scrollbar">
            <div class="max-w-7xl mx-auto flex gap-2">
                ${tabs.map(t => `
                    <button onclick="actions.setBankTab('${t.id}')" 
                        class="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
                        ${activeTab === t.id ? 'bg-[#0f172a] text-white shadow-xl shadow-blue-900/20' : 'bg-gray-100 text-gray-400 hover:text-gov-text hover:bg-gray-200'}">
                        <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i>
                        ${t.label}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    let content = '';

    // --- TAB: OVERVIEW (Le Dashboard) ---
    if (activeTab === 'overview') {
        content = `
            <div class="space-y-10 animate-in pb-10">
                 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <!-- THE CARD: TFRP BLACK EDITION -->
                    <div class="relative group">
                        <div class="p-8 md:p-10 rounded-[40px] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black relative overflow-hidden shadow-2xl border border-white/5">
                            <!-- Card Decoration -->
                            <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                            <div class="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] -ml-10 -mb-10"></div>
                            
                            <div class="flex justify-between items-start mb-16 relative z-10">
                                <div class="flex items-center gap-4">
                                    <div class="w-14 h-10 rounded-lg bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 flex flex-col justify-between p-1.5 shadow-inner border border-yellow-100/30">
                                        <div class="h-[1px] bg-black/20 w-full"></div>
                                        <div class="h-[1px] bg-black/20 w-full"></div>
                                        <div class="h-[1px] bg-black/20 w-full"></div>
                                    </div>
                                    <div class="text-[9px] font-black text-blue-200 uppercase tracking-[0.4em]">Black Edition • World Elite</div>
                                </div>
                                <i data-lucide="landmark" class="w-8 h-8 text-white/20"></i>
                            </div>

                            <div class="mb-12 relative z-10">
                                <div class="text-[10px] text-blue-200/40 uppercase font-black tracking-widest mb-3">Balance disponible</div>
                                <div class="text-5xl md:text-7xl font-mono font-black text-white tracking-tighter drop-shadow-2xl italic">$ ${state.bankAccount.bank_balance.toLocaleString()}</div>
                            </div>

                            <div class="flex justify-between items-end relative z-10">
                                <div>
                                    <div class="text-[8px] text-blue-200/30 uppercase font-bold tracking-widest mb-1">Titulaire de compte</div>
                                    <div class="text-base font-black text-white uppercase italic tracking-tight">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                                </div>
                                <div class="flex gap-1.5 opacity-60">
                                    <div class="w-8 h-8 rounded-full bg-red-600 blur-[0.5px]"></div>
                                    <div class="w-8 h-8 rounded-full bg-orange-500 blur-[0.5px] -ml-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- CASH PANEL: MINIMALIST -->
                    <div class="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                        <div class="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <i data-lucide="wallet" class="w-40 h-40 text-black"></i>
                        </div>
                        <div class="flex justify-between items-start relative z-10">
                            <div>
                                <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Liquidités Physiques</h3>
                                <p class="text-[10px] text-gray-500 font-bold uppercase">Argent en main</p>
                            </div>
                            <button onclick="actions.refreshCurrentView()" class="p-3 bg-gray-50 text-gray-400 hover:text-gov-blue hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-gray-100">
                                <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                            </button>
                        </div>

                        <div class="my-10 relative z-10">
                            <div class="text-5xl md:text-7xl font-mono font-black text-gov-text tracking-tighter">$ ${state.bankAccount.cash_balance.toLocaleString()}</div>
                        </div>

                        <div class="bg-orange-50 p-5 rounded-3xl border border-orange-100 flex items-center gap-4 relative z-10">
                            <div class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                                <i data-lucide="shield-off" class="w-5 h-5"></i>
                            </div>
                            <p class="text-[11px] text-orange-800 font-medium italic leading-relaxed">Attention : Ces fonds ne sont pas traçables par les services fiscaux de l'État.</p>
                        </div>
                    </div>
                 </div>

                 <!-- ATM ACTIONS GRID -->
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- DEPOSIT CARD -->
                    <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl group hover:border-emerald-500/30 transition-all">
                        <div class="flex items-center gap-5 mb-10">
                            <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-inner group-hover:scale-110 transition-transform">
                                <i data-lucide="arrow-down-to-line" class="w-7 h-7"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-black text-gov-text uppercase italic tracking-tighter">Approvisionner</h3>
                                <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Dépôt d'espèces immédiat</p>
                            </div>
                        </div>
                        <form onsubmit="actions.bankDeposit(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-2xl">$</span>
                                <input type="number" name="amount" placeholder="0" min="1" max="${state.bankAccount.cash_balance}" class="w-full py-6 pl-14 pr-8 rounded-3xl text-3xl font-mono font-black bg-gray-50 border-none focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-3xl bg-[#0f172a] text-white font-black text-[11px] uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all shadow-xl shadow-gray-900/10">CONFIRMER DÉPÔT</button>
                        </form>
                    </div>

                    <!-- WITHDRAW CARD -->
                    <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl group hover:border-red-500/30 transition-all">
                        <div class="flex items-center gap-5 mb-10">
                            <div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shadow-inner group-hover:scale-110 transition-transform">
                                <i data-lucide="arrow-up-from-line" class="w-7 h-7"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-black text-gov-text uppercase italic tracking-tighter">Retrait Express</h3>
                                <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Obtenir du liquide (ATM)</p>
                            </div>
                        </div>
                        <form onsubmit="actions.bankWithdraw(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-red-600 font-black text-2xl">$</span>
                                <input type="number" name="amount" placeholder="0" min="1" max="${state.bankAccount.bank_balance}" class="w-full py-6 pl-14 pr-8 rounded-3xl text-3xl font-mono font-black bg-gray-50 border-none focus:ring-4 focus:ring-red-500/10 outline-none transition-all" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-3xl bg-[#0f172a] text-white font-black text-[11px] uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-xl shadow-gray-900/10">VALIDER RETRAIT</button>
                        </form>
                    </div>
                 </div>
            </div>
        `;
    }

    // --- TAB: SAVINGS (Épargne) ---
    else if (activeTab === 'savings') {
        const savingsBalance = state.bankAccount.savings_balance || 0;
        content = `
            <div class="max-w-5xl mx-auto space-y-8 animate-in pb-10">
                <div class="p-10 md:p-14 rounded-[50px] bg-[#020617] text-white shadow-2xl relative overflow-hidden border border-white/5">
                    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-32 -mt-32"></div>
                    <div class="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10 text-center md:text-left">
                        <div class="flex-1">
                            <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-blue-500/20 mb-8">
                                <i data-lucide="shield-check" class="w-4 h-4"></i> CAPITAL SÉCURISÉ
                            </div>
                            <h2 class="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 leading-tight">Gestion de<br><span class="text-emerald-400">Fortune.</span></h2>
                            <p class="text-gray-400 text-sm max-w-sm font-medium leading-relaxed italic">Rendement garanti de <span class="text-white font-black underline decoration-emerald-500 underline-offset-4">${state.savingsRate}%</span> par cycle hebdomadaire.</p>
                        </div>
                        <div class="bg-white/5 backdrop-blur-2xl p-12 rounded-[45px] border border-white/10 text-center min-w-[320px] shadow-2xl">
                            <div class="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3">Total Investi</div>
                            <div class="text-5xl md:text-6xl font-mono font-black text-emerald-400 tracking-tighter drop-shadow-xl">$ ${savingsBalance.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl group">
                        <h3 class="text-sm font-black text-gov-text uppercase italic tracking-widest mb-10 flex items-center gap-4">
                            <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><i data-lucide="trending-up" class="w-6 h-6"></i></div>
                            Alimenter l'Épargne
                        </h3>
                        <form onsubmit="actions.transferToSavings(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 font-black text-2xl">$</span>
                                <input type="number" name="amount" placeholder="Montant..." min="1" max="${state.bankAccount.bank_balance}" class="w-full py-6 pl-14 pr-8 rounded-3xl text-2xl font-mono font-black bg-gray-50 border-none outline-none focus:ring-4 focus:ring-blue-500/10" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-3xl bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">TRANSFÉRER LES FONDS</button>
                        </form>
                    </div>
                    <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl group">
                        <h3 class="text-sm font-black text-gov-text uppercase italic tracking-widest mb-10 flex items-center gap-4">
                            <div class="p-3 bg-gray-100 text-gray-400 rounded-2xl group-hover:scale-110 transition-transform"><i data-lucide="trending-down" class="w-6 h-6"></i></div>
                            Liquider Placement
                        </h3>
                        <form onsubmit="actions.withdrawFromSavings(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-2xl">$</span>
                                <input type="number" name="amount" placeholder="Débloquer..." min="1" max="${savingsBalance}" class="w-full py-6 pl-14 pr-8 rounded-3xl text-2xl font-mono font-black bg-gray-50 border-none outline-none focus:ring-4 focus:ring-gray-300/10" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-3xl bg-white border-2 border-gray-100 text-gray-400 font-black text-[11px] uppercase tracking-[0.3em] hover:text-black hover:border-black transition-all">RETOUR COMPTE COURANT</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB: OPERATIONS (Le Virement) ---
    else if (activeTab === 'operations') {
        content = `
            <div class="flex items-center justify-center min-h-full animate-in pb-10">
                <div class="p-10 md:p-16 rounded-[50px] w-full max-w-2xl border border-gray-100 bg-white shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-2 bg-[#0f172a]"></div>
                    
                    <div class="text-center mb-12">
                        <div class="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-700 mx-auto mb-8 shadow-inner">
                            <i data-lucide="send" class="w-10 h-10"></i>
                        </div>
                        <h2 class="text-4xl font-black text-gov-text uppercase italic tracking-tighter">Virement Bancaire</h2>
                        <p class="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-3">Protocole de transfert inter-citoyens chiffré</p>
                    </div>
                    
                    <form onsubmit="actions.bankTransfer(event)" class="space-y-10" autocomplete="off">
                        <div class="relative">
                            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-2 mb-3 block">Destinataire du transfert</label>
                            <input type="hidden" name="target_id" value="${state.selectedRecipient ? state.selectedRecipient.id : ''}" required>
                            <div class="relative group">
                                <i data-lucide="user" class="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors"></i>
                                <input type="text" id="recipient_search" placeholder="Rechercher citoyen par nom..." value="${state.selectedRecipient ? state.selectedRecipient.name : ''}" oninput="actions.searchRecipients(this.value)" class="w-full py-6 pl-16 pr-8 rounded-[24px] text-sm font-bold bg-gray-50 border-none outline-none focus:ring-4 focus:ring-blue-600/5 transition-all ${state.selectedRecipient ? 'text-blue-700 uppercase tracking-tight' : ''}" ${state.selectedRecipient ? 'readonly' : ''}>
                                ${state.selectedRecipient ? `<button type="button" onclick="actions.clearRecipient()" class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><i data-lucide="x-circle" class="w-6 h-6"></i></button>` : ''}
                            </div>
                            <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-[32px] mt-3 max-h-60 overflow-y-auto shadow-2xl custom-scrollbar hidden z-50 animate-in"></div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="space-y-3">
                                <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-2 block">Montant du virement ($)</label>
                                <input type="number" name="amount" placeholder="0" min="1" max="${state.bankAccount.bank_balance}" class="w-full py-6 px-8 rounded-[24px] font-mono text-3xl font-black bg-gray-50 border-none outline-none focus:ring-4 focus:ring-blue-600/5" required>
                            </div>
                            <div class="space-y-3">
                                <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-2 block">Motif / Libellé</label>
                                <input type="text" name="description" placeholder="Ex: Paiement facture..." maxlength="50" class="w-full py-6 px-8 rounded-[24px] text-sm italic font-medium bg-gray-50 border-none outline-none focus:ring-4 focus:ring-blue-600/5">
                            </div>
                        </div>

                        <button type="submit" class="w-full py-6 rounded-[24px] font-black text-sm uppercase tracking-[0.5em] bg-[#0f172a] hover:bg-blue-600 text-white shadow-2xl transition-all transform active:scale-[0.98]">EXÉCUTER LE TRANSFERT</button>
                    </form>
                </div>
            </div>
        `;
    }

    // --- TAB: HISTORY (Historique des transactions) ---
    else if (activeTab === 'history') {
        const historyHtml = state.transactions.length > 0 
        ? state.transactions.map(t => {
            let icon, color, label, sign, bgIcon;
            if (t.type === 'deposit') { icon = 'plus'; color = 'text-emerald-500'; label = 'Crédit Cash'; sign = '+'; bgIcon = 'bg-emerald-50 text-emerald-600'; }
            else if (t.type === 'withdraw') { icon = 'minus'; color = 'text-gray-400'; label = 'Débit Cash'; sign = '-'; bgIcon = 'bg-gray-100 text-gray-400'; }
            else if (t.type === 'transfer') {
                if (t.receiver_id === state.activeCharacter.id) { icon = 'arrow-down-left'; color = 'text-blue-500'; label = 'Virement Reçu'; sign = '+'; bgIcon = 'bg-blue-50 text-blue-600'; }
                else { icon = 'arrow-up-right'; color = 'text-red-500'; label = 'Virement Envoyé'; sign = '-'; bgIcon = 'bg-red-50 text-red-600'; }
            } else { icon = 'shield-check'; label = 'Régularisation'; color = t.amount >= 0 ? 'text-emerald-500' : 'text-red-500'; sign = t.amount >= 0 ? '+' : '-'; bgIcon = 'bg-purple-50 text-purple-600'; }

            return `
                <div class="flex items-center justify-between p-6 bg-white rounded-[35px] border border-gray-100 hover:shadow-xl transition-all group border-l-8 ${t.amount < 0 || (t.type === 'transfer' && t.sender_id === state.activeCharacter.id) ? 'border-l-red-500/20' : 'border-l-emerald-500/20'}">
                    <div class="flex items-center gap-6">
                        <div class="w-16 h-16 rounded-[24px] ${bgIcon} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform"><i data-lucide="${icon}" class="w-8 h-8"></i></div>
                        <div>
                            <div class="font-black text-gov-text text-xl uppercase italic tracking-tight mb-0.5">${label}</div>
                            <div class="text-[10px] text-gray-400 font-mono uppercase font-bold tracking-widest">${new Date(t.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-mono font-black text-2xl md:text-3xl ${color} tracking-tighter">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                        <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1 italic opacity-60">${t.description || 'Opération certifiée'}</div>
                    </div>
                </div>
            `;
        }).join('') 
        : '<div class="text-center text-gray-400 py-32 flex flex-col items-center justify-center opacity-30"><i data-lucide="history" class="w-16 h-16 mb-4"></i><span class="text-xs font-black uppercase tracking-[0.5em]">Aucun mouvement sur le compte</span></div>';

        content = `
            <div class="max-w-4xl mx-auto space-y-8 animate-in pb-10">
                <div class="text-center mb-10">
                    <h3 class="text-4xl font-black text-gov-text uppercase italic tracking-tighter">Relevé de Compte</h3>
                    <p class="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] mt-2">Archives sécurisées des flux monétaires</p>
                </div>
                <div class="space-y-4">
                    ${historyHtml}
                </div>
            </div>
        `;
    }

    return `
        <div class="h-full flex flex-col bg-[#F8FAFC] overflow-hidden animate-fade-in">
            <!-- Header Section -->
            <div class="px-8 md:px-12 pt-10 pb-6 shrink-0 flex flex-col md:flex-row justify-between items-end gap-6 bg-white">
                <div>
                    <div class="flex items-center gap-3 mb-2.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span class="text-[10px] text-emerald-600 font-black uppercase tracking-[0.4em]">Canal Financier Actif</span>
                    </div>
                    <h2 class="text-4xl md:text-5xl font-black text-gov-text flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                        <i data-lucide="landmark" class="w-10 h-10 text-[#0f172a]"></i> Portefeuille
                    </h2>
                </div>
                <div class="text-right hidden lg:block">
                    <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Patrimoine Bancaire Net</div>
                    <div class="text-3xl font-mono font-black text-gov-text tracking-tighter">$ ${(state.bankAccount.bank_balance + (state.bankAccount.savings_balance || 0)).toLocaleString()}</div>
                </div>
            </div>

            <!-- Sub Navbar (Scrollable Mobile Tab System) -->
            ${subNavbar}

            <!-- Main Content Area -->
            <div class="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar">
                <div class="max-w-7xl mx-auto h-full">
                    ${content}
                </div>
            </div>
            
            <!-- Mobile Bottom Summary (Visual Only) -->
            <div class="md:hidden bg-white border-t border-gray-100 p-5 flex justify-between items-center shrink-0">
                <div>
                    <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Cash en main</div>
                    <div class="text-2xl font-mono font-black text-gov-text">$ ${state.bankAccount.cash_balance.toLocaleString()}</div>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-gov-light flex items-center justify-center text-emerald-600 shadow-inner">
                    <i data-lucide="shield-check" class="w-6 h-6"></i>
                </div>
            </div>
        </div>
    `;
};
