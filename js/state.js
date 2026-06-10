const _state = {
    coins: 0,
    bitcoins: 0,
    clickPower: 100,
    passiveIncome: 0,
    rank: 'Бомж-сисадмин',
    bsodActive: false,
    hasMouse: false,
    hasMonitor: false,
    hasLaptop: false,
    monitorCableBroken: false,
    hasWallpaper: false,
    gpus: {},
    serverRacks: [],
    totalClicks: 0,
    totalCoinsEarned: 0,
    gameTime: 0,
    adsWatched: 0,
    activeQuests: [],
    gameStartTime: Date.now(),
    _finalBought: false,
    pcComponents: {
        cpu: 0,
        mb: 0,
        gpu: 0,
        ram: 0,
        psu: 0,
        case: 0,
    },
    prestigeLevel: 0,
    skills: {
        fastFingers: 0,
        cooling: 0,
        networkChip: 0,
    },
    adViewsForBTC: 0,
    overheatTimer: null,
    cableEventTimer: null,
};

Object.defineProperty(_state, 'hasPC', {
    get() {
        return this.pcComponents.case > 0;
    }
});

// Прокси: запрещает прямую запись, разрешает чтение
export const state = new Proxy(_state, {
    set(target, prop, value) {
        console.warn('Прямое изменение state запрещено. Используйте addCoins, spendCoins и т.д.');
        return false;
    },
    get(target, prop) {
        return target[prop];
    }
});

// Разрешённые функции изменения состояния
export function addCoins(amount) {
    _state.coins += amount;
    _state.totalCoinsEarned += amount;
}
export function spendCoins(amount) {
    if (_state.coins >= amount) {
        _state.coins -= amount;
        return true;
    }
    return false;
}
export function addBitcoins(amount) {
    _state.bitcoins += amount;
}
export function spendBitcoins(amount) {
    if (_state.bitcoins >= amount) {
        _state.bitcoins -= amount;
        return true;
    }
    return false;
}
export function setPassiveIncome(value) {
    _state.passiveIncome = value;
}
export function setClickPower(value) {
    _state.clickPower = value;
}
export function setProperty(prop, value) {
    _state[prop] = value;
}
export function incrementClicks() {
    _state.totalClicks++;
}
export function incrementAdsWatched() {
    _state.adsWatched++;
}
export function incrementGameTime() {
    _state.gameTime++;
}
export function getStateForSave() {
    return JSON.parse(JSON.stringify(_state));
}

// Экспорт конфигураций (неизменяемые константы)
export const gpuModels = [
    { id: 'gtx1050', name: 'GTX 1050', price: 1000, income: 10, cssClass: '' },
    { id: 'gtx1060', name: 'GTX 1060', price: 2500, income: 25, cssClass: '' },
    { id: 'rtx2060', name: 'RTX 2060', price: 5000, income: 50, cssClass: 'rtx' },
    { id: 'rtx3060', name: 'RTX 3060', price: 10000, income: 100, cssClass: 'rtx' },
    { id: 'rtx4090', name: 'RTX 4090', price: 50000, income: 500, cssClass: 'rtx' },
    { id: 'rtx5090', name: 'RTX 5090', price: 200000, income: 2000, cssClass: 'rtx rtx5090' },
];

export const questTemplates = [
    { type: 'clicks', desc: 'Кликнуть {goal} раз', reward: 500, unit: 'кликов' },
    { type: 'coins', desc: 'Заработать {goal} монет', reward: 1000, unit: 'монет' },
    { type: 'time', desc: 'Провести в игре {goal} сек', reward: 300, unit: 'сек' },
    { type: 'ads', desc: 'Посмотреть рекламу {goal} раз', reward: 2, unit: 'раз', currency: 'btc' },
];

export const pcParts = {
    cpu: [
        { name: 'Intel Core i3', price: 5000, clickMul: 0.1, desc: '+10% к кликам' },
        { name: 'Intel Core i5', price: 15000, clickMul: 0.25, desc: '+25% к кликам' },
        { name: 'Intel Core i7', price: 50000, clickMul: 0.5, desc: '+50% к кликам' },
        { name: 'Intel Core i9', price: 150000, clickMul: 1.0, desc: '+100% к кликам' },
    ],
    mb: [
        { name: 'Бюджетная плата', price: 3000, passiveMul: 0.05, desc: '+5% пассивный доход' },
        { name: 'Игровая плата', price: 10000, passiveMul: 0.15, desc: '+15% пассивный доход' },
        { name: 'Серверная плата', price: 50000, passiveMul: 0.3, desc: '+30% пассивный доход' },
    ],
    gpu: [
        { name: 'GTX 1650', price: 8000, clickFlat: 200, desc: '+200 к клику' },
        { name: 'RTX 3060', price: 30000, clickFlat: 500, desc: '+500 к клику' },
        { name: 'RTX 4090', price: 120000, clickFlat: 1500, desc: '+1500 к клику' },
    ],
    ram: [
        { name: '8GB DDR4', price: 2000, passiveMul: 0.02, desc: '+2% пассивный доход' },
        { name: '16GB DDR4', price: 8000, passiveMul: 0.05, desc: '+5% пассивный доход' },
        { name: '32GB DDR5', price: 25000, passiveMul: 0.12, desc: '+12% пассивный доход' },
    ],
    psu: [
        { name: '500W', price: 1000, passiveMul: 0.01, desc: '+1% пассивный доход' },
        { name: '750W', price: 5000, passiveMul: 0.04, desc: '+4% пассивный доход' },
        { name: '1000W Platinum', price: 20000, passiveMul: 0.1, desc: '+10% пассивный доход' },
    ],
    case: [
        { name: 'Обычный корпус', price: 500, passiveMul: 0.01, desc: '+1% пассив, появится ПК' },
        { name: 'Геймерский корпус', price: 5000, passiveMul: 0.03, desc: '+3% пассив, неоновая подсветка' },
    ],
};