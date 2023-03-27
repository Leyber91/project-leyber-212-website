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

    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function updateActiveNavLink() {
        navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            const section = document.getElementById(href);
            if (isInViewport(section)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    const logo = document.querySelector('header h1');
    logo.addEventListener('mouseenter', () => {
        logo.classList.add('animate__animated', 'animate__bounce');
    });

    logo.addEventListener('animationend', () => {
        logo.classList.remove('animate__animated', 'animate__bounce');
    });

    const introSection = document.querySelector('#intro');
    const introButton = introSection.querySelector('button');
    introButton.addEventListener('click', () => {
        introSection.classList.add('animate__animated', 'animate__zoomOutUp');
    });

    introSection.addEventListener('animationend', () => {
        introSection.style.display = 'none';
    });
});
