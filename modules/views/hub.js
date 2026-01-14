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
    const isMobileMenuOpen = state.ui.mobileMenuOpen;

    if (state.isPanelLoading) {
        return `<div class="flex h-screen w-full bg-white items-center justify-center animate-in"><div class="text-center"><div class="w-12 h-12 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p class="text-[10px] font-black text-gov-blue uppercase tracking-[0.3em]">Synchronisation CAD...</p></div></div>`;
    }

    const MobileMenuOverlay = () => `
        <div class="fixed inset-0 z-[2000] bg-white flex flex-col animate-in">
            <div class="h-20 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase font-black">État de Californie</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>
                <button onclick="actions.toggleMobileMenu()" class="p-3 bg-gov-light text-gov-text rounded-full">
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
                
                ${isIllegal ? `<button onclick="actions.setHubPanel('illicit')" class="w-full text-left py-4 border-b border-red-100 font-black uppercase text-xs tracking-widest text-red-600">Réseau Clandestin</button>` : ''}
                ${hasStaffAccess ? `<button onclick="actions.setHubPanel('staff')" class="w-full text-left py-4 border-b border-purple-100 font-black uppercase text-xs tracking-widest text-purple-600">Administration</button>` : ''}

                <div class="mt-auto pt-10 flex flex-col gap-4">
                    <button onclick="actions.setHubPanel('profile')" class="w-full py-4 bg-gov-light text-gov-text font-black uppercase text-[10px] tracking-widest text-center rounded-xl">Mon Profil</button>
                    <button onclick="actions.confirmLogout()" class="w-full py-4 bg-red-50 text-red-600 font-black uppercase text-[10px] tracking-widest text-center rounded-xl">Déconnexion</button>
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
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="bg-gov-light p-8 border border-gray-200 shadow-xl rounded-none flex flex-col justify-between group">
                            <div class="flex justify-between items-center mb-6">
                                <span class="text-[10px] font-black text-gov-blue uppercase tracking-[0.3em]">Signal Temps Réel</span>
                                <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span class="text-[10px] font-black uppercase text-emerald-600">Opérationnel</span></div>
                            </div>
                            <div class="grid grid-cols-2 gap-8">
                                <div><div class="text-[9px] text-gray-500 font-black uppercase mb-1">Population</div><div class="text-4xl font-mono font-black text-gov-text tracking-tighter">${erlc.currentPlayers}<span class="text-gray-300 text-xl">/${erlc.maxPlayers}</span></div></div>
                                <div><div class="text-[9px] text-gray-500 font-black uppercase mb-1">File Douanière</div><div class="text-4xl font-mono font-black text-gov-text tracking-tighter">${erlc.queue?.length || 0}</div></div>
                            </div>
                            <div class="mt-8 pt-6 border-t border-gray-200">
                                <div class="text-[9px] text-gray-500 font-black uppercase mb-2">Clef de raccordement</div>
                                <div class="text-sm font-mono font-black text-gov-blue select-all uppercase tracking-[0.2em] bg-white p-3 border border-gray-100 text-center">${erlc.joinKey || 'INDISPONIBLE'}</div>
                            </div>
                        </div>

                        <div class="bg-gov-text text-white p-8 rounded-none shadow-2xl flex flex-col justify-between">
                            <div class="flex items-center justify-between mb-6">
                                <div class="px-2 py-0.5 bg-gov-red text-white text-[8px] font-black uppercase tracking-widest animate-pulse">FLASH INFO</div>
                                <i data-lucide="megaphone" class="w-5 h-5 text-gray-500"></i>
                            </div>
                            <div class="flex-1 flex items-center justify-center py-8">
                                <div class="text-[10px] text-gray-500 uppercase font-black tracking-[0.4em] italic text-center">Réseau de transmission stable.</div>
                            </div>
                            <button onclick="actions.setHubPanel('notifications')" class="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all text-left flex items-center gap-3 border-t border-white/10 pt-4">Consulter le journal <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></button>
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
        <nav class="terminal-nav flex items-center justify-between shrink-0 border-b border-gray-100 bg-white sticky top-0 z-[100] px-4 md:px-8">
            <div class="flex items-center gap-4 md:gap-12 h-full">
                <div onclick="actions.setHubPanel('main')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-transform hover:scale-[0.8]">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">État de Californie</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>
                <div class="hidden lg:flex items-center gap-1 h-full">
                    <button onclick="actions.setHubPanel('main')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${panel === 'main' ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-400 hover:text-gov-text'}">Tableau de bord</button>
                    <div class="nav-item">
                        <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${['bank', 'enterprise'].includes(panel) ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">Économie <i data-lucide="chevron-down" class="w-3 h-3"></i></button>
                        <div class="nav-dropdown rounded-none">
                            <button onclick="actions.setHubPanel('bank')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors"><i data-lucide="landmark" class="w-4 h-4 text-gov-blue"></i> Banque</button>
                            <button onclick="actions.setHubPanel('enterprise')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors"><i data-lucide="building-2" class="w-4 h-4 text-gov-blue"></i> Entreprises</button>
                        </div>
                    </div>
                    <div class="nav-item">
                        <button class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${['services', 'jobs'].includes(panel) ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'} flex items-center gap-2">Services Publics <i data-lucide="chevron-down" class="w-3 h-3"></i></button>
                        <div class="nav-dropdown rounded-none">
                            <button onclick="actions.setHubPanel('services')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors"><i data-lucide="shield-check" class="w-4 h-4 text-gov-blue"></i> CAD</button>
                            <button onclick="actions.setHubPanel('jobs')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors"><i data-lucide="briefcase" class="w-4 h-4 text-gov-blue"></i> Pôle Emploi</button>
                        </div>
                    </div>
                    <button onclick="actions.setHubPanel('assets')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${panel === 'assets' ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'}">Patrimoine</button>
                    <div class="h-6 w-px bg-gray-100 mx-2"></div>
                    ${isIllegal ? `<button onclick="actions.setHubPanel('illicit')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all">Secteur Clandestin</button>` : ''}
                    ${hasStaffAccess ? `<button onclick="actions.setHubPanel('staff')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all">Administration</button>` : ''}
                </div>
            </div>

            <div class="flex items-center gap-2 md:gap-4 h-full">
                <button onclick="actions.setHubPanel('notifications')" class="p-2 text-gray-400 hover:text-gov-blue hover:bg-gov-light rounded-full transition-all relative">
                    <i data-lucide="bell" class="w-5 h-5"></i>
                    ${state.notifications.length > 0 ? '<span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>' : ''}
                </button>
                
                <div class="nav-item hidden lg:flex">
                    <div class="flex items-center gap-4 cursor-pointer p-2.5 hover:bg-gov-light rounded-xl transition-all">
                        <div class="text-right"><div class="text-[10px] font-black text-gov-text leading-none uppercase">${char.first_name}</div><div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">${char.job || 'CIVIL'}</div></div>
                        <div class="relative w-10 h-10">
                            <img src="${u.avatar}" class="w-full h-full rounded-full grayscale border border-gray-200 p-0.5 relative z-10 object-cover">
                            ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                        </div>
                    </div>
                    <div class="nav-dropdown right-0 left-auto rounded-none">
                        <button onclick="actions.setHubPanel('profile')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors"><i data-lucide="user" class="w-4 h-4 text-gov-blue"></i> Mon Profil</button>
                        <button onclick="actions.backToSelect()" class="w-full text-left p-4 hover:bg-orange-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-orange-600 transition-colors"><i data-lucide="users" class="w-4 h-4"></i> Changer Citoyen</button>
                        <button onclick="actions.confirmLogout()" class="w-full text-left p-4 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-red-600 transition-colors"><i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion</button>
                    </div>
                </div>

                <button onclick="actions.toggleMobileMenu()" class="lg:hidden p-2.5 bg-gov-light text-gov-text rounded-full">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                </button>
            </div>
        </nav>
        <main class="flex-1 overflow-y-auto bg-white custom-scrollbar">${mainContent}</main>
        <footer class="h-8 bg-gov-light/50 border-t border-gray-100 flex items-center justify-center shrink-0">
            <span class="text-[8px] font-black text-gray-400 uppercase tracking-[0.5em]">TFRP California Administration • V3 Platinum</span>
        </footer>
    </div>
    `;
};