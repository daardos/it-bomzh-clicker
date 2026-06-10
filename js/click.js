import { state } from './state.js';
import { dom } from './dom.js';
import { updateUI } from './ui.js';
import { checkQuestProgress } from './quests.js';

// === Звук ===
let audioCtx = null;

function playClickSound() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.connect(gain1).connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(200, now);
    gain2.gain.setValueAtTime(0.2, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc2.connect(gain2).connect(audioCtx.destination);
    osc2.start(now);
    osc2.stop(now + 0.08);
}

// === Импульс ===
function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.getElementById('workspace').appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

// === Обработчик ===
function handleClick(e) {
    if (state.bsodActive || state.monitorCableBroken) return;
    if (!e.target.closest('#workspace')) return;

    let base = state.clickPower;
    const gpuLevel = state.pcComponents.gpu || 0;
    if (gpuLevel > 0) {
        base += [0, 200, 500, 1500][gpuLevel];
    }
    const cpuLevel = state.pcComponents.cpu || 0;
    const cpuMult = [0, 0.1, 0.25, 0.5, 1.0][cpuLevel] || 0;
    const add = Math.floor(base * (1 + cpuMult));
    state.coins += add;
    state.totalCoinsEarned += add;
    state.totalClicks++;

    playClickSound();

    const rect = document.getElementById('workspace').getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createRipple(x, y);

    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = '+' + add;
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    document.getElementById('workspace').appendChild(effect);
    effect.addEventListener('animationend', () => effect.remove());

    updateUI();
    checkQuestProgress();
}

// Надёжная инициализация: добавляем обработчик после полной загрузки
window.addEventListener('load', () => {
    const workspace = document.getElementById('workspace');
    if (workspace) {
        workspace.addEventListener('click', handleClick);
    }
});