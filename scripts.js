/* ============================================================
   WIS — Unified JavaScript System
   WebRing Integrated Services
   ============================================================ */

(function () {
  'use strict';

  // ---------- Scroll Reveal System ----------
  function initRevealAnimations() {
    const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .img-reveal';
    const observerOptions = {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Don't unobserve — allows re-entry if needed
        }
      });
    }, observerOptions);

    document.querySelectorAll(revealSelectors).forEach(el => observer.observe(el));
  }

  // ---------- Animated Counters ----------
  function initCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 2000;
          const start = performance.now();

          if (isNaN(target)) return;

          function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * target);

            el.textContent = prefix + current.toLocaleString() + suffix;

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = prefix + target.toLocaleString() + suffix;
            }
          }

          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
  }

  // ---------- Navigation Scroll Effect ----------
  function initNavScroll() {
    const nav = document.querySelector('.nav-main');
    if (!nav) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 80) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- Mobile Menu ----------
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-overlay');
    if (!hamburger || !mobileMenu) return;

    function toggleMenu() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) toggleMenu();
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) toggleMenu();
    });
  }

  // ---------- FAQ Accordion ----------
  function initFaqAccordions() {
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        const content = item.querySelector('.faq-content');
        const isOpen = item.classList.contains('open');

        // Close all others in same container
        const container = item.parentElement;
        container.querySelectorAll('.faq-item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-content').style.maxHeight = null;
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('open');
          content.style.maxHeight = null;
        } else {
          item.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // ---------- Category Accordion (Machines Page) ----------
  function initCategoryAccordions() {
    document.querySelectorAll('.category-header').forEach(header => {
      header.addEventListener('click', () => {
        const section = header.closest('.category-section');
        const content = section.querySelector('.category-content');
        const isOpen = section.classList.contains('open');

        if (isOpen) {
          section.classList.remove('open');
          content.style.maxHeight = null;
        } else {
          section.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // ---------- Smooth Anchor Scroll ----------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.nav-main')?.offsetHeight || 80;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      });
    });
  }

  // ---------- Back to Top ----------
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 600) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Hero Parallax ----------
  function initParallax() {
    const heroSection = document.querySelector('.hero-parallax');
    if (!heroSection) return;

    const bg = heroSection.querySelector('.hero-bg');
    if (!bg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const rate = scrolled * 0.3;
          if (scrolled < window.innerHeight) {
            bg.style.transform = `translateY(${rate}px) scale(1.1)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- Form Validation + WhatsApp Redirect ----------
  function initFormValidation() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let valid = true;
        form.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
          if (!field.value.trim()) {
            field.style.borderColor = 'var(--wis-red-500)';
            field.style.boxShadow = '0 0 0 3px rgba(186, 26, 26, 0.1)';
            valid = false;
          } else {
            field.style.borderColor = '';
            field.style.boxShadow = '';
          }
        });

        if (valid) {
          // Collect form data for WhatsApp message
          const fd = new FormData(form);
          const name = fd.get('name') || '';
          const email = fd.get('email') || '';
          const phone = fd.get('phone') || '';
          const category = fd.get('category') || '';
          const machine = fd.get('machine') || '';
          const capacity = fd.get('capacity') || '';
          const timeline = fd.get('timeline') || '';
          const message = fd.get('message') || '';

          let waMsg = 'Hello WebRing Integrated Services,\n\n';
          if (name) waMsg += 'My name is ' + name + '.\n';
          if (email) waMsg += 'Email: ' + email + '\n';
          if (phone) waMsg += 'Phone: ' + phone + '\n';
          if (category) waMsg += '\nProcessing Category: ' + category + '\n';
          if (machine) waMsg += 'Machine: ' + machine + '\n';
          if (capacity) waMsg += 'Estimated Capacity: ' + capacity + '\n';
          if (timeline) waMsg += 'Timeline: ' + timeline + '\n';
          if (message) waMsg += '\nAdditional Details:\n' + message + '\n';
          waMsg += '\nKindly send pricing, specifications, and delivery timeline.\n\nThank you.';

          const waUrl = 'https://api.whatsapp.com/send/?phone=2349086080507&text=' + encodeURIComponent(waMsg);

          // Show success then redirect
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Opening WhatsApp...';
            submitBtn.style.background = '#25D366';
          }

          setTimeout(() => { window.open(waUrl, '_blank'); }, 600);
        }
      });
    });
  }

  // ---------- Image Lazy Loading Placeholder ----------
  function initImageHandling() {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        this.style.background = 'linear-gradient(135deg, var(--wis-blue-800), var(--wis-blue-900))';
        this.style.minHeight = '200px';
      });
    });
  }

  // ---------- Initialize Everything ----------
  function init() {
    initRevealAnimations();
    initCounters();
    initNavScroll();
    initMobileMenu();
    initFaqAccordions();
    initCategoryAccordions();
    initSmoothScroll();
    initBackToTop();
    initParallax();
    initFormValidation();
    initImageHandling();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
