import { state } from './state.js';

// --- BUTTON LOADER HELPER ---
export const toggleBtnLoading = (btnElement, isLoading, loadingText = 'Chargement...') => {
    if (!btnElement) return;
    
    if (isLoading) {
        btnElement.dataset.originalText = btnElement.innerHTML;
        btnElement.disabled = true;
        btnElement.innerHTML = `
            <div class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            ${loadingText}
        `;
        btnElement.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
        btnElement.disabled = false;
        btnElement.innerHTML = btnElement.dataset.originalText || 'Action';
        btnElement.classList.remove('opacity-75', 'cursor-not-allowed');
    }
};

// --- TOAST NOTIFICATIONS ---
export const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container') || createToastContainer();
    const id = Date.now();
    
    const colors = {
        info: 'bg-gov-blue/20 border-gov-blue text-blue-100',
        success: 'bg-emerald-500/20 border-emerald-500 text-emerald-100',
        error: 'bg-gov-red/20 border-gov-red text-red-100',
        warning: 'bg-orange-500/20 border-orange-500 text-orange-100'
    };

    const icon = {
        info: 'info',
        success: 'check-circle',
        error: 'alert-triangle',
        warning: 'alert-circle'
    };

    const toastHtml = `
        <div id="toast-${id}" class="backdrop-blur-md p-4 rounded-2xl border ${colors[type]} flex items-center gap-3 animate-in shadow-2xl min-w-[320px] z-[9999]">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <i data-lucide="${icon[type]}" class="w-4 h-4"></i>
            </div>
            <span class="text-[11px] font-black uppercase tracking-wider">${message}</span>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);
    if(window.lucide) lucide.createIcons();

    setTimeout(() => {
        const el = document.getElementById(`toast-${id}`);
        if(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateX(20px)';
            el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => el.remove(), 400);
        }
    }, 4500);
};

const createToastContainer = () => {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.className = 'fixed bottom-8 right-8 flex flex-col gap-3 z-[9999]';
    document.body.appendChild(div);
    return div;
};

// --- GENERIC MODAL SYSTEM ---
export const closeModal = () => {
    const modal = document.getElementById('global-modal');
    if(modal) {
        if (modal.dataset.closable === 'false') return;
        modal.classList.add('opacity-0');
        const panel = modal.querySelector('.glass-panel');
        if(panel) {
            panel.style.transform = 'scale(0.95) translateY(10px)';
            panel.style.opacity = '0';
        }
        setTimeout(() => modal.remove(), 300);
    }
    state.ui.modal.isOpen = false;
};

export const forceCloseModal = () => {
    const modal = document.getElementById('global-modal');
    if(modal) {
        modal.dataset.closable = 'true';
        closeModal();
    }
};

export const showModal = ({ title, content, confirmText = 'Confirmer', cancelText = 'Annuler', onConfirm, onCancel, type = 'default', isClosable = true }) => {
    const existing = document.getElementById('global-modal');
    if(existing) existing.remove();

    const themes = {
        default: { icon: 'info', color: 'text-gov-blue', bg: 'bg-gov-blue/10', border: 'border-gov-blue/20', btn: 'bg-gov-blue hover:bg-black' },
        danger: { icon: 'shield-alert', color: 'text-gov-red', bg: 'bg-gov-red/10', border: 'border-gov-red/30', btn: 'bg-gov-red hover:bg-black' },
        success: { icon: 'check-circle', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', btn: 'bg-emerald-600 hover:bg-emerald-700' },
        warning: { icon: 'alert-triangle', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', btn: 'bg-orange-600 hover:bg-orange-700' }
    };

    const theme = themes[type] || themes.default;
    const isConfirmOnly = !onConfirm && !onCancel;

    const html = `
        <div id="global-modal" data-closable="${isClosable}" class="fixed inset-0 z-[2000] flex items-center justify-center p-4 transition-all duration-300 bg-black/80 backdrop-blur-sm">
            <div class="absolute inset-0" onclick="${isClosable ? 'ui.closeModal()' : ''}"></div>
            
            <div class="glass-panel w-full max-w-lg rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-300 relative z-10 flex flex-col border border-white/10 bg-[#121214]">
                
                <div class="h-1.5 w-full ${theme.btn} opacity-50"></div>

                <div class="p-10">
                    <div class="flex items-start gap-8 mb-8">
                        <div class="w-16 h-16 rounded-2xl ${theme.bg} flex items-center justify-center ${theme.color} shrink-0 border ${theme.border} shadow-2xl">
                            <i data-lucide="${theme.icon}" class="w-8 h-8"></i>
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic leading-none">${title}</h3>
                            <div class="text-[9px] font-black uppercase tracking-[0.3em] ${theme.color} opacity-80">Protocole Fondation v6.0</div>
                        </div>
                    </div>

                    <div class="text-gray-400 text-sm leading-relaxed max-h-[50vh] overflow-y-auto custom-scrollbar pr-4 mb-10 font-medium italic">
                        ${content}
                    </div>

                    <div class="flex flex-col sm:flex-row justify-end gap-4">
                        ${(onConfirm || cancelText) && !isConfirmOnly && isClosable ? `
                            <button id="modal-cancel" class="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/10">
                                ${cancelText}
                            </button>
                        ` : ''}
                        
                        ${confirmText ? `
                            <button id="modal-confirm" class="px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-2xl ${theme.btn} transform active:scale-95">
                                ${confirmText}
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="bg-white/5 py-3 px-10 flex justify-between items-center border-t border-white/5">
                    <span class="text-[8px] text-gray-600 font-mono uppercase tracking-[0.4em]">Team French Roleplay • Accès Sécurisé</span>
                    <div class="flex gap-2">
                        <span class="w-1 h-1 rounded-full bg-gray-700"></span>
                        <span class="w-1 h-1 rounded-full bg-gray-700"></span>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    if(window.lucide) lucide.createIcons();

    const confirmBtn = document.getElementById('modal-confirm');
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            if (onConfirm) onConfirm();
            const modal = document.getElementById('global-modal');
            if(modal) modal.dataset.closable = 'true';
            closeModal();
        };
    }

    const cancelBtn = document.getElementById('modal-cancel');
    if (cancelBtn && isClosable) {
        cancelBtn.onclick = () => {
            if (onCancel) onCancel();
            closeModal();
        };
    }
};

export const ui = {
    toggleBtnLoading,
    showToast,
    showModal,
    closeModal,
    forceCloseModal
};

window.ui = ui;