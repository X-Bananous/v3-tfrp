
import { state } from '../state.js';

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full"><div class="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mb-4"></div>Établissement du canal financier...</div>';
    
    const bankBalance = state.bankAccount.bank_balance || 0;
    const cashBalance = state.bankAccount.cash_balance || 0;
    const savingsBalance = state.bankAccount.savings_balance || 0;

    const historyHtml = state.transactions.length > 0 
        ? state.transactions.map(t => {
            let icon, color, label, sign, bgIcon;
            if (t.type === 'deposit') { icon = 'plus'; color = 'text-emerald-400'; label = 'Crédit Cash'; sign = '+'; bgIcon = 'bg-emerald-500/10 text-emerald-400'; }
            else if (t.type === 'withdraw') { icon = 'minus'; color = 'text-gray-400'; label = 'Débit Cash'; sign = '-'; bgIcon = 'bg-white/5 text-gray-400'; }
            else if (t.type === 'transfer') {
                if (t.receiver_id === state.activeCharacter.id) { icon = 'arrow-down-left'; color = 'text-blue-400'; label = 'Reçu'; sign = '+'; bgIcon = 'bg-blue-500/10 text-blue-400'; }
                else { icon = 'arrow-up-right'; color = 'text-red-400'; label = 'Envoyé'; sign = '-'; bgIcon = 'bg-red-500/10 text-red-400'; }
            } else { icon = 'shield-check'; label = 'Ajustement'; color = t.amount >= 0 ? 'text-emerald-400' : 'text-red-400'; sign = t.amount >= 0 ? '+' : '-'; bgIcon = 'bg-purple-500/10 text-purple-400'; }

            return `
                <div class="flex items-center justify-between p-6 bg-white/[0.02] rounded-[24px] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl ${bgIcon} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><i data-lucide="${icon}" class="w-6 h-6"></i></div>
                        <div>
                            <div class="font-black text-white text-sm uppercase italic tracking-tight">${label}</div>
                            <div class="text-[9px] text-gray-500 font-mono uppercase font-bold tracking-widest">${new Date(t.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-mono font-black text-lg ${color} tracking-tighter">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                    </div>
                </div>
            `;
        }).join('') 
        : '<p class="text-center text-gray-600 py-16 text-[10px] uppercase font-black tracking-[0.4em]">Aucun flux certifié détecté</p>';

    return `
        <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in">
            <!-- Header : Patrimoine Global -->
            <div class="px-8 pt-8 pb-6 shrink-0 flex flex-col md:flex-row justify-between items-end gap-6 bg-[#050505] border-b border-white/5">
                <div>
                    <div class="flex items-center gap-2 mb-1.5">
                        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span class="text-[9px] text-emerald-500 font-black uppercase tracking-[0.4em]">Canal Financier Sécurisé</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter leading-none">Wealth Terminal</h2>
                </div>
                <div class="text-right">
                    <div class="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Valeur Nette Consolidée</div>
                    <div class="text-3xl font-mono font-black text-white tracking-tighter italic">$ ${(bankBalance + savingsBalance).toLocaleString()}</div>
                </div>
            </div>

            <!-- Dashboard Scrollable Unique -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div class="max-w-7xl mx-auto space-y-16 pb-32">
                    
                    <!-- Top : Carte & Cash -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <!-- THE METAL CARD -->
                        <div class="p-10 rounded-[50px] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black relative overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-between min-h-[320px] group">
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
                                <div class="text-[10px] text-blue-200/40 uppercase font-black tracking-[0.3em] mb-3">Solde Disponible</div>
                                <div class="text-5xl md:text-7xl font-mono font-black text-white tracking-tighter italic drop-shadow-2xl">$ ${bankBalance.toLocaleString()}</div>
                            </div>
                            <div class="flex justify-between items-end relative z-10">
                                <div class="text-lg font-black text-white uppercase italic tracking-tight">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                                <div class="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">**** ${state.activeCharacter.id.substring(0,4)}</div>
                            </div>
                        </div>

                        <!-- ATM & QUICK ACTIONS -->
                        <div class="bg-white/[0.02] p-10 rounded-[50px] border border-white/5 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                            <div class="flex justify-between items-start mb-10 relative z-10">
                                <div>
                                    <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest">Fonds Physiques (Liquidités)</h3>
                                    <div class="text-5xl font-mono font-black text-white tracking-tighter mt-2">$ ${cashBalance.toLocaleString()}</div>
                                </div>
                                <div class="w-16 h-16 rounded-[28px] bg-white/5 flex items-center justify-center text-white border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                    <i data-lucide="wallet" class="w-8 h-8"></i>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-6 relative z-10 pt-10 border-t border-white/5">
                                <form onsubmit="actions.bankDeposit(event)" class="space-y-4">
                                    <div class="relative">
                                        <span class="absolute left-4 top-3 text-emerald-500 font-bold text-sm">$</span>
                                        <input type="number" name="amount" placeholder="Dépôt" class="w-full pl-8 pr-4 py-3 rounded-2xl text-sm font-mono font-black bg-black/40 border-white/5 text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" max="${cashBalance}">
                                    </div>
                                    <button type="submit" class="w-full py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-white transition-all">Verser au Guichet</button>
                                </form>
                                <form onsubmit="actions.bankWithdraw(event)" class="space-y-4">
                                    <div class="relative">
                                        <span class="absolute left-4 top-3 text-red-500 font-bold text-sm">$</span>
                                        <input type="number" name="amount" placeholder="Retrait" class="w-full pl-8 pr-4 py-3 rounded-2xl text-sm font-mono font-black bg-black/40 border-white/5 text-white outline-none focus:ring-4 focus:ring-red-500/10 transition-all" max="${bankBalance}">
                                    </div>
                                    <button type="submit" class="w-full py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all">Retrait ATM</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Middle : Transferts & Épargne -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <!-- TRANSFER MODULE -->
                        <div class="lg:col-span-7 bg-white/[0.02] p-12 rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div class="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                            <h3 class="text-sm font-black text-white uppercase italic tracking-widest mb-10 flex items-center gap-4">
                                <div class="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><i data-lucide="send" class="w-6 h-6"></i></div>
                                Nouveau Virement Sortant
                            </h3>
                            <form onsubmit="actions.bankTransfer(event)" class="space-y-8" autocomplete="off">
                                <div class="relative">
                                    <label class="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-2 mb-3 block">Destinataire</label>
                                    <input type="hidden" name="target_id" value="${state.selectedRecipient ? state.selectedRecipient.id : ''}" required>
                                    <input type="text" id="recipient_search" placeholder="Nom du citoyen..." value="${state.selectedRecipient ? state.selectedRecipient.name : ''}" oninput="actions.searchRecipients(this.value)" class="w-full py-5 px-8 rounded-[24px] text-sm font-bold bg-black/40 border-white/5 text-white outline-none focus:ring-4 focus:ring-blue-600/10 transition-all ${state.selectedRecipient ? 'text-blue-400' : ''}" ${state.selectedRecipient ? 'readonly' : ''}>
                                    <div id="search-results-container" class="absolute top-full left-0 right-0 bg-[#0f172a] border border-white/10 rounded-[32px] mt-3 max-h-40 overflow-y-auto shadow-2xl z-50 hidden"></div>
                                </div>
                                <div class="flex gap-4">
                                    <div class="flex-1">
                                        <label class="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-2 mb-3 block">Somme ($)</label>
                                        <input type="number" name="amount" placeholder="0" min="1" max="${bankBalance}" class="w-full py-5 px-8 rounded-[24px] font-mono text-3xl font-black bg-black/40 border-white/5 text-white outline-none focus:ring-4 focus:ring-blue-600/10" required>
                                    </div>
                                    <button type="submit" class="px-10 rounded-[24px] bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/40 transition-all transform active:scale-95"><i data-lucide="arrow-right" class="w-8 h-8"></i></button>
                                </div>
                            </form>
                        </div>

                        <!-- SAVINGS (FIXED) -->
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

                    <!-- Bottom : Historique -->
                    <div class="bg-white/[0.02] p-12 rounded-[60px] border border-white/5 shadow-2xl">
                        <div class="flex justify-between items-center mb-12 pb-6 border-b border-white/5">
                            <h3 class="text-sm font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-4">
                                <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 shadow-inner">
                                    <i data-lucide="scroll-text" class="w-6 h-6"></i>
                                </div>
                                Relevé de Flux Certifiés
                            </h3>
                            <div class="text-[9px] text-gray-600 font-black uppercase tracking-widest">Rapport de Période • ${new Date().toLocaleString('fr-FR', {month: 'long', year: 'numeric'})}</div>
                        </div>
                        <div class="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                            ${historyHtml}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
};
