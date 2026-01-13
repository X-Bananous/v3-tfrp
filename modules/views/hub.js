import { state } from '../state.js';
import { BankView } from './bank.js';
import { StaffView } from './staff.js';
import { AssetsView } from './assets.js';
import { IllicitView } from './illicit.js';
import { ServicesView } from './services.js';
import { EnterpriseView } from './enterprise.js';
import { NotificationsView } from './notifications.js';
import { ProfileView } from './profile.js';
import { JobCenterView } from './jobs.js';
import { hasPermission, router } from '../utils.js';

export const HubView = () => {
    const u = state.user;
    const char = state.activeCharacter;
    if (!char) {
        router('profile_hub');
        return '';
    }

    const panel = state.activeHubPanel;
    const hasStaffAccess = Object.keys(state.user.permissions || {}).length > 0 || state.user.isFounder;
    const isIllegal = char.alignment === 'illegal';
    const erlc = state.erlcData || { currentPlayers: 0, maxPlayers: 42, queue: [], joinKey: '?????' };

    if (state.isPanelLoading) {
        return `<div class="flex h-screen w-full bg-white items-center justify-center animate-in"><div class="text-center"><div class="w-12 h-12 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p class="text-[10px] font-black text-gov-blue uppercase tracking-[0.3em]">Synchronisation CAD...</p></div></div>`;
    }

    let mainContent = '';
    switch(panel) {
        case 'main':
            mainContent = `
                <div class="animate-in p-8 max-w-7xl mx-auto w-full space-y-12">
                    <div class="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-gray-100 pb-12">
                        <div>
                            <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-4">Portail Officiel de l'État</div>
                            <h1 class="text-6xl font-black text-gov-text uppercase italic tracking-tighter leading-none">Bienvenue,<br>${char.first_name} ${char.last_name}</h1>
                            <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-6 flex items-center gap-3">
                                <span class="w-12 h-0.5 bg-gov-blue"></span> Dossier National : #${char.id.substring(0,8).toUpperCase()}
                            </p>
                        </div>

                        <!-- ERLC SERVER STATUS WIDGET -->
                        <div class="bg-gov-light p-6 border border-gray-200 shadow-xl rounded-2xl min-w-[280px]">
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-[9px] font-black text-gov-blue uppercase tracking-widest">Signal Serveur ERLC</span>
                                <div class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span class="text-[10px] font-black uppercase text-emerald-600">En Ligne</span>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <div class="text-[8px] text-gray-500 font-black uppercase mb-1">Population</div>
                                    <div class="text-xl font-mono font-black text-gov-text">${erlc.currentPlayers}<span class="text-gray-400 text-xs">/${erlc.maxPlayers}</span></div>
                                </div>
                                <div>
                                    <div class="text-[8px] text-gray-500 font-black uppercase mb-1">File d'attente</div>
                                    <div class="text-xl font-mono font-black text-gov-text">${erlc.queue?.length || 0}</div>
                                </div>
                            </div>
                            <div class="mt-4 pt-4 border-t border-gray-200">
                                <div class="text-[8px] text-gray-500 font-black uppercase mb-1">Join Key</div>
                                <div class="text-xs font-mono font-black text-gov-blue select-all uppercase tracking-widest">${erlc.joinKey || 'INDISPONIBLE'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <button onclick="actions.setHubPanel('bank')" class="gov-card p-10 flex flex-col items-center text-center group bg-white shadow-xl">
                            <div class="w-16 h-16 bg-gov-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500">
                                <i data-lucide="landmark" class="w-8 h-8"></i>
                            </div>
                            <h4 class="text-xl font-black uppercase italic tracking-tight">Finances</h4>
                            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">Banque & Trésorerie</p>
                        </button>
                        <button onclick="actions.setHubPanel('assets')" class="gov-card p-10 flex flex-col items-center text-center group bg-white shadow-xl">
                            <div class="w-16 h-16 bg-gov-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500">
                                <i data-lucide="gem" class="w-8 h-8"></i>
                            </div>
                            <h4 class="text-xl font-black uppercase italic tracking-tight">Patrimoine</h4>
                            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">Inventaire & Papiers</p>
                        </button>
                        <button onclick="actions.setHubPanel('jobs')" class="gov-card p-10 flex flex-col items-center text-center group bg-white shadow-xl">
                            <div class="w-16 h-16 bg-gov-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500">
                                <i data-lucide="briefcase" class="w-8 h-8"></i>
                            </div>
                            <h4 class="text-xl font-black uppercase italic tracking-tight">Pôle Emploi</h4>
                            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">Marché du Travail</p>
                        </button>
                    </div>

                    <!-- ACTIVE HEISTS MONITOR (For heists that have started) -->
                    ${state.globalActiveHeists?.length > 0 ? `
                        <div class="space-y-6">
                             <h3 class="text-xs font-black text-gov-red uppercase tracking-[0.4em] flex items-center gap-4">
                                <span class="w-8 h-0.5 bg-gov-red"></span> Alertes Sécurité Publique
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                ${state.globalActiveHeists.map(h => `
                                    <div class="p-6 bg-white border-2 border-red-100 rounded-[28px] shadow-lg flex items-center gap-6 relative overflow-hidden animate-pulse">
                                        <div class="absolute top-0 right-0 p-3"><i data-lucide="alert-triangle" class="w-4 h-4 text-red-500"></i></div>
                                        <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100"><i data-lucide="siren" class="w-6 h-6"></i></div>
                                        <div>
                                            <div class="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Code 3 : Braquage</div>
                                            <div class="font-black text-gov-text uppercase italic truncate max-w-[150px]">${h.location || 'Localisation Inconnue'}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>`;
            break;
        case 'bank': mainContent = BankView(); break;
        case 'assets': mainContent = AssetsView(); break;
        case 'jobs': mainContent = JobCenterView(); break;
        case 'enterprise': mainContent = EnterpriseView(); break;
        case 'services': mainContent = ServicesView(); break;
        case 'illicit': mainContent = IllicitView(); break;
        case 'notifications': mainContent = NotificationsView(); break;
        case 'profile': mainContent = ProfileView(); break;
        case 'staff': mainContent = StaffView(); break;
    }

    return `
    <div class="flex flex-col h-screen bg-white overflow-hidden">
        
        <!-- UNIVERSAL NAVBAR -->
        <nav class="terminal-nav flex items-center justify-between shrink-0 border-b border-gray-100 bg-white sticky top-0 z-[100] px-8">
            <div class="flex items-center gap-12 h-full">
                <div onclick="actions.setHubPanel('main')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-transform hover:scale-[0.8]">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">État de Californie</div>
                    <div class="text-md leading-none">LOS ANGELES</div>
                </div>

                <!-- Main Menu -->
                <div class="hidden lg:flex items-center gap-1 h-full">
                    <button onclick="actions.setHubPanel('main')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${panel === 'main' ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-400 hover:text-gov-text'}">Tableau de bord</button>
                    
                    <div class="nav-item">
                        <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${['bank', 'enterprise'].includes(panel) ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">
                            Économie <i data-lucide="chevron-down" class="w-3 h-3"></i>
                        </button>
                        <div class="nav-dropdown">
                            <button onclick="actions.setHubPanel('bank')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors">
                                <i data-lucide="landmark" class="w-4 h-4 text-gov-blue"></i> Banque de l'État
                            </button>
                            <button onclick="actions.setHubPanel('enterprise')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors">
                                <i data-lucide="building-2" class="w-4 h-4 text-gov-blue"></i> Registre Commercial
                            </button>
                        </div>
                    </div>

                    <div class="nav-item">
                        <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${['services', 'jobs'].includes(panel) ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">
                            Services Publics <i data-lucide="chevron-down" class="w-3 h-3"></i>
                        </button>
                        <div class="nav-dropdown">
                            <button onclick="actions.setHubPanel('services')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors">
                                <i data-lucide="shield-check" class="w-4 h-4 text-gov-blue"></i> Services Civils (CAD)
                            </button>
                            <button onclick="actions.setHubPanel('jobs')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors">
                                <i data-lucide="briefcase" class="w-4 h-4 text-gov-blue"></i> Pôle Emploi California
                            </button>
                        </div>
                    </div>

                    <button onclick="actions.setHubPanel('assets')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${panel === 'assets' ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'}">Patrimoine</button>
                    
                    <div class="h-6 w-px bg-gray-100 mx-2"></div>
                    
                    ${isIllegal ? `
                        <button onclick="actions.setHubPanel('illicit')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all">Réseau Clandestin</button>
                    ` : ''}
                    
                    ${hasStaffAccess ? `
                        <button onclick="actions.setHubPanel('staff')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all">Panel Administration</button>
                    ` : ''}
                </div>
            </div>

            <!-- Profile & Notifications -->
            <div class="flex items-center gap-4 h-full">
                <button onclick="actions.setHubPanel('notifications')" class="p-2.5 text-gray-400 hover:text-gov-blue hover:bg-gov-light rounded-sm transition-all relative">
                    <i data-lucide="bell" class="w-5 h-5"></i>
                    ${state.notifications.length > 0 ? '<span class="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>' : ''}
                </button>
                
                <div class="nav-item">
                    <div class="flex items-center gap-4 cursor-pointer p-2.5 hover:bg-gov-light rounded-sm transition-all">
                        <div class="text-right hidden sm:block">
                            <div class="text-[10px] font-black uppercase text-gov-text leading-none">${char.first_name}</div>
                            <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">${char.job ? char.job.toUpperCase() : 'CIVIL'}</div>
                        </div>
                        <div class="relative w-10 h-10">
                            <img src="${u.avatar}" class="w-full h-full rounded-full grayscale border border-gray-200 p-0.5 relative z-10">
                            ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] max-w-none z-20 pointer-events-none">` : ''}
                            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-30"></div>
                        </div>
                    </div>
                    <div class="nav-dropdown right-0 left-auto">
                        <div class="px-4 py-3 border-b border-gray-50 bg-gov-light/30">
                            <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identité Discord</div>
                            <div class="text-[11px] font-black text-gov-text uppercase">${u.username}</div>
                        </div>
                        <button onclick="actions.setHubPanel('profile')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors">
                            <i data-lucide="user" class="w-4 h-4 text-gov-blue"></i> Mon Profil / Sanctions
                        </button>
                        <div class="h-px bg-gray-50 my-1"></div>
                        <button onclick="actions.backToSelect()" class="w-full text-left p-4 hover:bg-orange-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-orange-600 transition-colors">
                            <i data-lucide="users" class="w-4 h-4"></i> Changer de Dossier
                        </button>
                        <button onclick="actions.confirmLogout()" class="w-full text-left p-4 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-red-600 transition-colors">
                            <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- MAIN CONTENT SCROLL -->
        <main class="flex-1 overflow-y-auto bg-white custom-scrollbar">
            ${mainContent}
        </main>

    </div>
    `;
};