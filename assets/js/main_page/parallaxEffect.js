export function addParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    function handleParallax() {
        const scrollTop = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax'));
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    window.addEventListener('scroll', handleParallax);
    window.addEventListener('resize', handleParallax);
    // Initialize parallax positions on load
    handleParallax();
}