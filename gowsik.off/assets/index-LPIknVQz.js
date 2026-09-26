(function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]')) n(r);
    new MutationObserver(r => {
        for (const s of r)
            if (s.type === "childList")
                for (const c of s.addedNodes) c.tagName === "LINK" && c.rel === "modulepreload" && n(c)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function o(r) {
        const s = {};
        return r.integrity && (s.integrity = r.integrity), r.referrerPolicy && (s.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? s.credentials = "include" : r.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s
    }

    function n(r) {
        if (r.ep) return;
        r.ep = !0;
        const s = o(r);
        fetch(r.href, s)
    }
})();
const m = "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
window.addEventListener("DOMContentLoaded", () => {
    T(), C(), $(), k(), Y(), F(), P(), D(), H()
});
const g = document.getElementById("loader"),
    b = document.getElementById("loaderStatus"),
    d = document.querySelectorAll("#loaderLogo .letter");
let u = !1;

function S() {
    let t = 0;
    const e = setInterval(() => {
        t > 0 && (d[t - 1].classList.remove("glow"), d[t - 1].classList.add("active")), t < d.length ? (d[t].classList.add("glow"), t++) : (clearInterval(e), b.textContent = "✓ Loading Complete", b.classList.add("complete"), setTimeout(() => {
            g.style.transition = "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)", g.style.opacity = "0", setTimeout(() => {
                g.style.display = "none", q(), B()
            }, 800)
        }, 800))
    }, 160)
}
window.addEventListener("load", () => {
    u || (u = !0, S())
});
setTimeout(() => {
    u || (u = !0, S())
}, 2500);

function q() {
    document.querySelectorAll("#hero .hero-left > *").forEach((o, n) => {
        o.style.opacity = "0", o.style.transform = "translateY(30px)", o.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${n*.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${n*.1}s`, requestAnimationFrame(() => {
            o.style.opacity = "1", o.style.transform = "translateY(0)"
        })
    });
    const e = document.getElementById("heroVisual");
    e && (e.style.opacity = "0", e.style.transform = "scale(0.96)", e.style.transition = "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)", requestAnimationFrame(() => {
        e.style.opacity = "1", e.style.transform = "scale(1)"
    }))
}
let a;
m || (a = new Lenis({
    duration: 1.1,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: !0,
    wheelMultiplier: .95,
    infinite: !1
}), a.on("scroll", ScrollTrigger.update), gsap.ticker.add(t => {
    a.raf(t * 1e3)
}), gsap.ticker.lagSmoothing(0));
document.querySelectorAll('a[href^="#"]').forEach(t => {
    t.addEventListener("click", e => {
        const o = t.getAttribute("href");
        if (o.length < 2) return;
        const n = document.querySelector(o);
        if (n) {
            e.preventDefault(), a ? a.scrollTo(n, {
                offset: 0,
                duration: 1.1
            }) : n.scrollIntoView({
                behavior: "smooth"
            });
            const r = document.getElementById("navLinks"),
                s = document.getElementById("navToggle");
            r && r.classList.remove("open"), s && s.classList.remove("open")
        }
    })
});

function T() {
    const t = document.getElementById("nav");
    let e = window.scrollY;
    window.addEventListener("scroll", () => {
        const i = window.scrollY;
        i > 60 ? t.classList.add("scrolled") : t.classList.remove("scrolled"), i > e && i > 150 ? t.classList.add("hide") : t.classList.remove("hide"), e = i
    });
    const o = document.querySelectorAll("section[id]"),
        n = document.querySelectorAll(".nav-links a"),
        r = {
            root: null,
            rootMargin: "-30% 0px -50% 0px",
            threshold: 0
        },
        s = new IntersectionObserver(i => {
            i.forEach(w => {
                if (w.isIntersecting) {
                    const x = w.target.getAttribute("id");
                    n.forEach(f => {
                        f.classList.remove("active"), f.getAttribute("href") === `#${x}` && f.classList.add("active")
                    })
                }
            })
        }, r);
    o.forEach(i => s.observe(i));
    const c = document.getElementById("navToggle"),
        l = document.getElementById("navLinks");
    c && l && (c.addEventListener("click", i => {
        i.stopPropagation(), l.classList.toggle("open"), c.classList.toggle("open")
    }), document.addEventListener("click", i => {
        !l.contains(i.target) && !c.contains(i.target) && (l.classList.remove("open"), c.classList.remove("open"))
    }))
}

function B() {
    const t = document.querySelectorAll(".education-timeline-item");
    t.length !== 0 && gsap.from(t, {
        opacity: 0,
        y: 40,
        stagger: .2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".education-timeline-container",
            start: "top 85%"
        }
    })
}

function k() {
    const t = document.getElementById("ringEn"),
        e = document.getElementById("ringTa");
    !t || !e || ScrollTrigger.create({
        trigger: ".metrics-column",
        start: "top 85%",
        onEnter: () => {
            t.style.strokeDashoffset = 251.2 * (1 - .85), e.style.strokeDashoffset = 0
        },
        onLeaveBack: () => {
            t.style.strokeDashoffset = 251.2, e.style.strokeDashoffset = 251.2
        }
    })
}

function $() {
    document.querySelectorAll(".section-title").forEach(e => {
        const o = e.textContent;
        e.innerHTML = "", [...o].forEach((n, r) => {
            const s = document.createElement("span");
            s.className = "split-char", s.innerHTML = n === " " ? "&nbsp;" : n, s.style.transitionDelay = `${r*.025}s`, e.appendChild(s)
        }), ScrollTrigger.create({
            trigger: e,
            start: "top 85%",
            onEnter: () => {
                e.querySelectorAll(".split-char").forEach(n => n.classList.add("in-view"))
            },
            onLeaveBack: () => {
                e.querySelectorAll(".split-char").forEach(n => n.classList.remove("in-view"))
            }
        })
    })
}

function Y() {
    document.querySelectorAll(".glass, .about-card, .skill-card, .intern-card, .project-card-v2, .cert-card-v2, .contact-card-glass, .contact-form-col").forEach(e => {
        let o = e.querySelector(".card-glow");
        o || (o = document.createElement("div"), o.className = "card-glow", e.appendChild(o)), e.addEventListener("mousemove", n => {
            const r = e.getBoundingClientRect(),
                s = n.clientX - r.left,
                c = n.clientY - r.top;
            o.style.left = `${s}px`, o.style.top = `${c}px`
        })
    })
}

function C() {
    const t = new IntersectionObserver(e => {
        e.forEach(o => {
            o.isIntersecting && (o.target.classList.add("in-view"), t.unobserve(o.target))
        })
    }, {
        threshold: .1,
        rootMargin: "0px 0px -5% 0px"
    });
    document.querySelectorAll(".reveal").forEach(e => t.observe(e))
}
const A = document.getElementById("heroVisual"),
    M = document.querySelectorAll(".floating-chip");
let L = 0,
    E = 0,
    p = 0,
    h = 0,
    y = [0, 0, 0, 0, 0],
    v = [0, 0, 0, 0, 0];
const O = [
    [-10, -6],
    [12, 10],
    [-15, 7],
    [10, -12],
    [-6, 12]
];
document.addEventListener("mousemove", t => {
    L = (t.clientX / window.innerWidth - .5) * 2, E = (t.clientY / window.innerHeight - .5) * 2
});

function I() {
    !m && A && (p += (L * 15 - p) * .05, h += (E * 11 - h) * .05, A.style.transform = `translate3d(${p}px, ${h}px, 0)`, M.forEach((t, e) => {
        const [o, n] = O[e] || [0, 0];
        y[e] += (L * o - y[e]) * .05, v[e] += (E * n - v[e]) * .05, t.style.transform = `translate3d(${y[e]}px, ${v[e]}px, 0)`
    })), requestAnimationFrame(I)
}
requestAnimationFrame(I);
document.querySelectorAll(".btn, .social-circle-glass, .social-glass-pill").forEach(t => {
    let e = 0,
        o = 0,
        n = 0,
        r = 0,
        s = null;

    function c() {
        e += (n - e) * .15, o += (r - o) * .15, t.style.transform = `translate3d(${e}px, ${o}px, 0)`, Math.abs(n - e) > .1 || Math.abs(r - o) > .1 ? s = requestAnimationFrame(c) : s = null
    }
    t.addEventListener("mousemove", l => {
        const i = t.getBoundingClientRect();
        n = (l.clientX - i.left - i.width / 2) * .22, r = (l.clientY - i.top - i.height / 2) * .22, s || (s = requestAnimationFrame(c))
    }), t.addEventListener("mouseleave", () => {
        n = 0, r = 0, s || (s = requestAnimationFrame(c))
    })
});

function F() {
    const t = document.getElementById("cursor-glow");
    !t || m || (document.addEventListener("mousemove", e => {
        t.style.left = `${e.clientX}px`, t.style.top = `${e.clientY}px`, t.style.opacity = "1"
    }), document.addEventListener("mouseleave", () => {
        t.style.opacity = "0"
    }))
}

function P() {
    const t = document.getElementById("scroll-progress");
    t && window.addEventListener("scroll", () => {
        const e = document.documentElement.scrollTop || document.body.scrollTop,
            o = document.documentElement.scrollHeight - document.documentElement.clientHeight,
            n = o > 0 ? e / o * 100 : 0;
        t.style.width = `${n}%`
    })
}

function D() {
    const t = document.querySelectorAll(".skill-progress-fill");
    t.length !== 0 && ScrollTrigger.create({
        trigger: ".skills-premium-grid",
        start: "top 85%",
        onEnter: () => {
            t.forEach(e => {
                const o = e.getAttribute("data-progress");
                e.style.width = `${o}%`
            })
        },
        onLeaveBack: () => {
            t.forEach(e => {
                e.style.width = "0%"
            })
        }
    })
}

function H() {
    const t = document.querySelector(".about-photo img");
    t && !m && window.innerWidth > 768 && gsap.fromTo(t, {
        rotateY: -35,
        transformPerspective: 1e3
    }, {
        rotateY: 35,
        ease: "none",
        scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    })
}