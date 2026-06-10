import { state } from './state.js';
import { dom } from './dom.js';
import { updateUI } from './ui.js';
import { initShop } from './shop.js';
import { initFarm, calculatePassiveIncome, startCableEvents } from './farm.js';
import { initQuests, checkQuestProgress, rebuildQuestUI } from './quests.js';
import { loadGame, saveGame } from './save.js';
import { initClicks } from './click.js';
import { initPrestige } from './prestige.js';

export function init() {
    if (!loadGame()) {
        state.coins = 100000; // временно для теста, потом удалить
        initQuests();
    } else {
        rebuildQuestUI();
    }

    // Клавиатура ноутбука
    const keyboard = document.getElementById('keyboard');
    if (keyboard) {
        keyboard.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            const key = document.createElement('div');
            key.className = 'key';
            keyboard.appendChild(key);
        }
    }

    initShop();
    initFarm();
    calculatePassiveIncome();
    updateUI();

    initClicks();
    initPrestige();

    // Перегрев
    function triggerOverheat() {
        if (state.bsodActive || state._finalBought) return;
        state.bsodActive = true;
        dom.bsodOverlay.style.display = 'flex';
        dom.laptopScreen.style.background = '#0000aa';
        const duration = Math.max(1, 5 - state.skills.cooling) * 1000;
        setTimeout(() => {
            state.bsodActive = false;
            dom.bsodOverlay.style.display = 'none';
            dom.laptopScreen.style.background = state.hasWallpaper ? 'radial-gradient(circle, #003300, #000)' : '';
        }, duration);
    }
    function scheduleOverheat() {
        if (state.overheatTimer) clearTimeout(state.overheatTimer);
        state.overheatTimer = setTimeout(() => {
            triggerOverheat();
            scheduleOverheat();
        }, Math.random() * 120000 + 60000);
    }
    scheduleOverheat();

    if (state.hasMonitor) startCableEvents();

    // Пассивный доход и автосохранение
    setInterval(() => {
        if (state.bsodActive || state._finalBought) return;
        state.coins += state.passiveIncome;
        state.totalCoinsEarned += state.passiveIncome;
        state.gameTime++;
        updateUI();
        checkQuestProgress();
        saveGame();
    }, 1000);

    // Донат (теперь через рекламу за BTC)
    dom.donateBtn.addEventListener('click', () => {
        import('./ads.js').then(m => m.showAdForBTC());
    });

    // Навигация по вкладкам
    const tabs = document.querySelectorAll('.tab');
    const screens = {
        workspace: document.getElementById('workspace'),
        shop: document.getElementById('shop'),
        farm: document.getElementById('farm'),
        quests: document.getElementById('quests'),
        prestige: document.getElementById('prestige'),
    };
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.screen;
            Object.values(screens).forEach(s => s.classList.add('hidden-right'));
            if (screens[target]) screens[target].classList.remove('hidden-right');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}