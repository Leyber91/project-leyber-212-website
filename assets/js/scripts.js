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
// Add parallax effect to sections
const sections = document.querySelectorAll('main section');

window.addEventListener('scroll', function () {
    let scrollPosition = window.pageYOffset;
    sections.forEach((section, index) => {
        section.style.transform = 'translateY(' + (scrollPosition * 0.2 * (index + 1)) + 'px)';
    });
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
        block.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-block.active').forEach((activeBlock) => {
                activeBlock.classList.remove('active');
            });
            block.classList.add('active');
        });
    });
}

// Add TouchSwipe functionality to the sidebar
$(document).ready(function() {
    let sidebarIsOpen = false;
    const sidebar = $('#sidebar');

    sidebar.swipe({
        swipeStatus: function(event, phase, direction, distance, duration, fingerCount, fingerData, currentDirection) {
            if (phase === 'start') {
                sidebarIsOpen = parseInt(sidebar.css('left')) === 0;
            }

            if (phase === 'move' && (sidebarIsOpen && direction === 'left' || !sidebarIsOpen && direction === 'right')) {
                let newLeft = sidebarIsOpen ? Math.min(-distance, 0) : Math.max(-sidebar.outerWidth() + distance, -sidebar.outerWidth());
                sidebar.css('left', newLeft + 'px');
            }

            if (phase === 'end' || phase === 'cancel') {
                if (distance > sidebar.outerWidth() / 2) {
                    sidebarIsOpen = !sidebarIsOpen;
                }

                let targetLeft = sidebarIsOpen ? 0 : -sidebar.outerWidth();
                sidebar.animate({ left: targetLeft + 'px' }, 300);
            }
        },
        threshold: 0,
        fingers: 'all'
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // ...
    addIntersectionObserver();
});

function addIntersectionObserver() {
    const sections = document.querySelectorAll('main section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
                gsap.from(entry.target, { opacity: 0, y: '30px', duration: 1, ease: 'power2.out' });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach((section) => {
        section.classList.add('hidden');
        observer.observe(section);
    });
}

