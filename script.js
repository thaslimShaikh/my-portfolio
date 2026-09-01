/* =========================
   SPIDER-GWEN PORTFOLIO FX
   ========================= */

const spider = document.getElementById('spiderCursor');
const webBanner = document.querySelector('.web-banner');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let spiderX = mouseX;
let spiderY = mouseY;
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
        spider.style.left = `${spiderX}px`;
        spider.style.top = `${spiderY}px`;
    }

    requestAnimationFrame(animateSpider);
}

animateSpider();


/* =========================
   WEB SCROLL EFFECT
   ========================= */

window.addEventListener('scroll', () => {

    const dy = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;

    /* Make cursor spider crawl while scrolling */
    if (dy > 2 && spider) {

        spider.classList.add('crawl');

        clearTimeout(crawlTimeout);

        crawlTimeout = setTimeout(() => {
            spider.classList.remove('crawl');
        }, 260);
    }

    /* Change web appearance after leaving hero */
    if (webBanner) {

        webBanner.classList.toggle(
            'scrolled',
            window.scrollY > window.innerHeight * 0.78
        );
    }

    /* Navbar glass effect */
    const navbar = document.getElementById('navbar');

    if (navbar) {
        navbar.classList.toggle(
            'scrolled',
            window.scrollY > 50
        );
    }

});


/* =========================
   SPIDER CURSOR INTERACTION
   ========================= */

document
    .querySelectorAll(
        'a, button, .project-card, .skill-card, .edu-card'
    )
    .forEach(el => {

        el.addEventListener('mouseenter', () => {

            if (!spider) return;

            spider.style.color = 'var(--blue)';

            spider.style.filter =
                'drop-shadow(0 0 8px rgba(158,217,230,.55))';

            spider.style.transform =
                'translate(-50%, -50%) scale(1.35)';
        });


        el.addEventListener('mouseleave', () => {

            if (!spider) return;

            spider.style.color = 'var(--pink)';

            spider.style.filter =
                'drop-shadow(0 0 6px rgba(231,160,178,.45))';

            spider.style.transform =
                'translate(-50%, -50%) scale(1)';
        });

    });


/* =========================
   SMOOTH NAVIGATION
   ========================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener('click', function (e) {

            const target =
                document.querySelector(this.getAttribute('href'));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        });

    });


/* =========================
   SCROLL REVEAL
   ========================= */

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const revealObserver =
    new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add('visible');

            }

        });

    }, observerOptions);


/* Observe all animated elements */

document
    .querySelectorAll(
        '.reveal, .section-heading, .edu-card, .project-card, .skill-card'
    )
    .forEach(el => {

        revealObserver.observe(el);

    });


/* =========================
   PROJECT CARD DELAYS
   ========================= */

document
    .querySelectorAll('.project-card')
    .forEach((card, i) => {

        card.style.transitionDelay =
            `${i * 0.08}s`;

    });


/* =========================
   SKILL CARD DELAYS
   ========================= */

document
    .querySelectorAll('.skill-card')
    .forEach((card, i) => {

        card.style.transitionDelay =
            `${i * 0.07}s`;

    });


/* =========================
   HERO TYPING EFFECT
   ========================= */

const heroSubtitle =
    document.querySelector('.hero-subtitle');

if (heroSubtitle) {

    const text =
        heroSubtitle.getAttribute('data-text') || '';

    heroSubtitle.textContent = '';

    let i = 0;

    setTimeout(() => {

        const interval = setInterval(() => {

            heroSubtitle.textContent += text[i];

            i++;

            if (i >= text.length) {

                clearInterval(interval);

            }

        }, 32);

    }, 900);

}


/* =========================
   ACTIVE NAVIGATION
   ========================= */

const sections =
    document.querySelectorAll('section[id]');

const navLinks =
    document.querySelectorAll('#navbar ul a');


const navObserver =
    new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const id =
                entry.target.getAttribute('id');

            navLinks.forEach(link => {

                link.classList.toggle(
                    'active-nav',
                    link.getAttribute('href') === `#${id}`
                );

            });

        });

    }, {
        threshold: 0.35
    });


sections.forEach(section => {

    navObserver.observe(section);

});


/* =========================
   EDUCATION COUNTERS
   ========================= */

function animateCount(el) {

    const target =
        parseFloat(el.getAttribute('data-count'));

    const duration = 1200;

    const start =
        performance.now();


    function update(now) {

        const progress =
            Math.min(
                (now - start) / duration,
                1
            );

        const eased =
            1 - Math.pow(1 - progress, 3);


        el.textContent =
            (target * eased).toFixed(2);


        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            el.textContent =
                target.toFixed(2);

        }

    }

    requestAnimationFrame(update);
}


const counterObserver =
    new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target
                .querySelectorAll('[data-count]')
                .forEach(animateCount);

            counterObserver.unobserve(
                entry.target
            );

        });

    }, {
        threshold: 0.5
    });


document
    .querySelectorAll('.edu-card')
    .forEach(card => {

        counterObserver.observe(card);

    });


/* =========================
   PAGE FADE-IN
   ========================= */

document.body.style.opacity = '0';

window.addEventListener('load', () => {

    document.body.style.transition =
        'opacity .6s ease';

    document.body.style.opacity = '1';

});


/* =========================
   RESPONSIVE CURSOR
   ========================= */

window.addEventListener('resize', () => {

    if (window.innerWidth <= 768 && spider) {

        spider.style.display = 'none';

    } else if (spider) {

        spider.style.display = 'block';

    }

});
