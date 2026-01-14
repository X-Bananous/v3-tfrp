
import { state } from '../state.js';
import { fetchPlayerInvoices } from '../services.js';

const refreshBanner = `
    <div class="flex flex-col md:flex-row items-center justify-between px-6 py-3 bg-indigo-500/5 border-b border-indigo-500/10 gap-3 shrink-0 relative z-20">
        <div class="text-[10px] text-indigo-200 flex items-center gap-2 font-black uppercase tracking-[0.2em]">
             <div class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </div>
            <span>Registre de Propriété • Données Sécurisées</span>
        </div>
        <button onclick="actions.refreshCurrentView()" id="refresh-data-btn" class="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap">
            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Sync. Patrimoine
        </button>
    </div>
`;

const initAssetsChart = () => {
    const ctx = document.getElementById('patrimonyChart');
    if (!ctx || !window.Chart) return;
    if (window.myPatrimonyChart) window.myPatrimonyChart.destroy();
    const bankVal = state.bankAccount?.bank_balance || 0;
    const cashVal = state.bankAccount?.cash_balance || 0;
    let invVal = 0;
    state.inventory.forEach(i => { if (!i.is_virtual) invVal += (i.quantity * i.estimated_value); });
    let entVal = 0;
    if (state.myEnterprises) { state.myEnterprises.forEach(e => { if (e.myRank === 'leader') entVal += (e.balance || 0); }); }
    const data = {
        labels: ['Banque', 'Liquide', 'Inventaire', 'Entreprises'],
        datasets: [{
            data: [bankVal, cashVal, invVal, entVal],
            backgroundColor: ['#10b981', '#3b82f6', '#6366f1', '#a855f7'],
            borderColor: 'rgba(0,0,0,0.5)',
            borderWidth: 2,
            hoverOffset: 15,
            borderRadius: 5
        }]
    };
    window.myPatrimonyChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            animation: { animateScale: true, animateRotate: true }
        }
    });
};

export const generateInventoryRow = (item) => {
    let iconName = item.object_icon || 'package';
    let iconClass = 'bg-indigo-500/10 text-indigo-400';
    let borderClass = 'border-white/5';
    let action = `actions.openIdCard(null, 'id_card')`;
    const isGiftable = !item.is_cash && !item.is_virtual;

    if (item.is_cash) {
        iconName = 'banknote';
        iconClass = 'bg-emerald-500/10 text-emerald-400';
        borderClass = 'border-emerald-500/20';
    } else if (item.is_virtual) {
        iconName = item.icon || 'id-card';
        if(item.docType === 'credit_card') {
            iconClass = 'bg-yellow-500/10 text-yellow-400';
            action = `actions.openIdCard(null, 'credit_card')`;
        } else if(item.name === "Permis de conduire") {
            iconClass = 'bg-blue-500/10 text-blue-400';
            action = `actions.openIdCard(null, 'driver_license')`;
        } else if(item.docType?.includes('card') || item.docType?.includes('badge')) {
            iconClass = 'bg-indigo-600/20 text-indigo-400';
            action = `actions.openIdCard(null, '${item.docType}')`;
        }
    }

    return `
    <div class="flex items-center justify-between p-5 bg-white/[0.02] rounded-3xl border ${borderClass} hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all group">
        <div class="flex items-center gap-5">
            <div class="w-14 h-14 rounded-2xl ${iconClass} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                <i data-lucide="${iconName}" class="w-7 h-7"></i>
            </div>
            <div>
                <div class="font-black text-white text-lg uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors">${item.name}</div>
                <div class="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">
                    ${item.is_virtual ? 'Document Certifié' : `Unité(s) : <span class="text-white font-mono">${item.quantity}</span>`}
                </div>
            </div>
        </div>
        <div class="text-right flex items-center gap-6">
            ${!item.is_virtual ? `
                <div class="hidden md:block">
                    <div class="font-mono font-black text-white text-base tracking-tighter">$ ${(item.quantity * item.estimated_value).toLocaleString()}</div>
                    <div class="text-[8px] text-gray-700 font-black uppercase tracking-widest">Valeur Marchande</div>
                </div>
                <div class="flex gap-2">
                    ${isGiftable ? `
                        <button onclick="actions.openGiveItemModal('${item.id}', '${item.name.replace(/'/g, "\\'")}', ${item.quantity}, ${item.estimated_value})" class="p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg" title="Transférer">
                            <i data-lucide="gift" class="w-4 h-4"></i>
                        </button>
                    ` : ''}
                    ${!item.is_cash ? `
                        <button onclick="actions.deleteInventoryItem('${item.id}', '${item.name.replace(/'/g, "\\'")}', ${item.quantity})" class="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-lg" title="Jeter">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    ` : ''}
                </div>
            ` : `
                <button onclick="${action}" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/20 transition-all flex items-center gap-2">
                    <i data-lucide="eye" class="w-3.5 h-3.5"></i> Consulter
                </button>
            `}
        </div>
    </div>
    `;
};

export const AssetsView = () => {
    if (!state.bankAccount) return '<div class="p-8 text-center text-gray-500"><div class="loader-spinner mb-4 mx-auto"></div>Synchronisation du patrimoine...</div>';

    let content = '';

    if (state.activeAssetsTab === 'overview') {
        const bankVal = state.bankAccount.bank_balance || 0;
        const cashVal = state.bankAccount.cash_balance || 0;
        let inventoryValue = 0;
        state.inventory.forEach(item => { if(!item.is_virtual) inventoryValue += (item.quantity * item.estimated_value); });
        let enterpriseValue = 0;
        if (state.myEnterprises) { state.myEnterprises.forEach(e => { if (e.myRank === 'leader') enterpriseValue += (e.balance || 0); }); }
        const globalTotal = bankVal + cashVal + inventoryValue + enterpriseValue;

        setTimeout(initAssetsChart, 50);

        content = `
            <div class="space-y-8 animate-fade-in pb-20">
                <div class="glass-panel p-10 rounded-[48px] bg-gradient-to-br from-indigo-900/40 via-black to-black border border-indigo-500/20 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
                    <div class="relative z-10 text-center md:text-left">
                        <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20 mb-6 rounded-lg">
                            <i data-lucide="gem" class="w-3.5 h-3.5"></i> Valeur Nette Consolidée
                        </div>
                        <h1 class="text-6xl md:text-7xl font-black text-white tracking-tighter mb-4 italic uppercase drop-shadow-2xl">$ ${globalTotal.toLocaleString()}</h1>
                        <p class="text-indigo-400/60 text-sm font-bold uppercase tracking-widest">Patrimoine de ${state.activeCharacter.first_name} ${state.activeCharacter.last_name}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="glass-panel p-8 rounded-[40px] border border-white/5 bg-[#0a0a0a] relative overflow-hidden group">
                        <div class="flex justify-between items-center mb-8">
                            <h3 class="font-black text-white text-xl uppercase italic tracking-tighter">Répartition de Fortune</h3>
                        </div>
                        <div class="relative h-64 w-full flex items-center justify-center">
                            <canvas id="patrimonyChart" class="relative z-0"></canvas>
                        </div>
                    </div>

                    <div class="glass-panel p-8 rounded-[40px] border border-white/5 bg-[#0a0a0a] flex flex-col items-center text-center relative overflow-hidden group">
                        <div class="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform shadow-2xl border border-indigo-500/20">
                            <i data-lucide="fingerprint" class="w-12 h-12"></i>
                        </div>
                        <h3 class="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Coffre-fort Numérique</h3>
                        <p class="text-sm text-gray-500 mb-10 max-w-xs font-medium">Accès chiffré à vos documents d'identité officiels.</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <button onclick="actions.openIdCard(null, 'id_card')" class="glass-btn p-5 rounded-3xl font-black flex flex-col items-center gap-3 bg-indigo-600 hover:bg-indigo-500 uppercase tracking-widest italic group transition-all">
                                <i data-lucide="id-card" class="w-6 h-6"></i>
                                <span class="text-[10px]">Identité</span>
                            </button>
                            <button onclick="actions.openMyRecord()" class="glass-btn-secondary p-5 rounded-3xl font-black text-orange-400 border-orange-500/20 flex flex-col items-center gap-3 hover:bg-orange-600 hover:text-white transition-all uppercase tracking-widest italic group">
                                <i data-lucide="file-clock" class="w-6 h-6"></i>
                                <span class="text-[10px]">Casier</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    else if (state.activeAssetsTab === 'inventory') {
        let combinedInventory = [];
        if (state.bankAccount.cash_balance > 0) { combinedInventory.push({ id: 'cash', name: 'Espèces (Liquide)', quantity: state.bankAccount.cash_balance, estimated_value: 1, is_cash: true, object_icon: 'banknote' }); }
        combinedInventory = [...combinedInventory, ...state.inventory];
        if (state.inventoryFilter) { const lower = state.inventoryFilter.toLowerCase(); combinedInventory = combinedInventory.filter(i => i.name.toLowerCase().includes(lower)); }
        const inventoryHtml = combinedInventory.length > 0 ? combinedInventory.map(generateInventoryRow).join('') : `<div class="text-center text-gray-600 py-32 border-2 border-dashed border-white/5 rounded-[40px] opacity-30 flex flex-col items-center"><i data-lucide="package-open" class="w-20 h-20 mb-4"></i><span class="text-sm font-black uppercase tracking-[0.4em]">Sac Vide</span></div>`;
        content = `
            <div class="flex flex-col h-full animate-fade-in">
                <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 shrink-0 px-2">
                    <h3 class="text-xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter">
                        <i data-lucide="backpack" class="w-7 h-7 text-gray-500"></i> Contenu de votre sac
                    </h3>
                    <div class="relative w-full md:w-80">
                        <i data-lucide="search" class="w-4 h-4 absolute left-4 top-3.5 text-gray-500"></i>
                        <input type="text" oninput="actions.handleInventorySearch(this.value)" value="${state.inventoryFilter}" placeholder="Rechercher objet..." class="glass-input pl-10 pr-4 py-3 rounded-2xl w-full text-sm bg-black/40 border-white/10 focus:border-indigo-500/50">
                    </div>
                </div>
                <div class="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20" id="inventory-list-container">
                    ${inventoryHtml}
                </div>
            </div>
        `;
    }
    else if (state.activeAssetsTab === 'invoices') {
        if(state.invoices.length === 0 && !state.hasFetchedInvoices) { fetchPlayerInvoices(state.activeCharacter.id).then(() => { state.hasFetchedInvoices = true; render(); }); }
        const invoicesList = state.invoices.length > 0 ? state.invoices.map(inv => {
            const isFine = !inv.enterprise_id;
            return isFine ? `
                <div class="relative w-full max-w-sm bg-[#fafafa] text-black p-6 shadow-2xl border-t-8 border-red-800 rotate-1 transform hover:scale-105 transition-all mx-auto mb-6">
                    <div class="flex justify-between items-start border-b border-red-800/20 pb-3 mb-4"><div class="text-[10px] font-black text-red-900 tracking-widest uppercase">Citation Report</div><div class="bg-red-800 text-white px-2 py-0.5 text-[8px] font-black uppercase rounded">CAD-OS</div></div>
                    <div class="text-center mb-6"><div class="font-black text-2xl tracking-tighter uppercase text-red-900 mb-1">L.A. POLICE DEPT</div></div>
                    <div class="border-t-2 border-red-800 pt-4 flex justify-between items-center"><div class="text-[10px] font-black text-red-900 uppercase">Fine Amount</div><div class="font-mono font-black text-3xl text-red-600">-$${inv.total_price}</div></div>
                </div>` : `
                <div class="relative w-full max-w-xs bg-white text-gray-900 p-8 shadow-2xl mx-auto mb-6 font-mono text-xs transform -rotate-1 hover:scale-105 transition-all group">
                    <div class="text-center border-b border-dashed border-gray-400 pb-6 mb-6"><div class="font-black text-xl uppercase tracking-tighter mb-2 italic">${inv.enterprises?.name || 'STORE'}</div><div class="text-[9px] text-gray-400 mt-1">${new Date(inv.created_at).toLocaleString()}</div></div>
                    <div class="border-t-4 border-double border-gray-400 pt-5 flex justify-between items-center text-base font-black"><span>TOTAL DUE</span><span class="text-lg">$${inv.total_price.toLocaleString()}</span></div>
                </div>`;
        }).join('') : '<div class="text-center text-gray-600 py-32 italic uppercase font-black tracking-widest text-xs col-span-full opacity-30">Aucun registre de facturation</div>';
        content = `
            <div class="h-full flex flex-col animate-fade-in">
                <h3 class="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase italic tracking-tighter px-2"><i data-lucide="file-text" class="w-7 h-7 text-gray-500"></i> Historique des Factures</h3>
                <div class="flex-1 overflow-y-auto custom-scrollbar p-6 pb-20"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">${invoicesList}</div></div>
            </div>
        `;
    }

    return `
        <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in relative">
            ${refreshBanner}
            
            <div class="px-10 pb-6 pt-6 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[#050505] relative z-10 shrink-0">
                <div>
                    <h2 class="text-4xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter">
                        <i data-lucide="gem" class="w-12 h-12 text-indigo-500"></i>
                        Registre Patrimonial
                    </h2>
                    <div class="flex items-center gap-3 mt-4">
                         <span class="text-[10px] text-indigo-500/60 font-black uppercase tracking-widest bg-indigo-900/20 px-3 py-1 rounded-lg border border-indigo-500/30">Inventaire Civil Unifié</span>
                         <span class="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                         <span class="text-[10px] text-gray-600 font-black uppercase tracking-widest">Accès Certifié</span>
                    </div>
                </div>
            </div>

            <div class="flex-1 p-10 overflow-y-auto custom-scrollbar relative min-h-0">
                ${content}
            </div>
        </div>
    `;
};
