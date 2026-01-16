
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router, render, hasPermission } from '../utils.js';
import { loadUserSanctions } from '../actions/profile.js';
import { ui } from '../ui.js';
import { WHEEL_REWARDS } from '../actions/wheel.js';

const ALL_PERMISSIONS = [
    { k: 'can_bypass_login', l: 'Accès Fondation', d: "Accès racine permettant de naviguer sur l'intégralité du terminal sans personnage actif." },
    { k: 'can_approve_characters', l: 'File Whitelist', d: "Autorise l'examen et la validation des nouveaux citoyens (Whitelist)." },
    { k: 'can_manage_characters', l: 'Registre Civil', d: "Accès total au registre : modification des points, métiers et purge de dossiers." },
    { k: 'can_manage_economy', l: 'Pilotage Économique', d: "Pouvoir de régulation sur les masses monétaires et ajustement des soldes." },
    { k: 'can_manage_staff', l: 'Directoire Staff', d: "Accréditation de commandement permettant de nommer des membres staff." },
    { k: 'can_manage_illegal', l: 'Audit Illégal', d: "Supervision des syndicats criminels et validation des braquages." },
    { k: 'can_manage_inventory', l: 'Saisie d\'Objets', d: "Droit de perquisition administrative à distance." },
    { k: 'can_launch_session', l: 'Cycle de Session', d: "Autorise l'ouverture et la fermeture des sessions de jeu." },
    { k: 'can_execute_commands', l: 'Console ERLC', d: "Accès direct au terminal de commande du serveur ERLC." },
    { k: 'can_give_wheel_turn', l: 'Maître des Roues', d: "Autorise l'attribution de clés de lootbox." },
    { k: 'can_warn', l: 'Warn System', d: "Droit d'application d'avertissements officiels." },
    { k: 'can_mute', l: 'Mute System', d: "Droit de mise en sourdine sur Discord." },
    { k: 'can_ban', l: 'Ban System', d: "Droit de bannissement du réseau TFRP." }
];

// Attach function to window for global access
window.actions.showGlobalAudit = async (charId) => {
    const char = state.characters.find(c => c.id === charId);
    if (!char) return;
    
    ui.showToast("Extraction du dossier CAD...", "info");
    
    try {
        const [bankRes, invRes, entRes] = await Promise.all([
            state.supabase.from('bank_accounts').select('*').eq('character_id', charId).maybeSingle(),
            state.supabase.from('inventory').select('*').eq('character_id', charId),
            state.supabase.from('enterprise_members').select('*, enterprises(*)').eq('character_id', charId)
        ]);

        const bank = bankRes.data || { bank_balance: 0, cash_balance: 0, savings_balance: 0 };
        const inventory = invRes.data || [];
        const enterprises = entRes.data || [];

        ui.showModal({
            title: `Audit Global : ${char.first_name} ${char.last_name}`,
            content: `
                <div class="text-left space-y-6">
                    <div class="bg-gov-light p-6 rounded-3xl border border-gray-200">
                        <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i data-lucide="landmark" class="w-3.5 h-3.5 text-gov-blue"></i> Finances Consolidées
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            <div><div class="text-[8px] font-bold text-gray-500 uppercase">Banque</div><div class="font-mono text-sm font-black text-gov-text">$${bank.bank_balance.toLocaleString()}</div></div>
                            <div><div class="text-[8px] font-bold text-gray-500 uppercase">Liquide</div><div class="font-mono text-sm font-black text-gov-text">$${bank.cash_balance.toLocaleString()}</div></div>
                            <div><div class="text-[8px] font-bold text-gray-500 uppercase">Épargne</div><div class="font-mono text-sm font-black text-emerald-600">$${bank.savings_balance.toLocaleString()}</div></div>
                        </div>
                    </div>

                    <div class="bg-gov-light p-6 rounded-3xl border border-gray-200">
                        <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i data-lucide="package" class="w-3.5 h-3.5 text-orange-500"></i> Inventaire (${inventory.length})
                        </div>
                        <div class="max-h-32 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                            ${inventory.length > 0 ? inventory.map(i => `
                                <div class="flex justify-between items-center text-[10px] p-2 bg-white/50 rounded-lg">
                                    <span class="font-bold uppercase italic">${i.name}</span>
                                    <span class="font-mono font-black">x${i.quantity}</span>
                                </div>
                            `).join('') : '<div class="text-center italic text-gray-400 text-[10px]">Sac vide</div>'}
                        </div>
                    </div>

                    <div class="bg-gov-light p-6 rounded-3xl border border-gray-200">
                        <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i data-lucide="briefcase" class="w-3.5 h-3.5 text-blue-500"></i> Affiliations
                        </div>
                        <div class="space-y-2">
                            ${enterprises.length > 0 ? enterprises.map(e => `
                                <div class="flex justify-between items-center text-[10px]">
                                    <span class="font-bold uppercase text-gov-blue">${e.enterprises?.name}</span>
                                    <span class="text-[8px] font-black bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">${e.rank}</span>
                                </div>
                            `).join('') : '<div class="text-center italic text-gray-400 text-[10px]">Aucune affiliation</div>'}
                        </div>
                    </div>
                </div>
            `,
            confirmText: "Fermer l'Audit"
        });
    } catch (err) {
        ui.showToast("Erreur d'audit.", "error");
    }
};

export const ProfileHubView = () => {
    const u = state.user;
    if (!u) return '';

    const currentTab = state.activeProfileTab || 'identity';
    const characters = state.characters || [];
    const perms = u.permissions || {};
    const turns = u.whell_turn || 0;

    const tabs = [
        { id: 'identity', label: 'Dossiers', icon: 'users' },
        { id: 'perms', label: 'Accréditations', icon: 'shield-check' },
        { id: 'lootbox', label: 'Lootbox', icon: 'package' },
        { id: 'sanctions', label: 'Sanctions', icon: 'alert-triangle' },
        { id: 'security', label: 'Sécurité', icon: 'lock' }
    ];

    let tabContent = '';

    if (currentTab === 'identity') {
        tabContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in pb-20">
                ${hasPermission('can_bypass_login') ? `
                    <div class="gov-card flex flex-col bg-[#0f172a] rounded-[32px] border border-blue-500/30 shadow-2xl overflow-hidden group">
                        <div class="p-8 pb-4 flex justify-between items-start relative z-10">
                            <div class="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner text-blue-400">
                                <i data-lucide="shield-alert" class="w-7 h-7"></i>
                            </div>
                            <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest bg-blue-500/10 text-blue-400 border-blue-500/20">ROOT ACCESS</span>
                        </div>
                        <div class="p-8 pt-2 flex-1 relative z-10">
                            <h3 class="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">ACCÈS<br><span class="text-blue-400">FONDATION</span></h3>
                            <p class="text-[10px] text-gray-500 italic font-medium leading-relaxed">Administration globale sans dossier citoyen.</p>
                        </div>
                        <div class="p-6 bg-white/5 border-t border-white/10 relative z-10">
                            <button onclick="actions.openFoundationModal()" class="w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all rounded-xl shadow-lg">INJECTER SESSION</button>
                        </div>
                    </div>
                ` : ''}

                ${characters.map(char => `
                    <div class="gov-card flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden transition-all hover:shadow-2xl">
                        <div class="p-8 pb-4 flex justify-between items-start">
                            <div class="w-14 h-14 bg-gov-light rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner text-gray-400">
                                <i data-lucide="user" class="w-7 h-7"></i>
                            </div>
                            <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${char.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}">
                                ${char.status.toUpperCase()}
                            </span>
                        </div>
                        <div class="p-8 pt-2 flex-1">
                            <div class="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Identité Nationale</div>
                            <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter leading-none mb-6">${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span></h3>
                            <div class="flex justify-between items-center py-2 border-b border-gray-50"><span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secteur</span><span class="${char.alignment === 'illegal' ? 'text-gov-red' : 'text-gov-blue'} text-[10px] font-black uppercase italic">${char.alignment}</span></div>
                        </div>
                        <div class="p-6 bg-gov-light/30 border-t border-gray-100 flex flex-col gap-2">
                            <button onclick="actions.selectCharacter('${char.id}')" class="w-full py-4 bg-gov-blue text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all rounded-xl shadow-lg">CHARGER LE DOSSIER</button>
                            <button onclick="actions.startEditCharacter('${char.id}')" class="w-full py-2.5 bg-white text-gray-500 border border-gray-200 rounded-lg font-black text-[9px] uppercase tracking-widest">ÉDITER</button>
                        </div>
                    </div>
                `).join('')}
                
                <button onclick="actions.goToCreate()" class="group bg-white/40 border-4 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center p-12 hover:border-gov-blue hover:bg-blue-50/50 transition-all min-h-[400px]">
                    <div class="w-16 h-16 bg-white text-gray-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-xl group-hover:scale-110 duration-500">
                        <i data-lucide="plus" class="w-8 h-8"></i>
                    </div>
                    <span class="text-gov-text text-xl font-black uppercase italic tracking-tighter text-center">NOUVEAU<br>RECENSEMENT</span>
                </button>
            </div>
        `;
    } 

    else if (currentTab === 'perms') {
        tabContent = `
            <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl animate-in max-w-5xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${ALL_PERMISSIONS.map(p => {
                        const hasPerm = perms[p.k] === true || u.isFounder;
                        return `
                            <div class="bg-gov-light p-6 rounded-2xl border ${hasPerm ? 'border-gov-blue/20 bg-blue-50/20 shadow-md' : 'border-gray-100 opacity-60'} flex items-start gap-5 transition-all">
                                <div class="w-10 h-10 shrink-0 rounded-xl ${hasPerm ? 'bg-gov-blue text-white shadow-blue-900/20' : 'bg-gray-200 text-gray-400'} flex items-center justify-center shadow-md">
                                    <i data-lucide="${hasPerm ? 'shield-check' : 'shield-off'}" class="w-5 h-5"></i>
                                </div>
                                <div class="flex-1">
                                    <span class="text-[11px] font-black text-gov-text uppercase tracking-widest block mb-1">${p.l}</span>
                                    <p class="text-[10px] text-gray-500 italic font-medium">"${p.d}"</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    else if (currentTab === 'lootbox') {
        tabContent = `
            <div class="animate-in max-w-5xl mx-auto pb-20 space-y-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- INFOS CLES -->
                    <div class="lg:col-span-1 space-y-6">
                        <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl relative overflow-hidden">
                            <div class="absolute top-0 right-0 p-4 opacity-5"><i data-lucide="key" class="w-20 h-20"></i></div>
                            <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Votre Stock</div>
                            <div class="text-6xl font-mono font-black text-gov-blue mb-6">${turns}</div>
                            <div class="text-[10px] text-gray-500 font-bold uppercase leading-relaxed">
                                <p class="mb-3">• 1 Boost Serveur = <span class="text-gov-blue">1 Clé</span></p>
                                <p class="mb-3">• Participation Events = <span class="text-gov-blue">Variable</span></p>
                                <p>• Récompense Staff = <span class="text-gov-blue">Au mérite</span></p>
                            </div>
                        </div>
                        <div class="bg-indigo-900 text-white p-8 rounded-[40px] shadow-xl">
                            <h4 class="text-xs font-black uppercase tracking-widest mb-4">Règles d'Usage</h4>
                            <p class="text-[10px] text-indigo-200 leading-relaxed italic">"Les gains financiers sont crédités instantanément. Les rôles et VIP nécessitent le téléchargement du certificat et l'envoi d'un ticket."</p>
                        </div>
                    </div>

                    <!-- GRILLE CAISSES -->
                    <div class="lg:col-span-2 bg-[#050505] p-8 rounded-[48px] shadow-2xl border border-white/5 relative overflow-hidden">
                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(0,0,145,0.1),transparent_70%)]"></div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 relative z-10">
                            ${Array.from({ length: Math.max(6, turns) }).map((_, i) => {
                                const canOpen = turns > 0 && !state.isOpening;
                                const isOpening = state.openingCrateIdx === i;
                                return `
                                    <button onclick="${canOpen ? `actions.openCrate(${i})` : ''}" 
                                        class="aspect-square bg-white/5 rounded-[32px] border border-white/10 flex flex-col items-center justify-center gap-4 transition-all duration-300
                                        ${canOpen ? 'hover:bg-white/10 hover:border-blue-500/50 cursor-pointer group' : 'opacity-30 cursor-not-allowed'}
                                        ${isOpening ? 'animate-pulse border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-blue-600/10' : ''}">
                                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 border border-white/5 group-hover:scale-110 transition-transform">
                                            <i data-lucide="package" class="w-6 h-6"></i>
                                        </div>
                                        <div class="text-[8px] font-black text-gray-500 uppercase tracking-widest">${isOpening ? 'DÉCRYPTAGE...' : 'CAISSE TFRP'}</div>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        tabContent = `
            <div class="animate-in max-w-5xl mx-auto pb-20 space-y-8">
                <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl">
                    <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Fiches Citoyennes & Audit Interactif</h4>
                    <div class="space-y-4">
                        ${characters.map(char => `
                            <div class="flex items-center justify-between p-5 bg-gov-light rounded-2xl border border-gray-100 group transition-all hover:border-gov-blue/30">
                                <div class="flex-1 min-w-0">
                                    <div class="font-black text-gov-text text-sm uppercase italic truncate">${char.first_name} ${char.last_name}</div>
                                    <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">REF: #${char.id.substring(0,8).toUpperCase()}</div>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="actions.showGlobalAudit('${char.id}')" class="px-5 py-2.5 bg-white border border-gray-200 text-gov-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gov-blue hover:text-white transition-all flex items-center gap-2 shadow-sm">
                                        <i data-lucide="search" class="w-4 h-4"></i> Audit Global
                                    </button>
                                    <button onclick="actions.requestCharacterDeletion('${char.id}')" class="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm">Purger</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white p-10 rounded-[40px] border-t-8 border-gov-red shadow-2xl text-center">
                    <h4 class="text-2xl font-black text-gov-text uppercase italic mb-4">Révocation Totale (RGPD)</h4>
                    <p class="text-sm text-gray-500 mb-10 max-w-2xl mx-auto font-medium">La suppression définitive de l'identité intervient après 72h de latence.</p>
                    ${deletionDate ? `
                        <div class="bg-orange-50 border-2 border-orange-200 p-8 rounded-[32px] mb-8 inline-block w-full">
                            <div class="text-[9px] text-orange-600 font-black uppercase tracking-[0.4em] mb-4">Cooldown Actif</div>
                            <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl">ANNULER LA PROCÉDURE</button>
                        </div>
                    ` : `
                        <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl">EFFACER TOUTES MES DONNÉES</button>
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
                <div class="flex items-center gap-1 h-full ml-4 overflow-x-auto no-scrollbar scroll-smooth">
                    ${tabs.map(t => `
                        <button onclick="actions.setProfileTab('${t.id}')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${currentTab === t.id ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-400 hover:text-gov-text'}">${t.label}</button>
                    `).join('')}
                </div>
            </div>
            <div class="flex items-center gap-4 h-full pr-4">
                <div class="text-right hidden sm:block">
                    <div class="text-[10px] font-black uppercase text-gov-text leading-none">${u.username}</div>
                    <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">SÉANCE IDENTITAIRE</div>
                </div>
                <img src="${u.avatar}" class="w-10 h-10 rounded-full border border-gray-200 grayscale p-0.5 object-cover">
            </div>
        </nav>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
            <div class="relative h-64 shrink-0 overflow-hidden bg-gov-blue">
                ${u.banner ? `<img src="${u.banner}" class="w-full h-full object-cover">` : '<div class="w-full h-full bg-gradient-to-r from-gov-blue via-blue-900 to-indigo-900 opacity-90"></div>'}
                <div class="absolute inset-0 bg-gradient-to-t from-[#F6F6F6] via-transparent to-transparent"></div>
            </div>

            <div class="max-w-6xl mx-auto w-full px-8 -mt-24 relative z-10 mb-12 flex flex-col md:flex-row items-end gap-10">
                <div class="avatar-container w-40 h-40">
                    <img src="${u.avatar}" class="avatar-img border-[8px] border-white bg-white shadow-2xl">
                    <div class="absolute bottom-4 right-4 w-10 h-10 bg-gov-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl z-30">
                        <i data-lucide="verified" class="w-5 h-5"></i>
                    </div>
                </div>
                <div class="flex-1 pb-4 text-center md:text-left">
                    <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-3">Profil Unifié</div>
                    <h2 class="text-5xl font-black text-gov-text tracking-tighter uppercase italic leading-none">${u.username}</h2>
                </div>
            </div>

            <main class="max-w-6xl mx-auto w-full px-8 flex-1">
                ${tabContent}
            </main>
        </div>
    </div>
    `;
};
