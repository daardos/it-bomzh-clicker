import { state } from './state.js';
import { updateUI } from './ui.js';
import { checkQuestProgress } from './quests.js';

export function showAdForBTC() {
    // Проверяем наличие SDK
    const adCallback = () => {
        state.adsWatched++;
        state.adViewsForBTC++;
        if (state.adViewsForBTC >= 3) {
            state.bitcoins++;
            state.adViewsForBTC = 0;
        }
        updateUI();
        checkQuestProgress();
    };

    if (typeof ysdk !== 'undefined' && ysdk.adv && ysdk.adv.showRewardedVideo) {
        ysdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => console.log('Реклама открыта'),
                onRewarded: adCallback,
                onClose: () => console.log('Реклама закрыта'),
                onError: (err) => {
                    console.error('Ошибка рекламы:', err);
                    adCallback(); // fallback для теста
                }
            }
        });
    } else {
        // Заглушка: просто мгновенно начисляем
        setTimeout(adCallback, 1000);
    }
}