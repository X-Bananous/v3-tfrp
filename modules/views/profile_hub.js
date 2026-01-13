
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';

export const ProfileHubView = () => {
    const u = state.user;
    const chars = state.characters || [];
    const perms = u.permissions || {};
    const permKeys = Object.keys(perms).filter(k => perms[k] === true);

    const charGrid = chars.map(char => {
        const isAccepted = char.status === 'accepted';
        const isDeleting = !!char.deletion_requested_at;
        
        return `
            <div class="gov-card p-8 flex flex-col h-[420px] relative bg-white animate-in shadow-sm hover:shadow-xl transition-all border-gray-200">
                <div class="flex justify-between items-start mb-8">
                    <div class="w-16 h-20 bg-gray-100 flex items-center justify-center border border-gray-200 grayscale rounded-sm">
                        <i data-lucide="user" class="w-8 h-8 text-gray-300"></i>
                    </div>
                    <span class="px-2.5 py-1 rounded text-[8px] font-black uppercase border ${isAccepted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}">
                        ${isDeleting ? 'PURGE ACTIVE' : char.status.toUpperCase()}
                    </span>
                </div>

                <div class="flex-1">
                    <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Federal ID File</div>
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
                    `}
                </div>
            </div>
        `;
    }).join('');

    return `
    <div class="flex-1 flex flex-col bg-gov-light min-h-screen overflow-y-auto custom-scrollbar">
        
        <!-- NAVBAR -->
        <nav class="global-nav shrink-0 bg-white">
            <div onclick="router('profile_hub')" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red italic">State of California</div>
                <div class="text-md leading-none italic">LOS ANGELES PORTAL</div>
            </div>
            <div class="flex items-center gap-4">
                <img src="${u.avatar}" class="w-9 h-9 rounded-full border border-gray-200">
                <button onclick="actions.logout()" class="text-gov-red font-black text-[10px] uppercase tracking-widest hover:underline">Déconnexion</button>
            </div>
        </nav>

        <!-- IDENTITY -->
        <div class="bg-white border-b border-gray-200 px-8 py-12 shrink-0">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                <div class="flex items-center gap-8">
                    <img src="${u.avatar}" class="w-24 h-24 rounded-full border-4 border-white shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                    <div>
                        <div class="text-[10px] font-black text-gov-blue uppercase tracking-widest mb-1">Unified Identity Signal</div>
                        <h2 class="text-4xl font-black text-gov-text tracking-tighter uppercase italic leading-none">${u.username}</h2>
                        <p class="text-gray-400 font-mono text-[9px] uppercase tracking-widest mt-2">Discord ID: ${u.id}</p>
                    </div>
                </div>
                <div>
                    ${u.isFounder || permKeys.length > 0 ? `
                        <button onclick="actions.bypassLogin()" class="px-8 py-4 bg-gov-blue text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all italic">Accéder Console Commandement</button>
                    ` : ''}
                </div>
            </div>
        </div>

        <div class="flex-1 p-8">
            <div class="max-w-6xl mx-auto space-y-16 pb-20">
                
                <div class="space-y-8">
                    <h3 class="text-xs font-black text-gov-text uppercase tracking-[0.4em] flex items-center gap-4">
                        <span class="w-12 h-0.5 bg-gov-blue"></span> Vos Dossiers (${chars.length}/${CONFIG.MAX_CHARS})
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${charGrid}
                        ${chars.length < CONFIG.MAX_CHARS ? `
                            <button onclick="actions.goToCreate()" class="group bg-white/50 border-2 border-dashed border-gray-300 h-[420px] flex flex-col items-center justify-center hover:border-gov-blue hover:bg-blue-50 transition-all rounded-sm">
                                <div class="w-16 h-16 bg-white text-gray-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-lg border border-gray-100">
                                    <i data-lucide="plus" class="w-8 h-8"></i>
                                </div>
                                <span class="text-gov-text text-xl font-black uppercase italic tracking-tight">Nouveau Recensement</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="gov-card p-10 bg-white shadow-sm border-gray-100">
                        <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Accréditations Système</h4>
                        <div class="grid grid-cols-2 gap-3">
                            ${permKeys.length > 0 ? permKeys.map(k => `
                                <div class="bg-gov-light p-3 rounded-sm border border-gray-100 flex items-center gap-3">
                                    <i data-lucide="shield-check" class="w-4 h-4 text-gov-blue"></i>
                                    <span class="text-[9px] font-black text-gov-text uppercase truncate">${k.replace('can_', '').replace(/_/g, ' ')}</span>
                                </div>
                            `).join('') : '<div class="col-span-full py-10 text-center text-gray-300 italic text-[10px] uppercase font-bold tracking-widest border border-dashed border-gray-100">Aucun accès restreint</div>'}
                        </div>
                    </div>
                    
                    <div class="gov-card p-10 bg-white shadow-sm border-gray-100">
                         <h4 class="text-[10px] font-black text-gov-red uppercase tracking-[0.3em] mb-8">Zone de Sécurité</h4>
                         <p class="text-[11px] text-gray-500 italic mb-10 leading-relaxed">Conformément au RGPD, vous pouvez exiger la purge de vos données fédérales. Cette action est définitive.</p>
                         <button onclick="actions.requestDataDeletion()" class="w-full py-4 bg-red-600/10 text-gov-red font-black text-[10px] uppercase tracking-widest border border-red-200 hover:bg-red-600 hover:text-white transition-all">Effacement de mon Identité</button>
                    </div>
                </div>

            </div>
        </div>

        <div class="bg-white border-t border-gray-100 py-8 text-center shrink-0">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.6em]">National Citizen Register • California Administration</p>
        </div>
    </div>
    `;
};
