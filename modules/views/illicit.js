import { state } from '../state.js';
import { CONFIG } from '../config.js';
import { IllicitDashboardView } from './illicit/dashboard.js';
import { IllicitGangsView } from './illicit/gangs.js';
import { IllicitHeistsView } from './illicit/heists.js';
import { IllicitDrugsView } from './illicit/drugs.js';
import { IllicitBountiesView } from './illicit/bounties.js';
import { IllicitMarketView } from './illicit/market.js';

// CATALOGUES
export const BLACK_MARKET_CATALOG = {
    light: [
        { name: "Beretta M9", price: 2800, icon: "target" },
        { name: "Revolver", price: 3000, icon: "circle-dot" },
        { name: "Colt M1911", price: 3500, icon: "target" },
        { name: "Colt Python", price: 4200, icon: "circle-dot" },
        { name: "Desert Eagle", price: 4500, icon: "triangle" },
        { name: "Lampe Torche", price: 20, icon: "flashlight" },
        { name: "Marteau", price: 20, icon: "hammer" },
        { name: "Lockpick", price: 50, icon: "key" },
        { name: "Sac", price: 100, icon: "shopping-bag" },
        { name: "Coupe Verre", price: 350, icon: "scissors" },
        { name: "Puce ATM", price: 2300, icon: "cpu" }
    ],
    medium: [
        { name: "TEC 9", price: 9500, icon: "zap" },
        { name: "SKORPION", price: 14500, icon: "zap" },
        { name: "Remington 870", price: 16500, icon: "move" },
        { name: "Kriss Vector", price: 20500, icon: "zap" }
    ],
    heavy: [
        { name: "PPSH 41", price: 40000, icon: "flame" },
        { name: "AK47", price: 50000, icon: "flame" }
    ],
    sniper: [
        { name: "Remington MSR", price: 60000, icon: "crosshair" }
    ]
};

export const HEIST_DATA = [
    { id: 'car_theft', name: 'Vol de Voiture', min: 5000, max: 15000, time: 300, icon: 'car', requiresValidation: false, teamMin: 1, teamMax: 2 },
    { id: 'atm', name: 'Braquage ATM', min: 1000, max: 4000, time: 90, icon: 'credit-card', requiresValidation: false, teamMin: 1, teamMax: 3, requiresLocation: true },
    { id: 'house', name: 'Cambriolage Maison', min: 2000, max: 8000, time: 60, icon: 'home', requiresValidation: false, teamMin: 3, teamMax: 5, requiresLocation: true },
    { id: 'gas', name: 'Station Service', min: 3000, max: 10000, time: 105, icon: 'fuel', requiresValidation: false, teamMin: 2, teamMax: 6, requiresLocation: true },
    { id: 'truck', name: 'Fourgon Blindé', min: 150000, max: 300000, time: 900, icon: 'truck', requiresValidation: true, teamMin: 5, teamMax: 10 },
    { id: 'jewelry', name: 'Bijouterie', min: 350000, max: 550000, time: 1020, icon: 'gem', requiresValidation: true, teamMin: 2, teamMax: 9 },
    { id: 'bank', name: 'Banque Centrale', min: 600000, max: 900000, time: 1200, icon: 'landmark', requiresValidation: true, teamMin: 7, teamMax: 13 }
];

export const DRUG_DATA = {
    coke: { name: 'Cocaïne', harvest: { 100: 5, 500: 7, 1000: 35 }, process: { 100: 5, 500: 10, 1000: 30 }, sell: { 100: 7, 500: 13, 1000: 25 }, pricePerG: 60 },
    weed: { name: 'Cannabis', harvest: { 100: 3, 500: 5, 1000: 25 }, process: { 100: 5, 500: 7, 1000: 25 }, sell: { 100: 5, 500: 10, 1000: 25 }, pricePerG: 20 }
};

export const HEIST_LOCATIONS = {
    house: ["7001 Academy PL.", "7011 Franklin court", "7042 Emerson HD", "11091 Maple Street"],
    atm: ["Atm 1 - Banque Centre", "Atm 5 - Géorgia Avenue", "Atm 10 - Maple Street"],
    gas: ["2001 Liberty Way", "4031 Indepence Parkway", "11101 Grand ST"]
};

const refreshBanner = `
    <div class="flex flex-col md:flex-row items-center justify-between px-6 py-3 bg-red-900/10 border-b border-red-500/10 gap-3 shrink-0 relative">
        <div class="text-xs text-red-200 flex items-center gap-2">
             <div class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </div>
            <span><span class="font-bold">DARKNET OS v6.0</span> • Signal Chiffré AES-512</span>
        </div>
        <button onclick="actions.refreshCurrentView()" id="refresh-data-btn" class="text-xs text-red-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap">
            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Synchroniser Canal
        </button>
    </div>
`;

export const IllicitView = () => {
    // Correction de l'accès : On vérifie si l'utilisateur est présent sur le serveur illégal
    // Note: state.user.guilds est un array d'IDs récupéré lors du login OAuth
    const guilds = state.user?.guilds || [];
    const hasIllegalAccess = guilds.includes(CONFIG.GUILD_ILLEGAL) || state.user?.isFounder;

    if (!hasIllegalAccess) {
         return `
            <div class="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-[#050505]">
                <div class="glass-panel max-w-md w-full p-10 rounded-[48px] border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent"></div>
                    <div class="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-500 border border-red-500/20 shadow-2xl relative">
                        <i data-lucide="skull" class="w-12 h-12"></i>
                    </div>
                    <h2 class="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter leading-none">Canal<br>Verrouillé</h2>
                    <p class="text-gray-400 mb-10 leading-relaxed font-medium">L'accès aux fréquences cryptées nécessite une affiliation au réseau clandestin de Los Angeles.</p>
                    <a href="${CONFIG.INVITE_ILLEGAL}" target="_blank" class="glass-btn w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 shadow-xl shadow-red-900/40 uppercase tracking-widest italic">
                        <i data-lucide="external-link" class="w-5 h-5"></i>
                        Rejoindre le Darknet
                    </a>
                    <button onclick="actions.setHubPanel('main')" class="mt-6 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors">Retour au Portail Civil</button>
                </div>
            </div>
         `;
    }

    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full"><div class="loader-spinner border-red-500 mb-4"></div>Décodage du signal...</div>';

    const tabs = [
        { id: 'dashboard', label: 'Réseau', icon: 'layout-dashboard' },
        { id: 'gangs', label: 'Syndicats', icon: 'users' },
        { id: 'heists', label: 'Opérations', icon: 'timer' },
        { id: 'drugs', label: 'Chimie', icon: 'flask-conical' },
        { id: 'bounties', label: 'Mises à prix', icon: 'crosshair' },
        { id: 'market', label: 'Arsenal', icon: 'shopping-cart' }
    ];

    const currentTabId = state.activeIllicitTab || 'dashboard';
    let content = '';

    if (currentTabId === 'dashboard') content = IllicitDashboardView();
    else if (currentTabId === 'gangs') content = IllicitGangsView();
    else if (currentTabId === 'heists') content = IllicitHeistsView();
    else if (currentTabId === 'drugs') content = IllicitDrugsView();
    else if (currentTabId === 'bounties') content = IllicitBountiesView();
    else if (currentTabId.startsWith('market')) content = IllicitMarketView();
    else content = IllicitDashboardView();

    return `
        <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in relative">
            <div class="flex flex-col shrink-0">
                ${refreshBanner}
                
                <div class="px-8 pb-4 pt-4 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[#050505] relative">
                    <div>
                        <h2 class="text-4xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
                            <i data-lucide="skull" class="w-10 h-10 text-red-500"></i>
                            Clandestinité
                        </h2>
                        <div class="flex items-center gap-3 mt-1">
                             <span class="text-[10px] text-red-500/60 font-black uppercase tracking-widest">California Dark-Net v6.0</span>
                             <span class="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                             <span class="text-[10px] text-gray-600 font-black uppercase tracking-widest">Accès Certifié - Niveau 5</span>
                        </div>
                    </div>
                    <div class="flex flex-nowrap gap-2 bg-white/5 p-1.5 rounded-2xl overflow-x-auto max-w-full no-scrollbar border border-white/5 shadow-inner">
                        ${tabs.map(t => `
                            <button onclick="actions.setIllicitTab('${t.id}')" 
                                class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${(currentTabId === t.id || (t.id === 'market' && currentTabId.startsWith('market'))) ? 'bg-red-600 text-white shadow-xl shadow-red-900/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}">
                                <i data-lucide="${t.icon}" class="w-4 h-4"></i> ${t.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="flex-1 p-8 overflow-hidden relative min-h-0">
                <div class="h-full overflow-hidden">
                    ${content}
                </div>
            </div>
        </div>
    `;
};