
import { CONFIG } from '../config.js';
import { state } from '../state.js';

export const CharacterCreateView = () => {
    const isEdit = !!state.editingCharacter;
    const char = state.editingCharacter || {};

    return `
    <div class="flex-1 flex flex-col bg-[#F6F6F6] animate-gov-in min-h-full font-sans">
        
        <header class="bg-white border-b border-gray-200 px-8 py-10 shrink-0">
            <div class="max-w-4xl mx-auto flex justify-between items-end">
                <div>
                    <div class="text-[10px] font-black text-[#000091] uppercase tracking-[0.3em] mb-2">Formulaire CERFA-TFRP v12.4</div>
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
                    
                    <!-- Section IDENTITE -->
                    <div class="space-y-8">
                        <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest border-b-4 border-[#000091] w-fit pb-1">1. État Civil de l'individu</h3>
                        
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

                    <!-- Section ORIENTATION -->
                    <div class="space-y-8">
                        <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest border-b-4 border-[#000091] w-fit pb-1">2. Orientation Socio-Professionnelle</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label class="cursor-pointer group">
                                <input type="radio" name="alignment" value="legal" class="peer sr-only" required ${char.alignment !== 'illegal' ? 'checked' : ''}>
                                <div class="p-8 border-2 border-gray-100 peer-checked:border-[#000091] peer-checked:bg-blue-50/50 hover:bg-gray-50 transition-all">
                                    <div class="w-12 h-12 bg-blue-100 text-[#000091] rounded-lg flex items-center justify-center mb-6">
                                        <i data-lucide="briefcase" class="w-6 h-6"></i>
                                    </div>
                                    <div class="font-black text-gray-900 text-lg uppercase italic tracking-tight mb-2">Secteur Légal</div>
                                    <p class="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-relaxed">Emplois civils, fonction publique et respect strict des décrets municipaux.</p>
                                </div>
                            </label>
                            
                            <label class="cursor-pointer group">
                                <input type="radio" name="alignment" value="illegal" class="peer sr-only" ${char.alignment === 'illegal' ? 'checked' : ''}>
                                <div class="p-8 border-2 border-gray-100 peer-checked:border-[#E1000F] peer-checked:bg-red-50/50 hover:bg-gray-50 transition-all">
                                    <div class="w-12 h-12 bg-red-100 text-[#E1000F] rounded-lg flex items-center justify-center mb-6">
                                        <i data-lucide="skull" class="w-6 h-6"></i>
                                    </div>
                                    <div class="font-black text-gray-900 text-lg uppercase italic tracking-tight mb-2">Clandestinité</div>
                                    <p class="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-relaxed">Activités non répertoriées, risques judiciaires élevés et absence de protection sociale.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Disclaimer -->
                    <div class="bg-[#F6F6F6] p-6 text-[11px] text-gray-600 leading-relaxed font-medium italic border-l-4 border-gray-300 uppercase tracking-wide">
                        L’usurpation d’identité ou la fourniture de fausses informations lors du recensement constitue un délit grave. Les informations collectées font l'objet d'un traitement informatique destiné à la gestion du registre national.
                    </div>

                    <div class="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-end gap-6 items-center">
                        <button type="button" onclick="actions.cancelCreate()" class="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors">Annuler la procédure</button>
                        <button type="submit" class="w-full md:w-auto px-12 py-5 bg-[#000091] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">
                            DÉPOSER LE DOSSIER
                        </button>
                    </div>
                </form>
            </div>
            
            <div class="mt-20 mb-10 text-center opacity-30">
                <div class="text-[9px] font-black uppercase tracking-[0.6em] text-gray-500">République de Los Angeles • Portail Immigration</div>
            </div>
        </div>
    </div>
    `;
};
