/* animations.js */
document.addEventListener('DOMContentLoaded', function() {
    const mainHeader = document.querySelector('main h3');
    const mainText = document.querySelector('main p');
    const typingSpeed = 75;

    function typeWriter(element, index = 0) {
        if (index < element.textContent.length) {
            element.innerHTML += element.textContent[index];
            index++;
            setTimeout(() => typeWriter(element, index), typingSpeed);
        }
    }

    function initTypewriter() {
        mainHeader.textContent = '';
        mainText.textContent = '';

        setTimeout(() => typeWriter(mainHeader), 1000);
        setTimeout(() => typeWriter(mainText), 2000);
    }

    initTypewriter();
});

