
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';
import { loadUserSanctions } from '../actions/profile.js';

const ALL_PERMISSIONS = [
    { k: 'can_approve_characters', l: 'File Whitelist', d: "Autorise l'examen et la validation des nouveaux citoyens entrant sur le territoire (Whitelist)." },
    { k: 'can_manage_characters', l: 'Registre Civil', d: "Accès total au registre national : modification des points de permis, barreau, métiers et purge de dossiers." },
    { k: 'can_manage_economy', l: 'Pilotage Économique', d: "Pouvoir de régulation sur les masses monétaires, ajustement des soldes et prélèvements administratifs." },
    { k: 'can_manage_illegal', l: 'Audit Illégal', d: "Supervision des syndicats criminels, gestion des gangs et validation des gains de braquages complexes." },
    { k: 'can_manage_enterprises', l: 'Réseau Commercial', d: "Contrôle du Registre du Commerce : fondation, dissolution et modération des articles en vente." },
    { k: 'can_manage_staff', l: 'Directoire Staff', d: "Accréditation de commandement permettant de nommer des membres staff et de configurer leurs droits." },
    { k: 'can_manage_inventory', l: 'Saisie d\'Objets', d: "Droit de perquisition administrative à distance permettant d'altérer l'inventaire physique d'un citoyen." },
    { k: 'can_change_team', l: 'Mutation Secteur', d: "Permet de basculer un citoyen entre le secteur Légal et Clandestin, réinitialisant ses accès." },
    { k: 'can_go_onduty', l: 'Badge Service', d: "Autorisation de prise de service live sur le panel, indispensable pour les actions de modération terrain." },
    { k: 'can_manage_jobs', l: 'Affectation Métier', d: "Permet d'assigner arbitrairement n'importe quelle profession à un dossier citoyen." },
    { k: 'can_bypass_login', l: 'Accès Fondation', d: "Accès racine permettant de naviguer sur l'intégralité du terminal sans personnage actif." },
    { k: 'can_launch_session', l: 'Cycle de Session', d: "Autorise l'ouverture et la fermeture des sessions de jeu officielles et la synchronisation CAD." },
    { k: 'can_execute_commands', l: 'Console ERLC', d: "Accès direct au terminal de commande du serveur ERLC pour les annonces globales." },
    { k: 'can_give_wheel_turn', l: 'Maître des Roues', d: "Autorise l'attribution de clés de lootbox aux citoyens méritants." },
    { k: 'can_use_dm', l: 'Messagerie Bot', d: "Autorise l'envoi de messages privés sécurisés via l'identité du bot TFRP." },
    { k: 'can_use_say', l: 'Transmission Bot', d: "Permet d'utiliser le canal vocal/textuel du bot pour des annonces officielles." },
    { k: 'can_warn', l: 'Warn System', d: "Droit d'application d'avertissements officiels au casier administratif." },
    { k: 'can_mute', l: 'Mute System', d: "Droit de mise en sourdine (Mute) sur les canaux de communication Discord." },
    { k: 'can_ban', l: 'Ban System', d: "Droit de bannissement définitif ou temporaire du réseau TFRP." }
];

export const ProfileHubView = () => {
    const u = state.user;
    if (!u) return '';

    const currentTab = state.activeProfileTab || 'identity';
    const characters = state.characters || [];
    const perms = u.permissions || {};
    const sanctions = state.userSanctions || [];
    const isMobileMenuOpen = state.ui.mobileMenuOpen;
    const turns = u.whell_turn || 0;

    if (!state.hasFetchedSanctions) {
        state.hasFetchedSanctions = true;
        loadUserSanctions();
    }

    const tabs = [
        { id: 'identity', label: 'Dossiers', icon: 'users' },
        { id: 'perms', label: 'Accréditations', icon: 'shield-check' },
        { id: 'sanctions', label: 'Sanctions', icon: 'alert-triangle' },
        { id: 'lootbox', label: 'Lootbox', icon: 'package' },
        { id: 'security', label: 'Sécurité', icon: 'lock' }
    ];

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
                                        <div class="text-[7px] text-orange-600 font-black uppercase tracking-widest animate-pulse">COOLDOWN : 72H</div>
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
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${ALL_PERMISSIONS.map(p => {
                        const hasPerm = perms[p.k] === true || u.isFounder;
                        return `
                            <div class="bg-gov-light p-6 rounded-2xl border ${hasPerm ? 'border-gov-blue/20 bg-blue-50/20 shadow-md' : 'border-gray-100 opacity-60'} flex items-start gap-5 group transition-all">
                                <div class="w-10 h-10 shrink-0 rounded-xl ${hasPerm ? 'bg-gov-blue text-white shadow-blue-900/20' : 'bg-gray-200 text-gray-400'} flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
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

    else if (currentTab === 'lootbox') {
        // Rediriger vers la vue WheelView dédiée
        setTimeout(() => actions.openWheel(), 10);
        return '';
    }

    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        tabContent = `
            <div class="animate-in max-w-5xl mx-auto pb-20 space-y-8">
                <!-- INFOS RGPD DÉTAILLÉES -->
                <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl">
                    <h4 class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-8">Transparence des Données (RGPD)</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="p-6 bg-gov-light rounded-3xl border border-gray-100">
                            <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Identité Profil</div>
                            <div class="text-sm font-bold text-gov-text truncate">@${u.username}</div>
                            <div class="text-[9px] text-gray-400 font-mono mt-0.5">UID: ${u.id}</div>
                        </div>
                        <div class="p-6 bg-gov-light rounded-3xl border border-gray-100">
                            <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Dossiers Actifs</div>
                            <div class="text-sm font-bold text-gov-text">${characters.length} Fiches Citoyennes</div>
                            <div class="text-[9px] text-gray-400 mt-0.5">Incluant comptes & inventaires</div>
                        </div>
                        <div class="p-6 bg-gov-light rounded-3xl border border-gray-100">
                            <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Réseau</div>
                            <div class="text-sm font-bold text-gov-text">${Object.keys(perms).length} Accréditations</div>
                            <div class="text-[9px] text-gray-400 mt-0.5">Archives Discord synchronisées</div>
                        </div>
                    </div>
                </div>

                <!-- PURGE INDIVIDUELLE -->
                <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl">
                    <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Purger un dossier spécifique</h4>
                    <div class="space-y-4">
                        ${characters.map(char => `
                            <div class="flex items-center justify-between p-5 bg-gov-light rounded-2xl border border-gray-100 group">
                                <div>
                                    <div class="font-black text-gov-text text-sm uppercase italic">${char.first_name} ${char.last_name}</div>
                                    <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">REF: #${char.id.substring(0,8).toUpperCase()}</div>
                                </div>
                                <button onclick="actions.requestCharacterDeletion('${char.id}')" class="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                                    Purger ce dossier
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- PURGE TOTALE -->
                <div class="bg-white p-10 rounded-[40px] border-t-8 border-gov-red shadow-2xl">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-red-50 text-gov-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-red-100">
                            <i data-lucide="shield-alert" class="w-8 h-8"></i>
                        </div>
                        <h4 class="text-2xl font-black text-gov-text uppercase italic mb-4 tracking-tighter">Suppression Définitive de l'Identité</h4>
                        <p class="text-sm text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto font-medium italic">
                            L'exercice du droit à l'oubli entraîne la suppression irrévocable de votre existence numérique dans nos bases. 
                            <b>Toutes les données listées ci-dessus seront effacées.</b>
                        </p>
                        
                        ${deletionDate ? `
                            <div class="bg-orange-50 border-2 border-orange-200 p-8 rounded-[32px] mb-8 inline-block w-full">
                                <div class="text-[9px] text-orange-600 font-black uppercase tracking-[0.4em] mb-4">Cooldown de Latence Actif</div>
                                <div class="text-4xl font-mono font-black text-gov-text mb-8">EFFACEMENT SOUS 72H</div>
                                <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl transform active:scale-95">ANNULER LA PROCÉDURE</button>
                            </div>
                        ` : `
                            <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl transform hover:scale-105 active:scale-95">
                                RÉVOQUER TOUTES MES DONNÉES
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] min-h-screen overflow-hidden">
        
        <!-- UNIFIED TERMINAL NAVBAR -->
        <nav class="terminal-nav shrink-0">
            <div class="flex items-center gap-6 md:gap-12 h-full">
                <div onclick="actions.backToLanding()" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-transform hover:scale-[0.8]">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">État de Californie</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>

                <div class="hidden lg:flex items-center gap-1 h-full ml-4">
                    ${tabs.map(t => `
                        <button onclick="actions.setProfileTab('${t.id}')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${currentTab === t.id ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-400 hover:text-gov-text'}">
                            ${t.label}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="flex items-center gap-2 md:gap-4 h-full">
                <button onclick="actions.backToLanding()" class="p-2.5 text-gray-400 hover:text-gov-blue hover:bg-gov-light rounded-sm transition-all" title="Accueil">
                    <i data-lucide="home" class="w-5 h-5"></i>
                </button>
                <div class="nav-item h-full flex items-center">
                    <div class="flex items-center gap-4 cursor-pointer p-2.5 hover:bg-gov-light rounded-sm transition-all h-full">
                        <div class="text-right hidden sm:block">
                            <div class="text-[10px] font-black uppercase text-gov-text leading-none">${u.username}</div>
                            <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">SÉANCE IDENTITAIRE</div>
                        </div>
                        <div class="avatar-container w-10 h-10 shrink-0">
                            <img src="${u.avatar}" class="avatar-img grayscale border border-gray-200 p-0.5 relative z-10">
                            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-30"></div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
            <div class="relative h-48 md:h-64 shrink-0 overflow-hidden bg-gov-blue">
                ${u.banner ? `<img src="${u.banner}" class="w-full h-full object-cover">` : '<div class="w-full h-full bg-gradient-to-r from-gov-blue via-blue-900 to-indigo-900 opacity-90"></div>'}
                <div class="absolute inset-0 bg-gradient-to-t from-[#F6F6F6] via-transparent to-transparent"></div>
            </div>

            <div class="max-w-6xl mx-auto w-full px-6 md:px-8 -mt-16 md:-mt-24 relative z-10 mb-12">
                <div class="flex flex-col md:flex-row items-end gap-6 md:gap-10">
                    <div class="mx-auto md:mx-0 shrink-0">
                        <div class="avatar-container w-32 h-32 md:w-40 md:h-40">
                            <img src="${u.avatar}" class="avatar-img border-[6px] md:border-[8px] border-white bg-white shadow-2xl">
                            ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                            <div class="absolute bottom-4 right-4 w-8 h-8 md:w-10 md:h-10 bg-gov-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl z-30">
                                <i data-lucide="verified" class="w-4 h-4 md:w-5 md:h-5"></i>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 pb-4 text-center md:text-left w-full">
                        <div class="text-[9px] md:text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-3">Répertoire des Identités</div>
                        <h2 class="text-4xl md:text-5xl font-black text-gov-text tracking-tighter uppercase italic leading-none drop-shadow-sm">${u.username}</h2>
                    </div>
                </div>
            </div>

            <main class="max-w-6xl mx-auto w-full px-6 md:px-8 flex-1">
                ${tabContent}
            </main>
        </div>
    </div>
    `;
};
