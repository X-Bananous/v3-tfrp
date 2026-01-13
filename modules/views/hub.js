
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
import { hasPermission } from '../utils.js';

export const HubView = () => {
    const u = state.user;
    const char = state.activeCharacter;
    const panel = state.activeHubPanel;
    const hasStaffAccess = Object.keys(u.permissions || {}).length > 0 || u.isFounder;

    if (state.isPanelLoading) {
        return `<div class="flex h-screen w-full bg-white items-center justify-center"><div class="text-center"><div class="w-16 h-16 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto mb-6"></div><p class="text-[11px] font-black text-gov-blue uppercase tracking-[0.5em] italic">Connexion Sécurisée...</p></div></div>`;
    }

    let mainContent = '';
    switch(panel) {
        case 'main':
            mainContent = `
                <div class="animate-in p-12 max-w-7xl mx-auto w-full space-y-16 pb-24">
                    <div class="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-gray-100 pb-16">
                        <div>
                            <h1 class="text-6xl font-black text-gov-text uppercase italic tracking-tighter leading-none">Bienvenue,<br><span class="text-gov-blue">${char.first_name} ${char.last_name}</span></h1>
                            <p class="text-gray-400 font-bold uppercase text-[10px] tracking-[0.5em] mt-6 flex items-center gap-6">
                                <span class="w-12 h-0.5 bg-gov-blue"></span> DOSSIER FÉDÉRAL : #${char.id.substring(0,8).toUpperCase()}
                            </p>
                        </div>
                        <div class="bg-gov-light p-8 border border-gray-200 rounded-sm shadow-sm min-w-[240px]">
                            <div class="text-[10px] font-black text-gov-blue uppercase tracking-widest mb-2 italic">Statut Connexion</div>
                            <div class="text-xs font-black text-gray-900 uppercase flex items-center gap-3"><span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Terminal Chiffré / OK</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <button onclick="actions.setHubPanel('bank')" class="gov-card p-16 flex flex-col items-center text-center group">
                            <i data-lucide="landmark" class="w-16 h-16 text-gov-blue mb-10 group-hover:scale-110 transition-transform"></i>
                            <h4 class="text-2xl font-black uppercase italic tracking-tight">Trésorerie</h4>
                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-3">Comptes & Flux de Capital</p>
                        </button>
                        <button onclick="actions.setHubPanel('assets')" class="gov-card p-16 flex flex-col items-center text-center group">
                            <i data-lucide="gem" class="w-16 h-16 text-gov-blue mb-10 group-hover:scale-110 transition-transform"></i>
                            <h4 class="text-2xl font-black uppercase italic tracking-tight">Propriété</h4>
                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-3">Actifs & Titres Officiels</p>
                        </button>
                        <button onclick="actions.setHubPanel('jobs')" class="gov-card p-16 flex flex-col items-center text-center group">
                            <i data-lucide="briefcase" class="w-16 h-16 text-gov-blue mb-10 group-hover:scale-110 transition-transform"></i>
                            <h4 class="text-2xl font-black uppercase italic tracking-tight">Carrière</h4>
                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-3">Marché de l'Emploi</p>
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
        
        <!-- NAVBAR OMNIPRÉSENTE HUB -->
        <nav class="global-nav shrink-0 bg-white">
            <div class="flex items-center gap-12 h-full">
                <div onclick="actions.setHubPanel('main')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red italic">California</div>
                    <div class="text-md leading-none italic">LOS ANGELES</div>
                </div>

                <div class="hidden lg:flex items-center h-full">
                    <button onclick="actions.setHubPanel('main')" class="px-6 h-full text-[10px] font-black uppercase tracking-widest ${panel === 'main' ? 'text-gov-blue border-b-4 border-gov-blue' : 'text-gray-400 hover:text-gov-text'}">Terminal</button>
                    
                    <div class="nav-item h-full">
                        <button class="px-6 h-full text-[10px] font-black uppercase tracking-widest ${['bank', 'enterprise'].includes(panel) ? 'text-gov-blue border-b-4 border-gov-blue' : 'text-gray-400'} flex items-center gap-3">Économie <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i></button>
                        <div class="nav-dropdown">
                            <button onclick="actions.setHubPanel('bank')" class="w-full text-left p-5 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4"><i data-lucide="landmark" class="w-4 h-4"></i> Banque Centrale</button>
                            <button onclick="actions.setHubPanel('enterprise')" class="w-full text-left p-5 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4"><i data-lucide="building-2" class="w-4 h-4"></i> Registre Commerce</button>
                        </div>
                    </div>

                    <div class="nav-item h-full">
                        <button class="px-6 h-full text-[10px] font-black uppercase tracking-widest ${['services', 'jobs'].includes(panel) ? 'text-gov-blue border-b-4 border-gov-blue' : 'text-gray-400'} flex items-center gap-3">Public <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i></button>
                        <div class="nav-dropdown">
                            <button onclick="actions.setHubPanel('services')" class="w-full text-left p-5 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4"><i data-lucide="shield-check" class="w-4 h-4"></i> Services Publics</button>
                            <button onclick="actions.setHubPanel('jobs')" class="w-full text-left p-5 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4"><i data-lucide="briefcase" class="w-4 h-4"></i> Bureau de l'Emploi</button>
                        </div>
                    </div>

                    <button onclick="actions.setHubPanel('illicit')" class="px-6 h-full text-[10px] font-black uppercase tracking-widest ${panel === 'illicit' ? 'text-red-600 border-b-4 border-red-600' : 'text-gray-400 hover:text-red-500'}">Clandestinité</button>
                    
                    ${hasStaffAccess ? `
                        <button onclick="actions.setHubPanel('staff')" class="px-8 h-full text-[10px] font-black uppercase tracking-widest text-purple-600 hover:bg-purple-50 ml-4 rounded-sm border-l border-gray-100">Console Administration</button>
                    ` : ''}
                </div>
            </div>

            <div class="flex items-center gap-6 h-full">
                <div class="nav-item h-full">
                    <div class="flex items-center gap-5 cursor-pointer p-3 hover:bg-gov-light rounded-sm transition-all">
                        <div class="text-right hidden sm:block">
                            <div class="text-[10px] font-black uppercase text-gov-text leading-none mb-1">${char.first_name}</div>
                            <div class="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] italic">${char.job || 'Civil'}</div>
                        </div>
                        <img src="${u.avatar}" class="w-10 h-10 rounded-full grayscale border border-gray-200 shadow-sm hover:grayscale-0 transition-all">
                    </div>
                    <div class="nav-dropdown">
                        <button onclick="router('profile_hub')" class="w-full text-left p-5 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-gov-blue"><i data-lucide="user" class="w-4 h-4"></i> Portail Citoyen</button>
                        <button onclick="actions.setHubPanel('notifications')" class="w-full text-left p-5 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4"><i data-lucide="bell" class="w-4 h-4"></i> Alertes Système</button>
                        <div class="h-px bg-gray-100 my-2 mx-4"></div>
                        <button onclick="actions.backToSelect()" class="w-full text-left p-5 hover:bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4"><i data-lucide="users" class="w-4 h-4"></i> Changer d'Identité</button>
                        <button onclick="actions.confirmLogout()" class="w-full text-left p-5 hover:bg-red-50 text-gov-red text-[10px] font-black uppercase tracking-widest flex items-center gap-4"><i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion</button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="flex-1 overflow-y-auto bg-white custom-scrollbar">
            ${mainContent}
        </main>

    </div>
    `;
};
