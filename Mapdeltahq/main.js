(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    const setMenu = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
      menu.hidden = !open;
    };
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
  }

  /* Quiet reveal on scroll, once */
  const reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* Anatomy of a flag: numbered hotspots select a margin note.
     Without JS the hotspots are plain links to the notes list. */
  const anatomy = document.querySelector('.anatomy');
  if (anatomy) {
    const hots = anatomy.querySelectorAll('.hot');
    const rows = anatomy.querySelectorAll('.l-row[data-note]');
    const notes = anatomy.querySelectorAll('.notes li');
    const sideBySide = window.matchMedia('(min-width: 1100px)');

    const select = (n) => {
      notes.forEach((li) => li.classList.toggle('is-active', li.id === `note-${n}`));
      rows.forEach((row) => row.classList.toggle('is-active', row.dataset.note === n));
      hots.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#note-${n}`)));
    };

    hots.forEach((a) => {
      const n = a.getAttribute('href').replace('#note-', '');
      a.addEventListener('click', (e) => {
        e.preventDefault();
        select(n);
        if (!sideBySide.matches) {
          document.getElementById(`note-${n}`).scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
      a.addEventListener('mouseenter', () => select(n));
      a.addEventListener('focus', () => select(n));
    });
    select('1');
  }

  /* Snapshot request form */
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
    website: (v) => (/^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)*\.[a-z]{2,}(\/\S*)?$/i.test(v) ? '' : 'Enter your brand’s website, for example yourbrand.com.'),
  };
  const fields = Object.keys(rules).map((n) => form.elements[n]);

  const validate = (field) => {
    const msg = rules[field.name](field.value.trim());
    const err = document.getElementById(field.getAttribute('aria-describedby'));
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
    return !msg;
  };

  fields.forEach((field) => {
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
    field.addEventListener('blur', () => { if (field.value.trim()) validate(field); });
  });

  const showSuccess = (message, title) => {
    if (message) successMsg.textContent = message;
    if (title) success.querySelector('.success-title').textContent = title;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';

    const invalid = fields.filter((f) => !validate(f));
    if (invalid.length) { invalid[0].focus(); return; }

    // Honeypot: only bots fill the hidden field
    if (form.elements.company.value) { showSuccess(); return; }

    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      website: form.elements.website.value.trim(),
      product: form.elements.product.value.trim(),
    };
    const endpoint = form.dataset.endpoint;

    if (!endpoint) {
      // TODO(owner): no form backend yet. Hand the request to the visitor's email app
      // so nothing is dropped, and say so plainly.
      const body = [
        `Name: ${data.name}`,
        `Work email: ${data.email}`,
        `Brand website: ${data.website}`,
        `Product and MAP price: ${data.product || '(not given)'}`,
      ].join('\n');
      window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Snapshot request: ' + data.website)}&body=${encodeURIComponent(body)}`;
      showSuccess(`Your email app should have opened with these details. Send that email to ${form.dataset.email} and we’ll reply within one US business day.`, 'One more step.');
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
      status.textContent = `That didn’t go through. Please try again, or email ${form.dataset.email}.`;
    } finally {
      submit.disabled = false;
      label.textContent = 'Request my snapshot';
    }
  });
})();
