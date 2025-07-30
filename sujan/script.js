// Animated storm background
const canvas = document.getElementById('stormCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Enhanced particle system with more dynamic movement
const particles = [];
let mouseX = 0;
let mouseY = 0;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
    }
    
    update() {
        this.x += this.vx + Math.sin(this.pulse) * 0.5;
        this.y += this.vy + Math.cos(this.pulse) * 0.5;
        this.pulse += this.pulseSpeed;
        
        // Magnetic attraction to mouse
        if (mouseX && mouseY) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                this.vx += dx * 0.0001;
                this.vy += dy * 0.0001;
            }
        }
        
        // Boundary bounce with energy
        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -0.8;
            this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -0.8;
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    
    draw() {
        const dynamicOpacity = Math.max(0, Math.min(1, this.opacity + Math.sin(this.pulse) * 0.2));
        const dynamicSize = Math.max(0.5, this.size + Math.sin(this.pulse * 2) * 0.5);
        
        // Glowing effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, dynamicSize * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, dynamicSize * 2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${dynamicOpacity * 0.1})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, dynamicSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dynamicOpacity})`;
        ctx.fill();
    }
}

// Create more particles for richer effect
for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
}

// Mouse interaction
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Enhanced connections with energy flow
    particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const connectionStrength = 1 - distance / 120;
                const time = Date.now() * 0.001;
                const flow = Math.sin(time + distance * 0.01) * 0.5 + 0.5;
                
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                
                const gradient = ctx.createLinearGradient(
                    particle.x, particle.y, 
                    otherParticle.x, otherParticle.y
                );
                gradient.addColorStop(0, `rgba(121, 134, 203, ${connectionStrength * flow * 0.3})`);
                gradient.addColorStop(0.5, `rgba(255, 255, 255, ${connectionStrength * 0.2})`);
                gradient.addColorStop(1, `rgba(121, 134, 203, ${connectionStrength * flow * 0.3})`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = connectionStrength * 2;
                ctx.stroke();
            }
        });
    });
    
    // Lightning bolt effect occasionally
    if (Math.random() < 0.001) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, 0);
        for (let i = 0; i < 8; i++) {
            ctx.lineTo(
                Math.random() * canvas.width + (Math.random() - 0.5) * 100,
                (i / 8) * canvas.height + Math.random() * 50
            );
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.2})`;
        ctx.lineWidth = Math.random() * 2 + 1;
        ctx.stroke();
    }
    
    requestAnimationFrame(animate);
}

animate();

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});