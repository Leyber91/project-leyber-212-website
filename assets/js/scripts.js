document.addEventListener('DOMContentLoaded', () => {
    addWelcomeSection();
    addTryverseSection();
    addParallaxEffectToTitle();
    initializeGSAPAnimations();
    addSidebarBlockHoverEffects();
    addIntersectionObserver();
    addSidebarToggle();
    addTouchSwipeFunctionality();
    addRandomCrystalClipPath();

});

function addWelcomeSection() {
    const welcomeSection = document.createElement('section');
    welcomeSection.classList.add('welcome');
    welcomeSection.innerHTML = `
        <h2>Welcome to Project Leyber 212</h2>
        <p>Project Leyber 212 is a unique and inspiring platform that combines the power of data, artificial intelligence, and human potential to unlock new possibilities for personal growth and global progress. Our mission is to bring together diverse passions and interests, from space science and fitness to the world of data engineering and beyond, all while exploring the limitless potential of our ever-changing reality.</p>
        <p>As we journey through this exciting era of technological revolution, we strive to inspire and empower our audience by sharing valuable insights and knowledge, as well as by providing a glimpse into the fascinating world of alternative realities through our "tryverse" concept. We aim to make these complex subjects approachable, engaging, and visually captivating, to help you discover the incredible potential that lies within you and the world around you.</p>
        <p>Our commitment to staying at the forefront of AI advancements and embracing emerging tools and technologies will ensure that we continue to evolve and grow alongside our audience. Together, we'll navigate this rapidly changing landscape, fostering a community of forward-thinking individuals who embrace progress and seek to make a positive impact in the world.</p>
        <p>Join us on this exciting journey, and let's explore the endless possibilities of the universe and the human spirit. Welcome to Project Leyber 212.</p>
    `;
    document.querySelector('main').appendChild(welcomeSection);
}


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
const totalHeight = document.querySelector('main').offsetHeight - window.innerHeight;

const sections = document.querySelectorAll('main section');

window.addEventListener('scroll', function () {
    let scrollPosition = window.pageYOffset;
    let scrollRatio = scrollPosition / totalHeight;

    sections.forEach((section, index) => {
        section.style.transform = 'translateY(' + (scrollRatio * 0.2 * (index + 1) * totalHeight) + 'px)';
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
    const sections = document.querySelectorAll('main section:not(.tryverse)');
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('hidden');
          gsap.from(entry.target, { opacity: 0, y: '30px', duration: 1, ease: 'power2.out' });
        } else {
          gsap.to(entry.target, { opacity: 1, duration: 1, ease: 'power2.out' });
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
    const pointCount = 26; // Change this value to adjust the number of points in the polygon
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
function createBlackHoleEffect() {
    const canvas = document.getElementById("blackHole");
    const ctx = canvas.getContext("2d");
  
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  
    const particlesArray = [];
    const particlesCount = 200;
  
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }
  
      update() {
        const dx = canvas.width / 2 - this.x;
        const dy = canvas.height / 2 - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = Math.max(canvas.width, canvas.height);
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.size * 5;
        const directionY = forceDirectionY * force * this.size * 5;
  
        this.speedX += directionX;
        this.speedY += directionY;
  
        this.x += this.speedX;
        this.y += this.speedY;
      }
  
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        const opacity = Math.min(1, this.size / 3);
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(0, `rgba(58, 123, 213, ${opacity})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
  
    function init() {
      for (let i = 0; i < particlesCount; i++) {
        particlesArray.push(new Particle());
      }
    }
  
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
  
      requestAnimationFrame(animate);
    }
  
    init();
    animate();
  }
  

window.addEventListener('DOMContentLoaded', createBlackHoleEffect);
