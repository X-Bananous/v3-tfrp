import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

/**
 * VUE PRINCIPALE : LANDING PAGE V3
 */
export const LoginView = () => {
    const staff = state.landingStaff || [];
    const erlc = state.erlcData || { currentPlayers: 0, maxPlayers: 42, queue: [] };

    return `
    <div class="flex-1 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        <header class="w-full px-6 py-5 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-[100]">
            <div class="marianne-block uppercase font-black tracking-tight text-gov-text">
                <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase">Liberté • Égalité • Justice</div>
                <div class="text-lg leading-none uppercase">ÉTAT DE CALIFORNIE<br>LOS ANGELES</div>
            </div>
            <div class="flex items-center gap-4">
                ${state.user ? `
                    <button onclick="router('profile_hub')" class="bg-gov-blue text-white px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-900 transition-all shadow-lg">Espace Citoyen</button>
                ` : `
                    <button onclick="actions.login()" class="bg-[#5865F2] text-white px-6 py-2.5 rounded-xl flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-blue-900/10">
                        <i data-lucide="discord" class="w-4 h-4"></i> Connexion
                    </button>
                `}
            </div>
        </header>

        <section class="landing-section bg-gov-light border-b border-gray-200 py-24">
            <div class="max-w-4xl mx-auto text-center animate-in">
                <span class="inline-block px-4 py-1 bg-blue-100 text-gov-blue text-[10px] font-black uppercase tracking-[0.3em] mb-8 rounded-full border border-blue-200">Plateforme Roleplay Officielle</span>
                <h1 class="text-6xl md:text-8xl font-black text-gov-text tracking-tighter leading-none mb-8 uppercase italic">TEAM FRENCH<br><span class="text-gov-blue">ROLEPLAY.</span></h1>
                <div class="text-2xl font-black text-gray-400 uppercase tracking-widest mb-12 italic">Panel Administratif V3 Platinum</div>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button onclick="${state.user ? "router('profile_hub')" : "actions.login()"}" class="px-12 py-5 bg-gov-blue text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-black transition-all transform hover:scale-105 flex items-center justify-center gap-3 rounded-2xl">
                        <i data-lucide="discord" class="w-5 h-5"></i> Accéder au portail
                    </button>
                    <a href="${CONFIG.INVITE_URL}" target="_blank" class="px-12 py-5 bg-white text-gov-text font-black border border-gray-200 uppercase text-xs tracking-widest hover:bg-gray-50 transition-all shadow-xl flex items-center justify-center gap-3 rounded-2xl">Rejoindre Discord</a>
                </div>
            </div>
        </section>

        <section class="py-16 bg-white border-b border-gray-100">
            <div class="max-w-6xl mx-auto px-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-gov-light p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between group">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-[10px] font-black text-gov-blue uppercase tracking-widest">Signal Serveur</span>
                            <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span class="text-[10px] font-black text-emerald-600 uppercase">Live</span></div>
                        </div>
                        <div class="text-5xl font-mono font-black text-gov-text tracking-tighter">${erlc.currentPlayers}<span class="text-gray-300 text-2xl">/${erlc.maxPlayers}</span></div>
                        <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">Citoyens synchronisés</div>
                    </div>
                    <div class="bg-gov-text text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col">
                        <div class="flex items-center gap-3 mb-6 relative z-10">
                            <div class="px-2 py-0.5 bg-gov-red text-white text-[8px] font-black uppercase tracking-widest rounded animate-pulse">INFO V3</div>
                            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Système Unifié</span>
                        </div>
                        <p class="text-xs text-gray-400 font-medium leading-relaxed italic">Synchronisation totale des données entre le serveur de jeu et votre profil citoyen California V3.</p>
                    </div>
                </div>
            </div>
        </section>

        <footer class="py-12 px-6 border-t-4 border-gov-blue bg-white">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>&copy; 2025 TFRP • ÉTAT DE CALIFORNIE • V3 PLATINUM</span>
                <div class="flex gap-8">
                    <a onclick="router('terms')" class="hover:text-gov-blue cursor-pointer">CGU</a>
                    <a onclick="router('privacy')" class="hover:text-gov-blue cursor-pointer">Confidentialité</a>
                </div>
            </div>
        </footer>
    </div>
    `;
};

export const AccessDeniedView = () => {
    return `
    <div class="flex-1 flex items-center justify-center bg-gov-light p-6 animate-in">
        <div class="max-w-md w-full bg-white p-12 border border-gray-200 shadow-2xl text-center rounded-[40px]">
            <div class="w-24 h-24 bg-red-100 text-gov-red rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"><i data-lucide="shield-alert" class="w-12 h-12"></i></div>
            <h2 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter mb-4">Accès Restreint</h2>
            <p class="text-gray-500 mb-10 font-medium leading-relaxed">Veuillez rejoindre le serveur Discord TFRP officiel pour accéder aux services de l'État.</p>
            <a href="${CONFIG.INVITE_URL}" target="_blank" class="flex items-center justify-center gap-3 w-full py-5 bg-[#5865F2] text-white font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-xl rounded-2xl">Rejoindre Discord</a>
        </div>
    </div>
    `;
};

export const DeletionPendingView = () => {
    return `
    <div class="flex-1 flex items-center justify-center bg-[#050505] p-6 animate-in">
        <div class="max-w-lg w-full bg-white p-12 border-t-8 border-gov-red shadow-2xl text-center rounded-[40px]">
            <div class="w-20 h-20 bg-red-50 text-gov-red rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"><i data-lucide="trash-2" class="w-10 h-10"></i></div>
            <h2 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter mb-4">Purge V3 Active</h2>
            <p class="text-gray-500 mb-8 leading-relaxed font-medium">Une demande d'effacement définitif est en cours. Vos accès sont suspendus pour 72h.</p>
            <button onclick="actions.cancelDataDeletion()" class="w-full py-5 bg-gov-text text-white font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl mb-4 rounded-2xl">Annuler la suppression</button>
            <button onclick="actions.logout()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors">Déconnexion</button>
        </div>
    </div>
    `;
};