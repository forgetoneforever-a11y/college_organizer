import { state, saveState } from './state.js';

export function initGrades() {
    const gradesList = document.getElementById('gradesList');
    const addGradeBtn = document.getElementById('addGradeBtn');
    const subjectInput = document.getElementById('subjectInput');
    const gradeInput = document.getElementById('gradeInput');

    if (!gradesList) return;

    renderGrades();

    if (addGradeBtn) {
        addGradeBtn.addEventListener('click', () => {
            const subject = subjectInput.value.trim();
            const grade = gradeInput.value.trim();
            
            if (!subject || !grade) return;

            if (!state.grades[subject]) {
                state.grades[subject] = [];
            }
            const newGrades = grade.split(',').map(g => g.trim()).filter(g => !isNaN(g) && g !== '');
            state.grades[subject].push(...newGrades);
            
            saveState('gradesData');
            renderGrades();
            
            subjectInput.value = '';
            gradeInput.value = '';
        });
    }

    gradesList.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const subject = btn.dataset.subject;
        const action = btn.dataset.action;

        if (action === 'delete') {
            if (confirm(`Точно удалить предмет "${subject}"?`)) {
                delete state.grades[subject];
                saveState('gradesData');
                renderGrades();
            }
        } else if (action === 'edit') {
            const currentGrades = state.grades[subject].join(', ');
            const newSubject = prompt("Измени название предмета:", subject);
            if (newSubject === null) return;
            
            const newGradesStr = prompt("Измени оценки (через запятую):", currentGrades);
            if (newGradesStr === null) return;

            const trimmedSubject = newSubject.trim();
            if (!trimmedSubject) return;

            if (subject !== trimmedSubject) {
                delete state.grades[subject];
            }

            const updatedGrades = newGradesStr.split(',').map(g => g.trim()).filter(g => !isNaN(g) && g !== '');
            state.grades[trimmedSubject] = updatedGrades;

            saveState('gradesData');
            renderGrades();
        }
    });
}

function renderGrades() {
    const gradesList = document.getElementById('gradesList');
    if (!gradesList) return;

    gradesList.innerHTML = '';
    
    if (Object.keys(state.grades).length === 0) {
        gradesList.innerHTML = `<p style="opacity: 0.5; text-align: center; padding: 20px;">Пока нет добавленных предметов и оценок.</p>`;
        return;
    }

    for (const [subject, grades] of Object.entries(state.grades)) {
        let avgBadge = '';
        if (grades.length > 0) {
            const numericGrades = grades.map(Number).filter(n => !isNaN(n));
            if (numericGrades.length > 0) {
                const sum = numericGrades.reduce((a, b) => a + b, 0);
                const avg = (sum / numericGrades.length).toFixed(2);
                avgBadge = `<span class="grade-avg">Средний: <strong>${avg}</strong></span>`;
            }
        }

        const badgesHtml = grades.map(g => `<span class="grade-badge">${g}</span>`).join('');

        const li = document.createElement('li');
        li.className = 'grade-card';
        
        li.innerHTML = `
            <div class="grade-info">
                <span class="grade-subject-name">${subject}</span>
                <div class="grade-badges">${badgesHtml}</div>
                ${avgBadge}
            </div>
            <div class="grade-actions">
                <button data-action="edit" data-subject="${subject}" title="Изменить">✏️</button>
                <button data-action="delete" data-subject="${subject}" class="delete-btn" title="Удалить">🗑️</button>
            </div>
        `;
        gradesList.appendChild(li);
    }
}
