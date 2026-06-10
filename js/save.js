import { state, getStateForSave, addCoins, addBitcoins, spendCoins, spendBitcoins, setProperty, setPassiveIncome, setClickPower } from './state.js';

function calculateChecksum() {
    const data = {
        coins: state.coins,
        bitcoins: state.bitcoins,
        totalClicks: state.totalClicks,
        totalCoinsEarned: state.totalCoinsEarned,
        prestigeLevel: state.prestigeLevel,
        skills: state.skills,
    };
    return btoa(JSON.stringify(data)).slice(0, 32);
}

export function saveGame() {
    const saveData = getStateForSave();
    saveData._checksum = calculateChecksum();
    localStorage.setItem('hackerClickerSave', JSON.stringify(saveData));
}

export function loadGame() {
    const raw = localStorage.getItem('hackerClickerSave');
    if (!raw) return false;
    try {
        const data = JSON.parse(raw);
        const savedChecksum = data._checksum;
        delete data._checksum;

        // Восстанавливаем только через безопасные функции
        if (data.coins !== undefined) addCoins(data.coins);
        if (data.bitcoins !== undefined) addBitcoins(data.bitcoins);
        setClickPower(data.clickPower ?? 100);
        setPassiveIncome(data.passiveIncome ?? 0);
        setProperty('hasMouse', data.hasMouse ?? false);
        setProperty('hasMonitor', data.hasMonitor ?? false);
        setProperty('hasLaptop', data.hasLaptop ?? false);
        setProperty('monitorCableBroken', data.monitorCableBroken ?? false);
        setProperty('hasWallpaper', data.hasWallpaper ?? false);
        setProperty('gpus', data.gpus ?? {});
        setProperty('serverRacks', data.serverRacks ?? [{ slots: [ [], [], [] ] }]);
        setProperty('totalClicks', data.totalClicks ?? 0);
        setProperty('totalCoinsEarned', data.totalCoinsEarned ?? 0);
        setProperty('gameTime', data.gameTime ?? 0);
        setProperty('adsWatched', data.adsWatched ?? 0);
        setProperty('activeQuests', data.activeQuests ?? []);
        setProperty('gameStartTime', data.gameStartTime ?? Date.now());
        setProperty('_finalBought', data._finalBought ?? false);
        setProperty('pcComponents', data.pcComponents ?? { cpu:0, mb:0, gpu:0, ram:0, psu:0, case:0 });
        setProperty('prestigeLevel', data.prestigeLevel ?? 0);
        setProperty('skills', data.skills ?? { fastFingers: 0, cooling: 0, networkChip: 0 });
        setProperty('adViewsForBTC', data.adViewsForBTC ?? 0);

        if (savedChecksum && calculateChecksum() !== savedChecksum) {
            console.warn('Сохранение повреждено! Полный сброс.');
            resetState();
            return false;
        }
        return true;
    } catch (e) {
        console.error('Ошибка загрузки:', e);
        resetState();
        return false;
    }
}

function resetState() {
    spendCoins(state.coins);
    spendBitcoins(state.bitcoins);
    setClickPower(100);
    setPassiveIncome(0);
    setProperty('hasMouse', false);
    setProperty('hasMonitor', false);
    setProperty('hasLaptop', false);
    setProperty('monitorCableBroken', false);
    setProperty('hasWallpaper', false);
    setProperty('gpus', {});
    setProperty('serverRacks', [{ slots: [ [], [], [] ] }]);
    setProperty('totalClicks', 0);
    setProperty('totalCoinsEarned', 0);
    setProperty('gameTime', 0);
    setProperty('adsWatched', 0);
    setProperty('activeQuests', []);
    setProperty('gameStartTime', Date.now());
    setProperty('_finalBought', false);
    setProperty('pcComponents', { cpu:0, mb:0, gpu:0, ram:0, psu:0, case:0 });
    setProperty('prestigeLevel', 0);
    setProperty('skills', { fastFingers: 0, cooling: 0, networkChip: 0 });
    setProperty('adViewsForBTC', 0);
}