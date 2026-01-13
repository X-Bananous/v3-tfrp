
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
    const isBypass = state.activeCharacter?.id === 'STAFF_BYPASS';
    const char = state.activeCharacter;
    const isIllegal = char?.alignment === 'illegal';
    const hasStaffAccess = Object.keys(state.user.permissions || {}).length > 0 || state.user.isFounder;

    if (state.isPanelLoading) {
        return `<div class="flex h-full w-full bg-white items-center justify-center animate-fade-in"><div class="text-center"><div class="w-12 h-12 border-4 border-[#000091] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p class="text-[10px] font-black text-[#000091] uppercase tracking-[0.3em]">Ouverture de session...</p></div></div>`;
    }

    let content = '';

    if (state.activeHubPanel === 'main') {
        const hasServiceAccess = ['leo', 'lafd', 'ladot', 'lawyer', 'maire', 'adjoint', 'juge', 'procureur'].includes(char?.job || '');
        const majorHeists = state.globalActiveHeists?.filter(h => !['house', 'gas', 'atm'].includes(h.heist_type)) || [];

        content = `
            <div class="animate-fade-in h-full flex flex-col bg-[#F6F6F6] p-8 overflow-y-auto custom-scrollbar">
                <div class="max-w-7xl mx-auto w-full space-y-10">
                    
                    <!-- BIENVENUE & ALERTE -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div class="lg:col-span-8">
                            <h1 class="text-4xl font-black text-[#161616] uppercase italic tracking-tighter mb-2">Bienvenue, ${char.first_name} ${char.last_name}</h1>
                            <p class="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Session active : <span class="text-[#000091]">${new Date().toLocaleDateString()}</span> • Terminal v5.0.0</p>
                        </div>
                        <div class="lg:col-span-4">
                            ${majorHeists.length > 0 ? `
                                <div class="bg-red-50 border-2 border-red-600 p-4 flex items-center gap-4 animate-pulse">
                                    <i data-lucide="radio" class="text-red-600 w-6 h-6"></i>
                                    <div>
                                        <div class="text-[8px] font-black text-red-600 uppercase tracking-widest">Flash Alerte</div>
                                        <div class="text-xs font-bold text-red-900 uppercase">Incident majeur en cours</div>
                                    </div>
                                </div>
                            ` : `
                                <div class="bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-4">
                                    <i data-lucide="sun" class="text-emerald-600 w-6 h-6"></i>
                                    <div>
                                        <div class="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Statut Ville</div>
                                        <div class="text-xs font-bold text-emerald-900 uppercase">Situation calme détectée</div>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- GRILLE DES SERVICES -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        <!-- BLOC RÉGALIEN -->
                        <div class="space-y-4">
                            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Pôle Régalien</h3>
                            <button onclick="actions.setHubPanel('jobs')" class="gov-card w-full p-8 flex flex-col text-left group h-48 relative overflow-hidden">
                                <i data-lucide="briefcase" class="w-8 h-8 text-[#000091] mb-auto group-hover:scale-110 transition-transform"></i>
                                <div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight">Pôle Emploi</h4>
                                    <p class="text-xs text-gray-500 font-medium">Carrière & Métiers</p>
                                </div>
                            </button>
                            ${hasServiceAccess ? `
                                <button onclick="actions.setHubPanel('services')" class="gov-card w-full p-8 flex flex-col text-left group h-48 bg-[#000091] border-[#000091]">
                                    <i data-lucide="siren" class="w-8 h-8 text-white mb-auto"></i>
                                    <div>
                                        <h4 class="text-xl font-black text-white uppercase italic tracking-tight">Services Publics</h4>
                                        <p class="text-xs text-blue-200 font-medium">CAD & Gestion</p>
                                    </div>
                                </button>
                            ` : ''}
                        </div>

                        <!-- BLOC ÉCONOMIQUE -->
                        <div class="space-y-4">
                            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Pôle Économique</h3>
                            <button onclick="actions.setHubPanel('bank')" class="gov-card w-full p-8 flex flex-col text-left group h-48">
                                <i data-lucide="landmark" class="w-8 h-8 text-[#000091] mb-auto"></i>
                                <div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight">Ma Banque</h4>
                                    <p class="text-xs text-gray-500 font-medium">Solde & Virements</p>
                                </div>
                            </button>
                            <button onclick="actions.setHubPanel('enterprise')" class="gov-card w-full p-8 flex flex-col text-left group h-48">
                                <i data-lucide="building-2" class="w-8 h-8 text-[#000091] mb-auto"></i>
                                <div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight">Commerce</h4>
                                    <p class="text-xs text-gray-500 font-medium">Mon Entreprise</p>
                                </div>
                            </button>
                        </div>

                        <!-- BLOC PERSONNEL & AUTRES -->
                        <div class="space-y-4">
                            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Pôle Personnel</h3>
                            <button onclick="actions.setHubPanel('assets')" class="gov-card w-full p-8 flex flex-col text-left group h-48">
                                <i data-lucide="gem" class="w-8 h-8 text-[#000091] mb-auto"></i>
                                <div>
                                    <h4 class="text-xl font-black uppercase italic tracking-tight">Patrimoine</h4>
                                    <p class="text-xs text-gray-500 font-medium">Inventaire & Biens</p>
                                </div>
                            </button>
                            ${isIllegal ? `
                                <button onclick="actions.setHubPanel('illicit')" class="gov-card w-full p-8 flex flex-col text-left group h-48 bg-[#161616] border-[#161616]">
                                    <i data-lucide="skull" class="w-8 h-8 text-red-600 mb-auto"></i>
                                    <div>
                                        <h4 class="text-xl font-black text-white uppercase italic tracking-tight">Clandestinité</h4>
                                        <p class="text-xs text-gray-500 font-medium italic">Accès Crypté</p>
                                    </div>
                                </button>
                            ` : `
                                <button onclick="actions.setHubPanel('notifications')" class="gov-card w-full p-8 flex flex-col text-left group h-48">
                                    <i data-lucide="bell" class="w-8 h-8 text-[#000091] mb-auto"></i>
                                    <div>
                                        <h4 class="text-xl font-black uppercase italic tracking-tight">Actualités</h4>
                                        <p class="text-xs text-gray-500 font-medium">Flux système</p>
                                    </div>
                                </button>
                            `}
                        </div>
                    </div>

                    <!-- LIGNE STAFF (SI AUTORISÉ) -->
                    ${hasStaffAccess ? `
                        <div class="pt-8 border-t border-gray-200">
                             <button onclick="actions.setHubPanel('staff')" class="w-full p-8 bg-white border-2 border-[#161616] flex items-center justify-between group hover:bg-[#161616] transition-all">
                                <div class="flex items-center gap-6">
                                    <div class="w-12 h-12 bg-[#161616] text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#161616] transition-colors"><i data-lucide="shield-alert"></i></div>
                                    <div>
                                        <h4 class="text-2xl font-black uppercase italic tracking-tighter group-hover:text-white transition-colors">Console de Commandement (Staff)</h4>
                                        <p class="text-xs text-gray-500 font-bold uppercase tracking-widest group-hover:text-gray-400">Accès réservé au personnel accrédité</p>
                                    </div>
                                </div>
                                <i data-lucide="arrow-right" class="text-gray-300 group-hover:text-white transition-all"></i>
                             </button>
                        </div>
                    ` : ''}

                </div>
                <div class="py-20 text-center opacity-30 mt-auto">
                    <p class="text-[9px] font-black uppercase tracking-[0.5em] text-gray-500">République de Los Angeles • Terminal Administratif v5.0</p>
                </div>
            </div>
        `;
    } 
    else if (state.activeHubPanel === 'profile') content = ProfileView();
    else if (state.activeHubPanel === 'notifications') content = NotificationsView();
    else if (state.activeHubPanel === 'jobs') content = JobCenterView();
    else if (state.activeHubPanel === 'enterprise') content = EnterpriseView();
    else if (state.activeHubPanel === 'bank') content = BankView();
    else if (state.activeHubPanel === 'assets') content = AssetsView();
    else if (state.activeHubPanel === 'illicit') content = IllicitView();
    else if (state.activeHubPanel === 'staff') content = StaffView();
    else if (state.activeHubPanel === 'services') content = ServicesView();

    const sidebarContent = `
        <div class="p-8 pb-10 shrink-0">
            <div class="marianne-block uppercase font-black tracking-tight text-[#161616] mb-12">
                <div class="text-[8px] tracking-widest border-b-2 border-red-600 pb-0.5 mb-1">Liberté • Égalité • Roleplay</div>
                <div class="text-md leading-none">RÉPUBLIQUE<br>DE L.A.</div>
            </div>
            
            <div onclick="actions.setHubPanel('profile')" class="flex items-center gap-4 p-4 bg-[#F6F6F6] rounded-sm cursor-pointer hover:bg-gray-200 transition-colors border border-gray-100 group">
                <img src="${u.avatar}" class="w-10 h-10 grayscale group-hover:grayscale-0 transition-all">
                <div class="min-w-0">
                    <div class="text-[10px] font-black uppercase tracking-tight text-[#161616] truncate">${u.username}</div>
                    <div class="text-[8px] font-bold text-gray-500 uppercase tracking-widest truncate">Mon Profil</div>
                </div>
            </div>
        </div>

        <nav class="flex-1 px-4 space-y-1">
            <button onclick="actions.setHubPanel('main')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${state.activeHubPanel === 'main' ? 'bg-[#000091] text-white' : 'text-gray-600 hover:bg-gray-100'}">
                <i data-lucide="layout-grid" class="w-4 h-4"></i> Accueil
            </button>
            <button onclick="actions.setHubPanel('bank')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${state.activeHubPanel === 'bank' ? 'bg-[#000091] text-white' : 'text-gray-600 hover:bg-gray-100'}">
                <i data-lucide="landmark" class="w-4 h-4"></i> Banque
            </button>
             <button onclick="actions.setHubPanel('enterprise')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${state.activeHubPanel === 'enterprise' ? 'bg-[#000091] text-white' : 'text-gray-600 hover:bg-gray-100'}">
                <i data-lucide="building-2" class="w-4 h-4"></i> Entreprise
            </button>
            <button onclick="actions.setHubPanel('assets')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${state.activeHubPanel === 'assets' ? 'bg-[#000091] text-white' : 'text-gray-600 hover:bg-gray-100'}">
                <i data-lucide="gem" class="w-4 h-4"></i> Patrimoine
            </button>
            <div class="pt-6 pb-2">
                <div class="px-4 text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">Services</div>
            </div>
            <button onclick="actions.setHubPanel('jobs')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${state.activeHubPanel === 'jobs' ? 'bg-[#000091] text-white' : 'text-gray-600 hover:bg-gray-100'}">
                <i data-lucide="briefcase" class="w-4 h-4"></i> Pôle Emploi
            </button>
             ${hasStaffAccess ? `
                <button onclick="actions.setHubPanel('staff')" class="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${state.activeHubPanel === 'staff' ? 'bg-[#161616] text-white' : 'text-red-600 hover:bg-red-50'}">
                    <i data-lucide="shield-alert" class="w-4 h-4"></i> Administration
                </button>
            ` : ''}
        </nav>

        <div class="p-6 border-t border-gray-100">
            <button onclick="actions.confirmLogout()" class="w-full py-3 bg-[#F6F6F6] text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2">
                <i data-lucide="log-out" class="w-3 h-3"></i> Quitter
            </button>
        </div>
    `;

    return `
        <div class="flex h-full w-full bg-white relative overflow-hidden">
            <!-- Sidebar Desktop -->
            <aside class="hidden md:flex w-64 border-r border-gray-200 flex-col shrink-0">
                ${sidebarContent}
            </aside>
            
            <!-- Mobile Toggle -->
            <div class="md:hidden fixed top-4 right-4 z-[100]">
                 <button onclick="actions.toggleSidebar()" class="p-3 bg-white border border-gray-200 shadow-xl rounded-sm">
                    <i data-lucide="menu" class="w-6 h-6 text-[#000091]"></i>
                 </button>
            </div>

            <!-- Main Content -->
            <main class="flex-1 flex flex-col min-h-0 relative">
                ${content}
            </main>
            
            <!-- Mobile Menu Overlay -->
            <div class="md:hidden fixed inset-0 bg-black/50 z-[150] transition-opacity duration-300 ${state.ui.sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}" onclick="actions.toggleSidebar()"></div>
            <aside class="md:hidden fixed top-0 bottom-0 left-0 w-72 bg-white z-[200] border-r border-gray-200 transition-transform duration-300 transform ${state.ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col">
                ${sidebarContent}
            </aside>
        </div>
    `;
};
