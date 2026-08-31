document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Навигация по вкладкам ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // --- 2. Кастомизация (Размытие и Прозрачность) ---
    const blurRange = document.getElementById('blurRange');
    const blurValue = document.getElementById('blurValue');
    const opacityRange = document.getElementById('opacityRange');

    const savedBlur = localStorage.getItem('college_blur');
    const savedOpacity = localStorage.getItem('college_opacity');

    if (savedBlur !== null) {
        document.documentElement.style.setProperty('--blur-strength', savedBlur + 'px');
        if (blurRange) blurRange.value = savedBlur;
        if (blurValue) blurValue.textContent = savedBlur;
    }

    if (savedOpacity !== null) {
        document.documentElement.style.setProperty('--glass-bg', `rgba(20, 20, 30, ${savedOpacity})`);
        if (opacityRange) opacityRange.value = savedOpacity;
    }

    if (blurRange) {
        blurRange.addEventListener('input', (e) => {
            const val = e.target.value;
            document.documentElement.style.setProperty('--blur-strength', val + 'px');
            if (blurValue) blurValue.textContent = val;
            localStorage.setItem('college_blur', val);
        });
    }

    if (opacityRange) {
        opacityRange.addEventListener('input', (e) => {
            const val = e.target.value;
            document.documentElement.style.setProperty('--glass-bg', `rgba(20, 20, 30, ${val})`);
            localStorage.setItem('college_opacity', val);
        });
    }

    // --- 3. Выбор фонового файла ---
    const selectBgBtn = document.getElementById('selectBgBtn');
    const bgFileInput = document.getElementById('bgFileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const localVideoBg = document.getElementById('local-video-bg');
    const bgImage = document.getElementById('bg-image');

    if (selectBgBtn && bgFileInput) {
        selectBgBtn.addEventListener('click', () => bgFileInput.click());

        bgFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (fileNameDisplay) fileNameDisplay.textContent = file.name;
            const fileURL = URL.createObjectURL(file);

            if (file.type.startsWith('video/')) {
                if (localVideoBg && bgImage) {
                    localVideoBg.querySelector('source').src = fileURL;
                    localVideoBg.load();
                    localVideoBg.style.display = 'block';
                    bgImage.style.display = 'none';
                }
            } else if (file.type.startsWith('image/')) {
                if (bgImage && localVideoBg) {
                    bgImage.style.backgroundImage = `url(${fileURL})`;
                    bgImage.style.display = 'block';
                    localVideoBg.style.display = 'none';
                }
            }
        });
    }

    // --- 4. Логика закладок ---
    const bookmarkInput = document.getElementById('bookmarkInput');
    const addBookmarkBtn = document.getElementById('addBookmarkBtn');
    const bookmarksList = document.getElementById('bookmarksList');

    if (addBookmarkBtn && bookmarksList) {
        let bookmarks = JSON.parse(localStorage.getItem('college_bookmarks')) || [];

        function renderBookmarks() {
            bookmarksList.innerHTML = '';
            bookmarks.forEach((item, index) => {
                const li = document.createElement('li');
                li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);';
                
                li.innerHTML = `
                    <span style="font-size: 14px; word-break: break-all;">${item}</span>
                    <button class="delete-bookmark" data-index="${index}" style="background: rgba(255,0,0,0.2); border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Удалить</button>
                `;
                bookmarksList.appendChild(li);
            });
        }

        addBookmarkBtn.addEventListener('click', () => {
            const text = bookmarkInput.value.trim();
            if (text) {
                bookmarks.push(text);
                localStorage.setItem('college_bookmarks', JSON.stringify(bookmarks));
                bookmarkInput.value = '';
                renderBookmarks();
            }
        });

        bookmarksList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-bookmark')) {
                const index = e.target.getAttribute('data-index');
                bookmarks.splice(index, 1);
                localStorage.setItem('college_bookmarks', JSON.stringify(bookmarks));
                renderBookmarks();
            }
        });

        renderBookmarks();
    }
});
