document.addEventListener('DOMContentLoaded', () => {
    addTryverseSection();
    addParallaxEffectToTitle();
    initializeGSAPAnimations();
    addSidebarBlockHoverEffects();
    addIntersectionObserver();
    addSidebarToggle();
    createRandomCrystalClip();
    createRandomCrystalClips();
    addTouchSwipeFunctionality();
    addRandomCrystalClipPath();
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
function addTouchSwipeFunctionality() {
    const sidebar = document.getElementById('sidebar');
    let sidebarIsOpen = false;
    let touchStartX = 0;

    sidebar.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        sidebarIsOpen = parseInt(getComputedStyle(sidebar).left) === 0;
    });

    sidebar.addEventListener('touchmove', (event) => {
        const touchCurrentX = event.touches[0].clientX;
        const distance = touchStartX - touchCurrentX;

        if ((sidebarIsOpen && distance > 0) || (!sidebarIsOpen && distance < 0)) {
            const newLeft = sidebarIsOpen ? Math.min(-distance, 0) : Math.max(-sidebar.clientWidth + distance, -sidebar.clientWidth);
            sidebar.style.left = `${newLeft}px`;
        }
    });

    sidebar.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const distance = touchStartX - touchEndX;

        if (Math.abs(distance) > sidebar.clientWidth / 2) {
            sidebarIsOpen = !sidebarIsOpen;
        }

        const targetLeft = sidebarIsOpen ? 0 : -sidebar.clientWidth;
        sidebar.style.left = `${targetLeft}px`;
    });
}


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

function addSidebarToggle() {
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (sidebar.classList.contains('open')) {
            gsap.to(sidebar, { x: '0%', duration: 0.5, ease: 'power2.out' });
        } else {
            gsap.to(sidebar, { x: '-100%', duration: 0.5, ease: 'power2.out' });
        }
    });
}

function createRandomCrystalClip() {
    const clipPath = document.getElementById('crystal-clip');
    const pointCount = 6; // Change this value to adjust the number of points in the polygon
    const points = [];

    for (let i = 0; i < pointCount; i++) {
        const x = Math.random();
        const y = Math.random();
        points.push(`${x},${y}`);
    }

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points.join(' '));
    clipPath.appendChild(polygon);
}

function createRandomCrystalClips() {
    const clipPaths = document.querySelectorAll('#sidebar .sidebar-background defs clipPath');
    const pointCount = 6;

    clipPaths.forEach((clipPath, index) => {
        const points = [];

        for (let i = 0; i < pointCount; i++) {
            const x = Math.random();
            const y = Math.random();
            points.push(`${x},${y}`);
        }

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points.join(' '));
        clipPath.appendChild(polygon);
    });
}

function addRandomCrystalClipPath() {
    const clipPath = document.getElementById('crystal-clip');
    const points = getRandomPoints();
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points);
    clipPath.appendChild(polygon);
}

function getRandomPoints() {
    const startPoint = '0,0';
    const endPoint = '1,1';
    const pointCount = 4;
    const randomPoints = [];

    for (let i = 0; i < pointCount; i++) {
        const x = Math.random();
        const y = Math.random() * 0.2;
        randomPoints.push(`${x},${y}`);
    }

    randomPoints.sort((a, b) => parseFloat(a.split(',')[0]) - parseFloat(b.split(',')[0]));

    return [startPoint, ...randomPoints, endPoint].join(' ');
}