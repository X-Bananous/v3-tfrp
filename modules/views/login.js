
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const LoginView = () => {
    const staff = state.landingStaff || [];

    return `
    <div class="flex-1 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        
        <!-- HEADER -->
        <header class="global-nav sticky top-0 bg-white/95 backdrop-blur-md">
            <div class="marianne-block uppercase font-black tracking-tight text-gov-text">
                <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red italic">State of California</div>
                <div class="text-lg leading-none italic">LOS ANGELES<br>PORTAL</div>
            </div>
            <div>
                ${state.user ? `
                    <button onclick="router('profile_hub')" class="bg-gov-blue text-white px-6 py-2.5 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-all">Mon Espace</button>
                ` : `
                    <button onclick="actions.login()" class="bg-[#5865F2] text-white px-6 py-2.5 rounded-sm flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-all">
                        <i data-lucide="discord" class="w-4 h-4"></i> Connexion
                    </button>
                `}
            </div>
        </header>

        <!-- HERO -->
        <section class="py-24 px-6 bg-gov-light border-b border-gray-200">
            <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div class="animate-in">
                    <span class="inline-block px-4 py-1 bg-blue-100 text-gov-blue text-[10px] font-black uppercase tracking-[0.3em] mb-6">Department of Civil Services</span>
                    <h1 class="text-6xl md:text-8xl font-black text-gov-text tracking-tighter leading-none mb-8 uppercase italic">
                        L'administration <span class="text-gov-blue underline decoration-gov-red decoration-4">Fédérale.</span>
                    </h1>
                    <p class="text-lg text-gray-600 mb-10 leading-relaxed font-medium max-w-xl">
                        Bienvenue sur le portail officiel de l'État de Californie pour le district de Los Angeles. Gagnez du temps dans vos démarches administratives.
                    </p>
                    <button onclick="${state.user ? "router('profile_hub')" : "actions.login()"}" class="px-10 py-5 bg-gov-blue text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all italic">
                        Accéder au registre national
                    </button>
                </div>
                <div class="hidden lg:flex justify-center animate-in" style="animation-delay: 0.2s">
                    <img src="https://media.discordapp.net/attachments/1279455759414857759/1454487850132308109/GouvLA.png" class="w-2/3 grayscale opacity-90 drop-shadow-2xl rotate-3">
                </div>
            </div>
        </section>

        <!-- STAFF SECTION -->
        <section class="py-20 px-6 bg-white border-b border-gray-100">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-black uppercase tracking-tighter italic">Haut Commandement Administratif</h2>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.5em] mt-2">Supervision & Direction Technique</p>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
                    ${staff.slice(0, 4).map(s => `
                        <div class="text-center group">
                            <div class="relative w-28 h-28 mx-auto mb-6">
                                <img src="${s.avatar_url}" class="w-full h-full rounded-full border-4 border-white shadow-xl grayscale group-hover:grayscale-0 transition-all duration-500">
                                <div class="absolute inset-0 rounded-full border-2 border-gov-blue/20 group-hover:border-gov-blue scale-110 transition-all duration-500"></div>
                            </div>
                            <div class="font-black uppercase text-gov-text text-xl italic">${s.username}</div>
                            <div class="text-[9px] font-black text-gov-red uppercase tracking-widest mt-1">${state.adminIds.includes(s.id) ? 'DIRECTEUR ÉTAT' : 'SOUS-PRÉFET'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- POWERED BY - ONLY GITHUB & SUPABASE -->
        <section class="py-12 bg-gov-text text-white">
            <div class="max-w-4xl mx-auto text-center">
                <div class="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Infrastructure & Data Hub</div>
                <div class="flex justify-center items-center gap-20 grayscale opacity-40">
                    <div class="flex items-center gap-3">
                        <i data-lucide="github" class="w-8 h-8"></i>
                        <span class="text-2xl font-black tracking-tighter uppercase italic">GITHUB</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i data-lucide="database" class="w-8 h-8"></i>
                        <span class="text-2xl font-black tracking-tighter uppercase italic">SUPABASE</span>
                    </div>
                </div>
            </div>
        </section>

        <footer class="py-10 px-6 border-t-4 border-gov-blue bg-white">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <div class="marianne-block">
                    <span>© 2025 TFRP PROJECT</span>
                    <span class="text-gov-blue">STATE OF CALIFORNIA</span>
                </div>
                <div class="flex gap-8">
                    <a onclick="router('terms')" class="hover:text-gov-blue cursor-pointer transition-colors">Conditions</a>
                    <a onclick="router('privacy')" class="hover:text-gov-blue cursor-pointer transition-colors">Confidentialité</a>
                </div>
            </div>
        </footer>
    </div>
    `;
};

export const AccessDeniedView = () => `
    <div class="min-h-screen flex items-center justify-center p-8 bg-gov-light">
        <div class="bg-white max-w-lg p-12 border-t-8 border-gov-red shadow-2xl text-center">
            <div class="w-20 h-20 bg-red-50 text-gov-red rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse"><i data-lucide="shield-alert" class="w-10 h-10"></i></div>
            <h2 class="text-3xl font-black text-gov-text mb-4 uppercase italic">Identité Non Répertoriée</h2>
            <p class="text-gray-500 mb-10 leading-relaxed font-medium">Vous n'êtes pas présent sur le registre Discord de l'État de Californie. Accès au terminal révoqué.</p>
            <a href="${CONFIG.INVITE_URL}" target="_blank" class="block w-full py-4 bg-gov-blue text-white font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl italic">Régulariser ma situation</a>
            <button onclick="actions.logout()" class="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text transition-colors">Déconnexion</button>
        </div>
    </div>
`;

export const DeletionPendingView = () => `
    <div class="min-h-screen flex items-center justify-center p-8 bg-gov-light">
        <div class="bg-white max-w-lg p-12 border-t-8 border-orange-500 shadow-2xl text-center">
            <div class="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-8"><i data-lucide="trash-2" class="w-10 h-10"></i></div>
            <h2 class="text-3xl font-black text-gov-text mb-4 uppercase italic">Procédure de Purge</h2>
            <p class="text-gray-500 mb-10 leading-relaxed font-medium">Vos données sont en cours d'effacement définitif du registre fédéral (Délais: 72h).</p>
            <button onclick="actions.cancelDataDeletion()" class="w-full py-4 bg-gov-text text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl italic">Annuler l'effacement</button>
            <button onclick="actions.logout()" class="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text transition-colors">Quitter</button>
        </div>
    </div>
`;
