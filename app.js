
/**
 * TFRP Core Application v5.2
 * Design Gouvernemental - Espace Citoyen Fusionné
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

import { setupRealtimeListener, fetchERLCData, fetchGlobalHeists, fetchOnDutyStaff, loadCharacters, fetchPublicLandingData, fetchActiveSession, fetchSecureConfig } from './modules/services.js';

// Views
import { LoginView, AccessDeniedView, DeletionPendingView } from './modules/views/login.js';
import { ProfileHubView } from './modules/views/profile_hub.js'; // Nouveau Hub fusionné
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
    if (!app) return;

    let htmlContent = '';
    let effectiveView = state.currentView;

    if (state.user?.deletion_requested_at && effectiveView !== 'login') effectiveView = 'deletion_pending';
    if (state.user?.isBanned && effectiveView !== 'login') effectiveView = 'banned';

    switch (effectiveView) {
        case 'login': htmlContent = LoginView(); break;
        case 'profile_hub': htmlContent = ProfileHubView(); break; // Point d'entrée après login
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
    if (window.lucide) setTimeout(() => lucide.createIcons(), 50);
};

const initApp = async () => {
    initSecurity();
    if (window.supabase) {
        state.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        await fetchSecureConfig();
        setupRealtimeListener();
    }
    await fetchPublicLandingData();
    
    const result = await state.supabase.auth.getSession();
    if (result.data.session) await handleAuthenticatedSession(result.data.session);
    else router('login');
};

const handleAuthenticatedSession = async (session) => {
    try {
        const { data: { user: supabaseUser } } = await state.supabase.auth.getUser();
        const discordUser = supabaseUser.user_metadata;
        const discordId = discordUser.provider_id || discordUser.sub;

        const { data: profile } = await state.supabase.from('profiles').select('*').eq('id', discordId).maybeSingle();
        state.user = { 
            id: discordId, username: discordUser.full_name || discordUser.username, 
            avatar: discordUser.avatar_url, permissions: profile?.permissions || {}, 
            deletion_requested_at: profile?.deletion_requested_at || null, 
            isFounder: state.adminIds.includes(discordId)
        };
        
        await loadCharacters();
        if (state.currentView === 'login') router('profile_hub');
    } catch (e) { router('login'); }
};

document.addEventListener('render-view', appRenderer);
initApp();
