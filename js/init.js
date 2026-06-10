import { state } from './state.js';
import { dom } from './dom.js';
import { updateUI } from './ui.js';
import { initShop } from './shop.js';
import { initFarm, calculatePassiveIncome, startCableEvents } from './farm.js';
import { initQuests, checkQuestProgress, rebuildQuestUI } from './quests.js';
import { loadGame, saveGame } from './save.js';
import { showAd } from './ads.js';
import './click.js';

export function init() {
    if (!loadGame()) {
        // Новая игра
        initQuests();
    } else {
        // Восстанавливаем интерфейс квестов из загруженных данных
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

    // Перегрев
    function triggerOverheat() {
        if (state.bsodActive || state._finalBought) return;
        state.bsodActive = true;
        dom.bsodOverlay.style.display = 'flex';
        dom.laptopScreen.style.background = '#0000aa';
        setTimeout(() => {
            state.bsodActive = false;
            dom.bsodOverlay.style.display = 'none';
            dom.laptopScreen.style.background = state.hasWallpaper ? 'radial-gradient(circle, #003300, #000)' : '';
        }, 5000);
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
        saveGame(); // автосохранение каждую секунду
    }, 1000);

    // Донат
    dom.donateBtn.addEventListener('click', () => {
        showAd(() => {
            state.bitcoins++;
            state.adsWatched++;
            updateUI();
            checkQuestProgress();
            saveGame(); // сохраняем после изменения
        });
    });

    // Навигация по вкладкам
    const tabs = document.querySelectorAll('.tab');
    const screens = {
        workspace: document.getElementById('workspace'),
        shop: document.getElementById('shop'),
        farm: document.getElementById('farm'),
        quests: document.getElementById('quests'),
    };
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.screen;
            Object.values(screens).forEach(s => s.classList.add('hidden-right'));
            screens[target].classList.remove('hidden-right');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}