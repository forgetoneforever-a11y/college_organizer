document.addEventListener('DOMContentLoaded', () => {
    // 1. Умная плашка дня
    const smartDayTitle = document.getElementById('smartDayTitle');
    const smartDayDesc = document.getElementById('smartDayDesc');

    if (smartDayTitle && smartDayDesc) {
        const days = [
            "Воскресенье", "Понедельник", "Вторник", 
            "Среда", "Четверг", "Пятница", "Суббота"
        ];
        
        const now = new Date();
        const dayIndex = now.getDay();
        const currentDayName = days[dayIndex];

        smartDayTitle.textContent = `Сегодня ${currentDayName}`;

        if (dayIndex === 0 || dayIndex === 6) {
            smartDayDesc.textContent = "Выходной день. Отдыхай и набирайся сил!";
        } else {
            smartDayDesc.textContent = "Учебный день. Не забудь проверить расписание и задания!";
        }
    }

    // 2. Генерация календаря
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

        const monthNames = [
            "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ];
        monthYearTitle.textContent = `${monthNames[month]} ${year}`;

        // Дни недели
        const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        weekDays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.style.cssText = "font-weight: bold; text-align: center; opacity: 0.7; padding: 5px;";
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Первый день месяца и общее количество дней
        const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Пустые ячейки для сдвига дней недели
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            calendarGrid.appendChild(emptyCell);
        }

        // Ячейки с числами месяца
        const today = new Date();
        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            cell.style.cssText = "min-height: 70px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 6px; position: relative;";
            
            cell.innerHTML = `<span style="font-weight: 600; font-size: 14px;">${day}</span>`;

            // Подсветка сегодняшнего дня
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                cell.style.borderColor = '#00ff66';
                cell.style.background = 'rgba(0,255,102,0.1)';
            }

            calendarGrid.appendChild(cell);
        }
    }

    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    renderCalendar();

    // 3. Переключение вкладок
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            button.classList.add('active');

            const tabId = button.getAttribute('data-tab');
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // 4. Выбор фона через кнопку с компьютера
    const selectBgBtn = document.getElementById('selectBgBtn');
    const bgFileInput = document.getElementById('bgFileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const localVideoBg = document.getElementById('local-video-bg');
    const bgImage = document.getElementById('bg-image');

    if (selectBgBtn && bgFileInput) {
        selectBgBtn.addEventListener('click', () => {
            bgFileInput.click();
        });

        bgFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            if (fileNameDisplay) {
                fileNameDisplay.textContent = `Выбран: ${file.name}`;
            }

            const fileUrl = URL.createObjectURL(file);

            if (file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm')) {
                if (localVideoBg) {
                    localVideoBg.style.display = 'block';
                    localVideoBg.src = fileUrl;
                    localVideoBg.load();
                    localVideoBg.play().catch(err => console.log("Ошибка автовоспроизведения:", err));
                }
                if (bgImage) bgImage.style.display = 'none';
            } else if (file.type.startsWith('image/')) {
                if (localVideoBg) {
                    localVideoBg.style.display = 'none';
                    localVideoBg.src = '';
                }
                if (bgImage) {
                    bgImage.style.display = 'block';
                    bgImage.style.backgroundImage = `url('${fileUrl}')`;
                }
            }
            
            localStorage.setItem('college_bg_name', file.name);
        });
    }

    // 5. Логика добавления задач и будильника
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const alarmTimeInput = document.getElementById('alarmTimeInput');
    const tasksList = document.getElementById('tasksList');

    if (addTaskBtn && taskInput && tasksList) {
        addTaskBtn.addEventListener('click', () => {
            const taskText = taskInput.value.trim();
            const alarmTime = alarmTimeInput ? alarmTimeInput.value : '';

            if (!taskText && !alarmTime) {
                alert('Введи текст задачи или установи время будильника!');
                return;
            }

            const li = document.createElement('li');
            li.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;";
            
            let content = `<span>${taskText || 'Будильник'}</span>`;
            if (alarmTime) {
                content += `<span style="font-size: 12px; background: rgba(0,255,100,0.2); padding: 2px 6px; border-radius: 4px;">⏰ ${alarmTime}</span>`;
            }

            li.innerHTML = content + `<button style="background: transparent; border: none; color: #ff5555; cursor: pointer; font-size: 16px;">✕</button>`;

            li.querySelector('button').addEventListener('click', () => {
                li.remove();
            });

            tasksList.appendChild(li);
            taskInput.value = '';
        });
    }

    // 6. Логика Telegram-уведомлений для будильника
    const tgTokenInput = document.getElementById('tgTokenInput');
    const tgChatIdInput = document.getElementById('tgChatIdInput');
    const saveTgBtn = document.getElementById('saveTgBtn');

    if (tgTokenInput && tgChatIdInput && saveTgBtn) {
        tgTokenInput.value = localStorage.getItem('tg_bot_token') || '';
        tgChatIdInput.value = localStorage.getItem('tg_chat_id') || '';

        saveTgBtn.addEventListener('click', () => {
            localStorage.setItem('tg_bot_token', tgTokenInput.value.trim());
            localStorage.setItem('tg_chat_id', tgChatIdInput.value.trim());
            alert('Настройки Telegram успешно сохранены!');
        });
    }

    async function sendTelegramNotification(message) {
        const token = localStorage.getItem('tg_bot_token');
        const chatId = localStorage.getItem('tg_chat_id');

        if (!token || !chatId) return;

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
        } catch (e) {
            console.error("Ошибка отправки в Telegram:", e);
        }
    }

    setInterval(() => {
        const alarmInput = document.getElementById('alarmTimeInput');
        if (!alarmInput || !alarmInput.value) return;

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;

        if (alarmInput.value === currentTime) {
            const lastSent = localStorage.getItem('last_alarm_sent');
            if (lastSent !== currentTime) {
                sendTelegramNotification("⏰ **Внимание! Сработал будильник в твоем органайзере!** Пора вставать и собираться в техникум.");
                localStorage.setItem('last_alarm_sent', currentTime);
            }
        }
    }, 10000);
});
