
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const LoginView = () => {
    const staff = state.landingStaff || [];
    const stats = state.erlcData;

    return `
    <div class="flex-1 flex flex-col bg-white overflow-y-auto">
        
        <!-- HEADER -->
        <header class="w-full px-6 py-5 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-[100]">
            <div class="marianne-block uppercase font-black tracking-tight text-gov-text">
                <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">Liberté • Égalité • Roleplay</div>
                <div class="text-lg leading-none">RÉPUBLIQUE<br>DE LOS ANGELES</div>
            </div>
            <div class="flex items-center gap-4">
                ${state.user ? `
                    <button onclick="router('profile_hub')" class="bg-gov-blue text-white px-6 py-2.5 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-blue-900 transition-all shadow-lg">Mon Espace</button>
                ` : `
                    <button onclick="actions.login()" class="bg-[#5865F2] text-white px-6 py-2.5 rounded-sm flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-all">
                        <i data-lucide="discord" class="w-4 h-4"></i> S'identifier
                    </button>
                `}
            </div>
        </header>

        <!-- HERO -->
        <section class="landing-section bg-gov-light border-b border-gray-200">
            <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div class="text-center lg:text-left animate-in">
                    <span class="inline-block px-4 py-1 bg-blue-100 text-gov-blue text-[10px] font-black uppercase tracking-[0.3em] mb-6">Système National d'Information</span>
                    <h1 class="text-5xl md:text-7xl font-black text-gov-text tracking-tighter leading-none mb-8 uppercase italic">
                        L'administration <span class="text-gov-blue">réinventée.</span>
                    </h1>
                    <p class="text-lg text-gray-600 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                        Accédez à vos titres sécurisés, gérez votre patrimoine civil et suivez les décrets en temps réel sur le portail officiel de la République.
                    </p>
                    <button onclick="${state.user ? "router('profile_hub')" : "actions.login()"}" class="px-10 py-5 bg-gov-blue text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-blue-900 transition-all transform hover:scale-105">
                        Commencer les démarches
                    </button>
                </div>
                <div class="hidden lg:block animate-in" style="animation-delay: 0.2s">
                    <div class="bg-white p-2 rounded-sm shadow-2xl border border-gray-200 rotate-2">
                        <img src="https://media.discordapp.net/attachments/1279455759414857759/1454487850132308109/GouvLA.png" class="w-full grayscale contrast-125">
                    </div>
                </div>
            </div>
        </section>

        <!-- STAFF & DIRECTION -->
        <section class="landing-section bg-white border-b border-gray-100">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-black uppercase tracking-tighter italic mb-4">Directoire du Projet</h2>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.5em]">Haut Commandement & Développement technique</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${staff.slice(0, 4).map(s => `
                        <div class="p-8 bg-gov-light border border-gray-200 rounded-sm hover:border-gov-blue transition-all group text-center">
                            <img src="${s.avatar_url}" class="w-24 h-24 rounded-full mx-auto mb-6 grayscale group-hover:grayscale-0 transition-all border-4 border-white shadow-xl">
                            <div class="font-black uppercase text-xl text-gov-text">${s.username}</div>
                            <div class="text-[9px] font-black text-gov-red uppercase tracking-widest mt-2">${state.adminIds.includes(s.id) ? 'FONDATEUR' : 'ADMINISTRATEUR'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- CREDITS -->
        <section class="landing-section bg-gov-text text-white relative overflow-hidden">
            <div class="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <div class="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-12">Infrastructures & Partenariats</div>
                <div class="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
                    <span class="text-3xl font-black italic tracking-tighter">ZEKYO</span>
                    <span class="text-3xl font-black tracking-tighter">MATMAT</span>
                    <span class="text-3xl font-black italic tracking-tighter">SUPABASE</span>
                    <span class="text-3xl font-black tracking-tighter">ROBLOX</span>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="py-12 px-6 border-t-4 border-gov-blue bg-white">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div class="marianne-block uppercase font-black text-gov-text scale-75">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1">Roleplay</div>
                    <div class="text-md leading-none">RÉPUBLIQUE</div>
                </div>
                <div class="flex gap-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <a onclick="router('terms')" class="hover:text-gov-blue cursor-pointer">Conditions</a>
                    <a onclick="router('privacy')" class="hover:text-gov-blue cursor-pointer">Confidentialité</a>
                    <span>&copy; 2025 TFRP Team</span>
                </div>
            </div>
        </footer>
    </div>
    `;
};
