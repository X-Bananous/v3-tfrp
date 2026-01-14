import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { router } from '../utils.js';
import { loadUserSanctions } from '../actions/profile.js';

export const ProfileHubView = () => {
    const u = state.user;
    if (!u) return '';

    const currentTab = state.activeProfileTab || 'identity';
    const characters = state.characters || [];
    const perms = u.permissions || {};
    const permKeys = Object.keys(perms).filter(k => perms[k] === true);
    const sanctions = state.userSanctions || [];

    if (!state.hasFetchedSanctions) {
        state.hasFetchedSanctions = true;
        loadUserSanctions();
    }

    const tabs = [
        { id: 'identity', label: 'Dossiers', icon: 'users' },
        { id: 'perms', label: 'Accréditations', icon: 'shield-check' },
        { id: 'sanctions', label: 'Sanctions', icon: 'alert-triangle' },
        { id: 'security', label: 'Sécurité', icon: 'lock' }
    ];

    let tabContent = '';

    // --- TAB: DOSSIERS (GRID RE-STYLED) ---
    if (currentTab === 'identity') {
        tabContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in pb-20">
                ${characters.map(char => {
                    const isAccepted = char.status === 'accepted';
                    const isDeleting = !!char.deletion_requested_at;
                    const statusColor = isDeleting ? 'orange' : isAccepted ? 'emerald' : 'amber';
                    
                    return `
                        <div class="gov-card flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div class="p-8 pb-4 flex justify-between items-start">
                                <div class="w-14 h-14 bg-gov-light rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                    <i data-lucide="user" class="w-7 h-7 text-gray-400"></i>
                                </div>
                                <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest bg-${statusColor}-50 text-${statusColor}-600 border-${statusColor}-200">
                                    ${isDeleting ? 'PURGE EN COURS' : char.status.toUpperCase()}
                                </span>
                            </div>

                            <div class="p-8 pt-2 flex-1">
                                <div class="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Identité Nationale</div>
                                <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter leading-none mb-6">
                                    ${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span>
                                </h3>
                                
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center py-2 border-b border-gray-50">
                                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secteur</span>
                                        <span class="${char.alignment === 'illegal' ? 'text-gov-red' : 'text-gov-blue'} text-[10px] font-black uppercase italic">${char.alignment}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2 border-b border-gray-50">
                                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Âge</span>
                                        <span class="text-gov-text text-[10px] font-black">${char.age} ANS</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2">
                                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Référence</span>
                                        <span class="text-gray-400 font-mono text-[9px]">#${char.id.substring(0,8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6 bg-gov-light/30 border-t border-gray-100 flex flex-col gap-2">
                                ${isAccepted && !isDeleting ? `
                                    <button onclick="actions.selectCharacter('${char.id}')" class="w-full py-4 bg-gov-blue text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all rounded-xl shadow-lg transform active:scale-95">
                                        CHARGER LE DOSSIER
                                    </button>
                                    <div class="flex gap-2">
                                        <button onclick="actions.startEditCharacter('${char.id}')" class="flex-1 py-2.5 bg-white text-gray-500 hover:text-gov-blue border border-gray-200 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <i data-lucide="settings" class="w-3.5 h-3.5"></i> ÉDITER
                                        </button>
                                        <button onclick="actions.requestCharacterDeletion('${char.id}')" class="flex-1 py-2.5 bg-white text-gray-400 hover:text-gov-red border border-gray-200 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> PURGER
                                        </button>
                                    </div>
                                ` : isDeleting ? `
                                    <div class="text-center mb-2">
                                        <div class="text-[7px] text-orange-600 font-black uppercase tracking-widest animate-pulse">EFFACEMENT DANS 72H</div>
                                    </div>
                                    <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="w-full py-3 bg-white border-2 border-orange-500 text-orange-600 font-black text-[9px] uppercase tracking-widest hover:bg-orange-50 transition-all rounded-xl">
                                        ANNULER LA SUPPRESSION
                                    </button>
                                ` : `
                                    <div class="w-full py-4 bg-gray-100 text-gray-400 font-black text-[9px] uppercase tracking-widest rounded-xl text-center border border-gray-200 italic">
                                        VÉRIFICATION EN COURS...
                                    </div>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
                
                ${characters.length < CONFIG.MAX_CHARS ? `
                    <button onclick="actions.goToCreate()" class="group bg-white/40 border-4 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center p-12 hover:border-gov-blue hover:bg-blue-50/50 transition-all min-h-[400px]">
                        <div class="w-16 h-16 bg-white text-gray-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-xl group-hover:scale-110 duration-500">
                            <i data-lucide="plus" class="w-8 h-8"></i>
                        </div>
                        <span class="text-gov-text text-xl font-black uppercase italic tracking-tighter text-center">NOUVEAU<br>RECENSEMENT</span>
                    </button>
                ` : ''}
            </div>
        `;
    } 

    else if (currentTab === 'perms') {
        tabContent = `
            <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl animate-in max-w-4xl mx-auto">
                <h4 class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                    <span class="w-8 h-0.5 bg-gov-blue opacity-30"></span> Privilèges du Profil
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${permKeys.length > 0 ? permKeys.map(k => `
                        <div class="bg-gov-light p-4 rounded-xl border border-gray-100 flex items-center gap-4 group hover:border-gov-blue/20 transition-all">
                            <div class="w-9 h-9 bg-gov-blue text-white rounded-lg flex items-center justify-center shadow-lg"><i data-lucide="check" class="w-4 h-4"></i></div>
                            <span class="text-[10px] font-black text-gov-text uppercase tracking-widest">${k.replace('can_', '').replace(/_/g, ' ')}</span>
                        </div>
                    `).join('') : `
                        <div class="col-span-full py-20 text-center flex flex-col items-center opacity-20">
                            <i data-lucide="lock" class="w-12 h-12 mb-6 text-gov-blue"></i>
                            <p class="text-[10px] font-black uppercase tracking-[0.3em]">Accès Citoyen Standard</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    else if (currentTab === 'sanctions') {
        tabContent = `
            <div class="space-y-4 animate-in max-w-4xl mx-auto pb-20">
                ${sanctions.length > 0 ? sanctions.map(s => `
                    <div class="p-6 bg-white border border-gray-100 rounded-[28px] flex items-center justify-between group hover:border-gov-red/20 transition-all shadow-xl">
                        <div class="flex items-center gap-6">
                            <div class="w-12 h-12 rounded-xl bg-gov-light flex items-center justify-center text-lg font-black uppercase text-gov-red border border-gray-200 shadow-inner group-hover:scale-105 transition-transform italic">${s.type[0]}</div>
                            <div>
                                <div class="text-[10px] font-black text-gov-text uppercase tracking-tight italic">${s.type.toUpperCase()} — LE ${new Date(s.created_at).toLocaleDateString()}</div>
                                <div class="text-[12px] text-gray-500 font-medium italic mt-1 leading-relaxed">"${s.reason}"</div>
                            </div>
                        </div>
                        ${!s.appeal_at ? `
                            <button onclick="actions.openAppealModal('${s.id}')" class="text-[8px] font-black text-gov-blue uppercase tracking-widest border-2 border-gov-blue px-4 py-2 rounded-xl hover:bg-gov-blue hover:text-white transition-all">CONTESTER</button>
                        ` : '<span class="text-[8px] font-black text-gray-400 uppercase italic bg-gov-light px-3 py-1.5 rounded-lg border border-gray-200">En examen</span>'}
                    </div>
                `).join('') : '<div class="text-center py-24 text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] border-4 border-dashed border-gray-100 rounded-[40px]">Aucun signalement</div>'}
            </div>
        `;
    }

    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        tabContent = `
            <div class="bg-white p-12 rounded-[48px] border-t-8 border-gov-red shadow-2xl animate-in max-w-3xl mx-auto text-center">
                <div class="w-16 h-16 bg-red-50 text-gov-red rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg border border-red-100">
                    <i data-lucide="shield-alert" class="w-8 h-8"></i>
                </div>
                <h4 class="text-4xl font-black text-gov-text uppercase italic mb-4 tracking-tighter">Droit à l'Oubli</h4>
                <p class="text-sm text-gray-500 leading-relaxed mb-10 font-medium italic">L'exercice de ce droit entraîne la suppression irrévocable de votre existence numérique dans nos bases sous 72h.</p>
                
                ${deletionDate ? `
                    <div class="bg-orange-50 border-2 border-orange-200 p-8 rounded-[32px] mb-8 inline-block w-full">
                        <div class="text-[9px] text-orange-600 font-black uppercase tracking-[0.4em] mb-4">Phase de purge active</div>
                        <div class="text-4xl font-mono font-black text-gov-text mb-8">72:00:00</div>
                        <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all">ANNULER LA PROCÉDURE</button>
                    </div>
                ` : `
                    <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl transform hover:scale-105">
                        DÉTRUIRE MON IDENTITÉ
                    </button>
                `}
            </div>
        `;
    }

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] min-h-screen">
        
        <!-- UNIVERSAL NAVBAR DU PROFIL (RESPONSIVE) -->
        <nav class="shrink-0 bg-white border-b border-gray-100 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between sticky top-0 z-[1000] shadow-sm py-4 md:py-0 md:h-20">
            <div class="flex items-center gap-6 w-full md:w-auto h-full">
                <div onclick="actions.backToLanding()" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer hover:opacity-70 transition-opacity">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase font-black">Liberté • Égalité • Justice</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">ÉTAT DE CALIFORNIE</div>
                </div>
                
                <div class="hidden md:block h-8 w-px bg-gray-100"></div>

                <!-- Tabs (Terminal Style) -->
                <div class="flex flex-nowrap items-center gap-1 h-full overflow-x-auto no-scrollbar md:static absolute bottom-0 left-0 w-full px-4 md:px-0 md:bg-transparent bg-white border-t md:border-t-0 border-gray-100">
                    ${tabs.map(t => `
                        <button onclick="actions.setProfileTab('${t.id}')" 
                            class="px-4 md:px-6 h-10 md:h-12 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 whitespace-nowrap ${currentTab === t.id ? 'bg-gov-blue text-white shadow-lg' : 'text-gray-400 hover:text-gov-text hover:bg-gray-50'}">
                            <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i>
                            ${t.label}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="flex items-center gap-3 md:gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                <div class="flex gap-2">
                    <button onclick="actions.backToLanding()" class="flex items-center gap-2 text-[9px] font-black text-gov-text uppercase tracking-widest hover:underline px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 transition-all">
                        <i data-lucide="home" class="w-3.5 h-3.5"></i> Accueil
                    </button>
                    <button onclick="actions.confirmLogout()" class="flex items-center gap-2 text-[9px] font-black text-gov-red uppercase tracking-widest hover:underline px-4 py-2 bg-red-50 rounded-lg border border-red-100 transition-all">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i> Quitter
                    </button>
                </div>
                
                <div class="flex items-center gap-3 pl-4 md:pl-6 border-l border-gray-100">
                    <div class="text-right hidden sm:block">
                        <div class="text-[10px] font-black text-gov-text uppercase italic leading-none">${u.username}</div>
                        <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">PROFIL CERTIFIÉ</div>
                    </div>
                    <div class="relative w-9 h-9 md:w-10 md:h-10">
                        <img src="${u.avatar}" class="w-full h-full rounded-xl border-2 border-gov-blue p-0.5 bg-white object-cover">
                        ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
            <!-- BANNER -->
            <div class="relative h-48 md:h-80 shrink-0 overflow-hidden bg-gov-blue">
                ${u.banner ? `<img src="${u.banner}" class="w-full h-full object-cover">` : '<div class="w-full h-full bg-gradient-to-r from-gov-blue via-blue-900 to-indigo-900 opacity-90"></div>'}
                <div class="absolute inset-0 bg-gradient-to-t from-[#F6F6F6] via-transparent to-transparent"></div>
                <div class="absolute inset-0 bg-black/10"></div>
            </div>

            <!-- HEADER CONTENT -->
            <div class="max-w-6xl mx-auto w-full px-6 md:px-8 -mt-16 md:-mt-24 relative z-10 mb-12">
                <div class="flex flex-col md:flex-row items-end gap-6 md:gap-10">
                    <div class="relative group mx-auto md:mx-0">
                        <div class="w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-[6px] md:border-[8px] border-white bg-white shadow-2xl overflow-hidden relative">
                            <img src="${u.avatar}" class="w-full h-full object-cover">
                        </div>
                        <div class="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-gov-blue text-white rounded-xl flex items-center justify-center border-4 border-white shadow-xl transform rotate-12">
                            <i data-lucide="verified" class="w-4 h-4 md:w-5 md:h-5"></i>
                        </div>
                    </div>
                    <div class="flex-1 pb-4 text-center md:text-left w-full">
                        <div class="text-[9px] md:text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-3">Répertoire des Identités</div>
                        <h2 class="text-4xl md:text-5xl font-black text-gov-text tracking-tighter uppercase italic leading-none drop-shadow-xl">${u.username}</h2>
                        <div class="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                            <span class="text-gray-400 font-mono text-[9px] md:text-[10px] uppercase tracking-widest bg-white px-4 py-1.5 rounded-lg border border-gray-100 shadow-sm">UID: ${u.id}</span>
                            ${u.isFounder ? '<span class="text-[9px] md:text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-1.5 border border-purple-100 rounded-lg italic">Fondation</span>' : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- MAIN CONTENT -->
            <main class="max-w-6xl mx-auto w-full px-6 md:px-8 flex-1">
                ${tabContent}
            </main>
            
            <footer class="py-12 text-center opacity-30">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">Terminal de Gestion Identitaire • v6.2</p>
            </footer>
        </div>
    </div>
    `;
};