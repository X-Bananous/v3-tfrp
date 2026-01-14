
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
    const isFounder = state.user?.isFounder || state.adminIds.includes(state.user?.id);
    const hasStaffAccess = Object.keys(state.user.permissions || {}).some(k => state.user.permissions[k] === true) || isFounder;
    const isIllegal = char.alignment === 'illegal';
    
    // Restriction CAD System
    const allowedCADJobs = ['leo', 'lafd', 'ladot', 'lawyer', 'maire', 'adjoint', 'juge', 'procureur'];
    const hasCADAccess = !isIllegal && allowedCADJobs.includes(char.job);

    const erlc = state.erlcData || { currentPlayers: 0, maxPlayers: 42, queue: [], joinKey: '?????' };
    const heists = state.globalActiveHeists || [];
    const isMobileMenuOpen = state.ui.mobileMenuOpen;

    if (state.isPanelLoading) {
        return `
        <div class="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center animate-in">
            <div class="marianne-block uppercase font-black tracking-tight text-gov-text scale-110 mb-12">
                <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 uppercase">Liberté • Égalité • Justice</div>
                <div class="text-lg leading-none uppercase">ÉTAT DE CALIFORNIE<br>LOS ANGELES</div>
            </div>
            <div class="flex flex-col items-center gap-4">
                <div class="w-64 h-1 bg-gov-light rounded-full overflow-hidden relative border border-gray-100">
                    <div class="h-full bg-gov-blue animate-loading-bar absolute left-0 top-0 shadow-[0_0_10px_rgba(0,0,145,0.4)]"></div>
                </div>
                <p class="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-2">Initialisation de l'interface...</p>
            </div>
        </div>`;
    }

    const navSubItemMobile = (label, icon, action, isActive) => `
        <button onclick="${action}" class="w-full text-left py-3 px-4 rounded-2xl flex items-center gap-3 transition-all ${isActive ? 'bg-gov-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}">
            <i data-lucide="${icon}" class="w-4 h-4"></i>
            <span class="text-[11px] font-black uppercase tracking-wider">${label}</span>
        </button>
    `;

    // --- MOBILE MENU OVERLAY ---
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
            <div class="flex-1 overflow-y-auto p-6 space-y-8">
                <!-- ACCUEIL -->
                <div>
                    <button onclick="actions.setHubPanel('main')" class="w-full text-left py-3 px-4 rounded-2xl font-black uppercase text-xs tracking-widest ${panel === 'main' ? 'bg-gov-blue text-white' : 'text-gray-400'}">
                        Tableau de bord
                    </button>
                </div>

                <!-- ECONOMIE -->
                <div class="space-y-2">
                    <div class="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-4 mb-2">Finance & Marché</div>
                    ${navSubItemMobile('Banque', 'landmark', "actions.setHubPanel('bank'); actions.setBankTab('overview')", panel === 'bank' && state.activeBankTab === 'overview')}
                    ${navSubItemMobile('Épargne', 'piggy-bank', "actions.setHubPanel('bank'); actions.setBankTab('savings')", panel === 'bank' && state.activeBankTab === 'savings')}
                    ${navSubItemMobile('Virements', 'send', "actions.setHubPanel('bank'); actions.setBankTab('operations')", panel === 'bank' && state.activeBankTab === 'operations')}
                    ${navSubItemMobile('Boutiques', 'shopping-bag', "actions.setHubPanel('enterprise')", panel === 'enterprise')}
                </div>

                <!-- SERVICES PUBLICS (Conditionnel) -->
                <div class="space-y-2">
                    <div class="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-4 mb-2">Services & Emploi</div>
                    ${hasCADAccess ? navSubItemMobile('Central CAD', 'shield-check', "actions.setHubPanel('services')", panel === 'services') : ''}
                    ${navSubItemMobile('Pôle Emploi', 'briefcase', "actions.setHubPanel('jobs')", panel === 'jobs')}
                </div>

                <!-- PERSONNEL -->
                <div class="space-y-2">
                    <div class="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-4 mb-2">Citoyenneté</div>
                    ${navSubItemMobile('Patrimoine', 'gem', "actions.setHubPanel('assets'); actions.setAssetsTab('overview')", panel === 'assets' && state.activeAssetsTab === 'overview')}
                    ${navSubItemMobile('Inventaire', 'backpack', "actions.setHubPanel('assets'); actions.setAssetsTab('inventory')", panel === 'assets' && state.activeAssetsTab === 'inventory')}
                    ${navSubItemMobile('Mes Factures', 'file-text', "actions.setHubPanel('assets'); actions.setAssetsTab('invoices')", panel === 'assets' && state.activeAssetsTab === 'invoices')}
                </div>

                ${isIllegal ? `
                <div class="space-y-2">
                    <div class="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] ml-4 mb-2">Fréquences Cryptées</div>
                    ${navSubItemMobile('Dashboard Clandestin', 'skull', "actions.setHubPanel('illicit')", panel === 'illicit')}
                </div>
                ` : ''}

                ${hasStaffAccess ? `
                <div class="space-y-2">
                    <div class="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] ml-4 mb-2">Administration</div>
                    ${navSubItemMobile('Panel Staff', 'shield', "actions.setHubPanel('staff')", panel === 'staff')}
                </div>
                ` : ''}

                <div class="mt-auto pt-10 flex flex-col gap-3">
                    <button onclick="actions.setHubPanel('profile')" class="w-full py-4 bg-gov-light text-gov-text font-black uppercase text-[10px] tracking-widest text-center rounded-2xl">Paramètres du profil</button>
                    <button onclick="actions.confirmLogout()" class="w-full py-4 bg-red-50 text-red-600 font-black uppercase text-[10px] tracking-widest text-center rounded-2xl">Déconnexion</button>
                </div>
            </div>
        </div>
    `;

    let mainContent = '';
    switch(panel) {
        case 'main':
            mainContent = `
                <div class="animate-in p-8 max-w-7xl mx-auto w-full space-y-12 pb-24">
                    <div class="flex flex-col justify-start gap-4 border-b border-gray-100 pb-12">
                        <div>
                            <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-4">Portail Officiel de l'État</div>
                            <h1 class="text-4xl md:text-6xl font-black text-gov-text uppercase italic tracking-tighter leading-none">Bienvenue,<br>${char.first_name} ${char.last_name}</h1>
                            <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-6 flex items-center gap-3">
                                <span class="w-12 h-0.5 bg-gov-blue"></span> Dossier National : #${char.id.substring(0,8).toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="bg-gov-light p-8 border border-gray-200 shadow-xl rounded-none relative overflow-hidden flex flex-col justify-between group">
                            <div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                <i data-lucide="server" class="w-24 h-24 text-black"></i>
                            </div>
                            <div class="flex justify-between items-center mb-6 relative z-10">
                                <span class="text-[10px] font-black text-gov-blue uppercase tracking-[0.3em]">Signal Temps Réel</span>
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span class="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Opérationnel</span>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-8 relative z-10">
                                <div>
                                    <div class="text-[9px] text-gray-500 font-black uppercase mb-1 tracking-widest">Population</div>
                                    <div class="text-4xl font-mono font-black text-gov-text tracking-tighter">${erlc.currentPlayers}<span class="text-gray-300 text-xl">/${erlc.maxPlayers}</span></div>
                                </div>
                                <div>
                                    <div class="text-[9px] text-gray-500 font-black uppercase mb-1 tracking-widest">File Douanière</div>
                                    <div class="text-4xl font-mono font-black text-gov-text tracking-tighter">${erlc.queue?.length || 0}</div>
                                </div>
                            </div>
                            <div class="mt-8 pt-6 border-t border-gray-200 relative z-10">
                                <div class="text-[9px] text-gray-500 font-black uppercase mb-2 tracking-widest">Clef de raccordement universelle</div>
                                <div class="text-sm font-mono font-black text-gov-blue select-all uppercase tracking-[0.2em] bg-white p-3 border border-gray-100 text-center">${erlc.joinKey || 'INDISPONIBLE'}</div>
                            </div>
                        </div>

                        <div class="bg-gov-text text-white p-8 rounded-none shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                            <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-none blur-2xl group-hover:bg-white/10 transition-all"></div>
                            <div class="relative z-10">
                                <div class="flex items-center justify-between mb-6">
                                    <div class="flex items-center gap-3">
                                        <div class="px-2 py-0.5 bg-gov-red text-white text-[8px] font-black uppercase tracking-widest animate-pulse">FLASH INFO</div>
                                        <span class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Dépêches L.A.</span>
                                    </div>
                                    <i data-lucide="megaphone" class="w-5 h-5 text-gray-500"></i>
                                </div>
                                <div class="space-y-4 max-h-[160px] overflow-y-auto custom-scrollbar pr-4">
                                    ${heists.length > 0 ? heists.map(h => `
                                        <div class="flex gap-4 items-start border-l-2 border-gov-red pl-4 py-1">
                                            <div>
                                                <div class="text-[10px] font-black uppercase text-gov-red tracking-tight italic">ALERTE CODE 3</div>
                                                <div class="text-sm font-bold leading-tight uppercase text-gray-200">${h.location || 'Localisation Inconnue'}</div>
                                            </div>
                                        </div>
                                    `).join('') : `
                                        <div class="text-center py-8">
                                            <div class="text-[10px] text-gray-500 uppercase font-black tracking-[0.4em] italic">Aucun incident critique signalé à Los Angeles.</div>
                                        </div>
                                    `}
                                </div>
                            </div>
                            <button onclick="actions.setHubPanel('notifications')" class="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all text-left relative z-10 flex items-center gap-3 border-t border-white/10 pt-4">
                                Consulter le journal complet <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
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

    // Helper pour les menus volants (desktop)
    const navFlyoutItem = (label, icon, onClickAction, subItems) => `
        <div class="nav-sub-item">
            <button onclick="${onClickAction}" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-colors text-gov-text">
                <div class="flex items-center gap-4">
                    <i data-lucide="${icon}" class="w-4 h-4 text-gov-blue"></i> ${label}
                </div>
                <i data-lucide="chevron-right" class="w-3 h-3 text-gray-400"></i>
            </button>
            <div class="nav-sub-dropdown">
                ${subItems.map(item => `
                    <button onclick="${item.action}" class="w-full text-left p-3 hover:bg-gov-light text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors text-gray-600 hover:text-gov-blue">
                        <i data-lucide="${item.icon}" class="w-3.5 h-3.5"></i> ${item.label}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    return `
    <div class="flex flex-col h-screen bg-white overflow-hidden">
        ${isMobileMenuOpen ? MobileMenuOverlay() : ''}

        <nav class="terminal-nav shrink-0">
            <div class="flex items-center gap-6 md:gap-12 h-full">
                <div onclick="actions.setHubPanel('main')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-transform hover:scale-[0.8]">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">État de Californie</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>

                <!-- Desktop Menu -->
                <div class="hidden lg:flex items-center gap-1 h-full">
                    <button onclick="actions.setHubPanel('main')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${panel === 'main' ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-400 hover:text-gov-text'}">Tableau de bord</button>
                    
                    <div class="nav-item">
                        <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${['bank', 'enterprise'].includes(panel) ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">
                            Économie <i data-lucide="chevron-down" class="w-3 h-3"></i>
                        </button>
                        <div class="nav-dropdown rounded-none">
                            ${navFlyoutItem('Banque Nationale', 'landmark', "actions.setHubPanel('bank'); actions.setBankTab('overview');", [
                                { label: 'Comptes Courants', icon: 'layout-grid', action: "actions.setHubPanel('bank'); actions.setBankTab('overview');" },
                                { label: 'Livret d\'Épargne', icon: 'piggy-bank', action: "actions.setHubPanel('bank'); actions.setBankTab('savings');" },
                                { label: 'Opérations', icon: 'send', action: "actions.setHubPanel('bank'); actions.setBankTab('operations');" },
                                { label: 'Historique Flux', icon: 'scroll-text', action: "actions.setHubPanel('bank'); actions.setBankTab('history');" }
                            ])}
                            <button onclick="actions.setHubPanel('enterprise')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors text-gov-text">
                                <i data-lucide="shopping-bag" class="w-4 h-4 text-gov-blue"></i> Boutiques & Commerces
                            </button>
                        </div>
                    </div>

                    <div class="nav-item">
                        <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${['services', 'jobs'].includes(panel) ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">
                            Services Publics <i data-lucide="chevron-down" class="w-3 h-3"></i>
                        </button>
                        <div class="nav-dropdown rounded-none">
                            ${hasCADAccess ? navFlyoutItem('Terminal CAD', 'shield-check', "actions.setHubPanel('services');", [
                                { label: 'Dispatch', icon: 'radio', action: "actions.setHubPanel('services'); actions.setServicesTab('dispatch');" },
                                { label: 'Annuaire Citoyen', icon: 'users', action: "actions.setHubPanel('services'); actions.setServicesTab('directory');" }
                            ]) : ''}
                            <button onclick="actions.setHubPanel('jobs')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors text-gov-text">
                                <i data-lucide="briefcase" class="w-4 h-4 text-gov-blue"></i> Pôle Emploi
                            </button>
                        </div>
                    </div>

                    <div class="nav-item">
                        <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${panel === 'assets' ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">
                            Patrimoine <i data-lucide="chevron-down" class="w-3 h-3"></i>
                        </button>
                        <div class="nav-dropdown rounded-none">
                            <button onclick="actions.setHubPanel('assets'); actions.setAssetsTab('overview');" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-gov-text">
                                <i data-lucide="pie-chart" class="w-4 h-4 text-gov-blue"></i> Vue d'ensemble
                            </button>
                            <button onclick="actions.setHubPanel('assets'); actions.setAssetsTab('inventory');" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-gov-text">
                                <i data-lucide="backpack" class="w-4 h-4 text-gov-blue"></i> Inventaire Sac
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2 md:gap-4 h-full">
                <button onclick="actions.setHubPanel('notifications')" class="p-2.5 text-gray-400 hover:text-gov-blue hover:bg-gov-light rounded-sm transition-all relative">
                    <i data-lucide="bell" class="w-5 h-5"></i>
                    ${state.notifications.length > 0 ? '<span class="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>' : ''}
                </button>
                <button onclick="actions.toggleMobileMenu()" class="lg:hidden p-2.5 bg-gov-light text-gov-text rounded-sm transition-transform active:scale-95">
                    <i data-lucide="menu" class="w-5 h-5"></i>
                </button>
                
                <div class="nav-item hidden lg:flex h-full">
                    <div class="flex items-center gap-4 cursor-pointer p-2.5 hover:bg-gov-light rounded-sm transition-all h-full">
                        <div class="avatar-container w-10 h-10 shrink-0">
                            <img src="${u.avatar}" class="avatar-img grayscale border border-gray-200 p-0.5 relative z-10 object-cover">
                            ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-30"></div>
                        </div>
                    </div>
                    <div class="nav-dropdown right-0 left-auto rounded-none shadow-2xl">
                        <button onclick="actions.setHubPanel('profile')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors">
                            <i data-lucide="user" class="w-4 h-4 text-gov-blue"></i> Mon Profil
                        </button>
                        <button onclick="actions.confirmLogout()" class="w-full text-left p-4 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-red-600 transition-colors">
                            <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
                        </button>
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
