/* ===================================================
   EEC Engineering — Main Script
   =================================================== */

'use strict';

/* ====================================================
   1. NAVBAR — scroll effect + mobile menu
   ==================================================== */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.querySelector('.nav-links');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// close mobile menu on nav link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '1';
    });
  });
});

// active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active-link', scrollY >= top && scrollY < top + height);
    }
  });
}, { passive: true });

/* ====================================================
   2. SCROLL-TO-TOP BUTTON
   ==================================================== */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ====================================================
   3. AOS — Animate On Scroll (custom lightweight)
   ==================================================== */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(() => el.classList.add('aos-animate'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ====================================================
   4. PROJECTS FILTER
   ==================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show     = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'cardReveal .4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ====================================================
   5. CONTACT FORM — Formspree real submit
   ==================================================== */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const error   = document.getElementById('formError');
  const btn     = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // hide prev messages
    success.classList.remove('show');
    error.classList.remove('show');

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جارى الإرسال...';

    try {
      const data     = new FormData(form);
      const response = await fetch(form.action, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> تم الإرسال!';
        btn.style.background = 'linear-gradient(135deg,#3a8a3a,#2d6e2d)';
        success.classList.add('show');
        form.reset();

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الطلب';
          btn.style.background = '';
          success.classList.remove('show');
        }, 6000);
      } else {
        throw new Error('server error');
      }
    } catch {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الطلب';
      error.classList.add('show');
      setTimeout(() => error.classList.remove('show'), 5000);
    }
  });
}

/* ====================================================
   6. SMOOTH SCROLL for anchor links
   ==================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ====================================================
   7. COUNTER ANIMATION (stats if added later)
   ==================================================== */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const step     = target / (duration / 16);
  let current    = 0;

  const update = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current).toLocaleString('ar-EG');
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString('ar-EG');
    }
  };
  update();
}

function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ====================================================
   8. HERO PARALLAX (subtle)
   ==================================================== */
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      hero.style.backgroundPositionY = `${y * 0.4}px`;
    }
  }, { passive: true });
}

/* ====================================================
   9. SERVICE CARD — tilt effect on hover
   ==================================================== */
function initCardTilt() {
  document.querySelectorAll('.service-card, .partner-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) *  6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ====================================================
   10. INJECT CSS keyframe for card reveal
   ==================================================== */
function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cardReveal {
      from { opacity:0; transform:translateY(20px) scale(.96); }
      to   { opacity:1; transform:translateY(0)    scale(1);   }
    }
    .nav-links a.active-link {
      color: var(--copper-light) !important;
    }
    .nav-links a.active-link::after {
      transform: scaleX(1) !important;
    }
  `;
  document.head.appendChild(style);
}

/* ====================================================
   11. LOADING SCREEN
   ==================================================== */
function initLoader() {
  const loader = document.createElement('div');
  loader.id = 'pageLoader';
  loader.innerHTML = `
    <div class="loader-inner">
      <div class="loader-logo">EEC</div>
      <div class="loader-bar"><div class="loader-progress"></div></div>
    </div>`;
  loader.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:linear-gradient(135deg,#2c2416,#1a1008);
    display:flex;align-items:center;justify-content:center;
    transition:opacity .5s ease, visibility .5s ease;
  `;

  const loaderStyle = document.createElement('style');
  loaderStyle.textContent = `
    .loader-inner { text-align:center; }
    .loader-logo  {
      font-family:'Cairo',sans-serif;font-size:3rem;font-weight:900;
      color:#b07d4a;letter-spacing:.15em;
      animation:logoPulse 1s ease-in-out infinite alternate;
    }
    @keyframes logoPulse {
      from { opacity:.5; transform:scale(.95); }
      to   { opacity:1;  transform:scale(1.05); }
    }
    .loader-bar {
      width:200px;height:3px;background:rgba(255,255,255,.1);
      border-radius:2px;margin:20px auto 0;overflow:hidden;
    }
    .loader-progress {
      height:100%;background:linear-gradient(90deg,#b07d4a,#c8622a);
      border-radius:2px;
      animation:loadFill .9s ease forwards;
    }
    @keyframes loadFill {
      from { width:0%; }
      to   { width:100%; }
    }
  `;
  document.head.appendChild(loaderStyle);
  document.body.appendChild(loader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity   = '0';
      loader.style.visibility = 'hidden';
      setTimeout(() => loader.remove(), 500);
    }, 900);
  });
}

/* ====================================================
   12. DOWNLOAD BUTTON — pulse animation
   ==================================================== */
function initDownloadPulse() {
  const btn = document.querySelector('.btn-download');
  if (!btn) return;

  // add ripple on click
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      background:rgba(255,255,255,.25);border-radius:50%;
      top:${e.clientY - rect.top  - size/2}px;
      left:${e.clientX - rect.left - size/2}px;
      transform:scale(0);pointer-events:none;
      animation:rippleEffect .6s ease-out forwards;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleEffect {
      to { transform:scale(2.5); opacity:0; }
    }
  `;
  document.head.appendChild(rippleStyle);
}

/* ====================================================
   INIT ALL
   ==================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  injectKeyframes();
  initAOS();
  initProjectsFilter();
  initContactForm();
  initSmoothScroll();
  initCounters();
  initParallax();
  initCardTilt();
  initDownloadPulse();

  // ── auto footer year ──
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
