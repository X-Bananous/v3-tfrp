
import { state } from '../state.js';

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500">Chargement des données bancaires...</div>';
    
    const bankBalance = state.bankAccount.bank_balance || 0;
    const cashBalance = state.bankAccount.cash_balance || 0;
    const savingsBalance = state.bankAccount.savings_balance || 0;

    const historyHtml = state.transactions.length > 0 
        ? state.transactions.map(t => {
            let color, label, sign;
            if (t.type === 'deposit') { color = 'text-emerald-600'; label = 'Crédit Cash'; sign = '+'; }
            else if (t.type === 'withdraw') { color = 'text-gray-400'; label = 'Débit Cash'; sign = '-'; }
            else if (t.type === 'transfer') {
                if (t.receiver_id === state.activeCharacter.id) { color = 'text-blue-600'; label = 'Reçu'; sign = '+'; }
                else { color = 'text-gov-red'; label = 'Envoyé'; sign = '-'; }
            } else { label = 'Ajustement'; color = t.amount >= 0 ? 'text-emerald-600' : 'text-gov-red'; sign = t.amount >= 0 ? '+' : '-'; }

            return `
                <div class="flex items-center justify-between p-5 bg-white border-b border-gray-100 hover:bg-gov-light transition-colors group">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-gov-light flex items-center justify-center text-gray-400">
                            <i data-lucide="${t.type === 'transfer' ? 'arrow-right-left' : 'landmark'}" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <div class="font-black text-gov-text text-[11px] uppercase tracking-widest">${label}</div>
                            <div class="text-[9px] text-gray-400 font-bold uppercase tracking-tight">${new Date(t.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-black text-sm ${color} tracking-tighter">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                        <div class="text-[8px] text-gray-300 font-black uppercase tracking-widest">${t.description || 'VÉRIFIÉ'}</div>
                    </div>
                </div>
            `;
        }).join('') 
        : '<div class="text-center text-gray-400 py-12 text-[10px] font-black uppercase tracking-widest">Aucune transaction répertoriée</div>';

    return `
        <div class="h-full flex flex-col bg-[#F6F6F6] animate-in">
            <!-- HEADER -->
            <div class="px-8 py-10 bg-white border-b border-gray-200 shrink-0">
                <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-2">Institution Financière d'État</div>
                        <h2 class="text-4xl md:text-5xl font-black text-gov-text uppercase italic tracking-tighter leading-none">Gestion de<br><span class="text-gov-blue">Patrimoine.</span></h2>
                    </div>
                    <div class="text-right">
                        <div class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Fortune Nette Estimée</div>
                        <div class="text-3xl font-black text-gov-text tracking-tighter italic">$ ${(bankBalance + savingsBalance + cashBalance).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <!-- DASHBOARD -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div class="max-w-7xl mx-auto space-y-8">
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- COMTE COURANT -->
                        <div class="bg-white p-8 rounded-[32px] border border-gray-200 shadow-xl relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-gov-blue opacity-[0.02] rounded-bl-full"></div>
                            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <i data-lucide="credit-card" class="w-4 h-4 text-gov-blue"></i> Compte de Dépôt
                            </h3>
                            <div class="text-5xl font-black text-gov-text tracking-tighter mb-2 italic">$ ${bankBalance.toLocaleString()}</div>
                            <div class="text-[9px] text-gov-blue font-black uppercase tracking-widest">Fonds Immédiatement Disponibles</div>
                            
                            <div class="mt-8 pt-8 border-t border-gray-50 flex gap-4">
                                <form onsubmit="actions.bankWithdraw(event)" class="flex-1 flex gap-2">
                                    <input type="number" name="amount" placeholder="Retrait" class="w-full bg-gov-light p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-gov-blue/20" max="${bankBalance}">
                                    <button class="bg-gov-text text-white p-3 rounded-xl hover:bg-black transition-all shadow-lg"><i data-lucide="minus" class="w-4 h-4"></i></button>
                                </form>
                            </div>
                        </div>

                        <!-- LIQUIDITÉS -->
                        <div class="bg-white p-8 rounded-[32px] border border-gray-200 shadow-xl relative overflow-hidden">
                            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <i data-lucide="wallet" class="w-4 h-4 text-emerald-600"></i> Espèces Physiques
                            </h3>
                            <div class="text-5xl font-black text-gov-text tracking-tighter mb-2 italic text-emerald-600">$ ${cashBalance.toLocaleString()}</div>
                            <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest">Sommes détenues sur l'individu</div>
                            
                            <div class="mt-8 pt-8 border-t border-gray-50 flex gap-4">
                                <form onsubmit="actions.bankDeposit(event)" class="flex-1 flex gap-2">
                                    <input type="number" name="amount" placeholder="Déposer" class="w-full bg-gov-light p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" max="${cashBalance}">
                                    <button class="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg"><i data-lucide="plus" class="w-4 h-4"></i></button>
                                </form>
                            </div>
                        </div>

                        <!-- ÉPARGNE -->
                        <div class="bg-gov-text p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
                            <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
                            <div class="flex justify-between items-start mb-8">
                                <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <i data-lucide="trending-up" class="w-4 h-4 text-emerald-400"></i> Livret A National
                                </h3>
                                <div class="text-[9px] font-black bg-white/10 px-2 py-1 rounded border border-white/10">TAUX : ${state.savingsRate}%</div>
                            </div>
                            <div class="text-5xl font-black text-white tracking-tighter mb-2 italic">$ ${savingsBalance.toLocaleString()}</div>
                            <div class="text-[9px] text-emerald-400 font-black uppercase tracking-widest mb-8">Génère des intérêts périodiques</div>
                            
                            <div class="flex gap-2">
                                <form onsubmit="actions.transferToSavings(event)" class="flex-1 flex gap-2">
                                    <input type="number" name="amount" placeholder="Épargner" class="w-full bg-white/5 p-3 rounded-xl text-xs font-bold text-white outline-none border border-white/10 focus:border-emerald-500/50" max="${bankBalance}">
                                    <button class="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-500 transition-all"><i data-lucide="arrow-up" class="w-4 h-4"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <!-- VIREMENT -->
                        <div class="lg:col-span-4 bg-white p-8 rounded-[32px] border border-gray-200 shadow-xl h-fit">
                            <h3 class="text-[10px] font-black text-gov-text uppercase tracking-widest mb-8 flex items-center gap-3">
                                <i data-lucide="send" class="w-5 h-5 text-gov-blue"></i> Émettre un Virement
                            </h3>
                            <form onsubmit="actions.bankTransfer(event)" class="space-y-6" autocomplete="off">
                                <div class="relative">
                                    <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-2 block">Destinataire</label>
                                    <input type="text" id="recipient_search" oninput="actions.searchRecipients(this.value)" placeholder="Nom du citoyen..." class="w-full p-4 bg-gov-light rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-gov-blue/20 transition-all">
                                    <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl mt-2 max-h-40 overflow-y-auto z-50 shadow-2xl hidden"></div>
                                </div>
                                <div>
                                    <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-2 block">Montant du transfert ($)</label>
                                    <input type="number" name="amount" placeholder="0" class="w-full p-4 bg-gov-light rounded-2xl text-lg font-black outline-none" required min="1">
                                </div>
                                <button type="submit" class="w-full py-4 bg-gov-blue text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all">EXÉCUTER L'ORDRE</button>
                            </form>
                        </div>

                        <!-- HISTORIQUE -->
                        <div class="lg:col-span-8 bg-white rounded-[32px] border border-gray-200 shadow-xl overflow-hidden flex flex-col">
                            <div class="p-6 border-b border-gray-100 bg-gov-light/30 flex justify-between items-center">
                                <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                    <i data-lucide="scroll-text" class="w-5 h-5 text-gray-500"></i> Relevé de Compte Certifié
                                </h3>
                            </div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar max-h-[500px]">
                                ${historyHtml}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
};
