document.addEventListener('DOMContentLoaded', function () {
    const darkModeButton = document.getElementById('darkModeToggle');
    let darkModeStatus = localStorage.getItem('darkMode');

    // Se non è impostato, abilita di default la dark mode
    if (!darkModeStatus) {
        darkModeStatus = 'enabled';
        localStorage.setItem('darkMode', darkModeStatus);
    }

    // Applica lo stato salvato
    if (darkModeStatus === 'enabled') {
        document.body.classList.add('dark-mode');
        if (darkModeButton) darkModeButton.innerHTML = '🌞'; // Cambia icona a "sole"
    } else {
        document.body.classList.remove('dark-mode');
        if (darkModeButton) darkModeButton.innerHTML = '🌙'; // Cambia icona a "luna"
    }
});

// Funzione per alternare la modalità scura
function toggleDarkMode() {
    const darkModeButton = document.getElementById('darkModeToggle');

    // Alterna la modalità
    const isDarkModeEnabled = document.body.classList.toggle('dark-mode');

    try {
        if (isDarkModeEnabled) {
            localStorage.setItem('darkMode', 'enabled');
            if (darkModeButton) darkModeButton.innerHTML = '🌞'; // Cambia a "sole"
        } else {
            localStorage.setItem('darkMode', 'disabled');
            if (darkModeButton) darkModeButton.innerHTML = '🌙'; // Cambia a "luna"
        }
    } catch (e) {
        console.error("localStorage error:", e);
    }
}