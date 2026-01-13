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
        return `<div class="flex h-screen w-full bg-white items-center justify-center animate-in"><div class="text-center"><div class="w-16 h-16 border-4 border-gov-blue border-t-transparent animate-spin mx-auto mb-6"></div><p class="text-[11px] font-black text-gov-blue uppercase tracking-[0.4em]">SYNCHRONISATION CAD-SYSTEM...</p></div></div>`;
    }

    let mainContent = '';
    switch(panel) {
        case 'main':
            mainContent = `
                <div class="animate-in p-8 max-w-7xl mx-auto w-full space-y-16 pb-24">
                    
                    <!-- LIVE ROW: STATS & NEWS (SIDE BY SIDE ON PC) -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-900 shadow-2xl">
                        <!-- Server Stats -->
                        <div class="p-10 bg-gov-light border-b lg:border-b-0 lg:border-r border-gray-900 flex flex-col justify-between">
                            <div>
                                <div class="flex justify-between items-center mb-8">
                                    <span class="text-[10px] font-black text-gov-blue uppercase tracking-widest">Signal Los Angeles</span>
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 bg-emerald-500 animate-pulse"></span>
                                        <span class="text-[10px] font-black text-emerald-600 uppercase">En Ligne</span>
                                    </div>
                                </div>
                                <div class="flex items-baseline gap-2">
                                    <span class="text-7xl font-black text-gov-text tracking-tighter">${erlc.currentPlayers}</span>
                                    <span class="text-3xl text-gray-400 font-bold">/ ${erlc.maxPlayers}</span>
                                </div>
                                <div class="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 italic">Masse Citoyenne Active</div>
                            </div>
                            <div class="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center">
                                <div>
                                    <div class="text-[8px] text-gray-500 font-black uppercase mb-1">Clef de raccordement</div>
                                    <div class="text-xs font-mono font-black text-gov-blue select-all uppercase tracking-widest">${erlc.joinKey || 'INDISPONIBLE'}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-[8px] text-gray-500 font-black uppercase mb-1">File</div>
                                    <div class="text-xl font-mono font-black text-gov-text">${erlc.queue?.length || 0}</div>
                                </div>
                            </div>
                        </div>

                        <!-- News/Heists -->
                        <div class="p-10 bg-gov-text text-white flex flex-col">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="text-xs font-black text-gov-red uppercase tracking-[0.3em] flex items-center gap-3">
                                    <i data-lucide="megaphone" class="w-5 h-5"></i> ALERTES L.A.
                                </h3>
                                <span class="text-[9px] text-gray-500 font-bold uppercase tracking-widest italic">${new Date().toLocaleTimeString()}</span>
                            </div>
                            <div class="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-4 max-h-[160px]">
                                ${heists.length > 0 ? heists.map(h => `
                                    <div class="flex items-center gap-4 group">
                                        <div class="w-1.5 h-8 bg-gov-red group-hover:scale-y-110 transition-transform"></div>
                                        <div>
                                            <div class="text-xs font-black uppercase italic tracking-tighter text-white">${h.location || 'Incident Localisé'}</div>
                                            <div class="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">Intervention Prioritaire Code 3</div>
                                        </div>
                                    </div>
                                `).join('') : `
                                    <div class="h-full flex flex-col items-center justify-center opacity-30 italic text-[10px] uppercase font-bold text-gray-400">
                                        <i data-lucide="check-circle" class="w-8 h-8 mb-2"></i>
                                        Secteur sous contrôle total
                                    </div>
                                `}
                            </div>
                            <button onclick="actions.setHubPanel('notifications')" class="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all text-left flex items-center gap-2 border-t border-white/10 pt-6">
                                ARCHIVES DES TRANSMISSIONS <i data-lucide="arrow-right" class="w-3 h-3"></i>
                            </button>
                        </div>
                    </div>

                    <!-- GRID DES BULLES (Quick Access) -->
                    <div class="space-y-8">
                        <h3 class="text-xs font-black text-gov-text uppercase tracking-[0.4em] flex items-center gap-4 px-2">
                             <span class="w-12 h-0.5 bg-gov-blue"></span> TERMINAUX ACCRÉDITÉS
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            
                            <!-- Banque -->
                            <button onclick="actions.setHubPanel('bank')" class="gov-card p-10 flex flex-col items-center text-center group">
                                <div class="w-16 h-16 bg-gov-light border border-gray-900 flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-[6px_6px_0px_#161616]">
                                    <i data-lucide="landmark" class="w-8 h-8"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Banque</h4>
                                <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2 border-t border-gray-200 pt-3 w-full">Comptabilité</p>
                            </button>

                            <!-- Patrimoine -->
                            <button onclick="actions.setHubPanel('assets')" class="gov-card p-10 flex flex-col items-center text-center group">
                                <div class="w-16 h-16 bg-gov-light border border-gray-900 flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-[6px_6px_0px_#161616]">
                                    <i data-lucide="gem" class="w-8 h-8"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Patrimoine</h4>
                                <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2 border-t border-gray-200 pt-3 w-full">Inventaire</p>
                            </button>

                            <!-- Emploi -->
                            <button onclick="actions.setHubPanel('jobs')" class="gov-card p-10 flex flex-col items-center text-center group">
                                <div class="w-16 h-16 bg-gov-light border border-gray-900 flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-[6px_6px_0px_#161616]">
                                    <i data-lucide="briefcase" class="w-8 h-8"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Emploi</h4>
                                <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2 border-t border-gray-200 pt-3 w-full">Carrière</p>
                            </button>

                             <!-- Entreprises -->
                            <button onclick="actions.setHubPanel('enterprise')" class="gov-card p-10 flex flex-col items-center text-center group">
                                <div class="w-16 h-16 bg-gov-light border border-gray-900 flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-[6px_6px_0px_#161616]">
                                    <i data-lucide="building-2" class="w-8 h-8"></i>
                                </div>
                                <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-text">Corporations</h4>
                                <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2 border-t border-gray-200 pt-3 w-full">Commerce</p>
                            </button>

                            <!-- CAD (If applicable job) -->
                            ${['leo', 'lafd', 'ladot', 'lawyer', 'maire', 'adjoint', 'juge', 'procureur'].includes(char.job) ? `
                                <button onclick="actions.setHubPanel('services')" class="gov-card p-10 flex flex-col items-center text-center group !border-gov-blue">
                                    <div class="w-16 h-16 bg-blue-50 border border-gov-blue flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-[6px_6px_0px_#000091]">
                                        <i data-lucide="shield-check" class="w-8 h-8"></i>
                                    </div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-blue">CAD-OS</h4>
                                    <p class="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-2 border-t border-blue-100 pt-3 w-full">Service Public</p>
                                </button>
                            ` : ''}

                            <!-- Illicit (If alignment is illegal) -->
                            ${isIllegal ? `
                                <button onclick="actions.setHubPanel('illicit')" class="gov-card p-10 flex flex-col items-center text-center group !border-gov-red">
                                    <div class="w-16 h-16 bg-red-50 border border-gov-red flex items-center justify-center mb-8 group-hover:bg-gov-red group-hover:text-white transition-all shadow-[6px_6px_0px_#E1000F]">
                                        <i data-lucide="skull" class="w-8 h-8"></i>
                                    </div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight text-gov-red">Fréquence</h4>
                                    <p class="text-[10px] text-gov-red font-black uppercase tracking-widest mt-2 border-t border-red-100 pt-3 w-full">Clandestinité</p>
                                </button>
                            ` : ''}

                            <!-- Administration (If staff) -->
                            ${hasStaffAccess ? `
                                <button onclick="actions.setHubPanel('staff')" class="gov-card p-10 flex flex-col items-center text-center group !border-purple-600">
                                    <div class="w-16 h-16 bg-purple-50 border border-purple-600 flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-[6px_6px_0px_#9333ea]">
                                        <i data-lucide="shield" class="w-8 h-8"></i>
                                    </div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight text-purple-600">Fondation</h4>
                                    <p class="text-[10px] text-purple-400 font-black uppercase tracking-widest mt-2 border-t border-purple-100 pt-3 w-full">Staff Access</p>
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
    <!-- MOBILE OVERLAY MENU -->
    <div id="mobile-menu-overlay" class="${isMobileMenuOpen ? 'open' : ''}">
        <div class="flex justify-between items-center mb-16">
            <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">LIBERTÉ • ÉGALITÉ • JUSTICE</div>
                <div class="text-md">LOS ANGELES HUB</div>
            </div>
            <button onclick="actions.toggleMobileMenu()" class="p-4 border border-gray-900"><i data-lucide="x" class="w-6 h-6"></i></button>
        </div>
        <div class="flex flex-col gap-4">
            <button onclick="actions.setHubPanel('main')" class="text-4xl font-black text-gov-text uppercase italic text-left tracking-tighter border-b-4 border-gray-900 pb-2">Tableau de bord</button>
            <button onclick="actions.setHubPanel('bank')" class="text-4xl font-black text-gov-text uppercase italic text-left tracking-tighter border-b-4 border-gray-900 pb-2">Économie</button>
            <button onclick="actions.setHubPanel('services')" class="text-4xl font-black text-gov-text uppercase italic text-left tracking-tighter border-b-4 border-gray-900 pb-2">Services CAD</button>
            <button onclick="actions.setHubPanel('assets')" class="text-4xl font-black text-gov-text uppercase italic text-left tracking-tighter border-b-4 border-gray-900 pb-2">Patrimoine</button>
            <button onclick="actions.setHubPanel('profile')" class="text-4xl font-black text-gov-blue uppercase italic text-left tracking-tighter border-b-4 border-gov-blue pb-2">Mon Profil</button>
            ${hasStaffAccess ? `<button onclick="actions.setHubPanel('staff')" class="text-4xl font-black text-purple-600 uppercase italic text-left tracking-tighter border-b-4 border-purple-600 pb-2">Administration</button>` : ''}
        </div>
        <div class="mt-auto flex flex-col gap-4">
            <button onclick="actions.backToSelect()" class="py-4 border-2 border-gray-900 font-black uppercase text-xs tracking-widest">Changer de Dossier</button>
            <button onclick="actions.confirmLogout()" class="py-4 bg-gov-red text-white font-black uppercase text-xs tracking-widest">Déconnexion SÉCURISÉE</button>
        </div>
    </div>

    <div class="flex flex-col h-screen bg-white overflow-hidden">
        
        <!-- UNIVERSAL NAVBAR -->
        <nav class="terminal-nav flex items-center justify-between shrink-0 border-b border-gray-900 bg-white sticky top-0 z-[100] px-6">
            <div class="flex items-center gap-12 h-full">
                <div onclick="actions.setHubPanel('main')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-transform">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red italic">Gouvernement Local</div>
                    <div class="text-md leading-none">LOS ANGELES</div>
                </div>

                <!-- Main Menu PC -->
                <div class="hidden lg:flex items-center gap-1 h-full">
                    <button onclick="actions.setHubPanel('main')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${panel === 'main' ? 'text-gov-blue border-b-4 border-gov-blue h-full' : 'text-gray-400 hover:text-gov-text'}">Tableau de bord</button>
                    
                    <div class="nav-item">
                        <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${['bank', 'enterprise'].includes(panel) ? 'text-gov-blue border-b-4 border-gov-blue h-full' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">
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
                        <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${['services', 'jobs'].includes(panel) ? 'text-gov-blue border-b-4 border-gov-blue h-full' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">
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

                    <button onclick="actions.setHubPanel('assets')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${panel === 'assets' ? 'text-gov-blue border-b-4 border-gov-blue h-full' : 'text-gray-400 hover:text-gov-text'}">Patrimoine</button>
                </div>
            </div>

            <!-- Profile & Mobile Trigger -->
            <div class="flex items-center gap-4 h-full">
                <button onclick="actions.toggleMobileMenu()" class="lg:hidden p-3 border border-gray-900"><i data-lucide="menu" class="w-6 h-6"></i></button>
                
                <div class="hidden lg:flex nav-item">
                    <div class="flex items-center gap-4 cursor-pointer p-2 hover:bg-gov-light transition-all border border-transparent hover:border-gray-200">
                        <div class="text-right">
                            <div class="text-[10px] font-black uppercase text-gov-text leading-none">${char.first_name}</div>
                            <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">${char.job ? char.job.toUpperCase() : 'CIVIL'}</div>
                        </div>
                        <div class="relative w-10 h-10">
                            <img src="${u.avatar}" class="w-full h-full grayscale border-2 border-gray-900 p-0.5 relative z-10">
                            ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] max-w-none z-20 pointer-events-none">` : ''}
                        </div>
                    </div>
                    <div class="nav-dropdown right-0 left-auto border-t-4 border-gov-blue">
                        <div class="px-4 py-3 border-b border-gray-100 bg-gov-light/30 mb-2">
                            <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identité Discord</div>
                            <div class="text-[11px] font-black text-gov-text uppercase">${u.username}</div>
                        </div>
                        <button onclick="actions.setHubPanel('profile')" class="w-full text-left p-3 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
                            <i data-lucide="user" class="w-4 h-4 text-gov-blue"></i> Mon Profil
                        </button>
                        <button onclick="actions.backToSelect()" class="w-full text-left p-3 hover:bg-orange-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-orange-600">
                            <i data-lucide="users" class="w-4 h-4"></i> Changer de Dossier
                        </button>
                        <button onclick="actions.confirmLogout()" class="w-full text-left p-3 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-red-600">
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
