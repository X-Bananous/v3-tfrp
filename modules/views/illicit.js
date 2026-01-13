
import { state } from '../state.js';
import { CONFIG } from '../config.js';
import { IllicitDashboardView } from './illicit/dashboard.js';
import { IllicitGangsView } from './illicit/gangs.js';
import { IllicitHeistsView } from './illicit/heists.js';
import { IllicitDrugsView } from './illicit/drugs.js';
import { IllicitBountiesView } from './illicit/bounties.js';
import { IllicitMarketView } from './illicit/market.js';
import { IllicitViewCheck } from '../services.js'; // Import du check corrigé

// ... (CATALOGUES & HEISTS CONSTANTS) ...

export const IllicitView = () => {
    if (!IllicitViewCheck()) {
         return `
            <div class="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-white">
                <div class="max-w-md w-full p-10 border border-red-200 rounded-sm bg-red-50">
                    <div class="w-20 h-20 bg-white text-gov-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-red-100">
                        <i data-lucide="skull" class="w-10 h-10"></i>
                    </div>
                    <h2 class="text-2xl font-black text-gov-text mb-4 uppercase italic">Fréquence Restreinte</h2>
                    <p class="text-gray-500 mb-10 leading-relaxed font-medium">L'accès au réseau clandestin nécessite d'être membre du Syndicat (Discord). Votre identité n'est pas reconnue.</p>
                    <a href="${CONFIG.INVITE_ILLEGAL}" target="_blank" class="block w-full py-4 bg-gov-red text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl italic transition-all hover:bg-black">Rejoindre la faction</a>
                </div>
            </div>
         `;
    }

    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full"><div class="loader-spinner mb-4 border-gov-red"></div>Initialisation du canal chiffré...</div>';

    const tabs = [
        { id: 'dashboard', label: 'Monitor', icon: 'layout-dashboard' },
        { id: 'gangs', label: 'Affiliations', icon: 'users' },
        { id: 'heists', label: 'Opérations', icon: 'timer' },
        { id: 'drugs', label: 'Synthèse', icon: 'flask-conical' },
        { id: 'market', label: 'Logistique', icon: 'shopping-cart' }
    ];

    const currentTabId = state.activeIllicitTab || 'dashboard';
    let content = '';

    if (currentTabId === 'dashboard') content = IllicitDashboardView();
    else if (currentTabId === 'gangs') content = IllicitGangsView();
    else if (currentTabId === 'heists') content = IllicitHeistsView();
    else if (currentTabId === 'drugs') content = IllicitDrugsView();
    else if (currentTabId.startsWith('market')) content = IllicitMarketView();
    else content = IllicitDashboardView();

    return `
        <div class="h-full flex flex-col bg-white overflow-hidden animate-fade-in relative">
            <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                <div>
                    <h2 class="text-2xl font-black text-gov-text flex items-center gap-3 uppercase italic italic">
                        <i data-lucide="skull" class="w-6 h-6 text-gov-red"></i> Shadow Network
                    </h2>
                    <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Liaison Clandestine Certifiée • État de Californie</p>
                </div>
                <div class="flex gap-2 p-1 bg-gray-50 rounded-sm border border-gray-200">
                    ${tabs.map(t => `
                        <button onclick="actions.setIllicitTab('${t.id}')" 
                            class="px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shrink-0 
                            ${(currentTabId === t.id) ? 'bg-gov-red text-white shadow-lg' : 'text-gray-400 hover:text-gov-red'}">
                            <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i> ${t.label}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="flex-1 p-8 overflow-y-auto custom-scrollbar">
                ${content}
            </div>
        </div>
    `;
};
