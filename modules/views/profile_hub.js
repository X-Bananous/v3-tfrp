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

    // Navigation Tabs
    const tabs = [
        { id: 'identity', label: 'Mes Dossiers', icon: 'users' },
        { id: 'perms', label: 'Accréditations', icon: 'shield-check' },
        { id: 'sanctions', label: 'Sanctions', icon: 'alert-triangle' },
        { id: 'security', label: 'Sécurité', icon: 'lock' }
    ];

    // Charger les sanctions si nécessaire
    if (!state.hasFetchedSanctions) {
        state.hasFetchedSanctions = true;
        loadUserSanctions();
    }

    let tabContent = '';

    // --- TAB: MES DOSSIERS (Selection) ---
    if (currentTab === 'identity') {
        tabContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in">
                ${characters.map(char => {
                    const isAccepted = char.status === 'accepted';
                    const isDeleting = !!char.deletion_requested_at;
                    
                    return `
                        <div class="gov-card p-8 flex flex-col h-[420px] bg-white animate-in relative group overflow-hidden shadow-xl rounded-[32px] border border-gray-100">
                            <div class="flex justify-between items-start mb-10">
                                <div class="w-16 h-20 bg-gray-100 flex items-center justify-center border border-gray-200 rounded-xl grayscale shadow-inner">
                                    <i data-lucide="user" class="w-8 h-8 text-gray-400"></i>
                                </div>
                                <span class="px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border ${isAccepted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}">
                                    ${isDeleting ? 'PURGE ACTIVE' : char.status.toUpperCase()}
                                </span>
                            </div>

                            <div class="flex-1">
                                <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Dossier Citoyen</div>
                                <h3 class="text-3xl font-black text-gov-text mb-6 uppercase italic tracking-tight leading-none">${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span></h3>
                                
                                <div class="space-y-2 text-[10px] font-bold uppercase text-gray-500">
                                    <div class="flex justify-between border-b border-gray-50 pb-2"><span>Secteur</span><span class="${char.alignment === 'illegal' ? 'text-red-600' : 'text-gov-blue'}">${char.alignment}</span></div>
                                    <div class="flex justify-between border-b border-gray-50 pb-2"><span>Âge</span><span class="text-gov-text">${char.age} ans</span></div>
                                </div>
                            </div>

                            <div class="mt-8 pt-6 border-t border-gray-100 flex gap-2">
                                ${isAccepted ? `
                                    <button onclick="actions.selectCharacter('${char.id}')" class="flex-1 py-4 bg-gov-blue text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg rounded-xl">
                                        Entrer dans le Terminal
                                    </button>
                                    <button onclick="actions.startEditCharacter('${char.id}')" class="p-4 bg-gray-100 text-gray-500 hover:bg-gov-blue hover:text-white rounded-xl transition-all" title="Modifier">
                                        <i data-lucide="settings" class="w-5 h-5"></i>
                                    </button>
                                ` : `
                                    <button disabled class="w-full py-4 bg-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest cursor-not-allowed rounded-xl">
                                        Examen en cours
                                    </button>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
                
                ${characters.length < CONFIG.MAX_CHARS ? `
                    <button onclick="actions.goToCreate()" class="group bg-white/50 border-2 border-dashed border-gray-300 h-[420px] flex flex-col items-center justify-center hover:border-gov-blue hover:bg-blue-50 transition-all rounded-[32px]">
                        <div class="w-16 h-16 bg-white text-gray-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-lg">
                            <i data-lucide="plus" class="w-8 h-8"></i>
                        </div>
                        <span class="text-gov-text text-xl font-black uppercase italic tracking-tight">Recensement</span>
                        <span class="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Créer une nouvelle fiche</span>
                    </button>
                ` : ''}
            </div>
        `;
    } 

    // --- TAB: ACCREDITATIONS ---
    else if (currentTab === 'perms') {
        tabContent = `
            <div class="bg-white p-10 rounded-[32px] border border-gray-100 shadow-xl animate-in">
                <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                    <i data-lucide="shield-check" class="w-4 h-4 text-gov-blue"></i> Privilèges & Accréditations Système
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${permKeys.length > 0 ? permKeys.map(k => `
                        <div class="bg-gov-light p-4 rounded-xl border border-gray-100 flex items-center gap-4 group hover:border-gov-blue/30 transition-all">
                            <div class="w-8 h-8 bg-gov-blue/10 rounded-lg flex items-center justify-center text-gov-blue"><i data-lucide="check" class="w-4 h-4"></i></div>
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
        `;
    }

    // --- TAB: SANCTIONS ---
    else if (currentTab === 'sanctions') {
        tabContent = `
            <div class="space-y-4 animate-in">
                ${sanctions.length > 0 ? sanctions.map(s => {
                    const typeColor = s.type === 'warn' ? 'yellow-600' : s.type === 'mute' ? 'orange-600' : 'red-600';
                    return `
                        <div class="p-6 bg-white border border-gray-100 rounded-[24px] flex items-center justify-between group hover:border-red-100 transition-all shadow-sm">
                            <div class="flex items-center gap-6">
                                <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-sm font-black uppercase text-${typeColor} border border-gray-100 shadow-inner">${s.type[0]}</div>
                                <div>
                                    <div class="text-[11px] font-black text-gov-text uppercase tracking-tight">${s.type.toUpperCase()} - ${new Date(s.created_at).toLocaleDateString()}</div>
                                    <div class="text-[12px] text-gray-500 font-medium italic mt-1">"${s.reason}"</div>
                                </div>
                            </div>
                            ${!s.appeal_at ? `
                                <button onclick="actions.openAppealModal('${s.id}')" class="text-[10px] font-black text-gov-blue uppercase tracking-widest border border-gov-blue px-4 py-2 rounded-xl hover:bg-gov-blue hover:text-white transition-all">Contester</button>
                            ` : '<span class="text-[10px] font-black text-gray-400 uppercase italic bg-gray-50 px-3 py-1.5 rounded-lg">Appel en examen</span>'}
                        </div>
                    `;
                }).join('') : '<div class="text-center py-20 text-[10px] text-gray-400 font-black uppercase tracking-widest border-2 border-dashed border-gray-200 rounded-[32px]">Casier Administratif Vierge</div>'}
            </div>
        `;
    }

    // --- TAB: SECURITY ---
    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        tabContent = `
            <div class="bg-white p-12 rounded-[40px] border-t-8 border-gov-red shadow-2xl animate-in">
                <h4 class="text-3xl font-black text-gov-text uppercase italic mb-6">Protection des Données (RGPD)</h4>
                <p class="text-sm text-gray-500 leading-relaxed mb-12 max-w-2xl font-medium">L'exercice de ce droit entraîne la suppression irrévocable de votre identité Discord de nos bases, ainsi que l'intégralité de vos comptes et personnages dans un délai de 72h.</p>
                
                ${deletionDate ? `
                    <div class="bg-orange-50 border border-orange-200 p-10 rounded-[32px] mb-12 text-center">
                        <div class="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-4">Phase de purge active</div>
                        <div class="text-3xl font-mono font-black text-gov-text mb-8">EFFACEMENT DANS <span id="profile-del-timer">72H</span></div>
                        <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl">ANNULER LA PROCÉDURE</button>
                    </div>
                ` : `
                    <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-xl">DÉTRUIRE MON IDENTITÉ NATIONALE</button>
                `}
            </div>
        `;
    }

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] min-h-screen overflow-y-auto custom-scrollbar">
        
        <!-- UNIVERSAL NAVBAR -->
        <nav class="terminal-nav flex items-center justify-between shrink-0 bg-white shadow-sm border-b border-gray-100 px-8">
            <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase">Liberté • Égalité • Justice</div>
                <div class="text-md leading-none uppercase">ÉTAT DE CALIFORNIE</div>
            </div>
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-3">
                    <div class="text-right">
                        <div class="text-[10px] font-black text-gov-text uppercase leading-none">${u.username}</div>
                        <div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Identité Vérifiée</div>
                    </div>
                    <div class="relative w-10 h-10">
                        <img src="${u.avatar}" class="w-full h-full rounded-full border-2 border-gov-blue p-0.5 grayscale relative z-10">
                        ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] max-w-none z-20 pointer-events-none">` : ''}
                    </div>
                </div>
            </div>
        </nav>

        <!-- DISCORD COVER BANNER -->
        <div class="relative h-64 md:h-80 shrink-0 overflow-hidden bg-gov-blue">
            ${u.banner ? `<img src="${u.banner}" class="w-full h-full object-cover">` : '<div class="w-full h-full bg-gradient-to-r from-gov-blue via-blue-800 to-indigo-900 opacity-90"></div>'}
            <div class="absolute inset-0 bg-gradient-to-t from-[#F6F6F6] via-transparent to-transparent"></div>
        </div>

        <!-- PROFILE HEADER -->
        <div class="max-w-6xl mx-auto w-full px-8 -mt-32 relative z-10 mb-16">
            <div class="flex flex-col md:flex-row items-end gap-10">
                <div class="relative group mx-auto md:mx-0">
                    <div class="w-48 h-48 rounded-full border-[10px] border-white bg-white shadow-2xl overflow-hidden relative">
                        <img src="${u.avatar}" class="w-full h-full object-cover">
                        ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] max-w-none z-20 pointer-events-none">` : ''}
                    </div>
                    <div class="absolute bottom-4 right-4 w-12 h-12 bg-gov-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                        <i data-lucide="verified" class="w-6 h-6"></i>
                    </div>
                </div>
                <div class="flex-1 pb-6 text-center md:text-left">
                    <div class="text-[11px] font-black text-gov-blue uppercase tracking-[0.5em] mb-4 flex items-center justify-center md:justify-start gap-3">
                        <span class="w-6 h-0.5 bg-gov-blue"></span> Signal d'Identité Certifié
                    </div>
                    <h2 class="text-6xl font-black text-gov-text tracking-tighter uppercase italic leading-none drop-shadow-sm">${u.username}</h2>
                    <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                        <span class="text-gray-400 font-mono text-[10px] uppercase tracking-widest bg-white px-4 py-1.5 rounded-lg border border-gray-100 shadow-sm">UID: ${u.id}</span>
                        ${u.isFounder ? '<span class="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-1.5 border border-purple-100 rounded-lg italic shadow-sm">Fondation</span>' : ''}
                        <button onclick="actions.confirmLogout()" class="px-6 py-1.5 bg-red-600/5 text-red-600 font-black text-[9px] uppercase tracking-widest border border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all ml-2">Quitter</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- NAVIGATION SUB-TABS (Terminal Style Dropdown for consistency) -->
        <div class="max-w-6xl mx-auto w-full px-8 mb-12">
            <div class="flex flex-wrap gap-2 p-2 bg-gray-200/50 backdrop-blur-md rounded-3xl w-fit border border-gray-200">
                ${tabs.map(t => `
                    <button onclick="actions.setProfileTab('${t.id}')" 
                        class="px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${currentTab === t.id ? 'bg-white text-gov-blue shadow-lg' : 'text-gray-500 hover:text-gov-text'}">
                        <div class="flex items-center gap-3">
                            <i data-lucide="${t.icon}" class="w-4 h-4"></i>
                            ${t.label}
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>

        <!-- MAIN TAB CONTENT -->
        <div class="max-w-6xl mx-auto w-full px-8 pb-32">
            ${tabContent}
        </div>

        <div class="bg-white border-t border-gray-100 py-10 text-center shrink-0">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.6em]">Terminal de Gestion de l'Identité • Los Angeles Division</p>
        </div>
    </div>
    `;
};