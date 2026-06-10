export function showAd(callback) {
    // Проверяем наличие Яндекс SDK
    if (typeof ysdk !== 'undefined' && ysdk.adv && ysdk.adv.showRewardedVideo) {
        ysdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => console.log('Реклама открыта'),
                onRewarded: () => {
                    console.log('Награда получена');
                    if (callback) callback();
                },
                onClose: () => console.log('Реклама закрыта'),
                onError: (err) => {
                    console.error('Ошибка рекламы:', err);
                    // fallback - всё равно даём награду для теста
                    if (callback) callback();
                }
            }
        });
    } else {
        // Заглушка для локального запуска: просто задержка 1 сек и награда
        console.warn('YSANDEX SDK не найден, используется заглушка рекламы');
        setTimeout(() => {
            if (callback) callback();
        }, 1000);
    }
}