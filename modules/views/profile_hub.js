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

    // Navigation Tabs Definition
    const tabs = [
        { id: 'identity', label: 'Mes Dossiers', icon: 'users' },
        { id: 'perms', label: 'Accréditations', icon: 'shield-check' },
        { id: 'sanctions', label: 'Sanctions', icon: 'alert-triangle' },
        { id: 'security', label: 'Sécurité', icon: 'lock' }
    ];

    if (!state.hasFetchedSanctions) {
        state.hasFetchedSanctions = true;
        loadUserSanctions();
    }

    let tabContent = '';

    // --- TAB: MES DOSSIERS (Selection) ---
    if (currentTab === 'identity') {
        tabContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in pb-20">
                ${characters.map(char => {
                    const isAccepted = char.status === 'accepted';
                    const isDeleting = !!char.deletion_requested_at;
                    
                    return `
                        <div class="gov-card p-8 flex flex-col aspect-[4/5] min-h-[500px] bg-white animate-in relative group overflow-hidden shadow-2xl rounded-[40px] border border-gray-100 transition-all hover:scale-[1.02]">
                            <div class="flex justify-between items-start mb-8 shrink-0">
                                <div class="w-16 h-20 bg-gov-light flex items-center justify-center border border-gray-200 rounded-2xl grayscale shadow-inner group-hover:grayscale-0 transition-all duration-500">
                                    <i data-lucide="user" class="w-8 h-8 text-gray-400 group-hover:text-gov-blue"></i>
                                </div>
                                <div class="flex flex-col items-end gap-2">
                                    <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${isAccepted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}">
                                        ${isDeleting ? 'PURGE ACTIVE' : char.status.toUpperCase()}
                                    </span>
                                    ${isDeleting ? '<span class="text-[7px] text-orange-600 font-bold animate-pulse">SUPPRESSION DANS 72H</span>' : ''}
                                </div>
                            </div>

                            <div class="flex-1 min-h-0">
                                <div class="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">Identité Nationale</div>
                                <h3 class="text-4xl font-black text-gov-text mb-8 uppercase italic tracking-tighter leading-none group-hover:text-gov-blue transition-colors">${char.last_name}<br><span>${char.first_name}</span></h3>
                                
                                <div class="space-y-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                    <div class="flex justify-between border-b border-gray-50 pb-2">
                                        <span>Secteur</span>
                                        <span class="${char.alignment === 'illegal' ? 'text-gov-red' : 'text-gov-blue'} italic">${char.alignment}</span>
                                    </div>
                                    <div class="flex justify-between border-b border-gray-50 pb-2">
                                        <span>Âge</span>
                                        <span class="text-gov-text">${char.age} ans</span>
                                    </div>
                                    <div class="flex justify-between border-b border-gray-50 pb-2">
                                        <span>Dossier UID</span>
                                        <span class="text-gray-400 font-mono">#${char.id.substring(0,8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-3 shrink-0">
                                ${isAccepted && !isDeleting ? `
                                    <button onclick="actions.selectCharacter('${char.id}')" class="w-full py-5 bg-gov-blue text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl rounded-2xl transform active:scale-95">
                                        CHARGER LE DOSSIER
                                    </button>
                                    <div class="flex gap-2">
                                        <button onclick="actions.startEditCharacter('${char.id}')" class="flex-1 py-3 bg-gov-light text-gray-500 hover:bg-gov-blue hover:text-white rounded-xl transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <i data-lucide="settings-2" class="w-3.5 h-3.5"></i> ÉDITER
                                        </button>
                                        <button onclick="actions.requestCharacterDeletion('${char.id}')" class="p-3 bg-red-50 text-gov-red hover:bg-gov-red hover:text-white rounded-xl transition-all group/purge" title="Purger le dossier">
                                            <i data-lucide="trash-2" class="w-4 h-4 group-hover/purge:scale-110 transition-transform"></i>
                                        </button>
                                    </div>
                                ` : isDeleting ? `
                                    <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="w-full py-4 bg-white border-2 border-orange-500 text-orange-600 font-black text-[10px] uppercase tracking-widest hover:bg-orange-50 transition-all rounded-2xl">
                                        ANNULER LA PURGE
                                    </button>
                                ` : `
                                    <div class="w-full py-5 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl text-center border border-gray-100 italic">
                                        EXAMEN DES SERVICES D'IMMIGRATION...
                                    </div>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
                
                ${characters.length < CONFIG.MAX_CHARS ? `
                    <button onclick="actions.goToCreate()" class="group bg-white/40 border-4 border-dashed border-gray-200 aspect-[4/5] min-h-[500px] flex flex-col items-center justify-center hover:border-gov-blue hover:bg-blue-50/50 transition-all rounded-[40px]">
                        <div class="w-20 h-20 bg-white text-gray-300 rounded-full flex items-center justify-center mb-8 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-xl group-hover:scale-110 duration-500">
                            <i data-lucide="plus" class="w-10 h-10"></i>
                        </div>
                        <span class="text-gov-text text-2xl font-black uppercase italic tracking-tighter leading-none text-center">NOUVEAU<br>RECENSEMENT</span>
                        <span class="text-[10px] text-gray-400 mt-4 font-black uppercase tracking-[0.3em] group-hover:text-gov-blue transition-colors">Créer une fiche citoyenne</span>
                    </button>
                ` : ''}
            </div>
        `;
    } 

    else if (currentTab === 'perms') {
        tabContent = `
            <div class="bg-white p-12 rounded-[48px] border border-gray-100 shadow-2xl animate-in max-w-5xl mx-auto">
                <h4 class="text-[10px] font-black text-gov-blue uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                    <span class="w-8 h-0.5 bg-gov-blue"></span> Accréditations & Privilèges Système
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${permKeys.length > 0 ? permKeys.map(k => `
                        <div class="bg-gov-light p-5 rounded-2xl border border-gray-100 flex items-center gap-5 group hover:border-gov-blue/20 transition-all">
                            <div class="w-10 h-10 bg-gov-blue text-white rounded-xl flex items-center justify-center shadow-lg"><i data-lucide="check-circle-2" class="w-5 h-5"></i></div>
                            <span class="text-[11px] font-black text-gov-text uppercase truncate tracking-widest">${k.replace('can_', '').replace(/_/g, ' ')}</span>
                        </div>
                    `).join('') : `
                        <div class="col-span-full py-24 text-center flex flex-col items-center opacity-20">
                            <i data-lucide="lock" class="w-16 h-16 mb-6 text-gov-blue"></i>
                            <p class="text-[10px] font-black uppercase tracking-[0.4em]">Accès Citoyen Standard • Aucun privilège spécial</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    else if (currentTab === 'sanctions') {
        tabContent = `
            <div class="space-y-4 animate-in max-w-5xl mx-auto pb-20">
                ${sanctions.length > 0 ? sanctions.map(s => {
                    const typeColor = s.type === 'warn' ? 'orange-600' : s.type === 'mute' ? 'gov-red' : 'black';
                    return `
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] flex items-center justify-between group hover:border-gov-red/20 transition-all shadow-xl">
                            <div class="flex items-center gap-8">
                                <div class="w-14 h-14 rounded-2xl bg-gov-light flex items-center justify-center text-xl font-black uppercase text-${typeColor} border border-gray-200 shadow-inner group-hover:scale-105 transition-transform italic">${s.type[0]}</div>
                                <div>
                                    <div class="text-[12px] font-black text-gov-text uppercase tracking-tight italic">${s.type.toUpperCase()} — ÉMIS LE ${new Date(s.created_at).toLocaleDateString()}</div>
                                    <div class="text-[14px] text-gray-500 font-medium italic mt-2 leading-relaxed">"${s.reason}"</div>
                                </div>
                            </div>
                            ${!s.appeal_at ? `
                                <button onclick="actions.openAppealModal('${s.id}')" class="text-[9px] font-black text-gov-blue uppercase tracking-widest border-2 border-gov-blue px-6 py-3 rounded-2xl hover:bg-gov-blue hover:text-white transition-all shadow-lg">CONTESTER</button>
                            ` : '<span class="text-[9px] font-black text-gray-400 uppercase italic bg-gov-light px-4 py-2 rounded-xl border border-gray-200">En cours d\'examen</span>'}
                        </div>
                    `;
                }).join('') : '<div class="text-center py-32 text-[11px] text-gray-400 font-black uppercase tracking-[0.5em] border-4 border-dashed border-gray-100 rounded-[48px]">Casier Judiciaire Vierge</div>'}
            </div>
        `;
    }

    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        tabContent = `
            <div class="bg-white p-16 rounded-[56px] border-t-[12px] border-gov-red shadow-2xl animate-in max-w-4xl mx-auto text-center">
                <div class="w-20 h-20 bg-red-50 text-gov-red rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl border border-red-100">
                    <i data-lucide="shield-alert" class="w-10 h-10"></i>
                </div>
                <h4 class="text-5xl font-black text-gov-text uppercase italic mb-6 tracking-tighter">Droit à l'Oubli</h4>
                <p class="text-md text-gray-500 leading-relaxed mb-12 font-medium italic">"L'exercice de ce droit entraîne la suppression irrévocable de votre identité nationale de nos bases. L'intégralité de vos comptes, avoirs et dossiers sera effacée sous 72h."</p>
                
                ${deletionDate ? `
                    <div class="bg-orange-50 border-2 border-orange-200 p-10 rounded-[40px] mb-12 inline-block w-full">
                        <div class="text-[10px] text-orange-600 font-black uppercase tracking-[0.4em] mb-4">Phase de purge active</div>
                        <div class="text-5xl font-mono font-black text-gov-text mb-8 tracking-tighter">72:00:00</div>
                        <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-black transition-all shadow-2xl transform hover:scale-105 active:scale-95">ANNULER LA PROCÉDURE</button>
                    </div>
                ` : `
                    <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-12 py-6 rounded-[24px] font-black uppercase text-xs tracking-[0.3em] hover:bg-black transition-all shadow-[0_20px_50px_rgba(225,0,15,0.3)] transform hover:scale-105 active:scale-95">
                        RÉSILIER MON IDENTITÉ
                    </button>
                `}
                <div class="mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-50">Conformité RGPD • Article 17</div>
            </div>
        `;
    }

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] min-h-screen overflow-y-auto custom-scrollbar">
        
        <!-- UNIVERSAL NAVBAR WITH INTEGRATED TABS -->
        <nav class="terminal-nav flex items-center justify-between shrink-0 bg-white border-b border-gray-100 px-10 sticky top-0 z-[1000] h-[80px]">
            <div class="flex items-center gap-8 h-full">
                <div class="marianne-block uppercase font-black text-gov-text scale-90 origin-left">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase font-black">Liberté • Égalité • Justice</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">ÉTAT DE CALIFORNIE</div>
                </div>
                
                <div class="h-8 w-px bg-gray-100"></div>
                
                <button onclick="actions.confirmLogout()" class="text-[10px] font-black text-gray-400 hover:text-gov-red uppercase tracking-[0.2em] transition-all flex items-center gap-3 group">
                    <i data-lucide="home" class="w-4 h-4 group-hover:scale-110 transition-transform"></i>
                    <span>Retour Accueil</span>
                </button>
            </div>

            <!-- TABS MOVED TO NAVBAR -->
            <div class="hidden lg:flex items-center h-full gap-1">
                ${tabs.map(t => `
                    <button onclick="actions.setProfileTab('${t.id}')" 
                        class="px-6 h-full flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] transition-all border-b-4 ${currentTab === t.id ? 'text-gov-blue border-gov-blue bg-blue-50/30' : 'text-gray-400 border-transparent hover:text-gov-text hover:bg-gray-50'}">
                        <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i>
                        ${t.label}
                    </button>
                `).join('')}
            </div>

            <div class="flex items-center gap-8 h-full">
                <div class="flex items-center gap-4">
                    <div class="text-right hidden sm:block">
                        <div class="text-[11px] font-black text-gov-text uppercase italic leading-none">${u.username}</div>
                        <div class="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1.5 flex items-center justify-end gap-2">
                             SIGNAL CERTIFIÉ <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        </div>
                    </div>
                    <div class="relative w-12 h-12">
                        <div class="w-full h-full rounded-2xl border-2 border-gov-blue p-0.5 relative z-10 overflow-hidden bg-white">
                             <img src="${u.avatar}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                        </div>
                        ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none scale-110">` : ''}
                    </div>
                </div>
            </div>
        </nav>

        <!-- DISCORD COVER BANNER -->
        <div class="relative h-72 md:h-96 shrink-0 overflow-hidden bg-gov-blue">
            ${u.banner ? `<img src="${u.banner}" class="w-full h-full object-cover">` : '<div class="w-full h-full bg-gradient-to-r from-gov-blue via-blue-900 to-indigo-900 opacity-90"></div>'}
            <div class="absolute inset-0 bg-gradient-to-t from-[#F6F6F6] via-transparent to-transparent"></div>
            <div class="absolute inset-0 bg-black/10"></div>
        </div>

        <!-- PROFILE HEADER -->
        <div class="max-w-6xl mx-auto w-full px-10 -mt-40 relative z-10 mb-20">
            <div class="flex flex-col md:flex-row items-end gap-12">
                <div class="relative group mx-auto md:mx-0">
                    <div class="w-56 h-56 rounded-[48px] border-[12px] border-white bg-white shadow-[0_30px_60px_rgba(0,0,0,0.2)] overflow-hidden relative">
                        <img src="${u.avatar}" class="w-full h-full object-cover">
                        ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] max-w-none z-20 pointer-events-none">` : ''}
                    </div>
                    <div class="absolute -bottom-2 -right-2 w-14 h-14 bg-gov-blue text-white rounded-2xl flex items-center justify-center border-[6px] border-white shadow-2xl transform rotate-12">
                        <i data-lucide="verified" class="w-7 h-7"></i>
                    </div>
                </div>
                <div class="flex-1 pb-8 text-center md:text-left">
                    <div class="text-[12px] font-black text-gov-blue uppercase tracking-[0.5em] mb-4 flex items-center justify-center md:justify-start gap-4">
                        <span class="w-8 h-0.5 bg-gov-blue opacity-30"></span> DOSSIER CITOYEN TFRP
                    </div>
                    <h2 class="text-7xl font-black text-gov-text tracking-tighter uppercase italic leading-none drop-shadow-xl">${u.username}</h2>
                    <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                        <span class="text-gray-400 font-mono text-[11px] uppercase tracking-widest bg-white px-5 py-2 rounded-xl border border-gray-100 shadow-md flex items-center gap-3">
                            <i data-lucide="hash" class="w-3.5 h-3.5"></i> UID: ${u.id}
                        </span>
                        ${u.isFounder ? '<span class="text-[11px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-5 py-2 border border-purple-200 rounded-xl italic shadow-md flex items-center gap-3"><i data-lucide="crown" class="w-3.5 h-3.5"></i> Fondation</span>' : ''}
                        <div class="bg-emerald-500/10 border border-emerald-500/20 px-5 py-2 rounded-xl flex items-center gap-3 shadow-md">
                            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span class="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Connexion Sécurisée</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MAIN TAB CONTENT (FULL WIDTH) -->
        <div class="max-w-6xl mx-auto w-full px-10 flex-1">
            ${tabContent}
        </div>

        <div class="bg-white border-t border-gray-100 py-12 text-center shrink-0 mt-20">
            <div class="marianne-block uppercase font-black text-gov-text scale-75 inline-flex mb-6">
                <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red">Liberté • Égalité • Justice</div>
                <div class="text-md leading-none">ÉTAT DE CALIFORNIE</div>
            </div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.6em]">Système de Gestion des Identités Civiles • Terminal Officiel</p>
        </div>
    </div>
    `;
};