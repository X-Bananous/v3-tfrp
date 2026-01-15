
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
                if (t.receiver_id === state.activeCharacter.id) { icon = 'arrow-down-left'; color = 'text-blue-500'; label = 'Virement Reçu'; sign = '+'; bgIcon = 'bg-blue-50 text-blue-600'; }
                else { icon = 'arrow-up-right'; color = 'text-red-500'; label = 'Virement Envoyé'; sign = '-'; bgIcon = 'bg-red-50 text-red-600'; }
            } else { icon = 'shield-check'; label = 'Ajustement'; color = t.amount >= 0 ? 'text-emerald-500' : 'text-red-500'; sign = t.amount >= 0 ? '+' : '-'; bgIcon = 'bg-purple-50 text-purple-600'; }

            return `
                <div class="flex items-center justify-between p-5 bg-white rounded-[28px] border border-gray-100 hover:shadow-xl transition-all group">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl ${bgIcon} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform"><i data-lucide="${icon}" class="w-6 h-6"></i></div>
                        <div>
                            <div class="font-black text-gov-text text-sm uppercase italic tracking-tight">${label}</div>
                            <div class="text-[9px] text-gray-400 font-mono uppercase font-bold tracking-widest">${new Date(t.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-mono font-black text-lg ${color} tracking-tighter">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                        <div class="text-[8px] text-gray-400 uppercase font-black tracking-widest mt-0.5 opacity-60">${t.description || 'Transaction certifiée'}</div>
                    </div>
                </div>
            `;
        }).join('') 
        : '<div class="text-center text-gray-400 py-16 opacity-30 flex flex-col items-center"><i data-lucide="history" class="w-12 h-12 mb-4"></i><span class="text-[10px] font-black uppercase tracking-[0.4em]">Aucun mouvement récent</span></div>';

    return `
        <div class="h-full flex flex-col bg-[#F8FAFC] overflow-hidden animate-fade-in">
            <!-- HEADER : Richesse Consolidée -->
            <div class="px-6 md:px-12 pt-8 pb-6 shrink-0 flex flex-col md:flex-row justify-between items-end gap-6 bg-white border-b border-gray-100">
                <div>
                    <div class="flex items-center gap-2 mb-1.5">
                        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span class="text-[9px] text-emerald-600 font-black uppercase tracking-[0.4em]">Canal Financier Sécurisé</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-black text-gov-text flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                        Mon Patrimoine
                    </h2>
                </div>
                <div class="text-right">
                    <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Fortune Globale (Net)</div>
                    <div class="text-3xl font-mono font-black text-gov-text tracking-tighter italic">$ ${(bankBalance + savingsBalance + cashBalance).toLocaleString()}</div>
                </div>
            </div>

            <!-- DASHBOARD UNIQUE : Pas de sous-navbar, tout par scroll -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div class="max-w-7xl mx-auto space-y-16 pb-32">
                    
                    <!-- SECTION 1 : Comptes Courants & Carte -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <!-- THE METAL CARD VISUAL -->
                        <div class="relative group">
                            <div class="p-10 rounded-[50px] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black relative overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-between min-h-[320px]">
                                <div class="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                                <div class="flex justify-between items-start relative z-10">
                                    <div class="flex items-center gap-4">
                                        <div class="w-14 h-10 rounded-lg bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 border border-yellow-200/50 p-1.5 flex flex-col justify-between shadow-inner">
                                            <div class="h-px bg-black/20 w-full"></div><div class="h-px bg-black/20 w-full"></div><div class="h-px bg-black/20 w-full"></div>
                                        </div>
                                        <div class="text-[9px] font-black text-blue-200 uppercase tracking-[0.4em]">Platinum Elite Member</div>
                                    </div>
                                    <i data-lucide="landmark" class="w-10 h-10 text-white/10"></i>
                                </div>
                                <div class="relative z-10 my-8">
                                    <div class="text-[10px] text-blue-200/40 uppercase font-black tracking-[0.3em] mb-3">Compte Courant</div>
                                    <div class="text-5xl md:text-7xl font-mono font-black text-white tracking-tighter italic drop-shadow-2xl">$ ${bankBalance.toLocaleString()}</div>
                                </div>
                                <div class="flex justify-between items-end relative z-10">
                                    <div>
                                        <div class="text-[8px] text-blue-200/30 uppercase font-bold tracking-widest mb-1">Titulaire de compte</div>
                                        <div class="text-lg font-black text-white uppercase italic tracking-tight">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                                    </div>
                                    <div class="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">**** ${state.activeCharacter.id.substring(0,4)}</div>
                                </div>
                            </div>
                        </div>

                        <!-- QUICK ATM ACTIONS -->
                        <div class="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                            <div class="flex justify-between items-start mb-10 relative z-10">
                                <div>
                                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Liquidités Physiques</h3>
                                    <div class="text-5xl font-mono font-black text-gov-text tracking-tighter mt-2">$ ${cashBalance.toLocaleString()}</div>
                                </div>
                                <div class="w-16 h-16 rounded-[28px] bg-gov-light flex items-center justify-center text-gov-text border border-gray-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <i data-lucide="wallet" class="w-8 h-8"></i>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-6 relative z-10 pt-10 border-t border-gray-50">
                                <form onsubmit="actions.bankDeposit(event)" class="space-y-4">
                                    <div class="relative">
                                        <span class="absolute left-4 top-3 text-emerald-500 font-bold text-sm">$</span>
                                        <input type="number" name="amount" placeholder="Dépôt" class="w-full pl-8 pr-4 py-3 rounded-2xl text-sm font-mono font-black bg-gray-50 border-none focus:ring-4 focus:ring-emerald-500/10 transition-all" max="${cashBalance}">
                                    </div>
                                    <button type="submit" class="w-full py-4 rounded-2xl bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl shadow-gray-900/10">Verser au Guichet</button>
                                </form>
                                <form onsubmit="actions.bankWithdraw(event)" class="space-y-4">
                                    <div class="relative">
                                        <span class="absolute left-4 top-3 text-red-500 font-bold text-sm">$</span>
                                        <input type="number" name="amount" placeholder="Retrait" class="w-full pl-8 pr-4 py-3 rounded-2xl text-sm font-mono font-black bg-gray-50 border-none focus:ring-4 focus:ring-red-500/10 transition-all" max="${bankBalance}">
                                    </div>
                                    <button type="submit" class="w-full py-4 rounded-2xl bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all shadow-xl shadow-gray-900/10">Retrait ATM</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 2 : Virement & Épargne -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <!-- TRANSFER MODULE -->
                        <div class="lg:col-span-7 bg-white p-12 rounded-[50px] border border-gray-100 shadow-xl relative overflow-hidden group">
                            <div class="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                            <h3 class="text-sm font-black text-gov-text uppercase italic tracking-widest mb-10 flex items-center gap-4">
                                <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:rotate-12 transition-transform"><i data-lucide="send" class="w-6 h-6"></i></div>
                                Transférer des Fonds
                            </h3>
                            <form onsubmit="actions.bankTransfer(event)" class="space-y-8" autocomplete="off">
                                <div class="relative">
                                    <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-2 mb-3 block">Destinataire du Virement</label>
                                    <input type="hidden" name="target_id" value="${state.selectedRecipient ? state.selectedRecipient.id : ''}" required>
                                    <div class="relative group">
                                        <i data-lucide="user" class="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors"></i>
                                        <input type="text" id="recipient_search" placeholder="Rechercher citoyen..." value="${state.selectedRecipient ? state.selectedRecipient.name : ''}" oninput="actions.searchRecipients(this.value)" class="w-full py-5 pl-16 pr-8 rounded-[24px] text-sm font-bold bg-gray-50 border-none outline-none focus:ring-4 focus:ring-blue-600/5 transition-all ${state.selectedRecipient ? 'text-blue-700 uppercase tracking-tight' : ''}" ${state.selectedRecipient ? 'readonly' : ''}>
                                        ${state.selectedRecipient ? `<button type="button" onclick="actions.clearRecipient()" class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><i data-lucide="x-circle" class="w-6 h-6"></i></button>` : ''}
                                    </div>
                                    <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-[32px] mt-3 max-h-60 overflow-y-auto shadow-2xl custom-scrollbar hidden z-50"></div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div class="space-y-3">
                                        <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-2 block">Somme à envoyer ($)</label>
                                        <input type="number" name="amount" placeholder="0" min="1" max="${bankBalance}" class="w-full py-5 px-8 rounded-[24px] font-mono text-3xl font-black bg-gray-50 border-none outline-none focus:ring-4 focus:ring-blue-600/5" required>
                                    </div>
                                    <div class="space-y-3">
                                        <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-2 block">Libellé / Note</label>
                                        <input type="text" name="description" placeholder="Ex: Services..." maxlength="50" class="w-full py-5 px-8 rounded-[24px] text-sm italic font-medium bg-gray-50 border-none outline-none focus:ring-4 focus:ring-blue-600/5">
                                    </div>
                                </div>

                                <button type="submit" class="w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.4em] bg-[#0f172a] hover:bg-blue-600 text-white shadow-2xl transition-all transform active:scale-[0.98]">EXÉCUTER LE TRANSFERT</button>
                            </form>
                        </div>

                        <!-- SAVINGS MANAGEMENT SECTION -->
                        <div class="lg:col-span-5 bg-[#020617] p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
                            <div class="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
                            
                            <div class="flex justify-between items-start relative z-10 mb-10">
                                <div>
                                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 mb-4">
                                        <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> Rendement Garanti
                                    </div>
                                    <h3 class="text-3xl font-black italic uppercase tracking-tighter">Livret<br><span class="text-emerald-400">Épargne.</span></h3>
                                </div>
                                <div class="text-right">
                                    <div class="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Taux Cycle</div>
                                    <div class="text-2xl font-mono font-bold text-white">${state.savingsRate}%</div>
                                </div>
                            </div>

                            <div class="bg-white/5 border border-white/10 rounded-[35px] p-8 text-center mb-10 relative z-10">
                                <div class="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3">Capital Placé</div>
                                <div class="text-5xl font-mono font-black text-emerald-400 tracking-tighter drop-shadow-xl">$ ${savingsBalance.toLocaleString()}</div>
                            </div>

                            <div class="space-y-4 relative z-10">
                                <form onsubmit="actions.transferToSavings(event)" class="flex gap-3">
                                    <input type="number" name="amount" placeholder="Dépôt..." min="1" max="${bankBalance}" class="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-mono font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500/50" required>
                                    <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-2xl shadow-xl transition-all" title="Alimenter"><i data-lucide="plus" class="w-5 h-5"></i></button>
                                </form>
                                <form onsubmit="actions.withdrawFromSavings(event)" class="flex gap-3">
                                    <input type="number" name="amount" placeholder="Retrait..." min="1" max="${savingsBalance}" class="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-mono font-bold text-white outline-none focus:ring-2 focus:ring-blue-500/50" required>
                                    <button type="submit" class="bg-white/10 hover:bg-white/20 text-white px-6 rounded-2xl shadow-xl transition-all" title="Débloquer"><i data-lucide="minus" class="w-5 h-5"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 3 : Historique des flux -->
                    <div class="bg-white p-12 rounded-[50px] border border-gray-100 shadow-xl">
                        <div class="flex justify-between items-center mb-12 pb-6 border-b border-gray-50">
                            <h3 class="text-sm font-black text-gov-text uppercase italic tracking-[0.2em] flex items-center gap-4">
                                <div class="w-12 h-12 rounded-2xl bg-gov-light flex items-center justify-center text-gray-400 shadow-inner">
                                    <i data-lucide="scroll-text" class="w-6 h-6"></i>
                                </div>
                                Relevé de Flux Certifiés
                            </h3>
                            <div class="text-right">
                                <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Rapport de Période</div>
                                <div class="text-xs font-bold text-gov-text uppercase">Mois de ${new Date().toLocaleString('fr-FR', {month: 'long', year: 'numeric'})}</div>
                            </div>
                        </div>
                        <div class="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                            ${historyHtml}
                        </div>
                    </div>

                </div>
            </div>
            
            <!-- Mobile Summary Footer (Visual Only) -->
            <div class="md:hidden bg-white border-t border-gray-100 p-6 flex justify-between items-center shrink-0">
                <div>
                    <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Liquidités Main</div>
                    <div class="text-2xl font-mono font-black text-gov-text">$ ${cashBalance.toLocaleString()}</div>
                </div>
                <div class="w-14 h-14 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-inner">
                    <i data-lucide="shield-check" class="w-7 h-7"></i>
                </div>
            </div>
        </div>
    `;
};
