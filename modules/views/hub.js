
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
    const panel = state.activeHubPanel;
    const hasStaffAccess = Object.keys(state.user.permissions || {}).length > 0 || state.user.isFounder;

    if (state.isPanelLoading) {
        return `<div class="flex h-screen w-full bg-white items-center justify-center animate-in"><div class="text-center"><div class="w-12 h-12 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p class="text-[10px] font-black text-gov-blue uppercase tracking-[0.3em]">Liaison en cours...</p></div></div>`;
    }

    let mainContent = '';
    switch(panel) {
        case 'main':
            mainContent = `
                <div class="animate-in p-8 max-w-7xl mx-auto w-full space-y-12">
                    <div class="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-gray-100 pb-12">
                        <div>
                            <h1 class="text-5xl font-black text-gov-text uppercase italic tracking-tighter">Bienvenue, ${char.first_name} ${char.last_name}</h1>
                            <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-4 flex items-center gap-2">
                                <span class="w-8 h-0.5 bg-gov-blue"></span> Dossier Citoyen : #${char.id.substring(0,8).toUpperCase()}
                            </p>
                        </div>
                        <div class="bg-gov-light p-6 border border-gray-200 rounded-sm">
                            <div class="text-[9px] font-black text-gov-blue uppercase tracking-widest mb-1">Signal Système</div>
                            <div class="text-sm font-bold text-gray-900 uppercase">Liaison Sécurisée OK</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <button onclick="actions.setHubPanel('bank')" class="gov-card p-10 flex flex-col items-center text-center group">
                            <i data-lucide="landmark" class="w-12 h-12 text-gov-blue mb-8 group-hover:scale-110 transition-transform"></i>
                            <h4 class="text-xl font-black uppercase italic">Services Bancaires</h4>
                            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">Trésorerie & Virements</p>
                        </button>
                        <button onclick="actions.setHubPanel('assets')" class="gov-card p-10 flex flex-col items-center text-center group">
                            <i data-lucide="gem" class="w-12 h-12 text-gov-blue mb-8 group-hover:scale-110 transition-transform"></i>
                            <h4 class="text-xl font-black uppercase italic">Patrimoine</h4>
                            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">Titres & Inventaire</p>
                        </button>
                        <button onclick="actions.setHubPanel('jobs')" class="gov-card p-10 flex flex-col items-center text-center group">
                            <i data-lucide="briefcase" class="w-12 h-12 text-gov-blue mb-8 group-hover:scale-110 transition-transform"></i>
                            <h4 class="text-xl font-black uppercase italic">Pôle Emploi</h4>
                            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">Marché du Travail</p>
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
    <div class="flex flex-col h-screen bg-white">
        
        <!-- TOP NAVBAR TERMINAL -->
        <nav class="terminal-nav flex items-center justify-between shrink-0">
            <div class="flex items-center gap-12 h-full">
                <div onclick="actions.setHubPanel('main')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">Roleplay</div>
                    <div class="text-md leading-none">RÉPUBLIQUE</div>
                </div>

                <!-- Menu Horizontale avec Dropdowns -->
                <div class="hidden lg:flex items-center gap-1 h-full">
                    <button onclick="actions.setHubPanel('main')" class="px-5 py-2 text-[10px] font-black uppercase tracking-widest ${panel === 'main' ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-400 hover:text-gov-text'}">Accueil</button>
                    
                    <div class="nav-item">
                        <button class="px-5 py-2 text-[10px] font-black uppercase tracking-widest ${['bank', 'enterprise'].includes(panel) ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">
                            Économie <i data-lucide="chevron-down" class="w-3 h-3"></i>
                        </button>
                        <div class="nav-dropdown">
                            <button onclick="actions.setHubPanel('bank')" class="w-full text-left p-3 hover:bg-gov-light text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                                <i data-lucide="landmark" class="w-4 h-4"></i> Banque Centrale
                            </button>
                            <button onclick="actions.setHubPanel('enterprise')" class="w-full text-left p-3 hover:bg-gov-light text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                                <i data-lucide="building-2" class="w-4 h-4"></i> Registre Commerce
                            </button>
                        </div>
                    </div>

                    <div class="nav-item">
                        <button class="px-5 py-2 text-[10px] font-black uppercase tracking-widest ${['services', 'jobs'].includes(panel) ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">
                            Public <i data-lucide="chevron-down" class="w-3 h-3"></i>
                        </button>
                        <div class="nav-dropdown">
                            <button onclick="actions.setHubPanel('services')" class="w-full text-left p-3 hover:bg-gov-light text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                                <i data-lucide="shield-check" class="w-4 h-4"></i> Services de l'État (CAD)
                            </button>
                            <button onclick="actions.setHubPanel('jobs')" class="w-full text-left p-3 hover:bg-gov-light text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                                <i data-lucide="briefcase" class="w-4 h-4"></i> Pôle Emploi
                            </button>
                        </div>
                    </div>

                    <button onclick="actions.setHubPanel('assets')" class="px-5 py-2 text-[10px] font-black uppercase tracking-widest ${panel === 'assets' ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'}">Patrimoine</button>
                    <button onclick="actions.setHubPanel('illicit')" class="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50">Réseau Clandestin</button>
                    
                    ${hasStaffAccess ? `
                        <button onclick="actions.setStaffTab('citizens')" class="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 hover:bg-purple-50">Administration</button>
                    ` : ''}
                </div>
            </div>

            <!-- Profile & Right Menu -->
            <div class="flex items-center gap-4 h-full">
                <div class="nav-item">
                    <div class="flex items-center gap-4 cursor-pointer p-2 hover:bg-gov-light rounded-sm">
                        <div class="text-right hidden sm:block">
                            <div class="text-[9px] font-black uppercase text-gov-text leading-none">${char.first_name}</div>
                            <div class="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-1">${char.job || 'Civil'}</div>
                        </div>
                        <img src="${u.avatar}" class="w-9 h-9 rounded-full grayscale border border-gray-200">
                    </div>
                    <div class="nav-dropdown right-0 left-auto">
                        <button onclick="actions.setHubPanel('profile')" class="w-full text-left p-3 hover:bg-gov-light text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                            <i data-lucide="user" class="w-4 h-4"></i> Mon Profil Discord
                        </button>
                        <button onclick="actions.setHubPanel('notifications')" class="w-full text-left p-3 hover:bg-gov-light text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                            <i data-lucide="bell" class="w-4 h-4"></i> Notifications
                        </button>
                        <div class="h-px bg-gray-100 my-2 mx-3"></div>
                        <button onclick="actions.backToSelect()" class="w-full text-left p-3 hover:bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                            <i data-lucide="users" class="w-4 h-4"></i> Changer de Dossier
                        </button>
                        <button onclick="actions.confirmLogout()" class="w-full text-left p-3 hover:bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                            <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- MAIN CONTENT -->
        <main class="flex-1 overflow-y-auto bg-white custom-scrollbar">
            ${mainContent}
        </main>

    </div>
    `;
};
