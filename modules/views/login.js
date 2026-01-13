
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const LoginView = () => {
    const activeHeists = state.globalActiveHeists || [];
    const tva = state.economyConfig?.tva_tax || 0;
    const gouvBank = state.gouvBank || 0;

    return `
    <div class="flex-1 flex flex-col gov-landing min-h-full font-sans animate-gov-in">
        
        <!-- HEADER -->
        <header class="gov-header w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 bg-white shadow-sm">
            <div class="flex items-center gap-6">
                <div class="marianne-block uppercase font-black tracking-tight text-[#161616]">
                    <div class="text-[10px] tracking-widest border-b-2 border-red-600 pb-0.5 mb-1 text-red-600">Liberté • Égalité • Roleplay</div>
                    <div class="text-lg leading-none">RÉPUBLIQUE<br>DE LOS ANGELES</div>
                </div>
                <div class="hidden lg:block w-px h-10 bg-gray-200"></div>
                <div class="hidden lg:block">
                    <div class="font-bold text-sm text-gray-500 uppercase tracking-widest">Le portail officiel de l'administration</div>
                </div>
            </div>

            <nav class="flex flex-wrap justify-center items-center gap-6">
                <a href="${CONFIG.INVITE_URL}" target="_blank" class="text-xs font-bold text-[#000091] hover:underline uppercase tracking-widest">Rejoindre Discord</a>
                ${state.user ? `
                    <div class="flex items-center gap-3 bg-[#F6F6F6] p-1.5 pl-4 rounded-sm border border-gray-200">
                        <span class="text-[10px] font-black text-[#161616] uppercase tracking-widest">${state.user.username}</span>
                        <img src="${state.user.avatar}" class="w-7 h-7 rounded-sm grayscale">
                        <button onclick="actions.logout()" class="p-2 text-red-600 hover:bg-red-50 transition-colors"><i data-lucide="log-out" class="w-4 h-4"></i></button>
                    </div>
                ` : `
                    <button onclick="actions.login()" class="gov-btn-discord px-6 py-2.5 rounded-sm flex items-center gap-3 hover:opacity-90 transition-all font-bold uppercase text-[10px] tracking-widest shadow-md">
                        <i data-lucide="discord" class="w-4 h-4"></i> S'identifier avec Discord
                    </button>
                `}
            </nav>
        </header>

        <main class="flex-1">
            <!-- HERO SECTION -->
            <section class="bg-[#F6F6F6] py-20 px-6 border-b border-gray-200">
                <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h1 class="text-5xl md:text-6xl font-black text-[#161616] tracking-tighter leading-none mb-8 uppercase italic">
                            L'administration au service <span class="text-[#000091]">du Citoyen.</span>
                        </h1>
                        <p class="text-lg text-gray-600 mb-10 leading-relaxed font-medium">
                            Accédez à vos dossiers administratifs, gérez vos entreprises et suivez l'actualité de la République de Los Angeles en temps réel.
                        </p>
                        <div class="flex flex-wrap gap-4">
                            <button onclick="${state.user ? "router('select')" : "actions.login()"}" class="px-8 py-4 bg-[#000091] text-white font-black uppercase text-xs tracking-widest shadow-xl hover:bg-[#000070] transition-all">
                                Commencer les démarches
                            </button>
                            <a href="https://discord.com/channels/1279455759414857759/1445853998774226964" target="_blank" class="px-8 py-4 bg-white text-[#161616] border-2 border-[#161616] font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all">
                                Consulter les lois
                            </a>
                        </div>
                    </div>
                    <div class="hidden lg:flex justify-center relative">
                        <div class="w-full max-w-md aspect-square bg-white border border-gray-200 shadow-2xl p-8 flex flex-col justify-center items-center text-center">
                            <div class="w-24 h-2 bg-[#000091] mb-6"></div>
                            <div class="text-4xl font-black text-[#161616] uppercase italic mb-2 tracking-tighter">SÉCURITÉ</div>
                            <div class="text-4xl font-black text-red-600 uppercase italic mb-6 tracking-tighter">UNITÉ</div>
                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Protocole TFRP v5.0</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- SITUATION & STATS GRID -->
            <section class="max-w-6xl mx-auto py-20 px-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Situation Live -->
                    <div class="lg:col-span-2 space-y-8">
                        <div class="flex items-center justify-between border-b-2 border-[#161616] pb-4">
                            <h2 class="text-xl font-black uppercase tracking-widest">Signalement en cours</h2>
                            <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Transmission direct
                            </span>
                        </div>
                        
                        ${activeHeists.length > 0 ? activeHeists.map(h => `
                            <div class="gov-alert p-8 flex items-start gap-8 shadow-sm">
                                <i data-lucide="shield-alert" class="w-10 h-10 text-[#E1000F] shrink-0"></i>
                                <div>
                                    <div class="text-[10px] font-black text-[#E1000F] uppercase tracking-[0.2em] mb-1">Alerte Sécurité Publique</div>
                                    <h3 class="text-xl font-black text-[#161616] uppercase italic tracking-tight">${h.heist_type.replace('_', ' ')} en cours</h3>
                                    <p class="text-sm text-gray-600 mt-2 font-medium">Localisation : <span class="text-red-700">${h.location || 'Secteur Inconnu'}</span>. Évitez la zone.</p>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="gov-info-box p-8 flex items-start gap-8 shadow-sm">
                                <i data-lucide="check-circle" class="w-10 h-10 text-[#000091] shrink-0"></i>
                                <div>
                                    <div class="text-[10px] font-black text-[#000091] uppercase tracking-[0.2em] mb-1">Situation Territoriale</div>
                                    <h3 class="text-xl font-black text-[#161616] uppercase italic tracking-tight">R.A.S - Métropole Calme</h3>
                                    <p class="text-sm text-gray-600 mt-2 font-medium">Aucun incident majeur n'est répertorié par les services actuellement.</p>
                                </div>
                            </div>
                        `}
                    </div>

                    <!-- Economie -->
                    <div class="bg-[#F6F6F6] p-8 border border-gray-200">
                        <h3 class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 pb-2 border-b border-gray-300">Observatoire Économique</h3>
                        <div class="space-y-10">
                            <div>
                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">TVA Municipale</div>
                                <div class="text-4xl font-black text-[#161616]">${tva}%</div>
                            </div>
                            <div>
                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Trésorerie d'État</div>
                                <div class="text-3xl font-black text-emerald-700">$${gouvBank.toLocaleString()}</div>
                            </div>
                            <div>
                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Population Active</div>
                                <div class="text-3xl font-black text-[#161616]">${state.erlcData.currentPlayers || 0} / ${state.erlcData.maxPlayers || 42}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- CREDITS SECTION (Nouveau) -->
            <section class="max-w-6xl mx-auto py-20 px-6 border-t border-gray-100 text-center">
                <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-12">Directoire du Projet</div>
                <div class="flex flex-wrap justify-center gap-12 md:gap-24 opacity-70">
                    <div class="flex flex-col items-center">
                        <div class="text-2xl font-black text-[#161616] uppercase tracking-tighter mb-1">ZEKYO</div>
                        <div class="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Fondation • Direction</div>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="text-2xl font-black text-[#000091] uppercase tracking-tighter mb-1">MATMAT</div>
                        <div class="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Développement • Lead Tech</div>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="text-2xl font-black text-[#E1000F] uppercase tracking-tighter mb-1">CAPOUN6</div>
                        <div class="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Gestion • Communauté</div>
                    </div>
                </div>
                <p class="mt-16 text-[9px] text-gray-400 font-mono uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                    TFRP Panel est une infrastructure technique sécurisée développée exclusivement pour le serveur Liberty County (Roblox). Toute reproduction non autorisée est interdite.
                </p>
            </section>
        </main>

        <footer class="bg-white border-t-4 border-[#000091] py-16 px-6">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div class="space-y-6">
                    <div class="marianne-block uppercase font-black tracking-tight text-[#161616]">
                        <div class="text-[10px] tracking-widest border-b-2 border-red-600 pb-0.5 mb-1">Liberté • Égalité • Roleplay</div>
                        <div class="text-lg leading-none">RÉPUBLIQUE<br>DE LOS ANGELES</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-20">
                    <div class="space-y-4">
                        <h4 class="text-sm font-black uppercase tracking-widest">Liens Utiles</h4>
                        <ul class="text-xs space-y-3 font-bold text-gray-600 uppercase tracking-wide">
                            <li><a href="${CONFIG.INVITE_URL}" target="_blank" class="hover:text-[#000091]">Support Discord</a></li>
                            <li><a onclick="router('terms')" class="cursor-pointer hover:text-[#000091]">Conditions</a></li>
                        </ul>
                    </div>
                    <div class="space-y-4">
                        <h4 class="text-sm font-black uppercase tracking-widest">Partenaires</h4>
                        <div class="flex items-center gap-6">
                            <span class="font-black text-xl tracking-tighter text-gray-300">SUPABASE</span>
                            <span class="font-black text-xl tracking-tighter text-gray-300 italic">GITHUB</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-100 flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                <span>&copy; 2025 Team French RolePlay • République de Los Angeles</span>
                <span>Version 5.0.0 Stable</span>
            </div>
        </footer>
    </div>
    `;
};

export const AccessDeniedView = () => `
    <div class="flex-1 flex items-center justify-center p-8 bg-[#F6F6F6] text-center h-full gov-landing">
        <div class="bg-white max-w-lg p-12 border-t-8 border-red-600 shadow-2xl">
            <div class="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8"><i data-lucide="lock" class="w-8 h-8"></i></div>
            <h2 class="text-2xl font-black text-[#161616] mb-4 uppercase tracking-tighter italic">Accès Interdit</h2>
            <p class="text-gray-600 mb-10 leading-relaxed font-medium">Votre compte n'est pas répertorié sur le serveur officiel. L'accès est strictement réservé aux citoyens accrédités.</p>
            <div class="flex flex-col gap-4">
                <a href="${CONFIG.INVITE_URL}" target="_blank" class="py-4 bg-[#000091] text-white font-black text-xs uppercase tracking-widest hover:opacity-90">Rejoindre le Discord Officiel</a>
                <button onclick="actions.logout()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#161616]">Retour à l'accueil</button>
            </div>
        </div>
    </div>
`;

export const DeletionPendingView = () => `
    <div class="flex-1 flex items-center justify-center p-8 bg-[#F6F6F6] text-center h-full gov-landing">
        <div class="bg-white max-w-lg p-12 border-t-8 border-orange-500 shadow-2xl">
            <div class="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-8"><i data-lucide="trash-2" class="w-8 h-8"></i></div>
            <h2 class="text-2xl font-black text-[#161616] mb-4 uppercase tracking-tighter italic">Compte en sursis</h2>
            <p class="text-gray-600 mb-10 leading-relaxed font-medium">Conformément à votre demande, vos données citoyennes sont marquées pour une suppression définitive sous 72h.</p>
            <div class="flex flex-col gap-4">
                <button onclick="actions.cancelDataDeletion()" class="py-4 bg-[#161616] text-white font-black text-xs uppercase tracking-widest hover:bg-black shadow-lg">Annuler la procédure de purge</button>
                <button onclick="actions.logout()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#161616]">Déconnexion temporaire</button>
            </div>
        </div>
    </div>
`;
