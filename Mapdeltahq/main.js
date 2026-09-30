(() => {
  'use strict';

  /* Nav: hairline border once the page scrolls */
  const nav = document.getElementById('nav');
  const sentinel = document.querySelector('.nav-sentinel');
  if (nav && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      nav.classList.toggle('is-scrolled', !entry.isIntersecting);
    }).observe(sentinel);
  }

  /* Mobile menu */
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    nav.classList.toggle('is-open', open);
  };
  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
  }

  /* Scroll reveal */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* Snapshot form */
  const form = document.getElementById('snapshot-form');
  if (!form) return;

  const success = document.getElementById('form-success');
  const successMsg = document.getElementById('success-msg');
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');
  const label = submit.querySelector('.btn-label');

  const rules = {
    name: (v) => (v ? '' : 'Enter your name.'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid work email.'),
    brand: (v) => (v ? '' : 'Enter your brand name.'),
    website: (v) => (/^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)*\.[a-z]{2,}(\/\S*)?$/i.test(v) ? '' : 'Enter your brand’s website, e.g. yourbrand.com.'),
    concern: (v) => (v ? '' : 'Choose one option.'),
    size: (v) => (v ? '' : 'Choose your company size.'),
  };

  const validateField = (field) => {
    const rule = rules[field.name];
    if (!rule) return true;
    const msg = rule(field.value.trim());
    const err = document.getElementById(field.getAttribute('aria-describedby'));
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
    return !msg;
  };

  const fields = Object.keys(rules).map((n) => form.elements[n]);

  fields.forEach((field) => {
    const evt = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(evt, () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
    field.addEventListener('blur', () => {
      if (field.value.trim()) validateField(field);
    });
  });

  const showSuccess = (message) => {
    if (message) successMsg.textContent = message;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';

    const invalid = fields.filter((f) => !validateField(f));
    if (invalid.length) { invalid[0].focus(); return; }

    // Honeypot: bots fill hidden fields
    if (form.elements.company.value) { showSuccess(); return; }

    const data = Object.fromEntries(
      fields.map((f) => [f.name, f.value.trim()])
    );
    const endpoint = form.dataset.endpoint;

    if (!endpoint) {
      // No backend configured yet: hand off to the visitor's email client.
      const body = [
        `Name: ${data.name}`,
        `Work email: ${data.email}`,
        `Brand: ${data.brand}`,
        `Website: ${data.website}`,
        `Main marketplace concern: ${data.concern}`,
        `Company size: ${data.size}`,
      ].join('\n');
      window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Free violation snapshot: ' + data.brand)}&body=${encodeURIComponent(body)}`;
      showSuccess('Your email app should open with these details. Send it and we’ll reply with your snapshot within 48 hours.');
      return;
    }

    submit.disabled = true;
    label.textContent = 'Sending…';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      showSuccess();
    } catch {
      status.textContent = `Something went wrong. Please try again or email ${form.dataset.email}.`;
    } finally {
      submit.disabled = false;
      label.textContent = 'Get my free snapshot';
    }
  });
})();
