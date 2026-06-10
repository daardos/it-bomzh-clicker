import { state } from './state.js';
import { dom } from './dom.js';

export function showFinalScreen() {
    dom.finalScreen.style.display = 'flex';
    clearTimeout(state.overheatTimer);
    const elapsed = Math.floor((Date.now() - state.gameStartTime) / 1000);
    dom.finalTimeSpan.textContent = `${Math.floor(elapsed/60)}:${(elapsed%60).toString().padStart(2,'0')}`;
    const canvas = dom.matrixCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const chars = '01';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';
        for (let i=0; i<drops.length; i++) {
            ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*fontSize, drops[i]*fontSize);
            if (drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i]=0;
            drops[i]++;
        }
    }
    setInterval(draw, 40);
}