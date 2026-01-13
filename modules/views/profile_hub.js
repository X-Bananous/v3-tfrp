import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';
import { loadUserSanctions } from '../actions/profile.js';

export const ProfileHubView = () => {
    const u = state.user;
    if (!u) return '';

    const currentTab = state.activeProfileTab || 'identity';
    const characters = state.characters || [];
    const perms = u.permissions || {};
    const permKeys = Object.keys(perms).filter(k => perms[k] === true);
    const sanctions = state.userSanctions || [];
    const isMobileMenuOpen = state.ui.mobileMenuOpen;

    if (!state.hasFetchedSanctions) {
        state.hasFetchedSanctions = true;
        loadUserSanctions();
    }

    const tabs = [
        { id: 'identity', label: 'Dossiers', icon: 'users' },
        { id: 'perms', label: 'Accréditations', icon: 'shield-check' },
        { id: 'sanctions', label: 'Sanctions', icon: 'alert-triangle' },
        { id: 'security', label: 'Sécurité', icon: 'lock' }
    ];

    let tabContent = '';

    // --- TAB: DOSSIERS (GRID RE-STYLED) ---
    if (currentTab === 'identity') {
        tabContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in pb-20">
                ${characters.map(char => {
                    const isAccepted = char.status === 'accepted';
                    const isDeleting = !!char.deletion_requested_at;
                    const statusColor = isDeleting ? 'orange' : isAccepted ? 'emerald' : 'amber';
                    
                    return `
                        <div class="gov-card flex flex-col bg-white border-gray-900 shadow-xl overflow-hidden transition-all hover:-translate-y-1">
                            <div class="p-8 pb-4 flex justify-between items-start">
                                <div class="w-14 h-14 bg-gov-light border border-gray-900 flex items-center justify-center text-gray-400">
                                    <i data-lucide="user" class="w-7 h-7"></i>
                                </div>
                                <span class="px-3 py-1 text-[8px] font-black uppercase border-2 tracking-widest bg-${statusColor}-50 text-${statusColor}-600 border-${statusColor}-600">
                                    ${isDeleting ? 'PURGE EN COURS' : char.status.toUpperCase()}
                                </span>
                            </div>

                            <div class="p-8 pt-2 flex-1">
                                <div class="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Identité Nationale</div>
                                <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter leading-none mb-6">
                                    ${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span>
                                </h3>
                                
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secteur</span>
                                        <span class="${char.alignment === 'illegal' ? 'text-gov-red' : 'text-gov-blue'} text-[10px] font-black uppercase italic">${char.alignment}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Âge</span>
                                        <span class="text-gov-text text-[10px] font-black">${char.age} ANS</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2">
                                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Référence</span>
                                        <span class="text-gray-400 font-mono text-[9px]">#${char.id.substring(0,8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6 bg-gov-light border-t border-gray-900 flex flex-col gap-2">
                                ${isAccepted && !isDeleting ? `
                                    <button onclick="actions.selectCharacter('${char.id}')" class="w-full py-4 bg-gov-blue text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all border border-gray-900 rounded-none">
                                        CHARGER LE DOSSIER
                                    </button>
                                    <div class="flex gap-2">
                                        <button onclick="actions.startEditCharacter('${char.id}')" class="flex-1 py-2.5 bg-white text-gray-500 hover:text-gov-blue border border-gray-900 transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <i data-lucide="settings" class="w-3.5 h-3.5"></i> ÉDITER
                                        </button>
                                        <button onclick="actions.requestCharacterDeletion('${char.id}')" class="flex-1 py-2.5 bg-white text-gray-400 hover:text-gov-red border border-gray-900 transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> PURGER
                                        </button>
                                    </div>
                                ` : isDeleting ? `
                                    <div class="text-center mb-2">
                                        <div class="text-[7px] text-orange-600 font-black uppercase tracking-widest animate-pulse">EFFACEMENT DANS 72H</div>
                                    </div>
                                    <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="w-full py-3 bg-white border-2 border-orange-500 text-orange-600 font-black text-[9px] uppercase tracking-widest hover:bg-orange-50 transition-all rounded-none">
                                        ANNULER LA SUPPRESSION
                                    </button>
                                ` : `
                                    <div class="w-full py-4 bg-gray-100 text-gray-400 font-black text-[9px] uppercase tracking-widest text-center border border-gray-300 italic">
                                        VÉRIFICATION EN COURS...
                                    </div>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
                
                ${characters.length < CONFIG.MAX_CHARS ? `
                    <button onclick="actions.goToCreate()" class="group bg-white border-4 border-dashed border-gray-300 flex flex-col items-center justify-center p-12 hover:border-gov-blue hover:bg-blue-50 transition-all min-h-[400px] rounded-none">
                        <div class="w-16 h-16 bg-white border border-gray-300 text-gray-300 flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-xl">
                            <i data-lucide="plus" class="w-8 h-8"></i>
                        </div>
                        <span class="text-gov-text text-xl font-black uppercase italic tracking-tighter text-center">NOUVEAU<br>RECENSEMENT</span>
                    </button>
                ` : ''}
            </div>
        `;
    } 

    else if (currentTab === 'perms') {
        tabContent = `
            <div class="bg-white p-10 border border-gray-900 shadow-2xl animate-in max-w-4xl mx-auto rounded-none">
                <h4 class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                    <span class="w-8 h-0.5 bg-gov-blue opacity-30"></span> Privilèges du Profil
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${permKeys.length > 0 ? permKeys.map(k => `
                        <div class="bg-gov-light p-4 border border-gray-300 flex items-center gap-4 group hover:border-gov-blue/20 transition-all rounded-none">
                            <div class="w-9 h-9 bg-gov-blue text-white flex items-center justify-center border border-gray-900"><i data-lucide="check" class="w-4 h-4"></i></div>
                            <span class="text-[10px] font-black text-gov-text uppercase tracking-widest">${k.replace('can_', '').replace(/_/g, ' ')}</span>
                        </div>
                    `).join('') : `
                        <div class="col-span-full py-20 text-center flex flex-col items-center opacity-20">
                            <i data-lucide="lock" class="w-12 h-12 mb-6 text-gov-blue"></i>
                            <p class="text-[10px] font-black uppercase tracking-[0.3em]">Accès Citoyen Standard</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    else if (currentTab === 'sanctions') {
        tabContent = `
            <div class="space-y-4 animate-in max-w-4xl mx-auto pb-20">
                ${sanctions.length > 0 ? sanctions.map(s => `
                    <div class="p-6 bg-white border border-gray-900 flex items-center justify-between group hover:border-gov-red/20 transition-all shadow-xl rounded-none">
                        <div class="flex items-center gap-6">
                            <div class="w-12 h-12 bg-gov-light flex items-center justify-center text-lg font-black uppercase text-gov-red border border-gray-900 italic">${s.type[0]}</div>
                            <div>
                                <div class="text-[10px] font-black text-gov-text uppercase tracking-tight italic">${s.type.toUpperCase()} — LE ${new Date(s.created_at).toLocaleDateString()}</div>
                                <div class="text-[12px] text-gray-500 font-medium italic mt-1 leading-relaxed">"${s.reason}"</div>
                            </div>
                        </div>
                        ${!s.appeal_at ? `
                            <button onclick="actions.openAppealModal('${s.id}')" class="text-[8px] font-black text-gov-blue uppercase tracking-widest border-2 border-gov-blue px-4 py-2 hover:bg-gov-blue hover:text-white transition-all rounded-none">CONTESTER</button>
                        ` : '<span class="text-[8px] font-black text-gray-400 uppercase italic bg-gov-light px-3 py-1.5 border border-gray-300">En examen</span>'}
                    </div>
                `).join('') : '<div class="text-center py-24 text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] border-4 border-dashed border-gray-300 rounded-none">Aucun signalement</div>'}
            </div>
        `;
    }

    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        tabContent = `
            <div class="bg-white p-12 border-t-8 border-gov-red border-x border-b border-gray-900 shadow-2xl animate-in max-w-3xl mx-auto text-center rounded-none">
                <div class="w-16 h-16 bg-red-50 text-gov-red border border-red-200 flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <i data-lucide="shield-alert" class="w-8 h-8"></i>
                </div>
                <h4 class="text-4xl font-black text-gov-text uppercase italic mb-4 tracking-tighter">Droit à l'Oubli</h4>
                <p class="text-sm text-gray-500 leading-relaxed mb-10 font-medium italic">L'exercice de ce droit entraîne la suppression irrévocable de votre existence numérique dans nos bases sous 72h.</p>
                
                ${deletionDate ? `
                    <div class="bg-orange-50 border-2 border-orange-200 p-8 mb-8 inline-block w-full rounded-none">
                        <div class="text-[9px] text-orange-600 font-black uppercase tracking-[0.4em] mb-4">Phase de purge active</div>
                        <div class="text-4xl font-mono font-black text-gov-text mb-8">72:00:00</div>
                        <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-10 py-4 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all border border-gray-900">ANNULER LA PROCÉDURE</button>
                    </div>
                ` : `
                    <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-10 py-5 border border-gray-900 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl transform hover:scale-105 rounded-none">
                        DÉTRUIRE MON IDENTITÉ
                    </button>
                `}
            </div>
        `;
    }

    return `
    <!-- MOBILE OVERLAY MENU -->
    <div id="mobile-menu-overlay" class="${isMobileMenuOpen ? 'open' : ''}">
        <div class="flex justify-between items-center mb-16">
            <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">GESTION HUB</div>
                <div class="text-md">VOTRE PROFIL</div>
            </div>
            <button onclick="actions.toggleMobileMenu()" class="p-4 border border-gray-900"><i data-lucide="x" class="w-6 h-6"></i></button>
        </div>
        <div class="flex flex-col gap-4">
            ${tabs.map(t => `
                <button onclick="actions.setProfileTab('${t.id}')" class="text-4xl font-black text-gov-text uppercase italic text-left tracking-tighter border-b-4 ${currentTab === t.id ? 'border-gov-blue text-gov-blue' : 'border-gray-900'} pb-2">
                    ${t.label}
                </button>
            `).join('')}
        </div>
        <div class="mt-auto flex flex-col gap-4">
            <button onclick="actions.backToLanding()" class="py-4 border-2 border-gray-900 font-black uppercase text-xs tracking-widest">Retour Portail</button>
            <button onclick="actions.confirmLogout()" class="py-4 bg-gov-red text-white font-black uppercase text-xs tracking-widest">Déconnexion</button>
        </div>
    </div>

    <div class="flex-1 flex flex-col bg-[#F6F6F6] min-h-screen">
        
        <!-- UNIVERSAL NAVBAR DU PROFIL (RESPONSIVE) -->
        <nav class="shrink-0 bg-white border-b border-gray-900 px-6 flex items-center justify-between sticky top-0 z-[1000] shadow-sm h-20">
            <div class="flex items-center gap-6 h-full">
                <div onclick="actions.backToLanding()" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-opacity">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red italic">Services d'Immigration</div>
                    <div class="text-md leading-none">ÉTAT DE CALIFORNIE</div>
                </div>
                
                <div class="hidden md:block h-8 w-px bg-gray-300"></div>

                <!-- Tabs (Terminal Style) PC -->
                <div class="hidden md:flex items-center gap-1 h-full">
                    ${tabs.map(t => `
                        <button onclick="actions.setProfileTab('${t.id}')" 
                            class="px-6 h-10 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 whitespace-nowrap ${currentTab === t.id ? 'bg-gov-blue text-white shadow-lg' : 'text-gray-400 hover:text-gov-text'}">
                            <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i>
                            ${t.label}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="flex items-center gap-6">
                <button onclick="actions.toggleMobileMenu()" class="md:hidden p-3 border border-gray-900"><i data-lucide="menu" class="w-6 h-6"></i></button>
                
                <div class="hidden md:flex gap-2">
                    <button onclick="actions.backToLanding()" class="flex items-center gap-2 text-[9px] font-black text-gov-text uppercase tracking-widest hover:underline px-4 py-2 bg-gray-50 border border-gray-300 transition-all">
                        <i data-lucide="home" class="w-3.5 h-3.5"></i> Accueil
                    </button>
                    <button onclick="actions.confirmLogout()" class="flex items-center gap-2 text-[9px] font-black text-gov-red uppercase tracking-widest hover:underline px-4 py-2 bg-red-50 border border-red-200 transition-all">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i> Quitter
                    </button>
                </div>
                
                <div class="hidden md:flex items-center gap-3 pl-6 border-l border-gray-300">
                    <div class="text-right">
                        <div class="text-[10px] font-black text-gov-text uppercase italic leading-none">${u.username}</div>
                        <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">SÉCURISÉ</div>
                    </div>
                    <img src="${u.avatar}" class="w-10 h-10 border-2 border-gray-900 p-0.5 bg-white object-cover">
                </div>
            </div>
        </nav>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
            <!-- BANNER -->
            <div class="relative h-48 md:h-80 shrink-0 overflow-hidden bg-gov-blue border-b-8 border-gray-900">
                ${u.banner ? `<img src="${u.banner}" class="w-full h-full object-cover">` : '<div class="w-full h-full bg-gradient-to-r from-gov-blue via-blue-900 to-indigo-900 opacity-90"></div>'}
                <div class="absolute inset-0 bg-gradient-to-t from-[#F6F6F6] via-transparent to-transparent"></div>
            </div>

            <!-- HEADER CONTENT -->
            <div class="max-w-6xl mx-auto w-full px-8 -mt-24 relative z-10 mb-12">
                <div class="flex flex-col md:flex-row items-end gap-10">
                    <div class="relative group mx-auto md:mx-0">
                        <div class="w-40 h-40 border-[8px] border-gray-900 bg-white shadow-2xl overflow-hidden relative rounded-none">
                            <img src="${u.avatar}" class="w-full h-full object-cover">
                        </div>
                    </div>
                    <div class="flex-1 pb-4 text-center md:text-left w-full">
                        <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-3">Répertoire des Identités</div>
                        <h2 class="text-5xl font-black text-gov-text tracking-tighter uppercase italic leading-none drop-shadow-xl">${u.username}</h2>
                        <div class="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                            <span class="text-gray-900 font-mono text-[10px] uppercase tracking-widest bg-white px-4 py-1.5 border border-gray-900 shadow-sm">UID: ${u.id}</span>
                            ${u.isFounder ? '<span class="text-[10px] font-black text-white uppercase tracking-widest bg-purple-600 px-4 py-1.5 border border-gray-900 italic">CONSEILLER SUPÉRIEUR</span>' : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- MAIN CONTENT -->
            <main class="max-w-6xl mx-auto w-full px-8 flex-1">
                ${tabContent}
            </main>
            
            <footer class="py-12 text-center opacity-30">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">Terminal de Gestion Identitaire • v6.6</p>
            </footer>
        </div>
    </div>
    `;
};
