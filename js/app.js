document.addEventListener('DOMContentLoaded', () => {
    // Логика для умной плашки дня
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

        // Настраиваем текст в зависимости от дня недели
        if (dayIndex === 0 || dayIndex === 6) {
            smartDayDesc.textContent = "Выходной день. Отдыхай и набирайся сил!";
        } else {
            smartDayDesc.textContent = "Учебный день. Не забудь проверить расписание и задания!";
        }
    }
});
// Логика переключения вкладок
const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок и секций
        navButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));

        // Добавляем активный класс нажатой кнопке
        button.classList.add('active');

        // Находим и показываем нужную секцию по атрибуту data-tab
        const tabId = button.getAttribute('data-tab');
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    });
});
