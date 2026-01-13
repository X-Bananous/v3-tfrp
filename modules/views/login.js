import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const LoginView = () => {
    const staff = state.landingStaff || [];
    // Tri des staffs pour mettre les fondateurs/admins en premier
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
                    <span class="inline-block px-4 py-1 bg-blue-100 text-gov-blue text-[10px] font-black uppercase tracking-[0.3em] mb-6">Portail National d'Information</span>
                    <h1 class="text-5xl md:text-7xl font-black text-gov-text tracking-tighter leading-none mb-8 uppercase italic">
                        L'administration <span class="text-gov-blue">simplifiée.</span>
                    </h1>
                    <p class="text-lg text-gray-600 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                        Gérez votre identité civile, consultez vos actifs et interagissez avec les services publics de l'État de Californie sur la plateforme officielle de Los Angeles.
                    </p>
                    <button onclick="${state.user ? "router('profile_hub')" : "actions.login()"}" class="px-10 py-5 bg-gov-blue text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-blue-900 transition-all transform hover:scale-105">
                        Accéder au portail
                    </button>
                </div>
                <div class="hidden lg:block animate-in" style="animation-delay: 0.2s">
                    <div class="bg-white p-2 rounded-sm shadow-2xl border border-gray-200 rotate-2">
                        <img src="https://media.discordapp.net/attachments/1279455759414857759/1454487850132308109/GouvLA.png" class="w-full grayscale contrast-125 opacity-80">
                    </div>
                </div>
            </div>
        </section>

        <!-- STAFF -->
        <section class="landing-section bg-white border-b border-gray-100">
            <div class="max-w-6xl mx-auto text-center">
                <h2 class="text-3xl font-black uppercase tracking-tighter italic mb-16">Conseil d'Administration</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
                    ${sortedStaff.slice(0, 8).map(s => `
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
                                ${state.adminIds.includes(s.id) ? 'Directoire' : 'Service Public'}
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

export const AccessDeniedView = () => `
    <div class="min-h-screen flex items-center justify-center p-8 bg-gov-light text-center">
        <div class="bg-white max-w-lg p-12 border-t-8 border-gov-red shadow-2xl">
            <div class="w-16 h-16 bg-red-50 text-gov-red rounded-full flex items-center justify-center mx-auto mb-8"><i data-lucide="lock" class="w-8 h-8"></i></div>
            <h2 class="text-2xl font-black text-gov-text mb-4 uppercase italic">Accès Non Autorisé</h2>
            <p class="text-gray-600 mb-10 leading-relaxed">Votre identité n'est pas répertoriée dans le registre de l'État de Californie.</p>
            <a href="${CONFIG.INVITE_URL}" target="_blank" class="block w-full py-4 bg-gov-blue text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl">Rejoindre la Communauté</a>
            <button onclick="actions.logout()" class="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text transition-colors">Retour à l'accueil</button>
        </div>
    </div>
`;

export const DeletionPendingView = () => `
    <div class="min-h-screen flex items-center justify-center p-8 bg-gov-light text-center">
        <div class="bg-white max-w-lg p-12 border-t-8 border-orange-500 shadow-2xl">
            <div class="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-8"><i data-lucide="trash-2" class="w-8 h-8"></i></div>
            <h2 class="text-2xl font-black text-gov-text mb-4 uppercase italic">Compte en cours de Purge</h2>
            <p class="text-gray-600 mb-10 leading-relaxed font-medium">Vos données sont marquées pour une suppression définitive dans les prochaines 72h.</p>
            <button onclick="actions.cancelDataDeletion()" class="w-full py-4 bg-gov-text text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl">Annuler la procédure d'effacement</button>
            <button onclick="actions.logout()" class="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text transition-colors">Déconnexion</button>
        </div>
    </div>
`;