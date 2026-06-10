/**
 * Показывает кастомное модальное окно.
 * @param {string} message - текст сообщения
 * @param {function} [onClose] - колбэк после закрытия
 */
export function showModal(message, onClose) {
    // Удаляем предыдущее окно, если осталось
    const prev = document.querySelector('.modal-overlay');
    if (prev) prev.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const box = document.createElement('div');
    box.className = 'modal-box';
    box.innerHTML = `<p>${message}</p>`;

    const btn = document.createElement('button');
    btn.className = 'modal-close';
    btn.textContent = 'OK';
    btn.addEventListener('click', () => {
        overlay.remove();
        if (typeof onClose === 'function') onClose();
    });

    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}