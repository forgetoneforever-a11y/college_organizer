export function initSettings() {
    const toggleBgBtn = document.getElementById("toggleBgBtn");
    const bgStatus = document.getElementById("bgStatus");
    
    if (!toggleBgBtn) return;

    let bgMode = localStorage.getItem("bgMode") || "dark";

    function updateBgState() {
        if (bgMode === "dark") {
            document.body.style.backgroundColor = "#0b0b10";
            if (bgStatus) bgStatus.textContent = "Текущий режим: Тёмный минимализм";
        } else if (bgMode === "contrast") {
            document.body.style.backgroundColor = "#161b22";
            if (bgStatus) bgStatus.textContent = "Текущий режим: Глубокий синий";
        } else {
            document.body.style.backgroundColor = "#1f1f1f";
            if (bgStatus) bgStatus.textContent = "Текущий режим: Студийный серый";
        }
    }

    toggleBgBtn.addEventListener("click", () => {
        if (bgMode === "dark") {
            bgMode = "contrast";
        } else if (bgMode === "contrast") {
            bgMode = "gray";
        } else {
            bgMode = "dark";
        }
        localStorage.setItem("bgMode", bgMode);
        updateBgState();
    });

    updateBgState();
}
