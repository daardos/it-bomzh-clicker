import { state, questTemplates } from './state.js';
import { dom } from './dom.js';

let questElements = []; // теперь локально, не экспортируется наружу

function generateQuest() {
    const activeTypes = state.activeQuests.map(q => q.type);
    const available = questTemplates.filter(t => !activeTypes.includes(t.type));
    const template = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : questTemplates[Math.floor(Math.random() * questTemplates.length)];
    let goal;
    switch (template.type) {
        case 'clicks': goal = Math.floor(Math.random() * 50) + 50; break;
        case 'coins': goal = Math.floor(Math.random() * 5000) + 5000; break;
        case 'time': goal = Math.floor(Math.random() * 60) + 30; break;
        case 'ads': goal = Math.floor(Math.random() * 3) + 1; break;
        default: goal = 10;
    }
    return {
        type: template.type,
        description: template.desc.replace('{goal}', goal),
        goal: goal,
        progress: 0,
        reward: template.reward,
        currency: template.currency || 'coins',
        unit: template.unit,
    };
}

export function initQuests() {
    state.activeQuests = [];
    for (let i = 0; i < 3; i++) state.activeQuests.push(generateQuest());
    buildQuestElements();
}

function buildQuestElements() {
    dom.questsListDiv.innerHTML = '';
    questElements = state.activeQuests.map((q, index) => {
        const card = document.createElement('div');
        card.className = 'quest-card';
        card.dataset.index = index;
        card.innerHTML = `
            <p>${q.description}</p>
            <div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div>
            <small>0/${q.goal} ${q.unit} | Награда: ${q.reward} ${q.currency === 'btc' ? '₿' : '🪙'}</small>
        `;
        dom.questsListDiv.appendChild(card);
        return {
            card,
            fill: card.querySelector('.progress-fill'),
            small: card.querySelector('small'),
        };
    });
}

function updateQuestProgress(index) {
    const q = state.activeQuests[index];
    if (!q || !questElements[index]) return;
    const progress = Math.min(100, Math.floor((q.progress / q.goal) * 100));
    questElements[index].fill.style.width = progress + '%';
    questElements[index].small.textContent = 
        `${q.progress}/${q.goal} ${q.unit} | Награда: ${q.reward} ${q.currency === 'btc' ? '₿' : '🪙'}`;
}

function replaceQuestElement(index) {
    const oldEl = questElements[index];
    if (oldEl) oldEl.card.remove();
    const q = state.activeQuests[index];
    const card = document.createElement('div');
    card.className = 'quest-card';
    card.dataset.index = index;
    card.innerHTML = `
        <p>${q.description}</p>
        <div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div>
        <small>0/${q.goal} ${q.unit} | Награда: ${q.reward} ${q.currency === 'btc' ? '₿' : '🪙'}</small>
    `;
    dom.questsListDiv.appendChild(card);
    questElements[index] = {
        card,
        fill: card.querySelector('.progress-fill'),
        small: card.querySelector('small'),
    };
}

// Обновляет прогресс всех квестов и проверяет завершение (без рекурсии)
export function checkQuestProgress() {
    // Сначала обновляем прогресс
    state.activeQuests.forEach((q, i) => {
        switch (q.type) {
            case 'clicks': q.progress = state.totalClicks; break;
            case 'coins': q.progress = state.totalCoinsEarned; break;
            case 'time': q.progress = state.gameTime; break;
            case 'ads': q.progress = state.adsWatched; break;
        }
    });
    // Затем проверяем завершённые, но не более одного за раз, чтобы избежать рекурсии
    for (let i = 0; i < state.activeQuests.length; i++) {
        const q = state.activeQuests[i];
        if (q.progress >= q.goal) {
            // Выдаём награду
            if (q.currency === 'btc') {
                state.bitcoins += q.reward;
            } else {
                state.coins += q.reward;
                state.totalCoinsEarned += q.reward;
            }
            // Заменяем квест новым
            state.activeQuests[i] = generateQuest();
            replaceQuestElement(i);
            // После замены обновляем прогресс нового квеста (будет 0)
            updateQuestProgress(i);
            // Завершаем цикл, чтобы не обрабатывать другие квесты в этом же вызове
            // (изменение статистики может повлиять на них, но они проверятся при следующем вызове)
            break;
        } else {
            updateQuestProgress(i);
        }
    }
}

// Восстановление интерфейса квестов после загрузки сохранения
export function rebuildQuestUI() {
    buildQuestElements();
}