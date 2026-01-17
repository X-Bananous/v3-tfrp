
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router, render } from '../utils.js';
import { loadUserSanctions } from '../actions/profile.js';
import { ui } from '../ui.js';
import { fetchStaffProfiles, fetchGlobalTransactions } from '../services.js';
import { WHEEL_REWARDS } from '../actions/wheel.js';

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

    if (!state.hasFetchedSanctions) {
        state.hasFetchedSanctions = true;
        loadUserSanctions();
        fetchGlobalTransactions();
    }

    const tabs = [
        { id: 'identity', label: 'Dossiers', icon: 'users' },
        { id: 'perms', label: 'Accréditations', icon: 'shield-check' },
        { id: 'sanctions', label: 'Sanctions', icon: 'alert-triangle' },
        { id: 'lootbox', label: 'Lootbox', icon: 'package' },
        { id: 'security', label: 'Sécurité', icon: 'lock' }
    ];

    const MobileMenuOverlay = () => `
        <div class="fixed inset-0 z-[2000] bg-white flex flex-col animate-in overflow-hidden">
            <div class="h-20 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase font-black">État de Californie</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>
                <button onclick="actions.toggleMobileMenu()" class="p-3 bg-gov-light text-gov-text rounded-sm">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                ${tabs.map(t => `
                    <button onclick="actions.setProfileTab('${t.id}'); actions.toggleMobileMenu();" class="w-full text-left py-4 border-b border-gray-100 font-black uppercase text-sm tracking-widest ${currentTab === t.id ? 'text-gov-blue' : 'text-gray-400'} flex items-center gap-4">
                        <i data-lucide="${t.icon}" class="w-5 h-5"></i> ${t.label}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    let tabContent = '';

    if (currentTab === 'identity') {
        tabContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in pb-20">
                ${characters.map(char => {
                    const isAccepted = char.status === 'accepted';
                    const isRejected = char.status === 'rejected';
                    const isDeleting = !!char.deletion_requested_at;
                    const isTemp = char.infos?.type === 'temporaire';
                    const statusColor = isDeleting ? 'orange' : isAccepted ? 'emerald' : isRejected ? 'red' : 'amber';
                    
                    return `
                        <div class="gov-card flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div class="p-8 pb-4 flex justify-between items-start">
                                <div class="w-14 h-14 bg-gov-light rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                    <i data-lucide="${isTemp ? 'timer' : 'user'}" class="w-7 h-7 ${isTemp ? 'text-orange-500' : 'text-gray-400'}"></i>
                                </div>
                                <div class="flex flex-col items-end gap-1">
                                    <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest bg-${statusColor}-50 text-${statusColor}-600 border-${statusColor}-200">
                                        ${isDeleting ? 'PURGE EN COURS' : char.status.toUpperCase()}
                                    </span>
                                    ${isTemp ? '<span class="text-[7px] font-black text-orange-600 uppercase tracking-tighter">DOSSIER TEMPORAIRE</span>' : ''}
                                </div>
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
                                        <button onclick="actions.viewCensusDetails('${char.id}')" class="flex-1 py-2.5 bg-white text-gray-500 hover:text-gov-blue border border-gray-200 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <i data-lucide="info" class="w-3.5 h-3.5"></i> NOTES
                                        </button>
                                        <button onclick="actions.startEditCharacter('${char.id}')" class="flex-1 py-2.5 bg-white text-gray-500 hover:text-gov-blue border border-gray-200 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <i data-lucide="settings" class="w-3.5 h-3.5"></i> ÉDITER
                                        </button>
                                        
                                        ${isTemp ? `
                                            <button 
                                                onmousedown="actions.startHoldPurge(event, '${char.id}')" 
                                                onmouseup="actions.stopHoldPurge()" 
                                                onmouseleave="actions.stopHoldPurge()"
                                                class="hold-to-purge flex-1 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 relative overflow-hidden">
                                                <div id="hold-progress-${char.id}" class="absolute left-0 top-0 h-full bg-red-600/20 w-0 pointer-events-none transition-all duration-100"></div>
                                                <i data-lucide="trash-2" class="w-3.5 h-3.5 relative z-10"></i> <span class="relative z-10">WIPE FLASH</span>
                                            </button>
                                        ` : `
                                            <button onclick="actions.requestCharacterDeletion('${char.id}')" class="flex-1 py-2.5 bg-white text-gray-400 hover:text-gov-red border border-gray-200 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> PURGER
                                            </button>
                                        `}
                                    </div>
                                ` : isDeleting ? `
                                    <div class="text-center mb-2">
                                        <div class="text-[7px] text-orange-600 font-black uppercase tracking-widest animate-pulse">COOLDOWN : 72H</div>
                                    </div>
                                    <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="w-full py-3 bg-white border-2 border-orange-500 text-orange-600 font-black text-[9px] uppercase tracking-widest hover:bg-orange-50 transition-all rounded-xl">
                                        ANNULER LA SUPPRESSION
                                    </button>
                                ` : isRejected ? `
                                    <div class="flex flex-col gap-2">
                                        <button onclick="actions.startEditCharacter('${char.id}')" class="w-full py-4 bg-gov-text text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all rounded-xl">
                                            MODIFIER LA DEMANDE
                                        </button>
                                        <button onclick="actions.deleteCharacterImmediate('${char.id}')" class="w-full py-2.5 text-red-600 font-black text-[9px] uppercase tracking-widest hover:underline">
                                            SUPPRIMER DÉFINITIVEMENT
                                        </button>
                                    </div>
                                ` : `
                                    <div class="w-full py-4 bg-gray-100 text-gray-400 font-black text-[9px] uppercase tracking-widest rounded-xl text-center border border-gray-200 italic">
                                        VÉRIFICATION EN COURS...
                                    </div>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
                
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
            <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl animate-in max-w-5xl mx-auto pb-20">
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
        const activeSanctionsCount = sanctions.filter(s => !s.expires_at || new Date(s.expires_at) > new Date()).length;
        
        tabContent = `
            <div class="animate-in max-w-4xl mx-auto pb-20 space-y-8">
                <!-- RÉCAPITULATIF CONDUITE -->
                <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-gov-blue/5 rounded-bl-full"></div>
                    <div class="w-20 h-20 rounded-3xl ${activeSanctionsCount > 0 ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'} flex items-center justify-center shrink-0 shadow-inner">
                        <i data-lucide="${activeSanctionsCount > 0 ? 'shield-alert' : 'shield-check'}" class="w-10 h-10"></i>
                    </div>
                    <div class="flex-1 text-center md:text-left">
                        <h4 class="text-2xl font-black text-gov-text uppercase italic tracking-tighter mb-1">État de votre Casier</h4>
                        <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">
                            ${activeSanctionsCount === 0 ? 'Félicitations, votre conduite est exemplaire.' : `Attention, vous avez <span class="text-orange-600">${activeSanctionsCount}</span> sanction(s) active(s).`}
                        </p>
                    </div>
                    <div class="bg-gov-light px-6 py-3 rounded-2xl border border-gray-100 text-center">
                        <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Historique</div>
                        <div class="text-2xl font-mono font-black text-gov-text">${sanctions.length}</div>
                    </div>
                </div>

                <!-- LISTE DES SANCTIONS -->
                <div class="space-y-4">
                    ${sanctions.length > 0 ? sanctions.map(s => {
                        const isExpired = s.expires_at && new Date(s.expires_at) < new Date();
                        const typeColor = s.type === 'warn' ? 'amber' : s.type === 'mute' ? 'orange' : 'red';
                        const statusLabel = isExpired ? 'EXPIRÉ' : 'ACTIF';
                        
                        return `
                            <div class="p-6 bg-white border border-gray-100 rounded-[32px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-${typeColor}-200 transition-all shadow-lg hover:shadow-xl relative overflow-hidden">
                                <div class="absolute top-0 left-0 w-1.5 h-full bg-${typeColor}-500"></div>
                                <div class="flex items-center gap-6 flex-1 min-w-0">
                                    <div class="w-14 h-14 rounded-2xl bg-${typeColor}-50 flex items-center justify-center text-xl font-black uppercase text-${typeColor}-600 border border-${typeColor}-100 shadow-inner italic">${s.type[0]}</div>
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-3 mb-1">
                                            <div class="text-[10px] font-black text-gov-text uppercase tracking-tight italic">${s.type.toUpperCase()} — LE ${new Date(s.created_at).toLocaleDateString()}</div>
                                            <span class="px-2 py-0.5 rounded bg-${isExpired ? 'gray' : typeColor}-100 text-${isExpired ? 'gray' : typeColor}-600 text-[8px] font-black uppercase border border-${isExpired ? 'gray' : typeColor}-200">${statusLabel}</span>
                                        </div>
                                        <div class="text-[13px] text-gray-500 font-medium italic leading-relaxed truncate">"${s.reason}"</div>
                                        <div class="text-[8px] text-gray-400 font-mono mt-1 uppercase">ID: #${s.id.substring(0,8).toUpperCase()}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 border-gray-50 pt-4 md:pt-0">
                                    ${!s.appeal_at && !isExpired ? `
                                        <button onclick="actions.openAppealModal('${s.id}')" class="flex-1 md:flex-none text-[8px] font-black text-gov-blue uppercase tracking-widest border-2 border-gov-blue/20 px-6 py-2.5 rounded-xl hover:bg-gov-blue hover:text-white transition-all shadow-sm">CONTESTER</button>
                                    ` : s.appeal_at ? `
                                        <span class="flex-1 md:flex-none text-[8px] font-black text-gray-400 uppercase italic bg-gov-light px-4 py-2.5 rounded-xl border border-gray-200 text-center">Appel en examen</span>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('') : `
                        <div class="text-center py-24 text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] border-4 border-dashed border-gray-100 rounded-[48px] bg-white/50">
                            Aucun signalement administratif répertorié
                        </div>
                    `}
                </div>
                
                <div class="bg-blue-50 border border-blue-100 p-6 rounded-3xl">
                    <h5 class="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2"><i data-lucide="info" class="w-3 h-3"></i> Information au Citoyen</h5>
                    <p class="text-[11px] text-blue-500/80 leading-relaxed font-medium">Les sanctions sont archivées de façon permanente mais perdent leur valeur d'opposition après expiration de la période de latence. Vous disposez d'un droit de contestation par année civile pour chaque dossier.</p>
                </div>
            </div>
        `;
    }

    else if (currentTab === 'lootbox') {
        const turns = u.whell_turn || 0;
        const isOpening = state.isOpening;
        
        tabContent = `
            <div class="animate-in max-w-6xl mx-auto pb-20 space-y-12">
                <!-- SECTION TIRAGE -->
                <div class="bg-white p-12 rounded-[48px] border border-gray-100 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(0,0,145,0.03),transparent_70%)]"></div>
                    
                    <div class="relative z-10 w-full">
                        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gov-blue/10 text-gov-blue text-[10px] font-black uppercase tracking-[0.3em] border border-gov-blue/20 mb-12">
                            <i data-lucide="package" class="w-4 h-4"></i> Loterie Nationale Certifiée v6.4
                        </div>
                        
                        <div class="flex flex-col items-center mb-16">
                            <div class="relative mb-10">
                                <div id="lootbox-visual" class="w-48 h-48 bg-gov-light rounded-[56px] border-4 border-gov-blue/10 flex items-center justify-center text-gov-blue shadow-2xl relative transition-all duration-500 ${isOpening ? 'lootbox-opening-anim' : 'hover:scale-105 hover:rotate-2 shadow-blue-900/5'}">
                                    <i data-lucide="package" class="w-24 h-24"></i>
                                    <div class="absolute -bottom-6 -right-6 w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-2xl">
                                        <i data-lucide="key" class="w-8 h-8 text-yellow-500"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <h2 class="text-5xl font-black text-gov-text tracking-tighter italic uppercase mb-2">Caisse de Récompenses</h2>
                            <p class="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-12">Solde de Sécurité : <span class="text-gov-blue font-black">${turns} CLÉ(S)</span></p>
                            
                            <button onclick="actions.openCrate(0)" ${turns <= 0 || isOpening ? 'disabled' : ''} 
                                class="px-20 py-6 bg-gov-blue text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all transform active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed">
                                ${isOpening ? 'SÉQUENCE DÉCRYPTAGE...' : 'UTILISER UNE CLÉ'}
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-gray-50 pt-12">
                            <div class="p-6 bg-gov-light/50 rounded-3xl border border-gray-100">
                                <h4 class="text-[9px] font-black text-gov-blue uppercase tracking-widest mb-3 flex items-center gap-2"><i data-lucide="help-circle" class="w-3 h-3"></i> Comment obtenir ?</h4>
                                <p class="text-[11px] text-gray-500 leading-relaxed font-medium italic">Les clés sont distribuées lors d'événements communautaires, de concours de boost Discord ou par mérite administratif.</p>
                            </div>
                            <div class="p-6 bg-gov-light/50 rounded-3xl border border-gray-100">
                                <h4 class="text-[9px] font-black text-gov-blue uppercase tracking-widest mb-3 flex items-center gap-2"><i data-lucide="shield-check" class="w-3 h-3"></i> Gains Garantis</h4>
                                <p class="text-[11px] text-gray-500 leading-relaxed font-medium italic">Chaque clé déverrouille un lot unique. Les sommes d'argent sont créditées instantanément sur votre compte citoyen.</p>
                            </div>
                            <div class="p-6 bg-gov-light/50 rounded-3xl border border-gray-100">
                                <h4 class="text-[9px] font-black text-gov-blue uppercase tracking-widest mb-3 flex items-center gap-2"><i data-lucide="trending-up" class="w-3 h-3"></i> Probabilités</h4>
                                <button onclick="actions.showProbabilities()" class="text-[10px] font-black text-gov-blue uppercase tracking-widest hover:underline flex items-center gap-2">Consulter les chances <i data-lucide="external-link" class="w-3 h-3"></i></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION CATALOGUE DES LOTS -->
                <div class="space-y-6">
                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4 px-2">
                         <span class="w-8 h-px bg-gray-200"></span> CATALOGUE DES DOTATIONS
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        ${WHEEL_REWARDS.map(r => {
                            const rarityColors = {
                                'Commun': 'bg-emerald-50 text-emerald-600 border-emerald-100',
                                'Peu Commun': 'bg-emerald-100 text-emerald-700 border-emerald-200',
                                'Rare': 'bg-blue-50 text-blue-600 border-blue-100',
                                'Très Rare': 'bg-blue-100 text-blue-700 border-blue-200',
                                'Mythique': 'bg-purple-50 text-purple-600 border-purple-100',
                                'Légendaire': 'bg-yellow-50 text-yellow-600 border-yellow-200',
                                'Relique': 'bg-red-50 text-red-600 border-red-200',
                                'Ancestral': 'bg-red-100 text-red-700 border-red-300',
                                'Premium': 'bg-orange-50 text-orange-600 border-orange-100',
                                'Elite': 'bg-indigo-50 text-indigo-600 border-indigo-100',
                                'Divin': 'bg-purple-100 text-purple-700 border-purple-300',
                                'Unique': 'bg-pink-50 text-pink-600 border-pink-100'
                            };
                            return `
                                <div class="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-gov-blue/20 transition-all hover:-translate-y-1">
                                    <div class="w-10 h-10 rounded-full mb-3 flex items-center justify-center shadow-inner" style="background: ${r.color}20">
                                        <i data-lucide="${r.type === 'money' ? 'banknote' : r.type === 'role' ? 'shield' : 'sparkles'}" class="w-5 h-5" style="color: ${r.color}"></i>
                                    </div>
                                    <div class="text-[11px] font-black text-gov-text uppercase tracking-tighter mb-1">${r.label}</div>
                                    <span class="px-2 py-0.5 rounded-full text-[7px] font-black uppercase border tracking-tighter ${rarityColors[r.rarity] || 'bg-gray-50 text-gray-500 border-gray-100'}">${r.rarity}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        
        tabContent = `
            <div class="animate-in max-w-6xl mx-auto pb-20 space-y-8">
                <!-- RÉCAPITULATIF DES DOSSIERS -->
                <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl">
                    <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Maintenance des Dossiers Citoyens</h4>
                    <div class="space-y-4">
                        ${characters.map(char => {
                            const isDeleting = !!char.deletion_requested_at;
                            const isTemp = char.infos?.type === 'temporaire';
                            return `
                                <div class="p-5 bg-gov-light rounded-2xl border ${isDeleting ? 'border-orange-200' : 'border-gray-100'} flex items-center justify-between group">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                                            <i data-lucide="${isTemp ? 'timer' : 'user'}" class="w-6 h-6"></i>
                                        </div>
                                        <div>
                                            <div class="text-sm font-black text-gov-text uppercase tracking-tight">${char.first_name} ${char.last_name}</div>
                                            <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-0.5">${isTemp ? 'Dossier Temporaire' : 'Dossier Permanent'} • ID #${char.id.substring(0,4).toUpperCase()}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button onclick="actions.openCharacterAudit('${char.id}')" class="px-4 py-2 bg-white text-gov-blue border border-gov-blue/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gov-blue hover:text-white transition-all shadow-sm">Audit Global</button>
                                        
                                        ${isDeleting ? `
                                            <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="px-4 py-2 bg-white text-orange-600 border border-orange-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all">Annuler Purge</button>
                                        ` : isTemp ? `
                                            <button 
                                                onmousedown="actions.startHoldPurge(event, '${char.id}')" 
                                                onmouseup="actions.stopHoldPurge()" 
                                                onmouseleave="actions.stopHoldPurge()"
                                                class="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[9px] font-black uppercase tracking-widest relative overflow-hidden group">
                                                <div id="hold-progress-sec-${char.id}" class="absolute left-0 top-0 h-full bg-red-600/10 w-0 pointer-events-none transition-all duration-100"></div>
                                                <span class="relative z-10">Wipe Flash</span>
                                            </button>
                                        ` : `
                                            <button onclick="actions.requestCharacterDeletion('${char.id}')" class="px-4 py-2 bg-white text-gray-400 border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-red-600 hover:border-red-100 transition-all">Purger</button>
                                        `}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- DROIT A L'OUBLI -->
                <div class="bg-white p-10 rounded-[40px] border-t-8 border-gov-red shadow-xl">
                    <h4 class="text-[10px] font-black text-gov-red uppercase tracking-[0.4em] mb-6 flex items-center gap-3"><i data-lucide="shield-alert" class="w-4 h-4"></i> Droit à l'oubli numérique</h4>
                    <p class="text-sm text-gray-500 leading-relaxed mb-10 max-w-2xl font-medium">L'exercice de ce droit entraîne la suppression irrévocable de votre existence numérique dans nos bases sous 72h.</p>
                    
                    ${deletionDate ? `
                        <div class="bg-orange-50 border-2 border-orange-200 p-8 rounded-[32px] mb-8 text-center">
                            <div class="text-[9px] text-orange-600 font-black uppercase tracking-[0.4em] mb-4 italic">Procédure de purge en cours</div>
                            <div class="text-4xl font-mono font-black text-gov-text mb-8">EFFACEMENT DANS 72H</div>
                            <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl">ANNULER LA RÉVOCATION</button>
                        </div>
                    ` : `
                        <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl transform active:scale-95">RÉVOQUER TOUTES MES DONNÉES</button>
                    `}
                </div>
            </div>
        `;
    }

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] min-h-screen overflow-hidden">
        ${isMobileMenuOpen ? MobileMenuOverlay() : ''}
        
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
                <button onclick="actions.backToLanding()" class="hidden lg:flex p-2.5 text-gray-400 hover:text-gov-blue hover:bg-gov-light rounded-sm transition-all" title="Accueil">
                    <i data-lucide="home" class="w-5 h-5"></i>
                </button>
                
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

                <button onclick="actions.toggleMobileMenu()" class="lg:hidden p-2.5 bg-gov-light text-gov-text rounded-sm transition-transform active:scale-95">
                    <i data-lucide="menu" class="w-5 h-5"></i>
                </button>
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
