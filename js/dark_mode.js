document.addEventListener('DOMContentLoaded', function () {
    const loader = document.querySelector('.fh5co-loader');
    const darkModeButton = document.getElementById('darkModeToggle');
    let darkModeStatus = localStorage.getItem('darkMode');

    if (darkModeStatus === null) {
        darkModeStatus = 'enabled';
        localStorage.setItem('darkMode', darkModeStatus);
    }

    if (darkModeStatus === 'enabled') {
        document.body.classList.add('dark-mode');
        if (loader) loader.style.backgroundColor = '#2e2e2e';
        if (darkModeButton) darkModeButton.innerHTML = '🌞';
    } else {
        document.body.classList.remove('dark-mode');
        if (loader) loader.style.backgroundColor = '#fff';
        if (darkModeButton) darkModeButton.innerHTML = '🌙';
    }

    document.body.classList.add('theme-ready');
});

function toggleDarkMode() {
    const darkModeButton = document.getElementById('darkModeToggle');
    const isDarkModeEnabled = document.body.classList.toggle('dark-mode');

    try {
        if (isDarkModeEnabled) {
            localStorage.setItem('darkMode', 'enabled');
            if (darkModeButton) darkModeButton.innerHTML = '🌞';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            if (darkModeButton) darkModeButton.innerHTML = '🌙';
        }
    } catch (e) {
        console.error("localStorage error:", e);
    }
}
