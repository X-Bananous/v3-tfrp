import { state } from '../state.js';
import { render, router } from '../utils.js';
import { ui } from '../ui.js';
import { 
    loadCharacters, fetchBankData, fetchInventory, fetchActiveHeistLobby, 
    fetchGlobalHeists, fetchEmergencyCalls, fetchAllCharacters, fetchAllReports, fetchEnterprises,
    fetchERLCData, fetchPendingApplications, fetchStaffProfiles, fetchOnDutyStaff, 
    fetchNotifications, fetchSecureConfig, fetchActiveSession, fetchPlayerInvoices
} from '../services.js';

export const backToSelect = async () => {
    state.activeCharacter = null;
    state.bankAccount = null;
    sessionStorage.removeItem('tfrp_active_char');
    sessionStorage.removeItem('tfrp_hub_panel');
    await loadCharacters();
    router('profile_hub');
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
        else if (panel === 'staff') await Promise.all([fetchPendingApplications(), fetchAllCharacters()]);
        else if (panel === 'profile') {
            state.activeProfileTab = 'identity';
            if (window.actions.loadUserSanctions) await window.actions.loadUserSanctions();
        }
    } finally { state.isPanelLoading = false; render(); }
};

export const setProfileTab = (tab) => {
    state.activeProfileTab = tab;
    render();
};