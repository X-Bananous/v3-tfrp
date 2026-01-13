
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const LoginView = () => {
    const activeHeists = state.globalActiveHeists || [];
    const tva = state.economyConfig?.tva_tax || 0;
    const gouvBank = state.gouvBank || 0;
    const staff = state.landingStaff || [];

    return `
    <div class="flex-1 flex flex-col bg-white animate-gov-in overflow-y-auto">
        
        <!-- HEADER RESPONSIVE -->
        <header class="w-full px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 bg-white shadow-md z-50">
            <div class="flex items-center gap-6 self-start md:self-center">
                <div class="marianne-block uppercase font-black tracking-tight text-gov-text">
                    <div class="text-[8px] md:text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">Liberté • Égalité • Roleplay</div>
                    <div class="text-sm md:text-lg leading-none">RÉPUBLIQUE<br>DE LOS ANGELES</div>
                </div>
            </div>

            <nav class="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                <a href="${CONFIG.INVITE_URL}" target="_blank" class="text-[10px] font-black text-gov-blue hover:underline uppercase tracking-widest">Discord</a>
                ${state.user ? `
                    <div class="flex items-center gap-3 bg-gov-light p-1 rounded-sm border border-gov-border">
                        <img src="${state.user.avatar}" class="w-6 h-6 rounded-sm grayscale">
                        <span class="text-[9px] font-black text-gov-text uppercase truncate max-w-[80px]">${state.user.username}</span>
                        <button onclick="actions.logout()" class="p-1.5 text-gov-red hover:bg-red-50 rounded-sm"><i data-lucide="log-out" class="w-3.5 h-3.5"></i></button>
                    </div>
                ` : `
                    <button onclick="actions.login()" class="bg-[#5865F2] text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:opacity-90 transition-all font-bold uppercase text-[9px] tracking-widest shadow-md">
                        <i data-lucide="discord" class="w-4 h-4"></i> S'identifier
                    </button>
                `}
            </nav>
        </header>

        <main class="w-full">
            <!-- HERO SECTION -->
            <section class="bg-gov-light py-12 md:py-24 px-6 md:px-12 border-b border-gov-border">
                <div class="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 md:gap-20">
                    <div class="flex-1 text-center lg:text-left">
                        <h1 class="text-4xl md:text-6xl font-black text-gov-text tracking-tighter leading-none mb-6 uppercase italic">
                            L'administration au service <span class="text-gov-blue">du Citoyen.</span>
                        </h1>
                        <p class="text-base md:text-lg text-gray-600 mb-10 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
                            Accédez à vos dossiers administratifs, gérez vos actifs et suivez l'actualité institutionnelle de la République de Los Angeles.
                        </p>
                        <div class="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                            <button onclick="${state.user ? "router('select')" : "actions.login()"}" class="px-8 py-4 bg-gov-blue text-white font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-900 transition-all">
                                Commencer les démarches
                            </button>
                            <a href="https://discord.com/channels/1279455759414857759/1445853998774226964" target="_blank" class="px-8 py-4 bg-white text-gov-text border-2 border-gov-text font-black uppercase text-xs tracking-widest hover:bg-gov-light transition-all">
                                Consulter les lois
                            </a>
                        </div>
                    </div>
                    <div class="hidden lg:flex flex-1 justify-center relative">
                        <div class="w-full max-w-sm aspect-square bg-white border border-gov-border shadow-2xl p-8 flex flex-col justify-center items-center text-center">
                            <div class="w-16 h-1.5 bg-gov-blue mb-6"></div>
                            <div class="text-3xl font-black text-gov-text uppercase italic mb-1 tracking-tighter">SÉCURITÉ</div>
                            <div class="text-3xl font-black text-gov-red uppercase italic mb-6 tracking-tighter">UNITÉ</div>
                            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-[0.4em]">Système Central v5.1</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- STATS & SITUATION GRID -->
            <section class="max-w-6xl mx-auto py-12 md:py-20 px-4 md:px-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    
                    <!-- Alertes Live -->
                    <div class="lg:col-span-2 space-y-8">
                        <div class="flex items-center justify-between border-b-2 border-gov-text pb-4">
                            <h2 class="text-lg md:text-xl font-black uppercase tracking-widest italic">Points de situation</h2>
                            <span class="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Direct
                            </span>
                        </div>
                        
                        <div class="space-y-4">
                        ${activeHeists.length > 0 ? activeHeists.map(h => `
                            <div class="gov-alert p-6 flex items-start gap-6 shadow-sm">
                                <i data-lucide="shield-alert" class="w-8 h-8 text-gov-red shrink-0"></i>
                                <div>
                                    <div class="text-[9px] font-black text-gov-red uppercase tracking-[0.2em] mb-1">Alerte Sécurité Publique</div>
                                    <h3 class="text-base font-black text-gov-text uppercase italic tracking-tight">${h.heist_type.replace(/_/g, ' ')}</h3>
                                    <p class="text-xs text-gray-600 mt-1 font-medium">Localisation : <span class="text-red-700 font-bold">${h.location || 'Secteur Inconnu'}</span>.</p>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="gov-info-box p-6 flex items-start gap-6 shadow-sm">
                                <i data-lucide="check-circle" class="w-8 h-8 text-gov-blue shrink-0"></i>
                                <div>
                                    <div class="text-[9px] font-black text-gov-blue uppercase tracking-[0.2em] mb-1">Stabilité Territoriale</div>
                                    <h3 class="text-base font-black text-gov-text uppercase italic tracking-tight">R.A.S - Ville Calme</h3>
                                    <p class="text-xs text-gray-600 mt-1 font-medium">Aucun incident majeur n'est répertorié par les services actuellement.</p>
                                </div>
                            </div>
                        `}
                        </div>
                    </div>

                    <!-- Economie -->
                    <div class="bg-gov-light p-6 md:p-8 border border-gov-border rounded-sm">
                        <h3 class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 pb-2 border-b border-gray-300 flex items-center gap-2">
                            <i data-lucide="line-chart" class="w-3 h-3"></i> Observatoire Économique
                        </h3>
                        <div class="space-y-8">
                            <div class="flex justify-between items-end border-b border-white pb-4">
                                <div>
                                    <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">TVA</div>
                                    <div class="text-3xl font-black text-gov-text">${tva}%</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Population</div>
                                    <div class="text-xl font-bold text-gov-text">${state.erlcData.currentPlayers || 0} / ${state.erlcData.maxPlayers || 42}</div>
                                </div>
                            </div>
                            <div>
                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Trésorerie Publique</div>
                                <div class="text-2xl font-black text-emerald-700 font-mono">$${gouvBank.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- STAFF LIST SECTION -->
            <section class="max-w-6xl mx-auto py-12 md:py-20 px-4 md:px-6 bg-white">
                <div class="text-center mb-12">
                    <h2 class="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-gov-text mb-2">Annuaire Administratif</h2>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Corps Constitués & Direction</p>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${staff.length > 0 ? staff.map(s => {
                        const isOnDuty = s.is_on_duty;
                        const isFounder = state.adminIds.includes(s.id);
                        return `
                        <div class="p-5 border border-gov-border rounded-sm bg-white hover:border-gov-blue transition-all group flex items-center gap-4">
                            <img src="${s.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'}" class="w-12 h-12 rounded-sm grayscale group-hover:grayscale-0 transition-all border border-gov-border">
                            <div class="min-w-0">
                                <div class="font-black text-gov-text uppercase text-sm truncate">${s.username}</div>
                                <div class="flex items-center gap-2">
                                    <span class="text-[8px] font-black uppercase ${isFounder ? 'text-gov-red' : 'text-gov-blue'} tracking-widest">
                                        ${isFounder ? 'Fondation' : 'Haut Staff'}
                                    </span>
                                    <span class="w-1 h-1 rounded-full ${isOnDuty ? 'bg-emerald-500' : 'bg-gray-300'}"></span>
                                </div>
                            </div>
                        </div>
                        `;
                    }).join('') : '<div class="col-span-full py-10 text-center text-gray-400 italic text-xs">Aucun personnel recensé actuellement.</div>'}
                </div>
            </section>

            <!-- CREDITS & PARTENAIRES -->
            <section class="w-full bg-gov-light py-16 px-6 md:px-12 border-t border-gov-border">
                <div class="max-w-6xl mx-auto text-center">
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-12">Directoire du Projet</div>
                    <div class="flex flex-wrap justify-center gap-12 md:gap-24">
                        <div class="flex flex-col items-center">
                            <div class="text-xl md:text-2xl font-black text-gov-text uppercase tracking-tighter mb-1">ZEKYO</div>
                            <div class="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Fondation • Direction</div>
                        </div>
                        <div class="flex flex-col items-center">
                            <div class="text-xl md:text-2xl font-black text-gov-blue uppercase tracking-tighter mb-1">MATMAT</div>
                            <div class="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Lead Développement</div>
                        </div>
                        <div class="flex flex-col items-center">
                            <div class="text-xl md:text-2xl font-black text-gov-red uppercase tracking-tighter mb-1">CAPOUN6</div>
                            <div class="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Gestion Communauté</div>
                        </div>
                    </div>
                    
                    <div class="mt-20 pt-12 border-t border-gray-200">
                         <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Infrastructures Partenaires</div>
                         <div class="flex flex-wrap justify-center items-center gap-10 grayscale opacity-40">
                             <span class="text-2xl font-black tracking-tighter">SUPABASE</span>
                             <span class="text-2xl font-black italic tracking-tighter">GITHUB</span>
                             <span class="text-2xl font-black tracking-tighter">LUCIDE</span>
                         </div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="bg-white border-t-4 border-gov-blue py-12 px-6">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div class="marianne-block uppercase font-black tracking-tight text-gov-text">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1">Liberté • Égalité • Roleplay</div>
                    <div class="text-md leading-none">RÉPUBLIQUE<br>DE LOS ANGELES</div>
                </div>
                <div class="grid grid-cols-2 gap-16 md:gap-24">
                    <div class="space-y-4">
                        <h4 class="text-xs font-black uppercase tracking-widest">Accès Rapides</h4>
                        <ul class="text-[10px] space-y-3 font-bold text-gray-600 uppercase tracking-wide">
                            <li><a href="${CONFIG.INVITE_URL}" target="_blank" class="hover:text-gov-blue">Support</a></li>
                            <li><a onclick="router('terms')" class="cursor-pointer hover:text-gov-blue">CGU</a></li>
                        </ul>
                    </div>
                    <div class="space-y-4">
                        <h4 class="text-xs font-black uppercase tracking-widest">Informations</h4>
                        <div class="text-[10px] text-gray-500 font-bold">
                            &copy; 2025 Team French RolePlay<br>
                            Version 5.1.0 Stable
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
    `;
};

export const AccessDeniedView = () => `
    <div class="min-h-screen flex items-center justify-center p-6 bg-gov-light text-center">
        <div class="bg-white max-w-lg w-full p-8 md:p-12 border-t-8 border-gov-red shadow-2xl">
            <div class="w-16 h-16 bg-red-50 text-gov-red rounded-full flex items-center justify-center mx-auto mb-8"><i data-lucide="lock" class="w-8 h-8"></i></div>
            <h2 class="text-2xl font-black text-gov-text mb-4 uppercase tracking-tighter italic">Accès Interdit</h2>
            <p class="text-gray-600 mb-10 leading-relaxed font-medium">Votre compte n'est pas identifié sur le serveur officiel. L'accès est strictement réservé aux citoyens.</p>
            <div class="flex flex-col gap-4">
                <a href="${CONFIG.INVITE_URL}" target="_blank" class="py-4 bg-gov-blue text-white font-black text-xs uppercase tracking-widest hover:opacity-90">Rejoindre le Discord</a>
                <button onclick="actions.logout()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text">Retour</button>
            </div>
        </div>
    </div>
`;

export const DeletionPendingView = () => `
    <div class="min-h-screen flex items-center justify-center p-6 bg-gov-light text-center">
        <div class="bg-white max-w-lg w-full p-8 md:p-12 border-t-8 border-orange-500 shadow-2xl">
            <div class="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-8"><i data-lucide="trash-2" class="w-8 h-8"></i></div>
            <h2 class="text-2xl font-black text-gov-text mb-4 uppercase tracking-tighter italic">Compte en sursis</h2>
            <p class="text-gray-600 mb-10 leading-relaxed font-medium">Demande de suppression définitive active (72h).</p>
            <div class="flex flex-col gap-4">
                <button onclick="actions.cancelDataDeletion()" class="py-4 bg-gov-text text-white font-black text-xs uppercase tracking-widest hover:bg-black shadow-lg">Annuler la procédure</button>
                <button onclick="actions.logout()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Déconnexion</button>
            </div>
        </div>
    </div>
`;
