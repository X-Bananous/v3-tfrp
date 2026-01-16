
import { state } from '../state.js';

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500"><div class="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>Synchronisation bancaire...</div>';
    
    const activeTab = state.activeBankTab || 'hub';
    const bankBalance = state.bankAccount.bank_balance || 0;
    const cashBalance = state.bankAccount.cash_balance || 0;
    const savingsBalance = state.bankAccount.savings_balance || 0;
    const nextInterest = state.bankAccount.taux_int_delivery ? new Date(state.bankAccount.taux_int_delivery) : null;

    // BANQUE HUB (VUE PRINCIPALE)
    if (activeTab === 'hub') {
        return `
            <div class="h-full flex flex-col bg-[#F6F6F6] overflow-hidden animate-fade-in">
                <!-- HEADER MINIMALISTE -->
                <div class="px-8 py-10 bg-white border-b border-gray-200 shrink-0">
                    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-2 flex items-center gap-3">
                                <span class="w-10 h-0.5 bg-gov-blue"></span> Terminal de Gestion Financière
                            </div>
                            <h2 class="text-5xl font-black text-gov-text uppercase italic tracking-tighter leading-none">Banque de <span class="text-gov-blue">Los Angeles.</span></h2>
                        </div>
                        <div class="flex items-center gap-4 bg-gov-light p-4 rounded-2xl border border-gray-100 shadow-inner">
                            <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gov-blue shadow-sm">
                                <i data-lucide="landmark" class="w-5 h-5"></i>
                            </div>
                            <div class="text-left">
                                <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest">Porteur du compte</div>
                                <div class="text-sm font-black text-gov-text uppercase">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div class="max-w-7xl mx-auto space-y-10 pb-20">
                        
                        <!-- DEUX BANNIÈRES DÉTAILLÉES -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- BANNIÈRE 1 : INFOS COMPTE -->
                            <div class="p-10 rounded-[48px] bg-gradient-to-br from-[#00004d] to-[#000091] relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[320px] group transition-all hover:scale-[1.01]">
                                <div class="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-32 -mt-32 blur-2xl group-hover:bg-white/10 transition-all"></div>
                                <div class="flex justify-between items-start relative z-10">
                                    <div>
                                        <div class="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Liquidités Totales (Disponibles)</div>
                                        <div class="text-6xl font-mono font-black text-white italic tracking-tighter drop-shadow-lg">$ ${(bankBalance + cashBalance).toLocaleString()}</div>
                                    </div>
                                    <div class="w-16 h-12 rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-600 border border-white/20 shadow-xl flex items-center justify-center overflow-hidden">
                                        <div class="w-12 h-8 border border-black/10 rounded flex flex-col justify-between p-1 opacity-40"><div class="h-[1px] bg-black w-full"></div><div class="h-[1px] bg-black w-full"></div></div>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-6 relative z-10 pt-8 border-t border-white/10 mt-8">
                                    <div>
                                        <div class="text-[9px] text-white/30 uppercase font-bold mb-1">Dépôts Bancaires</div>
                                        <div class="text-xl font-mono font-black text-white">$ ${bankBalance.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div class="text-[9px] text-white/30 uppercase font-bold mb-1">Argent Liquide</div>
                                        <div class="text-xl font-mono font-black text-white/60">$ ${cashBalance.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div class="flex justify-between items-end relative z-10 mt-auto pt-6">
                                    <div class="text-[10px] font-mono text-white/20 tracking-[0.4em]">**** **** **** ${state.activeCharacter.id.substring(0,4)}</div>
                                    <div class="text-[8px] text-white/30 uppercase font-bold">Système CAD-Bank v6.4</div>
                                </div>
                            </div>

                            <!-- BANNIÈRE 2 : ÉPARGNE & RENDEMENT -->
                            <div class="p-10 rounded-[48px] bg-white border border-gray-100 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[320px] group transition-all hover:scale-[1.01]">
                                <div class="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                                <div class="flex justify-between items-start relative z-10">
                                    <div>
                                        <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-4">
                                            <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> Plan d'Investissement Public
                                        </div>
                                        <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Capital sur Livret</div>
                                        <div class="text-6xl font-mono font-black text-gov-text italic tracking-tighter">$ ${savingsBalance.toLocaleString()}</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-[9px] text-gray-400 font-black uppercase mb-1">Taux Annuel</div>
                                        <div class="text-3xl font-black text-emerald-500 tracking-tight">${state.savingsRate}%</div>
                                    </div>
                                </div>
                                
                                <div class="bg-gov-light/50 rounded-[32px] p-6 border border-gray-100 mt-8 relative z-10">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Calcul des intérêts</div>
                                            <div class="text-sm font-bold text-gov-text">Versement automatique tous les 7 jours</div>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-[9px] text-gray-500 uppercase font-bold mb-1">Prochaine livraison</div>
                                            <div class="text-sm font-mono font-black text-gov-blue">
                                                ${nextInterest ? nextInterest.toLocaleDateString() : 'Indisponible'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- NAVIGATION PAR BULLES (GOV-CARDS) -->
                        <div class="space-y-6">
                            <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4 px-2">
                                 <span class="w-8 h-px bg-gray-200"></span> OPÉRATIONS ACCRÉDITÉES
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                <button onclick="actions.setBankTab('overview')" class="gov-card p-10 flex flex-col items-center text-center group bg-white rounded-[40px] shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                    <div class="w-20 h-20 bg-gov-light rounded-3xl flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                        <i data-lucide="layout-grid" class="w-10 h-10"></i>
                                    </div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Gestion Liquide</h4>
                                    <p class="text-[9px] text-gray-400 mt-4 uppercase font-black tracking-widest">Dépôts & Retraits</p>
                                </button>

                                <button onclick="actions.setBankTab('transfer')" class="gov-card p-10 flex flex-col items-center text-center group bg-white rounded-[40px] shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                    <div class="w-20 h-20 bg-gov-light rounded-3xl flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                        <i data-lucide="send" class="w-10 h-10"></i>
                                    </div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Virements</h4>
                                    <p class="text-[9px] text-gray-400 mt-4 uppercase font-black tracking-widest">Envois certifiés</p>
                                </button>

                                <button onclick="actions.setBankTab('savings')" class="gov-card p-10 flex flex-col items-center text-center group bg-white rounded-[40px] shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                    <div class="w-20 h-20 bg-gov-light rounded-3xl flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                        <i data-lucide="piggy-bank" class="w-10 h-10"></i>
                                    </div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Livret Épargne</h4>
                                    <p class="text-[9px] text-gray-400 mt-4 uppercase font-black tracking-widest">Capitalisation</p>
                                </button>

                                <button onclick="actions.setBankTab('history')" class="gov-card p-10 flex flex-col items-center text-center group bg-white rounded-[40px] shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                    <div class="w-20 h-20 bg-gov-light rounded-3xl flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                        <i data-lucide="scroll-text" class="w-10 h-10"></i>
                                    </div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Archives</h4>
                                    <p class="text-[9px] text-gray-400 mt-4 uppercase font-black tracking-widest">Registre flux</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // VUES INTERNES AVEC BOUTON RETOUR
    const backHeader = `
        <div class="px-8 py-8 bg-white border-b border-gray-200 shrink-0 flex items-center justify-between">
            <button onclick="actions.setBankTab('hub')" class="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gov-blue hover:text-black transition-all group">
                <i data-lucide="arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform"></i> Retour au Hub Bancaire
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
            <div class="animate-in max-w-4xl mx-auto">
                <div class="bg-white p-12 rounded-[48px] border border-gray-100 shadow-2xl flex flex-col items-center text-center">
                    <div class="w-24 h-24 bg-gov-light rounded-3xl flex items-center justify-center text-gov-blue mb-8 shadow-inner">
                        <i data-lucide="wallet" class="w-10 h-10"></i>
                    </div>
                    <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter mb-2">Gestion des Liquidités</h3>
                    <p class="text-gray-500 text-sm mb-12 max-w-md">Déposez ou retirez instantanément vos fonds pour vos besoins courants en ville.</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
                        <div class="space-y-6 p-8 bg-gov-light rounded-[32px] border border-gray-100 shadow-inner">
                            <div class="flex justify-between items-center px-2">
                                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Solde Liquide</span>
                                <span class="font-mono font-black text-lg text-emerald-600">$ ${cashBalance.toLocaleString()}</span>
                            </div>
                            <form onsubmit="actions.bankDeposit(event)" class="space-y-4">
                                <div class="relative">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-black text-gov-blue text-lg">$</span>
                                    <input type="number" name="amount" placeholder="Montant du dépôt" class="w-full pl-10 pr-4 py-5 bg-white border-none rounded-2xl text-lg font-mono font-black shadow-sm focus:ring-2 focus:ring-gov-blue/20" max="${cashBalance}">
                                </div>
                                <button class="w-full py-5 bg-gov-blue text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-xl">Verser sur mon compte</button>
                            </form>
                        </div>

                        <div class="space-y-6 p-8 bg-gov-light rounded-[32px] border border-gray-100 shadow-inner">
                            <div class="flex justify-between items-center px-2">
                                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Solde Bancaire</span>
                                <span class="font-mono font-black text-lg text-gov-blue">$ ${bankBalance.toLocaleString()}</span>
                            </div>
                            <form onsubmit="actions.bankWithdraw(event)" class="space-y-4">
                                <div class="relative">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-black text-gov-blue text-lg">$</span>
                                    <input type="number" name="amount" placeholder="Montant du retrait" class="w-full pl-10 pr-4 py-5 bg-white border-none rounded-2xl text-lg font-mono font-black shadow-sm focus:ring-2 focus:ring-gov-blue/20" max="${bankBalance}">
                                </div>
                                <button class="w-full py-5 bg-gov-text text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gov-blue transition-all shadow-xl">Retirer en espèces</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } 
    
    else if (activeTab === 'transfer') {
        subContent = `
            <div class="bg-white p-12 rounded-[48px] border border-gray-100 shadow-2xl animate-in max-w-4xl mx-auto">
                <div class="flex items-center gap-6 mb-12 border-b border-gray-50 pb-8">
                    <div class="w-16 h-16 bg-gov-light rounded-2xl flex items-center justify-center text-gov-blue"><i data-lucide="send" class="w-8 h-8"></i></div>
                    <div>
                        <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter">Virement Bancaire</h3>
                        <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Émission de fonds par protocole sécurisé</p>
                    </div>
                </div>

                <form onsubmit="actions.bankTransfer(event)" class="space-y-10" autocomplete="off">
                    <div class="relative">
                        <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-3 block">Identité du Destinataire (Recherche CAD)</label>
                        <div class="relative group">
                            <i data-lucide="search" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gov-blue transition-colors"></i>
                            <input type="text" id="recipient_search" placeholder="Nom ou Prénom du citoyen..." oninput="actions.searchRecipients(this.value)" class="w-full py-5 pl-12 pr-4 rounded-2xl text-base bg-gov-light border-none outline-none focus:ring-2 focus:ring-gov-blue/20 font-bold uppercase italic tracking-tight">
                        </div>
                        <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-[32px] mt-3 max-h-60 overflow-y-auto shadow-2xl hidden z-50 p-2 border border-gray-200"></div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-3">
                            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1">Somme de l'ordre ($)</label>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-black text-gov-blue text-lg">$</span>
                                <input type="number" name="amount" placeholder="0" min="1" max="${bankBalance}" class="w-full pl-10 p-5 rounded-2xl font-mono text-2xl font-black bg-gov-light border-none shadow-inner" required>
                            </div>
                            <div class="text-[9px] text-gray-400 font-bold ml-1 uppercase">Solde disponible : $ ${bankBalance.toLocaleString()}</div>
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1">Libellé du virement</label>
                            <input type="text" name="description" placeholder="Ex: Paiement facture, don, prêt..." class="w-full p-5 rounded-2xl text-base italic bg-gov-light border-none shadow-inner font-medium">
                        </div>
                    </div>

                    <button type="submit" class="w-full py-6 bg-gov-blue text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-black transition-all transform active:scale-95 flex items-center justify-center gap-4">
                        <i data-lucide="shield-check" class="w-5 h-5"></i> SIGNER L'ORDRE DE VIREMENT
                    </button>
                </form>
            </div>
        `;
    }

    else if (activeTab === 'savings') {
        subContent = `
            <div class="max-w-2xl mx-auto animate-in">
                <div class="bg-[#0f172a] p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden text-center border-t-8 border-emerald-500">
                    <div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-500/30 mb-10">
                        <i data-lucide="shield" class="w-4 h-4"></i> Fonds d'Épargne Garanti
                    </div>
                    <h3 class="text-5xl font-black italic uppercase tracking-tighter mb-4">Plan <span class="text-emerald-400">Épargne.</span></h3>
                    <p class="text-gray-400 text-sm mb-12 max-w-xs mx-auto">Placez vos capitaux pour générer des intérêts automatiques chaque semaine.</p>
                    
                    <div class="text-7xl font-mono font-black text-white mb-16 tracking-tighter drop-shadow-2xl">$ ${savingsBalance.toLocaleString()}</div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="bg-white/5 p-6 rounded-[32px] border border-white/10">
                            <div class="text-[9px] text-gray-500 uppercase font-black mb-4 tracking-widest">Alimentation Livret</div>
                            <form onsubmit="actions.transferToSavings(event)" class="space-y-4">
                                <input type="number" name="amount" placeholder="Somme à épargner" class="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-sm font-mono text-white text-center" max="${bankBalance}">
                                <button class="w-full py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-emerald-500 transition-all">Placer les fonds</button>
                            </form>
                        </div>
                        <div class="bg-white/5 p-6 rounded-[32px] border border-white/10">
                            <div class="text-[9px] text-gray-500 uppercase font-black mb-4 tracking-widest">Liquidation Capital</div>
                            <form onsubmit="actions.withdrawFromSavings(event)" class="space-y-4">
                                <input type="number" name="amount" placeholder="Somme à débloquer" class="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-sm font-mono text-white text-center" max="${savingsBalance}">
                                <button class="w-full py-4 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-white/20 transition-all">Débloquer</button>
                            </form>
                        </div>
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
                let bgColor = 'bg-white';
                if (t.type === 'deposit') { color = 'text-emerald-600'; sign = '+'; bgColor = 'bg-emerald-50/30'; }
                else if (t.type === 'withdraw') { color = 'text-red-600'; sign = '-'; bgColor = 'bg-red-50/30'; }
                else if (t.type === 'transfer') {
                    if (t.receiver_id === state.activeCharacter.id) { color = 'text-emerald-600'; sign = '+'; bgColor = 'bg-blue-50/30'; }
                    else { color = 'text-red-600'; sign = '-'; bgColor = 'bg-orange-50/30'; }
                }

                return `
                    <div class="p-6 ${bgColor} rounded-[28px] border border-gray-100 flex items-center justify-between hover:border-gov-blue/20 transition-all shadow-sm">
                        <div class="flex items-center gap-6">
                            <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                                <i data-lucide="${sign === '+' ? 'arrow-down-left' : 'arrow-up-right'}" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <div class="text-sm font-black text-gov-text uppercase italic tracking-tight">${t.description || t.type}</div>
                                <div class="text-[9px] text-gray-400 font-mono mt-1">${new Date(t.created_at).toLocaleString('fr-FR')} • REF: #${t.id.substring(0,8).toUpperCase()}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-mono font-black text-2xl ${color}">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                            <div class="text-[8px] text-gray-400 uppercase font-bold tracking-tighter">Certification Étatique</div>
                        </div>
                    </div>
                `;
            }).join('') : '<div class="text-center py-32 text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] border-4 border-dashed border-gray-100 rounded-[48px]">Aucune transaction répertoriée</div>';

        subContent = `
            <div class="max-w-5xl mx-auto animate-in space-y-4">
                <div class="flex justify-between items-center mb-8 px-2">
                    <h3 class="text-xl font-black text-gov-text uppercase tracking-tight italic">Journal des Flux Certifié</h3>
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${state.transactions.length} Entrées</div>
                </div>
                ${historyHtml}
            </div>
        `;
    }

    return `
        <div class="h-full flex flex-col bg-[#F6F6F6] overflow-hidden animate-fade-in">
            ${backHeader}
            <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div class="max-w-7xl mx-auto pb-20">
                    ${subContent}
                </div>
            </div>
        </div>
    `;
};
