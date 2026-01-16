
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router, render, hasPermission } from '../utils.js';
import { loadUserSanctions } from '../actions/profile.js';
import { ui } from '../ui.js';
import { WHEEL_REWARDS } from '../actions/wheel.js';

const ALL_PERMISSIONS = [
    { k: 'can_approve_characters', l: 'File Whitelist', d: "Autorise l'examen et la validation des nouveaux citoyens entrant sur le territoire." },
    { k: 'can_manage_characters', l: 'Registre Civil', d: "Accès total au registre national : points de permis, barreau et purge de dossiers." },
    { k: 'can_manage_economy', l: 'Pilotage Économique', d: "Pouvoir de régulation sur les masses monétaires et ajustements de soldes." },
    { k: 'can_manage_illegal', l: 'Audit Illégal', d: "Supervision des syndicats criminels et validation des braquages." },
    { k: 'can_manage_enterprises', l: 'Réseau Commercial', d: "Contrôle du Registre du Commerce et modération des articles." },
    { k: 'can_manage_staff', l: 'Directoire Staff', d: "Accréditation de commandement permettant de nommer des membres staff." },
    { k: 'can_manage_inventory', l: 'Saisie d\'Objets', d: "Droit de perquisition administrative à distance (altération d'inventaire)." },
    { k: 'can_change_team', l: 'Mutation Secteur', d: "Basculement d'alignement entre le secteur Légal et Clandestin." },
    { k: 'can_go_onduty', l: 'Badge Service', d: "Autorisation de prise de service live sur le panel pour modération." },
    { k: 'can_manage_jobs', l: 'Affectation Métier', d: "Permet d'assigner arbitrairement n'importe quelle profession." },
    { k: 'can_bypass_login', l: 'Accès Fondation', d: "Accès racine permettant de naviguer sans personnage actif." },
    { k: 'can_launch_session', l: 'Cycle de Session', d: "Contrôle de l'ouverture et fermeture des sessions officielles." },
    { k: 'can_execute_commands', l: 'Console ERLC', d: "Accès direct au terminal de commande du serveur de jeu." },
    { k: 'can_give_wheel_turn', l: 'Maître des Roues', d: "Autorise l'attribution de clés de lootbox aux citoyens." },
    { k: 'can_warn', l: 'Warn System', d: "Droit d'application d'avertissements au casier." },
    { k: 'can_mute', l: 'Mute System', d: "Droit de mise en sourdine sur Discord." },
    { k: 'can_ban', l: 'Ban System', d: "Droit de bannissement du réseau TFRP." }
];

export const ProfileHubView = () => {
    const u = state.user;
    if (!u) return '';

    const currentTab = state.activeProfileTab || 'identity';
    const characters = state.characters || [];
    const perms = u.permissions || {};
    const sanctions = state.userSanctions || [];
    const turns = u.whell_turn || 0;

    // Déclencher le chargement des sanctions si besoin
    if (!state.userSanctions || state.userSanctions.length === 0) {
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
                ${hasPermission('can_bypass_login') ? `
                    <div class="gov-card flex flex-col bg-[#0f172a] rounded-[32px] border border-blue-500/30 shadow-2xl overflow-hidden group">
                        <div class="p-8 pb-4 flex justify-between items-start">
                            <div class="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                <i data-lucide="shield-alert" class="w-7 h-7 text-blue-400"></i>
                            </div>
                            <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest bg-blue-500/10 text-blue-400 border-blue-500/20">ROOT ACCESS</span>
                        </div>
                        <div class="p-8 pt-2 flex-1">
                            <h3 class="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">ACCÈS<br><span class="text-blue-400">FONDATION</span></h3>
                            <p class="text-[10px] text-gray-500 italic font-medium leading-relaxed">Administration globale sans chargement de dossier citoyen.</p>
                        </div>
                        <div class="p-6 bg-white/5 border-t border-white/10">
                            <button onclick="actions.openFoundationModal()" class="w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all rounded-xl shadow-lg">SESSION ROOT</button>
                        </div>
                    </div>
                ` : ''}

                ${characters.map(char => `
                    <div class="gov-card flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden transition-all hover:shadow-2xl">
                        <div class="p-8 pb-4 flex justify-between items-start">
                            <div class="w-14 h-14 bg-gov-light rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                <i data-lucide="user" class="w-7 h-7 text-gray-400"></i>
                            </div>
                            <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest bg-${char.status === 'accepted' ? 'emerald' : 'amber'}-50 text-${char.status === 'accepted' ? 'emerald' : 'amber'}-600 border-${char.status === 'accepted' ? 'emerald' : 'amber'}-200">
                                ${char.deletion_requested_at ? 'PURGE ACTIVE' : char.status.toUpperCase()}
                            </span>
                        </div>
                        <div class="p-8 pt-2 flex-1">
                            <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter leading-none mb-6">${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span></h3>
                        </div>
                        <div class="p-6 bg-gov-light/30 border-t border-gray-100 flex flex-col gap-2">
                            ${char.status === 'accepted' && !char.deletion_requested_at ? `
                                <button onclick="actions.selectCharacter('${char.id}')" class="w-full py-4 bg-gov-blue text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all rounded-xl shadow-lg">CHARGER</button>
                            ` : ''}
                            <button onclick="actions.showGlobalAudit('${char.id}')" class="w-full py-2.5 bg-white text-gray-500 hover:text-gov-blue border border-gray-200 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                <i data-lucide="search" class="w-3.5 h-3.5"></i> AUDIT GLOBAL
                            </button>
                        </div>
                    </div>
                `).join('')}
                
                <button onclick="actions.goToCreate()" class="group bg-white/40 border-4 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center p-12 hover:border-gov-blue hover:bg-blue-50/50 transition-all min-h-[400px]">
                    <div class="w-16 h-16 bg-white text-gray-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-xl group-hover:scale-110 duration-500">
                        <i data-lucide="plus" class="w-8 h-8"></i>
                    </div>
                    <span class="text-gov-text text-xl font-black uppercase italic tracking-tighter">NOUVEAU<br>DOSSIER</span>
                </button>
            </div>
        `;
    } 

    else if (currentTab === 'perms') {
        tabContent = `
            <div class="space-y-8 animate-in max-w-5xl mx-auto pb-20">
                ${u.isFounder || hasPermission('can_bypass_login') ? `
                    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-[32px] text-white shadow-2xl flex items-center justify-between mb-8">
                        <div class="flex items-center gap-6">
                            <div class="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-2xl">
                                <i data-lucide="crown" class="w-10 h-10"></i>
                            </div>
                            <div>
                                <h3 class="text-3xl font-black italic uppercase tracking-tighter">ACCÈS FONDATION</h3>
                                <p class="text-sm font-bold uppercase tracking-widest opacity-80">Contrôle Racine de l'infrastructure TFRP</p>
                            </div>
                        </div>
                        <i data-lucide="shield-check" class="w-12 h-12 opacity-30"></i>
                    </div>
                ` : ''}

                <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl">
                    <h4 class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-10">Privilèges Actifs</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${ALL_PERMISSIONS.map(p => {
                            const hasPerm = perms[p.k] === true || u.isFounder;
                            return `
                                <div class="bg-gov-light p-6 rounded-2xl border ${hasPerm ? 'border-gov-blue/20 bg-blue-50/20' : 'border-gray-100 opacity-60'} flex items-start gap-5 transition-all">
                                    <div class="w-10 h-10 shrink-0 rounded-xl ${hasPerm ? 'bg-gov-blue text-white shadow-lg' : 'bg-gray-200 text-gray-400'} flex items-center justify-center">
                                        <i data-lucide="${hasPerm ? 'shield-check' : 'shield-off'}" class="w-5 h-5"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center justify-between gap-2 mb-1">
                                            <span class="text-[11px] font-black text-gov-text uppercase tracking-widest truncate">${p.l}</span>
                                            <span class="text-[8px] font-black px-2 py-0.5 rounded-full ${hasPerm ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}">${hasPerm ? 'ACTIF' : 'OFF'}</span>
                                        </div>
                                        <p class="text-[10px] text-gray-500 leading-relaxed italic">"${p.d}"</p>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    else if (currentTab === 'lootbox') {
        const sortedRewards = [...WHEEL_REWARDS].sort((a,b) => b.weight - a.weight);
        const isOpening = state.isOpening;
        const openingIdx = state.openingCrateIdx;

        tabContent = `
            <div class="animate-in pb-32 space-y-12 max-w-6xl mx-auto">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 bg-[#000091] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div class="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div class="relative z-10">
                            <h3 class="text-5xl font-black italic uppercase tracking-tighter mb-4">Loterie <span class="text-blue-300">Nationale.</span></h3>
                            <p class="text-blue-100/60 text-sm max-w-md font-medium">Tentez votre chance pour débloquer des capitaux, des grades VIP ou des rôles légendaires exclusifs.</p>
                        </div>
                        <div class="mt-10 flex items-center gap-6 relative z-10">
                            <div class="bg-black/20 p-6 rounded-3xl border border-white/10 flex items-center gap-6">
                                <div>
                                    <div class="text-[9px] text-blue-300 font-black uppercase tracking-widest mb-1">Clés Disponibles</div>
                                    <div class="text-5xl font-mono font-black text-yellow-400">${turns}</div>
                                </div>
                                <i data-lucide="key" class="w-10 h-10 text-yellow-500/50"></i>
                            </div>
                            <button onclick="actions.showProbabilities()" class="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-all flex items-center gap-2">
                                <i data-lucide="help-circle" class="w-4 h-4"></i> Algorithme de Chance
                            </button>
                        </div>
                    </div>

                    <div class="bg-white p-8 rounded-[48px] border border-gray-100 shadow-xl flex flex-col">
                        <h4 class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-6">Comment obtenir des clés ?</h4>
                        <div class="space-y-4">
                            <div class="flex items-start gap-4 p-4 bg-pink-50 rounded-2xl border border-pink-100 group">
                                <div class="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-lg"><i data-lucide="rocket" class="w-4 h-4"></i></div>
                                <div><div class="text-xs font-black text-pink-700 uppercase">Boost Serveur</div><p class="text-[10px] text-pink-600/70 font-medium">Gagnez des clés auto. pour chaque boost Discord.</p></div>
                            </div>
                            <div class="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 group">
                                <div class="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg"><i data-lucide="star" class="w-4 h-4"></i></div>
                                <div><div class="text-xs font-black text-blue-700 uppercase">Events & Staff</div><p class="text-[10px] text-blue-600/70 font-medium">Récompenses lors d'animations ou actes méritants.</p></div>
                            </div>
                            <div class="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 group">
                                <div class="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg"><i data-lucide="check-circle" class="w-4 h-4"></i></div>
                                <div><div class="text-xs font-black text-emerald-700 uppercase">Succès In-Game</div><p class="text-[10px] text-emerald-600/70 font-medium">Clés périodiques pour les citoyens actifs.</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-8">
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4 px-2">
                        <span class="w-8 h-px bg-gray-200"></span> TERMINAL D'OUVERTURE
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        ${[...Array(Math.max(6, turns)).keys()].map(i => {
                            const isTarget = openingIdx === i;
                            const canOpen = turns > 0 && !isOpening;
                            return `
                                <button onclick="${canOpen ? `actions.openCrate(${i})` : ''}" 
                                    ${!canOpen && !isTarget ? 'disabled' : ''}
                                    class="w-full aspect-square rounded-[32px] border-4 flex flex-col items-center justify-center gap-4 transition-all duration-300 relative group
                                    ${canOpen ? 'bg-white border-gray-50 hover:border-gov-blue hover:shadow-2xl' : 'bg-gray-100 border-gray-100 opacity-50 cursor-not-allowed'}
                                    ${isTarget ? 'bg-blue-50 border-gov-blue animate-pulse' : ''}">
                                    
                                    <div class="w-16 h-16 rounded-2xl bg-gov-light flex items-center justify-center text-gray-400 border border-gray-100 group-hover:text-gov-blue transition-transform">
                                        <i data-lucide="package" class="w-8 h-8"></i>
                                    </div>
                                    <div class="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gov-text">
                                        ${isTarget ? 'OUVERTURE...' : 'CAISSE'}
                                    </div>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="bg-white p-10 rounded-[48px] border border-gray-100 shadow-xl overflow-hidden">
                    <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Table des Butins</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        ${sortedRewards.slice(0, 15).map(r => `
                            <div class="flex justify-between items-center p-4 bg-gov-light rounded-2xl border border-gray-100">
                                <div class="flex items-center gap-3">
                                    <div class="w-2 h-2 rounded-full" style="background: ${r.color}"></div>
                                    <span class="text-[10px] font-black text-gov-text uppercase">${r.label}</span>
                                </div>
                                <span class="text-[8px] font-black uppercase text-gray-400">${r.rarity}</span>
                            </div>
                        `).join('')}
                    </div>
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
                            <div class="w-12 h-12 rounded-xl bg-gov-light flex items-center justify-center text-lg font-black text-gov-red border border-gray-200 shadow-inner group-hover:scale-105 transition-transform italic">${s.type[0]}</div>
                            <div>
                                <div class="text-[10px] font-black text-gov-text uppercase tracking-tight italic">${s.type.toUpperCase()} — LE ${new Date(s.created_at).toLocaleDateString()}</div>
                                <div class="text-[12px] text-gray-500 font-medium italic mt-1">"${s.reason}"</div>
                            </div>
                        </div>
                        ${!s.appeal_at ? `
                            <button onclick="actions.openAppealModal('${s.id}')" class="text-[8px] font-black text-gov-blue uppercase tracking-widest border-2 border-gov-blue px-4 py-2 rounded-xl hover:bg-gov-blue hover:text-white transition-all">CONTESTER</button>
                        ` : '<span class="text-[8px] font-black text-gray-400 uppercase italic bg-gov-light px-3 py-1.5 rounded-lg border border-gray-200">En examen</span>'}
                    </div>
                `).join('') : '<div class="text-center py-24 text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] border-4 border-dashed border-gray-100 rounded-[40px]">Aucun signalement répertorié</div>'}
            </div>
        `;
    }

    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        tabContent = `
            <div class="animate-in max-w-5xl mx-auto pb-20 space-y-8">
                <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl">
                    <h4 class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-8">Transparence des Données (RGPD)</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="p-6 bg-gov-light rounded-3xl border border-gray-100">
                            <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Identité Profil</div>
                            <div class="text-sm font-bold text-gov-text truncate">@${u.username}</div>
                        </div>
                        <div class="p-6 bg-gov-light rounded-3xl border border-gray-100">
                            <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Dossiers Actifs</div>
                            <div class="text-sm font-bold text-gov-text">${characters.length} Fiches Citoyennes</div>
                        </div>
                        <div class="p-6 bg-gov-light rounded-3xl border border-gray-100">
                            <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Réseau</div>
                            <div class="text-sm font-bold text-gov-text">${Object.keys(perms).length} Accréditations</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-10 rounded-[40px] border-t-8 border-gov-red shadow-2xl">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-red-50 text-gov-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <i data-lucide="shield-alert" class="w-8 h-8"></i>
                        </div>
                        <h4 class="text-2xl font-black text-gov-text uppercase italic mb-4">Suppression Définitive</h4>
                        <p class="text-sm text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto font-medium italic">Toutes vos données seront effacées irrévocablement dans un délai de 72h.</p>
                        
                        ${deletionDate ? `
                            <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl transform active:scale-95">ANNULER LA PROCÉDURE</button>
                        ` : `
                            <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl transform hover:scale-105 active:scale-95">RÉVOQUER TOUTES MES DONNÉES</button>
                        `}
                    </div>
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
                <div class="flex items-center gap-1 h-full ml-4 overflow-x-auto no-scrollbar scroll-smooth">
                    ${tabs.map(t => `
                        <button onclick="actions.setProfileTab('${t.id}')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${currentTab === t.id ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-400 hover:text-gov-text'}">
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
                        </div>
                    </div>
                    <div class="flex-1 pb-4 text-center md:text-left w-full">
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
