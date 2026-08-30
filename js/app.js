document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Умная плашка дня
    // ==========================================
    const smartDayTitle = document.getElementById('smartDayTitle');
    const smartDayDesc = document.getElementById('smartDayDesc');

    if (smartDayTitle && smartDayDesc) {
        const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
        const now = new Date();
        const dayIndex = now.getDay();

        smartDayTitle.textContent = `Сегодня ${days[dayIndex]}`;
        smartDayDesc.textContent = (dayIndex === 0 || dayIndex === 6)
            ? "Выходной день. Отдыхай и набирайся сил!"
            : "Учебный день. Не забудь проверить расписание и задания!";
    }

    // ==========================================
    // 2. Генерация календаря
    // ==========================================
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearTitle = document.getElementById('monthYearTitle');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date();

    function renderCalendar() {
        if (!calendarGrid || !monthYearTitle) return;
        calendarGrid.innerHTML = '';

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        monthYearTitle.textContent = `${monthNames[month]} ${year}`;

        const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        weekDays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.style.cssText = "font-weight: bold; text-align: center; opacity: 0.7; padding: 5px;";
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            calendarGrid.appendChild(document.createElement('div'));
        }

        const today = new Date();
        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement('div');
            cell.style.cssText = "min-height: 70px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 6px; position: relative;";
            cell.innerHTML = `<span style="font-weight: 600; font-size: 14px;">${day}</span>`;

            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                cell.style.borderColor = '#00ff66';
                cell.style.background = 'rgba(0,255,102,0.1)';
            }
            calendarGrid.appendChild(cell);
        }
    }

    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
        nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
    }
    renderCalendar();

    // ==========================================
    // 3. Переключение вкладок
    // ==========================================
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            button.classList.add('active');
            const targetTab = document.getElementById(button.getAttribute('data-tab'));
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // ==========================================
    // 4. Сохранение и загрузка ФОНА (IndexedDB)
    // ==========================================
    const selectBgBtn = document.getElementById('selectBgBtn');
    const bgFileInput = document.getElementById('bgFileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const localVideoBg = document.getElementById('local-video-bg');
    const bgImage = document.getElementById('bg-image');

    function openBgDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('CollegeAppDB', 1);
            req.onupgradeneeded = (e) => e.target.result.createObjectStore('assets');
            req.onsuccess = (e) => resolve(e.target.result);
            req.onerror = (e) => reject(e);
        });
    }

    async function saveBgToDB(file) {
        const db = await openBgDB();
        const tx = db.transaction('assets', 'readwrite');
        tx.objectStore('assets').put(file, 'customBackground');
    }

    async function loadBgFromDB() {
        try {
            const db = await openBgDB();
            const tx = db.transaction('assets', 'readonly');
            const req = tx.objectStore('assets').get('customBackground');
            req.onsuccess = () => {
                const file = req.result;
                if (file) applyBackground(file);
            };
        } catch (e) {
            console.error("Ошибка загрузки фона из DB:", e);
        }
    }

    function applyBackground(file) {
        if (fileNameDisplay) fileNameDisplay.textContent = `Выбран: ${file.name}`;
        const fileUrl = URL.createObjectURL(file);

        if (file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm')) {
            if (localVideoBg) {
                localVideoBg.style.display = 'block';
                localVideoBg.src = fileUrl;
                localVideoBg.load();
                localVideoBg.play().catch(err => console.log("Автовоспроизведение:", err));
            }
            if (bgImage) bgImage.style.display = 'none';
        } else {
            if (localVideoBg) { localVideoBg.style.display = 'none'; localVideoBg.src = ''; }
            if (bgImage) {
                bgImage.style.display = 'block';
                bgImage.style.backgroundImage = `url('${fileUrl}')`;
            }
        }
    }

    if (selectBgBtn && bgFileInput) {
        selectBgBtn.addEventListener('click', () => bgFileInput.click());
        bgFileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            applyBackground(file);
            await saveBgToDB(file);
        });
    }
    loadBgFromDB();

    // ==========================================
    // 5. Сохранение ЗАДАЧ и БУДИЛЬНИКА (localStorage)
    // ==========================================
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const alarmTimeInput = document.getElementById('alarmTimeInput');
    const tasksList = document.getElementById('tasksList');

    let tasks = JSON.parse(localStorage.getItem('college_tasks') || '[]');

    function saveAndRenderTasks() {
        localStorage.setItem('college_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        if (!tasksList) return;
        tasksList.innerHTML = '';
        tasks.forEach((item, index) => {
            const li = document.createElement('li');
            li.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;";
            
            let content = `<span>${item.text || 'Будильник'}</span>`;
            if (item.alarm) {
                content += `<span style="font-size: 12px; background: rgba(0,255,100,0.2); padding: 2px 6px; border-radius: 4px;">⏰ ${item.alarm}</span>`;
            }

            const delBtn = document.createElement('button');
            delBtn.style.cssText = "background: transparent; border: none; color: #ff5555; cursor: pointer; font-size: 16px;";
            delBtn.textContent = '✕';
            delBtn.onclick = () => {
                tasks.splice(index, 1);
                saveAndRenderTasks();
            };

            li.innerHTML = content;
            li.appendChild(delBtn);
            tasksList.appendChild(li);
        });
    }

    if (addTaskBtn && taskInput && tasksList) {
        addTaskBtn.addEventListener('click', () => {
            const taskText = taskInput.value.trim();
            const alarmTime = alarmTimeInput ? alarmTimeInput.value : '';

            if (!taskText && !alarmTime) {
                alert('Введи текст задачи или установи время!');
                return;
            }

            tasks.push({ text: taskText, alarm: alarmTime });
            saveAndRenderTasks();
            taskInput.value = '';
            if (alarmTimeInput) alarmTimeInput.value = '';
        });
    }
    renderTasks();

    // ==========================================
    // 6. TELEGRAM УВЕДОМЛЕНИЯ ПО БУДИЛЬНИКУ
    // ==========================================
    const tgTokenInput = document.getElementById('tgTokenInput');
    const tgChatIdInput = document.getElementById('tgChatIdInput');
    const saveTgBtn = document.getElementById('saveTgBtn');

    if (tgTokenInput && tgChatIdInput && saveTgBtn) {
        // Подставляем твои данные автоматически, если они еще не сохранены
        tgTokenInput.value = localStorage.getItem('tg_bot_token') || '8949551278:AAGxkh8IpRxFPV1KxR6pcXR7Vh6niSTkPXg';
        tgChatIdInput.value = localStorage.getItem('tg_chat_id') || '8870678654';

        saveTgBtn.addEventListener('click', () => {
            localStorage.setItem('tg_bot_token', tgTokenInput.value.trim());
            localStorage.setItem('tg_chat_id', tgChatIdInput.value.trim());
            alert('Настройки Telegram успешно сохранены!');
        });
    }

    async function sendTelegramNotification(message) {
        const token = localStorage.getItem('tg_bot_token') || '8949551278:AAGxkh8IpRxFPV1KxR6pcXR7Vh6niSTkPXg';
        const chatId = localStorage.getItem('tg_chat_id') || '8870678654';

        if (!token || !chatId) return;

        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
            });
        } catch (e) {
            console.error("Ошибка Telegram:", e);
        }
    }

    setInterval(() => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        tasks.forEach(task => {
            if (task.alarm === currentTime) {
                const lastSentKey = `sent_${task.text}_${task.alarm}_${currentTime}`;
                if (localStorage.getItem(lastSentKey) !== 'true') {
                    sendTelegramNotification(`⏰ **Будильник!**\nЗадача: ${task.text || 'Без названия'}\nВремя: ${task.alarm}`);
                    localStorage.setItem(lastSentKey, 'true');
                }
            }
        });
    }, 10000);
});
