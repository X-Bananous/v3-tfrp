
import { state } from './state.js';
import { CONFIG } from './config.js';
import { ui } from './ui.js';

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

// --- DATA FETCHING (CITIZENS, REPORTS, INVOICES) ---
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

export const fetchCharacterReports = async (charId) => {
    const { data } = await state.supabase.from('police_report_suspects').select('*, police_reports(*)').eq('character_id', charId).order('created_at', { ascending: false });
    state.policeReports = data?.map(d => d.police_reports) || [];
};

export const fetchPlayerInvoices = async (charId) => {
    const { data } = await state.supabase.from('invoices').select('*, enterprises(name)').eq('buyer_id', charId).order('created_at', { ascending: false });
    state.invoices = data || [];
    return data;
};

// --- ENTERPRISES ---
export const fetchEnterprises = async () => {
    const { data } = await state.supabase.from('enterprises').select('*, leader:characters!enterprises_leader_id_fkey(first_name, last_name)');
    state.enterprises = data || [];
};

export const fetchMyEnterprises = async (charId) => {
    const { data } = await state.supabase.from('enterprise_members').select('*, enterprises(*)').eq('character_id', charId);
    state.myEnterprises = data?.map(d => ({ ...d.enterprises, myRank: d.rank, myStatus: d.status })) || [];
};

export const fetchEnterpriseMarket = async () => {
    const { data } = await state.supabase.from('enterprise_items').select('*, enterprises(name)').eq('status', 'approved').eq('is_hidden', false);
    state.enterpriseMarket = data || [];
};

export const fetchEnterpriseDetails = async (entId) => {
    const { data: ent } = await state.supabase.from('enterprises').select('*').eq('id', entId).single();
    const { data: members } = await state.supabase.from('enterprise_members').select('*, characters(first_name, last_name)').eq('enterprise_id', entId);
    const { data: items } = await state.supabase.from('enterprise_items').select('*').eq('enterprise_id', entId);
    const { data: promos } = await state.supabase.from('enterprise_promos').select('*').eq('enterprise_id', entId);
    const { data: appointments } = await state.supabase.from('enterprise_appointments').select('*, characters(first_name, last_name)').eq('enterprise_id', entId);
    
    state.activeEnterpriseManagement = { ...ent, members, items, promos, appointments };
};

// --- ILLICIT & GANGS ---
export const fetchGangs = async () => {
    const { data } = await state.supabase.from('gangs').select('*, leader:characters!gangs_leader_id_fkey(first_name, last_name, user_id), co_leader:characters!gangs_co_leader_id_fkey(first_name, last_name, user_id)');
    state.gangs = data || [];
};

export const fetchActiveGang = async (charId) => {
    const { data } = await state.supabase.from('gang_members').select('*, gangs(*)').eq('character_id', charId).maybeSingle();
    if (data) {
        const { data: members } = await state.supabase.from('gang_members').select('*, characters(first_name, last_name)').eq('gang_id', data.gang_id);
        state.activeGang = { ...data.gangs, myRank: data.rank, myStatus: data.status, members };
    } else {
        state.activeGang = null;
    }
};

export const fetchDrugLab = async (gangId) => {
    const { data } = await state.supabase.from('drug_labs').select('*').eq('gang_id', gangId).maybeSingle();
    state.drugLab = data;
};

// --- HEISTS ---
export const fetchGlobalHeists = async () => {
    const { data } = await state.supabase.from('heist_lobbies').select('*').eq('status', 'active');
    state.globalActiveHeists = data || [];
};

export const fetchActiveHeistLobby = async (charId) => {
    const { data: member } = await state.supabase.from('heist_members').select('*, heist_lobbies(*)').eq('character_id', charId).in('status', ['pending', 'accepted']).maybeSingle();
    if (member) {
        state.activeHeistLobby = member.heist_lobbies;
        const { data: members } = await state.supabase.from('heist_members').select('*, characters(first_name, last_name)').eq('lobby_id', member.lobby_id);
        state.heistMembers = members || [];
    } else {
        state.activeHeistLobby = null;
    }
};

export const fetchAvailableLobbies = async () => {
    const { data } = await state.supabase.from('heist_lobbies').select('*').in('status', ['setup', 'active']);
    state.availableHeistLobbies = data || [];
};

export const fetchLastFinishedHeist = async () => {
    const { data } = await state.supabase.from('heist_lobbies').select('end_time').eq('status', 'finished').order('end_time', { ascending: false }).limit(1).maybeSingle();
    return data ? new Date(data.end_time) : null;
};

// --- EMERGENCY ---
export const fetchEmergencyCalls = async () => {
    const { data } = await state.supabase.from('emergency_calls').select('*').eq('status', 'open').order('created_at', { ascending: false });
    state.emergencyCalls = data || [];
};

// --- CONFIG & SESSIONS ---
export const fetchSecureConfig = async () => {
    const { data } = await state.supabase.from('keys_data').select('*');
    if (data) {
        data.forEach(item => {
            if (item.key === 'admin_ids') state.adminIds = JSON.parse(item.value);
            if (item.key === 'gouv_bank') state.gouvBank = parseFloat(item.value);
            if (item.key === 'tva_tax') state.economyConfig.tva_tax = parseFloat(item.value);
            if (item.key === 'create_item_ent_tax') state.economyConfig.create_item_ent_tax = parseFloat(item.value);
            if (item.key === 'driver_license_price') state.economyConfig.driver_license_price = parseFloat(item.value);
            if (item.key === 'driver_stage_price') state.economyConfig.driver_stage_price = parseFloat(item.value);
            if (item.key === 'taux_bank') state.savingsRate = parseFloat(item.value);
        });
    }
};

export const fetchActiveSession = async () => {
    const { data } = await state.supabase.from('game_sessions').select('*, host:profiles(username)').eq('status', 'active').maybeSingle();
    state.activeGameSession = data || null;
    return data;
};

export const fetchPublicLandingData = async () => {
    const { data: staff } = await state.supabase.from('profiles').select('id, username, avatar_url, permissions').not('permissions', 'is', null).limit(8);
    state.landingStaff = staff || [];
};

export const fetchERLCData = async () => {
    // Stub pour compatibilité, normalement fetch via API ERLC
    state.erlcData = { players: [], currentPlayers: 0, maxPlayers: 42, joinKey: 'TFRP-3' };
    return state.erlcData;
};

export const fetchPendingApplications = async () => {
    const { data } = await state.supabase.from('characters').select('*, profiles(username, avatar_url)').eq('status', 'pending');
    state.pendingApplications = data || [];
};

export const fetchServerStats = async () => {
    const { data: bankSum } = await state.supabase.rpc('sum_bank_balances');
    state.serverStats = { totalBank: bankSum || 0, totalCash: 0, totalMoney: bankSum || 0, totalCoke: 0, totalWeed: 0 };
};

// --- UTILS & CHECKERS ---
export const IllicitViewCheck = () => {
    if (!state.user) return false;
    return true; 
};

export const setupRealtimeListener = () => {
    // Implémentation facultative pour les mises à jour auto
};

// --- ACTIONS / MUTATIONS ---
export const adminCreateCharacter = async (charData) => {
    const { data, error } = await state.supabase.from('characters').insert([charData]).select().single();
    if (error) throw error;
    return data;
};

export const createNotification = async (title, message, type, isPinned, userId) => {
    return await state.supabase.from('notifications').insert({ title, message, type, is_pinned: isPinned, user_id: userId });
};

export const deleteCharacter = async (charId) => {
    return await state.supabase.from('characters').delete().eq('id', charId);
};

export const assignJob = async (charId, jobName) => {
    return await state.supabase.from('characters').update({ job: jobName }).eq('id', charId);
};

// Stubs additionnels pour éviter les SyntaxErrors
export const searchProfiles = async () => [];
export const toggleStaffDuty = async () => {};
export const startSession = async () => {};
export const stopSession = async () => {};
export const createGang = async () => {};
export const updateGang = async () => {};
export const createEnterprise = async () => {};
export const updateEnterprise = async () => {};
export const updateDrugLab = async () => {};
export const createHeistLobby = async () => {};
export const joinLobbyRequest = async () => {};
export const acceptLobbyMember = async () => {};
export const startHeistSync = async () => {};
export const updateGangBalance = async () => {};
export const updateEnterpriseBalance = async () => {};
export const fetchGlobalSanctions = async () => [];
export const fetchPendingHeistReviews = async () => [];
export const fetchDailyEconomyStats = async () => [];
export const fetchGlobalTransactions = async () => [];
export const fetchPendingEnterpriseItems = async () => [];
export const fetchTopSellers = async () => [];
export const fetchClientAppointments = async () => [];
export const fetchEnterpriseDetails_Simple = async () => {};
export const fetchSessionHistory = async () => [];
export const checkAndCompleteDrugBatch = async () => {};
export const adminResolveHeist = async () => {};
export const executeServerCommand = async () => {};
export const createPoliceReport = async () => true;
export const joinEmergencyCall = async () => {};
export const processSalaries = async () => {};
export const moderateEnterpriseItem = async () => {};
export const updateEnterpriseItem = async () => {};
export const joinEnterprise = async () => {};
export const fetchTransactionsForAdmin = async () => [];
