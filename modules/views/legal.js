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
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 lg:px-32">
            <div class="max-w-4xl mx-auto bg-white border border-gray-200 p-12 md:p-20 shadow-2xl rounded-[40px] mb-20 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-gov-blue"></div>
                <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-12">RÉFÉRENCE : DÉCRET V3-CGU-2025</div>
                
                <div class="space-y-12 text-gray-600 leading-relaxed font-medium italic">
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">1. Nature de la Plateforme</h3>
                        <p>Le panel TFRP V3 est un outil de simulation Roleplay. L'intégralité des avoirs bancaires, titres de propriété et documents d'identité affichés sont strictement virtuels et n'ont aucune valeur légale ou financière réelle.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">2. Accès et Identité</h3>
                        <p>L'accès est conditionné par une authentification Discord. Tout utilisateur s'engage à ne pas usurper l'identité d'un autre citoyen ou membre du personnel de l'État de Californie.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">3. Économie Virtuelle</h3>
                        <p>L'administration se réserve le droit d'ajuster les taux de taxation (TVA, Taxe Rayon) et les salaires pour maintenir l'équilibre de la simulation économique.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">4. Sanctions</h3>
                        <p>L'exploitation de failles techniques ou le non-respect des règles communautaires peut entraîner une suspension définitive de vos dossiers citoyens sur l'intégralité du réseau V3.</p>
                    </section>
                </div>

                <div class="mt-20 pt-10 border-t border-gray-100 text-center">
                    <div class="marianne-block uppercase font-black text-gov-text scale-[0.6] opacity-30 mx-auto">
                        <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                        <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES ADMINISTRATION</div>
                    </div>
                    <p class="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-6">Certification TFRP Platinum • 2025</p>
                </div>
            </div>
        </div>
    </div>
`;

export const PrivacyView = () => `
    <div class="flex flex-col h-full bg-[#F6F6F6] animate-fade-in">
        ${LegalHeader("Politique de Confidentialité", "shield-check", "text-emerald-600")}
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 lg:px-32">
            <div class="max-w-4xl mx-auto bg-white border border-gray-200 p-12 md:p-20 shadow-2xl rounded-[40px] mb-20 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                <div class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-12">PROTOCOLE DE PROTECTION DES DONNÉES V3</div>
                
                <div class="space-y-12 text-gray-600 leading-relaxed font-medium italic">
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">Collecte via Discord</h3>
                        <p>Nous utilisons l'API Discord pour authentifier votre identité. Nous collectons exclusivement votre ID Discord, votre pseudonyme et votre avatar pour la création de votre profil citoyen.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">Usage des Données de Jeu</h3>
                        <p>Vos personnages, transactions financières et rapports judiciaires sont conservés dans notre base de données cryptée Supabase afin d'assurer la continuité de votre expérience Roleplay.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">Droit à l'Oubli</h3>
                        <p>Vous disposez d'un droit de suppression totale. L'option "Droit à l'oubli" dans votre profil permet de programmer l'effacement définitif de toutes vos données sous 72 heures.</p>
                    </section>
                </div>

                <div class="mt-20 pt-10 border-t border-gray-100 text-center">
                    <div class="marianne-block uppercase font-black text-gov-text scale-[0.6] opacity-30 mx-auto">
                        <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                        <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES ADMINISTRATION</div>
                    </div>
                    <p class="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-6">Certification RGPD-V3 • Platform Identity</p>
                </div>
            </div>
        </div>
    </div>
`;