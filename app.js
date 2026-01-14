
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

window.actions = {
    ...AuthActions, ...NavActions, ...CharacterActions, ...EconomyActions,
    ...IllicitActions, ...ServicesActions, ...StaffActions,
    ...EnterpriseActions, ...ProfileActions, ...WheelActions
};

window.router = router;

const appRenderer = () => {
    const app = document.getElementById('app');
    const loading = document.getElementById('loading-screen');
    if (!app) return;

    // Si on est en train de charger l'auth, on ne rend rien et on garde le loading
    if (state.isInitializingAuth) {
        if (loading) {
            loading.classList.remove('opacity-0', 'pointer-events-none');
            loading.classList.add('opacity-100');
        }
        return;
    }

    let htmlContent = '';
    let effectiveView = state.currentView;

    // PROTECTION CRITIQUE : Si pas d'user et pas sur login/legal, on force login
    if (!state.user && !['login', 'terms', 'privacy'].includes(effectiveView)) {
        effectiveView = 'login';
    }

    // Redirections forcées basées sur l'état
    if (state.user?.deletion_requested_at && effectiveView !== 'login') {
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
    
    // Masquer le loading une fois le premier rendu effectué (si pas d'auth en cours)
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
    appRenderer(); // Force l'affichage du loading
    
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
        
        const { data: profile } = await state.supabase
            .from('profiles')
            .select('*')
            .eq('id', discordId)
            .maybeSingle();

        state.user = { 
            id: discordId, 
            username: discordUser.full_name || discordUser.username || discordUser.custom_claims?.global_name, 
            avatar: discordUser.avatar_url,
            banner: discordUser.banner_url || null,
            decoration: discordUser.avatar_decoration || null,
            guilds: discordUser.guilds || [],
            permissions: profile?.permissions || {}, 
            deletion_requested_at: profile?.deletion_requested_at || null, 
            isFounder: state.adminIds.includes(discordId)
        };
        
        await loadCharacters();
        
        const activeCharId = sessionStorage.getItem('tfrp_active_char');
        if (activeCharId) {
            state.activeCharacter = state.characters.find(c => c.id === activeCharId);
        }
        
        state.isInitializingAuth = false;
        router('profile_hub');

    } catch (e) { 
        console.error("Session init error:", e);
        state.isInitializingAuth = false;
        router('login'); 
    }
};

document.addEventListener('render-view', appRenderer);
initApp();
