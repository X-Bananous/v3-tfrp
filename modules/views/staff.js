
import { state } from '../state.js';
import { CONFIG } from '../config.js';
import { hasPermission } from '../utils.js';

// Sous-vues
import { StaffCitizensView } from './staff/citizens.js';
import { StaffEconomyView } from './staff/economy.js';
import { StaffIllegalView } from './staff/illegal.js';
import { StaffEnterpriseView } from './staff/enterprise.js';
import { StaffPermissionsView } from './staff/permissions.js';
import { StaffSessionsView } from './staff/sessions.js';
import { StaffLogsView } from './staff/logs.js';
import { StaffSanctionsView } from './staff/sanctions.js';

const refreshBanner = `
    <div class="flex flex-col md:flex-row items-center justify-between px-6 py-3 bg-purple-900/10 border-b border-purple-500/10 gap-3 shrink-0 z-20 relative">
        <div class="text-[10px] text-purple-200 flex items-center gap-2 font-black uppercase tracking-[0.2em]">
             <div class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </div>
            <span><span class="font-bold">Protocol Terminal</span> • Accès Fondation v6.0</span>
        </div>
        <button onclick="actions.refreshCurrentView()" id="refresh-data-btn" class="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap">
            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Sync Monde
        </button>
    </div>
`;

export const StaffView = () => {
    const isFounder = state.user?.isFounder || state.adminIds.includes(state.user?.id);
    const hasAnyPerm = Object.keys(state.user?.permissions || {}).some(k => state.user.permissions[k] === true) || isFounder;

    if (!hasAnyPerm) {
         return `<div class="h-full flex flex-col items-center justify-center p-8 text-center bg-[#050505]"><h2 class="text-white font-black uppercase">Accès Fondation Restreint</h2></div>`;
    }

    const activeTabId = state.activeStaffTab || 'citizens';
    const tabMap = {
        citizens: StaffCitizensView,
        economy: StaffEconomyView,
        illegal: StaffIllegalView,
        enterprise: StaffEnterpriseView,
        permissions: StaffPermissionsView,
        sessions: StaffSessionsView,
        logs: StaffLogsView,
        sanctions: StaffSanctionsView
    };

    const content = (tabMap[activeTabId] || StaffCitizensView)();
    const isOnDuty = state.onDutyStaff?.some(s => s.id === state.user.id);

    return `
        <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in relative">
            ${refreshBanner}
            <div class="px-8 pb-4 pt-6 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[#050505] shrink-0 relative z-30">
                <div>
                    <h2 class="text-4xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter">
                        <i data-lucide="shield" class="w-10 h-10 text-purple-500"></i> Fondation
                    </h2>
                    <p class="text-[10px] text-purple-500/60 font-black uppercase tracking-widest mt-1">Régistration : ${activeTabId.toUpperCase()} • ${isOnDuty ? 'En Service' : 'Consultation'}</p>
                </div>
                <div class="flex gap-4">
                    ${isOnDuty ? 
                        `<button onclick="actions.confirmToggleDuty(true)" class="px-6 py-2.5 rounded-xl text-[10px] font-black bg-emerald-600 text-white transition-all flex items-center gap-3 uppercase tracking-widest shadow-xl"><i data-lucide="user-check" class="w-4 h-4"></i> LIVE</button>` : 
                        `<button onclick="actions.confirmToggleDuty(false)" class="px-6 py-2.5 rounded-xl text-[10px] font-black bg-white/5 text-gray-500 border border-white/10 hover:text-white transition-all flex items-center gap-3 uppercase tracking-widest">OFF DUTY</button>`
                    }
                </div>
            </div>
            <div class="flex-1 p-8 overflow-y-auto custom-scrollbar relative min-h-0">
                ${content}
            </div>
        </div>
    `;
};
