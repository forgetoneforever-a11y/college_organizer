import { state, saveState } from './state.js';

export function initSettings() {
    const blurRange = document.getElementById('blurRange');
    const blurValue = document.getElementById('blurValue');
    const opacityRange = document.getElementById('opacityRange');
    const bgUrlInput = document.getElementById('bgUrlInput');
    const saveBgBtn = document.getElementById('saveBgBtn');
    
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const importJsonBtn = document.getElementById('importJsonBtn');
    const importFileinput = document.getElementById('importFileinput');

    if (state.settings.blur) {
        if (blurRange) blurRange.value = state.settings.blur;
        if (blurValue) blurValue.textContent = state.settings.blur;
        document.documentElement.style.setProperty('--glass-blur', state.settings.blur + 'px');
    }

    if (state.settings.opacity) {
        if (opacityRange) opacityRange.value = state.settings.opacity;
        document.documentElement.style.setProperty('--glass-bg', `rgba(40, 40, 60, ${state.settings.opacity})`);
    }

    if (state.settings.bg && bgUrlInput) {
        bgUrlInput.value = state.settings.bg;
        applyBackground(state.settings.bg);
    }

    if (blurRange) {
        blurRange.addEventListener('input', (e) => {
            const val = e.target.value;
            if (blurValue) blurValue.textContent = val;
            document.documentElement.style.setProperty('--glass-blur', val + 'px');
            state.settings.blur = val;
            saveState('appSettings');
        });
    }

    if (opacityRange) {
        opacityRange.addEventListener('input', (e) => {
            const val = e.target.value;
            document.documentElement.style.setProperty('--glass-bg', `rgba(40, 40, 60, ${val})`);
            state.settings.opacity = val;
            saveState('appSettings');
        });
    }

    if (saveBgBtn) {
        saveBgBtn.addEventListener('click', () => {
            const url = bgUrlInput.value.trim();
            if (!url) return;
            applyBackground(url);
            state.settings.bg = url;
            saveState('appSettings');
        });
    }

    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', () => {
            const backupData = {
                notes: state.notes,
                grades: state.grades,
                tasks: state.tasks,
                settings: state.settings
            };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "college_organizer_backup.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });
    }

    if (importJsonBtn && importFileinput) {
        importJsonBtn.addEventListener('click', () => {
            importFileinput.click();
        });

        importFileinput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (parsed.notes) {
                        state.notes = parsed.notes;
                        localStorage.setItem('calendarNotes', JSON.stringify(state.notes));
                    }
                    if (parsed.grades) {
                        state.grades = parsed.grades;
                        localStorage.setItem('gradesData', JSON.stringify(state.grades));
                    }
                    if (parsed.tasks) {
                        state.tasks = parsed.tasks;
                        localStorage.setItem('tasksData', JSON.stringify(state.tasks));
                    }
                    if (parsed.settings) {
                        state.settings = parsed.settings;
                        localStorage.setItem('appSettings', JSON.stringify(state.settings));
                    }
                    alert("Данные успешно импортированы! Страница перезагрузится.");
                    window.location.reload();
                } catch (err) {
                    alert("Ошибка при чтении файла JSON.");
                }
            };
            reader.readAsText(file);
        });
    }
}

function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function applyBackground(url) {
    const youtubeBg = document.getElementById('youtube-bg');
    const bgImage = document.getElementById('bg-image');
    const ytId = getYouTubeId(url);

    if (ytId) {
        if (youtubeBg) {
            youtubeBg.style.display = 'block';
            youtubeBg.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&autohide=1" frameborder="0" allow="autoplay"></iframe>`;
        }
        if (bgImage) bgImage.style.backgroundImage = 'none';
    } else {
        if (youtubeBg) {
            youtubeBg.style.display = 'none';
            youtubeBg.innerHTML = '';
        }
        if (bgImage) bgImage.style.backgroundImage = `url('${url}')`;
    }
}