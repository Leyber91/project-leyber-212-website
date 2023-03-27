document.addEventListener('DOMContentLoaded', () => {
    // Add the Tryverse section
    const tryverseSection = document.createElement('section');
    tryverseSection.classList.add('tryverse');
    tryverseSection.innerHTML = `
        <h2>The Tryverse</h2>
        <p>Enter the Tryverse, where we explore alternative realities based on the events of the current timeline. Experience two unique dimensions: one where reality is even better than it is now, and another where everything takes a darker turn. Let's dive into these fascinating worlds and discover how small events can drastically change the course of history.</p>
    `;
    
    document.querySelector('main').appendChild(tryverseSection);
  
    // Add the particle effect code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
  
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }
  
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
  
        if (this.size > 0.2) this.size -= 0.1;
      }
  
      draw() {
        ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
  
    const particlesArray = [];
  
    const handleClick = (e) => {
      const posX = e.x;
      const posY = e.y;
      for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particle(posX, posY));
      }
    };
  
    canvas.addEventListener('mousemove', handleClick);
  
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((particle, index) => {
        particle.update();
        particle.draw();
  
        if (particle.size <= 0.2) {
          particlesArray.splice(index, 1);
        }
      });
      requestAnimationFrame(animate);
    };
  
    animate();
  });
  