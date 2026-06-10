import { state, pcParts } from './state.js';
import { dom } from './dom.js';
import { updateUI, updatePCShopButtons } from './ui.js';
import { startCableEvents } from './farm.js'; // кабель тоже в ферме? вынесем в отдельный модуль, но пока так
import { calculatePassiveIncome } from './farm.js';

export function initShop() {
    dom.buyMouse.addEventListener('click', () => {
        if (state.coins >= 12000 && !state.hasMouse) {
            state.coins -= 12000;
            state.hasMouse = true;
            updateUI();
        }
    });
    dom.buyMonitor.addEventListener('click', () => {
        if (state.coins >= 67000 && !state.hasMonitor) {
            state.coins -= 67000;
            state.hasMonitor = true;
            startCableEvents();
            calculatePassiveIncome();
            updateUI();
        }
    });
    dom.buyLaptop.addEventListener('click', () => {
        if (state.coins >= 200000 && !state.hasLaptop) {
            state.coins -= 200000;
            state.hasLaptop = true;
            updateUI();
        }
    });
    dom.buyWallpaper.addEventListener('click', () => {
        if (state.bitcoins >= 5 && !state.hasWallpaper) {
            state.bitcoins -= 5;
            state.hasWallpaper = true;
            updateUI();
        }
    });
    dom.buyFinal.addEventListener('click', () => {
        if (state.coins >= 100000000000 && !state._finalBought) {
            state._finalBought = true;
            state.coins -= 100000000000;
            updateUI();
            document.getElementById('final-screen').style.display = 'flex';
            // импорт финала
            import('./final.js').then(m => m.showFinalScreen());
        }
    });

    // ПК компоненты
    document.getElementById('buy-cpu').addEventListener('click', () => buyPC('cpu', pcParts.cpu));
    document.getElementById('buy-mb').addEventListener('click', () => buyPC('mb', pcParts.mb));
    document.getElementById('buy-gpu-pc').addEventListener('click', () => buyPC('gpu', pcParts.gpu));
    document.getElementById('buy-ram').addEventListener('click', () => buyPC('ram', pcParts.ram));
    document.getElementById('buy-psu').addEventListener('click', () => buyPC('psu', pcParts.psu));
    document.getElementById('buy-case').addEventListener('click', () => buyPC('case', pcParts.case));
}

function buyPC(component, parts) {
    const level = state.pcComponents[component] || 0;
    if (level >= parts.length) return;
    const price = parts[level].price;
    if (state.coins >= price) {
        state.coins -= price;
        state.pcComponents[component] = level + 1;
        calculatePassiveIncome();
        updateUI();
    }
}