document.addEventListener('DOMContentLoaded', function () {
    const loader = document.querySelector('.fh5co-loader');
    const darkModeButton = document.getElementById('darkModeToggle');
    let darkModeStatus = localStorage.getItem('darkMode');

    // Check if darkModeStatus is null, then set default
    if (darkModeStatus === null) {
        darkModeStatus = 'enabled';
        localStorage.setItem('darkMode', darkModeStatus);
    }

    // Apply the dark or light theme based on stored status
    if (darkModeStatus === 'enabled') {
        document.body.classList.add('dark-mode');  // Apply dark mode
        loader.style.backgroundColor = '#2e2e2e'; // Dark background for loader
        if (darkModeButton) darkModeButton.innerHTML = '🌞'; // Sun icon for dark mode
    } else {
        document.body.classList.remove('dark-mode'); // Apply light mode
        loader.style.backgroundColor = '#fff'; // Light background for loader
        if (darkModeButton) darkModeButton.innerHTML = '🌙'; // Moon icon for light mode
    }

    // Make the page content visible after theme is applied
    document.body.classList.add('theme-ready');
});

// Toggle dark mode on button click and store preference in localStorage
function toggleDarkMode() {
    const darkModeButton = document.getElementById('darkModeToggle');
    const loader = document.querySelector('.fh5co-loader');

    // Toggle the 'dark-mode' class
    const isDarkModeEnabled = document.body.classList.toggle('dark-mode');

    try {
        if (isDarkModeEnabled) {
            localStorage.setItem('darkMode', 'enabled');
            loader.style.backgroundColor = '#2e2e2e'; // Dark background for loader
            if (darkModeButton) darkModeButton.innerHTML = '🌞'; // Sun icon
        } else {
            localStorage.setItem('darkMode', 'disabled');
            loader.style.backgroundColor = '#fff'; // Light background for loader
            if (darkModeButton) darkModeButton.innerHTML = '🌙'; // Moon icon
        }
    } catch (e) {
        console.error("localStorage error:", e);
    }
}
