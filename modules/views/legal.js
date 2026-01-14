
import { state } from '../state.js';
import { router } from '../utils.js';

const LegalNavbar = (title) => `
    <nav class="terminal-nav shrink-0">
        <div class="flex items-center gap-6 md:gap-12">
            <div onclick="router('login')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-transform hover:scale-[0.8]">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <span class="hidden md:block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">${title}</span>
            <button onclick="router('login')" class="px-6 py-2 bg-gov-text text-white font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all rounded-sm shadow-lg">RETOUR PORTAIL</button>
        </div>
    </nav>
`;

const LEGAL_FOOTER = `
    <footer class="py-20 text-center opacity-30 border-t border-gray-100 mt-20">
        <div class="marianne-block uppercase font-black text-gov-text scale-75 inline-flex mb-4">
            <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">Liberté • Égalité • Justice</div>
            <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES ADMINISTRATION</div>
        </div>
        <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">DOCUMENT OFFICIEL • TEAM FRENCH ROLEPLAY • PROPRIÉTÉ DE MATMAT</p>
    </footer>
`;

const TERMS_CONTENT = `
    <div class="space-y-16 text-gray-600 leading-relaxed font-medium animate-in max-w-4xl mx-auto pb-20">
        <div class="bg-gov-light p-10 rounded-[40px] border border-gray-200 mb-10">
            <p class="text-xs text-gov-blue font-black uppercase tracking-[0.3em] mb-2 italic">Avertissement Juridique</p>
            <p class="text-sm">Le présent document constitue le contrat social unifiant les citoyens au sein de la simulation TFRP. L'accès au panel implique une acceptation irrévocable de ces clauses.</p>
        </div>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 1 : Propriété Intellectuelle (Clause MatMat)</h3>
            <p>L'intégralité du code source, du design graphique, des algorithmes de gestion CAD et de l'interface utilisateur est la <b>propriété exclusive de MatMat</b>. Toute reproduction, même partielle, sans autorisation écrite constitue un délit de contrefaçon.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 2 : Objet du Service</h3>
            <p>Le Panel TFRP fournit des services numériques de gestion Roleplay (ERLC). Il est destiné à assurer la persistance des données économiques et administratives de l'État de Californie au sein de la simulation.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 3 : Adhésion et Capacité</h3>
            <p>Conformément à l'Article 1101 du Code Civil français, l'utilisation du service vaut signature du contrat. L'utilisateur doit être membre actif du serveur Discord TFRP pour jouir de ses droits d'accès.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 4 : Valeur de l'Économie Virtuelle</h3>
            <p>La monnaie virtuelle ($) et les actifs répertoriés sont fictifs. Ils n'ont aucune valeur fiduciaire réelle. Toute conversion contre devises réelles (Euro/Dollar/Robux) est formellement interdite (Loi sur les jeux de hasard numériques).</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-red/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-red mb-6 uppercase italic tracking-tighter leading-none">Article 5 : Clause Anti-Sabotage</h3>
            <p>L'exploitation de failles techniques (SQLi, XSS, Brute force) est passible de poursuites. Conformément à la Loi Godfrain (Loi n°88-19 du 5 janvier 1988), l'accès frauduleux à un système de traitement de données est sévèrement puni.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 6 : Devoir de Respect (Code de Conduite)</h3>
            <p>L'utilisateur s'engage à maintenir un comportement civil sur le panel. Les insultes envers l'administration ou les autres citoyens via les modules de communication (bot, rapports) entraîneront une sanction administrative immédiate.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 7 : Droit de Modification Souverain</h3>
            <p>La Fondation (MatMat et Administrateurs) se réserve le droit de modifier, suspendre ou supprimer n'importe quelle donnée citoyenne (Wipe) pour des nécessités d'équilibrage ou de mise à jour système.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 8 : Accréditations Staff</h3>
            <p>Le personnel staff accrédité dispose d'un droit de regard sur les dossiers privés (Banque, Inventaire) dans le seul but de la modération et du bon déroulement des opérations de police (CAD).</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 9 : Force Majeure et Disponibilité</h3>
            <p>TFRP n'est pas tenu par une obligation de résultat concernant la disponibilité 24/7 du service. Les incidents liés à l'hébergeur Supabase ou à l'API Roblox ne sauraient engager la responsabilité de MatMat.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 10 : Liaisons Factionnelles</h3>
            <p>L'appartenance à une faction (LSPD, Gangs, Entreprises) est soumise aux règlements spécifiques de ces dernières, qui viennent compléter mais ne peuvent déroger aux présentes CGU.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 11 : Clause de Juridiction</h3>
            <p>En cas de litige non résolu à l'amiable via le Conseil de la Fondation, les données et logs système feront foi. L'utilisateur accepte la souveraineté décisionnelle de MatMat en dernier recours.</p>
        </section>
    </div>
`;

const PRIVACY_CONTENT = `
    <div class="space-y-16 text-gray-600 leading-relaxed font-medium animate-in max-w-4xl mx-auto pb-20">
        <div class="bg-emerald-50 p-10 rounded-[40px] border border-emerald-100 mb-10">
            <p class="text-xs text-emerald-600 font-black uppercase tracking-[0.3em] mb-2 italic">Protection de la vie privée</p>
            <p class="text-sm">Votre identité numérique est sacrée. Ce document détaille comment nous protégeons vos octets conformément au <b>RGPD (Règlement 2016/679)</b>.</p>
        </div>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 1 : Identité du Responsable (Propriété MatMat)</h3>
            <p>Le traitement des données est opéré sous la responsabilité technique de <b>MatMat</b>, propriétaire exclusif du système. Les données sont hébergées sur des serveurs sécurisés AES-256.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 2 : Collecte via l'API Discord</h3>
            <p>Nous utilisons le protocole OAuth2 pour collecter votre Identifiant Unique (UID), Pseudo et Avatar. Aucune donnée confidentielle Discord (mot de passe, email) n'est jamais transmise au panel.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 3 : Finalité du Traitement</h3>
            <p>Conformément au principe de minimisation des données, nous ne stockons que les informations nécessaires à la gestion du Roleplay : personnages, économie virtuelle et archives judiciaires CAD.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 4 : Base Légale du Consentement</h3>
            <p>Le clic sur "Connexion Discord" constitue un acte positif clair manifestant votre consentement libre, spécifique et éclairé (Article 7 du RGPD).</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 5 : Durée de Conservation</h3>
            <p>Les données actives sont conservées tant que l'utilisateur est membre du réseau TFRP. Les dossiers inactifs depuis plus de 6 mois sont automatiquement archivés ou purgés.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 6 : Destinataires des Données</h3>
            <p>Vos données ne sont transmises à aucun partenaire commercial. Elles sont uniquement accessibles au responsable technique (MatMat) et aux administrateurs staff accrédités.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 7 : Mesures de Sécurité Digitale</h3>
            <p>L'architecture Supabase garantit un chiffrement au repos et en transit. Le système de protection contre le débuggage empêche toute lecture illicite des données volatiles par des tiers.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 8 : Local Storage et Cookies</h3>
            <p>Le panel utilise exclusivement des cookies techniques (JWT) pour maintenir votre session ouverte. Aucune donnée de traçage publicitaire n'est utilisée.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 9 : Le Droit à l'Oubli (Purge Digitale)</h3>
            <p>Conformément à l'Article 17 du RGPD, vous disposez d'un bouton de suppression automatique dans l'onglet "Sécurité". L'effacement est total et définitif après un délai de latence de 72h.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 10 : Droit de Rectification</h3>
            <p>Chaque citoyen peut modifier ses informations d'état civil (Prénom, Nom) via le module de recensement, sous réserve de validation par les services de l'Immigration.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 11 : Réclamations et Contact</h3>
            <p>Pour toute question relative à vos données personnelles, veuillez contacter l'administration via le ticket-système sur le serveur Discord officiel.</p>
        </section>
    </div>
`;

export const TermsView = () => `
    <div class="min-h-screen flex flex-col bg-white overflow-hidden animate-fade-in">
        ${LegalNavbar("Conditions Générales")}
        
        <header class="w-full px-8 py-12 md:py-20 flex flex-col md:flex-row justify-between items-end gap-8 bg-gov-light border-b border-gray-200 shrink-0">
            <div class="max-w-3xl">
                <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-4 flex items-center gap-3">
                    <span class="w-8 h-0.5 bg-gov-blue"></span> RÉGLEMENTATION DE L'ÉTAT
                </div>
                <h2 class="text-5xl md:text-7xl font-black text-gov-text tracking-tighter uppercase italic leading-none">Contrat de<br><span class="text-gov-blue">Service.</span></h2>
                <p class="text-gray-500 text-lg font-medium mt-6 uppercase tracking-widest">Référentiel juridique de la communauté Los Angeles Division</p>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-20">
            ${TERMS_CONTENT}
            ${LEGAL_FOOTER}
        </main>
    </div>
`;

export const PrivacyView = () => `
    <div class="min-h-screen flex flex-col bg-white overflow-hidden animate-fade-in">
        ${LegalNavbar("Confidentialité")}
        
        <header class="w-full px-8 py-12 md:py-20 flex flex-col md:flex-row justify-between items-end gap-8 bg-gov-light border-b border-gray-200 shrink-0">
            <div class="max-w-3xl">
                <div class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-4 flex items-center gap-3">
                    <span class="w-8 h-0.5 bg-emerald-600"></span> SÉCURITÉ DES OCTETS
                </div>
                <h2 class="text-5xl md:text-7xl font-black text-gov-text tracking-tighter uppercase italic leading-none">Protection de<br><span class="text-emerald-600">l'Identité.</span></h2>
                <p class="text-gray-500 text-lg font-medium mt-6 uppercase tracking-widest">Transparence des données et conformité RGPD</p>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-20">
            ${PRIVACY_CONTENT}
            ${LEGAL_FOOTER}
        </main>
    </div>
`;
