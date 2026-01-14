
import { state } from './state.js';

export const hasPermission = (perm) => {
    if (!state.user) return false;
    if (state.user.isFounder) return true;
    return state.user.permissions && state.user.permissions[perm] === true;
};

export const router = (viewName) => {
    state.currentView = viewName;
    // Persist current view
    sessionStorage.setItem('tfrp_current_view', viewName);
    
    // Reset scroll positions
    window.scrollTo(0, 0);
    const scrollContainers = document.querySelectorAll('.custom-scrollbar, .overflow-y-auto');
    scrollContainers.forEach(el => el.scrollTop = 0);

    // We dispatch a custom event to notify app.js to re-render
    document.dispatchEvent(new CustomEvent('render-view'));
};

export const render = () => {
    document.dispatchEvent(new CustomEvent('render-view'));
};
