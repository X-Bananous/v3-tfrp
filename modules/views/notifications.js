
import { state } from '../state.js';

export const NotificationsView = () => {
    const notifs = state.notifications || [];
    const hasPersonalNotifs = notifs.some(n => n.user_id === state.user?.id);

    return `
    <div class="h-full flex flex-col bg-[#F6F6F6] animate-in overflow-hidden">
        
        <!-- HEADER -->
        <div class="px-8 py-12 bg-white border-b border-gray-200 shrink-0">
            <div class="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-4 flex items-center gap-3">
                        <span class="w-8 h-px bg-gov-blue"></span> CENTRE DE TRANSMISSION
                    </div>
                    <h2 class="text-4xl md:text-6xl font-black text-gov-text uppercase italic tracking-tighter leading-none">Journal des<br><span class="text-gov-blue">Événements.</span></h2>
                    <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-6">Liaison administrative en temps réel</p>
                </div>
                ${hasPersonalNotifs ? `
                    <button onclick="actions.clearNotifications()" class="px-8 py-4 bg-red-50 text-gov-red font-black uppercase text-[10px] tracking-[0.2em] rounded-xl border border-red-100 hover:bg-gov-red hover:text-white transition-all shadow-lg flex items-center gap-3">
                        <i data-lucide="trash-2" class="w-4 h-4"></i> Purger les logs
                    </button>
                ` : ''}
            </div>
        </div>

        <!-- CONTENT -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div class="max-w-4xl mx-auto space-y-6 pb-24">
                ${notifs.length === 0 ? `
                    <div class="flex flex-col items-center justify-center py-32 text-center opacity-30">
                        <div class="w-20 h-20 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center mb-6">
                            <i data-lucide="bell-off" class="w-10 h-10 text-gray-300"></i>
                        </div>
                        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Canal de données vide</p>
                    </div>
                ` : notifs.map(n => {
                    let barColor = 'bg-gov-blue';
                    let iconColor = 'text-gov-blue';
                    let bgColor = 'bg-white';
                    
                    if (n.type === 'warning' || n.type === 'alert') {
                        barColor = 'bg-gov-red';
                        iconColor = 'text-gov-red';
                    } else if (n.type === 'maintenance') {
                        barColor = 'bg-orange-500';
                        iconColor = 'text-orange-500';
                    }

                    return `
                        <div class="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden relative group hover:-translate-y-1 transition-all">
                            <div class="absolute top-0 left-0 w-2 h-full ${barColor}"></div>
                            <div class="p-8 flex gap-8">
                                <div class="w-12 h-12 rounded-2xl bg-gov-light flex items-center justify-center ${iconColor} border border-gray-100 shadow-inner shrink-0">
                                    <i data-lucide="${n.type === 'warning' ? 'alert-triangle' : 'info'}" class="w-6 h-6"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex justify-between items-start mb-2 gap-4">
                                        <div>
                                            <h3 class="font-black text-gov-text text-xl uppercase italic tracking-tight group-hover:text-gov-blue transition-colors">${n.title}</h3>
                                            <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">${new Date(n.created_at).toLocaleString()}</div>
                                        </div>
                                        ${n.is_pinned ? `
                                            <span class="px-2 py-1 bg-gov-blue text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-blue-900/20 shadow-md">Prioritaire</span>
                                        ` : ''}
                                    </div>
                                    <p class="text-gray-500 text-sm leading-relaxed font-medium italic mt-4">"${n.message}"</p>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
                
                <div class="text-center pt-20 pb-10 opacity-30">
                    <div class="marianne-block uppercase font-black text-gov-text scale-50 inline-flex mb-2">
                        <div class="text-[10px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">Liberté • Égalité • Justice</div>
                        <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};
