
import { state } from '../state.js';

export const WheelView = () => {
    const turns = state.user.whell_turn || 0;
    const isOpening = state.isOpening;
    const openingCrateIdx = state.openingCrateIdx;

    const renderCrates = () => {
        let crates = [];
        const count = Math.max(8, turns);
        for(let i=0; i < count; i++) {
            const isTarget = openingCrateIdx === i;
            const canOpen = turns > 0 && !isOpening;
            
            crates.push(`
                <div class="relative group">
                    <style>
                        @keyframes lid-pop {
                            0% { transform: translateY(0) rotate(0); }
                            20% { transform: translateY(-30px) rotate(-15deg); opacity: 0.8; }
                            100% { transform: translateY(-120px) rotate(-45deg); opacity: 0; }
                        }
                        @keyframes box-shake {
                            0%, 100% { transform: rotate(0); }
                            25% { transform: rotate(5deg); }
                            50% { transform: rotate(-5deg); }
                            75% { transform: rotate(5deg); }
                        }
                        @keyframes glow-explosion {
                            0% { transform: scale(1); opacity: 0.5; filter: blur(5px); }
                            100% { transform: scale(3); opacity: 0; filter: blur(30px); }
                        }
                        .animate-lid { animation: lid-pop 1s forwards cubic-bezier(0.34, 1.56, 0.64, 1); }
                        .animate-shake { animation: box-shake 0.2s infinite ease-in-out; }
                        .animate-glow { animation: glow-explosion 1.5s infinite ease-out; }
                    </style>
                    
                    <button onclick="${canOpen ? `actions.openCrate(${i})` : ''}" 
                        ${!canOpen && !isTarget ? 'disabled' : ''}
                        class="w-full aspect-square bg-[#0c0c0e] rounded-[40px] border border-white/5 flex flex-col items-center justify-center gap-5 transition-all duration-700 
                        ${canOpen ? 'hover:border-blue-500/50 hover:bg-blue-600/5 hover:scale-[1.02] cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                        ${isTarget ? 'border-blue-500 bg-blue-600/20 scale-[1.1] z-50' : ''}">
                        
                        <div class="relative flex items-center justify-center w-24 h-24">
                            <!-- ANIAMTION BOX -->
                            <div class="relative w-16 h-16 ${isTarget ? 'animate-shake' : ''}">
                                ${isTarget ? '<div class="absolute inset-0 bg-blue-400 rounded-full animate-glow"></div>' : ''}
                                <div class="box-lid absolute -top-1 left-0 w-full h-4 bg-blue-500 rounded-t-lg origin-bottom z-20 ${isTarget ? 'animate-lid' : ''}"></div>
                                <div class="box-body w-full h-full bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center border border-blue-400/30 shadow-2xl relative z-10">
                                    <i data-lucide="package" class="w-8 h-8 text-white ${isTarget ? 'animate-pulse' : ''}"></i>
                                </div>
                            </div>
                            
                            ${canOpen ? '<div class="absolute -top-4 -right-4 w-7 h-7 rounded-full bg-emerald-500 border-4 border-[#0c0c0e] flex items-center justify-center shadow-xl"><i data-lucide="check" class="w-4 h-4 text-white"></i></div>' : ''}
                        </div>
                        
                        <div class="text-center">
                            <div class="text-[11px] font-black text-white uppercase tracking-[0.2em]">${isTarget ? 'DÉCRYPTAGE...' : 'CAISSE SCÉLLÉE'}</div>
                            <div class="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">SÉCURITÉ CAD-OS</div>
                        </div>
                    </button>
                </div>
            `);
        }
        return crates.join('');
    };

    return `
    <div class="fixed inset-0 z-[500] bg-[#050505] flex flex-col items-center justify-start p-8 animate-fade-in overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(10,132,246,0.1),transparent_70%)]"></div>

        <!-- Header -->
        <div class="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between mb-16 relative z-10 shrink-0">
            <div class="text-center md:text-left mb-8 md:mb-0">
                <div class="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] border border-blue-500/20 mb-4">
                    Protocole de Récompense Citoyenne
                </div>
                <h2 class="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">TFRP <span class="text-blue-500">LOOTBOX.</span></h2>
            </div>

            <div class="flex items-center gap-6">
                <div class="bg-white/5 border border-white/10 px-10 py-5 rounded-[32px] backdrop-blur-xl flex items-center gap-6 shadow-2xl">
                    <div class="text-left">
                        <div class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Clés Disponibles</div>
                        <div class="text-4xl font-mono font-black text-yellow-400">${turns}</div>
                    </div>
                    <i data-lucide="key" class="w-8 h-8 text-yellow-500/40"></i>
                </div>
                <button onclick="actions.closeWheel()" class="p-5 bg-white/5 hover:bg-red-600/20 border border-white/10 rounded-3xl text-gray-500 hover:text-red-500 transition-all shadow-xl">
                    <i data-lucide="x" class="w-8 h-8"></i>
                </button>
            </div>
        </div>

        <!-- Crate Grid -->
        <div class="w-full max-w-7xl flex-1 overflow-y-auto custom-scrollbar pr-6 relative z-10">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 pb-32">
                ${renderCrates()}
            </div>
        </div>

        <div class="fixed bottom-10 left-1/2 -translate-x-1/2 opacity-40 flex items-center gap-4 bg-black/60 px-8 py-3 rounded-full border border-white/5 backdrop-blur-3xl shadow-2xl">
            <i data-lucide="shield-check" class="w-5 h-5 text-blue-500"></i>
            <div class="text-[10px] text-gray-500 font-mono uppercase tracking-[0.4em]">Algorithme de Distribution Certifié v6.6 Platinum</div>
        </div>
    </div>
    `;
};
