
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { hasPermission, router } from '../utils.js';
import { ui } from '../ui.js';

export const CharacterSelectView = () => {
    const isFounder = state.user?.isFounder || state.adminIds.includes(state.user?.id);
    const u = state.user;
    
    const charsHtml = state.characters.map(char => {
        const isAccepted = char.status === 'accepted';
        const isRejected = char.status === 'rejected';
        const isDeleting = !!char.deletion_requested_at;
        
        const statusClass = isDeleting ? 'text-orange-600 bg-orange-50 border-orange-200' : 
                            isAccepted ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 
                            isRejected ? 'text-red-700 bg-red-50 border-red-200' : 'text-amber-700 bg-amber-50 border-amber-200';
        
        const alignLabel = char.alignment === 'illegal' ? 'Secteur Clandestin' : 'Secteur Civil';
        const alignColor = char.alignment === 'illegal' ? 'text-gov-red' : 'text-gov-blue';

        return `
            <div class="gov-card p-8 flex flex-col h-[520px] transition-all hover:shadow-2xl group bg-white rounded-[40px] border border-gray-100 relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-gov-light rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                
                <div class="flex justify-between items-start mb-8 relative z-10">
                    <div class="relative w-24 h-24">
                        <div class="w-full h-full rounded-full border-4 border-gov-light bg-white shadow-xl overflow-hidden relative">
                             <img src="${u.avatar}" class="w-full h-full object-cover">
                             ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
                             <i data-lucide="user" class="w-4 h-4 text-gray-400"></i>
                        </div>
                    </div>
                    <div class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusClass}">
                        ${isDeleting ? 'PURGE ACTIVE' : char.status.toUpperCase()}
                    </div>
                </div>

                <div class="flex-1 relative z-10">
                    <div class="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Identité Citoyenne</div>
                    <h3 class="text-3xl font-black text-gov-text mb-6 uppercase italic tracking-tighter leading-none">${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span></h3>
                    
                    <div class="space-y-3 mt-8">
                        <div class="flex justify-between items-center py-2 border-b border-gray-50">
                            <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Né le</span>
                            <span class="text-gov-text font-black text-xs">${new Date(char.birth_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-50">
                            <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Origine</span>
                            <span class="text-gov-text font-black text-xs uppercase italic">${char.birth_place}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-50">
                            <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Secteur</span>
                            <span class="${alignColor} font-black text-xs uppercase italic tracking-tight">${alignLabel}</span>
                        </div>
                    </div>
                </div>

                <div class="mt-8 pt-8 border-t border-gray-100 relative z-10">
                    ${isDeleting ? `
                        <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="w-full py-4 bg-white border-2 border-orange-500 text-orange-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-50 transition-all rounded-2xl">ANNULER LA SUPPRESSION</button>
                    ` : isRejected ? `
                        <button onclick="actions.deleteCharacter('${char.id}')" class="w-full py-4 bg-gov-red text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all rounded-2xl shadow-xl shadow-red-900/20">PURGER LE DOSSIER REJETÉ</button>
                    ` : `
                        <div class="flex gap-3">
                            <button ${isAccepted ? `onclick="actions.selectCharacter('${char.id}')"` : 'disabled'} 
                                class="flex-1 py-4 font-black text-xs uppercase tracking-[0.2em] transition-all rounded-2xl shadow-xl ${isAccepted ? 'bg-gov-blue text-white hover:bg-black shadow-blue-900/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}">
                                ${isAccepted ? 'CHARGER LE DOSSIER' : 'ATTENTE VISA'}
                            </button>
                            ${isAccepted ? `
                                <button onclick="actions.startEditCharacter('${char.id}')" class="p-4 bg-gov-light text-gray-500 hover:text-gov-blue hover:bg-white border border-gray-100 rounded-2xl transition-all shadow-md" title="Paramètres">
                                    <i data-lucide="settings" class="w-5 h-5"></i>
                                </button>
                            ` : ''}
                        </div>
                    `}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="flex-1 flex flex-col bg-[#F6F6F6] animate-gov-in min-h-screen">
            <!-- HEADER REPLICATED TERMINAL NAVBAR STYLE -->
            <nav class="terminal-nav flex items-center justify-between bg-white border-b border-gray-200 px-6 md:px-8">
                <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer transition-transform hover:scale-[0.8]" onclick="actions.backToLanding()">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red font-black">Liberté • Égalité • Justice</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>
                
                <div class="flex items-center gap-4">
                    <div class="hidden md:block text-right">
                        <div class="text-[10px] font-black uppercase text-gov-text leading-none">${state.user.username}</div>
                        <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">SÉANCE SÉCURISÉE</div>
                    </div>
                    <button onclick="actions.confirmLogout()" class="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-sm">
                        <i data-lucide="log-out" class="w-5 h-5"></i>
                    </button>
                </div>
            </nav>

            <!-- CONTENU PRINCIPAL -->
            <div class="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <div class="max-w-6xl mx-auto pt-10 pb-20">
                    <div class="mb-12">
                        <h2 class="text-5xl font-black text-gov-text tracking-tighter uppercase italic drop-shadow-sm">Registre National</h2>
                        <p class="text-gray-500 text-sm font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-3">
                             <span class="w-12 h-0.5 bg-gov-blue"></span> SERVICES DE L'IMMIGRATION
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        ${charsHtml}
                        
                        ${state.characters.length < CONFIG.MAX_CHARS ? `
                            <button onclick="actions.goToCreate()" class="group bg-white/50 border-4 border-dashed border-gray-200 h-[520px] flex flex-col items-center justify-center hover:border-gov-blue hover:bg-blue-50/50 transition-all rounded-[40px] shadow-sm">
                                <div class="w-20 h-20 bg-white text-gray-400 rounded-full flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-xl group-hover:scale-110 duration-500">
                                    <i data-lucide="plus" class="w-10 h-10"></i>
                                </div>
                                <span class="text-gov-text text-2xl font-black uppercase italic tracking-tight">Nouveau<br>Recensement</span>
                                <span class="text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">Emplacement Libre : ${state.characters.length + 1} / ${CONFIG.MAX_CHARS}</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <footer class="bg-white border-t border-gray-100 py-8 px-8 text-center opacity-40">
                <p class="text-[9px] text-gray-500 font-black uppercase tracking-[0.6em]">Système de Gestion Identitaire Unifié • Los Angeles Administration</p>
            </footer>
        </div>
    `;
};
