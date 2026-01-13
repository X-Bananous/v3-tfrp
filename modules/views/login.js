import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const LoginView = () => {
    const staff = state.landingStaff || [];
    const erlc = state.erlcData || { currentPlayers: 0, maxPlayers: 42, queue: [] };
    const heists = state.globalActiveHeists || [];

    const sortedStaff = [...staff].sort((a, b) => {
        const aIsAdmin = state.adminIds.includes(a.id);
        const bIsAdmin = state.adminIds.includes(b.id);
        return bIsAdmin - aIsAdmin;
    });

    return `
    <div class="flex-1 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        
        <!-- HEADER -->
        <header class="w-full px-6 py-5 flex justify-between items-center border-b border-gray-900 sticky top-0 bg-white/90 backdrop-blur-md z-[100]">
            <div class="marianne-block uppercase font-black tracking-tight text-gov-text">
                <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">Liberté • Égalité • Justice</div>
                <div class="text-lg leading-none">ÉTAT DE CALIFORNIE<br>LOS ANGELES</div>
            </div>
            <div class="flex items-center gap-4">
                ${state.user ? `
                    <button onclick="router('profile_hub')" class="bg-gov-blue text-white px-6 py-2.5 font-bold uppercase text-[10px] tracking-widest hover:bg-black transition-all border border-gray-900 rounded-none">Espace Citoyen</button>
                ` : `
                    <button onclick="actions.login()" class="bg-[#5865F2] text-white px-6 py-2.5 flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-all border border-gray-900 rounded-none">
                        <i data-lucide="discord" class="w-4 h-4"></i> Connexion Discord
                    </button>
                `}
            </div>
        </header>

        <!-- HERO (CENTERED & MINIMAL) -->
        <section class="landing-section bg-gov-light border-b border-gray-900 py-32">
            <div class="max-w-4xl mx-auto text-center animate-in">
                <span class="inline-block px-4 py-1 bg-white text-gov-blue text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-gray-900">CERFA-OS v6.5 • Portail Immigration</span>
                <h1 class="text-6xl md:text-8xl font-black text-gov-text tracking-tighter leading-none mb-8 uppercase italic">
                    TEAM FRENCH<br><span class="text-gov-blue">ROLEPLAY.</span>
                </h1>
                <div class="text-2xl font-black text-gray-400 uppercase tracking-widest mb-12 italic">Administration de Los Angeles</div>
                <p class="text-xl text-gray-600 mb-12 leading-relaxed font-medium max-w-2xl mx-auto italic">
                    Interface officielle pour le recensement citoyen, la gestion patrimoniale et l'accès aux services publics de l'État.
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button onclick="${state.user ? "router('profile_hub')" : "actions.login()"}" class="px-12 py-5 bg-gov-blue text-white font-black uppercase text-xs tracking-widest hover:bg-black transition-all border border-gray-900 rounded-none flex items-center justify-center gap-3">
                        <i data-lucide="discord" class="w-5 h-5"></i> Accéder au portail
                    </button>
                    <a href="${CONFIG.INVITE_URL}" target="_blank" class="px-12 py-5 bg-white text-gov-text font-black border border-gray-900 uppercase text-xs tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                         Rejoindre le Serveur
                    </a>
                </div>
            </div>
        </section>

        <!-- SERVER STATUS & LIVE NEWS (SIDE BY SIDE) -->
        <section class="py-20 bg-white border-b border-gray-900">
            <div class="max-w-6xl mx-auto px-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-900">
                    
                    <!-- Stats Card -->
                    <div class="p-12 border-b md:border-b-0 md:border-r border-gray-900 flex flex-col justify-between bg-gov-light">
                        <div>
                            <div class="flex justify-between items-center mb-10">
                                <span class="text-[10px] font-black text-gov-blue uppercase tracking-widest">Signal Serveur Live</span>
                                <div class="flex items-center gap-2">
                                    <span class="w-2.5 h-2.5 bg-emerald-500 animate-pulse"></span>
                                    <span class="text-[10px] font-black text-emerald-600 uppercase">Synchronisé</span>
                                </div>
                            </div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-7xl font-black text-gov-text tracking-tighter">${erlc.currentPlayers}</span>
                                <span class="text-3xl text-gray-400 font-bold">/ ${erlc.maxPlayers}</span>
                            </div>
                            <div class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-4">Citoyens présents en ville</div>
                        </div>
                        <div class="mt-12 pt-8 border-t border-gray-300 flex justify-between">
                            <div>
                                <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">File d'attente</div>
                                <div class="text-2xl font-black text-gov-text">${erlc.queue?.length || 0}</div>
                            </div>
                            <i data-lucide="timer" class="w-8 h-8 text-gray-300"></i>
                        </div>
                    </div>

                    <!-- Live News Card -->
                    <div class="bg-gov-text text-white p-12 flex flex-col">
                        <div class="flex items-center justify-between mb-10">
                            <div class="flex items-center gap-3">
                                <div class="px-3 py-1 bg-gov-red text-white text-[10px] font-black uppercase tracking-widest animate-pulse">FLASH INFO</div>
                                <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">Flux Départemental</span>
                            </div>
                            <i data-lucide="siren" class="w-6 h-6 text-gov-red"></i>
                        </div>
                        
                        <div class="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-4 max-h-[250px]">
                            ${heists.length > 0 ? heists.map(h => `
                                <div class="flex gap-6 items-start border-l-4 border-gov-red pl-6 py-2">
                                    <div>
                                        <div class="text-[10px] font-black uppercase text-gov-red tracking-[0.2em] mb-1 italic">Alerte Code 3</div>
                                        <div class="text-lg font-black leading-tight uppercase text-white tracking-tight italic">${h.location || 'Incident Localisé'}</div>
                                        <div class="text-[9px] text-gray-500 font-bold mt-1 uppercase tracking-widest">En cours de traitement par le LAPD</div>
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="flex flex-col items-center justify-center h-full text-center opacity-40">
                                    <i data-lucide="check-circle" class="w-12 h-12 mb-4 text-emerald-500"></i>
                                    <p class="text-sm font-black uppercase tracking-[0.3em]">Calme Plat à Los Angeles</p>
                                    <p class="text-[10px] mt-2 uppercase font-bold text-gray-600">Aucun incident majeur signalé</p>
                                </div>
                            `}
                        </div>

                        <div class="mt-12 pt-6 border-t border-white/10 text-[9px] text-gray-500 font-black uppercase tracking-widest flex justify-between">
                            <span>Dernière transmission: ${new Date().toLocaleTimeString()}</span>
                            <span>Système Central</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- STAFF -->
        <section class="landing-section bg-white py-32 border-b border-gray-900">
            <div class="max-w-6xl mx-auto text-center">
                <h2 class="text-4xl font-black uppercase tracking-tighter italic mb-20 underline decoration-gov-red decoration-4 underline-offset-8">Directoire de la Fondation</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16">
                    ${sortedStaff.map(s => `
                        <div class="group flex flex-col items-center">
                            <div class="relative mb-8">
                                <img src="${s.avatar_url}" class="w-32 h-32 border-4 border-gray-900 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:-translate-y-2">
                                ${state.adminIds.includes(s.id) ? `
                                    <div class="absolute -bottom-4 -right-4 bg-gov-blue text-white p-2 border-4 border-gray-900">
                                        <i data-lucide="shield" class="w-5 h-5"></i>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="font-black uppercase text-gov-text tracking-tighter text-xl italic">${s.username}</div>
                            <div class="text-[10px] font-black ${state.adminIds.includes(s.id) ? 'text-gov-red' : 'text-gov-blue'} uppercase tracking-widest mt-2">
                                ${state.adminIds.includes(s.id) ? 'CONSEILLER SUPÉRIEUR' : 'CADRE ADMINISTRATIF'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <footer class="py-16 px-6 bg-gov-text text-white">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-widest">
                <div class="flex flex-col items-center md:items-start">
                    <span class="mb-4">&copy; 2025 TFRP • ÉTAT DE CALIFORNIE • DIVISION L.A.</span>
                    <div class="marianne-block !border-white/20 scale-75 origin-left">
                        <div class="text-[8px] border-b border-white/20 pb-0.5 mb-1">Liberté • Égalité • Justice</div>
                        <div class="text-md">GOUVERNEMENT DE LOS ANGELES</div>
                    </div>
                </div>
                <div class="flex gap-10">
                    <a onclick="router('terms')" class="hover:text-gov-red transition-colors cursor-pointer">C.G.U.</a>
                    <a onclick="router('privacy')" class="hover:text-gov-red transition-colors cursor-pointer">Confidentialité</a>
                </div>
            </div>
        </footer>
    </div>
    `;
};

export const AccessDeniedView = () => {
    return `
    <div class="flex-1 flex items-center justify-center bg-gov-light p-6 animate-in">
        <div class="max-w-md w-full bg-white p-12 border-2 border-gray-900 text-center shadow-[16px_16px_0px_#161616]">
            <div class="w-24 h-24 bg-red-100 text-gov-red border-2 border-gray-900 flex items-center justify-center mx-auto mb-10">
                <i data-lucide="shield-alert" class="w-12 h-12"></i>
            </div>
            <h2 class="text-4xl font-black text-gov-text uppercase italic tracking-tighter mb-6">Accès Verrouillé</h2>
            <p class="text-gray-600 mb-12 leading-relaxed font-bold uppercase text-xs tracking-widest italic">L'affiliation au serveur Discord officiel est un pré-requis légal pour accéder au terminal citoyen.</p>
            
            <a href="${CONFIG.INVITE_URL}" target="_blank" class="flex items-center justify-center gap-3 w-full py-5 bg-[#5865F2] text-white font-black uppercase text-xs tracking-widest hover:bg-black transition-all border border-gray-900 mb-6">
                <i data-lucide="discord" class="w-5 h-5"></i> Rejoindre le Discord
            </a>
            <button onclick="actions.logout()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text transition-colors border-b border-gray-200 pb-1">
                Utiliser un autre compte
            </button>
        </div>
    </div>
    `;
};

export const DeletionPendingView = () => {
    const date = state.user?.deletion_requested_at ? new Date(state.user.deletion_requested_at) : null;
    const finalDate = date ? new Date(date.getTime() + 72 * 60 * 60 * 1000) : null;

    return `
    <div class="flex-1 flex items-center justify-center bg-[#161616] p-6 animate-in">
        <div class="max-w-lg w-full bg-white p-16 border-t-8 border-gov-red text-center">
            <div class="w-20 h-20 bg-red-50 text-gov-red border border-red-200 flex items-center justify-center mx-auto mb-10">
                <i data-lucide="trash-2" class="w-10 h-10"></i>
            </div>
            <h2 class="text-4xl font-black text-gov-text uppercase italic tracking-tighter mb-6">Procédure de Purge</h2>
            <p class="text-gray-500 mb-10 leading-relaxed font-bold uppercase text-xs tracking-widest italic">Conformément à l'exercice de vos droits RGPD, l'effacement définitif de vos données administratives est en cours.</p>
            
            <div class="bg-gray-100 p-8 border border-gray-300 mb-12">
                <div class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Exécution programmée le</div>
                <div class="text-2xl font-mono font-black text-gov-text tracking-tighter italic underline decoration-gov-red">${finalDate ? finalDate.toLocaleString() : '---'}</div>
            </div>

            <button onclick="actions.cancelDataDeletion()" class="w-full py-5 bg-gov-text text-white font-black uppercase text-xs tracking-widest hover:bg-black transition-all border border-gray-900 mb-6">
                Annuler la suppression
            </button>
            <button onclick="actions.logout()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors">
                Déconnexion de session
            </button>
        </div>
    </div>
    `;
};
