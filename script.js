/**
 * MCCI — script.js
 * Handles: nav scroll state, mobile menu, scroll animations, footer year
 */

/* ── Year in footer ─────────────────────────────────────── */
document.querySelectorAll('#year').forEach(el => {
  el.textContent = new Date().getFullYear();
});


/* ── Sticky nav: add shadow on scroll ───────────────────── */
const nav = document.getElementById('mainNav');

if (nav) {
  const onScroll = () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run immediately on load
}


/* ── Mobile hamburger menu toggle ───────────────────────── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });
}


/* ── Scroll-triggered reveal animations ─────────────────── */
/**
 * Uses IntersectionObserver to add the `.visible` class to elements
 * with `.animate-up` when they enter the viewport.
 */
const animateEls = document.querySelectorAll('.animate-up');

if (animateEls.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.12,         // Trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px' // Slight bottom offset for feel
    }
  );

  animateEls.forEach(el => observer.observe(el));
} else {
  // Fallback: make all elements visible immediately
  animateEls.forEach(el => el.classList.add('visible'));
}


/* ── Smooth scroll for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = nav ? nav.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  });
});


/* ── Animate lab progress bars ──────────────────────────── */
/**
 * The lab focus bars use CSS custom property --w for their width.
 * We trigger the animation when bars enter the viewport.
 */
const labBars = document.querySelectorAll('.lab-focus-item__fill');

if (labBars.length && 'IntersectionObserver' in window) {
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // The CSS animation uses animation-fill-mode: both and
          // animation-delay, which fires once the element is rendered.
          // Re-trigger by toggling animation.
          entry.target.style.animationPlayState = 'running';
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  labBars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
    barObserver.observe(bar);
  });
}
