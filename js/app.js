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

    // 3. Логика смены фона (YouTube или картинка)
    const saveBgBtn = document.getElementById('saveBgBtn');
    const bgUrlInput = document.getElementById('bgUrlInput');
    const youtubeBg = document.getElementById('youtube-bg');
    const bgImage = document.getElementById('bg-image');

    if (saveBgBtn && bgUrlInput) {
        saveBgBtn.addEventListener('click', () => {
            const url = bgUrlInput.value.trim();
            
            // Проверка на YouTube ссылку (поддерживает youtube.com и youtu.be)
            const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);

            if (ytMatch && ytMatch[1]) {
                const videoId = ytMatch[1];
                if (youtubeBg) {
                    youtubeBg.style.display = 'block';
                    youtubeBg.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0" frameborder="0" allow="autoplay"></iframe>`;
                }
                if (bgImage) bgImage.style.display = 'none';
            } else if (url) {
                if (youtubeBg) youtubeBg.style.display = 'none';
                if (bgImage) {
                    bgImage.style.display = 'block';
                    bgImage.style.backgroundImage = `url('${url}')`;
                }
            }
            
            localStorage.setItem('college_bg', url);
        });

        // Загрузка сохраненного фона при старте
        const savedBg = localStorage.getItem('college_bg');
        if (savedBg) {
            bgUrlInput.value = savedBg;
            saveBgBtn.click();
        }
    }
});
