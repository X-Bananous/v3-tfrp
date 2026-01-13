
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const LoginView = () => {
    const activeHeists = state.globalActiveHeists || [];
    const tva = state.economyConfig?.tva_tax || 0;
    const gouvBank = state.gouvBank || 0;
    const staff = state.landingStaff || [];

    return `
    <div class="flex-1 flex flex-col bg-white animate-gov overflow-y-auto">
        
        <!-- HEADER -->
        <header class="w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 bg-white border-b border-gray-100 z-50 shadow-sm">
            <div class="flex items-center gap-6">
                <div class="marianne-block uppercase font-black tracking-tight text-gov-text">
                    <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">Liberté • Égalité • Roleplay</div>
                    <div class="text-lg leading-none">RÉPUBLIQUE<br>DE LOS ANGELES</div>
                </div>
            </div>

            <div class="flex items-center gap-6">
                <a href="${CONFIG.INVITE_URL}" target="_blank" class="text-xs font-bold text-gov-blue hover:underline uppercase tracking-widest">Nous rejoindre</a>
                ${state.user ? `
                    <button onclick="router('profile_hub')" class="bg-gov-blue text-white px-6 py-2.5 rounded-sm font-bold uppercase text-[10px] tracking-widest shadow-lg hover:bg-blue-900 transition-all">
                        Mon Espace Citoyen
                    </button>
                ` : `
                    <button onclick="actions.login()" class="bg-[#5865F2] text-white px-6 py-2.5 rounded-sm flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest shadow-md">
                        <i data-lucide="discord" class="w-4 h-4"></i> Connexion Discord
                    </button>
                `}
            </div>
        </header>

        <main class="w-full">
            <!-- HERO -->
            <section class="bg-gov-light py-20 px-6 border-b border-gray-200">
                <div class="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div class="flex-1 text-center lg:text-left">
                        <div class="inline-block px-4 py-1.5 bg-blue-100 text-gov-blue text-[10px] font-black uppercase tracking-[0.3em] mb-6">Plateforme de Services Publics</div>
                        <h1 class="text-5xl md:text-7xl font-black text-gov-text tracking-tighter leading-none mb-8 uppercase italic">
                            Simplifiez vos <span class="text-gov-blue">démarches.</span>
                        </h1>
                        <p class="text-lg text-gray-600 mb-10 leading-relaxed font-medium max-w-xl">
                            Le portail numérique officiel pour gérer votre identité civile, vos actifs financiers et vos interactions avec l'administration de Los Angeles.
                        </p>
                        <div class="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                            <button onclick="${state.user ? "router('profile_hub')" : "actions.login()"}" class="px-10 py-5 bg-gov-blue text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-blue-900 transition-all">
                                Accéder à mes dossiers
                            </button>
                        </div>
                    </div>
                    <div class="hidden lg:block flex-1">
                        <div class="bg-white p-1 rounded-sm shadow-2xl border border-gray-200">
                            <img src="https://media.discordapp.net/attachments/1279455759414857759/1454487850132308109/GouvLA.png" class="w-full grayscale contrast-125">
                        </div>
                    </div>
                </div>
            </section>

            <!-- STATS LIVE -->
            <section class="max-w-6xl mx-auto py-20 px-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div class="lg:col-span-2 space-y-6">
                        <h2 class="text-2xl font-black uppercase tracking-widest italic border-b-2 border-gov-text pb-4">Tableau de Situation</h2>
                        ${activeHeists.length > 0 ? activeHeists.map(h => `
                            <div class="gov-alert p-8 flex items-start gap-8 shadow-sm">
                                <i data-lucide="shield-alert" class="w-10 h-10 text-gov-red shrink-0"></i>
                                <div>
                                    <div class="text-[10px] font-black text-gov-red uppercase tracking-[0.2em] mb-1">Alerte Sécurité</div>
                                    <h3 class="text-xl font-black text-gov-text uppercase italic tracking-tight">${h.heist_type.replace(/_/g, ' ')}</h3>
                                    <p class="text-sm text-gray-600 mt-2">Localisation identifiée : <span class="text-red-700 font-bold">${h.location || 'Secteur Inconnu'}</span>.</p>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="gov-info-box p-8 flex items-start gap-8 shadow-sm">
                                <i data-lucide="check-circle" class="w-10 h-10 text-gov-blue shrink-0"></i>
                                <div>
                                    <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.2em] mb-1">Stabilité Territoriale</div>
                                    <h3 class="text-xl font-black text-gov-text uppercase italic tracking-tight">Zone Calme</h3>
                                    <p class="text-sm text-gray-600 mt-2 font-medium">Aucune anomalie majeure détectée par le central aujourd'hui.</p>
                                </div>
                            </div>
                        `}
                    </div>
                    <div class="bg-gov-light p-10 border border-gray-200">
                        <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 pb-2 border-b border-gray-300 italic">Observatoire Économique</div>
                        <div class="space-y-12">
                            <div>
                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Trésorerie Publique</div>
                                <div class="text-3xl font-black text-emerald-700">$${gouvBank.toLocaleString()}</div>
                            </div>
                            <div>
                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">TVA Municipale</div>
                                <div class="text-4xl font-black text-gov-text">${tva}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- STAFF -->
            <section class="bg-gov-text py-24 px-6 text-white overflow-hidden relative">
                <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div class="max-w-6xl mx-auto relative z-10">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl font-black uppercase tracking-tighter italic mb-4">Directoire du Projet</h2>
                        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.5em]">Haut Commandement & Développement</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        ${staff.map(s => `
                            <div class="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-gov-blue transition-all group text-center">
                                <img src="${s.avatar_url}" class="w-20 h-20 rounded-full mx-auto mb-6 grayscale group-hover:grayscale-0 transition-all border-2 border-white/10">
                                <div class="font-black uppercase text-lg mb-1">${s.username}</div>
                                <div class="text-[9px] font-black text-gov-red uppercase tracking-widest">${state.adminIds.includes(s.id) ? 'FONDATION' : 'STAFF'}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- CREDITS -->
            <section class="py-20 px-6 border-t border-gray-100 bg-white">
                <div class="max-w-6xl mx-auto text-center">
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12">Architecture & Partenaires</div>
                    <div class="flex flex-wrap justify-center items-center gap-16 md:gap-32 grayscale opacity-30">
                        <span class="text-3xl font-black tracking-tighter italic">SUPABASE</span>
                        <span class="text-3xl font-black tracking-tighter">GITHUB</span>
                        <span class="text-3xl font-black tracking-tighter italic">ZEKYO</span>
                        <span class="text-3xl font-black tracking-tighter">MATMAT</span>
                    </div>
                </div>
            </section>
        </main>

        <footer class="bg-white border-t-4 border-gov-blue py-12 px-6">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>&copy; 2025 Team French RolePlay • République de Los Angeles</span>
                <div class="flex gap-8">
                    <a onclick="router('terms')" class="hover:text-gov-blue cursor-pointer">Conditions</a>
                    <a onclick="router('privacy')" class="hover:text-gov-blue cursor-pointer">Confidentialité</a>
                </div>
                <span>v5.2.0 Stable</span>
            </div>
        </footer>
    </div>
    `;
};

export const AccessDeniedView = () => `
    <div class="min-h-screen flex items-center justify-center p-8 bg-gov-light text-center">
        <div class="bg-white max-w-lg p-12 border-t-8 border-gov-red shadow-2xl">
            <div class="w-16 h-16 bg-red-50 text-gov-red rounded-full flex items-center justify-center mx-auto mb-8"><i data-lucide="lock" class="w-8 h-8"></i></div>
            <h2 class="text-2xl font-black text-gov-text mb-4 uppercase italic">Identité Non Reconnue</h2>
            <p class="text-gray-600 mb-10 leading-relaxed">Votre compte n'est pas répertorié au registre national des citoyens.</p>
            <a href="${CONFIG.INVITE_URL}" target="_blank" class="block w-full py-4 bg-gov-blue text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl">Rejoindre le Discord</a>
            <button onclick="actions.logout()" class="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text transition-colors">Déconnexion</button>
        </div>
    </div>
`;

export const DeletionPendingView = () => `
    <div class="min-h-screen flex items-center justify-center p-8 bg-gov-light text-center">
        <div class="bg-white max-w-lg p-12 border-t-8 border-orange-500 shadow-2xl">
            <div class="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-8"><i data-lucide="trash-2" class="w-8 h-8"></i></div>
            <h2 class="text-2xl font-black text-gov-text mb-4 uppercase italic">Compte en sursis</h2>
            <p class="text-gray-600 mb-10 leading-relaxed font-medium">Vos données sont marquées pour suppression définitive.</p>
            <button onclick="actions.cancelDataDeletion()" class="w-full py-4 bg-gov-text text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl">Annuler la purge</button>
            <button onclick="actions.logout()" class="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gov-text transition-colors">Déconnexion temporaire</button>
        </div>
    </div>
`;
