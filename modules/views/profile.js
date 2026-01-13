import { state } from '../state.js';
import { CONFIG } from '../config.js';

export const ProfileView = () => {
    const u = state.user;
    if (!u) return '';

    const currentTab = state.activeProfileTab || 'identity';
    const perms = u.permissions || {};
    const permKeys = Object.keys(perms).filter(k => perms[k] === true);
    const characters = state.characters || [];
    const sanctions = state.userSanctions || [];

    // Navigation Tabs Definition
    const tabs = [
        { id: 'identity', label: 'Identité & Droits', icon: 'shield-check' },
        { id: 'characters', label: 'Dossiers Citoyens', icon: 'users' },
        { id: 'sanctions', label: 'Casier Disciplinaire', icon: 'alert-triangle' },
        { id: 'security', label: 'Sécurité & RGPD', icon: 'lock' }
    ];

    let tabContent = '';

    // --- TAB: IDENTITY ---
    if (currentTab === 'identity') {
        tabContent = `
            <div class="space-y-8 animate-in">
                <div class="gov-card p-8 bg-white shadow-xl flex flex-col h-full">
                    <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                        <i data-lucide="shield-check" class="w-4 h-4 text-gov-blue"></i> Privilèges & Accréditations Système
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        `;
    }

    // --- TAB: CHARACTERS ---
    else if (currentTab === 'characters') {
        tabContent = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in">
                ${characters.map(char => {
                    const charDelDate = char.deletion_requested_at ? new Date(char.deletion_requested_at) : null;
                    const isDeleting = !!charDelDate;
                    return `
                        <div class="gov-card p-6 bg-white border ${isDeleting ? 'border-orange-200 bg-orange-50' : 'border-gray-100'} rounded-sm flex flex-col group transition-all shadow-sm">
                            <div class="flex justify-between items-start mb-6">
                                <div class="w-12 h-16 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 grayscale">
                                    <i data-lucide="user" class="w-6 h-6"></i>
                                </div>
                                <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase border ${char.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}">
                                    ${isDeleting ? 'PURGE ACTIVE' : char.status.toUpperCase()}
                                </span>
                            </div>
                            <h4 class="text-xl font-black text-gov-text uppercase italic mb-1">${char.first_name} ${char.last_name}</h4>
                            <div class="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-6">${char.job || 'CIVIL'}</div>
                            <div class="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                <span class="text-[9px] text-gray-400 font-bold uppercase">ID: #${char.id.substring(0,8).toUpperCase()}</span>
                                ${isDeleting ? `
                                    <button onclick="actions.cancelCharacterDeletion('${char.id}')" class="text-[8px] font-black text-gov-blue uppercase tracking-widest hover:underline">Annuler Purge</button>
                                ` : `
                                    <button onclick="actions.requestCharacterDeletion('${char.id}')" class="text-[8px] font-black text-gov-red uppercase tracking-widest hover:underline">Demander Purge</button>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
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
                        <div class="p-5 bg-white border border-gray-100 rounded-sm flex items-center justify-between group hover:border-red-100 transition-all shadow-sm">
                            <div class="flex items-center gap-6">
                                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xs font-black uppercase text-${typeColor} border border-gray-100 shadow-inner">${s.type[0]}</div>
                                <div>
                                    <div class="text-[10px] font-black text-gov-text uppercase tracking-tight">${s.type.toUpperCase()} - ${new Date(s.created_at).toLocaleDateString()}</div>
                                    <div class="text-[11px] text-gray-500 font-medium italic mt-0.5">"${s.reason}"</div>
                                </div>
                            </div>
                            ${!s.appeal_at ? `
                                <button onclick="actions.openAppealModal('${s.id}')" class="text-[9px] font-black text-gov-blue uppercase tracking-widest border border-gov-blue px-3 py-1 rounded hover:bg-gov-blue hover:text-white transition-all">Contester</button>
                            ` : '<span class="text-[9px] font-black text-gray-400 uppercase italic bg-gray-50 px-2 py-1 rounded">Appel en examen</span>'}
                        </div>
                    `;
                }).join('') : '<div class="text-center py-20 text-[10px] text-gray-400 font-black uppercase tracking-widest border-2 border-dashed border-gray-100 rounded-sm">Casier Administratif Vierge</div>'}
            </div>
        `;
    }

    // --- TAB: SECURITY ---
    else if (currentTab === 'security') {
        const deletionDate = u.deletion_requested_at ? new Date(u.deletion_requested_at) : null;
        tabContent = `
            <div class="gov-card p-10 bg-white border-t-8 border-gov-red shadow-xl animate-in">
                <h4 class="text-2xl font-black text-gov-text uppercase italic mb-4">Protection des Données (RGPD)</h4>
                <p class="text-sm text-gray-500 leading-relaxed mb-10 max-w-2xl font-medium">Conformément aux lois de protection des données, vous avez le droit de demander la suppression intégrale de votre identité. Cette action est irréversible après 72h.</p>
                
                ${deletionDate ? `
                    <div class="bg-orange-50 border border-orange-200 p-8 rounded-sm mb-10 text-center">
                        <div class="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-2">Phase de purge active</div>
                        <div class="text-2xl font-mono font-bold text-gov-text mb-6">Effacement dans <span id="profile-del-timer">72h</span></div>
                        <button onclick="actions.cancelDataDeletion()" class="bg-gov-text text-white px-10 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg">Interrompre la procédure</button>
                    </div>
                ` : `
                    <button onclick="actions.requestDataDeletion()" class="bg-gov-red text-white px-10 py-4 font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg">Détruire mon identité nationale</button>
                `}
            </div>
        `;
    }

    return `
    <div class="h-full flex flex-col bg-[#F6F6F6] overflow-y-auto custom-scrollbar animate-fade-in">
        
        <!-- DISCORD COVER BANNER -->
        <div class="relative h-48 md:h-64 shrink-0 overflow-hidden bg-gov-blue">
            ${u.banner ? `<img src="${u.banner}" class="w-full h-full object-cover">` : '<div class="w-full h-full bg-gradient-to-r from-gov-blue to-blue-900 opacity-80"></div>'}
            <div class="absolute inset-0 bg-gradient-to-t from-[#F6F6F6] to-transparent"></div>
        </div>

        <!-- PROFILE HEADER -->
        <div class="max-w-6xl mx-auto w-full px-8 -mt-24 relative z-10 mb-12">
            <div class="flex flex-col md:flex-row items-end gap-8">
                <div class="relative group">
                    <div class="w-40 h-40 rounded-full border-8 border-white bg-white shadow-2xl overflow-hidden relative">
                        <img src="${u.avatar}" class="w-full h-full object-cover">
                        ${u.decoration ? `<img src="${u.decoration}" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] max-w-none z-20 pointer-events-none">` : ''}
                    </div>
                    <div class="absolute bottom-2 right-2 w-10 h-10 bg-gov-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                        <i data-lucide="verified" class="w-5 h-5"></i>
                    </div>
                </div>
                <div class="flex-1 pb-4 text-center md:text-left">
                    <div class="text-[10px] font-black text-gov-blue uppercase tracking-[0.4em] mb-2 flex items-center justify-center md:justify-start gap-2">
                        <span class="w-4 h-0.5 bg-gov-blue"></span> Signal d'Identité Sécurisé
                    </div>
                    <h2 class="text-5xl font-black text-gov-text tracking-tighter uppercase italic leading-none drop-shadow-sm">${u.username}</h2>
                    <div class="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                        <span class="text-gray-400 font-mono text-[9px] uppercase tracking-widest bg-white px-3 py-1 rounded-sm border border-gray-100 shadow-sm">UID: ${u.id}</span>
                        ${u.isFounder ? '<span class="text-[9px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 border border-purple-100 rounded-sm italic shadow-sm">Haut Directoire</span>' : ''}
                    </div>
                </div>
            </div>
        </div>

        <!-- NAVIGATION SUB-TABS -->
        <div class="max-w-6xl mx-auto w-full px-8 mb-10">
            <div class="flex flex-wrap gap-2 border-b border-gray-200">
                ${tabs.map(t => `
                    <button onclick="actions.setProfileTab('${t.id}')" 
                        class="px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${currentTab === t.id ? 'text-gov-blue' : 'text-gray-400 hover:text-gov-text'}">
                        <div class="flex items-center gap-3">
                            <i data-lucide="${t.icon}" class="w-4 h-4"></i>
                            ${t.label}
                        </div>
                        ${currentTab === t.id ? '<div class="absolute bottom-0 left-0 w-full h-1 bg-gov-blue animate-in slide-in-from-left"></div>' : ''}
                    </button>
                `).join('')}
            </div>
        </div>

        <!-- MAIN TAB CONTENT -->
        <div class="max-w-6xl mx-auto w-full px-8 pb-32">
            ${tabContent}
        </div>

    </div>
    `;
};