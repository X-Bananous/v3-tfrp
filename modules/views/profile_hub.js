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
    const isMobileMenuOpen = state.ui.mobileMenuOpen;

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

    const MobileMenuOverlay = () => `
        <div class="fixed inset-0 z-[2000] bg-white flex flex-col animate-in">
            <div class="h-20 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div class="marianne-block uppercase font-black text-gov-text scale-75 origin-left">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase font-black">État de Californie</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>
                <button onclick="actions.toggleMobileMenu()" class="p-3 bg-gov-light text-gov-text rounded-full">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                ${tabs.map(t => `
                    <button onclick="actions.setProfileTab('${t.id}')" class="w-full text-left py-4 border-b border-gray-100 font-black uppercase text-xs tracking-widest ${currentTab === t.id ? 'text-gov-blue' : 'text-gray-400'}">
                        ${t.label}
                    </button>
                `).join('')}
                <div class="mt-auto pt-10 flex flex-col gap-4">
                    <button onclick="actions.backToLanding()" class="w-full py-4 bg-gov-light text-gov-text font-black uppercase text-[10px] tracking-widest text-center rounded-xl">Accueil</button>
                    <button onclick="actions.confirmLogout()" class="w-full py-4 bg-red-50 text-red-600 font-black uppercase text-[10px] tracking-widest text-center rounded-xl">Déconnexion</button>
                </div>
            </div>
        </div>
    `;

    let tabContent = '';
    if (currentTab === 'identity') {
        tabContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in pb-20">
                ${characters.map(char => {
                    const isAccepted = char.status === 'accepted';
                    const isDeleting = !!char.deletion_requested_at;
                    const statusColor = isDeleting ? 'orange' : isAccepted ? 'emerald' : 'amber';
                    return `
                        <div class="gov-card flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden transition-all hover:shadow-2xl">
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
                                <h3 class="text-3xl font-black text-gov-text uppercase italic tracking-tighter leading-none mb-6">${char.last_name}<br><span class="text-gov-blue">${char.first_name}</span></h3>
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center py-2 border-b border-gray-50"><span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secteur</span><span class="${char.alignment === 'illegal' ? 'text-gov-red' : 'text-gov-blue'} text-[10px] font-black uppercase italic">${char.alignment}</span></div>
                                    <div class="flex justify-between items-center py-2"><span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Référence</span><span class="text-gray-400 font-mono text-[9px]">#${char.id.substring(0,8).toUpperCase()}</span></div>
                                </div>
                            </div>
                            <div class="p-6 bg-gov-light/30 border-t border-gray-100 flex flex-col gap-2">
                                ${isAccepted && !isDeleting ? `
                                    <button onclick="actions.selectCharacter('${char.id}')" class="w-full py-4 bg-gov-blue text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all rounded-xl shadow-lg transform active:scale-95">CHARGER LE DOSSIER</button>
                                ` : isDeleting ? `
                                    <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="w-full py-3 bg-white border-2 border-orange-500 text-orange-600 font-black text-[9px] uppercase tracking-widest hover:bg-orange-50 transition-all rounded-xl">ANNULER LA SUPPRESSION</button>
                                ` : `<div class="w-full py-4 bg-gray-100 text-gray-400 font-black text-[9px] uppercase tracking-widest rounded-xl text-center border border-gray-200 italic">VÉRIFICATION...</div>`}
                            </div>
                        </div>
                    `;
                }).join('')}
                ${characters.length < CONFIG.MAX_CHARS ? `
                    <button onclick="actions.goToCreate()" class="group bg-white/40 border-4 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center p-12 hover:border-gov-blue hover:bg-blue-50/50 transition-all min-h-[400px]">
                        <div class="w-16 h-16 bg-white text-gray-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-gov-blue group-hover:text-white transition-all shadow-xl group-hover:scale-110 duration-500"><i data-lucide="plus" class="w-8 h-8"></i></div>
                        <span class="text-gov-text text-xl font-black uppercase italic tracking-tighter">NOUVEAU<br>RECENSEMENT</span>
                    </button>
                ` : ''}
            </div>
        `;
    } else if (currentTab === 'perms') {
        tabContent = `
            <div class="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl animate-in max-w-4xl mx-auto">
                <h4 class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-10">Privilèges du Profil</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${permKeys.length > 0 ? permKeys.map(k => `
                        <div class="bg-gov-light p-4 rounded-xl border border-gray-100 flex items-center gap-4 hover:border-gov-blue/20 transition-all">
                            <div class="w-9 h-9 bg-gov-blue text-white rounded-lg flex items-center justify-center shadow-lg"><i data-lucide="check" class="w-4 h-4"></i></div>
                            <span class="text-[10px] font-black text-gov-text uppercase tracking-widest">${k.replace('can_', '').replace(/_/g, ' ')}</span>
                        </div>
                    `).join('') : '<p class="col-span-full py-10 text-center text-gray-400 uppercase font-black text-[9px]">Aucune accréditation staff</p>'}
                </div>
            </div>
        `;
    } else if (currentTab === 'sanctions') {
        tabContent = `
            <div class="space-y-4 animate-in max-w-4xl mx-auto pb-20">
                ${sanctions.length > 0 ? sanctions.map(s => `
                    <div class="p-6 bg-white border border-gray-100 rounded-[28px] flex items-center justify-between shadow-xl">
                        <div class="flex items-center gap-6">
                            <div class="w-12 h-12 rounded-full bg-gov-light flex items-center justify-center text-lg font-black uppercase text-gov-red italic border border-gray-200">${s.type[0]}</div>
                            <div><div class="text-[10px] font-black text-gov-text uppercase italic">${s.type.toUpperCase()} — ${new Date(s.created_at).toLocaleDateString()}</div><div class="text-[12px] text-gray-500 font-medium italic mt-1 leading-relaxed">"${s.reason}"</div></div>
                        </div>
                        ${!s.appeal_at ? `<button onclick="actions.openAppealModal('${s.id}')" class="text-[8px] font-black text-gov-blue uppercase tracking-widest border-2 border-gov-blue px-4 py-2 rounded-xl hover:bg-gov-blue hover:text-white transition-all">CONTESTER</button>` : '<span class="text-[8px] font-black text-gray-400 uppercase italic">En examen</span>'}
                    </div>
                `).join('') : '<p class="text-center py-20 text-gray-400 uppercase font-black text-[9px]">Casier Vierge</p>'}
            </div>
        `;
    } else if (currentTab === 'security') {
        tabContent = `
            <div class="bg-white p-12 rounded-[48px] border-t-8 border-gov-red shadow-2xl animate-in max-w-3xl mx-auto text-center">
                <h4 class="text-4xl font-black text-gov-text uppercase italic mb-4 tracking-tighter">Droit à l'Oubli</h4>
                <p class="text-sm text-gray-500 mb-10 font-medium italic">L'exercice de ce droit entraîne la suppression irrévocable de vos données sous 72h.</p>
                ${u.deletion_requested_at ? `
                    <div class="bg-orange-50 border-2 border-orange-200 p-8 rounded-[32px] mb-8 inline-block w-full">
                        <div class="text-[9px] text-orange-600 font-black uppercase tracking-[0.4em] mb-4">Purge active</div>
                        <div class="text-4xl font-mono font-black text-gov-text mb-8">72:00:00</div>
                        <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all">ANNULER LA PROCÉDURE</button>
                    </div>
                ` : `<button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:opacity-90 transition-all shadow-xl">DÉTRUIRE MON IDENTITÉ</button>`}
            </div>
        `;
    }

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] min-h-screen">
        ${isMobileMenuOpen ? MobileMenuOverlay() : ''}
        
        <nav class="shrink-0 bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[1000] h-20 shadow-sm">
            <div class="flex items-center gap-4 md:gap-6 h-full">
                <div onclick="actions.backToLanding()" class="marianne-block uppercase font-black text-gov-text scale-75 origin-left cursor-pointer hover:opacity-70 transition-opacity">
                    <div class="text-[8px] tracking-widest border-b-2 border-gov-red pb-0.5 mb-1 text-gov-red uppercase font-black">État de Californie</div>
                    <div class="text-md leading-none uppercase tracking-tighter italic">LOS ANGELES</div>
                </div>
                <div class="hidden lg:flex items-center gap-1 h-full">
                    ${tabs.map(t => `<button onclick="actions.setProfileTab('${t.id}')" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${currentTab === t.id ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-400 hover:text-gov-text'}">${t.label}</button>`).join('')}
                </div>
            </div>

            <div class="flex items-center gap-2 md:gap-4 h-full">
                <div class="flex items-center gap-3 pr-4 md:pr-6 border-r border-gray-100 h-full">
                    <div class="text-right hidden sm:block"><div class="text-[10px] font-black text-gov-text uppercase italic leading-none">${u.username}</div><div class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">PROFIL V3</div></div>
                    <div class="relative w-10 h-10">
                        <img src="${u.avatar}" class="w-full h-full rounded-full border-2 border-gov-blue p-0.5 bg-white object-cover relative z-10">
                        ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                    </div>
                </div>
                
                <button onclick="actions.toggleMobileMenu()" class="lg:hidden p-2.5 bg-gov-light text-gov-text rounded-full">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                </button>
                
                <button onclick="actions.confirmLogout()" class="hidden sm:flex items-center gap-2 text-[9px] font-black text-gov-red uppercase tracking-widest hover:bg-red-50 p-3 rounded-full transition-all">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                </button>
            </div>
        </nav>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
            <div class="relative h-48 md:h-64 shrink-0 overflow-hidden bg-gov-blue">
                ${u.banner ? `<img src="${u.banner}" class="w-full h-full object-cover">` : '<div class="w-full h-full bg-gradient-to-r from-gov-blue to-indigo-900 opacity-90"></div>'}
                <div class="absolute inset-0 bg-gradient-to-t from-[#F6F6F6] via-transparent to-transparent"></div>
            </div>
            <main class="max-w-6xl mx-auto w-full px-6 md:px-8 -mt-24 relative z-10 pb-32">
                <div class="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 mb-16">
                    <div class="relative group">
                        <div class="w-40 h-40 rounded-full border-[8px] border-white bg-white shadow-2xl overflow-hidden relative">
                            <img src="${u.avatar}" class="w-full h-full object-cover">
                        </div>
                        ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none z-20 pointer-events-none">` : ''}
                        <div class="absolute bottom-2 right-2 w-10 h-10 bg-gov-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl rotate-12 z-30"><i data-lucide="verified" class="w-5 h-5"></i></div>
                    </div>
                    <div class="text-center md:text-left flex-1">
                        <h2 class="text-5xl font-black text-gov-text tracking-tighter uppercase italic leading-none drop-shadow-xl">${u.username}</h2>
                        <p class="text-gray-400 font-mono text-[10px] mt-4 uppercase tracking-widest">ID UNIVERSEL : ${u.id}</p>
                    </div>
                </div>
                ${tabContent}
            </main>
            <footer class="py-12 text-center opacity-30 border-t border-gray-100">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">TEAM FRENCH ROLEPLAY • V3 FINAL EDITION</p>
            </footer>
        </div>
    </div>
    `;
};