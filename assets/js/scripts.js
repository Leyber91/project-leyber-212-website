document.addEventListener('DOMContentLoaded', () => {
    // Add the Tryverse section
    const tryverseSection = document.createElement('section');
    tryverseSection.classList.add('tryverse');
    tryverseSection.innerHTML = `
        <h2>The Tryverse</h2>
        <p>Enter the Tryverse, where we explore alternative realities based on the events of the current timeline. Experience two unique dimensions: one where reality is even better than it is now, and another where everything takes a darker turn. Let's dive into these fascinating worlds and discover how small events can drastically change the course of history.</p>
    `;
    
    document.querySelector('main').appendChild(tryverseSection);
  });

// GSAP Animations
const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.out' } });

// Logo and navigation links animation
tl.from('.logo, .nav-links li a', { opacity: 0, y: '-100%', stagger: 0.2 });

// Sidebar animation
tl.from('#sidebar', { x: '-100%', duration: 0.5 });

// Sidebar blocks animation
tl.from('.sidebar-block', { opacity: 0, y: '-50%', stagger: 0.2, duration: 0.5 });

// Main content animation
tl.from('main', { opacity: 0, x: '100%', duration: 0.5 });

// Hover effect on sidebar blocks
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
