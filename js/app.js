document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initCalendar();
    loadTodaySchedule();
});

function initTabs() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTabId = button.getAttribute("data-tab");

            navButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(tab => tab.classList.remove("active"));

            button.classList.add("active");
            const targetContent = document.getElementById(targetTabId);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });
}

function initCalendar() {
    const calendarGrid = document.getElementById("calendarGrid");
    const monthYearTitle = document.getElementById("monthYearTitle");
    
    if (!calendarGrid) return;

    let currentDate = new Date();

    function render() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const options = { month: 'long', year: 'numeric' };
        if (monthYearTitle) {
            monthYearTitle.textContent = currentDate.toLocaleDateString('ru-RU', options);
        }

        calendarGrid.innerHTML = "";

        const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement("div");
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;
            dayCell.style.cssText = "padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; text-align: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: 0.2s;";
            
            dayCell.addEventListener("mouseenter", () => dayCell.style.background = "rgba(255,255,255,0.12)");
            dayCell.addEventListener("mouseleave", () => dayCell.style.background = "rgba(255,255,255,0.05)");

            calendarGrid.appendChild(dayCell);
        }
    }

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
        scheduleEl.textContent = "Вторник: Технология машиностроения (2 курс).";
    }
}
