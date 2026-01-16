
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';
import { loadUserSanctions } from '../actions/profile.js';

const ALL_PERMISSIONS = [
    { k: 'can_approve_characters', l: 'File Whitelist', d: "Autorise l'examen et la validation des nouveaux citoyens (Whitelist)." },
    { k: 'can_manage_characters', l: 'Registre Civil', d: "Accès total au registre national : modification des points, barreau, métiers et purges." },
    { k: 'can_manage_economy', l: 'Pilotage Économique', d: "Pouvoir de régulation sur les masses monétaires et ajustements de soldes." },
    { k: 'can_manage_illegal', l: 'Audit Illégal', d: "Supervision des syndicats criminels et validation des braquages." },
    { k: 'can_manage_enterprises', l: 'Réseau Commercial', d: "Contrôle du Registre du Commerce et modération des articles." },
    { k: 'can_manage_staff', l: 'Directoire Staff', d: "Accréditation de commandement permettant de nommer des membres staff." },
    { k: 'can_manage_inventory', l: 'Saisie d\'Objets', d: "Droit de perquisition administrative à distance." },
    { k: 'can_change_team', l: 'Mutation Secteur', d: "Permet de basculer un citoyen entre le secteur Légal et Clandestin." },
    { k: 'can_go_onduty', l: 'Badge Service', d: "Autorisation de prise de service live sur le panel." },
    { k: 'can_manage_jobs', l: 'Affectation Métier', d: "Permet d'assigner arbitrairement n'importe quelle profession." },
    { k: 'can_bypass_login', l: 'Accès Fondation', d: "Accès racine sans personnage actif." },
    { k: 'can_launch_session', l: 'Cycle de Session', d: "Autorise l'ouverture et la fermeture des sessions officielles." },
    { k: 'can_execute_commands', l: 'Console ERLC', d: "Accès direct au terminal de commande du serveur." },
    { k: 'can_give_wheel_turn', l: 'Maître des Roues', d: "Autorise l'attribution de clés de lootbox." },
    { k: 'can_use_dm', l: 'Messagerie Bot', d: "Autorise l'envoi de messages privés via le bot." },
    { k: 'can_use_say', l: 'Transmission Bot', d: "Annonces officielles via le bot." },
    { k: 'can_warn', l: 'Warn System', d: "Application d'avertissements officiels." },
    { k: 'can_mute', l: 'Mute System', d: "Mise en sourdine Discord." },
    { k: 'can_ban', l: 'Ban System', d: "Bannissement du réseau TFRP." }
];

export const ProfileHubView = () => {
    const u = state.user;
    if (!u) return '';

    const currentTab = state.activeProfileTab || 'identity';
    const characters = state.characters || [];
    const perms = u.permissions || {};
    const sanctions = state.userSanctions || [];
    const turns = u.whell_turn || 0;

    if (!state.hasFetchedSanctions) {
        state.hasFetchedSanctions = true;
        loadUserSanctions();
    }

    const tabs = [
        { id: 'identity', label: 'Dossiers', icon: 'users' },
        { id: 'perms', label: 'Accréditations', icon: 'shield-check' },
        { id: 'sanctions', label: 'Mon Casier', icon: 'alert-triangle' },
        { id: 'lootbox', label: 'Lootbox', icon: 'package' },
        { id: 'security', label: 'Sécurité', icon: 'lock' }
    ];

    let tabContent = '';

    if (currentTab === 'identity') {
        tabContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in pb-32">
                ${characters.map(char => {
                    const isAccepted = char.status === 'accepted';
                    const isDeleting = !!char.deletion_requested_at;
                    const statusColor = isDeleting ? 'orange' : isAccepted ? 'emerald' : 'amber';
                    return `
                        <div class="flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden transition-all hover:-translate-y-1">
                            <div class="p-8 pb-4 flex justify-between items-start">
                                <div class="w-14 h-14 bg-gov-light rounded-2xl flex items-center justify-center border border-gray-100"><i data-lucide="user" class="w-7 h-7 text-gray-400"></i></div>
                                <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest bg-${statusColor}-50 text-${statusColor}-600 border-${statusColor}-200">${isDeleting ? 'PURGE ACTIVE' : char.status.toUpperCase()}</span>
                            </div>
                            <div class="p-8 pt-2 flex-1">
                                <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter mb-6">${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span></h3>
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center py-2 border-b border-gray-50"><span class="text-[9px] font-black text-gray-400 uppercase">Secteur</span><span class="${char.alignment === 'illegal' ? 'text-red-500' : 'text-gov-blue'} text-[10px] font-black uppercase italic">${char.alignment}</span></div>
                                    <div class="flex justify-between items-center py-2"><span class="text-[9px] font-black text-gray-400 uppercase">Âge</span><span class="text-gov-text text-[10px] font-black">${char.age} ANS</span></div>
                                </div>
                            </div>
                            <div class="p-6 bg-gov-light/30 border-t border-gray-100 flex flex-col gap-2">
                                ${isAccepted && !isDeleting ? `<button onclick="actions.selectCharacter('${char.id}')" class="w-full py-4 bg-gov-blue text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black rounded-2xl shadow-lg transition-all">CHARGER DOSSIER</button>` : ''}
                                ${isDeleting ? `<button onclick="actions.cancelCharacterDeletion('${char.id}')" class="w-full py-4 bg-white border-2 border-orange-500 text-orange-600 font-black text-[9px] uppercase tracking-widest rounded-2xl">ANNULER PURGE</button>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
                ${characters.length < CONFIG.MAX_CHARS ? `<button onclick="actions.goToCreate()" class="group bg-white/40 border-4 border-dashed border-gray-200 rounded-[40px] flex flex-col items-center justify-center p-12 hover:border-gov-blue hover:bg-blue-50/50 transition-all min-h-[400px]"><div class="w-16 h-16 bg-white text-gray-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-xl group-hover:scale-110"><i data-lucide="plus" class="w-8 h-8"></i></div><span class="text-gov-text text-xl font-black uppercase italic tracking-tighter text-center">NOUVEAU<br>RECENSEMENT</span></button>` : ''}
            </div>
        `;
    }

    else if (currentTab === 'perms') {
        tabContent = `
            <div class="bg-white p-10 rounded-[50px] border border-gray-100 shadow-2xl animate-in max-w-5xl mx-auto">
                <div class="flex items-center justify-between mb-10 border-b border-gray-100 pb-8">
                    <div><h4 class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-2">Privilèges & Accréditations</h4></div>
                    ${u.isFounder ? `<div class="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-[10px] font-black uppercase border border-purple-200 flex items-center gap-2">Accès Fondation (Root)</div>` : ''}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${ALL_PERMISSIONS.map(p => {
                        const hasPerm = perms[p.k] === true || u.isFounder;
                        return `<div class="bg-gov-light p-6 rounded-3xl border ${hasPerm ? 'border-gov-blue/20 bg-blue-50/20 shadow-md' : 'border-gray-100 opacity-60'} flex items-start gap-5 group transition-all"><div class="w-10 h-10 shrink-0 rounded-xl ${hasPerm ? 'bg-gov-blue text-white' : 'bg-gray-200 text-gray-400'} flex items-center justify-center shadow-md"><i data-lucide="${hasPerm ? 'shield-check' : 'shield-off'}" class="w-5 h-5"></i></div><div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-1"><span class="text-[11px] font-black text-gov-text uppercase truncate">${p.l}</span><span class="text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${hasPerm ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}">${hasPerm ? 'ACTIF' : 'INACTIF'}</span></div><p class="text-[10px] text-gray-500 font-medium italic">"${p.d}"</p></div></div>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    else if (currentTab === 'lootbox') {
        tabContent = `
            <div class="h-full flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div class="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 mb-8 border border-blue-500/20 shadow-2xl">
                    <i data-lucide="package" class="w-12 h-12"></i>
                </div>
                <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter mb-4">Initialisation Module</h3>
                <button onclick="router('wheel')" class="px-12 py-5 bg-gov-blue text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-900/40 hover:bg-black transition-all transform hover:scale-105">LANCER LE SÉQUENCEUR</button>
            </div>
        `;
    }

    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        tabContent = `
            <div class="space-y-10 animate-in max-w-5xl mx-auto pb-32">
                <!-- SECTION 1: PURGE INDIVIDUELLE -->
                <div class="bg-white p-10 rounded-[50px] border border-gray-100 shadow-2xl">
                    <h4 class="text-2xl font-black text-gov-text uppercase italic mb-8 flex items-center gap-4">
                        <i data-lucide="user-minus" class="w-8 h-8 text-orange-500"></i>
                        Destruction de Dossiers
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${characters.map(char => `
                            <div class="p-6 bg-gov-light rounded-[28px] border border-gray-100 flex items-center justify-between group">
                                <div>
                                    <div class="font-black text-gov-text text-sm uppercase italic">${char.first_name} ${char.last_name}</div>
                                    <div class="text-[9px] text-gray-400 font-bold mt-0.5 uppercase tracking-widest">ID: #${char.id.substring(0,8)}</div>
                                </div>
                                ${char.deletion_requested_at ? `
                                    <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="px-4 py-2 bg-white text-orange-600 rounded-xl text-[8px] font-black uppercase border border-orange-200">ANNULER</button>
                                ` : `
                                    <button onclick="actions.requestCharacterDeletion('${char.id}')" class="px-4 py-2 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase shadow-lg shadow-red-900/20">PURGER</button>
                                `}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- SECTION 2: PURGE GLOBALE -->
                <div class="bg-white p-12 rounded-[50px] border-t-8 border-gov-red shadow-2xl">
                    <h4 class="text-3xl font-black text-gov-text uppercase italic mb-6">Droit à l'oubli (Purge Totale)</h4>
                    <p class="text-sm text-gray-500 leading-relaxed mb-12 max-w-2xl font-medium">L'exercice de ce droit entraîne la suppression irrévocable de votre identité Discord de nos bases, ainsi que l'intégralité de vos comptes et personnages dans un délai de 72h.</p>
                    ${deletionDate ? `
                        <div class="bg-orange-50 border-2 border-orange-200 p-10 rounded-[32px] mb-12 text-center">
                            <div class="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-4">Phase de purge active</div>
                            <div class="text-4xl font-mono font-black text-gov-text mb-8">72:00:00</div>
                            <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl">ANNULER LA PROCÉDURE</button>
                        </div>
                    ` : `
                        <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl transform active:scale-95">DÉTRUIRE MON IDENTITÉ NATIONALE</button>
                    `}
                </div>
            </div>
        `;
    }

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] min-h-screen overflow-hidden">
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
                <div class="nav-item h-full flex items-center">
                    <div class="flex items-center gap-4 cursor-pointer p-2.5 hover:bg-gov-light rounded-sm transition-all h-full">
                        <div class="text-right hidden sm:block">
                            <div class="text-[10px] font-black uppercase text-gov-text leading-none">${u.username}</div>
                            <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">SÉANCE IDENTITAIRE</div>
                        </div>
                        <div class="avatar-container w-10 h-10 shrink-0">
                            <img src="${u.avatar}" class="avatar-img grayscale border border-gray-200 p-0.5 relative z-10">
                            ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-30"></div>
                        </div>
                    </div>
                    <div class="nav-dropdown right-0 left-auto rounded-none shadow-2xl">
                        <button onclick="actions.confirmLogout()" class="w-full text-left p-4 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-red-600 transition-colors">
                            <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
            <div class="relative h-48 md:h-64 shrink-0 overflow-hidden bg-gov-blue">
                ${u.banner ? `<img src="${u.banner}" class="w-full h-full object-cover">` : '<div class="w-full h-full bg-gradient-to-r from-gov-blue via-blue-900 to-indigo-900 opacity-90"></div>'}
                <div class="absolute inset-0 bg-gradient-to-t from-[#F6F6F6] via-transparent to-transparent"></div>
            </div>

            <div class="max-w-7xl mx-auto w-full px-6 md:px-12 -mt-16 md:-mt-24 relative z-10 mb-12">
                <div class="flex flex-col md:flex-row items-end gap-6 md:gap-10">
                    <div class="mx-auto md:mx-0 shrink-0">
                        <div class="avatar-container w-32 h-32 md:w-40 md:h-40">
                            <img src="${u.avatar}" class="avatar-img border-[10px] border-white bg-white shadow-2xl">
                            ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                        </div>
                    </div>
                    <div class="flex-1 pb-4 text-center md:text-left w-full">
                        <h2 class="text-4xl md:text-6xl font-black text-gov-text tracking-tighter uppercase italic leading-none drop-shadow-sm">${u.username}</h2>
                        <div class="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                            <span class="text-gray-400 font-mono text-[9px] md:text-[10px] uppercase bg-white px-4 py-1.5 rounded-lg border border-gray-100 shadow-sm">UID: ${u.id}</span>
                            ${u.isFounder ? '<span class="text-[9px] md:text-[10px] font-black text-purple-600 uppercase bg-purple-50 px-4 py-1.5 border border-purple-100 rounded-lg italic">Fondation</span>' : ''}
                        </div>
                    </div>
                </div>
            </div>

            <main class="max-w-7xl mx-auto w-full px-6 md:px-12 flex-1">
                ${tabContent}
            </main>
        </div>
    </div>
    `;
};
