
import { state } from '../state.js';

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500"><div class="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>Synchronisation bancaire...</div>';
    
    const activeTab = state.activeBankTab || 'hub';
    const bankBalance = state.bankAccount.bank_balance || 0;
    const cashBalance = state.bankAccount.cash_balance || 0;
    const savingsBalance = state.bankAccount.savings_balance || 0;

    // BANQUE HUB (VUE PRINCIPALE)
    if (activeTab === 'hub') {
        return `
            <div class="h-full flex flex-col bg-[#F6F6F6] overflow-hidden animate-fade-in">
                <div class="px-8 py-12 bg-white border-b border-gray-200 shrink-0">
                    <div class="max-w-6xl mx-auto">
                        <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-4 flex items-center gap-3">
                            <span class="w-12 h-0.5 bg-gov-blue"></span> Portail Financier Officiel
                        </div>
                        <h2 class="text-5xl font-black text-gov-text uppercase italic tracking-tighter leading-none">Banque de <span class="text-gov-blue">Los Angeles.</span></h2>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div class="max-w-6xl mx-auto py-10">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <button onclick="actions.setBankTab('overview')" class="gov-card p-10 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                <div class="w-20 h-20 bg-gov-light rounded-none flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                    <i data-lucide="layout-grid" class="w-10 h-10"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Résumé de Compte</h4>
                                <p class="text-[9px] text-gray-400 mt-4 uppercase font-black tracking-widest">Situation & Liquidités</p>
                            </button>

                            <button onclick="actions.setBankTab('transfer')" class="gov-card p-10 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                <div class="w-20 h-20 bg-gov-light rounded-none flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                    <i data-lucide="send" class="w-10 h-10"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Virement Bancaire</h4>
                                <p class="text-[9px] text-gray-400 mt-4 uppercase font-black tracking-widest">Emission de fonds certifiée</p>
                            </button>

                            <button onclick="actions.setBankTab('savings')" class="gov-card p-10 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                <div class="w-20 h-20 bg-gov-light rounded-none flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                    <i data-lucide="piggy-bank" class="w-10 h-10"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Livret Épargne</h4>
                                <p class="text-[9px] text-gray-400 mt-4 uppercase font-black tracking-widest">Placement à intérêts fixes</p>
                            </button>

                            <button onclick="actions.setBankTab('history')" class="gov-card p-10 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                <div class="w-20 h-20 bg-gov-light rounded-none flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                    <i data-lucide="scroll-text" class="w-10 h-10"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Archives</h4>
                                <p class="text-[9px] text-gray-400 mt-4 uppercase font-black tracking-widest">Historique des transactions</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // VUES INTERNES AVEC BOUTON RETOUR
    const backHeader = `
        <div class="px-8 py-8 bg-white border-b border-gray-200 shrink-0 flex items-center justify-between">
            <button onclick="actions.setBankTab('hub')" class="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gov-blue hover:text-black transition-all">
                <i data-lucide="arrow-left" class="w-5 h-5"></i> Retour au Hub Financier
            </button>
            <div class="text-right hidden sm:block">
                <div class="text-[8px] text-gray-400 uppercase font-black mb-1">Terminal de Contrôle</div>
                <div class="text-xs font-mono font-black uppercase text-gov-text">${activeTab === 'overview' ? 'Situation de Compte' : activeTab === 'transfer' ? 'Transfert de Fonds' : activeTab === 'savings' ? 'Livret d\'Épargne' : 'Archives de Transaction'}</div>
            </div>
        </div>
    `;

    let subContent = '';
    if (activeTab === 'overview') {
        subContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in">
                <!-- CARTE VIRTUELLE -->
                <div class="relative group">
                    <div class="p-10 rounded-[40px] bg-gradient-to-br from-[#00004d] to-[#000091] relative overflow-hidden shadow-2xl min-h-[280px] flex flex-col justify-between">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                        <div class="flex justify-between items-start relative z-10">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-8 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-600 border border-white/20"></div>
                                <span class="text-[10px] font-black text-white uppercase tracking-[0.3em]">Platinum Card</span>
                            </div>
                            <i data-lucide="landmark" class="w-8 h-8 text-white/20"></i>
                        </div>
                        <div class="relative z-10">
                            <div class="text-[9px] text-white/40 uppercase font-black mb-1">Compte Courant</div>
                            <div class="text-5xl font-mono font-black text-white italic">$ ${bankBalance.toLocaleString()}</div>
                        </div>
                        <div class="flex justify-between items-end relative z-10">
                            <div>
                                <div class="text-[8px] text-white/30 uppercase font-bold mb-0.5">Détenteur</div>
                                <div class="text-sm font-black text-white uppercase">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                            </div>
                            <div class="text-[10px] font-mono text-white/20">**** ${state.activeCharacter.id.substring(0,4)}</div>
                        </div>
                    </div>
                </div>

                <!-- CASH BUBBLE -->
                <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl flex flex-col justify-between group hover:border-gov-blue/20 transition-all">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Fonds Liquides</div>
                            <div class="text-4xl font-mono font-black text-gov-text">$ ${cashBalance.toLocaleString()}</div>
                        </div>
                        <div class="w-14 h-14 bg-gov-light rounded-2xl flex items-center justify-center text-gov-blue shadow-inner group-hover:scale-110 transition-transform">
                            <i data-lucide="wallet" class="w-7 h-7"></i>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-10">
                        <form onsubmit="actions.bankDeposit(event)" class="space-y-2">
                            <input type="number" name="amount" placeholder="Dépôt" class="w-full p-3 bg-gov-light border-none rounded-xl text-xs font-mono font-black" max="${cashBalance}">
                            <button class="w-full py-3 bg-gov-text text-white text-[9px] font-black uppercase rounded-xl hover:bg-gov-blue transition-all">Verser</button>
                        </form>
                        <form onsubmit="actions.bankWithdraw(event)" class="space-y-2">
                            <input type="number" name="amount" placeholder="Retrait" class="w-full p-3 bg-gov-light border-none rounded-xl text-xs font-mono font-black" max="${bankBalance}">
                            <button class="w-full py-3 bg-gov-text text-white text-[9px] font-black uppercase rounded-xl hover:bg-gov-blue transition-all">Retirer</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    } 
    
    else if (activeTab === 'transfer') {
        subContent = `
            <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl animate-in max-w-3xl mx-auto">
                <h3 class="text-xl font-black text-gov-text uppercase italic mb-8 flex items-center gap-4">
                    <i data-lucide="send" class="w-6 h-6 text-gov-blue"></i> Émission de Virement
                </h3>
                <form onsubmit="actions.bankTransfer(event)" class="space-y-8" autocomplete="off">
                    <div class="relative">
                        <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Destinataire</label>
                        <div class="relative">
                            <i data-lucide="search" class="w-4 h-4 absolute left-4 top-3.5 text-gray-300"></i>
                            <input type="text" id="recipient_search" placeholder="Rechercher citoyen..." oninput="actions.searchRecipients(this.value)" class="w-full py-3 pl-12 pr-4 rounded-xl text-sm bg-gov-light border-none outline-none focus:ring-2 focus:ring-gov-blue/20">
                        </div>
                        <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-2xl mt-2 max-h-48 overflow-y-auto shadow-2xl hidden z-50"></div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1">Somme ($)</label>
                            <input type="number" name="amount" placeholder="0" min="1" max="${bankBalance}" class="w-full p-4 rounded-xl font-mono text-2xl font-black bg-gov-light border-none" required>
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1">Libellé</label>
                            <input type="text" name="description" placeholder="Motif du virement..." class="w-full p-4 rounded-xl text-sm italic bg-gov-light border-none">
                        </div>
                    </div>

                    <button type="submit" class="w-full py-5 bg-gov-blue text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all transform active:scale-95">
                        SIGNER L'ORDRE DE VIREMENT
                    </button>
                </form>
            </div>
        `;
    }

    else if (activeTab === 'savings') {
        subContent = `
            <div class="max-w-xl mx-auto animate-in">
                <div class="bg-[#0f172a] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden text-center">
                    <div class="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]"></div>
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/30 mb-8">
                        <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> Épargne Garantie : ${state.savingsRate}%
                    </div>
                    <h3 class="text-4xl font-black italic uppercase tracking-tighter mb-2">Livret <span class="text-emerald-400">Épargne.</span></h3>
                    <div class="text-5xl font-mono font-black text-white my-10">$ ${savingsBalance.toLocaleString()}</div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <form onsubmit="actions.transferToSavings(event)" class="space-y-2">
                            <input type="number" name="amount" placeholder="Dépôt" class="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white" max="${bankBalance}">
                            <button class="w-full py-3 bg-emerald-600 text-white text-[9px] font-black uppercase rounded-xl shadow-lg">Alimenter</button>
                        </form>
                        <form onsubmit="actions.withdrawFromSavings(event)" class="space-y-2">
                            <input type="number" name="amount" placeholder="Retrait" class="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white" max="${savingsBalance}">
                            <button class="w-full py-3 bg-white/10 text-white text-[9px] font-black uppercase rounded-xl border border-white/10">Débloquer</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    else if (activeTab === 'history') {
        const historyHtml = state.transactions.length > 0 
            ? state.transactions.map(t => {
                let color = 'text-gov-text';
                let sign = '';
                if (t.type === 'deposit') { color = 'text-emerald-600'; sign = '+'; }
                else if (t.type === 'withdraw') { color = 'text-red-600'; sign = '-'; }
                else if (t.type === 'transfer') {
                    if (t.receiver_id === state.activeCharacter.id) { color = 'text-emerald-600'; sign = '+'; }
                    else { color = 'text-red-600'; sign = '-'; }
                }

                return `
                    <div class="p-5 bg-white rounded-2xl border border-gray-100 flex items-center justify-between hover:border-gov-blue/20 transition-all">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl bg-gov-light flex items-center justify-center text-gray-400">
                                <i data-lucide="scroll-text" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <div class="text-[11px] font-black text-gov-text uppercase">${t.description || t.type}</div>
                                <div class="text-[9px] text-gray-400 font-mono">${new Date(t.created_at).toLocaleString()}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-mono font-black text-lg ${color}">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                        </div>
                    </div>
                `;
            }).join('') : '<div class="text-center py-20 text-gray-400 text-xs font-black uppercase italic">Aucun mouvement récent</div>';

        subContent = `
            <div class="max-w-4xl mx-auto animate-in space-y-3">
                ${historyHtml}
            </div>
        `;
    }

    return `
        <div class="h-full flex flex-col bg-[#F6F6F6] overflow-hidden animate-fade-in">
            ${backHeader}
            <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div class="max-w-6xl mx-auto pb-20">
                    ${subContent}
                </div>
            </div>
        </div>
    `;
};
