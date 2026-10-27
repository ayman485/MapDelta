(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Nav: hairline appears once the page scrolls */
  const nav = document.getElementById('nav');
  if (nav && 'IntersectionObserver' in window) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none';
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.prepend(sentinel);
    new IntersectionObserver(([entry]) => nav.classList.toggle('is-scrolled', !entry.isIntersecting)).observe(sentinel);
  }

  /* Mobile menu */
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    const setMenu = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
      menu.hidden = !open;
      if (nav) nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
  }

  /* Springs: a damped harmonic oscillator stepped at a fixed 120 Hz.
     Stiffness pulls toward the target, damping bleeds off velocity; a damping
     a little under critical (2 * sqrt(stiffness)) gives one barely visible overshoot. */
  const spring = ({ stiffness = 170, damping = 24, delay = 0, onUpdate, onDone }) => {
    let x = 0, v = 0, last = null;
    const h = 1 / 120;
    const tick = (now) => {
      let dt = last === null ? h : Math.min((now - last) / 1000, 0.064);
      last = now;
      while (dt > 0) {
        const step = Math.min(h, dt);
        v += (-stiffness * (x - 1) - damping * v) * step;
        x += v * step;
        dt -= step;
      }
      if (Math.abs(v) < 0.002 && Math.abs(x - 1) < 0.001) {
        onUpdate(1);
        if (onDone) onDone();
        return;
      }
      onUpdate(x);
      requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), delay);
  };

  /* Hero: each offer drops from the MAP line onto its price, then the below-MAP ones turn red */
  const plot = document.querySelector('.plot');
  if (plot && !reduceMotion) {
    const dots = [...plot.querySelectorAll('.dots path')];
    let left = dots.length;
    dots.forEach((dot, i) => {
      const from = parseFloat(dot.style.getPropertyValue('--from')) || 0;
      spring({
        stiffness: 210, damping: 19, delay: 250 + i * 28,
        onUpdate: (p) => { dot.style.transform = `translateY(${(from * (1 - p)).toFixed(2)}px)`; },
        onDone: () => { if (--left === 0) plot.classList.add('settled'); },
      });
    });
  } else if (plot) {
    plot.classList.add('settled');
  }

  /* Reveal on scroll, once: a short spring rise; siblings entering together stagger by 60ms */
  const reveals = document.querySelectorAll('.reveal');
  const show = (el, delay) => spring({
    stiffness: 120, damping: 20, delay,
    onUpdate: (p) => {
      el.style.opacity = Math.min(1, p * 1.4).toFixed(3);
      el.style.transform = `translateY(${(18 * (1 - p)).toFixed(2)}px)`;
    },
    onDone: () => { el.classList.add('in'); el.style.opacity = ''; el.style.transform = ''; },
  });
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((entry, i) => {
        io.unobserve(entry.target);
        show(entry.target, i * 60);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
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
