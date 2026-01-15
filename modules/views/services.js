
import { state } from '../state.js';
import { DispatchView } from './services/dispatch.js';
import { LEOReportsView, LEOMapView } from './services/leo.js';
import { DirectoryView, DossierView, ArchivesView } from './services/common.js';
import { GovView } from './services/gov.js';
import { JusticeView } from './services/justice.js';
import { LawyerExamView } from './services/lawyer_exam.js';

const refreshBanner = `
    <div class="flex flex-col md:flex-row items-center justify-between px-6 py-3 bg-blue-900/10 border-b border-blue-500/10 gap-3 shrink-0 relative">
        <div class="text-xs text-blue-200 flex items-center gap-2">
             <div class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </div>
            <span><span class="font-bold">CAD System v2.4</span> • Liaison Gouvernementale Sécurisée</span>
        </div>
        <button onclick="actions.refreshCurrentView()" id="refresh-data-btn" class="text-xs text-blue-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap">
            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Actualiser Flux
        </button>
    </div>
`;

export const ServicesView = () => {
    const char = state.activeCharacter;
    const job = char?.job || 'unemployed';
    const isIllegal = char?.alignment === 'illegal';
    
    const isLawyer = job === 'lawyer';
    const isGov = job === 'maire' || job === 'adjoint';
    const isJustice = job === 'juge' || job === 'procureur';
    
    // ACCES STRICT : Pas d'illégal et doit avoir un métier accrédité
    const isAllowed = !isIllegal && ['leo', 'lafd', 'ladot', 'lawyer', 'maire', 'adjoint', 'juge', 'procureur'].includes(job);

    if (!isAllowed) {
         return `<div class="h-full flex flex-col items-center justify-center text-gray-500 animate-fade-in bg-[#050505]">
            <div class="w-24 h-24 bg-gray-800/30 rounded-full flex items-center justify-center mb-6 border border-gray-700/50 shadow-2xl">
                <i data-lucide="shield-off" class="w-10 h-10 opacity-50"></i>
            </div>
            <h2 class="text-xl font-bold text-white mb-2 italic uppercase tracking-tighter">Accès Refusé</h2>
            <p class="text-sm uppercase font-black tracking-widest text-gray-600">Terminal réservé au personnel civil accrédité</p>
            ${isIllegal ? '<p class="text-[10px] text-red-500 font-bold uppercase mt-4 tracking-widest bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20 shadow-lg">Interdit aux membres du secteur clandestin</p>' : ''}
         </div>`;
    }

    if ((isLawyer || isJustice) && !char.bar_passed) {
        return LawyerExamView();
    }

    const tab = state.activeServicesTab;
    let mainContent = '';

    if (tab === 'dispatch') mainContent = DispatchView(job);
    else if (tab === 'directory') mainContent = DirectoryView(job);
    else if (tab === 'reports') mainContent = LEOReportsView();
    else if (tab === 'map') mainContent = LEOMapView();
    else if (tab.startsWith('gov_')) mainContent = GovView(tab);
    else if (tab === 'justice_docket') mainContent = JusticeView();
    else if (tab === 'dossier_detail') mainContent = DossierView(job);
    else if (tab === 'full_reports') mainContent = ArchivesView();
    else {
        mainContent = isJustice ? JusticeView() : isGov ? GovView('gov_dashboard') : DispatchView(job);
    }

    const themeColor = isJustice ? 'text-purple-400' : 'text-blue-500';
    const themeIcon = isJustice ? 'gavel' : 'shield-check';

    return `
        <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in relative">
            <div class="flex flex-col shrink-0">
                ${refreshBanner}
                <div class="px-8 pb-4 pt-4 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[#050505] relative">
                    <div>
                        <h2 class="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
                            <i data-lucide="${themeIcon}" class="w-8 h-8 ${themeColor}"></i> Terminal Services
                        </h2>
                        <p class="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">Module Actif : ${tab.toUpperCase()}</p>
                    </div>
                </div>
            </div>
            <div class="flex-1 p-8 overflow-hidden relative min-h-0">
                <div class="h-full overflow-hidden">
                    ${mainContent}
                </div>
            </div>
        </div>
    `;
};
