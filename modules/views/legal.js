import { state } from '../state.js';
import { router } from '../utils.js';

const LegalHeader = (title, icon, color) => `
    <header class="shrink-0 bg-white border-b border-gray-100 px-8 flex items-center justify-between h-20 sticky top-0 z-[1000] shadow-sm">
        <div class="flex items-center gap-6 h-full">
            <div onclick="router('login')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer hover:opacity-70 transition-opacity">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase font-black">État de Californie</div>
                <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
            </div>
            <div class="h-8 w-px bg-gray-100"></div>
            <h1 class="text-lg font-black text-gov-text uppercase italic tracking-tight flex items-center gap-3">
                <i data-lucide="${icon}" class="w-5 h-5 ${color}"></i>
                ${title}
            </h1>
        </div>
        <button onclick="router('login')" class="px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-gov-light text-gov-text hover:bg-gov-blue hover:text-white transition-all flex items-center gap-2">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Retour
        </button>
    </header>
`;

export const TermsView = () => `
    <div class="flex flex-col h-full bg-[#F6F6F6] animate-fade-in">
        ${LegalHeader("Conditions Générales d'Utilisation", "scale", "text-gov-blue")}
        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 md:px-16 lg:px-32">
            <div class="max-w-4xl mx-auto bg-white border border-gray-200 p-12 md:p-20 shadow-2xl rounded-[40px] mb-20">
                <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-8">Décret n°2025-TFRP-V3</div>
                <div class="space-y-10 text-gray-600 leading-relaxed font-medium italic">
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">1. Préambule Économique</h3>
                        <p>Le panel TFRP est un outil de simulation Roleplay. L'argent, les biens et les documents affichés sur cette plateforme sont strictement virtuels et n'ont aucune valeur légale ou monétaire réelle.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">2. Accès et Authentification</h3>
                        <p>L'accès est conditionné par l'appartenance au serveur Discord TFRP. Toute usurpation d'identité ou exploitation de faille technique pourra entraîner un bannissement définitif de l'intégralité des services V3.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">3. Règles de Conduite CAD</h3>
                        <p>L'utilisation du terminal CAD (services publics) est réservée aux personnels accrédités. Toute diffusion d'informations confidentielles (Casiers, Localisations) hors du cadre RP est prohibée.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">4. Évolution de la Plateforme</h3>
                        <p>L'administration TFRP se réserve le droit de modifier les taux de taxation (TVA, Taxe Rayon) et les salaires pour maintenir l'équilibre de la simulation économique.</p>
                    </section>
                </div>
                <div class="mt-20 pt-10 border-t border-gray-100 text-center">
                    <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Fait à Los Angeles, le 15/12/2025 • Administration TFRP V3</p>
                </div>
            </div>
        </div>
    </div>
`;

export const PrivacyView = () => `
    <div class="flex flex-col h-full bg-[#F6F6F6] animate-fade-in">
        ${LegalHeader("Politique de Confidentialité", "shield-check", "text-emerald-600")}
        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 md:px-16 lg:px-32">
            <div class="max-w-4xl mx-auto bg-white border border-gray-200 p-12 md:p-20 shadow-2xl rounded-[40px] mb-20">
                <div class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-8">Protocole de Protection des Données V3</div>
                <div class="space-y-10 text-gray-600 leading-relaxed font-medium italic">
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">Collecte des Données</h3>
                        <p>Nous utilisons l'API Discord pour récupérer votre ID, Pseudo et Avatar. Ces données servent exclusivement à la création de votre profil citoyen et à la sécurisation de vos accès.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">Conservation Roleplay</h3>
                        <p>Vos fiches de personnages, transactions et rapports de police sont conservés dans notre base Supabase cryptée pour assurer la continuité de votre expérience de jeu.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">Droit à l'Oubli</h3>
                        <p>Vous disposez d'une fonction de suppression définitive accessible via votre profil. Celle-ci marquera vos données pour un effacement total sous 72h conformément au RGPD.</p>
                    </section>
                </div>
                <div class="mt-20 pt-10 border-t border-gray-100 text-center">
                    <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Certification RGPD-TFRP • V3 Platform</p>
                </div>
            </div>
        </div>
    </div>
`;