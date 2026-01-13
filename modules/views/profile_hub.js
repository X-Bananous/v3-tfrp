
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { hasPermission, router } from '../utils.js';

export const ProfileHubView = () => {
    const u = state.user;
    const perms = u.permissions || {};
    const permKeys = Object.keys(perms).filter(k => perms[k] === true);

    const charactersHtml = state.characters.map(char => {
        const isAccepted = char.status === 'accepted';
        const isDeleting = !!char.deletion_requested_at;
        const statusLabel = isDeleting ? 'En cours de purge' : char.status.toUpperCase();
        
        return `
            <div class="gov-card p-8 flex flex-col h-full bg-white relative overflow-hidden group">
                <div class="flex justify-between items-start mb-10">
                    <div class="w-16 h-20 bg-gray-100 flex items-center justify-center grayscale contrast-125 border border-gray-200">
                        <i data-lucide="user" class="w-8 h-8 text-gray-400"></i>
                    </div>
                    <span class="px-2 py-1 rounded text-[8px] font-black uppercase border ${isAccepted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}">
                        ${statusLabel}
                    </span>
                </div>

                <div class="flex-1">
                    <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Identité Civile</div>
                    <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tight">${char.last_name} ${char.first_name}</h3>
                    <div class="space-y-2 text-[11px] font-bold uppercase text-gray-500">
                        <div class="flex justify-between border-b border-gray-50 pb-2"><span>Âge</span><span class="text-gov-text">${char.age} ans</span></div>
                        <div class="flex justify-between border-b border-gray-50 pb-2"><span>Secteur</span><span class="${char.alignment === 'illegal' ? 'text-red-600' : 'text-gov-blue'}">${char.alignment}</span></div>
                    </div>
                </div>

                <div class="mt-8 pt-8 border-t border-gray-100 flex gap-2">
                    ${isDeleting ? `
                        <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="flex-1 py-3 bg-orange-50 text-orange-600 font-black text-[9px] uppercase tracking-widest border border-orange-200 hover:bg-orange-100 transition-all">Annuler Purge</button>
                    ` : `
                        <button ${isAccepted ? `onclick="actions.selectCharacter('${char.id}')"` : 'disabled'} 
                            class="flex-1 py-4 font-black text-[10px] uppercase tracking-widest transition-all ${isAccepted ? 'bg-gov-blue text-white hover:bg-black shadow-lg shadow-blue-900/10' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}">
                            ${isAccepted ? 'Accéder au Terminal' : 'Dossier en Attente'}
                        </button>
                        ${isAccepted ? `
                            <button onclick="actions.startEditCharacter('${char.id}')" class="p-4 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Modifier">
                                <i data-lucide="settings-2" class="w-4 h-4"></i>
                            </button>
                        ` : ''}
                    `}
                </div>
            </div>
        `;
    }).join('');

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] animate-gov min-h-screen">
        
        <!-- HEADER ESPACE PERSONNEL -->
        <div class="bg-white border-b border-gray-200 px-8 py-12 shrink-0">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div class="flex items-center gap-8 text-center md:text-left">
                    <div class="relative">
                        <img src="${u.avatar}" class="w-24 h-24 rounded-full border-4 border-white shadow-2xl grayscale transition-all hover:grayscale-0">
                        <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-gov-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                            <i data-lucide="shield-check" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.3em] mb-1">Espace Personnel Sécurisé</div>
                        <h2 class="text-4xl font-black text-gov-text tracking-tighter uppercase italic">${u.username}</h2>
                        <p class="text-gray-400 font-mono text-[10px] uppercase tracking-widest mt-1">Identifiant Unique : ${u.id}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="actions.confirmLogout()" class="px-8 py-3 bg-white text-red-600 border-2 border-red-100 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest transition-all">
                        Déconnexion
                    </button>
                    ${u.isFounder ? `<button onclick="actions.openFoundationModal()" class="px-8 py-3 bg-purple-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:bg-purple-700 transition-all italic">Foundation Access</button>` : ''}
                </div>
            </div>
        </div>

        <div class="flex-1 p-8 overflow-y-auto">
            <div class="max-w-6xl mx-auto space-y-12">
                
                <!-- PERSONNAGES -->
                <div class="space-y-6">
                    <h3 class="text-xs font-black text-gov-text uppercase tracking-[0.4em] flex items-center gap-4">
                        <span class="w-8 h-0.5 bg-gov-blue"></span> Vos Dossiers Citoyens
                    </h3>
                    <div class="responsive-grid">
                        ${charactersHtml}
                        ${state.characters.length < CONFIG.MAX_CHARS ? `
                            <button onclick="actions.goToCreate()" class="gov-card border-dashed bg-transparent border-2 border-gray-300 flex flex-col items-center justify-center h-[350px] hover:border-gov-blue hover:bg-blue-50/50 transition-all group">
                                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gov-blue group-hover:text-white transition-all">
                                    <i data-lucide="plus" class="w-8 h-8"></i>
                                </div>
                                <div class="font-black text-gov-text uppercase tracking-tight italic">Nouveau Recensement</div>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- INFOS COMPTE & SÉCURITÉ -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="gov-card p-10 bg-white shadow-xl rounded-sm">
                        <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Accréditations Système</h4>
                        <div class="grid grid-cols-2 gap-4">
                            ${permKeys.length > 0 ? permKeys.map(k => `
                                <div class="bg-gov-light p-4 rounded-sm border border-gray-100 flex items-center gap-3">
                                    <i data-lucide="check-circle" class="w-4 h-4 text-gov-blue"></i>
                                    <span class="text-[10px] font-black text-gov-text uppercase truncate">${k.replace('can_', '').replace(/_/g, ' ')}</span>
                                </div>
                            `).join('') : '<div class="col-span-full py-10 text-center text-gray-400 italic text-xs">Aucune permission spéciale</div>'}
                        </div>
                    </div>
                    
                    <div class="gov-card p-10 bg-white shadow-xl rounded-sm border-t-8 border-red-600">
                        <h4 class="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-6">Zone de Danger</h4>
                        <p class="text-xs text-gray-500 mb-10 leading-relaxed font-medium">Action irréversible de suppression de vos données citoyennes. Toutes vos fiches et votre progression seront perdues.</p>
                        <button onclick="actions.requestDataDeletion()" class="w-full py-4 bg-red-600/10 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-200">
                            Demander la Purge Totale
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <div class="bg-white border-t border-gray-100 py-10 text-center">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">Terminal de Gestion Citoyenne • Ministère de l'Intérieur</p>
        </div>
    </div>
    `;
};
