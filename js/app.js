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

            if (file.type.startsWith('video/')) {
                if (localVideoBg) {
                    localVideoBg.style.display = 'block';
                    const sourceEl = localVideoBg.querySelector('source');
                    if (sourceEl) {
                        sourceEl.src = fileUrl;
                        localVideoBg.load();
                    }
                }
                if (bgImage) bgImage.style.display = 'none';
            } else if (file.type.startsWith('image/')) {
                if (localVideoBg) localVideoBg.style.display = 'none';
                if (bgImage) {
                    bgImage.style.display = 'block';
                    bgImage.style.backgroundImage = `url('${fileUrl}')`;
                }
            }
            
            localStorage.setItem('college_bg_name', file.name);
        });
    }
});
