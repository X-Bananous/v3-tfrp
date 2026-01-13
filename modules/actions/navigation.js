
import { state } from '../state.js';
import { render, router } from '../utils.js';
import { ui } from '../ui.js';
import { 
    loadCharacters, fetchBankData, fetchInventory, fetchActiveHeistLobby, 
    fetchGangs, fetchActiveGang, fetchBounties, fetchDrugLab, 
    fetchGlobalHeists, fetchEmergencyCalls, fetchAllCharacters, fetchAllReports, fetchEnterprises,
    fetchERLCData, fetchPendingApplications, fetchStaffProfiles, fetchOnDutyStaff, 
    fetchServerStats, fetchPendingHeistReviews, fetchDailyEconomyStats, fetchPlayerInvoices, 
    fetchTopSellers, fetchNotifications, fetchSecureConfig, fetchLawyers, fetchActiveSession, fetchSessionHistory,
    fetchEnterpriseMarket, fetchMyEnterprises, fetchEnterpriseDetails, fetchClientAppointments
} from '../services.js';
import { hasPermission } from '../utils.js';

export const backToSelect = async () => {
    state.activeCharacter = null;
    state.bankAccount = null;
    sessionStorage.removeItem('tfrp_active_char');
    sessionStorage.removeItem('tfrp_hub_panel');
    await loadCharacters();
    router('profile_hub'); // Redirection vers le hub fusionné
};

export const selectCharacter = async (charId) => {
    const char = state.characters.find(c => c.id === charId);
    if (char && char.status === 'accepted') {
        if (char.deletion_requested_at) {
            ui.showToast("Dossier verrouillé.", "error");
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
export const goBackFromLegal = () => state.user ? router('profile_hub') : router('login');

export const toggleSidebar = () => {
    state.ui.sidebarOpen = !state.ui.sidebarOpen;
    render();
};

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
        else if (panel === 'staff') await Promise.all([fetchPendingApplications(), fetchAllCharacters(), fetchERLCData()]);
    } finally { state.isPanelLoading = false; render(); }
};

export const refreshCurrentView = async () => {
    try {
        await fetchSecureConfig();
        if (state.activeHubPanel === 'main') await fetchNotifications();
        ui.showToast("Données à jour.", 'success');
    } catch(e) { ui.showToast("Erreur sync.", 'error'); }
    render();
};
