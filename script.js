/* ═══════════════════════════════════════════════════
   THEME TOGGLE — dark / light with localStorage
═══════════════════════════════════════════════════ */
(function initTheme() {
  const root   = document.documentElement;
  const btn    = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');

  /* Apply saved preference or default to dark */
  const theme = stored || 'dark';
  root.setAttribute('data-theme', theme);

  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ═══════════════════════════════════════════════════
   TYPED EFFECT
═══════════════════════════════════════════════════ */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const strings = [
    'Backend Developer',
    'Node.js Engineer',
    'NestJS Architect',
    'Microservices Builder',
  ];

  let si = 0, ci = 0, deleting = false;
  const typeSpeed = 80, deleteSpeed = 45, pauseAfter = 1800, pauseBefore = 400;

  function tick() {
    const current = strings[si];

    if (deleting) {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        si = (si + 1) % strings.length;
        setTimeout(tick, pauseBefore);
        return;
      }
      setTimeout(tick, deleteSpeed);
    } else {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) {
        deleting = true;
        setTimeout(tick, pauseAfter);
        return;
      }
      setTimeout(tick, typeSpeed);
    }
  }

  setTimeout(tick, 600);
})();

/* ═══════════════════════════════════════════════════
   NAV — scroll background + active link
═══════════════════════════════════════════════════ */
(function initNav() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ═══════════════════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════════════════ */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ═══════════════════════════════════════════════════
   SCROLL FADE-IN (Intersection Observer)
═══════════════════════════════════════════════════ */
(function initFadeIn() {
  const items = document.querySelectorAll('.fade-in');
  if (!items.length) return;

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach(el => obs.observe(el));
})();

/* ═══════════════════════════════════════════════════
   PROJECT CARDS — Read More toggle
═══════════════════════════════════════════════════ */
(function initReadMore() {
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card   = btn.closest('.project-card');
      const expand = card ? card.querySelector('.project-expand') : null;
      if (!expand) return;

      const isOpen = expand.classList.toggle('open');
      expand.setAttribute('aria-hidden', String(!isOpen));
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.childNodes[0].textContent = isOpen ? 'Read Less ' : 'Read More ';
    });
  });
})();

/* ═══════════════════════════════════════════════════
   BACK TO TOP
═══════════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL for anchor links (fallback)
═══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ═══════════════════════════════════════════════════
   CONTACT FORM — Formspree AJAX with feedback
═══════════════════════════════════════════════════ */
(function initContactForm() {
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn  = document.getElementById('formSubmitBtn');
    const orig = btn.innerHTML;

    /* Warn if Formspree ID not configured */
    if (form.action.includes('YOUR_FORM_ID')) {
      feedback.className = 'form-feedback error';
      feedback.textContent = '⚠ Configure your Formspree form ID first.';
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span style="opacity:.6">Sending…</span>';
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        feedback.className = 'form-feedback success';
        feedback.textContent = '✓ Message sent! I\'ll reply within 24 hours.';
        form.reset();
        btn.innerHTML = orig;
        btn.disabled  = false;
      } else {
        throw new Error();
      }
    } catch {
      feedback.className = 'form-feedback error';
      feedback.textContent = '✗ Something went wrong. Please email me directly.';
      btn.innerHTML = orig;
      btn.disabled  = false;
    }
  });
})();
