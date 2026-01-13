
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
            <div class="gov-card p-10 flex flex-col h-[480px] relative bg-white animate-in">
                <div class="flex justify-between items-start mb-10">
                    <div class="w-20 h-24 bg-gray-100 flex items-center justify-center border border-gray-200 grayscale shadow-inner rounded-sm">
                        <i data-lucide="user" class="w-10 h-10 text-gray-300"></i>
                    </div>
                    <span class="px-3 py-1 rounded-sm text-[9px] font-black uppercase border ${isAccepted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}">
                        ${isDeleting ? 'PURGE ACTIVE' : char.status.toUpperCase()}
                    </span>
                </div>

                <div class="flex-1">
                    <div class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 italic">Civilian File ID</div>
                    <h3 class="text-3xl font-black text-gov-text mb-8 uppercase italic tracking-tight leading-none">${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span></h3>
                    
                    <div class="space-y-3 text-[11px] font-bold uppercase text-gray-500">
                        <div class="flex justify-between border-b border-gray-50 pb-3"><span>Âge</span><span class="text-gov-text font-black">${char.age} ans</span></div>
                        <div class="flex justify-between border-b border-gray-50 pb-3"><span>Secteur</span><span class="${char.alignment === 'illegal' ? 'text-red-600' : 'text-gov-blue'} font-black">${char.alignment}</span></div>
                        <div class="flex justify-between border-b border-gray-50 pb-3"><span>Métier</span><span class="text-gov-text font-black">${char.job || 'Civil'}</span></div>
                    </div>
                </div>

                <div class="mt-10 pt-8 border-t border-gray-100 flex gap-3">
                    ${isDeleting ? `
                        <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="flex-1 py-4 bg-gov-red text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all italic">Annuler la purge</button>
                    ` : `
                        <button ${isAccepted ? `onclick="actions.selectCharacter('${char.id}')"` : 'disabled'} 
                            class="flex-1 py-5 font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${isAccepted ? 'bg-gov-blue text-white hover:bg-black' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}">
                            ${isAccepted ? 'Charger le Dossier' : 'Vérification...'}
                        </button>
                        ${isAccepted ? `
                            <button onclick="actions.startEditCharacter('${char.id}')" class="p-5 bg-gray-100 text-gray-600 hover:bg-gov-blue hover:text-white transition-all rounded-sm border border-gray-200">
                                <i data-lucide="settings-2" class="w-5 h-5"></i>
                            </button>
                        ` : ''}
                    `}
                </div>
            </div>
        `;
    }).join('');

    return `
    <div class="flex-1 flex flex-col bg-gov-light min-h-screen overflow-y-auto custom-scrollbar">
        
        <!-- NAVBAR OMNI ADAPTÉE -->
        <nav class="global-nav shrink-0 bg-white">
            <div class="flex items-center gap-10">
                <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red italic">California</div>
                    <div class="text-md leading-none italic">LOS ANGELES</div>
                </div>
            </div>
            <div class="flex items-center gap-6">
                <button onclick="actions.logout()" class="px-6 py-2 border-2 border-red-100 text-gov-red font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">Déconnexion</button>
            </div>
        </nav>

        <!-- IDENTITY STRIP -->
        <div class="bg-white border-b border-gray-200 px-10 py-16 shrink-0">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                <div class="flex items-center gap-10 text-center md:text-left">
                    <div class="relative">
                        <img src="${u.avatar}" class="w-36 h-36 rounded-full border-4 border-white shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000">
                        <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-gov-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                            <i data-lucide="shield-check" class="w-6 h-6"></i>
                        </div>
                    </div>
                    <div>
                        <div class="text-[11px] font-black text-gov-blue uppercase tracking-[0.5em] mb-2 italic">Unified Identity Hub</div>
                        <h2 class="text-5xl font-black text-gov-text tracking-tighter uppercase italic leading-none">${u.username}</h2>
                        <p class="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em] mt-3">Federal Database ID: ${u.id}</p>
                    </div>
                </div>
                <div class="flex items-center gap-6">
                    ${u.isFounder || permKeys.length > 0 ? `
                        <button onclick="actions.bypassLogin()" class="px-10 py-5 bg-gov-blue text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all italic">Accéder Console Commandement</button>
                    ` : ''}
                </div>
            </div>
        </div>

        <div class="flex-1 p-10">
            <div class="max-w-7xl mx-auto space-y-20 pb-24">
                
                <!-- DOSSIERS SECTION -->
                <div class="space-y-10">
                    <div class="flex justify-between items-end px-4">
                        <h3 class="text-xs font-black text-gov-text uppercase tracking-[0.5em] flex items-center gap-6">
                            <span class="w-16 h-1 bg-gov-blue"></span> Vos Dossiers d'Immigration (${chars.length}/${CONFIG.MAX_CHARS})
                        </h3>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        ${charGrid}
                        ${chars.length < CONFIG.MAX_CHARS ? `
                            <button onclick="actions.goToCreate()" class="group bg-white/50 border-2 border-dashed border-gray-300 h-[480px] flex flex-col items-center justify-center hover:border-gov-blue hover:bg-blue-50 transition-all rounded-sm shadow-inner">
                                <div class="w-20 h-20 bg-white text-gray-300 rounded-full flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-xl border border-gray-100">
                                    <i data-lucide="plus" class="w-10 h-10"></i>
                                </div>
                                <span class="text-gov-text text-2xl font-black uppercase italic tracking-tight">Nouveau Recensement</span>
                                <span class="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-3">Emplacement Libre</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- SYSTEM STATUS & SANCTIONS -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <!-- ACCREDITATIONS -->
                    <div class="gov-card p-12 bg-white shadow-xl">
                        <h4 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                            <i data-lucide="badge-check" class="w-5 h-5 text-gov-blue"></i> Vos Accréditations Système
                        </h4>
                        <div class="grid grid-cols-2 gap-4">
                            ${permKeys.length > 0 ? permKeys.map(k => `
                                <div class="bg-gov-light p-4 rounded-sm border border-gray-100 flex items-center gap-4 group hover:border-gov-blue transition-all">
                                    <i data-lucide="check" class="w-4 h-4 text-emerald-500"></i>
                                    <span class="text-[10px] font-black text-gov-text uppercase truncate italic">${k.replace('can_', '').replace(/_/g, ' ')}</span>
                                </div>
                            `).join('') : '<div class="col-span-full py-12 text-center text-gray-300 italic text-xs uppercase font-bold tracking-widest border border-dashed border-gray-100">Aucun accès restreint détecté</div>'}
                        </div>
                    </div>
                    
                    <!-- SANCTIONS REGISTER -->
                    <div class="gov-card p-12 bg-white shadow-xl flex flex-col">
                        <h4 class="text-[11px] font-black text-gov-red uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                            <i data-lucide="shield-alert" class="w-5 h-5"></i> Registre Disciplinaire Fédéral
                        </h4>
                        <div class="flex-1 overflow-y-auto max-h-64 custom-scrollbar space-y-4">
                            ${sanctions.length === 0 ? `
                                <div class="h-full flex flex-col items-center justify-center opacity-30 italic py-10">
                                    <i data-lucide="check-circle-2" class="w-12 h-12 text-emerald-500 mb-4"></i>
                                    <p class="text-[10px] font-black uppercase tracking-widest">Registre Citoyen Vierge</p>
                                </div>
                            ` : sanctions.map(s => `
                                <div class="p-6 bg-red-50 border border-red-100 rounded-sm flex flex-col gap-3 relative group">
                                    <div class="flex justify-between items-center">
                                        <span class="text-[10px] font-black uppercase px-3 py-1 rounded-sm bg-red-600 text-white shadow-lg">${s.type}</span>
                                        <span class="text-[10px] text-gray-400 font-mono italic">${new Date(s.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p class="text-sm text-red-900 font-medium leading-relaxed italic">"${s.reason}"</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- DATA PROTECTION -->
                <div class="gov-card p-12 bg-white border-t-8 border-gov-red shadow-2xl">
                    <h4 class="text-[11px] font-black text-gov-red uppercase tracking-[0.4em] mb-8">Sécurité des Données • California State Law</h4>
                    <p class="text-sm text-gray-500 mb-12 leading-relaxed font-medium italic max-w-3xl">"Conformément aux directives de protection de la vie privée, tout citoyen peut exiger l'effacement total de son identité numérique. Cette action est définitive et entraînera la perte de tous les personnages, inventaires et actifs bancaires liés."</p>
                    <button onclick="actions.requestDataDeletion()" class="w-full py-5 bg-red-600/5 text-gov-red font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gov-red hover:text-white transition-all border border-red-100 shadow-sm">
                        Révoquer mon identité fédérale (Purge 72h)
                    </button>
                </div>

            </div>
        </div>

        <div class="bg-white border-t border-gray-100 py-10 text-center shrink-0">
            <p class="text-[10px] font-black text-gray-300 uppercase tracking-[0.8em]">National Citizen Register • Administration Service</p>
        </div>
    </div>
    `;
};
