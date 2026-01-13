
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { hasPermission, router } from '../utils.js';
import { ui } from '../ui.js';

export const CharacterSelectView = () => {
    const isFounder = state.user?.isFounder || state.adminIds.includes(state.user?.id);
    
    const charsHtml = state.characters.map(char => {
        const isAccepted = char.status === 'accepted';
        const isRejected = char.status === 'rejected';
        const isDeleting = !!char.deletion_requested_at;
        
        const statusClass = isDeleting ? 'text-orange-600 bg-orange-50 border-orange-200' : 
                            isAccepted ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 
                            isRejected ? 'text-red-700 bg-red-50 border-red-200' : 'text-amber-700 bg-amber-50 border-amber-200';
        
        const alignLabel = char.alignment === 'illegal' ? 'Secteur Clandestin' : 'Secteur Civil';
        const alignColor = char.alignment === 'illegal' ? 'text-red-700' : 'text-[#000091]';

        return `
            <div class="admin-file-card p-8 flex flex-col h-[480px] transition-all hover:shadow-xl group bg-white">
                <div class="flex justify-between items-start mb-10">
                    <div class="w-20 h-24 bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden grayscale contrast-125">
                         <i data-lucide="user" class="w-10 h-10 text-gray-400"></i>
                         <div class="absolute bottom-0 w-full py-1 bg-black/5 text-[8px] text-center font-bold uppercase">Photos.ID</div>
                    </div>
                    <div class="px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${statusClass}">
                        ${isDeleting ? 'En cours de purge' : char.status}
                    </div>
                </div>

                <div class="flex-1">
                    <div class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Identité Civile</div>
                    <h3 class="text-3xl font-black text-gray-900 mb-4 uppercase italic tracking-tighter leading-none">${char.last_name}<br><span class="text-[#000091]">${char.first_name}</span></h3>
                    
                    <div class="space-y-3 mt-8">
                        <div class="flex justify-between text-xs border-b border-gray-50 pb-2">
                            <span class="text-gray-400 font-bold uppercase">Naissance</span>
                            <span class="text-gray-900 font-bold">${new Date(char.birth_date).toLocaleDateString()}</span>
                        </div>
                        <div class="flex justify-between text-xs border-b border-gray-50 pb-2">
                            <span class="text-gray-400 font-bold uppercase">Lieu</span>
                            <span class="text-gray-900 font-bold uppercase italic">${char.birth_place}</span>
                        </div>
                        <div class="flex justify-between text-xs border-b border-gray-50 pb-2">
                            <span class="text-gray-400 font-bold uppercase">Secteur</span>
                            <span class="${alignColor} font-black uppercase italic">${alignLabel}</span>
                        </div>
                    </div>
                </div>

                <div class="mt-8 pt-8 border-t border-gray-100">
                    ${isDeleting ? `
                        <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="w-full py-3 bg-white border border-orange-500 text-orange-600 font-black text-[10px] uppercase tracking-widest hover:bg-orange-50 transition-all">ANNULER LA SUPPRESSION</button>
                    ` : isRejected ? `
                        <button onclick="actions.deleteCharacter('${char.id}')" class="w-full py-3 bg-[#E1000F] text-white font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">PURGER LE DOSSIER REJETÉ</button>
                    ` : `
                        <div class="flex gap-2">
                            <button ${isAccepted ? `onclick="actions.selectCharacter('${char.id}')"` : 'disabled'} 
                                class="flex-1 py-4 font-black text-xs uppercase tracking-widest transition-all ${isAccepted ? 'bg-[#000091] text-white hover:bg-black shadow-lg shadow-blue-900/10' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}">
                                ${isAccepted ? 'ACCÉDER AU DOSSIER' : 'EN ATTENTE DE VISA'}
                            </button>
                            ${isAccepted ? `
                                <button onclick="actions.startEditCharacter('${char.id}')" class="p-4 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Modifier">
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
            <!-- Header Espace Personnel -->
            <div class="bg-white border-b border-gray-200 px-8 py-10">
                <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div class="text-[10px] font-black text-[#000091] uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                            <i data-lucide="lock" class="w-3 h-3"></i> Connexion Sécurisée • ${state.user.username}
                        </div>
                        <h2 class="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Registre Civil National</h2>
                        <p class="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Ministère de l'Intérieur • Los Angeles Administration</p>
                    </div>
                    <div class="flex gap-3">
                         <button onclick="actions.setHubPanel('profile'); router('hub');" class="p-3 bg-gray-100 text-gray-600 hover:bg-[#000091] hover:text-white transition-all rounded-sm border border-gray-200" title="Mon Compte">
                            <i data-lucide="user-circle" class="w-5 h-5"></i>
                        </button>
                        <button onclick="actions.confirmLogout()" class="px-6 py-3 bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                            Quitter <i data-lucide="log-out" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Grille des Dossiers -->
            <div class="flex-1 p-8 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${charsHtml}
                        
                        ${state.characters.length < CONFIG.MAX_CHARS ? `
                            <button onclick="actions.goToCreate()" class="group bg-white border-2 border-dashed border-gray-200 h-[480px] flex flex-col items-center justify-center hover:border-[#000091] hover:bg-blue-50/30 transition-all">
                                <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#000091] group-hover:text-white transition-all">
                                    <i data-lucide="plus" class="w-8 h-8"></i>
                                </div>
                                <span class="text-gray-900 text-xl font-black uppercase italic tracking-tight">Nouveau Recensement</span>
                                <span class="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">Emplacement Libre : ${state.characters.length + 1} / ${CONFIG.MAX_CHARS}</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="bg-white border-t border-gray-200 py-6 px-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Attention : Toute fausse déclaration au recensement est passible de sanctions administratives.
            </div>
        </div>
    `;
};
