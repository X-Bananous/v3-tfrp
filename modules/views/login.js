import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

/**
 * VUE PRINCIPALE : LANDING PAGE
 */
export const LoginView = () => {
    const staff = state.landingStaff || [];
    // Tri des staffs pour mettre les membres de la fondation en premier
    const sortedStaff = [...staff].sort((a, b) => {
        const aIsAdmin = state.adminIds.includes(a.id);
        const bIsAdmin = state.adminIds.includes(b.id);
        return bIsAdmin - aIsAdmin;
    });

    return `
    <div class="flex-1 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        
        <!-- HEADER -->
        <header class="w-full px-6 py-5 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-[100]">
            <div class="marianne-block uppercase font-black tracking-tight text-gov-text">
                <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">Liberté • Égalité • Justice</div>
                <div class="text-lg leading-none">ÉTAT DE CALIFORNIE<br>LOS ANGELES</div>
            </div>
            <div class="flex items-center gap-4">
                ${state.user ? `
                    <button onclick="router('profile_hub')" class="bg-gov-blue text-white px-6 py-2.5 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-blue-900 transition-all shadow-lg">Espace Citoyen</button>
                ` : `
                    <button onclick="actions.login()" class="bg-[#5865F2] text-white px-6 py-2.5 rounded-sm flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-all">
                        <i data-lucide="discord" class="w-4 h-4"></i> Connexion Discord
                    </button>
                `}
            </div>
        </header>

        <!-- HERO -->
        <section class="landing-section bg-gov-light border-b border-gray-200">
            <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div class="text-center lg:text-left animate-in">
                    <span class="inline-block px-4 py-1 bg-blue-100 text-gov-blue text-[10px] font-black uppercase tracking-[0.3em] mb-6">Plateforme de Gestion Roleplay</span>
                    <h1 class="text-5xl md:text-7xl font-black text-gov-text tracking-tighter leading-none mb-8 uppercase italic">
                        TEAM FRENCH<br><span class="text-gov-blue">ROLEPLAY.</span>
                    </h1>
                    <div class="text-2xl font-black text-gray-400 uppercase tracking-widest mb-10 italic">Panel TFRP v6.0</div>
                    <p class="text-lg text-gray-600 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                        L'interface officielle de l'État de Californie. Gérez vos identités civiles, vos finances et interagissez avec les services publics de Los Angeles.
                    </p>
                    <button onclick="${state.user ? "router('profile_hub')" : "actions.login()"}" class="px-10 py-5 bg-gov-blue text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-blue-900 transition-all transform hover:scale-105">
                        Accéder au portail
                    </button>
                </div>
                <div class="hidden lg:block animate-in" style="animation-delay: 0.2s">
                    <div class="bg-white p-2 rounded-[32px] shadow-2xl border border-gray-200 rotate-2 overflow-hidden aspect-video">
                        <img src="https://images.unsplash.com/photo-1542738738-55374d209119?auto=format&fit=crop&w=1200&q=80" class="w-full h-full object-cover grayscale contrast-125 opacity-90">
                    </div>
                </div>
            </div>
        </section>

        <!-- STAFF -->
        <section class="landing-section bg-white border-b border-gray-100">
            <div class="max-w-6xl mx-auto text-center">
                <h2 class="text-3xl font-black uppercase tracking-tighter italic mb-16 underline decoration-gov-red decoration-4 underline-offset-8">L'Équipe de la Fondation</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    ${sortedStaff.map(s => `
                        <div class="group flex flex-col items-center">
                            <div class="relative mb-6">
                                <img src="${s.avatar_url}" class="w-24 h-24 rounded-full border-4 border-white shadow-xl grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                                ${state.adminIds.includes(s.id) ? `
                                    <div class="absolute -bottom-2 -right-2 bg-gov-blue text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                                        <i data-lucide="shield" class="w-4 h-4"></i>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="font-black uppercase text-gov-text tracking-tighter text-lg">${s.username}</div>
                            <div class="text-[9px] font-black ${state.adminIds.includes(s.id) ? 'text-gov-red' : 'text-gov-blue'} uppercase tracking-widest mt-1">
                                ${state.adminIds.includes(s.id) ? 'Fondation' : 'Service Public'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- POWERED BY -->
        <section class="py-12 bg-white border-b border-gray-100">
            <div class="max-w-4xl mx-auto flex flex-col items-center">
                <div class="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em] mb-8">Infrastructure & Technologies</div>
                <div class="flex flex-wrap justify-center gap-16 grayscale opacity-40">
                    <div class="flex items-center gap-3">
                        <i data-lucide="github" class="w-6 h-6"></i>
                        <span class="text-xl font-black tracking-tighter uppercase">GITHUB</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i data-lucide="database" class="w-6 h-6"></i>
                        <span class="text-xl font-black tracking-tighter uppercase">SUPABASE</span>
                    </div>
                </div>
            </div>
        </section>

        <footer class="py-12 px-6 border-t-4 border-gov-blue bg-white">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>&copy; 2025 TFRP • ÉTAT DE CALIFORNIE • LOS ANGELES DIVISION</span>
                <div class="flex gap-8">
                    <a onclick="router('terms')" class="hover:text-gov-blue cursor-pointer">Conditions d'Utilisation</a>
                    <a onclick="router('privacy')" class="hover:text-gov-blue cursor-pointer">Confidentialité</a>
                </div>
            </div>
        </footer>
    </div>
    `;
};

/**
 * VUE : ACCÈS REFUSÉ (GUILDE MANQUANTE)
 */
export const AccessDeniedView = () => {
    return `
    <div class="flex-1 flex items-center justify-center bg-gov-light p-6 animate-in">
        <div class="max-w-md w-full bg-white p-12 border border-gray-200 shadow-2xl text-center rounded-[40px]">
            <div class="w-24 h-24 bg-red-100 text-gov-red rounded-full flex items-center justify-center mx-auto mb-8">
                <i data-lucide="shield-alert" class="w-12 h-12"></i>
            </div>
            <h2 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter mb-4">Accès Restreint</h2>
            <p class="text-gray-500 mb-10 leading-relaxed font-medium">Vous devez être membre du serveur Discord officiel pour accéder au panel citoyen de l'État de Californie.</p>
            
            <a href="${CONFIG.INVITE_URL}" target="_blank" class="block w-full py-5 bg-gov-blue text-white font-black uppercase text-xs tracking-widest hover:bg-blue-900 transition-all shadow-xl mb-4 rounded-2xl">
                Rejoindre le Discord
            </a>
            <button onclick="actions.logout()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text transition-colors">
                Changer de compte
            </button>
        </div>
    </div>
    `;
};

/**
 * VUE : SUPPRESSION EN COURS (RGPD)
 */
export const DeletionPendingView = () => {
    const date = state.user?.deletion_requested_at ? new Date(state.user.deletion_requested_at) : null;
    const finalDate = date ? new Date(date.getTime() + 72 * 60 * 60 * 1000) : null;

    return `
    <div class="flex-1 flex items-center justify-center bg-[#050505] p-6 animate-in">
        <div class="max-w-lg w-full bg-white p-12 border-t-8 border-gov-red shadow-2xl text-center rounded-[40px]">
            <div class="w-20 h-20 bg-red-50 text-gov-red rounded-full flex items-center justify-center mx-auto mb-8">
                <i data-lucide="trash-2" class="w-10 h-10"></i>
            </div>
            <h2 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter mb-4">Purge de l'Identité</h2>
            <p class="text-gray-500 mb-8 leading-relaxed font-medium">Une demande de suppression définitive de vos données a été reçue. Conformément au RGPD, vos accès sont suspendus durant la phase de suppression.</p>
            
            <div class="bg-gray-50 p-6 rounded-3xl mb-10 border border-gray-100">
                <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Effacement définitif le</div>
                <div class="text-xl font-mono font-bold text-gov-text">${finalDate ? finalDate.toLocaleString() : '---'}</div>
            </div>

            <button onclick="actions.cancelDataDeletion()" class="w-full py-5 bg-gov-text text-white font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl mb-4 rounded-2xl">
                Annuler la suppression
            </button>
            <button onclick="actions.logout()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors">
                Déconnexion
            </button>
        </div>
    </div>
    `;
};