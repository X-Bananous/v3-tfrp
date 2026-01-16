
import { state } from '../../state.js';
import { hasPermission } from '../../utils.js';

export const StaffSecurityView = () => {
    const isFounder = state.user?.isFounder || state.adminIds.includes(state.user?.id);
    if (!isFounder) {
        return `<div class="p-20 text-center text-gray-600 italic uppercase font-black tracking-[0.3em] opacity-40">Accès restreint au Conseil Supérieur.</div>`;
    }

    // Récupérer les profils ayant demandé une suppression
    const purgesList = state.staffMembers?.filter(m => !!m.deletion_requested_at) || [];
    const logs = state.globalTransactions?.filter(t => t.type === 'admin_adjustment') || [];

    return `
        <div class="h-full flex flex-col gap-10 animate-fade-in">
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- RGPD PURGES -->
                <div class="glass-panel p-8 rounded-[40px] border border-red-500/20 bg-red-950/[0.02] flex flex-col min-h-[400px]">
                    <div class="flex justify-between items-center mb-8 shrink-0">
                        <h3 class="text-xs font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <i data-lucide="user-x" class="w-5 h-5"></i> Files de Purge RGPD (${purgesList.length})
                        </h3>
                        <div class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[8px] font-black uppercase animate-pulse">Latence 72H Active</div>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                        ${purgesList.length === 0 ? `
                            <div class="h-full flex flex-col items-center justify-center opacity-20 text-center">
                                <i data-lucide="shield-check" class="w-12 h-12 mb-4"></i>
                                <p class="text-[10px] font-black uppercase tracking-widest">Aucune identité menacée</p>
                            </div>
                        ` : purgesList.map(p => {
                            const date = new Date(p.deletion_requested_at);
                            const now = new Date();
                            const diff = (date.getTime() + (72 * 60 * 60 * 1000)) - now.getTime();
                            const hoursLeft = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));

                            return `
                                <div class="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
                                    <div class="flex items-center gap-4">
                                        <img src="${p.avatar_url}" class="w-10 h-10 rounded-xl grayscale group-hover:grayscale-0 transition-all border border-white/10">
                                        <div>
                                            <div class="font-black text-white text-sm uppercase italic tracking-tight">${p.username}</div>
                                            <div class="text-[9px] text-gray-500 font-mono mt-0.5">UID: ${p.id}</div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-[10px] text-red-400 font-mono font-black">${hoursLeft}H RESTANTES</div>
                                        <button onclick="actions.cancelUserPurgeAdmin('${p.id}')" class="mt-2 text-[8px] font-black text-gray-600 hover:text-white uppercase tracking-widest underline decoration-dotted">Interrompre</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- GLOBAL AUDIT -->
                <div class="glass-panel p-8 rounded-[40px] border border-white/5 bg-[#0a0a0a] flex flex-col min-h-[400px]">
                    <div class="flex justify-between items-center mb-8 shrink-0">
                        <h3 class="text-xs font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <i data-lucide="scroll-text" class="w-5 h-5"></i> Audit Global (Ajustements Admin)
                        </h3>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <table class="w-full text-left text-[11px] border-separate border-spacing-0">
                            <thead class="text-gray-600 uppercase font-black tracking-widest sticky top-0 bg-[#0a0a0a] z-10 shadow-lg">
                                <tr>
                                    <th class="pb-4 border-b border-white/5">Heure</th>
                                    <th class="pb-4 border-b border-white/5">Bénéficiaire</th>
                                    <th class="pb-4 border-b border-white/5">Motif</th>
                                    <th class="pb-4 border-b border-white/5 text-right">Somme</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                ${logs.length === 0 ? '<tr><td colspan="4" class="py-20 text-center opacity-20 italic">Aucune action administrative récente</td></tr>' : logs.map(l => `
                                    <tr class="hover:bg-white/5 transition-colors">
                                        <td class="py-3 text-gray-600 font-mono">${new Date(l.created_at).toLocaleTimeString()}</td>
                                        <td class="py-3 text-white font-bold uppercase">${l.receiver?.first_name || 'N/A'}</td>
                                        <td class="py-3 text-gray-500 italic max-w-[150px] truncate">"${l.description}"</td>
                                        <td class="py-3 text-right font-mono font-black text-emerald-400">$${l.amount.toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- SECURITY STATS -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="glass-panel p-6 rounded-3xl border border-white/5 bg-[#0c0c0e]">
                    <div class="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-2">Sessions d'Accès</div>
                    <div class="text-3xl font-mono font-bold text-white">CRYPTÉ</div>
                    <p class="text-[8px] text-emerald-500 mt-2 font-black">TLS 1.3 AES-GCM ACTIVE</p>
                </div>
                <div class="glass-panel p-6 rounded-3xl border border-white/5 bg-[#0c0c0e]">
                    <div class="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-2">Bypass Fondation</div>
                    <div class="text-3xl font-mono font-bold text-white">${state.onDutyStaff.length} ACTIFS</div>
                    <p class="text-[8px] text-purple-400 mt-2 font-black">SURVEILLANCE LIVE</p>
                </div>
                <div class="glass-panel p-6 rounded-3xl border border-white/5 bg-[#0c0c0e]">
                    <div class="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-2">Base de données</div>
                    <div class="text-3xl font-mono font-bold text-white">OPTIMISÉE</div>
                    <p class="text-[8px] text-blue-400 mt-2 font-black">LATENCE < 15MS</p>
                </div>
            </div>
            
            <div class="h-20 shrink-0"></div>
        </div>
    `;
};
