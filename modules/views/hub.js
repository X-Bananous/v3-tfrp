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
                        <div class="bg-gov-light p-8 border border-gray-200 shadow-xl rounded-sm">
                            <div class="text-[9px] font-black text-gov-blue uppercase tracking-[0.4em] mb-3">État des Liaisons</div>
                            <div class="flex items-center gap-3">
                                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <div class="text-sm font-black text-gray-900 uppercase italic">Signal Crypte OK</div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <button onclick="actions.setHubPanel('bank')" class="gov-card p-12 flex flex-col items-center text-center group bg-white shadow-xl">
                            <div class="w-20 h-20 bg-gov-light rounded-full flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500">
                                <i data-lucide="landmark" class="w-10 h-10 transition-transform group-hover:scale-110"></i>
                            </div>
                            <h4 class="text-2xl font-black uppercase italic tracking-tight">Système Bancaire</h4>
                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">Gestion des Actifs et Flux</p>
                        </button>
                        <button onclick="actions.setHubPanel('assets')" class="gov-card p-12 flex flex-col items-center text-center group bg-white shadow-xl">
                            <div class="w-20 h-20 bg-gov-light rounded-full flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500">
                                <i data-lucide="gem" class="w-10 h-10 transition-transform group-hover:scale-110"></i>
                            </div>
                            <h4 class="text-2xl font-black uppercase italic tracking-tight">Patrimoine Civil</h4>
                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">Inventaire et Documents</p>
                        </button>
                        <button onclick="actions.setHubPanel('jobs')" class="gov-card p-12 flex flex-col items-center text-center group bg-white shadow-xl">
                            <div class="w-20 h-20 bg-gov-light rounded-full flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500">
                                <i data-lucide="briefcase" class="w-10 h-10 transition-transform group-hover:scale-110"></i>
                            </div>
                            <h4 class="text-2xl font-black uppercase italic tracking-tight">Marché du Travail</h4>
                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">Opportunités Professionnelles</p>
                        </button>
                    </div>
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
                    
                    <!-- SPECIAL PANELS -->
                    <div class="h-6 w-px bg-gray-100 mx-2"></div>
                    
                    <button onclick="actions.setHubPanel('illicit')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all">Réseau Clandestin</button>
                    
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
                        <div class="relative">
                            <img src="${u.avatar}" class="w-10 h-10 rounded-full grayscale border border-gray-200 p-0.5">
                            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
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