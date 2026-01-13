import { state } from '../state.js';
import { render, router } from '../utils.js';
import { ui } from '../ui.js';
import { 
    loadCharacters, fetchBankData, fetchInventory, fetchActiveHeistLobby, 
    fetchGlobalHeists, fetchEmergencyCalls, fetchAllCharacters, fetchAllReports, fetchEnterprises,
    fetchERLCData, fetchNotifications, fetchSecureConfig, fetchActiveSession, fetchPlayerInvoices
} from '../services.js';

export const backToSelect = async () => {
    state.activeCharacter = null;
    state.bankAccount = null;
    state.ui.mobileMenuOpen = false;
    sessionStorage.removeItem('tfrp_active_char');
    sessionStorage.removeItem('tfrp_hub_panel');
    await loadCharacters();
    router('profile_hub');
};

export const backToLanding = () => {
    state.activeCharacter = null;
    state.activeHubPanel = 'main';
    state.currentView = 'login';
    state.ui.mobileMenuOpen = false;
    sessionStorage.removeItem('tfrp_active_char');
    sessionStorage.removeItem('tfrp_hub_panel');
    sessionStorage.setItem('tfrp_current_view', 'login');
    router('login');
};

export const toggleMobileMenu = () => {
    state.ui.mobileMenuOpen = !state.ui.mobileMenuOpen;
    render();
};

export const selectCharacter = async (charId) => {
    const char = state.characters.find(c => c.id === charId);
    if (char && char.status === 'accepted') {
        if (char.deletion_requested_at) {
            ui.showToast("Dossier verrouillé pour suppression.", "error");
            return;
        }
        state.activeCharacter = char;
        state.activeHubPanel = 'main';
        sessionStorage.setItem('tfrp_active_char', charId);
        state.isPanelLoading = true;
        router('hub'); 
        try {
             await Promise.all([fetchActiveSession(), fetchGlobalHeists(), fetchERLCData(), fetchNotifications()]);
        } finally { state.isPanelLoading = false; render(); }
    }
};

export const goToCreate = () => router('create');
export const cancelCreate = () => router('profile_hub');

export const setHubPanel = async (panel) => {
    state.ui.mobileMenuOpen = false;
    
    if (panel === 'profile') {
        state.activeProfileTab = 'identity';
        router('profile_hub');
        return;
    }

    if (panel === 'staff') {
        const hasStaffAccess = Object.keys(state.user.permissions || {}).some(k => state.user.permissions[k] === true) || state.user.isFounder;
        if (!hasStaffAccess) return ui.showToast("Accès Fondation refusé.", "error");
    }
    if (panel === 'illicit') {
        if (state.activeCharacter?.alignment !== 'illegal') return ui.showToast("Accès réservé au secteur clandestin.", "error");
    }

    state.activeHubPanel = panel;
    sessionStorage.setItem('tfrp_hub_panel', panel);
    state.isPanelLoading = true;
    render(); 
    try {
        if (panel === 'main') await Promise.all([fetchActiveSession(), fetchGlobalHeists(), fetchERLCData(), fetchNotifications()]);
        else if (panel === 'notifications') await fetchNotifications();
        else if (panel === 'jobs') await fetchEnterprises();
        else if (panel === 'bank') await fetchBankData(state.activeCharacter.id);
        else if (panel === 'assets') await Promise.all([fetchInventory(state.activeCharacter.id), fetchPlayerInvoices(state.activeCharacter.id)]);
        else if (panel === 'staff') await Promise.all([fetchPendingApplications(), fetchAllCharacters(), fetchStaffProfiles(), fetchGlobalHeists()]);
    } finally { state.isPanelLoading = false; render(); }
};

export const setProfileTab = (tab) => {
    state.activeProfileTab = tab;
    state.ui.mobileMenuOpen = false;
    render();
};

export const confirmLogout = () => {
    state.ui.mobileMenuOpen = false;
    ui.showModal({
        title: "DÉCONNEXION SÉCURISÉE",
        content: "Souhaitez-vous fermer définitivement votre session administrative ?",
        confirmText: "Confirmer la sortie",
        cancelText: "Annuler",
        type: 'danger',
        onConfirm: () => {
            if (window.actions && window.actions.logout) {
                window.actions.logout();
            }
        }
    });
};
