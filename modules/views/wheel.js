
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
                    ${isTarget ? '<div class="glow-overlay"></div>' : ''}
                    <button onclick="${canOpen ? `actions.openCrate(${i})` : ''}" 
                        ${!canOpen && !isTarget ? 'disabled' : ''}
                        class="w-full aspect-square bg-[#0a0a0a] rounded-[32px] border border-white/5 flex flex-col items-center justify-center gap-4 transition-all duration-500 relative z-10
                        ${canOpen ? 'hover:border-blue-500/50 hover:bg-blue-600/5 hover:scale-[1.02] cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                        ${isTarget ? 'animate-crate-opening shadow-[0_0_80px_rgba(0,145,255,0.4)] border-blue-500' : ''}">
                        
                        <div class="relative">
                            <div class="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform ${isTarget ? 'animate-crate-burst' : ''}">
                                <i data-lucide="package" class="w-8 h-8"></i>
                            </div>
                        </div>
                        
                        <div class="text-center">
                            <div class="text-[10px] font-black text-white uppercase tracking-widest">${isTarget ? 'DÉCRYPTAGE...' : 'CAISSE SÉCURISÉE'}</div>
                            <div class="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-1">LOTERIE NATIONALE</div>
                        </div>
                    </button>
                </div>
            `);
        }
        return crates.join('');
    };

    return `
    <div class="fixed inset-0 z-[500] bg-[#050505] flex flex-col items-center justify-start p-8 animate-fade-in overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(0,0,145,0.1),transparent_70%)]"></div>
        <div class="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        <!-- HEADER -->
        <div class="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-12 relative z-10 shrink-0">
            <div class="text-center md:text-left mb-8 md:mb-0">
                <div class="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] border border-blue-500/20 mb-4">
                    Système de Loterie Nationale v6.4
                </div>
                <h2 class="text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">TFRP <span class="text-blue-500">LOOTBOX</span></h2>
            </div>

            <div class="flex items-center gap-4">
                <div class="bg-white/5 border border-white/10 px-8 py-3 rounded-[24px] backdrop-blur-xl flex items-center gap-4 shadow-2xl">
                    <div class="text-left">
                        <div class="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-0.5">Clés d'Accès</div>
                        <div class="text-3xl font-mono font-black text-yellow-400">${turns}</div>
                    </div>
                    <i data-lucide="key" class="w-6 h-6 text-yellow-500/50"></i>
                </div>
                <button onclick="actions.closeWheel()" class="p-4 bg-white/5 hover:bg-red-600/20 border border-white/10 rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-xl">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
        </div>

        <!-- MAIN AREA -->
        <div class="w-full max-w-6xl flex-1 overflow-y-auto custom-scrollbar pr-4 relative z-10">
            ${turns === 0 && !isOpening ? `
                <div class="h-full flex flex-col items-center justify-center text-center py-20 opacity-40">
                    <div class="w-32 h-32 rounded-full bg-gray-800/30 flex items-center justify-center mb-8 border border-white/5">
                        <i data-lucide="lock" class="w-16 h-16 text-gray-600"></i>
                    </div>
                    <h3 class="text-2xl font-black text-white uppercase tracking-widest italic">Signal Interrompu</h3>
                </div>
            ` : `
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-20">
                    ${renderCrates()}
                </div>
            `}
        </div>

        <div class="fixed bottom-10 left-1/2 -translate-x-1/2 opacity-30 flex items-center gap-4 bg-black/40 px-6 py-2 rounded-full border border-white/5 backdrop-blur-xl">
            <i data-lucide="shield-check" class="w-5 h-5 text-blue-500"></i>
            <div class="text-[9px] text-gray-500 font-mono uppercase tracking-[0.3em] leading-relaxed">
                Algorithme Certifié v6.4 Platinum • Chiffrement Quantique des Gains
            </div>
        </div>
    </div>
    `;
};
