
import { state } from '../state.js';
import { CONFIG } from '../config.js';
import { EnterpriseMarketView } from './enterprise/market.js';
import { EnterpriseDirectoryView } from './enterprise/directory.js';
import { EnterpriseMyCompaniesView } from './enterprise/my_companies.js';
import { EnterpriseAppointmentsView } from './enterprise/appointments.js';
import { EnterpriseManageView } from './enterprise/manage.js';

// Bibliothèque d'icônes pour la création d'articles
export const ICON_LIBRARY = [
    "package", "car", "wrench", "utensils", "coffee", "shirt", "shopping-bag", 
    "phone", "monitor", "cpu", "zap", "flame", "shield", "briefcase", "hammer", 
    "scissors", "camera", "music", "gift", "sandwich", "pizza", "beer", "wine", 
    "crosshair", "target", "gem", "hard-hat", "thermometer", "droplets", "radio", "mic"
];

const refreshBanner = `
    <div class="flex flex-col md:flex-row items-center justify-between px-6 py-3 bg-blue-900/10 border-b border-blue-500/10 gap-3 shrink-0 relative">
        <div class="text-xs text-blue-200 flex items-center gap-2">
             <div class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </div>
            <span><span class="font-bold">REGISTRE DU COMMERCE</span> • Signal Certifié AES-256</span>
        </div>
        <button onclick="actions.refreshCurrentView()" id="refresh-data-btn" class="text-xs text-blue-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap">
            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Synchroniser Flux
        </button>
    </div>
`;

export const EnterpriseView = () => {
    const currentTabId = state.activeEnterpriseTab || 'market';
    let content = '';

    if (currentTabId === 'market') content = EnterpriseMarketView();
    else if (currentTabId === 'directory') content = EnterpriseDirectoryView();
    else if (currentTabId === 'my_companies') content = EnterpriseMyCompaniesView();
    else if (currentTabId === 'appointments') content = EnterpriseAppointmentsView();
    else if (currentTabId === 'manage') content = EnterpriseManageView();
    else content = EnterpriseMarketView();

    const isManaging = currentTabId === 'manage' && state.activeEnterpriseManagement;
    const ent = state.activeEnterpriseManagement;
    const entBalance = isManaging ? (ent.name === "L.A. Auto School" ? state.gouvBank : (ent.balance || 0)) : 0;

    return `
        <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in relative">
            <div class="flex flex-col shrink-0">
                ${refreshBanner}
                <div class="px-8 pb-4 pt-4 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[#050505] relative">
                    ${!isManaging ? `
                        <div>
                            <h2 class="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
                                <i data-lucide="building-2" class="w-8 h-8 text-blue-500"></i> Portail Entreprises
                            </h2>
                            <p class="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">Section Actuelle : ${currentTabId.toUpperCase()}</p>
                        </div>
                    ` : `
                        <div class="flex items-center gap-6">
                            <button onclick="actions.setEnterpriseTab('my_companies')" class="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10 group">
                                <i data-lucide="arrow-left" class="w-6 h-6 group-hover:-translate-x-1 transition-transform"></i>
                            </button>
                            <div>
                                <h2 class="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
                                    ${ent.name}
                                    <span class="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-black tracking-[0.2em] border border-blue-400 shadow-lg">GÉRANCE</span>
                                </h2>
                                <div class="flex items-center gap-3 mt-1">
                                    <span class="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest">Trésorerie</span>
                                    <span class="text-sm font-mono font-bold text-emerald-400">$ ${entBalance.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    `}
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
