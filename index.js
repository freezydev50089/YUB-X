// Please do not look at this code, it's a mess and I don't want to maintain it. I just want to get it out of my head and onto the screen so I can move on to the next thing. If you want to use it as a reference for your own project, go ahead, but please don't ask me to explain how it works or why I did things the way I did. I don't even remember half of it myself.

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

function updateSectionBlur(section, container) {
    if (!section || !container) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    let blur = 0;
    let opacity = 1;

    if (rect.top >= vh) {
        blur = 14;
        opacity = 0;
    } else if (rect.top > 0) {
        const progress = Math.min(1, (vh - rect.top) / (vh * 0.4));
        blur = 14 * (1 - progress);
        opacity = progress;
    } else if (rect.bottom <= 0) {
        blur = 14;
        opacity = 0;
    } else if (rect.bottom < vh * 0.5) {
        const progress = Math.min(1, rect.bottom / (vh * 0.35));
        blur = 14 * (1 - progress);
        opacity = progress;
    } else {
        blur = 0;
        opacity = 1;
    }

    container.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
    container.style.opacity = opacity;
}

const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const heroContent = document.querySelector('.hero-content');
const featuresSection = document.getElementById('features');
const featuresContainer = document.querySelector('.features-container');
const installSection = document.getElementById('how-to-install');
const installContainer = document.querySelector('.install-container');
const pricingSection = document.getElementById('pricing');
const pricingContainer = document.querySelector('.pricing-container');
const faqSection = document.getElementById('faq');
const faqContainer = document.querySelector('.faq-container');
const statsSection = document.getElementById('stats');
const statsContainer = document.querySelector('.stats-container');

const footerSection = document.getElementById('footer');
const footerContainer = document.querySelector('.footer-container');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercent + '%';
    }

    if (heroContent) {
        const blurValue = Math.min(scrollY / 50, 10);
        const opacityValue = Math.max(1 - scrollY / 500, 0);
        heroContent.style.filter = blurValue > 0.1 ? `blur(${blurValue}px)` : 'none';
        heroContent.style.opacity = opacityValue;
    }

    updateSectionBlur(featuresSection, featuresContainer);
    updateSectionBlur(pricingSection, pricingContainer);
    updateSectionBlur(faqSection, faqContainer);
    updateSectionBlur(statsSection, statsContainer);

    updateSectionBlur(footerSection, footerContainer);
});

const spotlightCards = document.querySelectorAll('.feature-card, .pricing-card');

document.addEventListener('mousemove', (e) => {
    spotlightCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) +
            Math.pow(e.clientY - centerY, 2)
        );

        const maxDistance = Math.max(rect.width, rect.height) * 1.5;
        const opacity = Math.max(0, 1 - distance / maxDistance);

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.style.setProperty('--card-opacity', opacity);
    });
});

document.addEventListener('mouseleave', () => {
    spotlightCards.forEach(card => {
        card.style.setProperty('--card-opacity', 0);
    });
});

function animateBlurText(element, baseDelay, wordDelay) {
    const text = element.textContent.trim();
    const words = text.split(' ');
    element.innerHTML = '';
    words.forEach((word, i) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.className = 'blur-word';
        span.style.animationDelay = (baseDelay + i * wordDelay) + 'ms';
        element.appendChild(span);
        if (i < words.length - 1) {
            element.appendChild(document.createTextNode(' '));
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        if (!button) return;
        button.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(i => {
                i.classList.remove('active');
                const ans = i.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = null;
                const plus = i.querySelector('.icon-plus');
                const minus = i.querySelector('.icon-minus');
                if (plus) plus.style.display = 'block';
                if (minus) minus.style.display = 'none';
            });

            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
                const plus = item.querySelector('.icon-plus');
                const minus = item.querySelector('.icon-minus');
                if (plus) plus.style.display = 'none';
                if (minus) minus.style.display = 'block';
            }
        });
    });

    const firstFaq = faqItems[0];
    if (firstFaq) {
        firstFaq.classList.add('active');
        const answer = firstFaq.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
        const plus = firstFaq.querySelector('.icon-plus');
        const minus = firstFaq.querySelector('.icon-minus');
        if (plus) plus.style.display = 'none';
        if (minus) minus.style.display = 'block';
    }

    if (logo) {
        logo.classList.add('blur-fade-in');
        logo.style.animationDelay = '0ms';
    }

    const navLinks = document.querySelectorAll('.nav-links a, .nav-links .nav-divider');
    navLinks.forEach((el, i) => {
        el.classList.add('blur-fade-in');
        el.style.animationDelay = (80 + i * 50) + 'ms';
    });

    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.classList.add('blur-fade-in');
        navActions.style.animationDelay = '550ms';
    }

    const announcementEl = document.querySelector('.announcement-link');
    const heroTitleEl = document.querySelector('.hero-title');
    const heroDescEl = document.querySelector('.hero-desc');
    const heroActionsEl = document.querySelector('.hero-actions');

    if (announcementEl) {
        announcementEl.classList.add('blur-fade-in');
        announcementEl.style.animationDelay = '200ms';
    }
    if (heroTitleEl) animateBlurText(heroTitleEl, 350, 80);
    if (heroDescEl) animateBlurText(heroDescEl, 900, 40);
    if (heroActionsEl) {
        heroActionsEl.classList.add('blur-fade-in');
        heroActionsEl.style.animationDelay = '1600ms';
    }

    window.dispatchEvent(new Event('scroll'));
});

function animateValue(id, start, end, duration, suffix, isFloat = false) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        const easeOut = progress * (2 - progress);
        let current = start + (end - start) * easeOut;

        if (isFloat) {
            obj.innerHTML = current.toFixed(1) + suffix;
        } else {
            obj.innerHTML = Math.floor(current) + suffix;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = (isFloat ? end.toFixed(1) : end) + suffix;
        }
    };

    window.requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateValue("stat-users", 0, 100, 2000, "k+");
            animateValue("stat-uptime", 0, 99.9, 2500, "%", true);
            animateValue("stat-support", 0, 24, 2000, "/7");
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}
