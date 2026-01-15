
import { state } from '../state.js';

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full"><div class="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mb-4"></div>Établissement du canal sécurisé...</div>';
    
    const bankBalance = state.bankAccount.bank_balance || 0;
    const cashBalance = state.bankAccount.cash_balance || 0;
    const savingsBalance = state.bankAccount.savings_balance || 0;

    const historyHtml = state.transactions.length > 0 
        ? state.transactions.map(t => {
            let icon, color, label, sign, bgIcon;
            if (t.type === 'deposit') { icon = 'plus'; color = 'text-emerald-500'; label = 'Crédit Cash'; sign = '+'; bgIcon = 'bg-emerald-50 text-emerald-600'; }
            else if (t.type === 'withdraw') { icon = 'minus'; color = 'text-gray-400'; label = 'Débit Cash'; sign = '-'; bgIcon = 'bg-gray-100 text-gray-400'; }
            else if (t.type === 'transfer') {
                if (t.receiver_id === state.activeCharacter.id) { icon = 'arrow-down-left'; color = 'text-blue-500'; label = 'Reçu'; sign = '+'; bgIcon = 'bg-blue-50 text-blue-600'; }
                else { icon = 'arrow-up-right'; color = 'text-red-500'; label = 'Envoyé'; sign = '-'; bgIcon = 'bg-red-50 text-red-600'; }
            } else { icon = 'shield-check'; label = 'Ajustement'; color = t.amount >= 0 ? 'text-emerald-500' : 'text-red-500'; sign = t.amount >= 0 ? '+' : '-'; bgIcon = 'bg-purple-50 text-purple-600'; }

            return `
                <div class="flex items-center justify-between p-5 bg-white rounded-[24px] border border-gray-100 hover:shadow-lg transition-all group">
                    <div class="flex items-center gap-4">
                        <div class="w-11 h-11 rounded-xl ${bgIcon} flex items-center justify-center shadow-inner"><i data-lucide="${icon}" class="w-5 h-5"></i></div>
                        <div>
                            <div class="font-black text-gov-text text-sm uppercase italic tracking-tight">${label}</div>
                            <div class="text-[8px] text-gray-400 font-mono uppercase">${new Date(t.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-mono font-black text-lg ${color}">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                    </div>
                </div>
            `;
        }).join('') 
        : '<p class="text-center text-gray-400 py-10 text-[10px] uppercase font-black tracking-widest">Aucune activité récente</p>';

    return `
        <div class="h-full flex flex-col bg-[#F8FAFC] overflow-hidden animate-fade-in">
            <!-- Header Section -->
            <div class="px-6 md:px-12 pt-8 pb-6 shrink-0 flex flex-col md:flex-row justify-between items-end gap-6 bg-white border-b border-gray-100">
                <div>
                    <div class="flex items-center gap-2 mb-1.5">
                        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span class="text-[9px] text-emerald-600 font-black uppercase tracking-[0.3em]">Session Bancaire Sécurisée</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-black text-gov-text flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                        Wealth Terminal
                    </h2>
                </div>
                <div class="text-right hidden lg:block">
                    <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Patrimoine Global Consolidé</div>
                    <div class="text-3xl font-mono font-black text-gov-text tracking-tighter italic">$ ${(bankBalance + savingsBalance).toLocaleString()}</div>
                </div>
            </div>

            <!-- Scrollable Content Area (Everything in one view) -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div class="max-w-7xl mx-auto space-y-12 pb-24">
                    
                    <!-- Section 1: Main Balance & Physical Assets -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- THE METAL CARD -->
                        <div class="relative group">
                            <div class="p-10 rounded-[45px] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black relative overflow-hidden shadow-2xl border border-white/5 h-full min-h-[300px] flex flex-col justify-between">
                                <div class="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                                
                                <div class="flex justify-between items-start relative z-10">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-9 rounded-lg bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 border border-yellow-200/50 p-1 flex flex-col justify-between">
                                            <div class="h-px bg-black/20 w-full"></div><div class="h-px bg-black/20 w-full"></div>
                                        </div>
                                        <div class="text-[8px] font-black text-blue-200 uppercase tracking-[0.4em]">Platinum Elite Member</div>
                                    </div>
                                    <i data-lucide="landmark" class="w-8 h-8 text-white/10"></i>
                                </div>

                                <div class="relative z-10">
                                    <div class="text-[9px] text-blue-200/40 uppercase font-black tracking-widest mb-2">Compte Courant</div>
                                    <div class="text-5xl md:text-7xl font-mono font-black text-white tracking-tighter italic">$ ${bankBalance.toLocaleString()}</div>
                                </div>

                                <div class="flex justify-between items-end relative z-10">
                                    <div class="text-sm font-black text-white uppercase italic tracking-tight">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                                    <div class="text-[10px] font-mono text-white/30 uppercase tracking-widest">**** ${state.activeCharacter.id.substring(0,4)}</div>
                                </div>
                            </div>
                        </div>

                        <!-- CASH & QUICK ATM -->
                        <div class="bg-white p-10 rounded-[45px] border border-gray-100 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                            <div class="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Fonds Physiques</h3>
                                    <div class="text-5xl font-mono font-black text-gov-text tracking-tighter mt-2">$ ${cashBalance.toLocaleString()}</div>
                                </div>
                                <div class="w-14 h-14 rounded-3xl bg-gov-light flex items-center justify-center text-gov-text border border-gray-100 shadow-inner group-hover:scale-110 transition-transform">
                                    <i data-lucide="wallet" class="w-7 h-7"></i>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 relative z-10 pt-8 border-t border-gray-50">
                                <form onsubmit="actions.bankDeposit(event)" class="space-y-3">
                                    <div class="relative">
                                        <span class="absolute left-3 top-2.5 text-emerald-500 font-bold text-xs">$</span>
                                        <input type="number" name="amount" placeholder="Dépôt" class="w-full pl-6 pr-3 py-2 rounded-xl text-xs font-mono font-bold bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20" max="${cashBalance}">
                                    </div>
                                    <button type="submit" class="w-full py-3 rounded-xl bg-[#0f172a] text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">Verser au guichet</button>
                                </form>
                                <form onsubmit="actions.bankWithdraw(event)" class="space-y-3">
                                    <div class="relative">
                                        <span class="absolute left-3 top-2.5 text-red-500 font-bold text-xs">$</span>
                                        <input type="number" name="amount" placeholder="Retrait" class="w-full pl-6 pr-3 py-2 rounded-xl text-xs font-mono font-bold bg-gray-50 border-none focus:ring-2 focus:ring-red-500/20" max="${bankBalance}">
                                    </div>
                                    <button type="submit" class="w-full py-3 rounded-xl bg-[#0f172a] text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">Retirer (ATM)</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Transfers & Savings -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- TRANSFER MODULE -->
                        <div class="lg:col-span-2 bg-white p-10 rounded-[45px] border border-gray-100 shadow-xl relative overflow-hidden group">
                            <h3 class="text-sm font-black text-gov-text uppercase italic tracking-widest mb-8 flex items-center gap-3">
                                <i data-lucide="send" class="w-5 h-5 text-blue-600"></i> Nouveau Virement
                            </h3>
                            <form onsubmit="actions.bankTransfer(event)" class="grid grid-cols-1 md:grid-cols-2 gap-6" autocomplete="off">
                                <div class="relative">
                                    <input type="hidden" name="target_id" value="${state.selectedRecipient ? state.selectedRecipient.id : ''}" required>
                                    <input type="text" id="recipient_search" placeholder="Nom du destinataire..." value="${state.selectedRecipient ? state.selectedRecipient.name : ''}" oninput="actions.searchRecipients(this.value)" class="w-full p-4 rounded-2xl text-sm font-bold bg-gray-50 border-none focus:ring-4 focus:ring-blue-600/5 transition-all ${state.selectedRecipient ? 'text-blue-700 uppercase' : ''}" ${state.selectedRecipient ? 'readonly' : ''}>
                                    <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-2xl mt-2 max-h-40 overflow-y-auto shadow-2xl z-50 hidden"></div>
                                </div>
                                <div class="flex gap-2">
                                    <input type="number" name="amount" placeholder="Somme ($)" min="1" max="${bankBalance}" class="flex-1 p-4 rounded-2xl text-sm font-mono font-black bg-gray-50 border-none focus:ring-4 focus:ring-blue-600/5" required>
                                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-2xl shadow-xl shadow-blue-900/20 transition-all"><i data-lucide="arrow-right" class="w-5 h-5"></i></button>
                                </div>
                            </form>
                        </div>

                        <!-- SAVINGS WIDGET -->
                        <div class="bg-[#020617] p-8 rounded-[45px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
                            <div class="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                            <div class="flex justify-between items-center mb-6">
                                <div class="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Livret Épargne</div>
                                <span class="text-[9px] font-bold text-gray-500">Taux: ${state.savingsRate}%</span>
                            </div>
                            <div class="text-4xl font-mono font-black text-white tracking-tighter italic mb-8">$ ${savingsBalance.toLocaleString()}</div>
                            <div class="grid grid-cols-2 gap-2">
                                <button onclick="actions.setBankTab('savings')" class="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[9px] font-black uppercase tracking-widest transition-all">Gérer fonds</button>
                                <div class="flex items-center justify-center text-emerald-500"><i data-lucide="trending-up" class="w-4 h-4"></i></div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: History & Archive -->
                    <div class="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl">
                        <div class="flex justify-between items-center mb-10 pb-4 border-b border-gray-50">
                            <h3 class="text-sm font-black text-gov-text uppercase italic tracking-widest flex items-center gap-3">
                                <i data-lucide="scroll-text" class="w-5 h-5 text-gray-400"></i> Historique des flux
                            </h3>
                            <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Relevé de compte certifié</div>
                        </div>
                        <div class="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            ${historyHtml}
                        </div>
                    </div>

                </div>
            </div>
            
            <!-- Mobile Bottom Bar (Summary Only) -->
            <div class="lg:hidden bg-white border-t border-gray-100 p-6 flex justify-between items-center shrink-0">
                <div>
                    <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest">Cash Liquide</div>
                    <div class="text-xl font-mono font-black text-gov-text">$ ${cashBalance.toLocaleString()}</div>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600"><i data-lucide="shield-check" class="w-6 h-6"></i></div>
            </div>
        </div>
    `;
};
