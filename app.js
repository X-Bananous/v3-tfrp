
/**
 * TFRP Core Application v5.0
 * Design Gouvernemental - Accès Direct
 */

import { CONFIG } from './modules/config.js';
import { state } from './modules/state.js';
import { router, render } from './modules/utils.js';
import { ui } from './modules/ui.js'; 
import { initSecurity } from './modules/security.js';

// Import Actions
import * as AuthActions from './modules/actions/auth.js';
import * as NavActions from './modules/actions/navigation.js';
import * as CharacterActions from './modules/actions/character.js';
import * as EconomyActions from './modules/actions/economy.js';
import * as IllicitActions from './modules/actions/illicit.js';
import * as ServicesActions from './modules/actions/services.js';
import * as EnterpriseActions from './modules/actions/enterprise.js'; 
import * as StaffActions from './modules/actions/staff.js';
import * as ProfileActions from './modules/actions/profile.js';
import * as WheelActions from './modules/actions/wheel.js';

import { setupRealtimeListener, fetchERLCData, fetchActiveHeistLobby, fetchDrugLab, fetchGlobalHeists, fetchOnDutyStaff, loadCharacters, fetchPublicLandingData, fetchActiveSession, fetchSecureConfig, fetchActiveGang, checkAndCompleteDrugBatch, fetchBankData } from './modules/services.js';

// Views
import { LoginView, AccessDeniedView, DeletionPendingView } from './modules/views/login.js';
import { CharacterSelectView } from './modules/views/select.js';
import { CharacterCreateView } from './modules/views/create.js';
import { HubView } from './modules/views/hub.js';
import { TermsView, PrivacyView } from './modules/views/legal.js';
import { WheelView } from './modules/views/wheel.js';

window.actions = {
    ...AuthActions, ...NavActions, ...CharacterActions, ...EconomyActions,
    ...IllicitActions, ...ServicesActions, ...StaffActions,
    ...EnterpriseActions, ...ProfileActions, ...WheelActions
};

window.router = router;

const updateLoadStatus = (msg) => {
    state.loadingStatus = msg;
    const el = document.getElementById('loading-status');
    if (el) el.textContent = msg;
};

const appRenderer = () => {
    const app = document.getElementById('app');
    if (!app) return;

    let htmlContent = '';
    let effectiveView = state.currentView;

    if (state.user?.deletion_requested_at && effectiveView !== 'login') effectiveView = 'deletion_pending';
    if (state.user?.isBanned && effectiveView !== 'login') effectiveView = 'banned';

    switch (effectiveView) {
        case 'login': htmlContent = LoginView(); break;
        case 'deletion_pending': htmlContent = DeletionPendingView(); break;
        case 'access_denied': htmlContent = AccessDeniedView(); break;
        case 'select': htmlContent = CharacterSelectView(); break;
        case 'create': htmlContent = CharacterCreateView(); break;
        case 'hub': htmlContent = HubView(); break;
        case 'terms': htmlContent = TermsView(); break;
        case 'privacy': htmlContent = PrivacyView(); break;
        case 'wheel': htmlContent = WheelView(); break;
        case 'banned': htmlContent = `
            <div class="flex-1 flex items-center justify-center p-10 text-center h-full gov-landing">
                <div class="bg-white p-12 border-t-8 border-red-600 shadow-2xl max-w-lg">
                    <div class="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
                        <i data-lucide="shield-off" class="w-10 h-10"></i>
                    </div>
                    <h2 class="text-3xl font-black text-[#161616] uppercase italic tracking-tighter mb-4">Accès Révoqué</h2>
                    <p class="text-gray-600 mb-8 font-medium">Votre accès au portail citoyen a été suspendu pour violation du cadre communautaire.</p>
                    <button onclick="actions.logout()" class="px-8 py-4 bg-[#161616] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Quitter l'administration</button>
                </div>
            </div>
        `; break;
        default: htmlContent = LoginView();
    }

    app.innerHTML = htmlContent;
    if (window.lucide) setTimeout(() => lucide.createIcons(), 50);
};

const startPolling = () => {
    setInterval(async () => {
        if (!state.user) return;
        await fetchActiveSession();
        await fetchERLCData();
        if (state.activeHubPanel === 'main' || state.activeHubPanel === 'staff') {
             await fetchGlobalHeists();
             await fetchOnDutyStaff();
        }
    }, 15000);
};

const initApp = async () => {
    initSecurity();
    if (window.supabase) {
        state.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        await fetchSecureConfig();
        setupRealtimeListener();
    }

    updateLoadStatus("Synchronisation...");
    await fetchPublicLandingData();
    
    if (window.location.hash && window.location.hash.includes('access_token')) {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const token = params.get('access_token');
        if (token) await handleLegacySession(token);
    } else {
        const result = await state.supabase.auth.getSession();
        if (result.data.session) await handleAuthenticatedSession(result.data.session);
        else router('login');
    }
    startPolling();
};

const handleLegacySession = async (token) => {
    const loadingScreen = document.getElementById('loading-screen');
    try {
        state.accessToken = token;
        const userRes = await fetch('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${token}` } });
        const discordUser = await userRes.json();
        
        loadingScreen.style.opacity = '1';
        loadingScreen.classList.remove('pointer-events-none');

        const { data: profile } = await state.supabase.from('profiles').select('*').eq('id', discordUser.id).maybeSingle();
        const isFounder = state.adminIds.includes(discordUser.id);

        state.user = { 
            id: discordUser.id, 
            username: discordUser.global_name || discordUser.username, 
            avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`, 
            permissions: profile?.permissions || {}, 
            deletion_requested_at: profile?.deletion_requested_at || null, 
            isFounder, isBanned: false, guilds: []
        };

        window.history.replaceState({}, document.title, window.location.pathname);
        await finalizeLoginLogic();
        loadingScreen.style.opacity = '0';
    } catch(e) { router('login'); }
};

const handleAuthenticatedSession = async (session) => {
    const loadingScreen = document.getElementById('loading-screen');
    try {
        const token = session.provider_token || session.access_token;
        state.accessToken = token;
        const { data: { user: supabaseUser } } = await state.supabase.auth.getUser();
        const discordUser = supabaseUser.user_metadata;
        const discordId = discordUser.provider_id || discordUser.sub;

        loadingScreen.style.opacity = '1';
        loadingScreen.classList.remove('pointer-events-none');

        const { data: profile } = await state.supabase.from('profiles').select('*').eq('id', discordId).maybeSingle();
        state.user = { 
            id: discordId, username: discordUser.full_name || discordUser.username, 
            avatar: discordUser.avatar_url, permissions: profile?.permissions || {}, 
            deletion_requested_at: profile?.deletion_requested_at || null, 
            isFounder: state.adminIds.includes(discordId), isBanned: false, guilds: []
        };
        
        await finalizeLoginLogic();
        loadingScreen.style.opacity = '0';
    } catch (e) { router('login'); }
};

const finalizeLoginLogic = async () => {
    await loadCharacters();
    await fetchActiveSession();
    
    const savedCharId = sessionStorage.getItem('tfrp_active_char');
    if (savedCharId) {
        const char = state.characters.find(c => c.id === savedCharId);
        if (char && !char.deletion_requested_at) {
            state.activeCharacter = char;
            router('hub');
        } else router(state.characters.length > 0 ? 'select' : 'create');
    } else {
        router(state.characters.length > 0 ? 'select' : 'create');
    }
};

document.addEventListener('render-view', appRenderer);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp); else initApp();
