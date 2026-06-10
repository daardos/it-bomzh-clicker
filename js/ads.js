import { state } from './state.js';
import { updateUI } from './ui.js';
import { checkQuestProgress } from './quests.js';

// Реклама за Биткоин (3 просмотра = 1 BTC)
export function showAdForBTC() {
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
                onRewarded: adCallback,
                onError: (err) => {
                    console.error('Ошибка рекламы:', err);
                    // fallback для тестирования без SDK
                    adCallback();
                }
            }
        });
    } else {
        // Заглушка: мгновенное начисление
        setTimeout(adCallback, 500);
    }
}

// Реклама за серверную стойку
export function showAdForRack(callback) {
    if (typeof ysdk !== 'undefined' && ysdk.adv && ysdk.adv.showRewardedVideo) {
        ysdk.adv.showRewardedVideo({
            callbacks: {
                onRewarded: () => {
                    if (callback) callback();
                },
                onError: (err) => {
                    console.error('Ошибка рекламы:', err);
                    // fallback
                    if (callback) callback();
                }
            }
        });
    } else {
        // Заглушка
        setTimeout(() => {
            if (callback) callback();
        }, 500);
    }
}