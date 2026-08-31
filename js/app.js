document.addEventListener('DOMContentLoaded', () => {
    // 1. Умная плашка дня
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

    // 2. Календарь
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
            const h = document.createElement('div');
            h.style.cssText = "font-weight: bold; text-align: center; opacity: 0.7; padding: 8px;";
            h.textContent = day;
            calendarGrid.appendChild(h);
        });

        const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            calendarGrid.appendChild(document.createElement('div'));
        }

        const today = new Date();
        let tasks = JSON.parse(localStorage.getItem('college_tasks') || '[]');

        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement('div');
            cell.style.cssText = "min-height: 100px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px; position: relative;";
            
            let dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            cell.innerHTML = `<span style="font-weight: 600; font-size: 14px;">${day}</span>`;

            const dayTasks = tasks.filter(t => t.date === dateStr);
            let badgesHtml = '<div style="display: flex; flex-direction: column; gap: 4px; margin-top: 6px;">';
            
            const colors = { green: '#28a745', blue: '#007bff', red: '#dc3545' };
            dayTasks.forEach(dt => {
                let bgCol = colors[dt.priority] || '#007bff';
                badgesHtml += `<div style="font-size: 11px; background: ${bgCol}; padding: 3px 6px; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${dt.text}</div>`;
            });
            badgesHtml += '</div>';
            cell.innerHTML += badgesHtml;

            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                cell.style.borderColor = '#00ff66';
            }
            calendarGrid.appendChild(cell);
        }
    }

    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
        nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
    }
    renderCalendar();

    // 3. Навигация по вкладкам
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

    // 4. Дневник и оценки
    const addGradeBtn = document.getElementById('addGradeBtn');
    const subjectInput = document.getElementById('subjectInput');
    const gradeInput = document.getElementById('gradeInput');
    const gradesList = document.getElementById('gradesList');

    let grades = JSON.parse(localStorage.getItem('college_grades') || '[]');

    function saveAndRenderGrades() {
        localStorage.setItem('college_grades', JSON.stringify(grades));
        renderGrades();
    }

    function renderGrades() {
        if (!gradesList) return;
        gradesList.innerHTML = '';
        grades.forEach((item, index) => {
            const li = document.createElement('li');
            li.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;";
            li.innerHTML = `<span><b>${item.subject}:</b> ${item.grades}</span>`;
            
            const delBtn = document.createElement('button');
            delBtn.style.cssText = "background: transparent; border: none; color: #ff5555; cursor: pointer; font-size: 13px;";
            delBtn.textContent = 'Удалить';
            delBtn.onclick = () => { grades.splice(index, 1); saveAndRenderGrades(); };
            
            li.appendChild(delBtn);
            gradesList.appendChild(li);
        });
    }

    if (addGradeBtn && subjectInput && gradeInput) {
        addGradeBtn.addEventListener('click', () => {
            const subject = subjectInput.value.trim();
            const gradeVal = gradeInput.value.trim();
            if (!subject || !gradeVal) {
                alert('Заполните предмет и оценки!');
                return;
            }
            grades.push({ subject, grades: gradeVal });
            saveAndRenderGrades();
            subjectInput.value = '';
            gradeInput.value = '';
        });
    }
    renderGrades();

    // 5. Загрузка медиа для задач
    const selectMediaBtn = document.getElementById('selectMediaBtn');
    const mediaFileInput = document.getElementById('mediaFileInput');
    const mediaFileName = document.getElementById('mediaFileName');
    let currentMediaData = null;

    if (selectMediaBtn && mediaFileInput) {
        selectMediaBtn.addEventListener('click', () => mediaFileInput.click());
        mediaFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            mediaFileName.textContent = file.name;
            const reader = new FileReader();
            reader.onload = function(uploadevent) {
                currentMediaData = {
                    url: uploadevent.target.result,
                    type: file.type.startsWith('video') ? 'video' : 'image'
                };
            };
            reader.readAsDataURL(file);
        });
    }

    // 6. Задачи и будильники
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const alarmTimeInput = document.getElementById('alarmTimeInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const tasksList = document.getElementById('tasksList');

    let tasks = JSON.parse(localStorage.getItem('college_tasks') || '[]');

    function saveAndRenderTasks() {
        try {
            localStorage.setItem('college_tasks', JSON.stringify(tasks));
        } catch (e) {
            alert('Ошибка: Память заполнена! Файл слишком большой.');
        }
        renderTasks();
        renderCalendar();
    }

    function renderTasks() {
        if (!tasksList) return;
        tasksList.innerHTML = '';
        tasks.forEach((item, index) => {
            const li = document.createElement('li');
            li.style.cssText = "display: flex; flex-direction: column; gap: 8px; padding: 14px; margin-bottom: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid " + (item.priority === 'red' ? '#dc3545' : item.priority === 'green' ? '#28a745' : '#007bff') + ";";
            
            let content = `<div style="display: flex; justify-content: space-between; align-items: center;"><span>${item.text || 'Задача'}</span>`;
            if (item.alarm) {
                content += `<span style="font-size: 12px; background: rgba(0,255,100,0.2); padding: 3px 8px; border-radius: 4px;">⏰ ${item.alarm}</span>`;
            }
            content += `</div>`;

            if (item.media) {
                if (item.media.type === 'image') {
                    content += `<img src="${item.media.url}" style="max-height: 150px; border-radius: 6px; object-fit: cover;">`;
                } else {
                    content += `<video src="${item.media.url}" controls style="max-height: 150px; border-radius: 6px; width: 100%;"></video>`;
                }
            }

            const delBtn = document.createElement('button');
            delBtn.style.cssText = "background: transparent; border: none; color: #ff5555; cursor: pointer; font-size: 13px; align-self: flex-end;";
            delBtn.textContent = 'Удалить';
            delBtn.onclick = () => { tasks.splice(index, 1); saveAndRenderTasks(); };

            li.innerHTML = content;
            li.appendChild(delBtn);
            tasksList.appendChild(li);
        });
    }

    if (addTaskBtn && taskInput && tasksList) {
        addTaskBtn.addEventListener('click', () => {
            const taskText = taskInput.value.trim();
            const alarmTime = alarmTimeInput ? alarmTimeInput.value : '';
            const priority = prioritySelect ? prioritySelect.value : 'blue';
            const todayStr = new Date().toISOString().split('T')[0];

            if (!taskText && !alarmTime && !currentMediaData) {
                alert('Заполните задачу, время или прикрепите файл!');
                return;
            }

            tasks.push({
                text: taskText,
                alarm: alarmTime,
                priority: priority,
                date: todayStr,
                media: currentMediaData
            });

            saveAndRenderTasks();
            taskInput.value = '';
            if (alarmTimeInput) alarmTimeInput.value = '';
            mediaFileName.textContent = 'Файл не выбран';
            currentMediaData = null;
        });
    }
    renderTasks();

    // 7. Настройки (Фон, Размытие, Прозрачность)
    const blurRange = document.getElementById('blurRange');
    const blurValue = document.getElementById('blurValue');
    const opacityRange = document.getElementById('opacityRange');
    const selectBgBtn = document.getElementById('selectBgBtn');
    const bgFileInput = document.getElementById('bgFileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const bgVideo = document.getElementById('local-video-bg');
    const bgImage = document.getElementById('bg-image');

    const savedBlur = localStorage.getItem('college_blur') || '16';
    const savedOpacity = localStorage.getItem('college_opacity') || '0.35';
    const savedBg = localStorage.getItem('college_bg');
    const savedBgType = localStorage.getItem('college_bg_type');

    document.documentElement.style.setProperty('--blur-strength', `${savedBlur}px`);
    document.documentElement.style.setProperty('--glass-bg', `rgba(20, 20, 30, ${savedOpacity})`);
    if (blurRange) blurRange.value = savedBlur;
    if (blurValue) blurValue.textContent = savedBlur;
    if (opacityRange) opacityRange.value = savedOpacity;

    if (savedBg) {
        if (savedBgType === 'video') {
            bgVideo.src = savedBg;
            bgVideo.style.display = 'block';
            bgImage.style.display = 'none';
        } else {
            bgImage.style.backgroundImage = `url(${savedBg})`;
            bgImage.style.display = 'block';
            bgVideo.style.display = 'none';
        }
    }

    if (blurRange && blurValue) {
        blurRange.addEventListener('input', (e) => {
            const val = e.target.value;
            blurValue.textContent = val;
            document.documentElement.style.setProperty('--blur-strength', `${val}px`);
            localStorage.setItem('college_blur', val);
        });
    }

    if (opacityRange) {
        opacityRange.addEventListener('input', (e) => {
            const val = e.target.value;
            document.documentElement.style.setProperty('--glass-bg', `rgba(20, 20, 30, ${val})`);
            localStorage.setItem('college_opacity', val);
        });
    }

    if (selectBgBtn && bgFileInput) {
        selectBgBtn.addEventListener('click', () => bgFileInput.click());

        bgFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            fileNameDisplay.textContent = file.name;

            const reader = new FileReader();
            reader.onload = function(event) {
                const result = event.target.result;
                
                if (file.type.startsWith('video')) {
                    if (file.size > 4 * 1024 * 1024) {
                        alert('Видео слишком большое! Оно показано сейчас, но после обновления страницы сбросится. Используйте файл меньше 4 МБ или картинку.');
                    }
                    bgVideo.src = result;
                    bgVideo.style.display = 'block';
                    bgImage.style.display = 'none';
                    try {
                        localStorage.setItem('college_bg', result);
                        localStorage.setItem('college_bg_type', 'video');
                    } catch (err) {
                        console.warn('Видео слишком велико для хранения в localStorage');
                    }
                } else {
                    bgImage.style.backgroundImage = `url(${result})`;
                    bgImage.style.display = 'block';
                    bgVideo.style.display = 'none';
                    try {
                        localStorage.setItem('college_bg', result);
                        localStorage.setItem('college_bg_type', 'image');
                    } catch (err) {
                        alert('Картинка слишком большая для сохранения!');
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // 8. Telegram уведомления
    const tgTokenInput = document.getElementById('tgTokenInput');
    const tgChatIdInput = document.getElementById('tgChatIdInput');
    const saveTgBtn = document.getElementById('saveTgBtn');

    if (tgTokenInput && tgChatIdInput && saveTgBtn) {
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
                body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
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
                    sendTelegramNotification(`⏰ <b>БУДИЛЬНИК!</b>\n\n📌 <b>Задача:</b> ${task.text || 'Без названия'}\n⏰ <b>Время:</b> ${task.alarm}`);
                    localStorage.setItem(lastSentKey, 'true');
                }
            }
        });
    }, 10000);
});
