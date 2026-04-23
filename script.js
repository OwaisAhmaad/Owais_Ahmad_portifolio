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
    /* sticky bg */
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    /* back-to-top */
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);

    /* active nav link */
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

  /* close on link click */
  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  /* close on outside click */
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
   CONTACT FORM — Formspree feedback
═══════════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;

    /* skip if Formspree ID not yet configured */
    if (form.action.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      btn.innerHTML = '✓ Configure Formspree ID first';
      setTimeout(() => { btn.innerHTML = orig; }, 3000);
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span style="opacity:.6">Sending…</span>';

    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        btn.innerHTML = '✓ Message sent!';
        form.reset();
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 4000);
      } else {
        throw new Error();
      }
    } catch {
      btn.innerHTML = '✗ Error — try again';
      btn.disabled = false;
      setTimeout(() => { btn.innerHTML = orig; }, 3000);
    }
    e.preventDefault();
  });
})();
