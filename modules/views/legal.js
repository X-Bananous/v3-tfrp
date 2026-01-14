
import { state } from '../state.js';
import { router } from '../utils.js';

const LegalNavbar = (title) => `
    <nav class="terminal-nav shrink-0">
        <div class="flex items-center gap-6 md:gap-12 h-full">
            <div onclick="router('login')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-transform hover:scale-[0.8]">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
            </div>
        </div>
        <div class="flex items-center gap-4 h-full">
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
            <p>L'intégralité du code source, du design graphique, des algorithmes de gestion CAD et de l'interface utilisateur est la <b>propriété exclusive de MatMat</b>. Toute reproduction, même partielle, sans autorisation écrite constitue un délit de contrefaçon sanctionné par l'Article L335-2 du Code de la propriété intellectuelle.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 2 : Objet du Service</h3>
            <p>Le Panel TFRP fournit des services numériques de gestion Roleplay (ERLC). Il est destiné à assurer la persistance des données économiques et administratives de l'État de Californie au sein de la simulation. Le service est fourni "en l'état" pour un usage ludique.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 3 : Adhésion et Capacité</h3>
            <p>Conformément à l'Article 1101 du Code Civil français, l'utilisation du service vaut signature du contrat. L'utilisateur doit être membre actif du serveur Discord TFRP pour jouir de ses droits d'accès. Un bannissement Discord entraîne la déchéance des droits d'accès au panel.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 4 : Valeur de l'Économie Virtuelle</h3>
            <p>La monnaie virtuelle ($) et les actifs répertoriés sont fictifs. Ils n'ont aucune valeur fiduciaire réelle. Toute conversion contre devises réelles (Euro/Dollar/Robux) est formellement interdite et constitue une violation des conditions de service de Roblox et TFRP.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-red/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-red mb-6 uppercase italic tracking-tighter leading-none">Article 5 : Clause Anti-Sabotage (Loi Godfrain)</h3>
            <p>L'exploitation de failles techniques (SQLi, XSS, Brute force) est passible de poursuites. Conformément à la Loi Godfrain (Loi n°88-19), l'accès ou le maintien frauduleux dans un système de traitement automatisé de données est puni de deux ans d'emprisonnement et de 60 000 € d'amende.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 6 : Devoir de Respect (Code de Conduite)</h3>
            <p>L'utilisateur s'engage à maintenir un comportement civil sur le panel. Les insultes envers l'administration (MatMat et Staff) ou les autres citoyens via les modules de communication (bot, rapports) entraîneront une sanction administrative immédiate.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 7 : Droit de Modification Souverain</h3>
            <p>La Fondation (MatMat et Administrateurs) se réserve le droit de modifier, suspendre ou supprimer n'importe quelle donnée citoyenne (Wipe) pour des nécessités d'équilibrage ou de mise à jour système sans préavis.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 8 : Accréditations Staff et Secret Professionnel</h3>
            <p>Le personnel staff accrédité dispose d'un droit de regard sur les dossiers privés (Banque, Inventaire) dans le seul but de la modération. La divulgation hors RP de ces informations est sanctionnée par le renvoi immédiat.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 9 : Force Majeure et Disponibilité</h3>
            <p>TFRP n'est pas tenu par une obligation de résultat concernant la disponibilité 24/7 du service. Les incidents liés à l'hébergeur Supabase ou à l'API Roblox ne sauraient engager la responsabilité technique de MatMat.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 10 : Liaisons Factionnelles et Hiérarchie</h3>
            <p>L'appartenance à une faction (LSPD, Gangs, Entreprises) est soumise aux règlements internes. Toute insubordination ou corruption majeure peut entraîner une saisie administrative des actifs sur décision d'un Magistrat.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-gov-blue/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 11 : Juridiction et Règlement des Litiges</h3>
            <p>En cas de litige non résolu à l'amiable via le Conseil de la Fondation, les logs système font foi. L'utilisateur accepte la souveraineté décisionnelle de MatMat en dernier recours pour toute question technique ou disciplinaire.</p>
        </section>
    </div>
`;

const PRIVACY_CONTENT = `
    <div class="space-y-16 text-gray-600 leading-relaxed font-medium animate-in max-w-4xl mx-auto pb-20">
        <div class="bg-emerald-50 p-10 rounded-[40px] border border-emerald-100 mb-10">
            <p class="text-xs text-emerald-600 font-black uppercase tracking-[0.3em] mb-2 italic">Protection de la vie privée</p>
            <p class="text-sm">Votre identité numérique est protégée. Ce document détaille comment nous protégeons vos octets conformément au <b>RGPD (Règlement Européen 2016/679)</b>.</p>
        </div>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 1 : Responsable du Traitement (Propriété MatMat)</h3>
            <p>Le traitement des données personnelles est opéré sous la responsabilité de <b>MatMat</b>. Les données sont hébergées sur l'infrastructure sécurisée de Supabase avec un chiffrement AES-256 au repos.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 2 : Collecte via le Protocole OAuth2</h3>
            <p>Nous utilisons l'API Discord pour collecter votre Identifiant Unique (UID), Pseudo, Avatar et appartenance aux guildes. Aucune donnée confidentielle telle que votre mot de passe Discord ne nous est transmise.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 3 : Finalité et Minimisation des Données</h3>
            <p>Conformément au principe de minimisation (Article 5 du RGPD), nous ne stockons que les informations strictement nécessaires : fiches personnages, économie virtuelle et archives judiciaires CAD pour le bon fonctionnement du jeu.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 4 : Base Légale du Consentement</h3>
            <p>Le clic sur "Connexion Discord" constitue un acte positif clair manifestant votre consentement libre, spécifique et éclairé (Article 7 du RGPD). Vous pouvez retirer ce consentement par la suppression de votre compte.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 5 : Durée de Conservation des Données</h3>
            <p>Les données sont conservées tant que l'utilisateur est membre du réseau TFRP. Les comptes inactifs depuis plus de 6 mois sont automatiquement purgés pour respecter le droit à l'oubli.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 6 : Destinataires et Non-Transmission</h3>
            <p>Vos données ne sont transmises à aucun partenaire commercial tiers. Elles sont uniquement accessibles au propriétaire technique (MatMat) et aux administrateurs staff accrédités pour la modération.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 7 : Droit d'Accès et de Portabilité</h3>
            <p>Chaque utilisateur peut consulter l'intégralité de ses données via son profil sur le panel. La portabilité est assurée par l'affichage transparent des inventaires et des soldes bancaires.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 8 : Mesures de Sécurité Digitale</h3>
            <p>Nous mettons en œuvre des protections contre le débuggage et l'injection pour garantir l'intégrité de la base de données. Le transport des données est sécurisé par le protocole HTTPS/TLS.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 9 : Cookies et Local Storage</h3>
            <p>Le panel utilise exclusivement des cookies techniques (JWT) pour maintenir votre session ouverte. Aucun cookie de pistage publicitaire ou analytique n'est utilisé.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-orange-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 10 : Droit à l'Oubli et Purge Digitale</h3>
            <p>Conformément à l'Article 17 du RGPD, vous disposez d'une fonction de suppression irréversible dans l'onglet "Sécurité". L'effacement total intervient après un délai de réflexion de 72h.</p>
        </section>

        <section class="relative">
            <div class="absolute -left-8 top-0 w-1 h-full bg-emerald-500/20 rounded-full"></div>
            <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">Article 11 : Réclamations et Contact CNIL</h3>
            <p>Pour toute question relative à vos données, contactez <b>MatMat</b> via le Discord officiel. En cas de désaccord persistant, vous avez le droit de porter plainte auprès de la CNIL.</p>
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
