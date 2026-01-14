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
    <div class="flex flex-col h-full bg-[#F6F6F6] animate-fade-in overflow-hidden">
        ${LegalHeader("Conditions Générales d'Utilisation", "scale", "text-gov-blue")}
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 lg:px-32">
            <div class="max-w-4xl mx-auto bg-white border border-gray-200 p-12 md:p-20 shadow-2xl rounded-[40px] mb-20 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-gov-blue"></div>
                <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-12">DÉCRET N°2025-V3-TERMS</div>
                
                <div class="space-y-12 text-gray-600 leading-relaxed font-medium italic">
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">1. Présentation du Service</h3>
                        <p>Le panel TFRP V3 est une infrastructure numérique dédiée à la simulation du jeu Team French Roleplay. Toute utilisation du site est conditionnée par l'acceptation intégrale des présentes clauses.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">2. Monnaie Virtuelle</h3>
                        <p>L'intégralité des sommes d'argent, avoirs bancaires et biens immobiliers affichés sur cette plateforme sont strictement virtuels. Ils ne possèdent aucune valeur monétaire réelle et ne sont ni remboursables ni transférables sur le réseau bancaire réel.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">3. Conduite et Modération</h3>
                        <p>L'utilisation de bugs techniques pour altérer son inventaire ou son solde bancaire constitue une violation grave. L'administration se réserve le droit de geler définitivement tout compte suspecté de fraude.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">4. Propriété des Données</h3>
                        <p>Les fiches de personnages et dossiers judiciaires sont la propriété intellectuelle de la plateforme dans le cadre de la simulation. L'utilisateur dispose néanmoins d'un droit de purge définitive (RGPD).</p>
                    </section>
                </div>

                <div class="mt-20 pt-10 border-t border-gray-100 text-center">
                    <div class="marianne-block uppercase font-black text-gov-text scale-[0.6] opacity-30 mx-auto">
                        <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                        <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES ADMINISTRATION</div>
                    </div>
                    <p class="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-6">Certifié TFRP V3 PLATINUM • 2025</p>
                </div>
            </div>
        </div>
    </div>
`;

export const PrivacyView = () => `
    <div class="flex flex-col h-full bg-[#F6F6F6] animate-fade-in overflow-hidden">
        ${LegalHeader("Politique de Confidentialité", "shield-check", "text-emerald-600")}
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 lg:px-32">
            <div class="max-w-4xl mx-auto bg-white border border-gray-200 p-12 md:p-20 shadow-2xl rounded-[40px] mb-20 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                <div class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-12">PROTOCOLE DE SÉCURITÉ V3-PRIVACY</div>
                
                <div class="space-y-12 text-gray-600 leading-relaxed font-medium italic">
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">Collecte via Discord</h3>
                        <p>Nous utilisons l'API Discord pour authentifier votre identité. Les données collectées incluent votre ID unique, votre pseudonyme et votre avatar. Ces données sont chiffrées sur nos serveurs Supabase.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">Usage des Données de Jeu</h3>
                        <p>Vos personnages, transactions et rapports judiciaires sont conservés pour assurer la continuité de votre expérience Roleplay. Ils ne sont jamais partagés à des tiers extérieurs à la plateforme.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">Droit de Suppression</h3>
                        <p>Conformément au RGPD, un menu "Sécurité" est disponible sur votre profil. Il vous permet de déclencher une demande de suppression totale et irrévocable de vos données sous 72 heures.</p>
                    </section>
                    <section>
                        <h3 class="text-2xl font-black text-gov-text mb-4 uppercase italic tracking-tight">Cookies Techniques</h3>
                        <p>La plateforme utilise exclusivement des sessions techniques locales pour mémoriser votre connexion. Aucun tracker publicitaire n'est actif sur TFRP V3.</p>
                    </section>
                </div>

                <div class="mt-20 pt-10 border-t border-gray-100 text-center">
                    <div class="marianne-block uppercase font-black text-gov-text scale-[0.6] opacity-30 mx-auto">
                        <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                        <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES ADMINISTRATION</div>
                    </div>
                    <p class="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-6">Certification de Protection des Données • V3 Platform</p>
                </div>
            </div>
        </div>
    </div>
`;