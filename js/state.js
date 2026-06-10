export const state = {
    coins: 0,
    bitcoins: 0,
    clickPower: 100,
    passiveIncome: 0,
    rank: 'Бомж-сисадмин',
    bsodActive: false,
    hasMouse: false,
    hasMonitor: false,
    hasPCMonitor: false,
    hasLaptop: false,
    monitorCableBroken: false,
    hasWallpaper: false,
    gpus: {},                 // { modelId: count }
    serverRacks: [],          // массив объектов { slots: [] } где slots - массивы макс. длины 5
    totalClicks: 0,
    totalCoinsEarned: 0,
    gameTime: 0,
    adsWatched: 0,
    activeQuests: [],
    gameStartTime: Date.now(),
    _finalBought: false,
    // Сборка ПК
    pcComponents: {
        cpu: 0,    // уровень 0-3
        mb: 0,
        gpu: 0,
        ram: 0,
        psu: 0,
        case: 0,
    },
    overheatTimer: null,
    cableEventTimer: null,
        get hasPC() {
        return this.pcComponents.case > 0;
    },
};

// Конфигурации (могут быть здесь или отдельно)
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

// Компоненты ПК
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