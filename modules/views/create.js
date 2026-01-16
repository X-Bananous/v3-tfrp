import { CONFIG } from '../config.js';
import { state } from '../state.js';

export const CharacterCreateView = () => {
    const isEdit = !!state.editingCharacter;
    const char = state.editingCharacter || {};
    
    // Valeur par défaut pour le type de personnage
    const charType = char.infos?.type || 'permanent';

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] animate-gov-in min-h-full font-sans">
        
        <header class="bg-white border-b border-gray-200 px-8 py-10 shrink-0">
            <div class="max-w-4xl mx-auto flex justify-between items-end">
                <div>
                    <div class="text-[10px] font-black text-[#000091] uppercase tracking-[0.3em] mb-2">Formulaire CERFA-TFRP v14.2</div>
                    <h2 class="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">${isEdit ? 'Révision d\'État Civil' : 'Demande de Recensement'}</h2>
                    <p class="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Dépôt de dossier auprès des services de l'immigration</p>
                </div>
                <button onclick="actions.cancelCreate()" class="text-gray-400 hover:text-red-600 transition-colors p-2">
                    <i data-lucide="x" class="w-8 h-8"></i>
                </button>
            </div>
        </header>

        <div class="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div class="max-w-4xl mx-auto bg-white border border-gray-200 p-10 md:p-16 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <i data-lucide="landmark" class="w-64 h-64 text-black"></i>
                </div>

                <form onsubmit="actions.submitCharacter(event)" class="space-y-12 relative z-10">
                    
                    <!-- 1. TYPE DE DOSSIER -->
                    <div class="space-y-8 ${isEdit ? 'opacity-60 pointer-events-none' : ''}">
                        <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest border-b-4 border-[#000091] w-fit pb-1">
                            1. Type de dossier administratif ${isEdit ? '<span class="text-[10px] text-gray-400 ml-2">(Verrouillé)</span>' : ''}
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label class="cursor-pointer group">
                                <input type="radio" name="char_type" value="permanent" class="peer sr-only" ${charType === 'permanent' ? 'checked' : ''} ${isEdit ? 'disabled' : ''} onchange="window.updateFormType('permanent')">
                                <div class="p-6 border-2 border-gray-100 peer-checked:border-gov-blue peer-checked:bg-blue-50/50 rounded-2xl transition-all">
                                    <div class="font-black uppercase text-sm mb-1">Citoyen Permanent</div>
                                    <p class="text-[10px] text-gray-500 italic uppercase font-bold">Dossier long-terme avec archivage total.</p>
                                </div>
                            </label>
                            <label class="cursor-pointer group">
                                <input type="radio" name="char_type" value="temporary" class="peer sr-only" ${charType === 'temporary' ? 'checked' : ''} ${isEdit ? 'disabled' : ''} onchange="window.updateFormType('temporary')">
                                <div class="p-6 border-2 border-gray-100 peer-checked:border-orange-500 peer-checked:bg-orange-50/50 rounded-2xl transition-all">
                                    <div class="font-black uppercase text-sm mb-1">Visa Temporaire</div>
                                    <p class="text-[10px] text-gray-500 italic uppercase font-bold">Valide pour une seule session de jeu.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- 2. IDENTITE -->
                    <div class="space-y-8">
                        <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest border-b-4 border-[#000091] w-fit pb-1">2. État Civil de l'individu</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div class="space-y-3">
                                <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">Prénom(s)</label>
                                <input type="text" name="first_name" value="${char.first_name || ''}" required placeholder="Jean-Luc" 
                                    class="w-full p-4 border-b-2 border-gray-200 focus:border-[#000091] outline-none text-gray-900 font-bold uppercase tracking-tight transition-all">
                            </div>
                            <div class="space-y-3">
                                <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">Nom de famille</label>
                                <input type="text" name="last_name" value="${char.last_name || ''}" required placeholder="DUPONT" 
                                    class="w-full p-4 border-b-2 border-gray-200 focus:border-[#000091] outline-none text-gray-900 font-bold uppercase tracking-tight transition-all">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div class="space-y-3">
                                <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">Date de naissance</label>
                                <input type="date" name="birth_date" value="${char.birth_date || ''}" required 
                                    class="w-full p-4 border-b-2 border-gray-200 focus:border-[#000091] outline-none text-gray-900 font-mono">
                            </div>
                            <div class="space-y-3">
                                <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">Lieu de naissance</label>
                                <input type="text" name="birth_place" value="${char.birth_place || 'Los Angeles'}" required 
                                    class="w-full p-4 border-b-2 border-gray-200 focus:border-[#000091] outline-none text-gray-900 font-bold uppercase italic">
                            </div>
                        </div>
                    </div>

                    <!-- 3. DETAILS JSON (Dynamique) - Masqué en mode édition -->
                    ${!isEdit ? `
                    <div id="dynamic-details" class="space-y-8 animate-in">
                        ${charType === 'permanent' ? `
                            <div class="space-y-6">
                                <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest border-b-4 border-[#000091] w-fit pb-1">3. Justification du dossier</h3>
                                <div class="space-y-3">
                                    <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">Pourquoi ce personnage ? (Objectif & Lore - 500 car. min)</label>
                                    <textarea name="info_reason" required minlength="500" class="w-full p-4 border-2 border-gray-100 rounded-2xl h-48 text-sm italic outline-none focus:border-gov-blue transition-all" placeholder="Détaillez ici votre vision long terme pour ce citoyen..."></textarea>
                                </div>
                            </div>
                        ` : `
                            <div class="space-y-6">
                                <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest border-b-4 border-orange-500 w-fit pb-1">3. Contexte du Visa Temporaire</h3>
                                <div class="grid grid-cols-1 gap-6">
                                    <div class="space-y-2">
                                        <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">L'objectif (Scène précise)</label>
                                        <input type="text" name="info_goal" required placeholder="Ex: Remplacement temporaire pour un braquage..." class="w-full p-4 border-b-2 border-gray-200 focus:border-orange-500 outline-none text-sm font-bold">
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">Contexte Global</label>
                                        <textarea name="info_context" required class="w-full p-4 border-2 border-gray-100 rounded-xl h-24 text-sm outline-none focus:border-orange-500 transition-all"></textarea>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">Intervenants impliqués</label>
                                        <input type="text" name="info_who" required placeholder="Ex: Gang des Vagos, Unité LSPD Alpha..." class="w-full p-4 border-b-2 border-gray-200 focus:border-orange-500 outline-none text-sm font-bold">
                                    </div>
                                </div>
                            </div>
                        `}
                    </div>
                    ` : ''}

                    <!-- 4. ORIENTATION -->
                    <div class="space-y-8">
                        <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest border-b-4 border-[#000091] w-fit pb-1">${isEdit ? '3' : '4'}. Orientation Socio-Professionnelle</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label class="cursor-pointer group">
                                <input type="radio" name="alignment" value="legal" class="peer sr-only" required ${char.alignment !== 'illegal' ? 'checked' : ''}>
                                <div class="p-8 border-2 border-gray-100 peer-checked:border-[#000091] peer-checked:bg-blue-50/50 hover:bg-gray-50 transition-all rounded-3xl">
                                    <div class="w-12 h-12 bg-blue-100 text-[#000091] rounded-lg flex items-center justify-center mb-6"><i data-lucide="briefcase" class="w-6 h-6"></i></div>
                                    <div class="font-black text-gray-900 text-lg uppercase italic tracking-tight mb-2">Secteur Légal</div>
                                    <p class="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-relaxed">Respect strict des décrets municipaux.</p>
                                </div>
                            </label>
                            <label class="cursor-pointer group">
                                <input type="radio" name="alignment" value="illegal" class="peer sr-only" ${char.alignment === 'illegal' ? 'checked' : ''}>
                                <div class="p-8 border-2 border-gray-100 peer-checked:border-[#E1000F] peer-checked:bg-red-50/50 hover:bg-gray-50 transition-all rounded-3xl">
                                    <div class="w-12 h-12 bg-red-100 text-[#E1000F] rounded-lg flex items-center justify-center mb-6"><i data-lucide="skull" class="w-6 h-6"></i></div>
                                    <div class="font-black text-gray-900 text-lg uppercase italic tracking-tight mb-2">Clandestinité</div>
                                    <p class="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-relaxed">Activités non répertoriées.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-end gap-6 items-center">
                        <button type="button" onclick="actions.cancelCreate()" class="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors">Annuler la procédure</button>
                        <button type="submit" class="w-full md:w-auto px-12 py-5 bg-[#000091] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">
                            ${isEdit ? 'METTRE À JOUR LE DOSSIER' : 'DÉPOSER LE DOSSIER'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
};

// Injection globale pour la réactivité du formulaire sans re-render complet
window.updateFormType = (type) => {
    const container = document.getElementById('dynamic-details');
    if (!container) return;
    
    if (type === 'permanent') {
        container.innerHTML = `
            <div class="space-y-6">
                <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest border-b-4 border-[#000091] w-fit pb-1">3. Justification du dossier</h3>
                <div class="space-y-3">
                    <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">Pourquoi ce personnage ? (Objectif & Lore - 500 car. min)</label>
                    <textarea name="info_reason" required minlength="500" class="w-full p-4 border-2 border-gray-100 rounded-2xl h-48 text-sm italic outline-none focus:border-gov-blue transition-all" placeholder="Détaillez ici votre vision long terme pour ce citoyen..."></textarea>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="space-y-6">
                <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest border-b-4 border-orange-500 w-fit pb-1">3. Contexte du Visa Temporaire</h3>
                <div class="grid grid-cols-1 gap-6">
                    <div class="space-y-2">
                        <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">L'objectif (Scène précise)</label>
                        <input type="text" name="info_goal" required placeholder="Ex: Remplacement temporaire pour un braquage..." class="w-full p-4 border-b-2 border-gray-200 focus:border-orange-500 outline-none text-sm font-bold">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">Contexte Global</label>
                        <textarea name="info_context" required class="w-full p-4 border-2 border-gray-100 rounded-xl h-24 text-sm outline-none focus:border-orange-500 transition-all"></textarea>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[11px] font-black text-gray-600 uppercase tracking-widest block">Intervenants impliqués</label>
                        <input type="text" name="info_who" required placeholder="Ex: Gang des Vagos, Unité LSPD Alpha..." class="w-full p-4 border-b-2 border-gray-200 focus:border-orange-500 outline-none text-sm font-bold">
                    </div>
                </div>
            </div>
        `;
    }
    if (window.lucide) lucide.createIcons();
};