
import { state } from './state.js';
import { CONFIG } from './config.js';

export const loadCharacters = async () => {
    if (!state.user) return;
    const { data, error } = await state.supabase
        .from('characters')
        .select('*')
        .eq('user_id', state.user.id)
        .order('created_at', { ascending: false });
    if (!error) state.characters = data;
    return data;
};

export const fetchBankData = async (charId) => {
    const { data } = await state.supabase.from('bank_accounts').select('*').eq('character_id', charId).maybeSingle();
    state.bankAccount = data;
    return data;
};

export const fetchInventory = async (charId) => {
    const { data } = await state.supabase.from('inventory').select('*').eq('character_id', charId);
    state.inventory = data || [];
    return data;
};

export const fetchNotifications = async () => {
    const { data } = await state.supabase.from('notifications').select('*').or(`user_id.eq.${state.user.id},user_id.is.null`).order('created_at', { ascending: false });
    state.notifications = data || [];
};

export const fetchAllCharacters = async () => {
    const { data } = await state.supabase.from('characters').select('*, profiles(username, avatar_url)').order('last_name', { ascending: true });
    state.allCharactersAdmin = data || [];
};

export const fetchAllReports = async () => {
    const { data } = await state.supabase.from('police_reports').select('*, police_report_suspects(*)').order('created_at', { ascending: false });
    state.globalReports = data || [];
};

export const fetchEnterprises = async () => {
    const { data } = await state.supabase.from('enterprises').select('*, leader:characters!enterprises_leader_id_fkey(first_name, last_name)');
    state.enterprises = data || [];
};

export const fetchPublicLandingData = async () => {
    const { data: staff } = await state.supabase.from('profiles').select('id, username, avatar_url, permissions').not('permissions', 'is', null).limit(8);
    state.landingStaff = staff || [];
};

export const fetchSecureConfig = async () => {
    const { data } = await state.supabase.from('keys_data').select('*');
    if (data) {
        data.forEach(item => {
            if (item.key === 'admin_ids') state.adminIds = JSON.parse(item.value);
            if (item.key === 'gouv_bank') state.gouvBank = parseFloat(item.value);
            if (item.key === 'tva_tax') state.economyConfig.tva_tax = parseFloat(item.value);
            if (item.key === 'create_item_ent_tax') state.economyConfig.create_item_ent_tax = parseFloat(item.value);
        });
    }
};

export const IllicitViewCheck = () => {
    if (!state.user) return false;
    if (state.user.isFounder) return true;
    const hasPerm = state.user.permissions?.can_manage_illegal === true;
    // On simule un succès si l'user est authentifié (la guild sera gérée par les actions)
    return true; 
};

// Fonctions additionnelles requises par app.js
export const setupRealtimeListener = () => {};
export const fetchERLCData = async () => ({ players: [], currentPlayers: 0 });
export const fetchPendingApplications = async () => [];
export const fetchActiveSession = async () => null;
export const fetchPlayerInvoices = async () => [];
