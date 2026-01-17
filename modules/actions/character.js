
import { state } from '../state.js';
import { render, router } from '../utils.js';
import { ui, toggleBtnLoading } from '../ui.js';
import { loadCharacters, adminCreateCharacter } from '../services.js';

export const startEditCharacter = (charId) => {
    const char = state.characters.find(c => c.id === charId);
    if (char) {
        state.editingCharacter = char;
        router('create');
    }
};

export const viewCensusDetails = () => {
    const infos = state.user?.infos;
    if (!infos) {
        ui.showToast("Aucune note de recensement enregistrée.", "info");
        return;
    }

    let detailsHtml = '';
    if (infos.type === 'permanent') {
        detailsHtml = `
            <div class="space-y-4">
                <div class="text-[10px] font-black text-gov-blue uppercase tracking-widest border-b border-gray-100 pb-2">Note d'intention (Permanent)</div>
                <div class="p-6 bg-gov-light rounded-2xl border border-gray-200 italic text-sm leading-relaxed text-gray-600">
                    "${infos.reason || 'Non renseignée.'}"
                </div>
            </div>
        `;
    } else {
        detailsHtml = `
            <div class="space-y-6">
                <div class="text-[10px] font-black text-orange-600 uppercase tracking-widest border-b border-gray-100 pb-2">Détails de Session (Temporaire)</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div class="text-[8px] text-orange-400 font-black uppercase mb-1">Objectif</div>
                        <div class="text-xs font-bold text-gray-700">${infos.goal || 'N/A'}</div>
                    </div>
                    <div class="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div class="text-[8px] text-orange-400 font-black uppercase mb-1">Partenaires</div>
                        <div class="text-xs font-bold text-gray-700">${infos.partners || 'N/A'}</div>
                    </div>
                </div>
                <div class="p-6 bg-gov-light rounded-2xl border border-gray-200 italic text-xs leading-relaxed text-gray-600">
                    <div class="text-[8px] text-gray-400 font-black uppercase mb-2 not-italic">Contexte Scénaristique</div>
                    "${infos.context || 'Aucun contexte fourni.'}"
                </div>
            </div>
        `;
    }

    ui.showModal({
        title: "Dossier de Recensement",
        content: detailsHtml,
        confirmText: "Fermer"
    });
};

export const submitCharacter = async (e) => {
    e.preventDefault();
    const btn = e.submitter;
    toggleBtnLoading(btn, true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const today = new Date();
    const birthDate = new Date(data.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age < 13) { 
        ui.showToast('Personnage trop jeune (13 ans minimum).', 'error');
        toggleBtnLoading(btn, false);
        return; 
    }

    const targetUserId = state.isAdminEditing ? state.adminTargetUserId : state.user.id;

    let status = state.isAdminEditing ? 'accepted' : 'pending';
    let job = 'unemployed';
    let isNotified = false;
    let verifiedBy = null;

    if (state.editingCharacter) {
        const oldChar = state.editingCharacter;
        status = oldChar.status;
        job = oldChar.job;
        isNotified = oldChar.is_notified;
        verifiedBy = oldChar.verifiedby;

        if (!state.isAdminEditing && (data.first_name !== oldChar.first_name || data.last_name !== oldChar.last_name)) {
            status = 'pending';
            isNotified = false;
            verifiedBy = null;
        }

        if (data.alignment !== oldChar.alignment) {
            job = 'unemployed';
        }
    }

    // SAUVEGARDE DES INFOS DANS PROFILES (pour éviter erreur table characters)
    if (!state.editingCharacter && state.characters.length > 0 && !state.isAdminEditing) {
        const charInfos = {
            type: data.char_type,
            reason: data.info_permanent_reason,
            goal: data.info_temp_goal,
            partners: data.info_temp_partners,
            context: data.info_temp_context
        };
        
        await state.supabase
            .from('profiles')
            .update({ infos: charInfos })
            .eq('id', state.user.id);
        
        state.user.infos = charInfos;
    }

    const charData = {
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        birth_place: data.birth_place,
        age: age,
        status: status,
        user_id: targetUserId,
        alignment: data.alignment,
        job: job,
        is_notified: state.isAdminEditing ? true : isNotified,
        verifiedby: state.isAdminEditing ? state.user.id : verifiedBy
    };

    let error = null;

    if (state.editingCharacter) {
        const { error: updateError } = await state.supabase
            .from('characters')
            .update(charData)
            .eq('id', state.editingCharacter.id);
        error = updateError;
    } else {
        const { error: insertError } = await state.supabase
            .from('characters')
            .insert([charData]);
        error = insertError;
    }
    
    toggleBtnLoading(btn, false);

    if (!error) {
        if(state.isAdminEditing) {
            ui.showToast("Personnage créé/modifié avec succès.", 'success');
            state.isAdminEditing = false;
            state.editingCharacter = null;
            router('hub');
        } else {
            ui.showToast("Dossier transmis pour validation.", 'success');
            state.editingCharacter = null;
            await loadCharacters();
            router('profile_hub');
        }
    } else {
        ui.showToast("Erreur lors de l'enregistrement.", 'error');
        console.error(error);
    }
};

export const deleteCharacterImmediate = async (charId) => {
    ui.showModal({
        title: "Suppression Immédiate",
        content: "Souhaitez-vous supprimer ce dossier définitivement ? Cette action est instantanée.",
        confirmText: "Supprimer",
        type: "danger",
        onConfirm: async () => {
            const { error } = await state.supabase.from('characters').delete().eq('id', charId).eq('user_id', state.user.id);
            if (!error) { 
                ui.showToast("Dossier supprimé.", 'info');
                await loadCharacters(); 
                render(); 
            } else {
                ui.showToast("Erreur lors de la suppression.", 'error');
            }
        }
    });
};

export const deleteCharacter = async (charId) => {
    // Purge classique avec cooldown
    requestCharacterDeletion(charId);
};
