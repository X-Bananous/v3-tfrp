
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
    const erlc = state.erlcData || { currentPlayers: 0, maxPlayers: 42, queue: [], joinKey: '?????' };
    const heists = state.globalActiveHeists || [];
    const isMobileMenuOpen = state.ui.mobileMenuOpen;

    if (state.isPanelLoading) {
        return `<div class="flex h-screen w-full bg-white items-center justify-center animate-in"><div class="text-center"><div class="w-12 h-12 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p class="text-[10px] font-black text-gov-blue uppercase tracking-[0.3em]">Synchronisation CAD...</p></div></div>`;
    }

    // --- FULLSCREEN MOBILE MENU ---
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
            <div class="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                <button onclick="actions.setHubPanel('main')" class="w-full text-left py-4 border-b border-gray-100 font-black uppercase text-xs tracking-widest ${panel === 'main' ? 'text-gov-blue' : 'text-gray-400'}">Tableau de bord</button>
                <button onclick="actions.setHubPanel('bank')" class="w-full text-left py-4 border-b border-gray-100 font-black uppercase text-xs tracking-widest ${panel === 'bank' ? 'text-gov-blue' : 'text-gray-400'}">Banque</button>
                <button onclick="actions.setHubPanel('enterprise')" class="w-full text-left py-4 border-b border-gray-100 font-black uppercase text-xs tracking-widest ${panel === 'enterprise' ? 'text-gov-blue' : 'text-gray-400'}">Entreprises</button>
                <button onclick="actions.setHubPanel('services')" class="w-full text-left py-4 border-b border-gray-100 font-black uppercase text-xs tracking-widest ${panel === 'services' ? 'text-gov-blue' : 'text-gray-400'}">Services Publics</button>
                <button onclick="actions.setHubPanel('jobs')" class="w-full text-left py-4 border-b border-gray-100 font-black uppercase text-xs tracking-widest ${panel === 'jobs' ? 'text-gov-blue' : 'text-gray-400'}">Pôle Emploi</button>
                <button onclick="actions.setHubPanel('assets')" class="w-full text-left py-4 border-b border-gray-100 font-black uppercase text-xs tracking-widest ${panel === 'assets' ? 'text-gov-blue' : 'text-gray-400'}">Patrimoine</button>
                
                ${isIllegal ? `
                    <button onclick="actions.setHubPanel('illicit')" class="w-full text-left py-4 border-b border-red-100 font-black uppercase text-xs tracking-widest text-red-600">Réseau Clandestin</button>
                ` : ''}
                
                ${hasStaffAccess ? `
                    <button onclick="actions.setHubPanel('staff')" class="w-full text-left py-4 border-b border-purple-100 font-black uppercase text-xs tracking-widest text-purple-600">Administration</button>
                ` : ''}

                <div class="mt-auto pt-10 flex flex-col gap-4">
                    <button onclick="actions.setHubPanel('profile')" class="w-full py-4 bg-gov-light text-gov-text font-black uppercase text-[10px] tracking-widest text-center">Mon Profil</button>
                    <button onclick="actions.confirmLogout()" class="w-full py-4 bg-red-50 text-red-600 font-black uppercase text-[10px] tracking-widest text-center">Déconnexion</button>
                </div>
            </div>
        </div>
    `;

    let mainContent = '';
    switch(panel) {
        case 'main':
            mainContent = `
                <div class="animate-in p-8 max-w-7xl mx-auto w-full space-y-12 pb-24">
                    
                    <!-- Header Welcome Section -->
                    <div class="flex flex-col justify-start gap-4 border-b border-gray-100 pb-12">
                        <div>
                            <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-4">Portail Officiel de l'État</div>
                            <h1 class="text-4xl md:text-6xl font-black text-gov-text uppercase italic tracking-tighter leading-none">Bienvenue,<br>${char.first_name} ${char.last_name}</h1>
                            <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-6 flex items-center gap-3">
                                <span class="w-12 h-0.5 bg-gov-blue"></span> Dossier National : #${char.id.substring(0,8).toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <!-- PRIORITY ROW: SERVER INFO & NEWS (SIDE-BY-SIDE ON PC) -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <!-- ERLC SERVER STATUS WIDGET -->
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

                        <!-- LIVE NEWS CARD -->
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

                    <!-- GRID DES BULLES (Quick Access) -->
                    <div class="space-y-6">
                        <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4 px-2">
                             <span class="w-8 h-px bg-gray-200"></span> TERMINAUX ACCRÉDITÉS
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            
                            <button onclick="actions.setHubPanel('bank')" class="gov-card p-8 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                <div class="w-16 h-16 bg-gov-light rounded-none flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                    <i data-lucide="landmark" class="w-8 h-8"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Banque</h4>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Trésorerie & Flux</p>
                            </button>

                            <button onclick="actions.setHubPanel('assets')" class="gov-card p-8 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                <div class="w-16 h-16 bg-gov-light rounded-none flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                    <i data-lucide="gem" class="w-8 h-8"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Patrimoine</h4>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Biens & Documents</p>
                            </button>

                            <button onclick="actions.setHubPanel('jobs')" class="gov-card p-8 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                <div class="w-16 h-16 bg-gov-light rounded-none flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                    <i data-lucide="briefcase" class="w-8 h-8"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Emploi</h4>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Marché du Travail</p>
                            </button>

                            <button onclick="actions.setHubPanel('enterprise')" class="gov-card p-8 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-gray-100 hover:border-gov-blue/30 transition-all duration-500">
                                <div class="w-16 h-16 bg-gov-light rounded-none flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                    <i data-lucide="building-2" class="w-8 h-8"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Corporations</h4>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Registre Commercial</p>
                            </button>

                            ${['leo', 'lafd', 'ladot', 'lawyer', 'maire', 'adjoint', 'juge', 'procureur'].includes(char.job) ? `
                                <button onclick="actions.setHubPanel('services')" class="gov-card p-8 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-blue-100 hover:border-blue-500 transition-all duration-500">
                                    <div class="w-16 h-16 bg-blue-50 text-gov-blue rounded-none flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all duration-500 shadow-inner">
                                        <i data-lucide="shield-check" class="w-8 h-8"></i>
                                    </div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Service Public</h4>
                                    <p class="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-2">Terminal CAD-OS</p>
                                </button>
                            ` : ''}

                            ${isIllegal ? `
                                <button onclick="actions.setHubPanel('illicit')" class="gov-card p-8 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-red-100 hover:border-gov-red transition-all duration-500">
                                    <div class="w-16 h-16 bg-red-50 text-gov-red rounded-none flex items-center justify-center mb-6 group-hover:bg-gov-red group-hover:text-white transition-all duration-500 shadow-inner">
                                        <i data-lucide="skull" class="w-8 h-8"></i>
                                    </div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Clandestinité</h4>
                                    <p class="text-[10px] text-gov-red font-black uppercase tracking-widest mt-2">Fréquence Cryptée</p>
                                </button>
                            ` : ''}

                            ${hasStaffAccess ? `
                                <button onclick="actions.setHubPanel('staff')" class="gov-card p-8 flex flex-col items-center text-center group bg-white rounded-none shadow-xl border border-purple-100 hover:border-purple-600 transition-all duration-500">
                                    <div class="w-16 h-16 bg-purple-50 text-purple-600 rounded-none flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                        <i data-lucide="shield" class="w-8 h-8"></i>
                                    </div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Administration</h4>
                                    <p class="text-[10px] text-purple-500 font-black uppercase tracking-widest mt-2">Fondation TFRP</p>
                                </button>
                            ` : ''}
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

    return `
    <div class="flex flex-col h-screen bg-white overflow-hidden">
        
        ${isMobileMenuOpen ? MobileMenuOverlay() : ''}

        <!-- UNIVERSAL NAVBAR -->
        <nav class="terminal-nav flex items-center justify-between shrink-0 border-b border-gray-100 bg-white sticky top-0 z-[100] px-6 md:px-8">
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
                        <div class="nav-dropdown rounded-none">
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
                        <button onclick="actions.setHubPanel('staff')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all">Administration</button>
                    ` : ''}
                </div>
            </div>

            <!-- Profile & Notifications -->
            <div class="flex items-center gap-2 md:gap-4 h-full">
                <button onclick="actions.setHubPanel('notifications')" class="p-2.5 text-gray-400 hover:text-gov-blue hover:bg-gov-light rounded-sm transition-all relative">
                    <i data-lucide="bell" class="w-5 h-5"></i>
                    ${state.notifications.length > 0 ? '<span class="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>' : ''}
                </button>
                
                <div class="nav-item hidden lg:flex">
                    <div class="flex items-center gap-4 cursor-pointer p-2.5 hover:bg-gov-light rounded-sm transition-all">
                        <div class="text-right">
                            <div class="text-[10px] font-black uppercase text-gov-text leading-none">${char.first_name}</div>
                            <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">${char.job ? char.job.toUpperCase() : 'CIVIL'}</div>
                        </div>
                        <div class="relative w-10 h-10">
                            <img src="${u.avatar}" class="w-full h-full rounded-full grayscale border border-gray-200 p-0.5 relative z-10 object-cover">
                            ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-30"></div>
                        </div>
                    </div>
                    <div class="nav-dropdown right-0 left-auto rounded-none">
                        <div class="px-4 py-3 border-b border-gray-50 bg-gov-light/30">
                            <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identité Discord</div>
                            <div class="text-[11px] font-black text-gov-text uppercase">${u.username}</div>
                        </div>
                        <button onclick="actions.setHubPanel('profile')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors">
                            <i data-lucide="user" class="w-4 h-4 text-gov-blue"></i> Mon Profil
                        </button>
                        <div class="h-px bg-gray-50 my-1"></div>
                        <button onclick="actions.backToSelect()" class="w-full text-left p-4 hover:bg-orange-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-orange-600 transition-colors">
                            <i data-lucide="users" class="w-4 h-4"></i> Changer Dossier
                        </button>
                        <button onclick="actions.confirmLogout()" class="w-full text-left p-4 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-red-600 transition-colors">
                            <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
                        </button>
                    </div>
                </div>

                <!-- Hamburger Button (Mobile) -->
                <button onclick="actions.toggleMobileMenu()" class="lg:hidden p-2.5 bg-gov-light text-gov-text rounded-sm">
                    <i data-lucide="menu" class="w-5 h-5"></i>
                </button>
            </div>
        </nav>

        <!-- MAIN CONTENT SCROLL -->
        <main class="flex-1 overflow-y-auto bg-white custom-scrollbar">
            ${mainContent}
        </main>

    </div>
    `;
};
