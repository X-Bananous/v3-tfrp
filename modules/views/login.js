
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const LoginView = () => {
    const activeHeists = state.globalActiveHeists || [];
    const tva = state.economyConfig?.tva_tax || 0;
    const gouvBank = state.gouvBank || 0;

    return `
    <div class="flex-1 flex flex-col gov-landing min-h-full font-sans animate-gov-in">
        
        <!-- HEADER GOUVERNEMENTAL -->
        <header class="gov-header w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0">
            <div class="flex items-center gap-6">
                <!-- Bloc Marianne TFRP -->
                <div class="marianne-block uppercase font-black tracking-tight text-[#161616]">
                    <div class="text-[10px] tracking-widest border-b-2 border-red-600 pb-0.5 mb-1">Liberté • Égalité • Roleplay</div>
                    <div class="text-lg leading-none">RÉPUBLIQUE<br>DE LOS ANGELES</div>
                </div>
                <div class="hidden lg:block w-px h-10 bg-gray-200"></div>
                <div class="hidden lg:block">
                    <div class="font-bold text-sm text-gray-500 uppercase tracking-widest">Le portail officiel de l'administration</div>
                </div>
            </div>

            <nav class="flex flex-wrap justify-center items-center gap-4 md:gap-8">
                <a href="https://discord.com/channels/1279455759414857759/1445853998774226964" target="_blank" class="text-xs font-bold text-gray-700 hover:text-[#000091] transition-colors uppercase tracking-wide border-b-2 border-transparent hover:border-[#000091] pb-1">Règlement RP</a>
                <a href="https://discord.com/channels/1279455759414857759/1280129294412021813" target="_blank" class="text-xs font-bold text-gray-700 hover:text-[#000091] transition-colors uppercase tracking-wide border-b-2 border-transparent hover:border-[#000091] pb-1">Règlement Discord</a>
                
                ${state.user ? `
                    <div class="flex items-center gap-3 bg-gray-100 p-1.5 pl-4 rounded-full border border-gray-200 shadow-sm">
                        <span class="text-[10px] font-black text-gray-600 uppercase tracking-widest">${state.user.username}</span>
                        <img src="${state.user.avatar}" class="w-7 h-7 rounded-full border border-white shadow-sm">
                        <button onclick="actions.logout()" class="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"><i data-lucide="log-out" class="w-4 h-4"></i></button>
                    </div>
                ` : `
                    <button onclick="actions.login()" class="gov-btn-discord px-5 py-2 rounded-sm flex items-center gap-3 hover:opacity-90 transition-all font-bold uppercase text-[10px] tracking-widest">
                        <i data-lucide="discord" class="w-4 h-4"></i> S'identifier
                    </button>
                `}
            </nav>
        </header>

        <!-- MAIN CONTENT -->
        <main class="flex-1">
            
            <!-- HERO SECTION -->
            <section class="bg-[#F6F6F6] py-16 md:py-24 px-6 border-b border-gray-200">
                <div class="max-w-6xl mx-auto">
                    <div class="max-w-3xl">
                        <h1 class="text-4xl md:text-5xl font-black text-[#161616] tracking-tight leading-tight mb-6">
                            L'essentiel pour vos démarches citoyennes à Los Angeles.
                        </h1>
                        <p class="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                            Accédez à vos dossiers administratifs, gérez votre patrimoine, vos entreprises et suivez l'actualité institutionnelle en temps réel.
                        </p>
                        
                        <!-- Search Bar Style DSFR -->
                        <div class="relative group shadow-sm">
                            <input type="text" placeholder="Rechercher une démarche, un métier, un citoyen..." 
                                class="w-full p-4 pr-16 bg-white border-b-2 border-gray-300 focus:border-[#000091] outline-none text-gray-900 transition-all font-medium text-lg">
                            <button class="absolute right-0 top-0 h-full px-6 bg-[#000091] text-white hover:bg-[#000070] transition-colors">
                                <i data-lucide="search" class="w-6 h-6"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- LIVE ALERTS & STATS -->
            <section class="max-w-6xl mx-auto py-12 px-6">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    <!-- Left: Situation en direct -->
                    <div class="lg:col-span-8 space-y-10">
                        <div class="flex items-center justify-between border-b border-gray-200 pb-4">
                            <h2 class="text-xl font-black uppercase tracking-widest text-[#161616]">Points de situation en direct</h2>
                            <span class="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest animate-pulse">
                                <span class="w-2 h-2 bg-emerald-500 rounded-full"></span> Transmission Live
                            </span>
                        </div>
                        
                        ${activeHeists.length > 0 ? activeHeists.map(h => `
                            <div class="gov-alert p-6 flex items-start gap-6 animate-pulse-slow shadow-sm">
                                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-[#E1000F] shrink-0 border border-red-200">
                                    <i data-lucide="shield-alert" class="w-6 h-6"></i>
                                </div>
                                <div>
                                    <div class="text-[10px] font-black text-[#E1000F] uppercase tracking-[0.2em] mb-1">Alerte Sécurité Publique</div>
                                    <h3 class="text-lg font-bold text-gray-900 uppercase italic tracking-tight">Signalement : ${h.heist_type.toUpperCase()} en cours</h3>
                                    <p class="text-sm text-gray-600 font-medium mt-1">Secteur : <span class="text-red-700 font-bold">${h.location || 'Localisation inconnue'}</span>. Les forces de l'ordre sont mobilisées. Évitez le périmètre.</p>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="gov-info-box p-6 flex items-start gap-6 shadow-sm">
                                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#000091] shrink-0 border border-blue-200">
                                    <i data-lucide="check" class="w-6 h-6"></i>
                                </div>
                                <div>
                                    <div class="text-[10px] font-black text-[#000091] uppercase tracking-[0.2em] mb-1">Situation Territoriale</div>
                                    <h3 class="text-lg font-bold text-gray-900 uppercase italic tracking-tight">Calme sur l'ensemble de la métropole</h3>
                                    <p class="text-sm text-gray-600 font-medium mt-1">Aucun incident majeur n'est répertorié par les services de secours actuellement.</p>
                                </div>
                            </div>
                        `}

                        <!-- Quick Access Cards -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <div onclick="${state.user ? "router('select')" : "actions.login()"}" class="gov-card p-8 cursor-pointer flex flex-col h-full shadow-sm group">
                                <div class="w-12 h-12 bg-blue-50 text-[#000091] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#000091] group-hover:text-white transition-colors shadow-inner">
                                    <i data-lucide="user-search" class="w-6 h-6"></i>
                                </div>
                                <h4 class="text-xl font-bold text-gray-900 mb-3 uppercase italic tracking-tight">Recensement Citoyen</h4>
                                <p class="text-sm text-gray-500 leading-relaxed mb-6 font-medium">Enregistrez votre dossier d'immigration ou consultez vos fiches citoyennes actives.</p>
                                <div class="mt-auto text-[#000091] text-xs font-black uppercase tracking-widest flex items-center gap-2">Débuter la démarche <i data-lucide="arrow-right" class="w-4 h-4"></i></div>
                            </div>
                            
                            <a href="https://discord.com/channels/1279455759414857759/1445853998774226964" target="_blank" class="gov-card p-8 flex flex-col h-full shadow-sm group">
                                <div class="w-12 h-12 bg-blue-50 text-[#000091] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#000091] group-hover:text-white transition-colors shadow-inner">
                                    <i data-lucide="book" class="w-6 h-6"></i>
                                </div>
                                <h4 class="text-xl font-bold text-gray-900 mb-3 uppercase italic tracking-tight">Lois & Règlements</h4>
                                <p class="text-sm text-gray-500 leading-relaxed mb-6 font-medium">Consultez le cadre juridique officiel régissant la vie au sein de la République de Los Angeles.</p>
                                <div class="mt-auto text-[#000091] text-xs font-black uppercase tracking-widest flex items-center gap-2">Consulter les décrets <i data-lucide="arrow-right" class="w-4 h-4"></i></div>
                            </a>
                        </div>
                    </div>

                    <!-- Right: Economy & Auth -->
                    <div class="lg:col-span-4 space-y-8">
                        
                        <!-- Economie Box -->
                        <div class="bg-white border border-gray-200 p-8 shadow-sm">
                            <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-100 pb-3">Observatoire Économique</h3>
                            <div class="space-y-6">
                                <div class="flex justify-between items-end border-b border-gray-50 pb-4">
                                    <div>
                                        <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">TVA Municipale</div>
                                        <div class="text-2xl font-black text-gray-900">${tva}%</div>
                                    </div>
                                    <span class="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black uppercase tracking-widest mb-1">Stable</span>
                                </div>
                                <div class="flex justify-between items-end border-b border-gray-50 pb-4">
                                    <div>
                                        <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Trésorerie d'État</div>
                                        <div class="text-2xl font-black text-gray-900">$${gouvBank.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div class="flex justify-between items-end">
                                    <div>
                                        <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Masse Monétaire</div>
                                        <div class="text-2xl font-black text-gray-900">$${(state.serverStats?.totalMoney || 0).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-8 pt-6 border-t border-gray-100">
                                <p class="text-[10px] text-gray-400 italic leading-relaxed">Les données économiques sont actualisées selon les flux de transactions réels du serveur Liberty County.</p>
                            </div>
                        </div>

                        <!-- Login Promotion -->
                        <div class="bg-[#000091] p-8 text-white shadow-xl">
                            <h3 class="text-sm font-black uppercase tracking-widest mb-4">Espace Personnel</h3>
                            <p class="text-xs text-blue-200 leading-relaxed mb-8 font-medium">Connectez-vous pour accéder à votre compte bancaire, vos fiches de paie et votre inventaire certifié.</p>
                            ${state.user ? `
                                <button onclick="router('select')" class="w-full py-4 bg-white text-[#000091] font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                                    Entrer dans l'espace <i data-lucide="lock-open" class="w-4 h-4"></i>
                                </button>
                            ` : `
                                <button onclick="actions.login()" class="w-full py-4 bg-white text-[#000091] font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-100 transition-all">
                                    S'authentifier
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- FOOTER GOUVERNEMENTAL -->
        <footer class="bg-white border-t-4 border-[#000091] py-16 px-6">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div class="space-y-6">
                    <div class="marianne-block uppercase font-black tracking-tight text-[#161616]">
                        <div class="text-[10px] tracking-widest border-b-2 border-red-600 pb-0.5 mb-1">Liberté • Égalité • Roleplay</div>
                        <div class="text-lg leading-none">RÉPUBLIQUE<br>DE LOS ANGELES</div>
                    </div>
                    <p class="text-xs text-gray-500 max-w-xs leading-relaxed font-medium">
                        Le panel TFRP est l'outil centralisé de gestion communautaire pour les services publics et l'économie du serveur Liberty County.
                    </p>
                </div>
                
                <div class="grid grid-cols-2 gap-12">
                    <div class="space-y-4">
                        <h4 class="text-sm font-black uppercase tracking-widest text-[#161616]">Navigation</h4>
                        <ul class="text-xs space-y-3 font-bold text-gray-600">
                            <li><a href="#" class="hover:underline hover:text-[#000091]">Accueil</a></li>
                            <li><a href="https://discord.gg/eBU7KKKGD5" target="_blank" class="hover:underline hover:text-[#000091]">Discord Officiel</a></li>
                            <li><a onclick="router('select')" class="hover:underline hover:text-[#000091] cursor-pointer">Mon Espace</a></li>
                        </ul>
                    </div>
                    <div class="space-y-4">
                        <h4 class="text-sm font-black uppercase tracking-widest text-[#161616]">Légal</h4>
                        <ul class="text-xs space-y-3 font-bold text-gray-600">
                            <li><a onclick="router('terms')" class="hover:underline cursor-pointer">Conditions d'Utilisation</a></li>
                            <li><a onclick="router('privacy')" class="hover:underline cursor-pointer">Confidentialité</a></li>
                            <li><a href="#" class="hover:underline">Mentions Légales</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div class="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">&copy; 2025 Team French RolePlay • Développé par MatMat</div>
                <div class="flex gap-6">
                    <a href="${CONFIG.INVITE_URL}" target="_blank" class="text-gray-400 hover:text-[#000091] transition-all"><i data-lucide="discord" class="w-5 h-5"></i></a>
                    <a href="#" class="text-gray-400 hover:text-[#000091] transition-all"><i data-lucide="github" class="w-5 h-5"></i></a>
                </div>
            </div>
        </footer>
    </div>
    `;
};

export const AccessDeniedView = () => `
    <div class="flex-1 flex items-center justify-center p-8 bg-[#f6f6f6] text-center animate-gov-in h-full gov-landing">
        <div class="bg-white max-w-lg p-12 border-t-8 border-[#E1000F] shadow-2xl relative overflow-hidden">
            <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-white">
                <i data-lucide="lock" class="w-8 h-8"></i>
            </div>
            <h2 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Accès Interdit</h2>
            <p class="text-gray-600 mb-10 leading-relaxed font-medium">Votre compte Discord n'est pas répertorié sur le serveur officiel Team French RolePlay. L'accès aux services de l'administration est réservé aux membres de la communauté.</p>
            <div class="flex flex-col gap-4">
                <a href="${CONFIG.INVITE_URL}" target="_blank" class="w-full py-4 bg-[#000091] text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Rejoindre la communauté</a>
                <button onclick="actions.logout()" class="text-xs font-bold text-gray-400 uppercase hover:text-[#000091] transition-colors">Retour à l'accueil</button>
            </div>
        </div>
    </div>
`;

export const DeletionPendingView = () => {
    const u = state.user;
    const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
    let timeRemainingStr = "Imminente";
    if (deletionDate) {
        const expiry = new Date(deletionDate.getTime() + (3 * 24 * 60 * 60 * 1000));
        const diff = expiry - new Date();
        if (diff > 0) {
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            timeRemainingStr = `${d}j ${h}h`;
        }
    }

    return `
    <div class="flex-1 flex items-center justify-center p-8 bg-[#f6f6f6] text-center animate-gov-in h-full gov-landing">
        <div class="bg-white max-w-lg p-12 border-t-8 border-orange-500 shadow-2xl relative overflow-hidden">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 text-orange-600">
                <i data-lucide="trash" class="w-8 h-8"></i>
            </div>
            <h2 class="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Compte en cours de purge</h2>
            <p class="text-gray-500 mb-8 leading-relaxed font-medium">Conformément à votre demande, vos données seront effacées définitivement dans :</p>
            <div class="bg-gray-100 p-6 mb-8">
                <div class="text-4xl font-mono font-black text-gray-900">${timeRemainingStr}</div>
            </div>
            <div class="flex flex-col gap-4">
                <button onclick="actions.cancelDataDeletion()" class="w-full py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl">ANNULER LA PROCÉDURE</button>
                <button onclick="actions.logout()" class="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#000091]">Déconnexion</button>
            </div>
        </div>
    </div>
    `;
};
