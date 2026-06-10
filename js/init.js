import { state, addCoins, setProperty, setPassiveIncome, setClickPower, addBitcoins, spendCoins, spendBitcoins, incrementClicks, incrementAdsWatched, incrementGameTime } from './state.js';
import { dom } from './dom.js';
import { updateUI } from './ui.js';
import { initShop } from './shop.js';
import { initFarm, calculatePassiveIncome, startCableEvents } from './farm.js';
import { initQuests, checkQuestProgress, rebuildQuestUI } from './quests.js';
import { loadGame, saveGame } from './save.js';
import { initClicks } from './click.js';
import { initPrestige } from './prestige.js';

export function init() {
    const loaded = loadGame();
    if (!loaded) {
        addCoins(100000); // временно для тестов
        initQuests();
    } else {
        rebuildQuestUI();
    }

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

    function triggerOverheat() {
        if (state.bsodActive || state._finalBought) return;
        setProperty('bsodActive', true);
        dom.bsodOverlay.style.display = 'flex';
        dom.laptopScreen.style.background = '#0000aa';
        const duration = Math.max(1, 5 - state.skills.cooling) * 1000;
        setTimeout(() => {
            setProperty('bsodActive', false);
            dom.bsodOverlay.style.display = 'none';
            dom.laptopScreen.style.background = state.hasWallpaper ? 'radial-gradient(circle, #003300, #000)' : '';
        }, duration);
    }
    function scheduleOverheat() {
        if (state.overheatTimer) clearTimeout(state.overheatTimer);
        setProperty('overheatTimer', setTimeout(() => {
            triggerOverheat();
            scheduleOverheat();
        }, Math.random() * 120000 + 60000));
    }
    scheduleOverheat();

    if (state.hasMonitor) startCableEvents();

    let lastCoins = state.coins;
    setInterval(() => {
        if (state.bsodActive || state._finalBought) return;
        addCoins(state.passiveIncome);
        incrementGameTime();
        updateUI();
        checkQuestProgress();
        saveGame();

        const maxIncrease = state.passiveIncome + (state.clickPower * 10);
        if (state.coins - lastCoins > maxIncrease + 1000000) {
            console.warn('Подозрительный скачок баланса! Откат.');
            spendCoins(state.coins - lastCoins);
            updateUI();
        }
        lastCoins = state.coins;
    }, 1000);

    dom.donateBtn.addEventListener('click', () => {
        import('./ads.js').then(m => m.showAdForBTC());
    });

    const tabs = document.querySelectorAll('.tab');
    const screens = {
        workspace: document.getElementById('workspace'),
        shop: document.getElementById('shop'),
        farm: document.getElementById('farm'),
        quests: document.getElementById('quests'),
        prestige: document.getElementById('prestige'),
    };
    let tabSwitchCount = 0;
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.screen;
            Object.values(screens).forEach(s => s.classList.add('hidden-right'));
            if (screens[target]) screens[target].classList.remove('hidden-right');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabSwitchCount++;
            if (tabSwitchCount % 4 === 0) {
                if (typeof ysdk !== 'undefined' && ysdk.adv && ysdk.adv.showFullscreenAdv) {
                    ysdk.adv.showFullscreenAdv();
                }
            }
        });
    });
}