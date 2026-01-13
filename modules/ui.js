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
        info: 'bg-gov-blue text-white border-gray-900',
        success: 'bg-emerald-600 text-white border-gray-900',
        error: 'bg-gov-red text-white border-gray-900',
        warning: 'bg-orange-600 text-white border-gray-900'
    };

    const icon = {
        info: 'info',
        success: 'check-circle',
        error: 'alert-triangle',
        warning: 'alert-circle'
    };

    const toastHtml = `
        <div id="toast-${id}" class="p-5 border-2 ${colors[type]} flex items-center gap-4 animate-in shadow-[8px_8px_0px_#161616] min-w-[350px] z-[9999] rounded-none">
            <i data-lucide="${icon[type]}" class="w-5 h-5 shrink-0"></i>
            <span class="text-[11px] font-black uppercase tracking-wider italic">${message}</span>
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
    div.className = 'fixed bottom-8 right-8 flex flex-col gap-4 z-[9999]';
    document.body.appendChild(div);
    return div;
};

// --- GENERIC MODAL SYSTEM (RECTANGULAR CERFA) ---
export const closeModal = () => {
    const modal = document.getElementById('global-modal');
    if(modal) {
        if (modal.dataset.closable === 'false') return;
        modal.classList.add('opacity-0');
        const panel = modal.querySelector('.glass-panel');
        if(panel) {
            panel.style.transform = 'scale(0.98) translateY(10px)';
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

export const showModal = ({ title, content, confirmText = 'Valider', cancelText = 'Annuler', onConfirm, onCancel, type = 'default', isClosable = true }) => {
    const existing = document.getElementById('global-modal');
    if(existing) existing.remove();

    const themes = {
        default: { icon: 'info', color: 'text-gov-blue', btn: 'bg-gov-blue hover:bg-black', borderTop: 'border-gov-blue' },
        danger: { icon: 'shield-alert', color: 'text-gov-red', btn: 'bg-gov-red hover:bg-black', borderTop: 'border-gov-red' },
        success: { icon: 'check-circle', color: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-black', borderTop: 'border-emerald-600' },
        warning: { icon: 'alert-triangle', color: 'text-orange-600', btn: 'bg-orange-600 hover:bg-black', borderTop: 'border-orange-600' }
    };

    const theme = themes[type] || themes.default;
    const isConfirmOnly = !onConfirm && !onCancel;

    const html = `
        <div id="global-modal" data-closable="${isClosable}" class="fixed inset-0 z-[2000] flex items-center justify-center p-4 transition-all duration-300 bg-black/80 backdrop-blur-sm">
            <div class="absolute inset-0" onclick="${isClosable ? 'ui.closeModal()' : ''}"></div>
            
            <div class="glass-panel w-full max-w-lg overflow-hidden shadow-[16px_16px_0px_rgba(0,0,0,0.5)] transition-all duration-300 relative z-10 flex flex-col border-2 border-gray-900 bg-white border-t-8 ${theme.borderTop} rounded-none">
                
                <div class="p-10 pt-12">
                    <div class="flex flex-col items-center text-center mb-10">
                        <div class="w-20 h-20 bg-gov-light flex items-center justify-center ${theme.color} mb-8 border-2 border-gray-900 shadow-[4px_4px_0px_#161616]">
                            <i data-lucide="${theme.icon}" class="w-10 h-10"></i>
                        </div>
                        <h3 class="text-3xl font-black text-gov-text mb-2 tracking-tighter uppercase italic leading-none">${title}</h3>
                        <div class="text-[10px] font-black uppercase tracking-[0.4em] ${theme.color} opacity-60 flex items-center gap-2">
                             PROTOCOLE OFFICIEL
                        </div>
                    </div>

                    <div class="text-gray-600 text-sm leading-relaxed max-h-[40vh] overflow-y-auto custom-scrollbar px-4 mb-12 font-medium text-center italic border-l-4 border-gray-100">
                        ${content}
                    </div>

                    <div class="flex flex-col gap-4">
                        ${confirmText ? `
                            <button id="modal-confirm" class="w-full py-5 font-black text-[11px] uppercase tracking-[0.3em] text-white transition-all shadow-[6px_6px_0px_rgba(0,0,0,0.2)] ${theme.btn} border border-gray-900 rounded-none active:translate-x-1 active:translate-y-1 active:shadow-none">
                                ${confirmText}
                            </button>
                        ` : ''}
                        
                        ${(onConfirm || cancelText) && !isConfirmOnly && isClosable ? `
                            <button id="modal-cancel" class="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gov-text transition-all border border-transparent">
                                ${cancelText}
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="bg-gov-light py-6 px-10 flex justify-center items-center border-t border-gray-900">
                    <div class="marianne-block uppercase font-black text-gov-text scale-[0.6] opacity-60">
                        <div class="text-[10px] tracking-widest border-b border-gray-900 pb-0.5 mb-1 text-gray-900 font-black italic">Liberté • Égalité • Justice</div>
                        <div class="text-md italic">L.A. ADMINISTRATION</div>
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
