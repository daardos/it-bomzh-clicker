import { state, gpuModels } from './state.js';
import { dom } from './dom.js';
import { updateUI } from './ui.js';

let cableTimer = null;

export function calculatePassiveIncome() {
    let income = 0;
    if (state.hasMonitor) income += 50;
    gpuModels.forEach(m => {
        const count = state.gpus[m.id] || 0;
        income += m.income * count;
    });
    // Бонусы от ПК
    const mbLevel = state.pcComponents.mb || 0;
    const ramLevel = state.pcComponents.ram || 0;
    const psuLevel = state.pcComponents.psu || 0;
    const caseLevel = state.pcComponents.case || 0;
    const mbMul = [0, 0.05, 0.15, 0.3][mbLevel] || 0;
    const ramMul = [0, 0.02, 0.05, 0.12][ramLevel] || 0;
    const psuMul = [0, 0.01, 0.04, 0.1][psuLevel] || 0;
    const caseMul = [0, 0.01, 0.03][caseLevel] || 0;
    // Престиж и навык "Сетевой чип"
    const prestigePassiveMult = state.prestigeLevel * 0.1;
    const networkSkillMult = state.skills.networkChip * 0.05;
    const totalPassiveMult = 1 + mbMul + ramMul + psuMul + caseMul + prestigePassiveMult + networkSkillMult;
    state.passiveIncome = Math.floor(income * totalPassiveMult);
    if (dom.passiveDisplay) dom.passiveDisplay.textContent = state.passiveIncome;
}

export function initFarm() {
    if (state.serverRacks.length === 0) {
        state.serverRacks.push({ slots: [ [], [], [] ] });
    }
    renderRacks();
    renderFarmButtons();
    dom.buyRackBtn.addEventListener('click', () => {
        if (state.coins >= 100000) {
            state.coins -= 100000;
            addServerRack();
        } else {
            // Предложить рекламу за стойку
            import('./ads.js').then(m => m.showAdForRack(() => {
                addServerRack();
                updateUI();
            }));
        }
    });
}

function addServerRack() {
    state.serverRacks.push({ slots: [ [], [], [] ] });
    renderRacks();
    updateUI();
}

function renderRacks() {
    if (!dom.racksContainer) return;
    dom.racksContainer.innerHTML = '';
    state.serverRacks.forEach((rack, rackIdx) => {
        const rackDiv = document.createElement('div');
        rackDiv.className = 'rack';
        rack.slots.forEach((slot, slotIdx) => {
            const shelf = document.createElement('div');
            shelf.className = 'shelf';
            shelf.dataset.rack = rackIdx;
            shelf.dataset.slot = slotIdx;
            slot.forEach(gpuId => {
                const gpu = gpuModels.find(m => m.id === gpuId);
                if (gpu) {
                    const el = document.createElement('span');
                    el.className = 'gpu ' + (gpu.cssClass || '');
                    el.textContent = gpu.name;
                    shelf.appendChild(el);
                }
            });
            rackDiv.appendChild(shelf);
        });
        dom.racksContainer.appendChild(rackDiv);
    });
}

function renderFarmButtons() {
    if (!dom.farmButtonsDiv) return;
    dom.farmButtonsDiv.innerHTML = gpuModels.map(g =>
        `<button id="buy-${g.id}">${g.name}<span>${g.price} 🪙 | +${g.income}/сек</span></button>`
    ).join('');
    gpuModels.forEach(g => {
        document.getElementById(`buy-${g.id}`).addEventListener('click', () => buyGPU(g));
    });
}

function buyGPU(model) {
    for (let rack of state.serverRacks) {
        for (let slot of rack.slots) {
            if (slot.length < 5) {
                if (state.coins >= model.price) {
                    state.coins -= model.price;
                    if (!state.gpus[model.id]) state.gpus[model.id] = 0;
                    state.gpus[model.id]++;
                    slot.push(model.id);
                    calculatePassiveIncome();
                    renderRacks();
                    updateUI();
                    return;
                } else {
                    import('./modal.js').then(m => m.showModal('Недостаточно монет!'));
                    return;
                }
            }
        }
    }
    import('./modal.js').then(m => m.showModal('Нет свободных слотов! Купите дополнительную серверную стойку.'));
}

export function startCableEvents() {
    if (cableTimer) return;
    cableTimer = setInterval(() => {
        if (!state.hasMonitor || state.monitorCableBroken || state.bsodActive || state._finalBought) return;
        if (Math.random() < 0.3) {
            state.monitorCableBroken = true;
            dom.cablePopup.style.display = 'block';
        }
    }, 60000);
}

// Обработчики кабеля
dom.fixCableCoins.addEventListener('click', () => {
    if (state.coins >= 1000) {
        state.coins -= 1000;
        state.monitorCableBroken = false;
        dom.cablePopup.style.display = 'none';
        updateUI();
    } else {
        import('./modal.js').then(m => m.showModal('Недостаточно монет!'));
    }
});