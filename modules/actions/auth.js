
import { state } from '../state.js';
import { CONFIG } from '../config.js';
import { router, render } from '../utils.js';
import { ui } from '../ui.js';
import { loadCharacters } from '../services.js';

export const login = async () => {
    state.isLoggingIn = true;
    render();

    const safetyTimeout = setTimeout(() => {
        if (state.isLoggingIn) {
            state.isLoggingIn = false;
            ui.showToast("Délai d'attente passé.", 'warning');
            render();
        }
    }, 8000);

    try {
        if (!state.supabase) throw new Error("Supabase non initialisé.");
        const { error } = await state.supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                scopes: 'identify guilds',
                redirectTo: CONFIG.REDIRECT_URI
            }
        });
        if (error) throw error;
    } catch (e) {
        clearTimeout(safetyTimeout);
        state.isLoggingIn = false;
        ui.showToast("Erreur connexion: " + e.message, 'error');
        render();
    }
};

export const openFoundationModal = () => {
    ui.showModal({
        title: "ACCÈS FONDATION",
        content: `
            <div class="text-center space-y-4">
                <div class="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-400 border border-blue-500/20 shadow-xl">
                    <i data-lucide="shield-alert" class="w-10 h-10"></i>
                </div>
                <p class="text-sm text-gray-500 italic">Voulez-vous injecter une session administrateur racine ? Cela vous permettra de gérer le panel sans personnage RP.</p>
            </div>
        `,
        confirmText: "CONFIRMER L'INJECTION",
        onConfirm: () => bypassLogin()
    });
};

export const bypassLogin = async () => {
    const isAdmin = state.adminIds.includes(state.user?.id) || Object.keys(state.user?.permissions || {}).length > 0;
    if (!state.user || !isAdmin) return;
    
    state.activeCharacter = {
        id: 'FOUNDATION_ROOT',
        user_id: state.user.id,
        first_name: 'ACCÈS',
        last_name: 'FONDATION',
        status: 'accepted',
        alignment: 'legal',
        job: 'leo' // Permet l'accès aux services par défaut
    };
    
    sessionStorage.setItem('tfrp_active_char', 'FOUNDATION_ROOT');
    state.activeHubPanel = 'staff'; 
    router('hub');
};

export const confirmLogout = () => {
    ui.showModal({
        title: "DÉCONNEXION",
        content: "Souhaitez-vous fermer votre session ?",
        confirmText: "Déconnexion",
        type: 'danger',
        onConfirm: () => logout()
    });
};

export const logout = async () => {
    if(state.supabase) await state.supabase.auth.signOut();
    state.user = null;
    state.activeCharacter = null;
    sessionStorage.clear();
    router('login');
};
