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

    // 2. Переключение вкладок
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

    // 3. Выбор фона через кнопку с компьютера
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

    // 4. Логика Telegram-уведомлений для будильника
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

    // Проверка будильника каждую секунду/минуту
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
