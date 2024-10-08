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
    createBlackHoleEffect();
    addStarfieldBackground();
    addGlitchEffect();
});

function addWelcomeSection() {
    const welcomeSection = document.createElement('section');
    welcomeSection.classList.add('welcome');
    welcomeSection.innerHTML = `
        <h2 class="glitch-text">Welcome to Project Leyber 212</h2>
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
        <h2 class="glitch-text">The Tryverse</h2>
        <p>Enter the Tryverse, where we explore alternative realities based on the events of the current timeline. Experience two unique dimensions: one where reality is even better than it is now, and another where everything takes a darker turn. Let's dive into these fascinating worlds and discover how small events can drastically change the course of history.</p>
    `;
    document.querySelector('main').appendChild(tryverseSection);
}

function addParallaxEffectToTitle() {
    const totalHeight = document.querySelector('main').offsetHeight - window.innerHeight;
    const sections = document.querySelectorAll('main section');

    window.addEventListener('scroll', function () {
        let scrollPosition = window.pageYOffset;
        let scrollRatio = scrollPosition / totalHeight;

        sections.forEach((section, index) => {
            const parallaxFactor = 0.3 * (index + 1);
            const yOffset = scrollRatio * parallaxFactor * totalHeight;
            const rotationFactor = 5 * Math.sin(scrollRatio * Math.PI);
            
            gsap.to(section, {
                y: yOffset,
                rotation: rotationFactor,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

function initializeGSAPAnimations() {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });

    tl.from('.logo, .nav-links li a', { 
        opacity: 0, 
        y: '-100%', 
        stagger: 0.2,
        rotation: 360,
        scale: 0.5
    });
    tl.from('#sidebar', { 
        x: '-100%', 
        duration: 0.5,
        boxShadow: '0 0 0 rgba(0,0,0,0)'
    });
    tl.from('.sidebar-block', { 
        opacity: 0, 
        y: '-50%', 
        stagger: 0.2, 
        duration: 0.5,
        scale: 0.8,
        rotation: -15
    });
    tl.from('main', { 
        opacity: 0, 
        x: '100%', 
        duration: 0.5,
        scale: 0.9
    });
}

function addSidebarBlockHoverEffects() {
    const sidebarBlocks = document.querySelectorAll('.sidebar-block');

    sidebarBlocks.forEach((block) => {
        block.addEventListener('mouseover', () => {
            gsap.to(block, { 
                scale: 1.1, 
                duration: 0.3, 
                ease: 'elastic.out(1, 0.3)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                backgroundColor: 'rgba(255,255,255,0.1)'
            });
            gsap.to(block.nextElementSibling, { 
                scale: 0.9, 
                duration: 0.3, 
                ease: 'power2.out',
                opacity: 0.7
            });
        });

        block.addEventListener('mouseout', () => {
            gsap.to(block, { 
                scale: 1, 
                duration: 0.3, 
                ease: 'elastic.out(1, 0.3)',
                boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(255,255,255,0)'
            });
            gsap.to(block.nextElementSibling, { 
                scale: 1, 
                duration: 0.3, 
                ease: 'power2.out',
                opacity: 1
            });
        });
        
        block.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-block.active').forEach((activeBlock) => {
                activeBlock.classList.remove('active');
            });
            block.classList.add('active');
            gsap.to(block, {
                backgroundColor: 'rgba(255,255,255,0.2)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

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
            gsap.to(sidebar, { 
                left: `${newLeft}px`, 
                duration: 0.1, 
                ease: 'power2.out' 
            });
        }
    });

    sidebar.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const distance = touchStartX - touchEndX;

        if (Math.abs(distance) > sidebar.clientWidth / 2) {
            sidebarIsOpen = !sidebarIsOpen;
        }

        const targetLeft = sidebarIsOpen ? 0 : -sidebar.clientWidth;
        gsap.to(sidebar, { 
            left: `${targetLeft}px`, 
            duration: 0.5, 
            ease: 'elastic.out(1, 0.7)' 
        });
    });
}

function addIntersectionObserver() {
    const sections = document.querySelectorAll('main section:not(.tryverse)');
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('hidden');
          gsap.from(entry.target, { 
            opacity: 0, 
            y: '50px', 
            scale: 0.9, 
            duration: 1, 
            ease: 'power3.out',
            rotation: 5,
            stagger: 0.2
          });
        } else {
          gsap.to(entry.target, { 
            opacity: 1, 
            duration: 1, 
            ease: 'power2.out' 
          });
        }
      });
    }, { threshold: 0.2 });
  
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
            gsap.to(sidebar, { 
                x: '0%', 
                duration: 0.5, 
                ease: 'elastic.out(1, 0.7)',
                boxShadow: '10px 0 20px rgba(0,0,0,0.2)'
            });
        } else {
            gsap.to(sidebar, { 
                x: '-100%', 
                duration: 0.5, 
                ease: 'power3.in',
                boxShadow: '0 0 0 rgba(0,0,0,0)'
            });
        }
    });
}

function addRandomCrystalClipPath() {
    const clipPath = document.getElementById('crystal-clip');
    const points = generateRandomPoints(8);
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points.join(' '));
    clipPath.appendChild(polygon);

    gsap.to(polygon, {
        duration: 10,
        attr: { points: generateRandomPoints(8).join(' ') },
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

function generateRandomPoints(count) {
    const points = [];
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 0.4 + Math.random() * 0.2;
        const x = 0.5 + Math.cos(angle) * radius;
        const y = 0.5 + Math.sin(angle) * radius;
        points.push(`${x},${y}`);
    }
    return points;
}

function createBlackHoleEffect() {
    const canvas = document.getElementById("blackHole");
    const ctx = canvas.getContext("2d");
  
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  
    const particlesArray = [];
    const particlesCount = 500;
  
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
      }
  
      update() {
        const dx = canvas.width / 2 - this.x;
        const dy = canvas.height / 2 - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = Math.max(canvas.width, canvas.height);
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.size * 10;
        const directionY = forceDirectionY * force * this.size * 10;
  
        this.speedX += directionX;
        this.speedY += directionY;
  
        this.x += this.speedX;
        this.y += this.speedY;

        if (distance < 5) {
            this.size -= 0.1;
        }

        if (this.size <= 0) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
        }
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
        gradient.addColorStop(0, `${this.color}`);
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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
  
      requestAnimationFrame(animate);
    }
  
    init();
    animate();
}

function addStarfieldBackground() {
    const starfield = document.createElement('div');
    starfield.classList.add('starfield');
    document.body.insertBefore(starfield, document.body.firstChild);

    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starfield.appendChild(star);
    }
}

function addGlitchEffect() {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    glitchTexts.forEach(text => {
        const content = text.textContent;
        text.innerHTML = `
            <span aria-hidden="true">${content}</span>
            ${content}
            <span aria-hidden="true">${content}</span>
        `;
        
        text.addEventListener('mouseover', () => {
            text.classList.add('glitch');
            setTimeout(() => {
                text.classList.remove('glitch');
            }, 1000);
        });
    });
}

window.addEventListener('DOMContentLoaded', createBlackHoleEffect);
