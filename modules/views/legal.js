
import { state } from '../state.js';
import { router } from '../utils.js';

const refreshBanner = (title) => `
    <div class="flex flex-col md:flex-row items-center justify-between px-6 py-3 bg-gov-blue/5 border-b border-gov-blue/10 gap-3 shrink-0 relative z-20">
        <div class="text-[10px] text-gov-blue flex items-center gap-2 font-black uppercase tracking-[0.2em]">
             <div class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-gov-blue"></span>
            </div>
            <span><span class="font-bold">CAD SYSTEM</span> • PROTECTION JURIDIQUE CERTIFIÉE</span>
        </div>
        <div class="text-[9px] text-gray-400 font-mono uppercase tracking-widest">${title}</div>
    </div>
`;

const LEGAL_FOOTER = `
    <footer class="py-20 text-center opacity-30 border-t border-gray-100 mt-20">
        <div class="marianne-block uppercase font-black text-gov-text scale-75 inline-flex mb-4">
            <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">Liberté • Égalité • Justice</div>
            <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES ADMINISTRATION</div>
        </div>
        <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">DOCUMENT OFFICIEL • TEAM FRENCH ROLEPLAY • v6.3</p>
    </footer>
`;

const TERMS_CONTENT = `
    <div class="space-y-16 text-gray-600 leading-relaxed font-medium animate-in max-w-4xl mx-auto">
        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-3xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">1. PRÉAMBULE ET OBJET</h3>
            <p class="mb-4">Le présent terminal, dénommé "Panel TFRP", constitue l'interface logicielle officielle de gestion citoyenne pour la communauté Team French Roleplay. Il assure la persistance des données liées à l'État de Californie (Emergency Response: Liberty County).</p>
            <p>L'utilisation de ce service est conditionnée par l'adhésion totale aux présentes Conditions Générales. Tout accès via Discord constitue une signature numérique de ce contrat social virtuel.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-3xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">2. NATURE DE L'ÉCONOMIE VIRTUELLE</h3>
            <p class="mb-4">Les fonds monétaires ($) et actifs (biens, entreprises, stocks) répertoriés sur ce panel sont strictement fictifs et destinés uniquement à l'expérience Roleplay. Ils ne possèdent aucune valeur fiduciaire réelle.</p>
            <div class="bg-gov-red/5 border border-gov-red/20 p-6 rounded-3xl mb-4">
                <p class="text-[10px] text-gov-red font-black uppercase tracking-widest mb-2">CLAUSE DE TOLÉRANCE ZÉRO :</p>
                <p class="text-sm italic text-gov-red/80">Toute transaction d'actifs virtuels contre de l'argent réel (RMT) entraînera un bannissement définitif et immédiat de l'intégralité du réseau TFRP.</p>
            </div>
            <p>L'Administration se réserve le droit de procéder à des purges monétaires (Wipes) pour des raisons d'équilibre systémique.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-red/20 rounded-full"></div>
            <h3 class="text-3xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">3. ÉTHIQUE ET SÉCURITÉ DES SYSTÈMES</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                    <h4 class="font-black text-gov-blue text-xs uppercase tracking-widest">LUTTE CONTRE L'EXPLOITATION</h4>
                    <p class="text-sm">L'exploitation de bugs, de failles de duplication ou de scripts d'automatisation non autorisés est considérée comme un sabotage du service.</p>
                </div>
                <div class="space-y-4">
                    <h4 class="font-black text-gov-blue text-xs uppercase tracking-widest">CONFIDENTIALITÉ CAD</h4>
                    <p class="text-sm">Les agents publics (LEO, EMS, Justice) sont tenus au secret professionnel concernant les données consultées sur le CAD. Le meta-gaming est proscrit.</p>
                </div>
            </div>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-3xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">4. RESPONSABILITÉ</h3>
            <p>L'équipe TFRP s'engage à une obligation de moyens pour maintenir le service en ligne. Toutefois, nous ne pourrons être tenus responsables en cas de perte accidentelle de données liée à des instabilités d'hébergement ou de synchronisation avec l'API Roblox/ERLC.</p>
        </section>
    </div>
`;

const PRIVACY_CONTENT = `
    <div class="space-y-16 text-gray-600 leading-relaxed font-medium animate-in max-w-4xl mx-auto">
        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-3xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">1. COLLECTE DES DONNÉES DISCORD</h3>
            <p class="mb-4">Conformément aux standards OAuth2, nous collectons les informations strictement nécessaires à votre identification :</p>
            <ul class="space-y-3 font-mono text-[11px] uppercase tracking-wider text-emerald-700 bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <li class="flex items-center gap-3"><i data-lucide="check" class="w-3 h-3"></i> Identifiant Discord Unique (UID)</li>
                <li class="flex items-center gap-3"><i data-lucide="check" class="w-3 h-3"></i> Pseudonyme Global et Avatar</li>
                <li class="flex items-center gap-3"><i data-lucide="check" class="w-3 h-3"></i> Appartenance au serveur (Vérification d'accès)</li>
            </ul>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-3xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">2. USAGE DES MÉTRIPHONES CITOYENS</h3>
            <p>Vos données de personnages (Noms, Inventaires, Transactions, Casiers) sont stockées pour assurer la continuité de votre expérience. Ces données sont accessibles uniquement au personnel staff accrédité et aux services publics compétents (LEO/Justice) dans le cadre de leurs fonctions RP.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-orange-500/20 rounded-full"></div>
            <h3 class="text-3xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">3. DROITS ET PURGE (RGPD)</h3>
            <p class="mb-6">Vous disposez d'un droit souverain sur vos informations. L'onglet "Sécurité" de votre profil permet de déclencher une purge totale.</p>
            <div class="bg-orange-50 border border-orange-200 p-8 rounded-[32px] flex items-start gap-6">
                <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm shrink-0 border border-orange-100">
                    <i data-lucide="trash-2" class="w-6 h-6"></i>
                </div>
                <div>
                    <h4 class="font-black text-orange-700 text-sm uppercase tracking-widest mb-2">PROCÉDURE DE SUPPRESSION</h4>
                    <p class="text-xs italic leading-relaxed">Une fois la demande validée, vos données sont marquées pour destruction. Un délai de 72h est appliqué avant l'effacement définitif et irréversible de nos serveurs.</p>
                </div>
            </div>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-3xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">4. TRANSMISSION À DES TIERS</h3>
            <p>Team French Roleplay s'engage solennellement à ne jamais vendre, louer ou céder vos données à des entités tierces. Le Panel est un projet communautaire non-lucratif.</p>
        </section>
    </div>
`;

export const TermsView = () => `
    <div class="min-h-screen flex flex-col bg-white overflow-hidden animate-fade-in">
        ${refreshBanner("CONDITIONS GÉNÉRALES")}
        
        <header class="w-full px-8 py-12 md:py-20 flex flex-col md:flex-row justify-between items-end gap-8 bg-gov-light border-b border-gray-200 shrink-0">
            <div class="max-w-3xl">
                <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-4 flex items-center gap-3">
                    <span class="w-8 h-0.5 bg-gov-blue"></span> RÉGLEMENTATION OFFICIELLE
                </div>
                <h2 class="text-5xl md:text-7xl font-black text-gov-text tracking-tighter uppercase italic leading-none">Contrat de<br><span class="text-gov-blue">Service.</span></h2>
                <p class="text-gray-500 text-lg font-medium mt-6 uppercase tracking-widest">Règles fondamentales de la communauté Los Angeles Division</p>
            </div>
            <button onclick="router('login')" class="px-10 py-5 bg-gov-text text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all transform active:scale-95">
                RETOUR AU PORTAIL
            </button>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-20">
            ${TERMS_CONTENT}
            ${LEGAL_FOOTER}
        </main>
    </div>
`;

export const PrivacyView = () => `
    <div class="min-h-screen flex flex-col bg-white overflow-hidden animate-fade-in">
        ${refreshBanner("POLITIQUE DE CONFIDENTIALITÉ")}
        
        <header class="w-full px-8 py-12 md:py-20 flex flex-col md:flex-row justify-between items-end gap-8 bg-gov-light border-b border-gray-200 shrink-0">
            <div class="max-w-3xl">
                <div class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-4 flex items-center gap-3">
                    <span class="w-8 h-0.5 bg-emerald-600"></span> PROTECTION DES DONNÉES
                </div>
                <h2 class="text-5xl md:text-7xl font-black text-gov-text tracking-tighter uppercase italic leading-none">Sûreté de<br><span class="text-emerald-600">l'Identité.</span></h2>
                <p class="text-gray-500 text-lg font-medium mt-6 uppercase tracking-widest">Conformité RGPD et respect de la vie privée numérique</p>
            </div>
            <button onclick="router('login')" class="px-10 py-5 bg-gov-text text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all transform active:scale-95">
                RETOUR AU PORTAIL
            </button>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-20">
            ${PRIVACY_CONTENT}
            ${LEGAL_FOOTER}
        </main>
    </div>
`;
