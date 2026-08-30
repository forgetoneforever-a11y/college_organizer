document.addEventListener('DOMContentLoaded', () => {
    // 1. Логика для умной плашки дня
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

    // 2. Логика переключения вкладок
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

    // 3. Логика смены фона (Локальный файл .mp4 или картинка)
    const saveBgBtn = document.getElementById('saveBgBtn');
    const bgUrlInput = document.getElementById('bgUrlInput');
    const localVideoBg = document.getElementById('local-video-bg');
    const bgImage = document.getElementById('bg-image');

    if (saveBgBtn && bgUrlInput) {
        saveBgBtn.addEventListener('click', () => {
            const val = bgUrlInput.value.trim();
            
            if (val.endsWith('.mp4') || val.endsWith('.webm')) {
                if (localVideoBg) {
                    localVideoBg.style.display = 'block';
                    const sourceEl = localVideoBg.querySelector('source');
                    if (sourceEl) {
                        sourceEl.src = val;
                        localVideoBg.load();
                    }
                }
                if (bgImage) bgImage.style.display = 'none';
            } else if (val) {
                if (localVideoBg) localVideoBg.style.display = 'none';
                if (bgImage) {
                    bgImage.style.display = 'block';
                    bgImage.style.backgroundImage = `url('${val}')`;
                }
            }
            
            localStorage.setItem('college_bg', val);
        });

        // Загрузка сохраненного фона при старте
        const savedBg = localStorage.getItem('college_bg');
        if (savedBg) {
            bgUrlInput.value = savedBg;
            saveBgBtn.click();
        }
    }
});
