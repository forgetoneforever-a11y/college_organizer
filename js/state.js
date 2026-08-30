export const state = {
    notes: JSON.parse(localStorage.getItem('calendarNotes')) || {},
    grades: JSON.parse(localStorage.getItem('gradesData')) || {},
    tasks: JSON.parse(localStorage.getItem('tasksData')) || [],
    settings: JSON.parse(localStorage.getItem('appSettings')) || {
        blur: 16,
        opacity: 0.35,
        bg: ''
    }
};

export function saveState(key) {
    if (key === 'calendarNotes') localStorage.setItem('calendarNotes', JSON.stringify(state.notes));
    if (key === 'gradesData') localStorage.setItem('gradesData', JSON.stringify(state.grades));
    if (key === 'tasksData') localStorage.setItem('tasksData', JSON.stringify(state.tasks));
    if (key === 'appSettings') localStorage.setItem('appSettings', JSON.stringify(state.settings));
}
