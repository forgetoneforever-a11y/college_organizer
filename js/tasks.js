import { state, saveState } from './state.js';

export function initTasks() {
    const tasksList = document.getElementById('tasksList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const alarmTimeInput = document.getElementById('alarmTimeInput');

    if (!tasksList) return;

    renderTasks();

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            const text = taskInput.value.trim();
            const time = alarmTimeInput.value;
            if (!text) return;

            const newTask = { id: Date.now(), text, time, notified: false };
            state.tasks.push(newTask);
            saveState('tasksData');
            renderTasks();

            taskInput.value = '';
            alarmTimeInput.value = '';
        });
    }

    setInterval(checkAlarms, 1000);
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    if (!tasksList) return;

    tasksList.innerHTML = '';

    if (state.tasks.length === 0) {
        tasksList.innerHTML = `<p style="opacity: 0.5; text-align: center; padding: 20px;">Пока нет активных заданий.</p>`;
        return;
    }

    state.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-card';

        const timeBadge = task.time 
            ? `<span class="task-time">🕒 ${task.time}</span>` 
            : `<span class="task-time" style="opacity: 0.4;">Без времени</span>`;
        
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                ${timeBadge}
            </div>
            <button data-id="${task.id}" class="delete-btn" title="Удалить">🗑️</button>
        `;
        
        li.querySelector('button').addEventListener('click', () => {
            state.tasks = state.tasks.filter(t => t.id !== task.id);
            saveState('tasksData');
            renderTasks();
        });

        tasksList.appendChild(li);
    });
}

function checkAlarms() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    state.tasks.forEach(task => {
        if (task.time === currentTime && !task.notified) {
            alert(`⏰ Напоминание: ${task.text}`);
            task.notified = true;
            saveState('tasksData');
        }
    });
}
