
const themeToggle = document.getElementById('themeToggle');
const disabilityToggle = document.getElementById('disability');

let isVisuallyImpaired = false;
let isDarkTheme = false;
//let form = null;
function updateTheme() {
    let themeHref;

    if (isVisuallyImpaired) {
        themeHref = isDarkTheme ? 'ultra_dark.css' : 'ultra_light.css';
    } else {
        themeHref = isDarkTheme ? 'dark.css' : '';
    }

    let themeStyle = document.getElementById('theme-style');
    if (themeStyle) {
        themeStyle.remove();
    }

    if (themeHref) {
        themeStyle = document.createElement('link');
        themeStyle.id = 'theme-style';
        themeStyle.rel = 'stylesheet';
        themeStyle.type = 'text/css';
        themeStyle.href = themeHref;
        document.head.appendChild(themeStyle);
    }
}

themeToggle.addEventListener('click', function() {
    isDarkTheme = !isDarkTheme;
    updateTheme();
});

disabilityToggle.addEventListener('click', function() {
    isVisuallyImpaired = !isVisuallyImpaired;
    updateTheme();
});

