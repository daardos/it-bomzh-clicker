import { state, pcParts } from './state.js';
import { dom } from './dom.js';
import { calculatePassiveIncome } from './farm.js';
import { saveGame } from './save.js';

export function updateUI() {
    // Счетчики
    dom.coinsSpan.textContent = Math.floor(state.coins).toLocaleString();
    dom.bitcoinsSpan.textContent = state.bitcoins;
    dom.passiveDisplay.textContent = state.passiveIncome;

    // Новые индикаторы в верхней панели
    if (dom.clickPowerDisplay) dom.clickPowerDisplay.textContent = state.clickPower;
    if (dom.passiveDisplaySmall) dom.passiveDisplaySmall.textContent = state.passiveIncome;

    // Ранг
    if (state.passiveIncome >= 1e9) dom.rankSpan.textContent = 'Крипто-бог';
    else if (state.passiveIncome >= 1e6) dom.rankSpan.textContent = 'Магнат майнинга';
    else if (state.passiveIncome >= 10000) dom.rankSpan.textContent = 'Опытный майнер';
    else if (state.hasMouse || state.hasLaptop) dom.rankSpan.textContent = 'Юный хакер';
    else dom.rankSpan.textContent = 'Бомж-сисадмин';

    // Базовые покупки
    dom.buyMouse.disabled = (state.coins < 12000 || state.hasMouse);
    dom.buyMouse.textContent = state.hasMouse ? 'Куплено' : 'Купить';
    dom.buyMonitor.disabled = (state.coins < 67000 || state.hasMonitor);
    dom.buyMonitor.textContent = state.hasMonitor ? 'Куплено' : 'Купить';
    dom.buyLaptop.disabled = (state.coins < 200000 || state.hasLaptop);
    dom.buyLaptop.textContent = state.hasLaptop ? 'Куплено' : 'Купить';
    dom.buyWallpaper.disabled = (state.bitcoins < 5 || state.hasWallpaper);
    dom.buyWallpaper.textContent = state.hasWallpaper ? 'Установлено' : 'Купить';

    // ПК-части доступны после покупки игрового ноутбука
    dom.pcPartsDiv.style.display = state.hasLaptop ? 'block' : 'none';
    if (state.hasLaptop) updatePCShopButtons();

    // Финальный предмет
    const finalItem = document.getElementById('final-item');
    if (finalItem) {
        finalItem.style.display = (state.passiveIncome >= 1e9 && !state._finalBought) ? 'flex' : 'none';
    }
    dom.buyFinal.disabled = (state.coins < 100000000000 || state._finalBought);

    // Визуальные обновления мыши
    dom.mouseDevice.classList.toggle('rgb', state.hasMouse);

    // Монитор на стене (старый / ультраширокий)
    dom.monitorArea.classList.toggle('ultrawide', state.hasMonitor);
    if (state.hasMonitor) {
        dom.monitorBody.querySelector('.monitor-label').textContent = 'ULTRAWIDE';
    } else {
        dom.monitorBody.querySelector('.monitor-label').textContent = 'OLD CRT';
    }

    // Обои на ноутбуке
    if (state.hasWallpaper) {
        dom.laptopScreen.style.background = 'radial-gradient(circle, #003300, #000)';
        dom.laptopScreen.style.color = '#0f0';
    } else {
        dom.laptopScreen.style.background = '';
        dom.laptopScreen.style.color = '';
    }

    // Игровой ноутбук (неон)
    dom.laptopContainer.classList.toggle('gaming', state.hasLaptop);

    // Обрыв кабеля монитора
    dom.monitorBody.style.opacity = state.monitorCableBroken ? '0.3' : '1';

    // === ПК, монитор ПК, полка для ноутбука ===
    const hasPC = state.pcComponents.case > 0;

    dom.pcCase.style.display = hasPC ? 'block' : 'none';
    if (dom.pcMonitorArea) dom.pcMonitorArea.style.display = hasPC ? 'flex' : 'none';
    const shelf = document.getElementById('shelf-laptop');
    if (shelf) shelf.style.display = hasPC ? 'block' : 'none';
    dom.laptopContainer.classList.toggle('shifted', hasPC);
    dom.pcCase.classList.toggle('level2', state.pcComponents.case === 2);

    // Сохранение
    saveGame();
}

function updatePCShopButtons() {
    const comp = state.pcComponents;
    const update = (id, btnId, descId, parts) => {
        const level = comp[id] || 0;
        const btn = document.getElementById(btnId);
        const desc = document.getElementById(descId);
        if (!btn || !desc) return;
        if (level >= parts.length) {
            btn.textContent = 'Макс. уровень';
            btn.disabled = true;
            desc.textContent = parts[parts.length - 1].desc;
        } else {
            const next = parts[level];
            btn.textContent = `${next.name} — ${next.price} 🪙`;
            btn.disabled = state.coins < next.price;
            desc.textContent = next.desc;
        }
    };
    update('cpu', 'buy-cpu', 'cpu-desc', pcParts.cpu);
    update('mb', 'buy-mb', 'mb-desc', pcParts.mb);
    update('gpu', 'buy-gpu-pc', 'gpu-pc-desc', pcParts.gpu);
    update('ram', 'buy-ram', 'ram-desc', pcParts.ram);
    update('psu', 'buy-psu', 'psu-desc', pcParts.psu);
    update('case', 'buy-case', 'case-desc', pcParts.case);
}

export { updatePCShopButtons };