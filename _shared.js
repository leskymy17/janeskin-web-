(function () {

  // ── 1. Scroll animations (fade-in) ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ── 2. Nav sticky ──
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  nav.classList.toggle('scrolled', window.scrollY > 40);

  // ── 3. Hamburger ──
  const hamburger     = document.getElementById('hamburger');
  const mobileMenu    = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    mobileOverlay.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileOverlay.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // ── 4. Smooth scroll pro lokální #anchor linky ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight - 16,
          behavior: 'smooth',
        });
      }
    });
  });

  // ── 5. Na homepage: zachyť index.html# linky pro smooth scroll ──
  const isHomepage = /\/(index\.html)?$/.test(window.location.pathname);
  if (isHomepage) {
    document.querySelectorAll('a[href^="index.html#"]').forEach(a => {
      a.addEventListener('click', e => {
        const hash = a.getAttribute('href').replace('index.html', '');
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight - 16,
            behavior: 'smooth',
          });
        }
      });
    });
  }

})();
