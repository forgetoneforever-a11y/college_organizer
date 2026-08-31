document.addEventListener("DOMContentLoaded", () => {
    console.log("Приложение успешно загружено!");

    // Пример базовой инициализации календаря, если она описана здесь же:
    initCalendar();
    loadTodaySchedule();
});

function initCalendar() {
    const calendarGrid = document.getElementById("calendarGrid");
    const monthYearTitle = document.getElementById("monthYearTitle");
    
    if (!calendarGrid) return;

    let currentDate = new Date();

    function render() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Установка названия месяца и года
        const options = { month: 'long', year: 'numeric' };
        monthYearTitle.textContent = currentDate.toLocaleDateString('ru-RU', options);

        calendarGrid.innerHTML = "";

        // Первый день месяца и общее количество дней
        const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Пустые ячейки для сдвига дней недели
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement("div");
            calendarGrid.appendChild(emptyCell);
        }

        // Заполнение числами месяца
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;
            dayCell.style.cssText = "padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; text-align: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.05);";
            
            dayCell.addEventListener("click", () => {
                alert(`Выбран день: ${day}`);
            });

            calendarGrid.appendChild(dayCell);
        }
    }

    // Обработчики кнопок переключения месяцев
    const prevBtn = document.getElementById("prevMonth");
    const nextBtn = document.getElementById("nextMonth");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            render();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            render();
        });
    }

    render();
}

function loadTodaySchedule() {
    const scheduleEl = document.getElementById("todaySchedule");
    if (scheduleEl) {
        // Учебное расписание для второго курса технологии машиностроения
        scheduleEl.textContent = "Вторник: пар по расписанию нет (или занятия по плану 2-го курса)";
    }
}
