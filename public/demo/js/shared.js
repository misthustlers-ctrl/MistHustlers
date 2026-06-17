/* MistHustlers Premium Shared Scripts
   - UTM tracking
   - Scroll reveal animations with stagger
   - Counter animation
   - WhatsApp pre-fill
   - Analytics event hooks (no console.log)
   - Sticky footer
   - Form success state
   - Header scroll background
   - Reduced motion respect
*/

(function () {
  const WHATSAPP_NUMBER = 'XXXXXXXXXX'; // Replace with real MistHustlers number
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. UTM Tracking: preserve query params on all internal links
  function preserveUTMs() {
    const utm = new URLSearchParams(window.location.search);
    if (!utm.toString()) return;
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me')) return;
      try {
        const url = new URL(href, window.location.origin);
        utm.forEach((v, k) => { if (!url.searchParams.has(k)) url.searchParams.set(k, v); });
        a.setAttribute('href', url.pathname + url.search + url.hash);
      } catch (e) {}
    });
  }

  // 2. Scroll reveal with stagger
  function initReveal() {
    if (prefersReducedMotion) return;
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parent = entry.target.closest('.reveal-stagger');
          if (parent) {
            const children = Array.from(parent.querySelectorAll('.reveal'));
            children.forEach((child, index) => {
              setTimeout(() => child.classList.add('in-view'), index * 100);
            });
            observer.unobserve(parent);
          } else {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.20, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
    document.querySelectorAll('.reveal-stagger').forEach(el => observer.observe(el));
  }

  // 3. Counter animation
  function initCounters() {
    if (prefersReducedMotion) return;
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // 4. WhatsApp pre-fill helper
  function initWhatsAppLinks() {
    document.querySelectorAll('[data-whatsapp]').forEach(el => {
      const message = el.dataset.whatsapp || 'I saw your demo, interested!';
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      el.href = url;
      el.addEventListener('click', () => trackEvent('whatsapp_click', { demo: el.dataset.demo || 'unknown' }));
    });
  }

  // 5. Analytics event hooks (GA4 compatible)
  function trackEvent(name, params = {}) {
    if (window.gtag) {
      window.gtag('event', name, params);
    } else if (window.dataLayer) {
      window.dataLayer.push({ event: name, ...params });
    }
  }

  function initCTATracking() {
    document.querySelectorAll('[data-track]').forEach(el => {
      el.addEventListener('click', () => {
        const eventName = el.dataset.track;
        const demo = el.dataset.demo || 'unknown';
        trackEvent(eventName, { demo, label: el.textContent.trim() });
      });
    });

    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', handleFormSubmit);
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const demo = form.dataset.demo || 'unknown';
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.textContent : '';

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }

    trackEvent('form_submit', { demo, form_id: form.id || 'unnamed' });

    setTimeout(() => {
      form.style.display = 'none';
      let success = form.parentElement.querySelector('.form-success');
      if (!success) {
        success = document.createElement('div');
        success.className = 'form-success';
        success.innerHTML = '✓ Thank you! We will contact you shortly.';
        success.setAttribute('role', 'status');
        form.parentElement.insertBefore(success, form.nextSibling);
      }
      success.classList.add('visible');

      if (btn) {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    }, 1200);
  }

  // 6. Sticky footer after scroll
  function initStickyFooter() {
    const footer = document.querySelector('.sticky-footer');
    if (!footer) return;
    let shown = false;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400 && !shown) {
        footer.classList.add('show');
        shown = true;
      }
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    preserveUTMs();
    initReveal();
    initCounters();
    initWhatsAppLinks();
    initCTATracking();
    initStickyFooter();
  });

  // Expose globally
  window.MistHustlers = { trackEvent, WHATSAPP_NUMBER };
})();
