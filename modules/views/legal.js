
import { state } from '../state.js';
import { router } from '../utils.js';

const refreshBanner = (title) => `
    <div class="flex flex-col md:flex-row items-center justify-between px-6 py-3 bg-blue-900/10 border-b border-blue-500/10 gap-3 shrink-0 relative z-20">
        <div class="text-[10px] text-blue-200 flex items-center gap-2 font-black uppercase tracking-[0.2em]">
             <div class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </div>
            <span><span class="font-bold">CAD SYSTEM</span> • PROTECTION JURIDIQUE CERTIFIÉE</span>
        </div>
        <div class="text-[9px] text-gray-500 font-mono uppercase tracking-widest">${title}</div>
    </div>
`;

const TERMS_CONTENT = `
    <div class="space-y-12 text-gray-400 leading-relaxed font-medium animate-in">
        <section class="relative">
            <div class="absolute -left-6 top-0 w-1 h-full bg-blue-600/30"></div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">1. Objet du Service</h3>
            <p>Le présent terminal (ci-après "Panel TFRP") constitue l'interface officielle de gestion pour la communauté Team French Roleplay. Il centralise les données économiques, administratives et judiciaires nécessaires au bon déroulement des sessions de jeu sur Emergency Response: Liberty County.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-6 top-0 w-1 h-full bg-blue-600/30"></div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">2. Accès & Authentification</h3>
            <p>L'accès est strictement réservé aux membres actifs du serveur Discord TFRP. L'utilisation du protocole OAuth2 Discord est obligatoire pour l'identification. Tout bannissement du serveur Discord entraîne la suspension immédiate et définitive de l'accès au Panel.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-6 top-0 w-1 h-full bg-blue-600/30"></div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">3. Économie Virtuelle</h3>
            <p>Toute monnaie ($) affichée sur ce panel est purement fictive et n'a aucune valeur marchande réelle. Elle ne peut en aucun cas être convertie en devises réelles. L'administration se réserve le droit de réinitialiser tout ou partie des soldes pour des raisons d'équilibrage ou de "Wipe" communautaire.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-6 top-0 w-1 h-full bg-red-600/30"></div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter text-red-500">4. Lutte contre l'Exploitation</h3>
            <p>L'utilisation de failles de sécurité, bugs de duplication ou toute manipulation technique visant à altérer les données sans autorisation est passible d'une exclusion définitive de la communauté. Le "Meta-Gaming" via les informations du panel est strictement encadré par le règlement général.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-6 top-0 w-1 h-full bg-blue-600/30"></div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">5. Responsabilité Administrative</h3>
            <p>L'équipe TFRP ne pourra être tenue responsable en cas de perte accidentelle de données liée à une maintenance technique ou à un incident serveur. Le Panel est fourni "en l'état" pour l'amélioration de l'expérience utilisateur.</p>
        </section>
    </div>
`;

const PRIVACY_CONTENT = `
    <div class="space-y-12 text-gray-400 leading-relaxed font-medium animate-in">
        <section class="relative">
            <div class="absolute -left-6 top-0 w-1 h-full bg-emerald-600/30"></div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">1. Données Collectées</h3>
            <p>Conformément au fonctionnement du protocole Discord, nous collectons uniquement :</p>
            <ul class="list-disc pl-5 mt-4 space-y-2 text-sm italic">
                <li>Votre identifiant unique Discord (UID).</li>
                <li>Votre pseudonyme et avatar public.</li>
                <li>Votre appartenance au serveur (pour les accès).</li>
                <li>Les métadonnées de vos personnages (noms, inventaires, transactions).</li>
            </ul>
        </section>

        <section class="relative">
            <div class="absolute -left-6 top-0 w-1 h-full bg-emerald-600/30"></div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">2. Finalité du Traitement</h3>
            <p>Vos données servent exclusivement à la persistance de votre progression Roleplay. Elles permettent aux services de police (LEO) de consulter vos antécédents, aux banques de gérer vos fonds et au staff d'assurer la modération globale.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-6 top-0 w-1 h-full bg-emerald-600/30"></div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">3. Confidentialité et Tiers</h3>
            <p>TFRP s'engage à ne jamais vendre, louer ou partager vos données avec des entités commerciales tierces. L'accès aux informations est restreint au personnel staff accrédité selon les niveaux de permissions définis.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-6 top-0 w-1 h-full bg-orange-600/30"></div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter text-orange-500">4. Droit à l'Oubli (RGPD)</h3>
            <p>Chaque utilisateur dispose d'un droit total de suppression de ses données. Cette procédure peut être initiée directement depuis l'onglet "Sécurité" du Hub Profils. Une période de latence de 72h est appliquée avant l'effacement définitif et irréversible.</p>
        </section>
    </div>
`;

export const TermsView = () => `
    <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in relative">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.05),transparent_70%)] pointer-events-none"></div>
        
        <div class="flex flex-col shrink-0">
            ${refreshBanner("CONDITIONS GÉNÉRALES")}
            
            <div class="px-8 py-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[#050505] relative z-10">
                <div>
                    <h2 class="text-4xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                        <i data-lucide="scale" class="w-10 h-10 text-blue-500"></i>
                        Contrat de<br>Service
                    </h2>
                    <div class="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-3">RÈGLEMENT DE LA COMMUNAUTÉ TFRP v6.3</div>
                </div>
                <button onclick="router('login')" class="glass-btn px-10 py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 hover:text-white transition-all transform active:scale-95">
                    FERMER LE TERMINAL
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 md:px-20 lg:px-40 relative z-10">
            <div class="max-w-4xl mx-auto py-12">
                ${TERMS_CONTENT}
                
                <div class="mt-20 pt-10 border-t border-white/5 text-center opacity-30">
                    <p class="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em]">DOCUMENT OFFICIEL • TEAM FRENCH ROLEPLAY</p>
                </div>
            </div>
        </div>
    </div>
`;

export const PrivacyView = () => `
    <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in relative">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(16,185,129,0.05),transparent_70%)] pointer-events-none"></div>

        <div class="flex flex-col shrink-0">
            ${refreshBanner("CONFIDENTIALITÉ & RGPD")}
            
            <div class="px-8 py-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[#050505] relative z-10">
                <div>
                    <h2 class="text-4xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                        <i data-lucide="shield-check" class="w-10 h-10 text-emerald-500"></i>
                        Protection des<br>Données
                    </h2>
                    <div class="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-3">CONFORMITÉ EUROPÉENNE & RGPD</div>
                </div>
                <button onclick="router('login')" class="glass-btn px-10 py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 hover:text-white transition-all transform active:scale-95">
                    RETOUR ACCUEIL
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 md:px-20 lg:px-40 relative z-10">
            <div class="max-w-4xl mx-auto py-12">
                ${PRIVACY_CONTENT}

                <div class="mt-20 pt-10 border-t border-white/5 text-center opacity-30">
                    <p class="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em]">LIAISON CHIFFRÉE • SERVICES JURIDIQUES TFRP</p>
                </div>
            </div>
        </div>
    </div>
`;
