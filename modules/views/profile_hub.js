import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';
import { loadUserSanctions } from '../actions/profile.js';

export const ProfileHubView = () => {
    const u = state.user;
    if (!u) return '';

    const characters = state.characters || [];
    const perms = u.permissions || {};
    const permKeys = Object.keys(perms).filter(k => perms[k] === true);
    const sanctions = state.userSanctions || [];

    // Charger les sanctions si pas encore fait
    if (!state.hasFetchedSanctions) {
        state.hasFetchedSanctions = true;
        loadUserSanctions();
    }

    const charGrid = characters.map(char => {
        const isAccepted = char.status === 'accepted';
        const isDeleting = !!char.deletion_requested_at;
        
        return `
            <div onclick="${isAccepted ? `actions.selectCharacter('${char.id}')` : ''}" class="gov-card p-8 flex flex-col h-[400px] bg-white animate-in relative group overflow-hidden shadow-sm">
                <div class="flex justify-between items-start mb-10">
                    <div class="w-16 h-20 bg-gray-100 flex items-center justify-center border border-gray-200 grayscale shadow-inner">
                        <i data-lucide="user" class="w-8 h-8 text-gray-400"></i>
                    </div>
                    <span class="px-2.5 py-1 rounded text-[8px] font-black uppercase border ${isAccepted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}">
                        ${isDeleting ? 'PURGE ACTIVE' : char.status.toUpperCase()}
                    </span>
                </div>

                <div class="flex-1">
                    <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Dossier Citoyen</div>
                    <h3 class="text-2xl font-black text-gov-text mb-6 uppercase italic tracking-tight leading-none">${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span></h3>
                    
                    <div class="space-y-2 text-[10px] font-bold uppercase text-gray-500">
                        <div class="flex justify-between border-b border-gray-50 pb-2"><span>Secteur</span><span class="${char.alignment === 'illegal' ? 'text-red-600' : 'text-gov-blue'}">${char.alignment}</span></div>
                        <div class="flex justify-between border-b border-gray-50 pb-2"><span>Âge</span><span class="text-gov-text">${char.age} ans</span></div>
                    </div>
                </div>

                <div class="mt-8 pt-6 border-t border-gray-100">
                    ${isAccepted ? `
                        <button class="w-full py-4 bg-gov-blue text-white font-black text-[10px] uppercase tracking-widest group-hover:bg-black transition-all shadow-lg">
                            Accéder au Terminal
                        </button>
                    ` : `
                        <button disabled class="w-full py-4 bg-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest cursor-not-allowed">
                            Examen en cours
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');

    const sanctionsHtml = sanctions.length > 0 ? sanctions.map(s => {
        const typeColor = s.type === 'warn' ? 'yellow-600' : s.type === 'mute' ? 'orange-600' : 'red-600';
        return `
            <div class="p-4 bg-white border border-gray-100 rounded-sm flex items-center justify-between group hover:border-red-100 transition-all">
                <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-black uppercase text-${typeColor} border border-gray-100">${s.type[0]}</div>
                    <div>
                        <div class="text-[10px] font-black text-gov-text uppercase">${s.type.toUpperCase()} - ${new Date(s.created_at).toLocaleDateString()}</div>
                        <div class="text-[9px] text-gray-400 font-medium italic">"${s.reason}"</div>
                    </div>
                </div>
                ${!s.appeal_at ? `
                    <button onclick="actions.openAppealModal('${s.id}')" class="text-[8px] font-black text-gov-blue uppercase tracking-widest hover:underline">Contester</button>
                ` : '<span class="text-[8px] font-black text-gray-400 uppercase italic">Appel en cours</span>'}
            </div>
        `;
    }).join('') : '<div class="text-center py-10 text-[10px] text-gray-400 font-black uppercase tracking-widest opacity-50">Casier Administratif Vierge</div>';

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] min-h-screen overflow-y-auto custom-scrollbar">
        
        <!-- NAVBAR HUB (Omniprésente) -->
        <nav class="terminal-nav flex items-center justify-between shrink-0 bg-white shadow-sm border-b border-gray-100 px-8">
            <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase">Liberté • Égalité • Justice</div>
                <div class="text-md leading-none uppercase">ÉTAT DE CALIFORNIE</div>
            </div>
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-3">
                    <div class="text-right">
                        <div class="text-[10px] font-black text-gov-text uppercase leading-none">${u.username}</div>
                        <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Utilisateur Vérifié</div>
                    </div>
                    <img src="${u.avatar}" class="w-10 h-10 rounded-full border-2 border-gov-blue p-0.5 grayscale">
                </div>
            </div>
        </nav>

        <!-- HEADER IDENTITÉ DISCORD -->
        <div class="bg-white border-b border-gray-100 px-8 py-16 shrink-0 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-96 h-96 bg-gov-blue/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                <div class="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                    <div class="relative">
                        <div class="w-32 h-32 rounded-full border-8 border-gov-light shadow-2xl relative overflow-hidden group">
                            <img src="${u.avatar}" class="w-full h-full object-cover transition-all group-hover:scale-110">
                        </div>
                        <div class="absolute bottom-1 right-1 w-10 h-10 bg-gov-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                            <i data-lucide="verified" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                            <span class="w-4 h-0.5 bg-gov-blue"></span> Signal d'Identité Sécurisé
                        </div>
                        <h2 class="text-5xl font-black text-gov-text tracking-tighter uppercase italic leading-none">${u.username}</h2>
                        <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                            <span class="text-gray-400 font-mono text-[10px] uppercase tracking-widest bg-gov-light px-3 py-1 rounded-sm border border-gray-100">UID: ${u.id}</span>
                            ${u.isFounder ? '<span class="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 border border-purple-100 rounded-sm italic">Haut Directoire</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button onclick="actions.confirmLogout()" class="px-8 py-3.5 bg-white text-red-600 border-2 border-red-50 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-red-50 shadow-sm">
                        Se Déconnecter
                    </button>
                    ${u.isFounder ? `<button onclick="actions.openFoundationModal()" class="px-8 py-3.5 bg-purple-600 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-purple-700 transition-all italic border border-purple-400">Accès Fondation</button>` : ''}
                </div>
            </div>
        </div>

        <div class="flex-1 p-8">
            <div class="max-w-6xl mx-auto space-y-16 pb-20">
                
                <!-- SÉLECTION DOSSIERS -->
                <div class="space-y-8">
                    <div class="flex justify-between items-end px-2">
                        <h3 class="text-xs font-black text-gov-text uppercase tracking-[0.4em] flex items-center gap-4">
                            <span class="w-12 h-0.5 bg-gov-blue"></span> Vos Identités de l'État (${characters.length}/${CONFIG.MAX_CHARS})
                        </h3>
                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Enregistrement National</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${charGrid}
                        ${characters.length < CONFIG.MAX_CHARS ? `
                            <button onclick="actions.goToCreate()" class="group bg-white/50 border-2 border-dashed border-gray-300 h-[400px] flex flex-col items-center justify-center hover:border-gov-blue hover:bg-blue-50 transition-all rounded-sm">
                                <div class="w-16 h-16 bg-white text-gray-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-lg">
                                    <i data-lucide="plus" class="w-8 h-8"></i>
                                </div>
                                <span class="text-gov-text text-xl font-black uppercase italic tracking-tight">Recensement</span>
                                <span class="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Créer une nouvelle fiche</span>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- ACCRÉDITATIONS -->
                    <div class="lg:col-span-8 space-y-8">
                         <div class="gov-card p-10 bg-white shadow-xl cursor-default hover:transform-none h-full flex flex-col">
                            <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                                <i data-lucide="shield-check" class="w-4 h-4 text-gov-blue"></i> Privilèges & Accréditations Système
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                ${permKeys.length > 0 ? permKeys.map(k => `
                                    <div class="bg-gov-light p-4 rounded-sm border border-gray-100 flex items-center gap-4 group hover:border-gov-blue/30 transition-all">
                                        <div class="w-8 h-8 bg-gov-blue/10 rounded-sm flex items-center justify-center text-gov-blue"><i data-lucide="check" class="w-4 h-4"></i></div>
                                        <span class="text-[10px] font-black text-gov-text uppercase truncate tracking-wide">${k.replace('can_', '').replace(/_/g, ' ')}</span>
                                    </div>
                                `).join('') : `
                                    <div class="col-span-full py-16 text-center flex flex-col items-center opacity-30">
                                        <i data-lucide="lock" class="w-12 h-12 mb-4 text-gray-400"></i>
                                        <p class="text-[10px] font-black uppercase tracking-[0.3em]">Accès Citoyen Standard</p>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>

                    <!-- SANCTIONS / DISCIPLINE -->
                    <div class="lg:col-span-4 space-y-8">
                         <div class="gov-card p-10 bg-white shadow-xl border-t-8 border-gov-red cursor-default hover:transform-none h-full flex flex-col">
                            <h4 class="text-[10px] font-black text-gov-red uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                <i data-lucide="alert-triangle" class="w-4 h-4"></i> Registre Disciplinaire
                            </h4>
                            <div class="space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                                ${sanctionsHtml}
                            </div>
                            <div class="mt-10 pt-8 border-t border-gray-50">
                                <h4 class="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Sécurité du Compte</h4>
                                <button onclick="actions.requestDataDeletion()" class="w-full py-3.5 bg-red-600/5 text-red-600 font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100">
                                    Purger les données (RGPD)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="bg-white border-t border-gray-100 py-10 text-center shrink-0">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.6em]">Terminal de Gestion de l'Identité • Los Angeles Division</p>
        </div>
    </div>
    `;
};