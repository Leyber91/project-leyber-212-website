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
    
    const countdown = document.querySelector('.countdown');
    const launchDate = new Date('Jan 1, 2024 00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdown.innerHTML = `
            <div>${days}<span>Days</span></div>
            <div>${hours}<span>Hours</span></div>
            <div>${minutes}<span>Minutes</span></div>
            <div>${seconds}<span>Seconds</span></div>
        `;
    }

    setInterval(updateCountdown, 1000);
});
