
import { state } from '../state.js';

export const NotificationsView = () => {
    const notifs = state.notifications || [];

    return `
    <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in relative">
        <div class="px-10 pb-6 pt-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[#050505] relative z-10 shrink-0">
            <div>
                <h2 class="text-4xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter">
                    <i data-lucide="bell" class="w-10 h-10 text-blue-500"></i>
                    Terminal Log
                </h2>
                <div class="flex items-center gap-3 mt-1">
                     <span class="text-[10px] text-blue-500 font-black uppercase tracking-widest">Flux de Données Système</span>
                     <span class="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                     <span class="text-[10px] text-gray-600 font-black uppercase tracking-widest">${notifs.length} Signaux Actifs</span>
                </div>
            </div>
            
            <button onclick="actions.clearNotifications()" class="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-red-600/20 transition-all flex items-center gap-3 group">
                <i data-lucide="trash-2" class="w-4 h-4 group-hover:scale-110 transition-transform"></i> Purge Registre
            </button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-4 pb-32">
            ${notifs.length === 0 ? `
                <div class="flex flex-col items-center justify-center py-40 opacity-20 text-center">
                    <i data-lucide="bell-off" class="w-20 h-20 mb-4 text-gray-600"></i>
                    <p class="text-xl font-black uppercase tracking-[0.4em]">Signal Inactif</p>
                    <p class="text-xs font-bold uppercase tracking-widest text-gray-700 mt-2">En attente de transmission...</p>
                </div>
            ` : notifs.map(n => {
                let color = 'blue';
                if (n.type === 'warning') color = 'red';
                if (n.type === 'maintenance') color = 'orange';
                if (n.type === 'success') color = 'emerald';
                
                return `
                    <div class="p-6 bg-white/[0.02] rounded-[32px] border border-white/5 relative group hover:bg-white/[0.04] transition-all flex gap-8 items-start shadow-2xl overflow-hidden">
                        <div class="absolute top-0 left-10 w-12 h-1 bg-${color}-600/50 rounded-b-full shadow-[0_0_15px_rgba(var(--tw-color-${color}-600),0.4)]"></div>
                        
                        <div class="w-16 h-16 rounded-[24px] bg-${color}-500/10 flex items-center justify-center text-${color}-400 border border-${color}-500/20 shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                            <i data-lucide="${n.type === 'warning' ? 'alert-triangle' : n.type === 'maintenance' ? 'wrench' : 'info'}" class="w-8 h-8"></i>
                        </div>
                        
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start mb-3 gap-6">
                                <div>
                                    <div class="flex items-center gap-3">
                                        <h3 class="font-black text-white text-xl uppercase italic tracking-tight group-hover:text-${color}-400 transition-colors">${n.title}</h3>
                                        ${n.is_pinned ? `<span class="px-2 py-0.5 bg-blue-600 text-white text-[7px] font-black uppercase rounded shadow-lg border border-blue-400">Prioritaire</span>` : ''}
                                    </div>
                                    <div class="text-[9px] text-gray-600 font-mono mt-1 font-bold tracking-tighter uppercase">
                                        ${new Date(n.created_at).toLocaleString()} • ID_SIGNAL: ${n.id.substring(0,8)}
                                    </div>
                                </div>
                                <button onclick="actions.deleteNotification('${n.id}')" class="p-2.5 rounded-xl text-gray-700 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                                    <i data-lucide="x" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <p class="text-gray-400 text-sm leading-relaxed font-medium italic">"${n.message}"</p>
                        </div>
                    </div>
                `;
            }).join('')}
            
            <div class="pt-20 text-center opacity-10">
                <div class="text-[9px] font-black text-white uppercase tracking-[1em]">END OF LOG BUFFER</div>
            </div>
        </div>
    </div>
    `;
};
