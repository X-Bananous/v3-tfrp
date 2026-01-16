
import { state } from '../state.js';

export const NotificationsView = () => {
    const notifs = state.notifications || [];

    return `
    <div class="h-full flex flex-col bg-[#F6F6F6] overflow-hidden animate-fade-in">
        <!-- HEADER BUREAUCRATIQUE -->
        <div class="px-8 py-10 bg-white border-b border-gray-200 shrink-0 flex justify-between items-end">
            <div>
                <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-2">Service des Communications de l'État</div>
                <h2 class="text-4xl font-black text-gov-text uppercase italic tracking-tighter leading-none">Journal des <span class="text-gov-blue">Messages.</span></h2>
            </div>
            <div class="text-right">
                <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Dépêches Actives</div>
                <div class="text-2xl font-mono font-black text-gov-text tracking-tighter">${notifs.length}</div>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div class="max-w-4xl mx-auto space-y-6 pb-20">
                ${notifs.length === 0 ? `
                    <div class="flex flex-col items-center justify-center py-40 text-center opacity-30">
                        <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                            <i data-lucide="bell-off" class="w-10 h-10 text-gray-400"></i>
                        </div>
                        <p class="text-sm font-black uppercase tracking-[0.4em] text-gray-500">Aucune dépêche enregistrée</p>
                    </div>
                ` : notifs.map(n => {
                    const isAlert = n.type === 'warning' || n.type === 'maintenance';
                    const colorClass = isAlert ? 'border-gov-red bg-red-50/30' : 'border-gov-blue bg-white';
                    const textClass = isAlert ? 'text-gov-red' : 'text-gov-blue';

                    return `
                        <div class="p-8 rounded-[32px] border-l-8 ${colorClass} shadow-xl relative group transition-all hover:-translate-x-1">
                            <div class="flex justify-between items-start mb-4 gap-6">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-1">
                                        <h3 class="font-black text-gov-text text-xl uppercase italic tracking-tight">${n.title}</h3>
                                        ${n.is_pinned ? `<span class="px-2 py-0.5 bg-gov-blue text-white text-[8px] font-black uppercase rounded">Prioritaire</span>` : ''}
                                    </div>
                                    <div class="text-[9px] text-gray-400 font-mono font-bold uppercase tracking-widest">Publié le ${new Date(n.created_at).toLocaleString()}</div>
                                </div>
                                <div class="w-10 h-10 rounded-xl bg-gov-light flex items-center justify-center ${textClass} shrink-0 border border-gray-100">
                                    <i data-lucide="${isAlert ? 'alert-triangle' : 'info'}" class="w-5 h-5"></i>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 leading-relaxed font-medium italic">"${n.message}"</p>
                        </div>
                    `;
                }).join('')}
                
                <div class="pt-20 text-center">
                    <p class="text-[9px] font-black uppercase tracking-[0.6em] text-gray-300">Fin des transmissions officielles</p>
                </div>
            </div>
        </div>
    </div>
    `;
};
