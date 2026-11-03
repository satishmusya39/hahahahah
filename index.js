/* ═══ Portfolio Interactions & Mechanics ═════════════════════════
   - Scroll Spy & Sliding Active Indicator
   - Responsive Mobile Navigation Drawer Handler
   - Formspree AJAX Submission Handler
   - Auto Scroll-to-Top Handler on Refresh
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const navList = document.getElementById("nav-links");
    const navLinks = Array.from(navList.querySelectorAll('a[href^="#"]'));
    const toggle = document.querySelector(".nav-toggle");

    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    /* ── 1. Create & Position Sliding Indicator ──────────────── */
    const indicator = document.createElement("span");
    indicator.className = "nav-indicator";
    indicator.setAttribute("aria-hidden", "true");
    navList.appendChild(indicator);

    function moveIndicator(link) {
        if (!link || getComputedStyle(indicator).display === "none") return;
        indicator.style.width = `${link.offsetWidth}px`;
        indicator.style.transform = `translateX(${link.offsetLeft}px)`;
        indicator.classList.add("is-ready");
    }

    /* ── 2. Scroll Spy Logic ──────────────────────────────────── */
    let currentId = null;

    function setActive(id) {
        if (id === currentId) return;
        currentId = id;

        let activeLink = null;
        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "true");
                activeLink = link;
            } else {
                link.removeAttribute("aria-current");
            }
        });

        moveIndicator(activeLink);
    }

    function updateOnScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const triggerLine = header.offsetHeight + window.innerHeight * 0.3;
        let activeId = sections[0]?.id;

        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= triggerLine) {
                activeId = section.id;
            }
        });

        if (maxScroll > 0 && scrollY >= maxScroll - 5) {
            activeId = sections[sections.length - 1].id;
        }

        if (activeId) {
            setActive(activeId);
        }
    }

    /* ── 3. Optimized Scroll Listener (RequestAnimationFrame) ─── */
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                updateOnScroll();
                ticking = false;
            });
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("resize", () => {
        const activeLink = navLinks.find((l) => l.classList.contains("active"));
        moveIndicator(activeLink);
        if (window.innerWidth > 900) {
            closeMenu();
        }
        onScroll();
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            const activeLink = navLinks.find((l) => l.classList.contains("active"));
            moveIndicator(activeLink);
        });
    }

    /* ── 4. Mobile Navigation Toggle ──────────────────────────── */
    function closeMenu() {
        if (!header) return;
        header.classList.remove("menu-open");
        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
        }
    }

    if (toggle) {
        toggle.addEventListener("click", () => {
            const isOpen = header.classList.toggle("menu-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        });
    }

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });

    updateOnScroll();
});

/* ─── FORMSPREE AJAX SUBMISSION ─────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳ Sending...</span>';
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = '✅ The form has been submitted successfully!';
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    formStatus.textContent = '❌ Oops! There was a problem submitting your form.';
                }
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            }
        } catch (error) {
            formStatus.textContent = '❌ Unable to connect. Please check your internet connection.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>🚀 Send Message</span>';
        }
    });
}

/* ─── ALWAYS START AT HOME ON REFRESH ──────────────────────────── */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
        history.replaceState(null, null, ' ');
    }
});