
import { state } from './state.js';
import { CONFIG } from './config.js';

// --- AUTH & PROFILE ---
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

export const fetchStaffProfiles = async () => {
    const { data } = await state.supabase.from('profiles').select('*').not('permissions', 'is', null);
    state.staffMembers = data || [];
};

export const fetchOnDutyStaff = async () => {
    const { data } = await state.supabase.from('on_duty_staff').select('*, profiles(username, avatar_url)');
    state.onDutyStaff = data || [];
};

// --- DATA FETCHING ---
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
    if (!state.user) return;
    const { data } = await state.supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${state.user.id},user_id.is.null`)
        .order('created_at', { ascending: false });
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

export const fetchPlayerInvoices = async (charId) => {
    const { data } = await state.supabase.from('invoices').select('*, enterprises(name)').eq('buyer_id', charId).order('created_at', { ascending: false });
    state.invoices = data || [];
};

// --- ILLICIT & HEISTS ---
export const fetchGlobalHeists = async () => {
    const { data } = await state.supabase.from('heist_lobbies').select('*').eq('status', 'active');
    state.globalActiveHeists = data || [];
};

export const fetchActiveHeistLobby = async (charId) => {
    const { data } = await state.supabase.from('heist_members').select('*, heist_lobbies(*)').eq('character_id', charId).eq('status', 'accepted').maybeSingle();
    state.activeHeistLobby = data?.heist_lobbies || null;
};

export const fetchAvailableLobbies = async () => {
    const { data } = await state.supabase.from('heist_lobbies').select('*').in('status', ['setup', 'active']);
    state.availableHeistLobbies = data || [];
};

// --- EMERGENCY & SESSIONS ---
export const fetchEmergencyCalls = async () => {
    const { data } = await state.supabase.from('emergency_calls').select('*').eq('status', 'open');
    state.emergencyCalls = data || [];
};

export const fetchActiveSession = async () => {
    const { data } = await state.supabase.from('game_sessions').select('*, host:profiles(username)').eq('status', 'active').maybeSingle();
    state.activeGameSession = data || null;
    return data;
};

export const fetchPendingApplications = async () => {
    const { data } = await state.supabase.from('characters').select('*, profiles(username, avatar_url)').eq('status', 'pending');
    state.pendingApplications = data || [];
};

// --- CONFIG ---
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

export const fetchPublicLandingData = async () => {
    const { data: staff } = await state.supabase.from('profiles').select('id, username, avatar_url, permissions').not('permissions', 'is', null).limit(8);
    state.landingStaff = staff || [];
};

export const setupRealtimeListener = () => {
    // Stubs pour la compatibilité
};

export const fetchERLCData = async () => ({ players: [], currentPlayers: 0 });

export const IllicitViewCheck = () => {
    if (!state.user) return false;
    return true; // Accès géré par le grade RP du perso ou staff
};
