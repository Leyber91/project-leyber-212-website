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
        mainHeader.textContent = 'Welcome to Project Leyber 212';
        mainText.textContent = 'Join us on this exciting journey as we explore the endless possibilities of the universe and the human spirit. Our mission is to inspire and empower our audience by sharing valuable insights and knowledge in diverse fields, from space science and fitness to data engineering and artificial intelligence. Together, we\'ll navigate this rapidly changing landscape and foster a community of forward-thinking individuals who embrace progress and seek to make a positive impact in the world.';
        setTimeout(() => typeWriter(mainHeader), 1000);
        setTimeout(() => typeWriter(mainText), 2000);
    }

    initTypewriter();
});

