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
        // Безопасное слияние: задаём значения по умолчанию для новых полей
        state.coins = data.coins ?? 0;
        state.bitcoins = data.bitcoins ?? 0;
        state.hasMouse = data.hasMouse ?? false;
        state.hasMonitor = data.hasMonitor ?? false;
        state.hasLaptop = data.hasLaptop ?? false;
        state.monitorCableBroken = data.monitorCableBroken ?? false;
        state.hasWallpaper = data.hasWallpaper ?? false;
        state.gpus = data.gpus ?? {};
        state.serverRacks = data.serverRacks ?? [{ slots: [ [], [], [] ] }];
        state.totalClicks = data.totalClicks ?? 0;
        state.totalCoinsEarned = data.totalCoinsEarned ?? 0;
        state.gameTime = data.gameTime ?? 0;
        state.adsWatched = data.adsWatched ?? 0;
        state.activeQuests = data.activeQuests ?? [];
        state.gameStartTime = data.gameStartTime ?? Date.now();
        state._finalBought = data._finalBought ?? false;
        state.pcComponents = data.pcComponents ?? { cpu:0, mb:0, gpu:0, ram:0, psu:0, case:0 };
        state.prestigeLevel = data.prestigeLevel ?? 0;
        state.skills = data.skills ?? { fastFingers: 0, cooling: 0, networkChip: 0 };
        state.adViewsForBTC = data.adViewsForBTC ?? 0;
        return true;
    } catch (e) {
        return false;
    }
}