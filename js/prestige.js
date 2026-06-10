import { state } from './state.js';
import { updateUI } from './ui.js';
import { calculatePassiveIncome } from './farm.js';

const PRESTIGE_COST = 100_000_000;   // 100 млн
const BTC_PRICE_BUY = 2_500_000;     // 2.5M монет за 1 BTC
const BTC_PRICE_SELL = 200_000;      // 200K монет за 1 BTC
const SKILL_BASE_COST = 1;           // BTC за первый уровень (пока фикс 1 BTC за каждый уровень)

function canPrestige() {
    return state.coins >= PRESTIGE_COST;
}

function performPrestige() {
    if (!canPrestige()) return;
    state.prestigeLevel++;
    // Сброс всего, кроме биткоинов, навыков, престижа и рекламного счётчика
    state.coins = 0;
    state.clickPower = 100;
    state.passiveIncome = 0;
    state.hasMouse = false;
    state.hasMonitor = false;
    state.hasLaptop = false;
    state.monitorCableBroken = false;
    state.hasWallpaper = false;
    state.gpus = {};
    state.serverRacks = [{ slots: [ [], [], [] ] }]; // начальная стойка
    state.totalClicks = 0;
    state.totalCoinsEarned = 0;
    state.gameTime = 0;
    state.activeQuests = [];
    state.pcComponents = { cpu:0, mb:0, gpu:0, ram:0, psu:0, case:0 };
    state._finalBought = false;
    // Заново инициализируем квесты и ферму (вызов из init.js)
    import('./quests.js').then(m => m.initQuests());
    import('./farm.js').then(m => m.initFarm());
    calculatePassiveIncome();
    updateUI();
}

function buySkill(skillName) {
    const cost = SKILL_BASE_COST; // фиксированная цена 1 BTC за уровень
    if (state.bitcoins < cost) return;
    state.bitcoins -= cost;
    state.skills[skillName]++;
    updateUI();
}

// Обмен валют
function buyBTC() {
    if (state.coins >= BTC_PRICE_BUY) {
        state.coins -= BTC_PRICE_BUY;
        state.bitcoins++;
        updateUI();
    }
}
function sellBTC() {
    if (state.bitcoins >= 1) {
        state.bitcoins--;
        state.coins += BTC_PRICE_SELL;
        updateUI();
    }
}

export function initPrestige() {
    document.getElementById('prestige-btn').addEventListener('click', performPrestige);
    document.getElementById('buy-fast').addEventListener('click', () => buySkill('fastFingers'));
    document.getElementById('buy-cool').addEventListener('click', () => buySkill('cooling'));
    document.getElementById('buy-net').addEventListener('click', () => buySkill('networkChip'));
    document.getElementById('buy-btc-coins').addEventListener('click', buyBTC);
    document.getElementById('sell-btc').addEventListener('click', sellBTC);
}

export { canPrestige };