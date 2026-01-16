
/**
 * TFRP Core Application v6.0
 * Unified Identity - California State Division
 */

import { CONFIG } from './modules/config.js';
import { state } from './modules/state.js';
import { router, render } from './modules/utils.js';
import { ui } from './modules/ui.js'; 
import { initSecurity } from './modules/security.js';

// Actions
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

import { setupRealtimeListener, fetchERLCData, loadCharacters, fetchPublicLandingData, fetchSecureConfig } from './modules/services.js';

// Views
import { LoginView, AccessDeniedView, DeletionPendingView } from './modules/views/login.js';
import { ProfileHubView } from './modules/views/profile_hub.js';
import { CharacterCreateView } from './modules/views/create.js';
import { HubView } from './modules/views/hub.js';
import { TermsView, PrivacyView } from './modules/views/legal.js';
import { WheelView } from './modules/views/wheel.js';

// Merge into existing window.actions to avoid overwriting early definitions in modules
window.actions = Object.assign(window.actions || {}, {
    ...AuthActions, ...NavActions, ...CharacterActions, ...EconomyActions,
    ...IllicitActions, ...ServicesActions, ...StaffActions,
    ...EnterpriseActions, ...ProfileActions, ...WheelActions
});

window.router = router;

const appRenderer = () => {
    const app = document.getElementById('app');
    const loading = document.getElementById('loading-screen');
    if (!app) return;

    if (state.isInitializingAuth) {
        if (loading) {
            loading.classList.remove('opacity-0', 'pointer-events-none');
            loading.classList.add('opacity-100');
        }
        return;
    }

    let htmlContent = '';
    let effectiveView = state.currentView;

    if (!state.user && !['login', 'terms', 'privacy'].includes(effectiveView)) {
        effectiveView = 'login';
    }

    if (state.user?.deletion_requested_at && effectiveView !== 'login' && effectiveView !== 'terms' && effectiveView !== 'privacy') {
        effectiveView = 'deletion_pending';
    }

    switch (effectiveView) {
        case 'login': htmlContent = LoginView(); break;
        case 'profile_hub': htmlContent = ProfileHubView(); break;
        case 'create': htmlContent = CharacterCreateView(); break;
        case 'hub': htmlContent = HubView(); break;
        case 'terms': htmlContent = TermsView(); break;
        case 'privacy': htmlContent = PrivacyView(); break;
        case 'wheel': htmlContent = WheelView(); break;
        case 'deletion_pending': htmlContent = DeletionPendingView(); break;
        case 'access_denied': htmlContent = AccessDeniedView(); break;
        default: htmlContent = LoginView();
    }

    app.innerHTML = htmlContent;
    
    if (loading) {
        loading.classList.add('opacity-0', 'pointer-events-none');
        loading.classList.remove('opacity-100');
    }

    if (window.lucide) {
        setTimeout(() => lucide.createIcons(), 50);
    }
};

const initApp = async () => {
    initSecurity();
    state.isInitializingAuth = true;
    appRenderer(); 
    
    if (window.supabase) {
        state.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        await fetchSecureConfig();
        setupRealtimeListener();
    }
    
    await fetchPublicLandingData();
    
    const result = await state.supabase.auth.getSession();
    if (result.data.session) {
        await handleAuthenticatedSession(result.data.session);
    } else {
        state.isInitializingAuth = false;
        router('login');
    }
};

const handleAuthenticatedSession = async (session) => {
    try {
        const { data: { user: supabaseUser } } = await state.supabase.auth.getUser();
        const discordUser = supabaseUser.user_metadata;
        const discordId = discordUser.provider_id || discordUser.sub;
        
        const username = discordUser.full_name || discordUser.username || discordUser.custom_claims?.global_name;

        // Mise à jour de l'écran de chargement
        const userBox = document.getElementById('loading-user-box');
        const userLabel = document.getElementById('loading-username');
        if (userBox && userLabel) {
            userLabel.textContent = username;
            userBox.classList.remove('opacity-0');
            userBox.classList.add('opacity-100');
        }

        const { data: profile } = await state.supabase
            .from('profiles')
            .select('*')
            .eq('id', discordId)
            .maybeSingle();

        state.user = { 
            id: discordId, 
            username: username, 
            avatar: discordUser.avatar_url,
            banner: discordUser.banner_url || null,
            decoration: discordUser.avatar_decoration || null,
            guilds: discordUser.guilds || [],
            permissions: profile?.permissions || {}, 
            whell_turn: profile?.whell_turn || 0, // Correction de l'assignation des clés
            isnotified_wheel: profile?.isnotified_wheel || false,
            deletion_requested_at: profile?.deletion_requested_at || null, 
            isFounder: state.adminIds.includes(discordId)
        };
        
        await loadCharacters();
        
        const activeCharId = sessionStorage.getItem('tfrp_active_char');
        if (activeCharId) {
            state.activeCharacter = state.characters.find(c => c.id === activeCharId);
        }
        
        // Petit délai pour laisser l'utilisateur voir son nom
        setTimeout(() => {
            state.isInitializingAuth = false;
            router('profile_hub');
        }, 800);

    } catch (e) { 
        console.error("Session init error:", e);
        state.isInitializingAuth = false;
        router('login'); 
    }
};

document.addEventListener('render-view', appRenderer);
initApp();
