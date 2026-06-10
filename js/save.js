import { state } from './state.js';

export function saveGame() {
    const data = {
        coins: state.coins,
        bitcoins: state.bitcoins,
        hasMouse: state.hasMouse,
        hasMonitor: state.hasMonitor,
        hasLaptop: state.hasLaptop,
        monitorCableBroken: state.monitorCableBroken,
        hasWallpaper: state.hasWallpaper,
        gpus: state.gpus,
        serverRacks: state.serverRacks,
        totalClicks: state.totalClicks,
        totalCoinsEarned: state.totalCoinsEarned,
        gameTime: state.gameTime,
        adsWatched: state.adsWatched,
        activeQuests: state.activeQuests,
        gameStartTime: state.gameStartTime,
        _finalBought: state._finalBought,
        pcComponents: state.pcComponents,
        prestigeLevel: state.prestigeLevel,
        skills: state.skills,
        adViewsForBTC: state.adViewsForBTC,
    };
    localStorage.setItem('hackerClickerSave', JSON.stringify(data));
}

export function loadGame() {
    const raw = localStorage.getItem('hackerClickerSave');
    if (!raw) return false;
    try {
        const data = JSON.parse(raw);
        Object.assign(state, data);
        // Пересчитываем пассивный доход (импорт функции будет в init.js)
        return true;
    } catch (e) {
        return false;
    }
}