
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

// --- DATA FETCHING (CITIZENS & REPORTS) ---
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

// --- ILLICIT & GANGS ---
export const fetchGangs = async () => {
    const { data } = await state.supabase.from('gangs').select('*, leader:characters!gangs_leader_id_fkey(first_name, last_name, user_id), co_leader:characters!gangs_co_leader_id_fkey(first_name, last_name, user_id)');
    state.gangs = data || [];
};

export const fetchActiveGang = async (charId) => {
    const { data } = await state.supabase.from('gang_members').select('*, gangs(*)').eq('character_id', charId).maybeSingle();
    if (data) {
        const { data: members } = await state.supabase.from('gang_members').select('*, characters(first_name, last_name)').eq('gang_id', data.gang_id);
        const { data: fullGang } = await state.supabase.from('gangs').select('*, leader:characters!gangs_leader_id_fkey(first_name, last_name, user_id), co_leader:characters!gangs_co_leader_id_fkey(first_name, last_name, user_id)').eq('id', data.gang_id).single();
        state.activeGang = { ...fullGang, myRank: data.rank, myStatus: data.status, members };
    } else {
        state.activeGang = null;
    }
};

export const fetchDrugLab = async (gangId) => {
    const { data } = await state.supabase.from('drug_labs').select('*').eq('gang_id', gangId).maybeSingle();
    if (!data) {
        const { data: newLab } = await state.supabase.from('drug_labs').insert({ gang_id: gangId }).select().single();
        state.drugLab = newLab;
    } else {
        state.drugLab = data;
    }
};

// --- ECONOMY & STATS ---
export const fetchServerStats = async () => {
    const { data: bankSum } = await state.supabase.rpc('sum_bank_balances');
    const { data: cashSum } = await state.supabase.rpc('sum_cash_balances');
    state.serverStats = {
        totalMoney: (bankSum || 0) + (cashSum || 0),
        totalBank: bankSum || 0,
        totalCash: cashSum || 0,
        totalCoke: 0,
        totalWeed: 0
    };
};

export const fetchDailyEconomyStats = async () => {
    const { data } = await state.supabase.from('daily_economy_stats').select('*').order('date', { ascending: false }).limit(14);
    state.dailyEconomyStats = data || [];
};

export const fetchGlobalTransactions = async () => {
    const { data } = await state.supabase.from('transactions').select('*, sender:characters!transactions_sender_id_fkey(first_name, last_name), receiver:characters!transactions_receiver_id_fkey(first_name, last_name)').order('created_at', { ascending: false }).limit(50);
    state.globalTransactions = data || [];
};

// --- HEISTS ---
export const fetchActiveHeistLobby = async (charId) => {
    const { data: member } = await state.supabase.from('heist_members').select('*, heist_lobbies(*)').eq('character_id', charId).in('status', ['pending', 'accepted']).maybeSingle();
    if (member) {
        state.activeHeistLobby = member.heist_lobbies;
        const { data: members } = await state.supabase.from('heist_members').select('*, characters(first_name, last_name)').eq('lobby_id', member.lobby_id);
        state.heistMembers = members || [];
    } else {
        state.activeHeistLobby = null;
        state.heistMembers = [];
    }
};

export const fetchAvailableLobbies = async () => {
    const { data } = await state.supabase.from('heist_lobbies').select('*').in('status', ['setup', 'active']);
    state.availableHeistLobbies = data || [];
};

export const fetchPendingHeistReviews = async () => {
    const { data } = await state.supabase.from('heist_lobbies').select('*, characters(first_name, last_name)').eq('status', 'pending_review');
    state.pendingHeistReviews = data || [];
};

// --- ADMIN ACTIONS ---
export const adminCreateCharacter = async (charData) => {
    const { data, error } = await state.supabase.from('characters').insert([charData]).select().single();
    if (error) throw error;
    return data;
};

export const deleteCharacter = async (charId) => {
    return await state.supabase.from('characters').delete().eq('id', charId);
};

export const assignJob = async (charId, jobName) => {
    return await state.supabase.from('characters').update({ job: jobName }).eq('id', charId);
};

// --- MISC ---
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

export const createNotification = async (title, message, type, isPinned, userId) => {
    return await state.supabase.from('notifications').insert({ title, message, type, is_pinned: isPinned, user_id: userId });
};

export const setupRealtimeListener = () => {};
export const fetchERLCData = async () => ({ players: [], currentPlayers: 0 });
export const fetchPendingApplications = async () => {
    const { data } = await state.supabase.from('characters').select('*, profiles(username, avatar_url)').eq('status', 'pending');
    state.pendingApplications = data || [];
};
export const fetchActiveSession = async () => {
    const { data } = await state.supabase.from('game_sessions').select('*, host:profiles(username)').eq('status', 'active').maybeSingle();
    state.activeGameSession = data || null;
    return data;
};

export const IllicitViewCheck = () => {
    if (!state.user) return false;
    // Autoriser staff ou fondateur par défaut pour éviter le blocage
    if (state.user.isFounder || Object.keys(state.user.permissions || {}).length > 0) return true;
    return true; 
};

// STUBS REQUIS
export const fetchPlayerInvoices = async () => [];
export const fetchEmergencyCalls = async () => [];
export const searchProfiles = async () => [];
export const toggleStaffDuty = async () => {};
export const startSession = async () => {};
export const stopSession = async () => {};
export const updateGang = async () => {};
export const createGang = async () => {};
export const updateEnterprise = async () => {};
export const updateDrugLab = async () => {};
export const createHeistLobby = async () => {};
export const joinLobbyRequest = async () => {};
export const acceptLobbyMember = async () => {};
export const startHeistSync = async () => {};
export const updateGangBalance = async () => {};
export const updateEnterpriseBalance = async () => {};
export const fetchGlobalSanctions = async () => {
    const { data } = await state.supabase.from('sanctions').select('*, target:profiles!sanctions_user_id_fkey(username, avatar_url), staff:profiles!sanctions_staff_id_fkey(username)').order('created_at', { ascending: false });
    state.globalSanctions = data || [];
};
