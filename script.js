// ===== Confetti System =====
class ConfettiSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    createParticle(x, y) {
        const colors = ['#f0c27f', '#fc5c7d', '#c77dff', '#7b8cde', '#e8a0bf', '#ffd700', '#ff6b6b', '#48dbfb'];
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -20,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 4 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            opacity: 1,
            gravity: 0.12,
            drag: 0.98,
            wobble: Math.random() * 10,
            wobbleSpeed: Math.random() * 0.1 + 0.05
        };
    }
    burst(x, y, count = 80) {
        for (let i = 0; i < count; i++) {
            const p = this.createParticle(x, y);
            p.vx = (Math.random() - 0.5) * 18;
            p.vy = Math.random() * -16 - 4;
            this.particles.push(p);
        }
        if (!this.running) this.animate();
    }
    rain(duration = 4000) {
        const end = Date.now() + duration;
        const interval = setInterval(() => {
            if (Date.now() > end) { clearInterval(interval); return; }
            for (let i = 0; i < 5; i++) this.particles.push(this.createParticle());
        }, 50);
        if (!this.running) this.animate();
    }
    animate() {
        this.running = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach((p, i) => {
            p.vy += p.gravity;
            p.vx *= p.drag;
            p.x += p.vx + Math.sin(p.wobble) * 0.5;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.wobble += p.wobbleSpeed;
            if (p.y > this.canvas.height + 20) p.opacity -= 0.05;
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            this.ctx.restore();
        });
        this.particles = this.particles.filter(p => p.opacity > 0);
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.running = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// ===== Floating Background Elements =====
function createFloatingElements() {
    const container = document.getElementById('floatingElements');
    if (!container) return;
    const emojis = ['🎓', '⭐', '✨', '🌟', '💫', '🎉', '💖', '🎊', '🏆'];
    for (let i = 0; i < 20; i++) {
        const el = document.createElement('div');
        el.className = 'floating-el';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.setProperty('--duration', (Math.random() * 15 + 15) + 's');
        el.style.setProperty('--delay', (Math.random() * 20) + 's');
        el.style.setProperty('--opacity', (Math.random() * 0.15 + 0.05));
        el.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
        container.appendChild(el);
    }
}

// ===== Hero Particles =====
function createHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
        particle.style.setProperty('--delay', (Math.random() * 5) + 's');
        particle.style.width = (Math.random() * 4 + 1) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ===== Finale Hearts =====
function createFinaleHearts() {
    const container = document.getElementById('finaleHearts');
    if (!container) return;
    const hearts = ['💖', '💕', '💗', '💝', '✨', '🌟'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'finale-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        heart.style.setProperty('--duration', (Math.random() * 8 + 6) + 's');
        heart.style.setProperty('--delay', (Math.random() * 10) + 's');
        container.appendChild(heart);
    }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.timeline-item, .wish-item').forEach(el => {
        observer.observe(el);
    });
}

// ===== Reason Cards Flip =====
function initReasonCards() {
    document.querySelectorAll('.reason-card').forEach(card => {
        const reason = card.getAttribute('data-reason');
        const backP = card.querySelector('.reason-back p');
        if (backP) backP.textContent = reason;

        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

// ===== Letter Interaction =====
function initLetter() {
    const readBtn = document.getElementById('readLetterBtn');
    const envelope = document.getElementById('letterEnvelope');
    const paper = document.getElementById('letterPaper');
    const closeBtn = document.getElementById('letterClose');

    if (readBtn) {
        readBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            envelope.style.display = 'none';
            paper.classList.remove('hidden');
            paper.classList.add('show');
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            paper.classList.remove('show');
            paper.classList.add('hidden');
            envelope.style.display = 'inline-block';
        });
    }
}

// ===== Typewriter Effect =====
function typeWriter(element, text, speed = 40) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// ===== Main Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    const confetti = new ConfettiSystem(document.getElementById('confettiCanvas'));
    const preloader = document.getElementById('preloader');
    const openBtn = document.getElementById('openBtn');
    const giftLid = document.getElementById('giftLid');
    const mainContent = document.getElementById('mainContent');
    const celebrateBtn = document.getElementById('celebrateBtn');

    // Preloader open
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            giftLid.classList.add('open');
            
            setTimeout(() => {
                // Start confetti rain
                confetti.rain(5000);
                
                // Fade out preloader
                preloader.classList.add('fade-out');
                
                // Show main content
                mainContent.classList.remove('hidden');
                mainContent.style.opacity = '1';
                mainContent.style.pointerEvents = 'auto';
                
                // Initialize everything
                createFloatingElements();
                createHeroParticles();
                createFinaleHearts();
                initScrollAnimations();
                initReasonCards();
                initLetter();
                
            }, 700);
        });
    }

    // Celebrate button
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', () => {
            const rect = celebrateBtn.getBoundingClientRect();
            confetti.burst(rect.left + rect.width / 2, rect.top, 120);
            
            // Multiple bursts
            setTimeout(() => confetti.burst(window.innerWidth * 0.25, window.innerHeight * 0.3, 60), 300);
            setTimeout(() => confetti.burst(window.innerWidth * 0.75, window.innerHeight * 0.3, 60), 600);
            setTimeout(() => confetti.rain(3000), 800);
        });
    }

    // ===== HTML5 Audio Music Player =====
    const musicToggle = document.getElementById('musicToggle');
    let musicPlaying = false;
    
    // Create audio element
    const audioPlayer = new Audio('music.m4a');
    audioPlayer.loop = true;
    audioPlayer.volume = 1.0;

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (musicPlaying) {
                audioPlayer.pause();
                musicToggle.classList.remove('playing');
                musicPlaying = false;
            } else {
                // Play and catch any mobile autoplay restrictions
                const playPromise = audioPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        musicToggle.classList.add('playing');
                        musicPlaying = true;
                    }).catch(error => {
                        console.error("Audio playback failed:", error);
                        // Flash red if playback failed
                        musicToggle.style.borderColor = 'red';
                        setTimeout(() => musicToggle.style.borderColor = 'rgba(255, 255, 255, 0.15)', 500);
                    });
                }
            }
        });
    }
});
