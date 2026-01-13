
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const LoginView = () => {
    const staff = state.landingStaff || [];

    return `
    <div class="flex-1 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        
        <!-- HEADER TRANSPARENT -->
        <header class="global-nav sticky top-0 bg-white/90 backdrop-blur-md">
            <div class="marianne-block uppercase font-black tracking-tight text-gov-text">
                <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red italic">State of California</div>
                <div class="text-lg leading-none italic">LOS ANGELES<br>ADMINISTRATION</div>
            </div>
            <div>
                ${state.user ? `
                    <button onclick="router('profile_hub')" class="bg-gov-blue text-white px-6 py-2.5 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-all">Accéder au Portail</button>
                ` : `
                    <button onclick="actions.login()" class="bg-[#5865F2] text-white px-6 py-2.5 rounded-sm flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-all">
                        <i data-lucide="discord" class="w-4 h-4"></i> Authentification
                    </button>
                `}
            </div>
        </header>

        <!-- HERO -->
        <section class="py-32 px-6 bg-gov-light">
            <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div class="animate-in">
                    <span class="inline-block px-4 py-1 bg-gov-blue text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl">Official Digital Service</span>
                    <h1 class="text-7xl md:text-8xl font-black text-gov-text tracking-tighter leading-none mb-10 uppercase italic">
                        Le portail <span class="text-gov-blue underline decoration-gov-red decoration-4">Institutionnel.</span>
                    </h1>
                    <p class="text-xl text-gray-600 mb-12 leading-relaxed font-medium max-w-xl">
                        Bienvenue sur le registre centralisé de l'État de Californie pour le district de Los Angeles. Gérez vos accréditations civiles et vos actifs officiels.
                    </p>
                    <div class="flex flex-wrap gap-6">
                        <button onclick="${state.user ? "router('profile_hub')" : "actions.login()"}" class="px-12 py-6 bg-gov-blue text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-105 transition-all italic">
                            Ouvrir un dossier citoyen
                        </button>
                    </div>
                </div>
                <div class="hidden lg:flex justify-center animate-in" style="animation-delay: 0.2s">
                    <img src="https://media.discordapp.net/attachments/1279455759414857759/1454487850132308109/GouvLA.png" class="w-2/3 drop-shadow-2xl opacity-90 brightness-90 contrast-125 grayscale hover:grayscale-0 transition-all duration-1000">
                </div>
            </div>
        </section>

        <!-- STAFF SECTION -->
        <section class="py-24 px-6 bg-white border-y border-gray-100">
            <div class="max-w-6xl mx-auto">
                <div class="flex items-center gap-6 mb-20 px-4">
                    <div class="h-px flex-1 bg-gray-200"></div>
                    <h2 class="text-3xl font-black uppercase tracking-tighter italic text-gov-blue">Direction de l'État</h2>
                    <div class="h-px flex-1 bg-gray-200"></div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-16">
                    ${staff.slice(0, 4).map(s => `
                        <div class="text-center group">
                            <div class="relative w-32 h-32 mx-auto mb-8">
                                <img src="${s.avatar_url}" class="w-full h-full rounded-full border-4 border-white shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                                <div class="absolute inset-0 rounded-full border-2 border-gov-blue/20 group-hover:border-gov-blue scale-110 transition-all duration-700"></div>
                            </div>
                            <div class="font-black uppercase text-gov-text text-2xl italic tracking-tight mb-1">${s.username}</div>
                            <div class="text-[9px] font-black text-gov-red uppercase tracking-[0.3em]">${state.adminIds.includes(s.id) ? 'GOVERNOR' : 'ATTORNEY GENERAL'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- POWERED BY - ONLY GITHUB & SUPABASE -->
        <section class="py-16 bg-gov-text text-white">
            <div class="max-w-4xl mx-auto text-center">
                <div class="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em] mb-12">Infrastructure Technologique</div>
                <div class="flex justify-center items-center gap-24 grayscale opacity-30">
                    <div class="flex items-center gap-4">
                        <i data-lucide="github" class="w-10 h-10"></i>
                        <span class="text-3xl font-black tracking-tighter uppercase italic">GITHUB</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <i data-lucide="database" class="w-10 h-10"></i>
                        <span class="text-3xl font-black tracking-tighter uppercase italic">SUPABASE</span>
                    </div>
                </div>
            </div>
        </section>

        <footer class="py-12 px-6 border-t-4 border-gov-blue bg-white">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <div class="marianne-block">
                    <span>© 2025 TFRP PROJECT • DEPT. OF JUSTICE</span>
                    <span class="text-gov-blue">STATE OF CALIFORNIA</span>
                </div>
                <div class="flex gap-12">
                    <a onclick="router('terms')" class="hover:text-gov-blue cursor-pointer transition-colors">Conditions</a>
                    <a onclick="router('privacy')" class="hover:text-gov-blue cursor-pointer transition-colors">Confidentialité</a>
                    <a href="https://discord.gg/eBU7KKKGD5" target="_blank" class="text-gov-blue">Support</a>
                </div>
            </div>
        </footer>
    </div>
    `;
};

export const AccessDeniedView = () => `
    <div class="min-h-screen flex items-center justify-center p-8 bg-gov-light">
        <div class="bg-white max-w-lg p-16 border-t-8 border-gov-red shadow-2xl text-center">
            <div class="w-24 h-24 bg-red-50 text-gov-red rounded-full flex items-center justify-center mx-auto mb-10"><i data-lucide="shield-alert" class="w-12 h-12"></i></div>
            <h2 class="text-4xl font-black text-gov-text mb-6 uppercase italic tracking-tight">Accès Décliné</h2>
            <p class="text-gray-500 mb-12 leading-relaxed font-medium text-lg italic">Votre identité numérique n'est pas reconnue par le protocole fédéral de l'État de Californie.</p>
            <a href="${CONFIG.INVITE_URL}" target="_blank" class="block w-full py-5 bg-gov-blue text-white font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-2xl italic">Rejoindre le Registre</a>
            <button onclick="actions.logout()" class="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text transition-colors">Retour à l'accueil</button>
        </div>
    </div>
`;

export const DeletionPendingView = () => `
    <div class="min-h-screen flex items-center justify-center p-8 bg-gov-light">
        <div class="bg-white max-w-lg p-16 border-t-8 border-orange-500 shadow-2xl text-center">
            <div class="w-24 h-24 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-10"><i data-lucide="trash-2" class="w-12 h-12"></i></div>
            <h2 class="text-4xl font-black text-gov-text mb-6 uppercase italic tracking-tight">Purge en cours</h2>
            <p class="text-gray-500 mb-12 leading-relaxed font-medium italic">Vos données sont programmées pour une destruction irréversible du registre fédéral sous 72h.</p>
            <button onclick="actions.cancelDataDeletion()" class="w-full py-5 bg-gov-text text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl italic">Suspendre la procédure</button>
            <button onclick="actions.logout()" class="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text transition-colors">Déconnexion</button>
        </div>
    </div>
`;
