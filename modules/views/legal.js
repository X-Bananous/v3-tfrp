
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
    <div class="space-y-12 text-gray-400 leading-relaxed font-medium animate-in pb-20">
        <section class="relative">
            <div class="absolute -left-8 top-0 w-1.5 h-full bg-blue-600/40 rounded-full"></div>
            <h3 class="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter">1. Champ d'Application</h3>
            <p class="mb-4">Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du terminal de gestion "Panel TFRP", interface logicielle officielle de la communauté Team French Roleplay pour l'État de Californie (Emergency Response: Liberty County).</p>
            <p>Toute connexion au terminal via le protocole d'authentification Discord implique l'acceptation sans réserve de ces conditions. Le Panel TFRP se réserve le droit de modifier les présentes à tout moment pour s'adapter aux évolutions techniques ou aux besoins du Roleplay.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1.5 h-full bg-blue-600/40 rounded-full"></div>
            <h3 class="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter">2. Propriété des Données Virtuelles</h3>
            <p class="mb-4">Toutes les ressources affichées ($ virtuel, objets d'inventaire, entreprises, casiers judiciaires) sont des éléments purement numériques liés à l'expérience de jeu. </p>
            <div class="p-4 bg-orange-600/10 border border-orange-500/20 rounded-2xl text-orange-400 text-xs font-bold uppercase mb-4 tracking-widest">
                Attention : La monnaie ($) n'a aucune valeur marchande réelle. Toute tentative de transaction contre de l'argent réel est passible d'une exclusion définitive.
            </div>
            <p>L'administration TFRP conserve la pleine souveraineté sur ces données et se réserve le droit d'effectuer des réinitialisations (Wipes) totales ou partielles pour garantir l'équilibre économique du serveur.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1.5 h-full bg-red-600/40 rounded-full"></div>
            <h3 class="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter text-red-500">3. Éthique et Sécurité</h3>
            <ul class="list-disc pl-6 space-y-4 italic text-sm">
                <li><strong class="text-white">Exploitation de failles :</strong> L'utilisation de bugs techniques ou de scripts tiers pour altérer les valeurs de base de données est strictement interdite.</li>
                <li><strong class="text-white">Confidentialité Staff :</strong> Les informations consultées par le personnel accrédité via le panel (Casiers, Trésoreries) sont soumises au secret professionnel RP.</li>
                <li><strong class="text-white">Identité :</strong> L'usurpation d'un UID Discord ou d'une fonction gouvernementale sur le panel est un motif de bannissement immédiat.</li>
            </ul>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1.5 h-full bg-blue-600/40 rounded-full"></div>
            <h3 class="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter">4. Limitation de Responsabilité</h3>
            <p>TFRP s'efforce de maintenir le terminal accessible 24/7. Toutefois, des interruptions pour maintenance technique, mises à jour ou incidents réseau peuvent survenir. TFRP ne pourra être tenu responsable des pertes de progression virtuelles résultant de ces interruptions ou d'erreurs de synchronisation avec l'API ERLC.</p>
        </section>
    </div>
`;

const PRIVACY_CONTENT = `
    <div class="space-y-12 text-gray-400 leading-relaxed font-medium animate-in pb-20">
        <section class="relative">
            <div class="absolute -left-8 top-0 w-1.5 h-full bg-emerald-600/40 rounded-full"></div>
            <h3 class="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter">1. Collecte des Informations</h3>
            <p class="mb-4">Dans le cadre de la protection de votre identité numérique, nous limitons la collecte aux données strictement nécessaires fournies par l'API Discord via le scope "identify" :</p>
            <ul class="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-3 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                <li>• Discord ID unique (UID)</li>
                <li>• Pseudonyme et Tag discriminatoire</li>
                <li>• URL de l'Avatar public</li>
                <li>• Appartenance aux serveurs TFRP (pour les accès factions)</li>
            </ul>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1.5 h-full bg-emerald-600/40 rounded-full"></div>
            <h3 class="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter">2. Utilisation et Partage</h3>
            <p class="mb-4">Vos données sont utilisées exclusivement pour :</p>
            <ul class="list-disc pl-6 space-y-2 text-sm italic">
                <li>L'authentification sécurisée au portail.</li>
                <li>La liaison entre votre compte Discord et vos personnages RP.</li>
                <li>La traçabilité des sanctions administratives et judiciaires.</li>
            </ul>
            <p>TFRP garantit qu'aucune donnée personnelle n'est vendue, louée ou cédée à des tiers à des fins publicitaires ou analytiques.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1.5 h-full bg-orange-600/40 rounded-full"></div>
            <h3 class="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter text-orange-500">3. Droits des Utilisateurs (RGPD)</h3>
            <p class="mb-4">Conformément au Règlement Général sur la Protection des Données, vous disposez d'un droit total d'accès, de rectification et de suppression.</p>
            <div class="bg-black/40 p-6 rounded-[32px] border border-orange-500/20 shadow-xl">
                <h4 class="text-sm font-black text-white uppercase mb-3">La Purge Identitaire</h4>
                <p class="text-xs text-gray-500 italic mb-4 leading-relaxed">Le bouton "Détruire mon identité" dans l'onglet Sécurité de votre profil déclenche un script d'effacement irréversible. Toutes vos fiches, comptes bancaires et archives seront supprimés de nos serveurs après un délai de réflexion de 72 heures.</p>
            </div>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1.5 h-full bg-emerald-600/40 rounded-full"></div>
            <h3 class="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter">4. Conservation des Journaux (Logs)</h3>
            <p>Les logs d'activité (transactions, commandes, rapports) sont conservés pour une durée maximale de 6 mois afin de permettre la modération et la résolution des litiges RP, sauf demande de suppression complète du compte.</p>
        </section>
    </div>
`;

export const TermsView = () => `
    <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in relative">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.05),transparent_70%)] pointer-events-none"></div>
        
        <div class="flex flex-col shrink-0">
            ${refreshBanner("PROTOCOLE D'UTILISATION")}
            
            <div class="px-8 py-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[#050505] relative z-10">
                <div>
                    <h2 class="text-5xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                        <i data-lucide="scale" class="w-12 h-12 text-blue-500"></i>
                        Contrat de<br>Service
                    </h2>
                    <div class="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3">RÈGLEMENT DE LA COMMUNAUTÉ TFRP • v6.3 PLATINUM</div>
                </div>
                <button onclick="router('login')" class="glass-btn px-12 py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 hover:text-white transition-all transform active:scale-95">
                    FERMER LE TERMINAL
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 md:px-20 lg:px-40 relative z-10">
            <div class="max-w-4xl mx-auto py-12">
                ${TERMS_CONTENT}
                
                <div class="mt-20 pt-10 border-t border-white/5 text-center opacity-30">
                    <p class="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em]">DOCUMENT OFFICIEL • TEAM FRENCH ROLEPLAY • TOUS DROITS RÉSERVÉS</p>
                </div>
            </div>
        </div>
    </div>
`;

export const PrivacyView = () => `
    <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in relative">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(16,185,129,0.05),transparent_70%)] pointer-events-none"></div>

        <div class="flex flex-col shrink-0">
            ${refreshBanner("CONFORMITÉ RGPD & PRIVACY")}
            
            <div class="px-8 py-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[#050505] relative z-10">
                <div>
                    <h2 class="text-5xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                        <i data-lucide="shield-check" class="w-12 h-12 text-emerald-500"></i>
                        Sûreté des<br>Données
                    </h2>
                    <div class="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3">RÈGLEMENT EUROPÉEN • CONFORMITÉ NUMÉRIQUE TFRP</div>
                </div>
                <button onclick="router('login')" class="glass-btn px-12 py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-600 hover:text-white transition-all transform active:scale-95">
                    RETOUR ACCUEIL
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 md:px-20 lg:px-40 relative z-10">
            <div class="max-w-4xl mx-auto py-12">
                ${PRIVACY_CONTENT}

                <div class="mt-20 pt-10 border-t border-white/5 text-center opacity-30">
                    <p class="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em]">LIAISON CHIFFRÉE • SERVICES JURIDIQUES TFRP • © 2025</p>
                </div>
            </div>
        </div>
    </div>
`;
