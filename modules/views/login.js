
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const LoginView = () => {
    const u = state.user;
    const staff = state.landingStaff || [];
    const erlc = state.erlcData || { currentPlayers: 0, maxPlayers: 42, queue: [] };
    const heists = state.globalActiveHeists || [];

    const sortedStaff = staff.sort((a, b) => {
        const aIsAdmin = state.adminIds.includes(a.id);
        const bIsAdmin = state.adminIds.includes(b.id);
        return bIsAdmin - aIsAdmin;
    });

    return `
    <div class="flex-1 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        
        <!-- UNIFIED TERMINAL NAVBAR -->
        <nav class="terminal-nav shrink-0">
            <div class="flex items-center gap-6 md:gap-12">
                <div onclick="router('login')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-transform hover:scale-[0.8]">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>
            </div>

            <div class="flex items-center gap-4 h-full">
                ${u ? `
                    <div class="nav-item h-full flex items-center">
                        <div class="flex items-center gap-4 cursor-pointer p-2.5 hover:bg-gov-light rounded-sm transition-all h-full">
                            <div class="text-right hidden sm:block">
                                <div class="text-[10px] font-black uppercase text-gov-text leading-none">${u.username}</div>
                                <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">SESSION ACTIVE</div>
                            </div>
                            <div class="relative w-10 h-10 shrink-0">
                                <img src="${u.avatar}" class="w-full h-full rounded-full grayscale border border-gray-200 p-0.5 relative z-10 object-cover">
                                ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                                <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-30"></div>
                            </div>
                        </div>
                        <div class="nav-dropdown right-0 left-auto rounded-none shadow-2xl">
                            <div class="px-4 py-3 border-b border-gray-50 bg-gov-light/30">
                                <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identité Discord</div>
                                <div class="text-[11px] font-black text-gov-text uppercase">${u.id}</div>
                            </div>
                            <button onclick="router('profile_hub')" class="w-full text-left p-4 hover:bg-gov-light text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-colors text-gov-blue">
                                <i data-lucide="user" class="w-4 h-4"></i> Mon Profil
                            </button>
                            <div class="h-px bg-gray-50 my-1"></div>
                            <button onclick="actions.confirmLogout()" class="w-full text-left p-4 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-red-600 transition-colors">
                                <i data-lucide="log-out" class="w-4 h-4"></i> Déconnexion
                            </button>
                        </div>
                    </div>
                ` : `
                    <button onclick="actions.login()" class="px-6 py-2 bg-[#5865F2] text-white font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all rounded-sm shadow-lg flex items-center gap-3">
                        <i data-lucide="discord" class="w-4 h-4"></i> Connexion
                    </button>
                `}
            </div>
        </nav>

        <!-- HERO SECTION -->
        <section class="landing-section bg-gov-light border-b border-gray-200 py-16 md:py-24 px-6">
            <div class="max-w-4xl mx-auto text-center animate-in">
                <span class="inline-block px-4 py-1 bg-blue-100 text-gov-blue text-[10px] font-black uppercase tracking-[0.3em] mb-8 rounded-full border border-blue-200">Système CAD-OS v6.3 Platinum</span>
                <h1 class="text-4xl md:text-8xl font-black text-gov-text tracking-tighter leading-none mb-8 uppercase italic">
                    TEAM FRENCH<br><span class="text-gov-blue">ROLEPLAY.</span>
                </h1>
                <p class="text-base md:text-xl text-gray-600 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
                    Interface gouvernementale officielle de l'État de Californie. Gestion unifiée des identités, du patrimoine et des accréditations.
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button onclick="${u ? "router('profile_hub')" : "actions.login()"}" class="px-10 md:px-12 py-5 bg-gov-blue text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-black transition-all transform hover:scale-105 flex items-center justify-center gap-3">
                        <i data-lucide="shield" class="w-5 h-5"></i> Accéder au portail
                    </button>
                    <a href="${CONFIG.INVITE_URL}" target="_blank" class="px-10 md:px-12 py-5 bg-white text-gov-text font-black border border-gray-200 uppercase text-xs tracking-widest hover:bg-gray-50 transition-all shadow-xl flex items-center justify-center gap-3">
                         Rejoindre le Discord
                    </a>
                </div>
            </div>
        </section>

        <!-- SERVER STATUS -->
        <section class="py-12 md:py-16 bg-white border-b border-gray-100 px-6">
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="bg-gov-light p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between group">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-[10px] font-black text-gov-blue uppercase tracking-widest">Signal Serveur</span>
                            <div class="flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span class="text-[10px] font-black text-emerald-600 uppercase">Actif</span>
                            </div>
                        </div>
                        <div class="text-4xl md:text-5xl font-mono font-black text-gov-text tracking-tighter">${erlc.currentPlayers}<span class="text-gray-300 text-xl md:text-2xl">/${erlc.maxPlayers}</span></div>
                        <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">Population en ville</div>
                    </div>
                    <div class="bg-gov-light p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between group">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-[10px] font-black text-gov-blue uppercase tracking-widest">Poste Douanier</span>
                            <i data-lucide="timer" class="w-4 h-4 text-gray-400"></i>
                        </div>
                        <div class="text-4xl md:text-5xl font-mono font-black text-gov-text tracking-tighter">${erlc.queue?.length || 0}</div>
                        <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">Fiches en attente</div>
                    </div>
                </div>
                <div class="bg-gov-text text-white p-6 md:p-8 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col min-h-[150px]">
                    <div class="absolute top-0 right-0 p-4 opacity-10"><i data-lucide="siren" class="w-24 h-24"></i></div>
                    <div class="flex items-center gap-3 mb-6 relative z-10">
                        <div class="px-2 py-0.5 bg-gov-red text-white text-[8px] font-black uppercase tracking-widest rounded animate-pulse">Live Feed</div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Alertes L.A.</span>
                    </div>
                    <div class="flex-1 space-y-4 relative z-10 overflow-y-auto custom-scrollbar pr-2 max-h-[120px]">
                        ${heists.length > 0 ? heists.map(h => `
                            <div class="flex gap-4 items-start border-l-2 border-gov-red pl-4">
                                <div class="text-[10px] font-black uppercase text-gov-red tracking-tight italic">ALERTE : ${h.location || 'Localisation Inconnue'}</div>
                            </div>
                        `).join('') : `
                            <div class="text-center py-6 text-gray-500 italic text-xs">Aucun incident critique signalé.</div>
                        `}
                    </div>
                </div>
            </div>
        </section>

        <!-- STAFF -->
        <section class="py-12 md:py-24 bg-white border-b border-gray-100 px-6">
            <div class="max-w-6xl mx-auto text-center">
                <h2 class="text-2xl md:text-3xl font-black uppercase tracking-tighter italic mb-12 md:mb-16 underline decoration-gov-red decoration-4 underline-offset-8 text-gov-text">Corps Administratif</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
                    ${sortedStaff.map(s => `
                        <div class="group flex flex-col items-center">
                            <div class="relative mb-4 md:mb-6">
                                <img src="${s.avatar_url}" class="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-xl grayscale group-hover:grayscale-0 transition-all duration-500 object-cover">
                                ${state.adminIds.includes(s.id) ? `
                                    <div class="absolute -bottom-1 -right-1 bg-gov-blue text-white p-1 rounded-full shadow-lg border-2 border-white">
                                        <i data-lucide="shield" class="w-3 h-3"></i>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="font-black uppercase text-gov-text tracking-tighter text-xs md:text-sm">${s.username}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <footer class="py-12 px-6 border-t border-gray-100 bg-white">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center md:text-left">
                <span>&copy; 2025 TFRP • ÉTAT DE CALIFORNIE • PROPRIÉTÉ DE MATMAT</span>
                <div class="flex gap-8">
                    <a onclick="router('terms')" class="hover:text-gov-blue cursor-pointer transition-colors">CGU</a>
                    <a onclick="router('privacy')" class="hover:text-gov-blue cursor-pointer transition-colors">Confidentialité</a>
                </div>
            </div>
        </footer>
    </div>
    `;
};

export const AccessDeniedView = () => `
    <div class="flex-1 flex flex-col bg-white animate-in">
        <nav class="terminal-nav shrink-0">
            <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
            </div>
            <button onclick="actions.logout()" class="px-6 py-2 bg-gov-light text-gov-text font-black uppercase text-[10px] tracking-widest rounded-sm">Déconnexion</button>
        </nav>
        <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div class="w-20 h-20 md:w-24 md:h-24 bg-red-50 text-gov-red rounded-full flex items-center justify-center mb-8 shadow-xl">
                <i data-lucide="shield-off" class="w-10 h-10 md:w-12 md:h-12"></i>
            </div>
            <h2 class="text-3xl md:text-4xl font-black text-gov-text uppercase italic mb-4 tracking-tighter">Accès Non Autorisé</h2>
            <p class="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed font-medium italic text-sm md:text-base">
                Votre identité Discord n'est pas répertoriée sur nos serveurs. L'accès au Panel TFRP est strictement réservé aux membres de la communauté.
            </p>
            <a href="${CONFIG.INVITE_URL}" target="_blank" class="px-10 py-5 bg-gov-blue text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-black transition-all transform hover:scale-105">
                Rejoindre le Discord Officiel
            </a>
        </div>
    </div>
`;

export const DeletionPendingView = () => `
    <div class="flex-1 flex flex-col bg-white animate-in">
        <nav class="terminal-nav shrink-0">
            <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
            </div>
            <button onclick="actions.logout()" class="px-6 py-2 bg-gov-light text-gov-text font-black uppercase text-[10px] tracking-widest rounded-sm">Déconnexion</button>
        </nav>
        <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div class="w-20 h-20 md:w-24 md:h-24 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-8 shadow-xl animate-pulse">
                <i data-lucide="trash-2" class="w-10 h-10 md:w-12 md:h-12"></i>
            </div>
            <h2 class="text-3xl md:text-4xl font-black text-gov-text uppercase italic mb-4 tracking-tighter">Identité en cours de purge</h2>
            <p class="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed font-medium italic text-sm md:text-base">
                Vous avez demandé la suppression de vos données. Conformément au RGPD, vos accès sont suspendus durant la phase de latence de 72h.
            </p>
            <button onclick="actions.cancelDataDeletion()" class="px-10 py-5 bg-gov-text text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-black transition-all">
                Annuler la suppression
            </button>
        </div>
    </div>
`;
