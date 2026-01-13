
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
import { ui } from '../ui.js';
import { HEIST_DATA } from './illicit.js';
import { CONFIG } from '../config.js';

export const HubView = () => {
    const u = state.user;
    const char = state.activeCharacter;
    const isIllegal = char?.alignment === 'illegal';
    const hasStaffAccess = Object.keys(state.user.permissions || {}).length > 0 || state.user.isFounder;

    if (state.isPanelLoading) {
        return `<div class="flex h-full w-full bg-white items-center justify-center animate-fade-in"><div class="text-center"><div class="w-12 h-12 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p class="text-[10px] font-black text-gov-blue uppercase tracking-[0.3em]">Ouverture de session...</p></div></div>`;
    }

    let content = '';
    const panel = state.activeHubPanel;

    if (panel === 'main') {
        const hasServiceAccess = ['leo', 'lafd', 'ladot', 'lawyer', 'maire', 'adjoint', 'juge', 'procureur'].includes(char?.job || '');
        const majorHeists = state.globalActiveHeists?.filter(h => !['house', 'gas', 'atm'].includes(h.heist_type)) || [];

        content = `
            <div class="animate-fade-in h-full flex flex-col bg-gov-light p-4 md:p-8 overflow-y-auto">
                <div class="max-w-7xl mx-auto w-full space-y-10">
                    
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div class="lg:col-span-8">
                            <h1 class="text-3xl md:text-4xl font-black text-gov-text uppercase italic tracking-tighter mb-2 text-center md:text-left">Bienvenue, ${char.first_name} ${char.last_name}</h1>
                            <p class="text-gray-500 font-bold uppercase text-[9px] tracking-widest text-center md:text-left">Session : <span class="text-gov-blue">${new Date().toLocaleDateString()}</span> • Terminal v5.1.0</p>
                        </div>
                        <div class="lg:col-span-4">
                            ${majorHeists.length > 0 ? `
                                <div class="gov-alert p-4 flex items-center gap-4 animate-pulse">
                                    <i data-lucide="radio" class="text-gov-red w-6 h-6"></i>
                                    <div>
                                        <div class="text-[8px] font-black text-gov-red uppercase tracking-widest">Signalement CAD</div>
                                        <div class="text-xs font-bold text-red-900 uppercase">Incident majeur détecté</div>
                                    </div>
                                </div>
                            ` : `
                                <div class="bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-4">
                                    <i data-lucide="shield-check" class="text-emerald-600 w-6 h-6"></i>
                                    <div>
                                        <div class="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Sécurité Publique</div>
                                        <div class="text-xs font-bold text-emerald-900 uppercase">Situation Normale</div>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="space-y-4">
                            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Pôle Public</h3>
                            <button onclick="actions.setHubPanel('jobs')" class="gov-card w-full p-8 flex flex-col text-left group h-44">
                                <i data-lucide="briefcase" class="w-8 h-8 text-gov-blue mb-auto group-hover:scale-110 transition-transform"></i>
                                <div><h4 class="text-xl font-black uppercase italic tracking-tight">Emploi</h4><p class="text-[10px] text-gray-500 font-bold uppercase">Carrière & Recrutement</p></div>
                            </button>
                            ${hasServiceAccess ? `
                                <button onclick="actions.setHubPanel('services')" class="gov-card w-full p-8 flex flex-col text-left bg-gov-blue border-gov-blue h-44 group">
                                    <i data-lucide="siren" class="w-8 h-8 text-white mb-auto group-hover:animate-pulse"></i>
                                    <div><h4 class="text-xl font-black text-white uppercase italic tracking-tight">Publics</h4><p class="text-[10px] text-blue-200 font-bold uppercase">Accès CAD & Central</p></div>
                                </button>
                            ` : ''}
                        </div>

                        <div class="space-y-4">
                            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Économie</h3>
                            <button onclick="actions.setHubPanel('bank')" class="gov-card w-full p-8 flex flex-col text-left h-44">
                                <i data-lucide="landmark" class="w-8 h-8 text-gov-blue mb-auto"></i>
                                <div><h4 class="text-xl font-black uppercase italic tracking-tight">Banque</h4><p class="text-[10px] text-gray-500 font-bold uppercase">Trésorerie & Flux</p></div>
                            </button>
                            <button onclick="actions.setHubPanel('enterprise')" class="gov-card w-full p-8 flex flex-col text-left h-44">
                                <i data-lucide="building-2" class="w-8 h-8 text-gov-blue mb-auto"></i>
                                <div><h4 class="text-xl font-black uppercase italic tracking-tight">Commerce</h4><p class="text-[10px] text-gray-500 font-bold uppercase">Mes Entreprises</p></div>
                            </button>
                        </div>

                        <div class="space-y-4">
                            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Personnel</h3>
                            <button onclick="actions.setHubPanel('assets')" class="gov-card w-full p-8 flex flex-col text-left h-44">
                                <i data-lucide="gem" class="w-8 h-8 text-gov-blue mb-auto"></i>
                                <div><h4 class="text-xl font-black uppercase italic tracking-tight">Patrimoine</h4><p class="text-[10px] text-gray-500 font-bold uppercase">Inventaire & Biens</p></div>
                            </button>
                            ${isIllegal ? `
                                <button onclick="actions.setHubPanel('illicit')" class="gov-card w-full p-8 flex flex-col text-left bg-gov-text border-gov-text h-44 group">
                                    <i data-lucide="skull" class="w-8 h-8 text-gov-red mb-auto group-hover:scale-125 transition-all"></i>
                                    <div><h4 class="text-xl font-black text-white uppercase italic tracking-tight">Illégal</h4><p class="text-[10px] text-gray-500 font-bold uppercase italic">Secteur Clandestin</p></div>
                                </button>
                            ` : `
                                <button onclick="actions.setHubPanel('notifications')" class="gov-card w-full p-8 flex flex-col text-left h-44">
                                    <i data-lucide="bell" class="w-8 h-8 text-gov-blue mb-auto"></i>
                                    <div><h4 class="text-xl font-black uppercase italic tracking-tight">Système</h4><p class="text-[10px] text-gray-500 font-bold uppercase">Notifications</p></div>
                                </button>
                            `}
                        </div>
                    </div>

                    ${hasStaffAccess ? `
                        <div class="pt-8 border-t border-gov-border">
                             <button onclick="actions.setHubPanel('staff')" class="w-full p-8 bg-white border-2 border-gov-text flex items-center justify-between group hover:bg-gov-text transition-all">
                                <div class="flex items-center gap-6">
                                    <div class="w-12 h-12 bg-gov-text text-white flex items-center justify-center group-hover:bg-white group-hover:text-gov-text transition-colors shadow-lg"><i data-lucide="shield-alert"></i></div>
                                    <div class="text-left">
                                        <h4 class="text-2xl font-black uppercase italic tracking-tighter group-hover:text-white transition-colors">Commandement Staff</h4>
                                        <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-gray-400">Accès restreint au personnel habilité</p>
                                    </div>
                                </div>
                                <i data-lucide="arrow-right" class="text-gray-300 group-hover:text-white transition-all hidden md:block"></i>
                             </button>
                        </div>
                    ` : ''}

                </div>
                <div class="py-20 text-center opacity-30 mt-auto">
                    <p class="text-[9px] font-black uppercase tracking-[0.5em] text-gray-500">République de Los Angeles • Portail Administratif v5.1</p>
                </div>
            </div>
        `;
    } 
    else if (panel === 'profile') content = ProfileView();
    else if (panel === 'notifications') content = NotificationsView();
    else if (panel === 'jobs') content = JobCenterView();
    else if (panel === 'enterprise') content = EnterpriseView();
    else if (panel === 'bank') content = BankView();
    else if (panel === 'assets') content = AssetsView();
    else if (panel === 'illicit') content = IllicitView();
    else if (panel === 'staff') content = StaffView();
    else if (panel === 'services') content = ServicesView();

    const sidebarContent = `
        <div class="p-8 pb-10 shrink-0">
            <div class="marianne-block uppercase font-black tracking-tight text-gov-text mb-12">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1">Liberté • Égalité • Roleplay</div>
                <div class="text-md leading-none">RÉPUBLIQUE<br>DE L.A.</div>
            </div>
            
            <div onclick="actions.setHubPanel('profile')" class="flex items-center gap-4 p-4 bg-gov-light rounded-sm cursor-pointer hover:bg-gray-200 transition-colors border border-gov-border group">
                <img src="${u.avatar}" class="w-10 h-10 grayscale group-hover:grayscale-0 transition-all border border-white">
                <div class="min-w-0">
                    <div class="text-[10px] font-black uppercase tracking-tight text-gov-text truncate">${u.username}</div>
                    <div class="text-[8px] font-bold text-gray-500 uppercase tracking-widest truncate">Mon Profil</div>
                </div>
            </div>
        </div>

        <nav class="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-10">
            <button onclick="actions.setHubPanel('main')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${panel === 'main' ? 'bg-gov-blue text-white shadow-lg' : 'text-gray-600 hover:bg-gov-light'}">
                <i data-lucide="layout-grid" class="w-4 h-4"></i> Accueil
            </button>
            <button onclick="actions.setHubPanel('bank')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${panel === 'bank' ? 'bg-gov-blue text-white shadow-lg' : 'text-gray-600 hover:bg-gov-light'}">
                <i data-lucide="landmark" class="w-4 h-4"></i> Banque
            </button>
             <button onclick="actions.setHubPanel('enterprise')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${panel === 'enterprise' ? 'bg-gov-blue text-white shadow-lg' : 'text-gray-600 hover:bg-gov-light'}">
                <i data-lucide="building-2" class="w-4 h-4"></i> Entreprise
            </button>
            <button onclick="actions.setHubPanel('assets')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${panel === 'assets' ? 'bg-gov-blue text-white shadow-lg' : 'text-gray-600 hover:bg-gov-light'}">
                <i data-lucide="gem" class="w-4 h-4"></i> Patrimoine
            </button>
            <div class="pt-6 pb-2">
                <div class="px-4 text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">Services</div>
            </div>
            <button onclick="actions.setHubPanel('jobs')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${panel === 'jobs' ? 'bg-gov-blue text-white shadow-lg' : 'text-gray-600 hover:bg-gov-light'}">
                <i data-lucide="briefcase" class="w-4 h-4"></i> Pôle Emploi
            </button>
             ${hasStaffAccess ? `
                <button onclick="actions.setHubPanel('staff')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${panel === 'staff' ? 'bg-gov-text text-white' : 'text-gov-red hover:bg-red-50'}">
                    <i data-lucide="shield-alert" class="w-4 h-4"></i> Administration
                </button>
            ` : ''}
        </nav>

        <div class="p-6 border-t border-gov-border">
            <button onclick="actions.confirmLogout()" class="w-full py-3 bg-gov-light text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-gov-red transition-all flex items-center justify-center gap-2 border border-gov-border">
                <i data-lucide="log-out" class="w-3 h-3"></i> Quitter
            </button>
        </div>
    `;

    return `
        <div class="hub-container bg-white">
            <!-- Sidebar Desktop -->
            <aside class="hidden md:flex w-64 border-r border-gov-border flex-col shrink-0 bg-white">
                ${sidebarContent}
            </aside>
            
            <!-- Mobile Navigation Bar -->
            <div class="md:hidden flex items-center justify-between px-4 py-3 border-b border-gov-border bg-white sticky top-0 z-[60]">
                <div class="marianne-block uppercase font-black tracking-tight text-gov-text scale-75 origin-left">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1">Roleplay</div>
                    <div class="text-md leading-none">RÉPUBLIQUE</div>
                </div>
                <button onclick="actions.toggleSidebar()" class="p-2 bg-gov-light border border-gov-border rounded-sm">
                    <i data-lucide="menu" class="w-6 h-6 text-gov-blue"></i>
                </button>
            </div>

            <!-- Main Content Area -->
            <main class="flex-1 flex flex-col min-h-0 relative bg-white overflow-y-auto">
                ${content}
            </main>
            
            <!-- Mobile Menu Overlay -->
            <div class="md:hidden fixed inset-0 bg-black/50 z-[150] transition-opacity duration-300 ${state.ui.sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}" onclick="actions.toggleSidebar()"></div>
            <aside class="md:hidden fixed top-0 bottom-0 left-0 w-72 bg-white z-[200] border-r border-gov-border transition-transform duration-300 transform ${state.ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col">
                ${sidebarContent}
            </aside>
        </div>
    `;
};
