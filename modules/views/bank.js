
import { state } from '../state.js';

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full"><div class="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mb-4"></div>Établissement du canal sécurisé...</div>';
    
    const tabs = [
        { id: 'overview', label: 'Dashboard', icon: 'layout-grid' },
        { id: 'savings', label: 'Épargne', icon: 'piggy-bank' },
        { id: 'operations', label: 'Virement', icon: 'send' },
        { id: 'history', label: 'Historique', icon: 'scroll-text' }
    ];

    let content = '';

    // --- TAB: OVERVIEW ---
    if (state.activeBankTab === 'overview') {
        content = `
            <div class="space-y-8 animate-in pb-10">
                 <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <!-- Premium Bank Card -->
                    <div class="relative group perspective-1000">
                        <div class="p-10 rounded-[35px] bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#000000] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-700 hover:rotate-1">
                            <div class="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[90px] -mr-32 -mt-32"></div>
                            <div class="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-[60px] -ml-20 -mb-20"></div>
                            
                            <div class="flex justify-between items-start mb-16 relative z-10">
                                <div class="flex items-center gap-5">
                                    <div class="w-16 h-12 rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center border border-yellow-100/50 shadow-[0_5px_15px_rgba(0,0,0,0.2)] overflow-hidden">
                                        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                        <div class="w-8 h-6 border border-black/10 rounded flex flex-col justify-between p-1"><div class="h-[1px] bg-black/20 w-full"></div><div class="h-[1px] bg-black/20 w-full"></div><div class="h-[1px] bg-black/20 w-full"></div></div>
                                    </div>
                                    <div>
                                        <div class="text-[9px] font-black text-blue-200 uppercase tracking-[0.4em] mb-1">PLATINUM CARD</div>
                                        <div class="text-sm font-bold text-white tracking-[0.2em] font-mono">**** **** **** ${state.activeCharacter.id.substring(0,4).toUpperCase()}</div>
                                    </div>
                                </div>
                                <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <i data-lucide="landmark" class="w-6 h-6 text-white opacity-60"></i>
                                </div>
                            </div>

                            <div class="mb-12 relative z-10">
                                <div class="text-[10px] text-blue-200/50 uppercase font-black tracking-widest mb-3">Balance Disponibilité</div>
                                <div class="text-6xl font-mono font-black text-white tracking-tighter drop-shadow-2xl">$ ${state.bankAccount.bank_balance.toLocaleString()}</div>
                            </div>

                            <div class="flex justify-between items-end relative z-10">
                                <div>
                                    <div class="text-[8px] text-blue-200/40 uppercase font-bold tracking-widest mb-1">Titulaire de Compte</div>
                                    <div class="text-lg font-black text-white uppercase italic tracking-tight">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                                </div>
                                <div class="flex flex-col items-end">
                                     <div class="flex gap-1.5 mb-2">
                                        <div class="w-8 h-8 rounded-full bg-red-500/80 blur-[2px]"></div>
                                        <div class="w-8 h-8 rounded-full bg-yellow-500/80 blur-[2px] -ml-4"></div>
                                     </div>
                                     <div class="text-[8px] text-white/40 font-black uppercase tracking-widest italic">TFRP WORLD ELITE</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modern Cash Box -->
                    <div class="relative group">
                        <div class="p-10 rounded-[35px] bg-[#f8fafc] border border-gray-200 relative overflow-hidden shadow-xl h-full flex flex-col justify-between">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-gov-light rounded-full blur-[70px] -mr-16 -mt-16"></div>
                            
                            <div class="flex justify-between items-start relative z-10">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gov-text border border-gray-100 shadow-sm">
                                        <i data-lucide="wallet" class="w-6 h-6"></i>
                                    </div>
                                    <div>
                                        <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest">Liquidité Physique</h3>
                                        <p class="text-[9px] text-gray-400 font-bold uppercase">Espèces en main</p>
                                    </div>
                                </div>
                                <button onclick="actions.refreshCurrentView()" class="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gov-blue transition-all hover:shadow-md">
                                    <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                </button>
                            </div>

                            <div class="my-8 relative z-10">
                                <div class="text-6xl font-mono font-black text-gov-text tracking-tighter">$ ${state.bankAccount.cash_balance.toLocaleString()}</div>
                            </div>

                            <div class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative z-10">
                                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                    <i data-lucide="shield-off" class="w-5 h-5"></i>
                                </div>
                                <div class="text-[10px] text-gray-600 font-medium leading-relaxed italic">
                                    Note de sécurité : Ces fonds ne sont pas traçables par l'institution bancaire.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <!-- ATM DEPOSIT -->
                    <div class="bg-white p-10 rounded-[35px] border border-gray-100 shadow-xl relative overflow-hidden group">
                        <div class="absolute top-0 left-0 w-full h-1 bg-emerald-500/20 group-hover:bg-emerald-500 transition-all"></div>
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                <i data-lucide="arrow-down-to-line" class="w-6 h-6"></i>
                            </div>
                            <h3 class="text-base font-black text-gov-text uppercase tracking-widest italic">Approvisionner Compte</h3>
                        </div>
                        
                        <form onsubmit="actions.bankDeposit(event)" class="space-y-6">
                            <div class="relative">
                                <div class="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xl">$</div>
                                <input type="number" name="amount" placeholder="0.00" min="1" max="${state.bankAccount.cash_balance}" class="w-full py-6 pl-12 pr-6 rounded-2xl text-2xl font-mono font-black bg-gov-light border-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-300" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-2xl bg-[#0f172a] text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-3">
                                CONFIRMER LE DÉPÔT <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            </button>
                        </form>
                    </div>

                    <!-- ATM WITHDRAWAL -->
                    <div class="bg-white p-10 rounded-[35px] border border-gray-100 shadow-xl relative overflow-hidden group">
                        <div class="absolute top-0 left-0 w-full h-1 bg-red-500/20 group-hover:bg-red-500 transition-all"></div>
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                                <i data-lucide="arrow-up-from-line" class="w-6 h-6"></i>
                            </div>
                            <h3 class="text-base font-black text-gov-text uppercase tracking-widest italic">Retrait de Liquidités</h3>
                        </div>
                        
                        <form onsubmit="actions.bankWithdraw(event)" class="space-y-6">
                            <div class="relative">
                                <div class="absolute left-6 top-1/2 -translate-y-1/2 text-red-600 font-bold text-xl">$</div>
                                <input type="number" name="amount" placeholder="0.00" min="1" max="${state.bankAccount.bank_balance}" class="w-full py-6 pl-12 pr-6 rounded-2xl text-2xl font-mono font-black bg-gov-light border-none focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder:text-gray-300" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-2xl bg-[#0f172a] text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-3">
                                VALIDER LE RETRAIT <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB: SAVINGS ---
    else if (state.activeBankTab === 'savings') {
        const savingsBalance = state.bankAccount.savings_balance || 0;
        content = `
            <div class="space-y-8 animate-in pb-10 max-w-5xl mx-auto">
                <div class="p-12 rounded-[40px] bg-[#0f172a] text-white shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                    <div class="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
                    
                    <div class="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                        <div class="text-center md:text-left">
                            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/30 mb-6">
                                <i data-lucide="shield-check" class="w-4 h-4"></i> LIVRET SÉCURISÉ
                            </div>
                            <h2 class="text-5xl font-black italic uppercase tracking-tighter mb-3 leading-none">Épargne<br><span class="text-emerald-400">Patrimoniale.</span></h2>
                            <p class="text-gray-400 text-sm max-w-sm">Taux de rendement hebdomadaire garanti de <span class="text-white font-bold">${state.savingsRate}%</span>. Vos fonds travaillent pour vous.</p>
                        </div>
                        <div class="bg-white/5 backdrop-blur-xl p-10 rounded-[35px] border border-white/10 text-center min-w-[320px] shadow-2xl">
                            <div class="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Capital en Gestion</div>
                            <div class="text-6xl font-mono font-black text-emerald-400 tracking-tighter">$ ${savingsBalance.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-white p-10 rounded-[35px] border border-gray-100 shadow-xl">
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                <i data-lucide="trending-up" class="w-6 h-6"></i>
                            </div>
                            <h3 class="text-base font-black text-gov-text uppercase tracking-widest italic">Alimenter l'Épargne</h3>
                        </div>
                        <form onsubmit="actions.transferToSavings(event)" class="space-y-6">
                            <div class="relative">
                                <div class="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-xl">$</div>
                                <input type="number" name="amount" placeholder="Somme à placer..." min="1" max="${state.bankAccount.bank_balance}" class="w-full py-6 pl-12 pr-6 rounded-2xl text-2xl font-mono font-black bg-gov-light border-none outline-none focus:ring-2 focus:ring-blue-500/20" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/20">PLACER LES FONDS</button>
                        </form>
                    </div>
                    <div class="bg-white p-10 rounded-[35px] border border-gray-100 shadow-xl">
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                <i data-lucide="trending-down" class="w-6 h-6"></i>
                            </div>
                            <h3 class="text-base font-black text-gov-text uppercase tracking-widest italic">Liquidation Partielle</h3>
                        </div>
                        <form onsubmit="actions.withdrawFromSavings(event)" class="space-y-6">
                            <div class="relative">
                                <div class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">$</div>
                                <input type="number" name="amount" placeholder="Somme à débloquer..." min="1" max="${savingsBalance}" class="w-full py-6 pl-12 pr-6 rounded-2xl text-2xl font-mono font-black bg-gov-light border-none outline-none focus:ring-2 focus:ring-gray-300" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-2xl bg-white border-2 border-gray-100 text-gray-500 hover:text-black hover:border-black font-black text-xs uppercase tracking-[0.3em] transition-all">RETOUR COMPTE COURANT</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB: OPERATIONS ---
    else if (state.activeBankTab === 'operations') {
        content = `
             <div class="flex items-center justify-center h-full animate-in pb-20">
                 <div class="p-12 rounded-[40px] w-full max-w-2xl border border-gray-100 bg-white shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-2 bg-[#1e3a8a]"></div>
                    <div class="text-center mb-12">
                        <div class="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-700 mx-auto mb-6 shadow-sm">
                            <i data-lucide="send" class="w-10 h-10"></i>
                        </div>
                        <h2 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter">Virement de Fonds</h2>
                        <p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Protocole de transfert inter-citoyens sécurisé</p>
                    </div>
                    
                    <form onsubmit="actions.bankTransfer(event)" class="space-y-8" autocomplete="off">
                        <div class="relative">
                            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1 mb-2 block">Destinataire</label>
                            <input type="hidden" name="target_id" value="${state.selectedRecipient ? state.selectedRecipient.id : ''}" required>
                            <div class="relative group">
                                <i data-lucide="search" class="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors"></i>
                                <input type="text" id="recipient_search" placeholder="Nom ou Prénom..." value="${state.selectedRecipient ? state.selectedRecipient.name : ''}" oninput="actions.searchRecipients(this.value)" class="w-full py-5 pl-14 pr-6 rounded-2xl text-sm bg-gov-light border-none outline-none focus:ring-2 focus:ring-blue-600/10 transition-all ${state.selectedRecipient ? 'text-blue-700 font-bold uppercase' : ''}" autocomplete="off" ${state.selectedRecipient ? 'readonly' : ''}>
                                ${state.selectedRecipient ? `<button type="button" onclick="actions.clearRecipient()" class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><i data-lucide="x" class="w-5 h-5"></i></button>` : ''}
                            </div>
                            <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-2xl mt-2 max-h-56 overflow-y-auto shadow-2xl custom-scrollbar hidden z-50 animate-in"></div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="space-y-2">
                                <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1 block">Montant du Transfert</label>
                                <div class="relative">
                                    <span class="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600 font-black text-xl">$</span>
                                    <input type="number" name="amount" placeholder="0" min="1" max="${state.bankAccount.bank_balance}" class="w-full py-5 pl-12 pr-6 rounded-2xl font-mono text-xl font-black bg-gov-light border-none outline-none focus:ring-2 focus:ring-blue-600/10" required>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1 block">Référence / Libellé</label>
                                <input type="text" name="description" placeholder="Ex: Services..." maxlength="50" class="w-full py-5 px-6 rounded-2xl text-sm bg-gov-light border-none outline-none focus:ring-2 focus:ring-blue-600/10 italic">
                            </div>
                        </div>

                        <button type="submit" class="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.4em] bg-[#0f172a] hover:bg-black text-white shadow-xl shadow-gray-900/10 flex items-center justify-center gap-3 mt-4 transform active:scale-95 transition-all">
                            TRANSFÉRER LES CRÉDITS <i data-lucide="arrow-right" class="w-5 h-5"></i>
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
            let icon, color, label, sign, bgIcon, borderColor;
            if (t.type === 'deposit') {
                icon = 'arrow-down-left'; color = 'text-emerald-600'; label = 'Dépôt Cash'; sign = '+'; bgIcon = 'bg-emerald-50 text-emerald-600'; borderColor='border-emerald-100';
            } else if (t.type === 'withdraw') {
                icon = 'arrow-up-right'; color = 'text-gray-500'; label = 'Retrait ATM'; sign = '-'; bgIcon = 'bg-gray-100 text-gray-500'; borderColor='border-gray-100';
            } else if (t.type === 'transfer') {
                if (t.receiver_id === state.activeCharacter.id) {
                    icon = 'download'; color = 'text-blue-600'; label = 'Virement Reçu'; sign = '+'; bgIcon = 'bg-blue-50 text-blue-600'; borderColor='border-blue-100';
                } else {
                    icon = 'upload'; color = 'text-red-600'; label = 'Virement Envoyé'; sign = '-'; bgIcon = 'bg-red-50 text-red-600'; borderColor='border-red-100';
                }
            } else if (t.type === 'admin_adjustment') {
                icon = 'shield-check'; label = 'Régularisation'; bgIcon = 'bg-purple-50 text-purple-600'; borderColor='border-purple-100';
                if (t.amount >= 0) { color = 'text-emerald-600'; sign = '+'; } else { color = 'text-red-600'; sign = '-'; }
            }
            return `
                <div class="flex items-center justify-between p-6 bg-white rounded-[28px] border border-gray-100 hover:shadow-lg transition-all group">
                    <div class="flex items-center gap-6">
                        <div class="w-14 h-14 rounded-2xl ${bgIcon} flex items-center justify-center border border-transparent shadow-sm group-hover:scale-105 transition-transform">
                            <i data-lucide="${icon}" class="w-7 h-7"></i>
                        </div>
                        <div>
                            <div class="font-black text-gov-text text-base uppercase italic tracking-tight mb-1">${label}</div>
                            <div class="text-[9px] text-gray-400 font-mono uppercase font-bold tracking-widest">${new Date(t.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-mono font-black text-2xl ${color} tracking-tighter">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                        <div class="text-[8px] text-gray-400 uppercase font-black tracking-widest mt-1">${t.description || 'Opération Bancaire'}</div>
                    </div>
                </div>
            `;
        }).join('') 
        : '<div class="text-center text-gray-400 py-32 flex flex-col items-center justify-center opacity-40"><i data-lucide="history" class="w-16 h-16 mb-4"></i><span class="text-xs font-black uppercase tracking-[0.4em]">Aucune archive monétaire</span></div>';

        content = `
            <div class="flex flex-col h-full animate-in max-w-4xl mx-auto pb-10">
                <div class="mb-10 text-center">
                    <h3 class="text-2xl font-black text-gov-text uppercase italic tracking-tighter">Historique des Flux</h3>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Audit complet de vos mouvements de capitaux</p>
                </div>
                <div class="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-12">
                    ${historyHtml}
                </div>
            </div>
        `;
    }

    return `
        <div class="h-full flex flex-col bg-[#F6F6F6] overflow-hidden animate-in">
            <!-- Header Section -->
            <div class="px-8 pt-8 pb-4 shrink-0 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10 border-b border-gray-100 bg-white">
                <div>
                    <h2 class="text-3xl font-black text-gov-text flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                        <i data-lucide="landmark" class="w-9 h-9 text-[#1e3a8a]"></i> Terminal Bancaire
                    </h2>
                    <div class="flex items-center gap-3 mt-1.5">
                        <span class="text-[10px] text-blue-700 font-black uppercase tracking-widest">Compte Platine Certifié</span>
                        <span class="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                        <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest">${tabs.find(t => t.id === state.activeBankTab).label}</span>
                    </div>
                </div>

                <!-- Navigation Desktop (Integrated) -->
                <div class="flex gap-1 p-1 bg-gov-light rounded-2xl border border-gray-100">
                    ${tabs.map(t => `
                        <button onclick="actions.setBankTab('${t.id}')" 
                            class="px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${state.activeBankTab === t.id ? 'bg-white text-blue-800 shadow-md border border-gray-100' : 'text-gray-400 hover:text-gray-700'}">
                            <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i> ${t.label}
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
