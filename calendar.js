import { state, saveState } from './state.js';

let currentDate = new Date();
let selectedDateKey = null;

export function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;

    const monthYearTitle = document.getElementById('monthYearTitle');
    const dayModal = document.getElementById('dayModal');
    const dayNoteInput = document.getElementById('dayNoteInput');
    const saveDayNoteBtn = document.getElementById('saveDayNoteBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    renderCalendar();
    updateSmartWidget();

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

    if (saveDayNoteBtn) {
        saveDayNoteBtn.addEventListener('click', () => {
            if (!selectedDateKey) return;
            const text = dayNoteInput.value.trim();
            const selectedPriority = document.querySelector('input[name="priority"]:checked');
            const priority = selectedPriority ? selectedPriority.value : 'green';

            if (text === '') {
                delete state.notes[selectedDateKey];
            } else {
                state.notes[selectedDateKey] = { text, priority };
            }

            saveState('calendarNotes');
            if (dayModal) dayModal.style.display = 'none';
            renderCalendar();
            updateSmartWidget();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (dayModal) dayModal.style.display = 'none';
        });
    }
}

function updateSmartWidget() {
    const titleEl = document.getElementById('smartDayTitle');
    const descEl = document.getElementById('smartDayDesc');
    if (!titleEl || !descEl) return;

    const now = new Date();
    const daysNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const dayName = daysNames[now.getDay()];
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayKey = `${year}-${month}-${day}`;

    const todayNote = state.notes[todayKey];
    let descText = `Будильники и задачи на сегодня активны.`;
    
    if (todayNote) {
        descText = `Заметка на сегодня: "${todayNote.text}"`;
    } else if (now.getDay() === 0 || now.getDay() === 6) {
        descText = `Выходной день. Отдыхай и набирайся сил!`;
    } else {
        descText = `Учебный день. Подъём в 6:50, выезд в техникум к 8:30.`;
    }

    titleEl.textContent = `Сегодня ${dayName}`;
    descEl.textContent = descText;
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearTitle = document.getElementById('monthYearTitle');
    if (!calendarGrid) return;

    calendarGrid.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthsNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    if (monthYearTitle) monthYearTitle.textContent = `${monthsNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    let startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarGrid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (state.notes[dateKey]) {
            dayDiv.classList.add(`priority-${state.notes[dateKey].priority}`);
        }

        dayDiv.innerHTML = `<strong>${day}</strong> <span style="font-size: 11px; opacity: 0.8; overflow: hidden; max-height: 35px;">${state.notes[dateKey] ? state.notes[dateKey].text : ''}</span>`;
        
        dayDiv.addEventListener('click', () => {
            selectedDateKey = dateKey;
            const modalDateTitle = document.getElementById('modalDateTitle');
            const dayNoteInput = document.getElementById('dayNoteInput');
            const dayModal = document.getElementById('dayModal');

            if (modalDateTitle) modalDateTitle.textContent = `Заметка на ${day} ${monthsNames[month]} ${year}`;
            if (dayNoteInput) dayNoteInput.value = state.notes[dateKey] ? state.notes[dateKey].text : '';
            if (state.notes[dateKey]) {
                const radio = document.querySelector(`input[name="priority"][value="${state.notes[dateKey].priority}"]`);
                if (radio) radio.checked = true;
            }
            if (dayModal) dayModal.style.display = 'flex';
        });

        calendarGrid.appendChild(dayDiv);
    }
}