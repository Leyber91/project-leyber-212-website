import { customAnimate, customScrollTrigger } from './gsapAnimations.js';

export function initializeProjectCards() {
    const main = document.querySelector('main');
    const projectsSection = document.createElement('section');
    projectsSection.classList.add('projects', 'hidden');
    projectsSection.innerHTML = `
        <h2 class="glitch-text" data-text="Our Projects">Our Projects</h2>
        <div class="project-cards-container">
            <!-- Example Project Card -->
            <div class="project-card">
                <div class="card-front">
                    <h3>Project Alpha</h3>
                    <p>Overview of Project Alpha.</p>
                </div>
                <div class="card-back">
                    <h4>Technologies Used</h4>
                    <ul>
                        <li>JavaScript</li>
                        <li>Three.js</li>
                        <li>Custom Animations</li>
                    </ul>
                    <h4>Impact</h4>
                    <p>Details about the impact of Project Alpha.</p>
                </div>
            </div>
            <!-- Add more project cards as needed -->
            <div class="project-card">
                <div class="card-front">
                    <h3>Project Beta</h3>
                    <p>Overview of Project Beta.</p>
                </div>
                <div class="card-back">
                    <h4>Technologies Used</h4>
                    <ul>
                        <li>HTML</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                    </ul>
                    <h4>Impact</h4>
                    <p>Details about the impact of Project Beta.</p>
                </div>
            </div>
        </div>
    `;
    main.appendChild(projectsSection);

    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        // Initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';

        // Scroll-triggered animation
        customScrollTrigger.create({
            trigger: card,
            onEnter: () => {
                customAnimate.from(card, {
                    duration: 1,
                    y: '50px',
                    opacity: '0',
                    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' // power3-out-like easing
                });
            },
            threshold: 0.2,
            once: true
        });

        // Hover animations using CSS transitions
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
}