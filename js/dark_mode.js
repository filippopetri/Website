document.addEventListener('DOMContentLoaded', function () {
    const loader = document.querySelector('.fh5co-loader'); // Seleziona il loader
    const darkModeButton = document.getElementById('darkModeToggle'); // Pulsante per alternare modalità
    let darkModeStatus = localStorage.getItem('darkMode'); // Recupera stato

    // Se non è impostato, abilita di default la dark mode
    if (!darkModeStatus) {
        darkModeStatus = 'enabled';
        localStorage.setItem('darkMode', darkModeStatus);
    }

    // Applica lo stato salvato
    if (darkModeStatus === 'enabled') {
        if (loader) loader.style.backgroundColor = "#2e2e2e";
        document.body.classList.add('dark-mode');
        if (darkModeButton) darkModeButton.innerHTML = '🌞'; // Cambia icona a "sole"
    } else {
        if (loader) loader.style.backgroundColor = "#fff";
        document.body.classList.remove('dark-mode');
        if (darkModeButton) darkModeButton.innerHTML = '🌙'; // Cambia icona a "luna"
    }
});

// Funzione per alternare la modalità scura
function toggleDarkMode() {
    const darkModeButton = document.getElementById('darkModeToggle');
    const loader = document.querySelector('.fh5co-loader'); // Assicurati di avere il loader

    // Alterna la modalità
    const isDarkModeEnabled = document.body.classList.toggle('dark-mode');

    try {
        if (isDarkModeEnabled) {
            localStorage.setItem('darkMode', 'enabled');
            if (loader) loader.style.backgroundColor = "#2e2e2e";
            if (darkModeButton) darkModeButton.innerHTML = '🌞'; // Cambia a "sole"
        } else {
            localStorage.setItem('darkMode', 'disabled');
            if (loader) loader.style.backgroundColor = "#fff";
            if (darkModeButton) darkModeButton.innerHTML = '🌙'; // Cambia a "luna"
        }
    } catch (e) {
        console.error("localStorage error:", e);
    }
}