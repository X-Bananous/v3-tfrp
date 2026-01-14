
import { state } from '../state.js';

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full"><div class="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mb-4"></div>Connexion au réseau bancaire...</div>';
    
    let content = '';

    // --- TAB: OVERVIEW ---
    if (state.activeBankTab === 'overview') {
        content = `
            <div class="space-y-8 animate-in pb-10">
                <!-- Header Solde -->
                <div class="flex flex-col items-center justify-center py-10">
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Solde de vos comptes</div>
                    <div class="text-6xl font-mono font-black text-gov-text tracking-tighter">$ ${(state.bankAccount.bank_balance + state.bankAccount.cash_balance).toLocaleString()}</div>
                    <div class="flex gap-4 mt-8">
                        <button onclick="actions.setBankTab('operations')" class="flex flex-col items-center gap-2 group">
                            <div class="w-12 h-12 rounded-full bg-gov-blue text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all">
                                <i data-lucide="plus" class="w-6 h-6"></i>
                            </div>
                            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nouveau Virement</span>
                        </button>
                         <button onclick="actions.setBankTab('history')" class="flex flex-col items-center gap-2 group">
                            <div class="w-12 h-12 rounded-full bg-gov-light text-gov-text flex items-center justify-center shadow-md group-hover:scale-110 transition-all">
                                <i data-lucide="scroll-text" class="w-6 h-6"></i>
                            </div>
                            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Transactions</span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Carte Bancaire Virtuelle -->
                    <div class="relative group h-64">
                        <div class="h-full p-8 rounded-[32px] bg-gradient-to-br from-gray-900 via-blue-900 to-black relative overflow-hidden shadow-2xl flex flex-col justify-between">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                            <div class="flex justify-between items-start relative z-10">
                                <div class="text-[10px] font-black text-blue-200 uppercase tracking-widest">COMPTE NATIONAL TFRP</div>
                                <i data-lucide="contactless" class="w-6 h-6 text-white/50"></i>
                            </div>
                            
                            <div class="relative z-10">
                                <div class="text-[10px] text-blue-200/60 uppercase font-black tracking-widest mb-1 italic">Compte Courant</div>
                                <div class="text-4xl font-mono font-black text-white tracking-tighter">$ ${state.bankAccount.bank_balance.toLocaleString()}</div>
                            </div>

                            <div class="flex justify-between items-end relative z-10">
                                <div>
                                    <div class="text-xs font-mono text-white/60 tracking-widest">**** **** **** ${state.activeCharacter.id.substring(0,4).toUpperCase()}</div>
                                    <div class="text-[10px] font-black text-white uppercase italic tracking-tight mt-1">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                                </div>
                                <div class="w-12 h-8 bg-yellow-500/80 rounded-md shadow-lg border border-yellow-400/50"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Portefeuille Espèces -->
                    <div class="h-64 p-8 rounded-[32px] bg-white border border-gray-100 relative overflow-hidden shadow-xl flex flex-col justify-between group">
                         <div class="flex justify-between items-start">
                            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <i data-lucide="wallet" class="w-6 h-6"></i>
                            </div>
                            <span class="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-full">Cash Physique</span>
                        </div>
                        <div>
                            <div class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 italic">Liquidités disponibles</div>
                            <div class="text-4xl font-mono font-black text-gov-text tracking-tighter">$ ${state.bankAccount.cash_balance.toLocaleString()}</div>
                        </div>
                        <div class="flex items-center gap-2 text-orange-500">
                            <i data-lucide="shield-alert" class="w-4 h-4"></i>
                            <span class="text-[8px] font-black uppercase tracking-widest">Fonds non protégés par le décret bancaire</span>
                        </div>
                    </div>
                </div>

                <!-- ATM (Quick Actions) -->
                <div class="bg-gov-light/30 p-8 rounded-[40px] border border-gray-100">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div class="space-y-6">
                            <div class="flex items-center gap-3 text-emerald-600">
                                <i data-lucide="arrow-down-to-line" class="w-5 h-5"></i>
                                <h4 class="text-xs font-black uppercase tracking-[0.2em]">Dépôt Rapide</h4>
                            </div>
                            <form onsubmit="actions.bankDeposit(event)" class="flex gap-2">
                                <div class="relative flex-1">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black">$</span>
                                    <input type="number" name="amount" placeholder="Somme à déposer" min="1" max="${state.bankAccount.cash_balance}" class="w-full h-14 pl-10 pr-4 rounded-2xl text-lg font-mono font-black bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all shadow-sm" required>
                                </div>
                                <button type="submit" class="h-14 px-6 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all">Valider</button>
                            </form>
                        </div>

                        <div class="space-y-6">
                            <div class="flex items-center gap-3 text-gov-red">
                                <i data-lucide="arrow-up-from-line" class="w-5 h-5"></i>
                                <h4 class="text-xs font-black uppercase tracking-[0.2em]">Retrait ATM</h4>
                            </div>
                            <form onsubmit="actions.bankWithdraw(event)" class="flex gap-2">
                                <div class="relative flex-1">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gov-red font-black">$</span>
                                    <input type="number" name="amount" placeholder="Somme à retirer" min="1" max="${state.bankAccount.bank_balance}" class="w-full h-14 pl-10 pr-4 rounded-2xl text-lg font-mono font-black bg-white border border-gray-100 focus:border-gov-red outline-none transition-all shadow-sm" required>
                                </div>
                                <button type="submit" class="h-14 px-6 rounded-2xl bg-gov-red text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Valider</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB: SAVINGS (LIVRET) ---
    else if (state.activeBankTab === 'savings') {
        content = `
            <div class="space-y-8 animate-in pb-10">
                <div class="p-12 rounded-[48px] bg-white border border-gray-100 shadow-xl relative overflow-hidden text-center">
                    <div class="absolute -right-20 -top-20 w-96 h-96 bg-blue-50 rounded-full blur-[100px] pointer-events-none"></div>
                    <div class="relative z-10">
                        <div class="w-20 h-20 bg-blue-100 text-gov-blue rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-200">
                            <i data-lucide="piggy-bank" class="w-10 h-10"></i>
                        </div>
                        <h3 class="text-4xl font-black text-gov-text italic uppercase tracking-tighter mb-2">Livret d'Épargne</h3>
                        <p class="text-gray-400 text-sm font-medium mb-8">Vos capitaux génèrent des dividendes hebdomadaires de <span class="text-gov-blue font-bold">${state.savingsRate}%</span></p>
                        
                        <div class="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Capital Actuellement Placé</div>
                        <div class="text-6xl font-mono font-black text-gov-blue tracking-tighter mb-12">$ ${(state.bankAccount.savings_balance || 0).toLocaleString()}</div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <div class="bg-gov-light p-8 rounded-[32px] border border-gray-100">
                                <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Investissement</div>
                                <form onsubmit="actions.transferToSavings(event)" class="space-y-4">
                                    <input type="number" name="amount" placeholder="Somme à placer" min="1" max="${state.bankAccount.bank_balance}" class="w-full p-4 rounded-2xl font-mono font-black text-center bg-white border border-gray-100 focus:border-gov-blue outline-none transition-all" required>
                                    <button type="submit" class="w-full py-4 bg-gov-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">PLACER LES FONDS</button>
                                </form>
                            </div>
                            <div class="bg-gov-light p-8 rounded-[32px] border border-gray-100">
                                <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Liquidation</div>
                                <form onsubmit="actions.withdrawFromSavings(event)" class="space-y-4">
                                    <input type="number" name="amount" placeholder="Somme à retirer" min="1" max="${state.bankAccount.savings_balance}" class="w-full p-4 rounded-2xl font-mono font-black text-center bg-white border border-gray-100 focus:border-gov-red outline-none transition-all" required>
                                    <button type="submit" class="w-full py-4 bg-white border-2 border-gray-200 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-gov-red hover:border-gov-red transition-all">RÉCUPÉRER LE CASH</button>
                                </form>
                            </div>
                        </div>
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
                    <div class="text-center mb-10">
                        <div class="w-20 h-20 bg-gov-light rounded-3xl flex items-center justify-center text-gov-blue mx-auto mb-6 shadow-sm">
                            <i data-lucide="send" class="w-10 h-10"></i>
                        </div>
                        <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter">Transfert de fonds</h3>
                        <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Protocole sécurisé inter-citoyens</p>
                    </div>
                    <form onsubmit="actions.bankTransfer(event)" class="space-y-6" autocomplete="off">
                        <div class="relative">
                            <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Identité du Bénéficiaire</label>
                            <input type="hidden" name="target_id" value="${state.selectedRecipient ? state.selectedRecipient.id : ''}" required>
                            <div class="relative group">
                                <i data-lucide="search" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                <input type="text" id="recipient_search" placeholder="Nom du destinataire..." value="${state.selectedRecipient ? state.selectedRecipient.name : ''}" oninput="actions.searchRecipients(this.value)" class="w-full h-14 pl-12 rounded-2xl text-sm bg-gov-light border border-gray-100 focus:border-gov-blue outline-none transition-all ${state.selectedRecipient ? 'text-gov-blue font-black border-gov-blue/50 bg-blue-50 uppercase' : ''}" autocomplete="off" ${state.selectedRecipient ? 'readonly' : ''}>
                                ${state.selectedRecipient ? `<button type="button" onclick="actions.clearRecipient()" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gov-red"><i data-lucide="x" class="w-5 h-5"></i></button>` : ''}
                            </div>
                            <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-2xl mt-2 max-h-48 overflow-y-auto shadow-2xl z-50 hidden animate-in"></div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Montant ($)</label>
                                <div class="relative">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gov-blue font-black">$</span>
                                    <input type="number" name="amount" placeholder="0.00" min="1" max="${state.bankAccount.bank_balance}" class="w-full h-14 pl-10 rounded-2xl font-mono text-xl font-black bg-gov-light border border-gray-100 focus:border-gov-blue outline-none" required>
                                </div>
                            </div>
                            <div>
                                <label class="text-[9px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Libellé</label>
                                <input type="text" name="description" placeholder="Ex: Honoraires..." maxlength="50" class="w-full h-14 px-4 rounded-2xl text-sm bg-gov-light border border-gray-100 focus:border-gov-blue outline-none italic">
                            </div>
                        </div>
                        <button type="submit" class="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.4em] bg-gov-blue hover:bg-black text-white shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 transition-all transform active:scale-95">
                            CONFIRMER LE VIREMENT <i data-lucide="chevron-right" class="w-4 h-4"></i>
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
                icon = 'arrow-down-left'; color = 'text-emerald-600'; label = 'Alimentation Compte'; sign = '+'; bgIcon = 'bg-emerald-50 text-emerald-600';
            } else if (t.type === 'withdraw') {
                icon = 'arrow-up-right'; color = 'text-gray-500'; label = 'Retrait Espèces'; sign = '-'; bgIcon = 'bg-gray-50 text-gray-500';
            } else if (t.type === 'transfer') {
                if (t.receiver_id === state.activeCharacter.id) {
                    icon = 'download'; color = 'text-blue-600'; label = 'Virement Reçu'; sign = '+'; bgIcon = 'bg-blue-50 text-blue-600';
                } else {
                    icon = 'upload'; color = 'text-gov-red'; label = 'Virement Émis'; sign = '-'; bgIcon = 'bg-red-50 text-gov-red';
                }
            } else if (t.type === 'admin_adjustment') {
                icon = 'shield-check'; label = 'Régularisation État'; bgIcon = 'bg-purple-50 text-purple-600';
                if (t.amount >= 0) { color = 'text-emerald-600'; sign = '+'; } else { color = 'text-gov-red'; sign = '-'; }
            }
            return `
                <div class="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-50 hover:border-gov-blue/20 transition-all group">
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
        { id: 'savings', label: 'Livret Épargne', icon: 'piggy-bank' },
        { id: 'operations', label: 'Nouveau Virement', icon: 'send' },
        { id: 'history', label: 'Transactions', icon: 'scroll-text' }
    ];

    return `
        <div class="h-full flex flex-col bg-[#FCFCFC] overflow-hidden animate-in">
            <div class="px-8 pt-8 pb-4 shrink-0 flex flex-col md:flex-row justify-between items-center gap-6">
                <h2 class="text-3xl font-black text-gov-text flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                    <i data-lucide="landmark" class="w-8 h-8 text-gov-blue"></i> Banque de l'État
                </h2>
                
                <!-- Subnav Tabs -->
                <div class="flex gap-1 p-1 bg-gov-light rounded-2xl border border-gray-100">
                    ${tabs.map(t => `
                        <button onclick="actions.setBankTab('${t.id}')" class="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.activeBankTab === t.id ? 'bg-white text-gov-blue shadow-lg' : 'text-gray-400 hover:text-gov-text'}">
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
