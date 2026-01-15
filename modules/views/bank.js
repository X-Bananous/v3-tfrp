
import { state } from '../state.js';

export const BankView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full"><div class="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mb-4"></div>Établissement du canal sécurisé...</div>';
    
    let content = '';
    const activeTab = state.activeBankTab || 'overview';

    // --- TAB: OVERVIEW ---
    if (activeTab === 'overview') {
        content = `
            <div class="space-y-12 animate-in pb-10">
                 <div class="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <!-- Physical Card Visualization -->
                    <div class="relative group perspective-1000">
                        <div class="p-10 rounded-[35px] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#000000] relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-700 hover:rotate-1 border border-white/10">
                            <div class="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            <div class="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/5 rounded-full blur-[60px] -ml-20 -mb-20"></div>
                            
                            <div class="flex justify-between items-start mb-16 relative z-10">
                                <div class="flex items-center gap-5">
                                    <div class="w-14 h-11 rounded-lg bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 flex items-center justify-center border border-yellow-200/50 shadow-inner">
                                        <div class="w-8 h-6 border border-black/10 rounded flex flex-col justify-between p-1">
                                            <div class="h-[1px] bg-black/20 w-full"></div>
                                            <div class="h-[1px] bg-black/20 w-full"></div>
                                            <div class="h-[1px] bg-black/20 w-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-[9px] font-black text-blue-200 uppercase tracking-[0.4em] mb-1">PLATINUM WORLD ELITE</div>
                                        <div class="text-sm font-bold text-white tracking-[0.2em] font-mono">**** **** **** ${state.activeCharacter.id.substring(0,4).toUpperCase()}</div>
                                    </div>
                                </div>
                                <div class="w-12 h-12 flex items-center justify-center">
                                    <i data-lucide="landmark" class="w-8 h-8 text-white opacity-40"></i>
                                </div>
                            </div>

                            <div class="mb-12 relative z-10">
                                <div class="text-[10px] text-blue-200/50 uppercase font-black tracking-[0.3em] mb-3">Balance disponible</div>
                                <div class="text-6xl font-mono font-black text-white tracking-tighter drop-shadow-2xl">$ ${state.bankAccount.bank_balance.toLocaleString()}</div>
                            </div>

                            <div class="flex justify-between items-end relative z-10">
                                <div>
                                    <div class="text-[8px] text-blue-200/40 uppercase font-bold tracking-widest mb-1">Titulaire</div>
                                    <div class="text-lg font-black text-white uppercase italic tracking-tight">${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</div>
                                </div>
                                <div class="flex flex-col items-end">
                                     <div class="flex gap-1.5 mb-2">
                                        <div class="w-8 h-8 rounded-full bg-red-600/80 blur-[1px]"></div>
                                        <div class="w-8 h-8 rounded-full bg-orange-500/80 blur-[1px] -ml-4"></div>
                                     </div>
                                     <div class="text-[8px] text-white/40 font-black uppercase tracking-widest italic">TFRP SECURE CORP.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Liquid Assets Display -->
                    <div class="relative group h-full">
                        <div class="p-10 rounded-[35px] bg-white border border-gray-100 relative overflow-hidden shadow-2xl h-full flex flex-col justify-between">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-gov-light rounded-full blur-[70px] -mr-16 -mt-16"></div>
                            
                            <div class="flex justify-between items-start relative z-10">
                                <div class="flex items-center gap-4">
                                    <div class="w-14 h-14 rounded-2xl bg-gov-light flex items-center justify-center text-gov-text border border-gray-100">
                                        <i data-lucide="wallet" class="w-7 h-7"></i>
                                    </div>
                                    <div>
                                        <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Fonds Physiques</h3>
                                        <p class="text-[10px] text-gray-500 font-bold">Liquidités en main</p>
                                    </div>
                                </div>
                                <button onclick="actions.refreshCurrentView()" class="p-3 rounded-xl bg-gov-light text-gray-400 hover:text-gov-blue transition-all">
                                    <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                                </button>
                            </div>

                            <div class="my-10 relative z-10">
                                <div class="text-6xl font-mono font-black text-gov-text tracking-tighter">$ ${state.bankAccount.cash_balance.toLocaleString()}</div>
                            </div>

                            <div class="flex items-center gap-4 bg-orange-50 p-5 rounded-2xl border border-orange-100 relative z-10">
                                <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange-600 shrink-0 shadow-sm">
                                    <i data-lucide="shield-off" class="w-6 h-6"></i>
                                </div>
                                <p class="text-[11px] text-orange-800 font-medium leading-relaxed italic">
                                    Attention : Les fonds physiques ne sont pas assurés par le fond de garantie national en cas de saisie ou de perte.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ATM Quick Actions -->
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <div class="bg-white p-10 rounded-[35px] border border-gray-100 shadow-xl relative overflow-hidden group">
                        <div class="flex items-center gap-5 mb-10">
                            <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                                <i data-lucide="arrow-down-circle" class="w-7 h-7"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-black text-gov-text uppercase italic tracking-tighter">Déposer au guichet</h3>
                                <p class="text-[9px] text-gray-400 font-black uppercase tracking-widest">Alimenter votre compte platine</p>
                            </div>
                        </div>
                        
                        <form onsubmit="actions.bankDeposit(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-2xl">$</span>
                                <input type="number" name="amount" placeholder="0.00" min="1" max="${state.bankAccount.cash_balance}" class="w-full py-6 pl-14 pr-8 rounded-2xl text-3xl font-mono font-black bg-gov-light border-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-300" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-2xl bg-[#0f172a] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3">
                                CONFIRMER LE DÉPÔT <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </button>
                        </form>
                    </div>

                    <div class="bg-white p-10 rounded-[35px] border border-gray-100 shadow-xl relative overflow-hidden group">
                        <div class="flex items-center gap-5 mb-10">
                            <div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shadow-sm">
                                <i data-lucide="arrow-up-circle" class="w-7 h-7"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-black text-gov-text uppercase italic tracking-tighter">Retrait Express</h3>
                                <p class="text-[9px] text-gray-400 font-black uppercase tracking-widest">Obtenir des liquidités physiques</p>
                            </div>
                        </div>
                        
                        <form onsubmit="actions.bankWithdraw(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-red-600 font-black text-2xl">$</span>
                                <input type="number" name="amount" placeholder="0.00" min="1" max="${state.bankAccount.bank_balance}" class="w-full py-6 pl-14 pr-8 rounded-2xl text-3xl font-mono font-black bg-gov-light border-none focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder:text-gray-300" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-2xl bg-[#0f172a] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-red-600 transition-all shadow-xl flex items-center justify-center gap-3">
                                VALIDER LE RETRAIT <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </button>
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
            <div class="space-y-10 animate-in pb-10 max-w-5xl mx-auto">
                <div class="p-12 rounded-[45px] bg-[#020617] text-white shadow-[0_40px_80px_rgba(0,0,0,0.4)] relative overflow-hidden border border-white/5">
                    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                    <div class="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
                    
                    <div class="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                        <div class="text-center md:text-left flex-1">
                            <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-300 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-blue-500/20 mb-8">
                                <i data-lucide="shield-check" class="w-4 h-4"></i> LIVRET SÉCURISÉ TFRP
                            </div>
                            <h2 class="text-6xl font-black italic uppercase tracking-tighter mb-4 leading-none">Gestion de<br><span class="text-emerald-400">Fortune.</span></h2>
                            <p class="text-gray-400 text-sm max-w-sm font-medium leading-relaxed">Faites fructifier votre capital avec un rendement garanti de <span class="text-white font-black underline decoration-emerald-500 decoration-2 underline-offset-4">${state.savingsRate}%</span> par cycle hebdomadaire.</p>
                        </div>
                        <div class="bg-white/5 backdrop-blur-3xl p-12 rounded-[40px] border border-white/10 text-center min-w-[360px] shadow-2xl">
                            <div class="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-3">Capital Épargné</div>
                            <div class="text-6xl font-mono font-black text-emerald-400 tracking-tighter drop-shadow-lg">$ ${savingsBalance.toLocaleString()}</div>
                            <div class="mt-8 text-[9px] text-gray-600 uppercase font-bold tracking-widest flex items-center justify-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Génération d'intérêts active
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div class="bg-white p-10 rounded-[35px] border border-gray-100 shadow-xl group">
                        <div class="flex items-center gap-4 mb-10">
                            <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
                                <i data-lucide="trending-up" class="w-7 h-7"></i>
                            </div>
                            <h3 class="text-lg font-black text-gov-text uppercase tracking-tighter italic">Alimenter l'épargne</h3>
                        </div>
                        <form onsubmit="actions.transferToSavings(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 font-black text-2xl">$</span>
                                <input type="number" name="amount" placeholder="Montant à placer..." min="1" max="${state.bankAccount.bank_balance}" class="w-full py-6 pl-14 pr-8 rounded-2xl text-2xl font-mono font-black bg-gov-light border-none outline-none focus:ring-2 focus:ring-blue-500/20" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/20">TRANSFÉRER VERS ÉPARGNE</button>
                        </form>
                    </div>

                    <div class="bg-white p-10 rounded-[35px] border border-gray-100 shadow-xl group">
                        <div class="flex items-center gap-4 mb-10">
                            <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:scale-110 transition-transform">
                                <i data-lucide="trending-down" class="w-7 h-7"></i>
                            </div>
                            <h3 class="text-lg font-black text-gov-text uppercase tracking-tighter italic">Liquidation Partielle</h3>
                        </div>
                        <form onsubmit="actions.withdrawFromSavings(event)" class="space-y-6">
                            <div class="relative">
                                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-2xl">$</span>
                                <input type="number" name="amount" placeholder="Montant à débloquer..." min="1" max="${savingsBalance}" class="w-full py-6 pl-14 pr-8 rounded-2xl text-2xl font-mono font-black bg-gov-light border-none outline-none focus:ring-2 focus:ring-gray-300" required>
                            </div>
                            <button type="submit" class="w-full py-5 rounded-2xl bg-white border-2 border-gray-100 text-gray-500 hover:text-black hover:border-black font-black text-xs uppercase tracking-[0.3em] transition-all">RETOUR COMPTE COURANT</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB: OPERATIONS (TRANSFER) ---
    else if (activeTab === 'operations') {
        content = `
             <div class="flex items-center justify-center h-full animate-in pb-20">
                 <div class="p-12 rounded-[45px] w-full max-w-2xl border border-gray-100 bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-3 bg-blue-600"></div>
                    <div class="text-center mb-12">
                        <div class="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-700 mx-auto mb-8 shadow-sm">
                            <i data-lucide="send" class="w-10 h-10"></i>
                        </div>
                        <h2 class="text-4xl font-black text-gov-text uppercase italic tracking-tighter">Virement Instantané</h2>
                        <p class="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center justify-center gap-3">
                            <span class="w-4 h-px bg-gray-200"></span> Chiffrement de transaction AES-256 <span class="w-4 h-px bg-gray-200"></span>
                        </p>
                    </div>
                    
                    <form onsubmit="actions.bankTransfer(event)" class="space-y-10" autocomplete="off">
                        <div class="relative">
                            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-2 mb-3 block">Destinataire du transfert</label>
                            <input type="hidden" name="target_id" value="${state.selectedRecipient ? state.selectedRecipient.id : ''}" required>
                            <div class="relative group">
                                <i data-lucide="user" class="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors"></i>
                                <input type="text" id="recipient_search" placeholder="Nom, Prénom ou ID..." value="${state.selectedRecipient ? state.selectedRecipient.name : ''}" oninput="actions.searchRecipients(this.value)" class="w-full py-6 pl-16 pr-8 rounded-2xl text-sm font-bold bg-gov-light border-none outline-none focus:ring-4 focus:ring-blue-600/5 transition-all ${state.selectedRecipient ? 'text-blue-700 uppercase tracking-tight' : ''}" autocomplete="off" ${state.selectedRecipient ? 'readonly' : ''}>
                                ${state.selectedRecipient ? `<button type="button" onclick="actions.clearRecipient()" class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><i data-lucide="x-circle" class="w-6 h-6"></i></button>` : ''}
                            </div>
                            <div id="search-results-container" class="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-3xl mt-3 max-h-60 overflow-y-auto shadow-2xl custom-scrollbar hidden z-50 animate-in"></div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div class="space-y-3">
                                <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-2 block">Montant ($)</label>
                                <div class="relative">
                                    <span class="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 font-black text-2xl">$</span>
                                    <input type="number" name="amount" placeholder="0" min="1" max="${state.bankAccount.bank_balance}" class="w-full py-6 pl-14 pr-8 rounded-2xl font-mono text-2xl font-black bg-gov-light border-none outline-none focus:ring-4 focus:ring-blue-600/5" required>
                                </div>
                            </div>
                            <div class="space-y-3">
                                <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-2 block">Libellé / Référence</label>
                                <input type="text" name="description" placeholder="Ex: Paiement facture..." maxlength="50" class="w-full py-6 px-8 rounded-2xl text-sm font-medium bg-gov-light border-none outline-none focus:ring-4 focus:ring-blue-600/5 italic text-gray-600">
                            </div>
                        </div>

                        <button type="submit" class="w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.5em] bg-[#0f172a] hover:bg-blue-600 text-white shadow-2xl transition-all transform active:scale-[0.98]">
                            EXÉCUTER LE TRANSFERT
                        </button>
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
            if (t.type === 'deposit') {
                icon = 'plus'; color = 'text-emerald-500'; label = 'Crédit Cash'; sign = '+'; bgIcon = 'bg-emerald-50 text-emerald-600';
            } else if (t.type === 'withdraw') {
                icon = 'minus'; color = 'text-gray-400'; label = 'Débit Cash'; sign = '-'; bgIcon = 'bg-gray-50 text-gray-400';
            } else if (t.type === 'transfer') {
                if (t.receiver_id === state.activeCharacter.id) {
                    icon = 'arrow-down-left'; color = 'text-blue-500'; label = 'Virement Reçu'; sign = '+'; bgIcon = 'bg-blue-50 text-blue-600';
                } else {
                    icon = 'arrow-up-right'; color = 'text-red-500'; label = 'Virement Émis'; sign = '-'; bgIcon = 'bg-red-50 text-red-600';
                }
            } else if (t.type === 'admin_adjustment') {
                icon = 'shield-check'; label = 'Régularisation'; bgIcon = 'bg-purple-50 text-purple-600';
                if (t.amount >= 0) { color = 'text-emerald-500'; sign = '+'; } else { color = 'text-red-500'; sign = '-'; }
            }
            return `
                <div class="flex items-center justify-between p-6 bg-white rounded-[30px] border border-gray-100 hover:shadow-xl transition-all group border-l-8 ${t.amount < 0 || (t.type === 'transfer' && t.sender_id === state.activeCharacter.id) ? 'border-l-red-500' : 'border-l-emerald-500'}">
                    <div class="flex items-center gap-6">
                        <div class="w-16 h-16 rounded-2xl ${bgIcon} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                            <i data-lucide="${icon}" class="w-8 h-8"></i>
                        </div>
                        <div>
                            <div class="font-black text-gov-text text-lg uppercase italic tracking-tight mb-0.5">${label}</div>
                            <div class="text-[10px] text-gray-400 font-mono uppercase font-bold tracking-widest">${new Date(t.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-mono font-black text-2xl ${color} tracking-tighter">${sign} $${Math.abs(t.amount).toLocaleString()}</div>
                        <div class="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1 italic">${t.description || 'Transaction Bancaire'}</div>
                    </div>
                </div>
            `;
        }).join('') 
        : '<div class="text-center text-gray-400 py-32 flex flex-col items-center justify-center opacity-30"><i data-lucide="history" class="w-16 h-16 mb-4"></i><span class="text-sm font-black uppercase tracking-[0.4em]">Aucune transaction répertoriée</span></div>';

        content = `
            <div class="flex flex-col h-full animate-in max-w-4xl mx-auto pb-10">
                <div class="mb-12 text-center">
                    <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter">Archives Monétaires</h3>
                    <p class="text-xs text-gray-400 font-black uppercase tracking-widest mt-2 flex items-center justify-center gap-3">
                        <span class="w-8 h-px bg-gray-200"></span> Relevé de compte certifié <span class="w-8 h-px bg-gray-200"></span>
                    </p>
                </div>
                <div class="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-3 pb-20">
                    ${historyHtml}
                </div>
            </div>
        `;
    }

    return `
        <div class="h-full flex flex-col bg-[#F8FAFC] overflow-hidden animate-fade-in">
            <!-- Header Streamlined -->
            <div class="px-10 pt-10 pb-6 shrink-0 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-200 bg-white">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span class="text-[10px] text-emerald-600 font-black uppercase tracking-[0.3em]">Connexion Sécurisée Active</span>
                    </div>
                    <h2 class="text-4xl font-black text-gov-text flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                        <i data-lucide="landmark" class="w-10 h-10 text-[#0f172a]"></i> 
                        ${activeTab === 'overview' ? 'Tableau de bord' : activeTab === 'savings' ? 'Espace Épargne' : activeTab === 'operations' ? 'Virements' : 'Historique'}
                    </h2>
                </div>

                <div class="flex items-center gap-6">
                    <div class="text-right">
                        <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest">Solde Global Consolidé</div>
                        <div class="text-2xl font-mono font-black text-gov-text">$ ${(state.bankAccount.bank_balance + state.bankAccount.cash_balance + (state.bankAccount.savings_balance || 0)).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 p-10 overflow-y-auto custom-scrollbar">
                <div class="max-w-7xl mx-auto h-full">
                    ${content}
                </div>
            </div>
            
            <!-- Footer Bank Branding -->
            <div class="bg-white border-t border-gray-200 py-4 px-10 flex justify-between items-center opacity-50">
                <div class="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">United Bank of California • Financial Terminal v6.4</div>
                <div class="flex gap-4">
                    <i data-lucide="shield-check" class="w-4 h-4 text-emerald-500"></i>
                    <i data-lucide="cpu" class="w-4 h-4 text-blue-500"></i>
                    <i data-lucide="wifi" class="w-4 h-4 text-blue-500"></i>
                </div>
            </div>
        </div>
    `;
};
