
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const ProfileHubView = () => {
    const u = state.user;
    const chars = state.characters || [];
    const sanctions = state.userSanctions || [];
    const perms = u.permissions || {};
    const permKeys = Object.keys(perms).filter(k => perms[k] === true);

    const charGrid = chars.map(char => {
        const isAccepted = char.status === 'accepted';
        const isDeleting = !!char.deletion_requested_at;
        
        return `
            <div class="gov-card p-8 flex flex-col h-[420px] relative bg-white animate-in">
                <div class="flex justify-between items-start mb-8">
                    <div class="w-16 h-20 bg-gray-100 flex items-center justify-center border border-gray-200 grayscale shadow-inner rounded-sm">
                        <i data-lucide="user" class="w-8 h-8 text-gray-300"></i>
                    </div>
                    <span class="px-2.5 py-1 rounded text-[8px] font-black uppercase border ${isAccepted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}">
                        ${isDeleting ? 'PURGE ACTIVE' : char.status.toUpperCase()}
                    </span>
                </div>

                <div class="flex-1">
                    <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Civilian File ID</div>
                    <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tight leading-none">${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span></h3>
                    
                    <div class="space-y-2 text-[10px] font-bold uppercase text-gray-500">
                        <div class="flex justify-between border-b border-gray-50 pb-2"><span>Âge</span><span class="text-gov-text">${char.age} ans</span></div>
                        <div class="flex justify-between border-b border-gray-50 pb-2"><span>Secteur</span><span class="${char.alignment === 'illegal' ? 'text-red-600' : 'text-gov-blue'}">${char.alignment}</span></div>
                        <div class="flex justify-between border-b border-gray-50 pb-2"><span>Métier</span><span class="text-gov-text">${char.job || 'Sans emploi'}</span></div>
                    </div>
                </div>

                <div class="mt-8 pt-6 border-t border-gray-100 flex gap-2">
                    ${isDeleting ? `
                        <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="flex-1 py-3 bg-gov-red text-white font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all italic">Annuler la purge</button>
                    ` : `
                        <button ${isAccepted ? `onclick="actions.selectCharacter('${char.id}')"` : 'disabled'} 
                            class="flex-1 py-4 font-black text-[10px] uppercase tracking-widest transition-all ${isAccepted ? 'bg-gov-blue text-white hover:bg-black shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}">
                            ${isAccepted ? 'Charger le Dossier' : 'Vérification en cours'}
                        </button>
                        ${isAccepted ? `
                            <button onclick="actions.startEditCharacter('${char.id}')" class="p-4 bg-gray-100 text-gray-600 hover:bg-gov-blue hover:text-white transition-all rounded-sm">
                                <i data-lucide="settings-2" class="w-4 h-4"></i>
                            </button>
                        ` : ''}
                    `}
                </div>
            </div>
        `;
    }).join('');

    return `
    <div class="flex-1 flex flex-col bg-gov-light min-h-screen overflow-y-auto custom-scrollbar">
        
        <!-- HEADER IDENTITÉ DISCORD -->
        <div class="bg-white border-b border-gray-200 px-8 py-12 shrink-0">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                <div class="flex items-center gap-8 text-center md:text-left">
                    <div class="relative">
                        <img src="${u.avatar}" class="w-32 h-32 rounded-full border-4 border-white shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                        <div class="absolute -bottom-1 -right-1 w-10 h-10 bg-gov-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                            <i data-lucide="shield-check" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-1">Unified Identity Portal</div>
                        <h2 class="text-4xl font-black text-gov-text tracking-tighter uppercase italic">${u.username}</h2>
                        <p class="text-gray-400 font-mono text-[10px] uppercase tracking-widest mt-1">Federal ID: ${u.id}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="actions.logout()" class="px-8 py-3 bg-white text-gov-red border-2 border-red-100 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest transition-all">Déconnexion</button>
                    ${u.isFounder || permKeys.length > 0 ? `<button onclick="actions.bypassLogin()" class="px-8 py-3 bg-gov-blue text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all italic">Accès Console Staff</button>` : ''}
                </div>
            </div>
        </div>

        <div class="flex-1 p-8">
            <div class="max-w-6xl mx-auto space-y-16 pb-20">
                
                <!-- DOSSIERS CITOYENS -->
                <div class="space-y-8">
                    <h3 class="text-xs font-black text-gov-text uppercase tracking-[0.4em] flex items-center gap-4">
                        <span class="w-12 h-0.5 bg-gov-blue"></span> Vos Dossiers d'Immigration (${chars.length}/${CONFIG.MAX_CHARS})
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${charGrid}
                        ${chars.length < CONFIG.MAX_CHARS ? `
                            <button onclick="actions.goToCreate()" class="group bg-white/50 border-2 border-dashed border-gray-300 h-[420px] flex flex-col items-center justify-center hover:border-gov-blue hover:bg-blue-50 transition-all rounded-sm">
                                <div class="w-16 h-16 bg-white text-gray-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-lg">
                                    <i data-lucide="plus" class="w-8 h-8"></i>
                                </div>
                                <span class="text-gov-text text-xl font-black uppercase italic tracking-tight">Nouveau Recensement</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- ACCREDITATIONS & SANCTIONS -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="gov-card p-10 bg-white">
                        <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Niveau d'Accréditation Système</h4>
                        <div class="grid grid-cols-2 gap-3">
                            ${permKeys.length > 0 ? permKeys.map(k => `
                                <div class="bg-gov-light p-3 rounded-sm border border-gray-100 flex items-center gap-3">
                                    <i data-lucide="check-circle" class="w-4 h-4 text-gov-blue"></i>
                                    <span class="text-[9px] font-black text-gov-text uppercase truncate">${k.replace('can_', '').replace(/_/g, ' ')}</span>
                                </div>
                            `).join('') : '<div class="col-span-full py-10 text-center text-gray-400 italic text-[10px] uppercase font-bold tracking-widest border border-dashed border-gray-100">Aucun accès spécifique</div>'}
                        </div>
                    </div>
                    
                    <div class="gov-card p-10 bg-white flex flex-col">
                        <h4 class="text-[10px] font-black text-gov-red uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <i data-lucide="shield-alert" class="w-4 h-4"></i> Registre Disciplinaire (Dernières Sanctions)
                        </h4>
                        <div class="flex-1 overflow-y-auto max-h-48 custom-scrollbar space-y-3">
                            ${sanctions.length === 0 ? '<p class="text-center text-gray-400 italic text-[10px] py-10 uppercase tracking-widest">Registre de casier vierge</p>' : sanctions.map(s => `
                                <div class="p-4 bg-red-50 border border-red-100 rounded-sm flex flex-col gap-2 relative">
                                    <div class="flex justify-between items-center">
                                        <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white">${s.type}</span>
                                        <span class="text-[9px] text-gray-400 font-mono">${new Date(s.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p class="text-[11px] text-red-900 font-medium leading-relaxed italic">"${s.reason}"</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- SECURITY / Danger Zone -->
                <div class="gov-card p-10 bg-white border-t-8 border-gov-red">
                    <h4 class="text-[10px] font-black text-gov-red uppercase tracking-[0.3em] mb-6">Zone de Sécurité & RGPD</h4>
                    <p class="text-xs text-gray-500 mb-10 leading-relaxed font-medium italic">"Conformément aux lois fédérales, vous pouvez demander l'effacement total de votre identité numérique. Cette action supprimera tous les personnages, inventaires et actifs bancaires liés à ce compte."</p>
                    <button onclick="actions.requestDataDeletion()" class="w-full py-4 bg-red-600/10 text-gov-red font-black text-[10px] uppercase tracking-widest hover:bg-gov-red hover:text-white transition-all border border-red-200">
                        Révoquer mon identité fédérale (Purge 72h)
                    </button>
                </div>

            </div>
        </div>

        <div class="bg-white border-t border-gray-100 py-8 text-center">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.6em]">Registre National des Populations • California State Administration</p>
        </div>
    </div>
    `;
};
