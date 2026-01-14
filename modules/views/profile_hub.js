
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';
import { loadUserSanctions } from '../actions/profile.js';

const ALL_PERMISSIONS = [
    { k: 'can_approve_characters', l: 'File Whitelist', d: "Autorise l'examen des dossiers d'immigration. Permet d'accepter ou de rejeter les nouveaux citoyens." },
    { k: 'can_manage_characters', l: 'Registre Civil', d: "Donne un accès total au Registre National (Points permis, barreau, métiers, purge)." },
    { k: 'can_manage_economy', l: 'Pilotage Économique', d: "Permet d'ajuster les soldes bancaires et d'effectuer des saisies ou crédits globaux." },
    { k: 'can_manage_illegal', l: 'Audit Illégal', d: "Supervision des activités criminelles, gestion des syndicats et validation des braquages." },
    { k: 'can_manage_enterprises', l: 'Réseau Commercial', d: "Contrôle du Registre du Commerce (Fondation/Dissolution et modération articles)." },
    { k: 'can_manage_staff', l: 'Directoire Staff', d: "Accréditation Commandement. Permet de nommer des membres staff et configurer leurs droits." },
    { k: 'can_manage_inventory', l: 'Saisie d\'Objets', d: "Droit de perquisition administrative à distance sur le sac des citoyens." },
    { k: 'can_change_team', l: 'Mutation Secteur', d: "Permet de basculer un citoyen du secteur Légal vers l'Illégal et vice-versa." },
    { k: 'can_go_onduty', l: 'Badge Service', d: "Autorisation de Service Live sur le Panel pour les fonctionnalités de terrain." },
    { k: 'can_manage_jobs', l: 'Affectation Métier', d: "Permet d'assigner arbitrairement n'importe quel métier à un citoyen." },
    { k: 'can_bypass_login', l: 'Accès Fondation', d: "Accès Racine permettant de naviguer sans charger de personnage citoyen." },
    { k: 'can_launch_session', l: 'Cycle de Session', d: "Autorise l'ouverture et la fermeture des sessions de jeu officielles." },
    { k: 'can_execute_commands', l: 'Console ERLC', d: "Accès au Terminal ERLC pour envoyer des instructions directes au serveur." },
    { k: 'can_give_wheel_turn', l: 'Maître des Roues', d: "Autorise l'attribution de tours de Roue de la Fortune aux citoyens." },
    { k: 'can_use_dm', l: 'Messagerie Bot', d: "Autorise l'envoi de messages privés via l'identité du bot." },
    { k: 'can_use_say', l: 'Transmission Bot', d: "Permet d'utiliser le bot pour parler dans les salons textuels publics." },
    { k: 'can_warn', l: 'Warn System', d: "Autorise l'application d'avertissements officiels." },
    { k: 'can_mute', l: 'Mute System', d: "Autorise la mise en sourdine des citoyens sur Discord." },
    { k: 'can_ban', l: 'Ban System', d: "Autorise le bannissement définitif ou temporaire." }
];

export const ProfileHubView = () => {
    const u = state.user;
    if (!u) return '';

    const currentTab = state.activeProfileTab || 'identity';
    const characters = state.characters || [];
    const perms = u.permissions || {};
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

    const MobileMenuOverlay = () => `
        <div class="fixed inset-0 z-[2000] bg-white flex flex-col animate-in">
            <div class="h-20 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase font-black">État de Californie</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>
                <button onclick="actions.toggleMobileMenu()" class="p-3 bg-gov-light text-gov-text rounded-sm">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                ${tabs.map(t => `
                    <button onclick="actions.setProfileTab('${t.id}')" class="w-full text-left py-4 border-b border-gray-100 font-black uppercase text-xs tracking-widest ${currentTab === t.id ? 'text-gov-blue' : 'text-gray-400'}">
                        <div class="flex items-center gap-4">
                            <i data-lucide="${t.icon}" class="w-5 h-5"></i>
                            ${t.label}
                        </div>
                    </button>
                `).join('')}
                <div class="mt-auto pt-10 flex flex-col gap-4">
                    <button onclick="actions.backToLanding()" class="w-full py-4 bg-gov-light text-gov-text font-black uppercase text-[10px] tracking-widest text-center">Accueil</button>
                    <button onclick="actions.confirmLogout()" class="w-full py-4 bg-red-50 text-red-600 font-black uppercase text-[10px] tracking-widest text-center">Déconnexion</button>
                </div>
            </div>
        </div>
    `;

    let tabContent = '';

    if (currentTab === 'identity') {
        tabContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in pb-20">
                ${characters.map(char => {
                    const isAccepted = char.status === 'accepted';
                    const isDeleting = !!char.deletion_requested_at;
                    const statusColor = isDeleting ? 'orange' : isAccepted ? 'emerald' : 'amber';
                    
                    return `
                        <div class="gov-card flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div class="p-8 pb-4 flex justify-between items-start">
                                <div class="w-14 h-14 bg-gov-light rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                    <i data-lucide="user" class="w-7 h-7 text-gray-400"></i>
                                </div>
                                <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest bg-${statusColor}-50 text-${statusColor}-600 border-${statusColor}-200">
                                    ${isDeleting ? 'PURGE EN COURS' : char.status.toUpperCase()}
                                </span>
                            </div>

                            <div class="p-8 pt-2 flex-1">
                                <div class="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Identité Nationale</div>
                                <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter leading-none mb-6">
                                    ${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span>
                                </h3>
                                
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center py-2 border-b border-gray-50">
                                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secteur</span>
                                        <span class="${char.alignment === 'illegal' ? 'text-gov-red' : 'text-gov-blue'} text-[10px] font-black uppercase italic">${char.alignment}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2 border-b border-gray-50">
                                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Âge</span>
                                        <span class="text-gov-text text-[10px] font-black">${char.age} ANS</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2">
                                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Référence</span>
                                        <span class="text-gray-400 font-mono text-[9px]">#${char.id.substring(0,8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6 bg-gov-light/30 border-t border-gray-100 flex flex-col gap-2">
                                ${isAccepted && !isDeleting ? `
                                    <button onclick="actions.selectCharacter('${char.id}')" class="w-full py-4 bg-gov-blue text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all rounded-xl shadow-lg transform active:scale-95">
                                        CHARGER LE DOSSIER
                                    </button>
                                    <div class="flex gap-2">
                                        <button onclick="actions.startEditCharacter('${char.id}')" class="flex-1 py-2.5 bg-white text-gray-500 hover:text-gov-blue border border-gray-200 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <i data-lucide="settings" class="w-3.5 h-3.5"></i> ÉDITER
                                        </button>
                                        <button onclick="actions.requestCharacterDeletion('${char.id}')" class="flex-1 py-2.5 bg-white text-gray-400 hover:text-gov-red border border-gray-200 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> PURGER
                                        </button>
                                    </div>
                                ` : isDeleting ? `
                                    <div class="text-center mb-2">
                                        <div class="text-[7px] text-orange-600 font-black uppercase tracking-widest animate-pulse">EFFACEMENT DANS 72H</div>
                                    </div>
                                    <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="w-full py-3 bg-white border-2 border-orange-500 text-orange-600 font-black text-[9px] uppercase tracking-widest hover:bg-orange-50 transition-all rounded-xl">
                                        ANNULER LA SUPPRESSION
                                    </button>
                                ` : `
                                    <div class="w-full py-4 bg-gray-100 text-gray-400 font-black text-[9px] uppercase tracking-widest rounded-xl text-center border border-gray-200 italic">
                                        VÉRIFICATION EN COURS...
                                    </div>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
                
                ${characters.length < CONFIG.MAX_CHARS ? `
                    <button onclick="actions.goToCreate()" class="group bg-white/40 border-4 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center p-12 hover:border-gov-blue hover:bg-blue-50/50 transition-all min-h-[400px]">
                        <div class="w-16 h-16 bg-white text-gray-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-xl group-hover:scale-110 duration-500">
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
            <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl animate-in max-w-5xl mx-auto">
                <div class="flex items-center justify-between mb-10 border-b border-gray-100 pb-8">
                    <div>
                        <h4 class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-2">Privilèges & Accréditations</h4>
                        <p class="text-xs text-gray-500 font-medium">Répertoire complet des autorisations administratives liées à votre identité Discord.</p>
                    </div>
                    ${u.isFounder ? `
                        <div class="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-200 flex items-center gap-2 shadow-sm animate-pulse">
                            <i data-lucide="shield-alert" class="w-4 h-4"></i> Accès Fondation (Root)
                        </div>
                    ` : ''}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${ALL_PERMISSIONS.map(p => {
                        const hasPerm = perms[p.k] === true || u.isFounder;
                        return `
                            <div class="bg-gov-light p-6 rounded-2xl border ${hasPerm ? 'border-gov-blue/20 bg-blue-50/20' : 'border-gray-100 opacity-60'} flex items-start gap-5 group transition-all">
                                <div class="w-10 h-10 shrink-0 rounded-xl ${hasPerm ? 'bg-gov-blue text-white' : 'bg-gray-200 text-gray-400'} flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                                    <i data-lucide="${hasPerm ? 'shield-check' : 'shield-off'}" class="w-5 h-5"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between gap-2 mb-1">
                                        <span class="text-[11px] font-black text-gov-text uppercase tracking-widest truncate">${p.l}</span>
                                        <span class="text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${hasPerm ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}">
                                            ${hasPerm ? 'ACTIF' : 'INACTIF'}
                                        </span>
                                    </div>
                                    <p class="text-[10px] text-gray-500 leading-relaxed font-medium italic">"${p.d}"</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                    <p class="text-[9px] text-blue-800 font-black uppercase tracking-[0.2em]">Pour toute demande d'accréditation supplémentaire, veuillez vous référer à la hiérarchie Fondation.</p>
                </div>
            </div>
        `;
    }

    else if (currentTab === 'sanctions') {
        tabContent = `
            <div class="space-y-4 animate-in max-w-4xl mx-auto pb-20">
                ${sanctions.length > 0 ? sanctions.map(s => `
                    <div class="p-6 bg-white border border-gray-100 rounded-[28px] flex items-center justify-between group hover:border-gov-red/20 transition-all shadow-xl">
                        <div class="flex items-center gap-6">
                            <div class="w-12 h-12 rounded-xl bg-gov-light flex items-center justify-center text-lg font-black uppercase text-gov-red border border-gray-200 shadow-inner group-hover:scale-105 transition-transform italic">${s.type[0]}</div>
                            <div>
                                <div class="text-[10px] font-black text-gov-text uppercase tracking-tight italic">${s.type.toUpperCase()} — LE ${new Date(s.created_at).toLocaleDateString()}</div>
                                <div class="text-[12px] text-gray-500 font-medium italic mt-1 leading-relaxed">"${s.reason}"</div>
                            </div>
                        </div>
                        ${!s.appeal_at ? `
                            <button onclick="actions.openAppealModal('${s.id}')" class="text-[8px] font-black text-gov-blue uppercase tracking-widest border-2 border-gov-blue px-4 py-2 rounded-xl hover:bg-gov-blue hover:text-white transition-all">CONTESTER</button>
                        ` : '<span class="text-[8px] font-black text-gray-400 uppercase italic bg-gov-light px-3 py-1.5 rounded-lg border border-gray-200">En examen</span>'}
                    </div>
                `).join('') : '<div class="text-center py-24 text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] border-4 border-dashed border-gray-100 rounded-[40px]">Aucun signalement</div>'}
            </div>
        `;
    }

    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        tabContent = `
            <div class="bg-white p-12 rounded-[48px] border-t-8 border-gov-red shadow-2xl animate-in max-w-3xl mx-auto text-center">
                <div class="w-16 h-16 bg-red-50 text-gov-red rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border border-red-100">
                    <i data-lucide="shield-alert" class="w-8 h-8"></i>
                </div>
                <h4 class="text-4xl font-black text-gov-text uppercase italic mb-4 tracking-tighter">Droit à l'Oubli</h4>
                <p class="text-sm text-gray-500 leading-relaxed mb-10 font-medium italic">L'exercice de ce droit entraîne la suppression irrévocable de votre existence numérique dans nos bases sous 72h.</p>
                
                ${deletionDate ? `
                    <div class="bg-orange-50 border-2 border-orange-200 p-8 rounded-[32px] mb-8 inline-block w-full">
                        <div class="text-[9px] text-orange-600 font-black uppercase tracking-[0.4em] mb-4">Phase de purge active</div>
                        <div class="text-4xl font-mono font-black text-gov-text mb-8">72:00:00</div>
                        <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all">ANNULER LA PROCÉDURE</button>
                    </div>
                ` : `
                    <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl transform hover:scale-105">
                        DÉTRUIRE MON IDENTITÉ
                    </button>
                `}
            </div>
        `;
    }

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] min-h-screen overflow-hidden">
        
        ${isMobileMenuOpen ? MobileMenuOverlay() : ''}

        <!-- UNIVERSAL NAVBAR (REPLICATED TERMINAL STYLE) -->
        <nav class="terminal-nav flex items-center justify-between shrink-0 border-b border-gray-100 bg-white sticky top-0 z-[100] px-6 md:px-8">
            <div class="flex items-center gap-12 h-full">
                <div onclick="actions.backToLanding()" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-transform hover:scale-[0.8]">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>

                <!-- Desktop Tabs Menu -->
                <div class="hidden lg:flex items-center gap-1 h-full">
                    ${tabs.map(t => `
                        <button onclick="actions.setProfileTab('${t.id}')" class="px-6 py-2 h-full text-[10px] font-black uppercase tracking-widest transition-all ${currentTab === t.id ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">
                             <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i> ${t.label}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Profile & Notifications Actions -->
            <div class="flex items-center gap-4 h-full">
                <button onclick="actions.backToLanding()" class="p-2.5 text-gray-400 hover:text-gov-blue hover:bg-gov-light rounded-sm transition-all" title="Accueil">
                    <i data-lucide="home" class="w-5 h-5"></i>
                </button>
                
                <div class="nav-item hidden lg:flex h-full">
                    <div class="flex items-center gap-4 cursor-pointer p-2.5 hover:bg-gov-light rounded-sm transition-all h-full">
                        <div class="text-right">
                            <div class="text-[10px] font-black uppercase text-gov-text leading-none">${u.username}</div>
                            <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">PROFIL CERTIFIÉ</div>
                        </div>
                        <div class="relative w-10 h-10">
                            <img src="${u.avatar}" class="w-full h-full rounded-full grayscale border border-gray-200 p-0.5 relative z-10 object-cover">
                            ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-30"></div>
                        </div>
                    </div>
                    <div class="nav-dropdown right-0 left-auto rounded-none shadow-2xl">
                        <div class="px-4 py-3 border-b border-gray-50 bg-gov-light/30">
                            <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identité Discord</div>
                            <div class="text-[11px] font-black text-gov-text uppercase">${u.id}</div>
                        </div>
                        <button onclick="actions.setHubPanel('main')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors text-gov-blue">
                            <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Dashboard Citoyen
                        </button>
                        <div class="h-px bg-gray-50 my-1"></div>
                        <button onclick="actions.confirmLogout()" class="w-full text-left p-4 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-red-600 transition-colors">
                            <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
                        </button>
                    </div>
                </div>

                <!-- Hamburger Button (Mobile) -->
                <button onclick="actions.toggleMobileMenu()" class="lg:hidden p-3 bg-gov-light text-gov-text rounded-sm">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                </button>
            </div>
        </nav>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
            <!-- BANNER -->
            <div class="relative h-48 md:h-80 shrink-0 overflow-hidden bg-gov-blue">
                ${u.banner ? `<img src="${u.banner}" class="w-full h-full object-cover">` : '<div class="w-full h-full bg-gradient-to-r from-gov-blue via-blue-900 to-indigo-900 opacity-90"></div>'}
                <div class="absolute inset-0 bg-gradient-to-t from-[#F6F6F6] via-transparent to-transparent"></div>
                <div class="absolute inset-0 bg-black/10"></div>
            </div>

            <!-- HEADER CONTENT -->
            <div class="max-w-6xl mx-auto w-full px-6 md:px-8 -mt-16 md:-mt-24 relative z-10 mb-12">
                <div class="flex flex-col md:flex-row items-end gap-6 md:gap-10">
                    <div class="relative group mx-auto md:mx-0 shrink-0">
                        <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] md:border-[8px] border-white bg-white shadow-2xl overflow-hidden relative">
                            <img src="${u.avatar}" class="w-full h-full object-cover">
                            ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                        </div>
                        <div class="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-gov-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl transform rotate-12 z-30">
                            <i data-lucide="verified" class="w-4 h-4 md:w-5 md:h-5"></i>
                        </div>
                    </div>
                    <div class="flex-1 pb-4 text-center md:text-left w-full">
                        <div class="text-[9px] md:text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-3">Répertoire des Identités</div>
                        <h2 class="text-4xl md:text-5xl font-black text-gov-text tracking-tighter uppercase italic leading-none drop-shadow-xl">${u.username}</h2>
                        <div class="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                            <span class="text-gray-400 font-mono text-[9px] md:text-[10px] uppercase tracking-widest bg-white px-4 py-1.5 rounded-lg border border-gray-100 shadow-sm">UID: ${u.id}</span>
                            ${u.isFounder ? '<span class="text-[9px] md:text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-1.5 border border-purple-100 rounded-lg italic">Fondation</span>' : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- MAIN CONTENT -->
            <main class="max-w-6xl mx-auto w-full px-6 md:px-8 flex-1">
                ${tabContent}
            </main>
            
            <footer class="py-12 text-center opacity-30">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">Terminal de Gestion Identitaire • v6.3 Platinum</p>
            </footer>
        </div>
    </div>
    `;
};
