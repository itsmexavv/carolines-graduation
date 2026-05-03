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
            x: x || Math.random() * this.canvas.width, y: y || -20,
            w: Math.random() * 10 + 5, h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 8, vy: Math.random() * 4 + 2,
            rotation: Math.random() * 360, rotationSpeed: (Math.random() - 0.5) * 12,
            opacity: 1, gravity: 0.12, drag: 0.98,
            wobble: Math.random() * 10, wobbleSpeed: Math.random() * 0.1 + 0.05
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
        this.particles.forEach(p => {
            p.vy += p.gravity; p.vx *= p.drag;
            p.x += p.vx + Math.sin(p.wobble) * 0.5; p.y += p.vy;
            p.rotation += p.rotationSpeed; p.wobble += p.wobbleSpeed;
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

// ===== Fireworks System =====
class FireworksSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.rockets = [];
        this.running = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
    launch(count = 5) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.rockets.push({
                    x: Math.random() * this.canvas.width * 0.8 + this.canvas.width * 0.1,
                    y: this.canvas.height,
                    targetY: Math.random() * this.canvas.height * 0.4 + 50,
                    speed: 6 + Math.random() * 4,
                    color: `hsl(${Math.random() * 360}, 80%, 60%)`
                });
            }, i * 400);
        }
        if (!this.running) this.animate();
    }
    explode(x, y, color) {
        const count = 60 + Math.floor(Math.random() * 40);
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 4;
            this.particles.push({
                x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                life: 1, decay: 0.01 + Math.random() * 0.015,
                color, size: 2 + Math.random() * 2
            });
        }
    }
    animate() {
        this.running = true;
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0,0,0,0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'lighter';
        this.rockets.forEach((r, i) => {
            r.y -= r.speed;
            this.ctx.beginPath();
            this.ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = r.color;
            this.ctx.fill();
            if (r.y <= r.targetY) { this.explode(r.x, r.y, r.color); this.rockets.splice(i, 1); }
        });
        this.particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= p.decay;
            this.ctx.globalAlpha = Math.max(0, p.life);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        this.particles = this.particles.filter(p => p.life > 0);
        if (this.particles.length > 0 || this.rockets.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.running = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// ===== Shooting Stars =====
function createShootingStars() {
    const container = document.getElementById('shootingStars');
    if (!container) return;
    function addStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.top = Math.random() * 50 + '%';
        star.style.left = Math.random() * 60 + '%';
        star.style.setProperty('--dur', (1 + Math.random() * 1.5) + 's');
        container.appendChild(star);
        setTimeout(() => star.remove(), 3000);
    }
    setInterval(addStar, 3000 + Math.random() * 4000);
    addStar();
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
        const p = document.createElement('div');
        p.className = 'hero-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
        p.style.setProperty('--delay', (Math.random() * 5) + 's');
        const size = (Math.random() * 4 + 1) + 'px';
        p.style.width = size; p.style.height = size;
        container.appendChild(p);
    }
}

// ===== Finale Hearts =====
function createFinaleHearts() {
    const container = document.getElementById('finaleHearts');
    if (!container) return;
    const hearts = ['💖', '💕', '💗', '💝', '✨', '🌟'];
    for (let i = 0; i < 15; i++) {
        const h = document.createElement('div');
        h.className = 'finale-heart';
        h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        h.style.left = Math.random() * 100 + '%';
        h.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        h.style.setProperty('--duration', (Math.random() * 8 + 6) + 's');
        h.style.setProperty('--delay', (Math.random() * 10) + 's');
        container.appendChild(h);
    }
}

// ===== Countdown Timer =====
// *** CHANGE THIS DATE to your actual anniversary/start date ***
const COUNTDOWN_START = new Date('2024-01-01T00:00:00');

function initCountdown() {
    function update() {
        const now = new Date();
        const diff = now - COUNTDOWN_START;
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        const el = (id) => document.getElementById(id);
        if (el('countDays')) el('countDays').textContent = days;
        if (el('countHours')) el('countHours').textContent = String(hours).padStart(2, '0');
        if (el('countMinutes')) el('countMinutes').textContent = String(minutes).padStart(2, '0');
        if (el('countSeconds')) el('countSeconds').textContent = String(seconds).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
}

// ===== Typing Quotes =====
function initTypingQuotes() {
    const quotes = [
        "You are my greatest pride and my forever inspiration, Caroline.",
        "Every moment with you is a blessing I'll never take for granted.",
        "You didn't just earn a degree — you proved that dreams come true.",
        "The world is brighter because you're in it, my love.",
        "I fall in love with you more every single day."
    ];
    const el = document.getElementById('typingQuote');
    if (!el) return;
    let idx = 0;
    async function cycle() {
        const text = quotes[idx];
        el.textContent = '';
        for (let i = 0; i < text.length; i++) {
            el.textContent += text.charAt(i);
            await new Promise(r => setTimeout(r, 45));
        }
        await new Promise(r => setTimeout(r, 3000));
        for (let i = text.length; i >= 0; i--) {
            el.textContent = text.substring(0, i);
            await new Promise(r => setTimeout(r, 25));
        }
        await new Promise(r => setTimeout(r, 500));
        idx = (idx + 1) % quotes.length;
        cycle();
    }
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { observer.disconnect(); cycle(); }
    }, { threshold: 0.5 });
    observer.observe(el.closest('.quotes-section'));
}

// ===== Gallery Carousel =====
function initGallery() {
    const track = document.getElementById('galleryTrack');
    const dotsContainer = document.getElementById('galleryDots');
    if (!track || !dotsContainer) return;
    const slides = track.querySelectorAll('.gallery-slide');
    let current = 0;
    const total = slides.length;
    // Create dots
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    }
    function goTo(n) {
        current = ((n % total) + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dotsContainer.querySelectorAll('.gallery-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }
    document.getElementById('galleryPrev')?.addEventListener('click', () => goTo(current - 1));
    document.getElementById('galleryNext')?.addEventListener('click', () => goTo(current + 1));
    // Auto-slide
    let autoSlide = setInterval(() => goTo(current + 1), 4000);
    const carousel = document.getElementById('galleryCarousel');
    carousel?.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carousel?.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goTo(current + 1), 4000); });
    // Touch/swipe support
    let startX = 0;
    carousel?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; clearInterval(autoSlide); });
    carousel?.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
        autoSlide = setInterval(() => goTo(current + 1), 4000);
    });
}

// ===== Polaroid Reveal =====
function initPolaroids() {
    const items = document.querySelectorAll('.polaroid-item');
    items.forEach(item => {
        const caption = item.getAttribute('data-caption');
        const captionEl = item.querySelector('.polaroid-caption');
        if (captionEl && caption) captionEl.textContent = caption;
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 200);
            }
        });
    }, { threshold: 0.2 });
    items.forEach(item => observer.observe(item));
}

// ===== Wish Lanterns =====
function initLanterns() {
    const lanterns = document.querySelectorAll('.lantern');
    const wishText = document.getElementById('wishText');
    lanterns.forEach(lantern => {
        lantern.addEventListener('click', () => {
            if (lantern.classList.contains('released')) return;
            const wish = lantern.getAttribute('data-wish');
            lantern.classList.add('released');
            if (wishText) {
                wishText.textContent = wish;
                wishText.classList.add('show');
                setTimeout(() => wishText.classList.remove('show'), 4000);
            }
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.timeline-item, .wish-item').forEach(el => observer.observe(el));
}

// ===== Reason Cards Flip =====
function initReasonCards() {
    document.querySelectorAll('.reason-card').forEach(card => {
        const reason = card.getAttribute('data-reason');
        const backP = card.querySelector('.reason-back p');
        if (backP) backP.textContent = reason;
        card.addEventListener('click', () => card.classList.toggle('flipped'));
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

// ===== Voice Message =====
function initVoiceMessage() {
    const btn = document.getElementById('voiceBtn');
    if (!btn) return;
    // Add a voice-message.m4a file to the project folder to enable this feature
    const audio = new Audio('voice-message.m4a');
    let playing = false;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (playing) {
            audio.pause(); audio.currentTime = 0;
            btn.classList.remove('playing'); playing = false;
        } else {
            audio.play().then(() => {
                btn.classList.add('playing'); playing = true;
            }).catch(() => {
                btn.querySelector('.voice-label').textContent = 'No recording yet';
                setTimeout(() => { btn.querySelector('.voice-label').textContent = 'Hear My Voice'; }, 2000);
            });
        }
        audio.onended = () => { btn.classList.remove('playing'); playing = false; };
    });
}

// ===== Easter Eggs System =====
function initEasterEggs(confetti) {
    const tracker = document.getElementById('eggTracker');
    const countEl = document.getElementById('eggCount');
    const popup = document.getElementById('secretPopup');
    const found = new Set();
    const secrets = {
        cap: { emoji: '🎓', title: 'Cap Toss Master!', msg: 'You found the magic graduation cap! Caroline, you were BORN to wear this cap. So proud! 🎓✨' },
        badge: { emoji: '🏅', title: 'Class of Champions!', msg: 'Class of 2026 — the year Caroline conquered the world! Remember this year forever. 💫' },
        star: { emoji: '⭐', title: 'Hidden Star!', msg: 'Just like this hidden star, your inner light shines even when no one is looking. I see it always. ⭐' },
        card: { emoji: '💝', title: 'Double Love!', msg: 'You found the secret double-tap! Here is extra love: I am SO lucky to have you, Caroline. 💕💕' },
        heart: { emoji: '💌', title: 'Love Letter Secret!', msg: 'Every word in that letter comes from the deepest part of my heart. You are my everything. 💖' },
        lantern: { emoji: '🏮', title: 'Lantern Whisperer!', msg: 'A special wish just for you: May our love grow brighter with every passing day. 🌟' },
        love: { emoji: '💖', title: 'True Love Found!', msg: 'You found the final secret! This whole site was built with love — every pixel is for you, Caroline. 💕' }
    };
    const clickCounts = {};

    function discover(eggId) {
        if (found.has(eggId)) return;
        found.add(eggId);
        if (countEl) countEl.textContent = found.size;
        if (tracker) { tracker.classList.remove('hidden'); tracker.classList.add('show'); }
        const s = secrets[eggId];
        if (popup && s) {
            document.getElementById('secretEmoji').textContent = s.emoji;
            document.getElementById('secretTitle').textContent = s.title;
            document.getElementById('secretMsg').textContent = s.msg;
            popup.classList.remove('hidden');
        }
        confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 50);
        if (found.size === 7) {
            setTimeout(() => { confetti.rain(5000); }, 1000);
        }
    }

    // Close popup
    document.getElementById('secretClose')?.addEventListener('click', () => popup?.classList.add('hidden'));
    popup?.addEventListener('click', (e) => { if (e.target === popup) popup.classList.add('hidden'); });

    // Egg #1: Click grad cap 5 times
    const cap = document.getElementById('easterCap');
    if (cap) {
        clickCounts.cap = 0;
        cap.addEventListener('click', () => { clickCounts.cap++; if (clickCounts.cap >= 5) discover('cap'); });
    }
    // Egg #2: Click badge
    const badge = document.getElementById('easterBadge');
    if (badge) badge.addEventListener('click', () => discover('badge'));
    // Egg #3: Hidden star
    const star = document.getElementById('easterStar');
    if (star) star.addEventListener('click', (e) => { e.stopPropagation(); discover('star'); });
    // Egg #4: Double-click card
    const card = document.getElementById('easterCard');
    if (card) card.addEventListener('dblclick', () => discover('card'));
    // Egg #5: Click envelope heart 3 times
    const heart = document.getElementById('easterHeart');
    if (heart) {
        clickCounts.heart = 0;
        heart.addEventListener('click', (e) => { e.stopPropagation(); clickCounts.heart++; if (clickCounts.heart >= 3) discover('heart'); });
    }
    // Egg #6: Tap lantern 3 times
    const lantern = document.getElementById('easterLantern');
    if (lantern) {
        clickCounts.lantern = 0;
        lantern.addEventListener('click', () => { clickCounts.lantern++; if (clickCounts.lantern >= 3) discover('lantern'); });
    }
    // Egg #7: Click "made with love"
    const love = document.getElementById('easterLove');
    if (love) love.addEventListener('click', () => discover('love'));
}

// ===== Main Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    const confetti = new ConfettiSystem(document.getElementById('confettiCanvas'));
    const fireworks = new FireworksSystem(document.getElementById('fireworksCanvas'));
    const preloader = document.getElementById('preloader');
    const openBtn = document.getElementById('openBtn');
    const giftLid = document.getElementById('giftLid');
    const mainContent = document.getElementById('mainContent');
    const celebrateBtn = document.getElementById('celebrateBtn');
    const musicToggle = document.getElementById('musicToggle');
    let musicPlaying = false;
    const audioPlayer = new Audio('music.m4a');
    audioPlayer.loop = true;
    audioPlayer.volume = 1.0;

    // Preloader open
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            giftLid.classList.add('open');
            setTimeout(() => {
                confetti.rain(5000);
                preloader.classList.add('fade-out');
                mainContent.classList.remove('hidden');
                mainContent.style.opacity = '1';
                mainContent.style.pointerEvents = 'auto';

                // Auto-play music on open
                audioPlayer.play().then(() => {
                    musicToggle.classList.add('playing');
                    musicPlaying = true;
                }).catch(() => {});

                // Initialize all features
                createFloatingElements();
                createHeroParticles();
                createFinaleHearts();
                createShootingStars();
                initScrollAnimations();
                initReasonCards();
                initLetter();
                initCountdown();
                initTypingQuotes();
                initGallery();
                initPolaroids();
                initLanterns();
                initVoiceMessage();
                initEasterEggs(confetti);
            }, 700);
        });
    }

    // Celebrate button — fireworks + confetti
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', () => {
            const rect = celebrateBtn.getBoundingClientRect();
            confetti.burst(rect.left + rect.width / 2, rect.top, 120);
            fireworks.launch(8);
            setTimeout(() => confetti.burst(window.innerWidth * 0.25, window.innerHeight * 0.3, 60), 300);
            setTimeout(() => confetti.burst(window.innerWidth * 0.75, window.innerHeight * 0.3, 60), 600);
            setTimeout(() => confetti.rain(3000), 800);
        });
    }

    // Music toggle
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (musicPlaying) {
                audioPlayer.pause();
                musicToggle.classList.remove('playing');
                musicPlaying = false;
            } else {
                audioPlayer.play().then(() => {
                    musicToggle.classList.add('playing');
                    musicPlaying = true;
                }).catch(err => console.error("Audio failed:", err));
            }
        });
    }
});
