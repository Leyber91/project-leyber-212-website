document.addEventListener('DOMContentLoaded', () => {
    addTryverseSection();
    addParallaxEffectToTitle();
    initializeGSAPAnimations();
    addSidebarBlockHoverEffects();
});

function addTryverseSection() {
    const tryverseSection = document.createElement('section');
    tryverseSection.classList.add('tryverse');
    tryverseSection.innerHTML = `
        <h2>The Tryverse</h2>
        <p>Enter the Tryverse, where we explore alternative realities based on the events of the current timeline. Experience two unique dimensions: one where reality is even better than it is now, and another where everything takes a darker turn. Let's dive into these fascinating worlds and discover how small events can drastically change the course of history.</p>
    `;
    document.querySelector('main').appendChild(tryverseSection);
}

function addParallaxEffectToTitle() {
    const title = document.querySelector('.title');

    window.addEventListener('scroll', function () {
        let scrollPosition = window.pageYOffset;
        title.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
    });
}

function initializeGSAPAnimations() {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.out' } });

    tl.from('.logo, .nav-links li a', { opacity: 0, y: '-100%', stagger: 0.2 });
    tl.from('#sidebar', { x: '-100%', duration: 0.5 });
    tl.from('.sidebar-block', { opacity: 0, y: '-50%', stagger: 0.2, duration: 0.5 });
    tl.from('main', { opacity: 0, x: '100%', duration: 0.5 });
}

function addSidebarBlockHoverEffects() {
    const sidebarBlocks = document.querySelectorAll('.sidebar-block');

    sidebarBlocks.forEach((block) => {
        block.addEventListener('mouseover', () => {
            gsap.to(block, { scale: 1.1, duration: 0.3, ease: 'power2.out' });
            gsap.to(block.nextElementSibling, { scale: 0.9, duration: 0.3, ease: 'power2.out' });
        });

        block.addEventListener('mouseout', () => {
            gsap.to(block, { scale: 1, duration: 0.3, ease: 'power2.out' });
            gsap.to(block.nextElementSibling, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });
}
