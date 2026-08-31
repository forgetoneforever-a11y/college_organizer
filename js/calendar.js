document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearTitle = document.getElementById('monthYearTitle');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    if (!calendarGrid) return;

    let currentDate = new Date();

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Установка заголовка месяца и года
        const options = { month: 'long', year: 'numeric' };
        if (monthYearTitle) {
            monthYearTitle.textContent = currentDate.toLocaleDateString('ru-RU', options);
        }

        // Первый день месяца и общее количество дней
        const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // с понедельника
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Пустые ячейки для дней предыдущего месяца
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyCell);
        }

        // Дни текущего месяца
        const today = new Date();
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.textContent = day;

            // Подсветка сегодняшнего дня
            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dayCell.classList.add('today');
            }

            calendarGrid.appendChild(dayCell);
        }
    }

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    renderCalendar();
});
