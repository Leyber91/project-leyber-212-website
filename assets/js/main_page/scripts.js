// assets/js/main_page/scripts.js

document.addEventListener('DOMContentLoaded', () => {
    addWelcomeSection();
    addTryverseSection();
    addParallaxEffectToTitle();
    initializeGSAPAnimations();
    addSidebarBlockHoverEffects();
    addIntersectionObserver();
    addInteractiveSidebar(); // Updated Sidebar Function
    addTouchSwipeFunctionality();
    addRandomCrystalClipPath();
    createBlackHoleEffect();
    addStarfieldBackground();
    addGlitchEffect();
    addShootingStars();
    addAuroraEffect();
    initializeProjectCards();
    addSoundControls(); // Ensure this function is defined if you're using sound controls
    
});

/* Function to Add Welcome Section */
function addWelcomeSection() {
    const welcomeSection = document.createElement('section');
    welcomeSection.classList.add('welcome', 'hidden');
    welcomeSection.innerHTML = `
        <h2 class="glitch-text" data-text="Welcome to Project Leyber 212">Welcome to Project Leyber 212</h2>
        <p>Project Leyber 212 is a unique and inspiring platform that combines the power of data, artificial intelligence, and human potential to unlock new possibilities for personal growth and global progress. Our mission is to bring together diverse passions and interests, from space science and fitness to the world of data engineering and beyond, all while exploring the limitless potential of our ever-changing reality.</p>
        <p>As we journey through this exciting era of technological revolution, we strive to inspire and empower our audience by sharing valuable insights and knowledge, as well as by providing a glimpse into the fascinating world of alternative realities through our "tryverse" concept. We aim to make these complex subjects approachable, engaging, and visually captivating, to help you discover the incredible potential that lies within you and the world around you.</p>
        <p>Our commitment to staying at the forefront of AI advancements and embracing emerging tools and technologies will ensure that we continue to evolve and grow alongside our audience. Together, we'll navigate this rapidly changing landscape, fostering a community of forward-thinking individuals who embrace progress and seek to make a positive impact in the world.</p>
        <p>Join us on this exciting journey, and let's explore the endless possibilities of the universe and the human spirit. Welcome to Project Leyber 212.</p>
    `;
    document.querySelector('main').appendChild(welcomeSection);
}

/* Function to Add Tryverse Section */
function addTryverseSection() {
    const tryverseSection = document.createElement('section');
    tryverseSection.classList.add('tryverse', 'hidden');
    tryverseSection.innerHTML = `
        <h2 class="glitch-text" data-text="The Tryverse">The Tryverse</h2>
        <p>Enter the Tryverse, where we explore alternative realities based on the events of the current timeline. Experience two unique dimensions: one where reality is even better than it is now, and another where everything takes a darker turn. Let's dive into these fascinating worlds and discover how small events can drastically change the course of history.</p>
    `;
    document.querySelector('main').appendChild(tryverseSection);
}

/* Function to Add Parallax Effect to Title */
function addParallaxEffectToTitle() {
    const title = document.querySelector('.hero h1');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        gsap.to(title, {
            rotationY: x * 10,
            rotationX: -y * 10,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
}

/* Function to Initialize GSAP Animations */
function initializeGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });

    tl.from('.logo, #toggle-sidebar', { 
        opacity: 0, 
        y: '-50%', 
        stagger: 0.2,
        rotation: 360,
        scale: 0.5
    });
    tl.from('#sidebar', { 
        x: '-100%', 
        duration: 0.5,
        boxShadow: '0 0 0 rgba(0,0,0,0)'
    }, "-=0.5");
    tl.from('.sidebar-block', { 
        opacity: 0, 
        y: '-50%', 
        stagger: 0.2, 
        duration: 0.5,
        scale: 0.8,
        rotation: -15
    }, "-=0.3");
    tl.from('main', { 
        opacity: 0, 
        x: '100%', 
        duration: 0.5,
        scale: 0.9
    }, "-=0.5");
}

/* Function to Add Hover Effects to Sidebar Blocks */
function addSidebarBlockHoverEffects() {
    const sidebarBlocks = document.querySelectorAll('.sidebar-block');

    sidebarBlocks.forEach((block) => {
        block.addEventListener('mouseover', () => {
            gsap.to(block, { 
                scale: 1.05, 
                duration: 0.3, 
                ease: 'elastic.out(1, 0.3)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                backgroundColor: 'rgba(255,255,255,0.1)'
            });
        });

        block.addEventListener('mouseout', () => {
            gsap.to(block, { 
                scale: 1, 
                duration: 0.3, 
                ease: 'elastic.out(1, 0.3)',
                boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
                backgroundColor: 'rgba(255,255,255,0)'
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

/* Function to Add Touch Swipe Functionality */
function addTouchSwipeFunctionality() {
    const sidebar = document.getElementById('sidebar');
    let sidebarIsOpen = false;

    // Ensure jQuery is loaded before using it
    if (typeof $ !== 'undefined') {
        $(document).swipe({
            swipeLeft: function(event, direction, distance, duration, fingerCount) {
                if (sidebarIsOpen) {
                    toggleSidebar();
                }
            },
            swipeRight: function(event, direction, distance, duration, fingerCount) {
                if (!sidebarIsOpen) {
                    toggleSidebar();
                }
            },
            threshold: 75
        });
    } else {
        console.warn('jQuery is not loaded. TouchSwipe functionality will not work.');
    }

    function toggleSidebar() {
        sidebarIsOpen = !sidebarIsOpen;
        const toggleButton = document.getElementById('toggle-sidebar');
        sidebar.classList.toggle('open');
        toggleButton.setAttribute('aria-expanded', sidebarIsOpen);

        if (sidebarIsOpen) {
            gsap.to(sidebar, { 
                left: '0%', 
                duration: 0.5, 
                ease: 'elastic.out(1, 0.7)',
                boxShadow: '10px 0 20px rgba(0,0,0,0.2)'
            });
        } else {
            gsap.to(sidebar, { 
                left: '-250px', 
                duration: 0.5, 
                ease: 'power3.in',
                boxShadow: '0 0 0 rgba(0,0,0,0)'
            });
        }
    }
}

/* Function to Add Intersection Observer for Sections */
function addIntersectionObserver() {
    const sections = document.querySelectorAll('main section:not(.tryverse), .projects');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('hidden');
          gsap.from(entry.target, { 
            opacity: 0, 
            y: '50px', 
            scale: 0.95, 
            duration: 1, 
            ease: 'power3.out',
            stagger: 0.2
          });
        }
      });
    }, { threshold: 0.2 });

    sections.forEach((section) => {
      observer.observe(section);
    });
}

/* Function to Add Random Crystal Clip Path */
function addRandomCrystalClipPath() {
    const main = document.querySelector('main');
    const svgNS = "http://www.w3.org/2000/svg";
    const clipPath = document.createElementNS(svgNS, 'clipPath');
    clipPath.setAttribute('id', 'crystal-clip');
    main.appendChild(clipPath);

    const polygon = document.createElementNS(svgNS, 'polygon');
    polygon.setAttribute('points', generateRandomPoints(8).join(' '));
    clipPath.appendChild(polygon);

    gsap.to(polygon, {
        duration: 10,
        attr: { points: generateRandomPoints(8).join(' ') },
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    main.style.clipPath = 'url(#crystal-clip)';
}

/* Helper Function to Generate Random Points for Polygon */
function generateRandomPoints(count) {
    const points = [];
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 0.4 + Math.random() * 0.2;
        const x = 50 + Math.cos(angle) * radius * 100;
        const y = 50 + Math.sin(angle) * radius * 100;
        points.push(`${x},${y}`);
    }
    return points;
}

/* Function to Create Black Hole Effect on Canvas */
function createBlackHoleEffect() {
    const canvas = document.getElementById("blackHole");
    const ctx = canvas.getContext("2d");
  
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  
    const particlesArray = [];
    const particlesCount = 500;
  
    class Particle {
      constructor() {
        this.reset();
      }
  
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
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
        const directionX = forceDirectionX * force * this.size * 0.05;
        const directionY = forceDirectionY * force * this.size * 0.05;
  
        this.speedX += directionX;
        this.speedY += directionY;
  
        this.x += this.speedX;
        this.y += this.speedY;
  
        if (distance < 50) {
            this.size -= 0.1;
        }
  
        if (this.size <= 0) {
            this.reset();
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
  
      particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
      });
  
      requestAnimationFrame(animate);
    }
  
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
  
    init();
    animate();
}

/* Function to Add Starfield Background */
function addStarfieldBackground() {
    const starfield = document.querySelector('.starfield');

    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = `${Math.random() * 2 + 1}px`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starfield.appendChild(star);
    }
}

/* Function to Add Glitch Effect to Text */
function addGlitchEffect() {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    glitchTexts.forEach(text => {
        const content = text.textContent;
        text.setAttribute('data-text', content);
        
        text.addEventListener('mouseover', () => {
            text.classList.add('glitch');
            setTimeout(() => {
                text.classList.remove('glitch');
            }, 1000);
        });
    });
}

/* Optional: Function to Add Shooting Stars */
function addShootingStars() {
    setInterval(() => {
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        shootingStar.style.top = `${Math.random() * 50}%`;
        shootingStar.style.left = `-100px`;
        shootingStar.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        document.querySelector('.shooting-stars-container').appendChild(shootingStar);
        
        shootingStar.addEventListener('animationend', () => {
            shootingStar.remove();
        });
    }, 3000); // Every 3 seconds
}

/* Function to Add Aurora Effect */
function addAuroraEffect() {
    const aurora = document.querySelector('.aurora-overlay');
    gsap.to(aurora, {
        backgroundPosition: '100% 50%',
        ease: 'linear',
        duration: 10,
        repeat: -1,
        yoyo: true
    });
}

/* Function to Initialize Project Cards */
function initializeProjectCards() {
    // Dynamically add the Projects Section
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
                        <li>GSAP</li>
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
                        <li>Python</li>
                        <li>Django</li>
                        <li>TensorFlow</li>
                    </ul>
                    <h4>Impact</h4>
                    <p>Details about the impact of Project Beta.</p>
                </div>
            </div>
            <!-- Add more project cards as needed -->
        </div>
    `;
    main.appendChild(projectsSection);

    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        // Initial state
        gsap.set(card, { opacity: 0, y: 50 });

        // Scroll-triggered animation
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Hover animations
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });
}

/* Function to Initialize Interactive Sidebar */
function addInteractiveSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-sidebar');

    toggleButton.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('open');
        toggleButton.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
            gsap.to(sidebar, { 
                duration: 0.5, 
                ease: 'power2.out',
                left: '0%', 
                boxShadow: '10px 0 20px rgba(0,0,0,0.2)'
            });
        } else {
            gsap.to(sidebar, { 
                duration: 0.5, 
                ease: 'power2.in',
                left: '-250px', 
                boxShadow: '0 0 0 rgba(0,0,0,0)'
            });
        }
    });

    // Handle Sidebar Block Selection with Zoom-Out/Warp Effect
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            // Warp out animation
            gsap.to('main', { 
                scale: 0.9, 
                duration: 0.5, 
                ease: 'power2.in',
                onComplete: () => {
                    window.location.href = href;
                }
            });

            // Close the sidebar after clicking a link
            sidebar.classList.remove('open');
            gsap.to(sidebar, { 
                duration: 0.5, 
                ease: 'power2.in',
                left: '-250px', 
                boxShadow: '0 0 0 rgba(0,0,0,0)'
            });
            toggleButton.setAttribute('aria-expanded', false);
        });
    });
}

/* Function to Add Sound Controls (Optional) */
function addSoundControls() {
    const music = document.getElementById('background-music');
    const toggleMusicBtn = document.getElementById('toggle-music');

    // Auto-play music on load (may require user interaction due to browser policies)
    // Uncomment the lines below if you want to attempt autoplay
    /*
    music.play().then(() => {
        toggleMusicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(error => {
        console.log('Music playback failed:', error);
    });
    */

    toggleMusicBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play().then(() => {
                toggleMusicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                console.log('Music playback failed:', error);
            });
        } else {
            music.pause();
            toggleMusicBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}




