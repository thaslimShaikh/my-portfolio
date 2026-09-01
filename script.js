// ── Spider Cursor ──
const spider = document.getElementById('spiderCursor');
const webBanner = document.querySelector('.web-banner');
let mouseX = 0, mouseY = 0;
let spiderX = 0, spiderY = 0;
let lastScrollY = window.scrollY;
let crawlTimeout = null;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateSpider() {
    spiderX += (mouseX - spiderX) * 0.18;
    spiderY += (mouseY - spiderY) * 0.18;
    if (spider) {
        spider.style.left = spiderX + 'px';
        spider.style.top = spiderY + 'px';
    }
    requestAnimationFrame(animateSpider);
}
animateSpider();

window.addEventListener('scroll', () => {
    const dy = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    if (dy > 2 && spider) {
        spider.classList.add('crawl');
        clearTimeout(crawlTimeout);
        crawlTimeout = setTimeout(() => spider.classList.remove('crawl'), 280);
    }
    // black web on cream sections, light web over dark hero
    if (webBanner) {
        webBanner.classList.toggle('light-mode', window.scrollY < window.innerHeight * 0.85);
    }
});
// initial: hero is dark
if (webBanner) webBanner.classList.add('light-mode');

document.querySelectorAll('a, button, .project-card, .skill-card, .edu-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (!spider) return;
        spider.style.color = 'var(--gold)';
        spider.style.filter = 'drop-shadow(0 0 8px rgba(190, 154, 96, 0.6))';
        spider.style.transform = 'translate(-50%, -50%) scale(1.35)';
    });
    el.addEventListener('mouseleave', () => {
        if (!spider) return;
        spider.style.color = 'var(--pink)';
        spider.style.filter = 'drop-shadow(0 0 5px rgba(204, 136, 153, 0.5))';
        spider.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.section-heading').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.edu-card').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(card);
});
document.querySelectorAll('.skill-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(card);
});

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

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#navbar ul a');
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active-nav');
                if (link.getAttribute('href') === `#${id}`) link.classList.add('active-nav');
            });
        }
    });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));

const style = document.createElement('style');
style.textContent = `
    #navbar ul a.active-nav { color: var(--pink) !important; }
    #navbar ul a.active-nav::after { width: 100% !important; }
`;
document.head.appendChild(style);

function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const duration = 1200;
    const start = performance.now();
    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(2);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toFixed(2);
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

document.body.style.opacity = '0';
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
});
