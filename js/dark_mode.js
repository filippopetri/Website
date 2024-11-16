// Check dark mode preference on initial load
const darkModeStatus = localStorage.getItem('darkMode'); // Retrieve stored dark mode status

// Apply dark mode based on localStorage immediately
if (darkModeStatus === 'enabled') {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.remove('dark-mode');
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const loader = document.querySelector('.fh5co-loader'); // Select loader
    const darkModeButton = document.getElementById('darkModeToggle'); // Toggle button for dark mode

    // Apply initial loader background based on dark mode
    if (darkModeStatus === 'enabled') {
        loader.style.backgroundColor = '#2e2e2e'; // Set loader to dark mode background
        if (darkModeButton) darkModeButton.innerHTML = '🌞'; // Switch to sun icon
    } else {
        loader.style.backgroundColor = '#fff'; // Set loader to light mode background
        if (darkModeButton) darkModeButton.innerHTML = '🌙'; // Switch to moon icon
    }
});

// Function to toggle dark mode
function toggleDarkMode() {
    const darkModeButton = document.getElementById('darkModeToggle');
    const loader = document.querySelector('.fh5co-loader'); // Make sure loader is selected

    const isDarkModeEnabled = document.body.classList.toggle('dark-mode');

    try {
        if (isDarkModeEnabled) {
            localStorage.setItem('darkMode', 'enabled');
            loader.style.backgroundColor = '#2e2e2e'; // Set loader to dark background
            if (darkModeButton) darkModeButton.innerHTML = '🌞'; // Switch to sun icon
        } else {
            localStorage.setItem('darkMode', 'disabled');
            loader.style.backgroundColor = '#fff'; // Set loader to light background
            if (darkModeButton) darkModeButton.innerHTML = '🌙'; // Switch to moon icon
        }
    } catch (e) {
        console.error("localStorage error:", e);
    }
}
