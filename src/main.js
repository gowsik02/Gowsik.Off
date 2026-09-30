// Import stylesheet
import './style.css';

// Check for touch / coarse pointer devices
const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;

// Smooth Scrolling with Lenis
let lenisInstance;
if (!isTouch && typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.95,
        infinite: false
    });

    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        lenisInstance.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
}

// Handle Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId.length < 2) return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            if (lenisInstance) {
                lenisInstance.scrollTo(targetElement, {
                    offset: 0,
                    duration: 1.1
                });
            } else {
                targetElement.scrollIntoView({
                    behavior: "smooth"
                });
            }
            const navLinks = document.getElementById("navLinks");
            const navToggle = document.getElementById("navToggle");
            if (navLinks) navLinks.classList.remove("open");
            if (navToggle) navToggle.classList.remove("open");
        }
    });
});

// Loader Animation
const loader = document.getElementById("loader");
const loaderStatus = document.getElementById("loaderStatus");
const loaderLetters = document.querySelectorAll("#loaderLogo .letter");
let loaderStarted = false;

function runLoader() {
    let index = 0;
    const interval = setInterval(() => {
        if (index > 0 && loaderLetters[index - 1]) {
            loaderLetters[index - 1].classList.remove("glow");
            loaderLetters[index - 1].classList.add("active");
        }
        if (index < loaderLetters.length) {
            loaderLetters[index].classList.add("glow");
            index++;
        } else {
            clearInterval(interval);
            if (loaderStatus) {
                loaderStatus.textContent = "✓ Loading Complete";
                loaderStatus.classList.add("complete");
            }
            setTimeout(() => {
                if (loader) {
                    loader.style.transition = "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
                    loader.style.opacity = "0";
                    setTimeout(() => {
                        loader.style.display = "none";
                        animateHeroEntry();
                        initEducationTimeline();
                    }, 800);
                }
            }, 800);
        }
    }, 160);
}

window.addEventListener("load", () => {
    if (!loaderStarted) {
        loaderStarted = true;
        runLoader();
    }
});

// Fallback if load event delayed
setTimeout(() => {
    if (!loaderStarted) {
        loaderStarted = true;
        runLoader();
    }
}, 2500);

// Hero Entry Animation
function animateHeroEntry() {
    document.querySelectorAll("#hero .hero-left > *").forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
        requestAnimationFrame(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        });
    });
}

// Navigation Controller
function initNav() {
    const nav = document.getElementById("nav");
    if (!nav) return;

    let lastScroll = window.scrollY;
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }

        if (currentScroll > lastScroll && currentScroll > 150) {
            nav.classList.add("hide");
        } else {
            nav.classList.remove("hide");
        }
        lastScroll = currentScroll;
    });

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");
    const observerOptions = {
        root: null,
        rootMargin: "-30% 0px -50% 0px",
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));

    const navToggle = document.getElementById("navToggle");
    const linksContainer = document.getElementById("navLinks");
    if (navToggle && linksContainer) {
        navToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            linksContainer.classList.toggle("open");
            navToggle.classList.toggle("open");
        });

        document.addEventListener("click", (e) => {
            if (!linksContainer.contains(e.target) && !navToggle.contains(e.target)) {
                linksContainer.classList.remove("open");
                navToggle.classList.remove("open");
            }
        });
    }
}

// Education Timeline GSAP Animation
function initEducationTimeline() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const items = document.querySelectorAll(".education-timeline-item");
    if (items.length !== 0) {
        gsap.from(items, {
            opacity: 0,
            y: 40,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".education-timeline-container",
                start: "top 85%"
            }
        });
    }
}

// Language Progress Rings
function initMetrics() {
    if (typeof ScrollTrigger === 'undefined') return;
    const ringEn = document.getElementById("ringEn");
    const ringTa = document.getElementById("ringTa");
    if (!ringEn || !ringTa) return;

    ScrollTrigger.create({
        trigger: ".metrics-column",
        start: "top 85%",
        onEnter: () => {
            ringEn.style.strokeDashoffset = (251.2 * (1 - 0.85)).toString();
            ringTa.style.strokeDashoffset = "0";
        },
        onLeaveBack: () => {
            ringEn.style.strokeDashoffset = "251.2";
            ringTa.style.strokeDashoffset = "251.2";
        }
    });
}

// Split Characters in Section Titles
function initSplitText() {
    if (typeof ScrollTrigger === 'undefined') return;
    document.querySelectorAll(".section-title").forEach((title) => {
        const text = title.textContent || '';
        title.innerHTML = "";
        [...text].forEach((char, idx) => {
            const span = document.createElement("span");
            span.className = "split-char";
            span.innerHTML = char === " " ? "&nbsp;" : char;
            span.style.transitionDelay = `${idx * 0.025}s`;
            title.appendChild(span);
        });

        ScrollTrigger.create({
            trigger: title,
            start: "top 85%",
            onEnter: () => {
                title.querySelectorAll(".split-char").forEach((c) => c.classList.add("in-view"));
            },
            onLeaveBack: () => {
                title.querySelectorAll(".split-char").forEach((c) => c.classList.remove("in-view"));
            }
        });
    });
}

// Interactive Glass Card Glow
function initCardGlow() {
    const cardSelectors = ".glass, .about-card, .skill-card, .intern-card, .project-card-v2, .cert-card-v2, .contact-card-glass, .contact-form-col";
    document.querySelectorAll(cardSelectors).forEach((card) => {
        let glow = card.querySelector(".card-glow");
        if (!glow) {
            glow = document.createElement("div");
            glow.className = "card-glow";
            card.appendChild(glow);
        }
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        });
    });
}

// Intersection Observer for Reveal Elements
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -5% 0px"
    });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// Magnetic Buttons Effect
document.querySelectorAll(".btn, .social-circle-glass, .social-glass-pill").forEach((btn) => {
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = null;

    function tick() {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        btn.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
            rafId = requestAnimationFrame(tick);
        } else {
            rafId = null;
        }
    }

    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        targetX = (e.clientX - rect.left - rect.width / 2) * 0.22;
        targetY = (e.clientY - rect.top - rect.height / 2) * 0.22;
        if (!rafId) rafId = requestAnimationFrame(tick);
    });

    btn.addEventListener("mouseleave", () => {
        targetX = 0;
        targetY = 0;
        if (!rafId) rafId = requestAnimationFrame(tick);
    });
});

// Cursor Glow Follower
function initCursorGlow() {
    const cursor = document.getElementById("cursor-glow");
    if (!cursor || isTouch) return;

    document.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursor.style.opacity = "1";
    });

    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
    });
}

// Scroll Progress Bar
function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        bar.style.width = `${progress}%`;
    });
}

// Skill Progress Bar Fill
function initSkillBars() {
    if (typeof ScrollTrigger === 'undefined') return;
    const progressFills = document.querySelectorAll(".skill-progress-fill");
    if (progressFills.length === 0) return;

    ScrollTrigger.create({
        trigger: ".skills-premium-grid",
        start: "top 85%",
        onEnter: () => {
            progressFills.forEach((fill) => {
                const prog = fill.getAttribute("data-progress");
                if (prog) fill.style.width = `${prog}%`;
            });
        },
        onLeaveBack: () => {
            progressFills.forEach((fill) => {
                fill.style.width = "0%";
            });
        }
    });
}

// Initialize all features on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
    initSplitText();
    initMetrics();
    initCardGlow();
    initCursorGlow();
    initScrollProgress();
    initSkillBars();
});
