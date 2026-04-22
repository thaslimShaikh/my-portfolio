// ── Custom Cursor ──
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor expand on interactive elements
document.querySelectorAll('a, button, .project-card, .skill-card, .edu-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
        cursor.style.background = 'var(--gold)';
        follower.style.width = '60px';
        follower.style.height = '60px';
        follower.style.borderColor = 'var(--gold)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'var(--pink)';
        follower.style.width = '36px';
        follower.style.height = '36px';
        follower.style.borderColor = 'var(--pink)';
    });
});

// ── Sticky Navbar ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Smooth Scrolling ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ── Intersection Observer for scroll reveals ──
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Generic reveal elements
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Section headings underline animation
document.querySelectorAll('.section-heading').forEach(el => revealObserver.observe(el));

// Edu cards
document.querySelectorAll('.edu-card').forEach(el => revealObserver.observe(el));

// Project cards with stagger
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(card);
});

// Skill cards with stagger
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(card);
});

// Stagger parent containers
document.querySelectorAll('.stagger-parent').forEach(el => revealObserver.observe(el));

// ── Typing effect for hero subtitle ──
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.getAttribute('data-text');
    heroSubtitle.textContent = '';
    let i = 0;
    setTimeout(() => {
        const interval = setInterval(() => {
            heroSubtitle.textContent += text[i];
            i++;
            if (i >= text.length) clearInterval(interval);
        }, 35);
    }, 900);
}

// ── Parallax on hero orb / grid ──
document.addEventListener('mousemove', (e) => {
    const hero = document.getElementById('home');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (e.clientY > rect.bottom) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    hero.style.setProperty('--parallax-x', `${x}px`);
    hero.style.setProperty('--parallax-y', `${y}px`);
});

// ── Active nav link highlighting ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#navbar ul a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active-nav');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active-nav');
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// Add active nav style dynamically
const style = document.createElement('style');
style.textContent = `
    #navbar ul a.active-nav {
        color: var(--pink) !important;
    }
    #navbar ul a.active-nav::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// ── Counter animation for CGPA/grades ──
function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(2) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toFixed(2) + suffix;
    }
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-count]').forEach(animateCount);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.edu-card').forEach(card => counterObserver.observe(card));

// ── Page load fade-in ──
document.body.style.opacity = '0';
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
});
