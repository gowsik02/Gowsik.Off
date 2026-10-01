// Import stylesheet
import './style.css';

// Check for touch / coarse pointer devices
const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;

// Smooth Scrolling with Lenis (Desktop only)
let lenisInstance = null;
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
                    loader.style.transition = "opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
                    loader.style.opacity = "0";
                    setTimeout(() => {
                        loader.style.display = "none";
                        animateHeroEntry();
                        initEducationTimeline();
                    }, 600);
                }
            }, 500);
        }
    }, 130);
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
}, 2000);

// Hero Entry Animation
function animateHeroEntry() {
    document.querySelectorAll("#hero .hero-left > *").forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`;
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
    let ticking = false;

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;
                if (currentScroll > 50) {
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
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");
    const observerOptions = {
        root: null,
        rootMargin: "-25% 0px -45% 0px",
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
            y: 35,
            stagger: 0.15,
            duration: 0.9,
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

// Split Characters in Section Titles (Word-safe & non-touch desktop only)
function initSplitText() {
    if (typeof ScrollTrigger === 'undefined' || isTouch) return;
    document.querySelectorAll(".section-title").forEach((title) => {
        const text = title.textContent ? title.textContent.trim() : '';
        if (!text) return;
        const words = text.split(/\s+/);
        title.innerHTML = "";
        let charCounter = 0;
        words.forEach((word, wIdx) => {
            const wordSpan = document.createElement("span");
            wordSpan.className = "split-word";
            wordSpan.style.display = "inline-block";
            wordSpan.style.whiteSpace = "nowrap";
            [...word].forEach((char) => {
                const charSpan = document.createElement("span");
                charSpan.className = "split-char";
                charSpan.textContent = char;
                charSpan.style.transitionDelay = `${charCounter * 0.02}s`;
                wordSpan.appendChild(charSpan);
                charCounter++;
            });
            title.appendChild(wordSpan);
            if (wIdx < words.length - 1) {
                const space = document.createTextNode(" ");
                title.appendChild(space);
            }
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

// Interactive Glass Card Glow (Desktop mouse only)
function initCardGlow() {
    if (isTouch) return;
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
        }, { passive: true });
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
        threshold: 0.08,
        rootMargin: "0px 0px -4% 0px"
    });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// Magnetic Buttons Effect (Desktop only)
function initMagneticButtons() {
    if (isTouch) return;
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
        }, { passive: true });

        btn.addEventListener("mouseleave", () => {
            targetX = 0;
            targetY = 0;
            if (!rafId) rafId = requestAnimationFrame(tick);
        });
    });
}

// Cursor Glow Follower (Desktop only)
function initCursorGlow() {
    const cursor = document.getElementById("cursor-glow");
    if (!cursor || isTouch) return;

    let cursorTicking = false;
    document.addEventListener("mousemove", (e) => {
        if (!cursorTicking) {
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
                cursor.style.opacity = "1";
                cursorTicking = false;
            });
            cursorTicking = true;
        }
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
    });
}

// Scroll Progress Bar
function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    let barTicking = false;
    window.addEventListener("scroll", () => {
        if (!barTicking) {
            requestAnimationFrame(() => {
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
                bar.style.width = `${progress}%`;
                barTicking = false;
            });
            barTicking = true;
        }
    }, { passive: true });
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

// Responsive Projects Showcase (Desktop Pinned Scroll + Mobile Native Touch Carousel)
function initProjectsHorizontalScroll() {
    const section = document.getElementById("projects");
    const track = document.getElementById("projectsTrack");
    const viewport = document.getElementById("projectsViewport") || document.querySelector(".projects-horizontal-viewport");
    const progressBar = document.getElementById("projectsProgressBar");
    const activeNum = document.getElementById("projectActiveNum");
    const cards = document.querySelectorAll(".project-card-v2");
    const prevBtn = document.getElementById("projPrevBtn");
    const nextBtn = document.getElementById("projNextBtn");

    if (!section || !track || cards.length === 0) return;

    // Next/Previous Arrow Navigation
    if (prevBtn && viewport) {
        prevBtn.addEventListener("click", () => {
            const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 300;
            if (window.innerWidth <= 768) {
                viewport.scrollBy({ left: -cardWidth, behavior: "smooth" });
            } else {
                window.scrollBy({ top: -window.innerHeight * 0.45, behavior: "smooth" });
            }
        });
    }

    if (nextBtn && viewport) {
        nextBtn.addEventListener("click", () => {
            const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 300;
            if (window.innerWidth <= 768) {
                viewport.scrollBy({ left: cardWidth, behavior: "smooth" });
            } else {
                window.scrollBy({ top: window.innerHeight * 0.45, behavior: "smooth" });
            }
        });
    }

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const mm = gsap.matchMedia();

    // DESKTOP: Smooth Pinned GSAP Scroll
    mm.add("(min-width: 769px)", () => {
        const getScrollDistance = () => {
            const trackWidth = track.scrollWidth;
            const containerWidth = viewport ? viewport.clientWidth : window.innerWidth;
            return Math.max(0, trackWidth - containerWidth + 48);
        };

        const horizontalTween = gsap.to(track, {
            x: () => -getScrollDistance(),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${Math.max(window.innerHeight * 1.8, getScrollDistance() * 1.25)}`,
                pin: true,
                scrub: 0.8,
                invalidateOnRefresh: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    if (progressBar) {
                        const totalCards = cards.length;
                        const minPct = Math.round(100 / totalCards);
                        const pct = Math.min(100, Math.max(minPct, Math.round(minPct + progress * (100 - minPct))));
                        progressBar.style.width = `${pct}%`;
                    }
                    if (activeNum) {
                        const totalCards = cards.length;
                        const activeIdx = Math.min(totalCards, Math.max(1, Math.floor(progress * totalCards * 0.98) + 1));
                        activeNum.textContent = activeIdx < 10 ? `0${activeIdx}` : `${activeIdx}`;
                    }
                }
            }
        });

        return () => {
            if (horizontalTween.scrollTrigger) horizontalTween.scrollTrigger.kill();
            horizontalTween.kill();
            gsap.set(track, { clearProps: "all" });
        };
    });

    // MOBILE: Hardware-Accelerated Native Touch Swipe (Zero Lag, 120fps)
    mm.add("(max-width: 768px)", () => {
        gsap.set(track, { clearProps: "all" });

        if (!viewport) return;

        let scrollTicking = false;
        const updateMobileProgress = () => {
            const maxScroll = viewport.scrollWidth - viewport.clientWidth;
            if (maxScroll <= 0) return;
            const scrollLeft = viewport.scrollLeft;
            const progress = Math.min(1, Math.max(0, scrollLeft / maxScroll));
            
            const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 300;
            const totalCards = cards.length;
            const activeIdx = Math.min(totalCards, Math.max(1, Math.round(scrollLeft / cardWidth) + 1));
            
            if (activeNum) {
                activeNum.textContent = activeIdx < 10 ? `0${activeIdx}` : `${activeIdx}`;
            }
            if (progressBar) {
                const minPct = Math.round(100 / totalCards);
                const pct = Math.min(100, Math.max(minPct, Math.round(minPct + progress * (100 - minPct))));
                progressBar.style.width = `${pct}%`;
            }
            scrollTicking = false;
        };

        viewport.addEventListener("scroll", () => {
            if (!scrollTicking) {
                requestAnimationFrame(updateMobileProgress);
                scrollTicking = true;
            }
        }, { passive: true });

        updateMobileProgress();

        return () => {
            viewport.removeEventListener("scroll", updateMobileProgress);
        };
    });
}

// Initialize all features on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
    initSplitText();
    initMetrics();
    initCardGlow();
    initMagneticButtons();
    initCursorGlow();
    initScrollProgress();
    initSkillBars();
    initProjectsHorizontalScroll();
});

window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});
