(() => {
  'use strict';

  /* Nav: hairline and solid background appear once the page scrolls */
  const nav = document.getElementById('nav');
  if (nav && 'IntersectionObserver' in window) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none';
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.prepend(sentinel);
    new IntersectionObserver(([entry]) => nav.classList.toggle('is-scrolled', !entry.isIntersecting)).observe(sentinel);
  }

  /* Email links: a mailto does nothing on computers without a mail app,
     so a click also copies the address and offers Gmail. */
  const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (mailLinks.length) {
    const toast = document.createElement('div');
    toast.className = 'mail-toast';
    toast.setAttribute('role', 'status');
    toast.hidden = true;
    document.body.append(toast);
    let timer;
    mailLinks.forEach((link) => link.addEventListener('click', () => {
      const address = link.getAttribute('href').slice(7).split('?')[0];
      const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(address)}`;
      const copied = navigator.clipboard ? navigator.clipboard.writeText(address).then(() => true, () => false) : Promise.resolve(false);
      copied.then((ok) => {
        toast.textContent = ok ? `Copied ${address}` : address;
        const a = document.createElement('a');
        a.href = gmail; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Open in Gmail';
        toast.append(a);
        toast.hidden = false;
        clearTimeout(timer);
        timer = setTimeout(() => { toast.hidden = true; }, 6000);
      });
    }));
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

  /* Entrance: fade and short rise, once. Without motion (or JS) everything shows. */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && document.documentElement.classList.contains('motion')) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        entry.target.classList.add('in');
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* Package preview tabs (without JS, all three views are shown in sequence) */
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  if (tabs.length) {
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        select(tabs[(keys[e.key] + tabs.length) % tabs.length], true);
      });
    });
    select(tabs[0]);
  }

  /* Contact form. Fields opt in with data-key (label sent in the email) and data-rule
     (required | email | mc | jobs). The subject is data-subject + the value of data-subject-field. */
  const form = document.getElementById('contact-form');
  if (!form) return;

  const success = document.getElementById('form-success');
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');
  const label = submit.querySelector('.btn-label');
  const idleLabel = label.textContent;
  let sending = false;
  let sent = false;

  const rules = {
    required: (v, f) => (v ? '' : `Enter ${f.dataset.label || 'this field'}.`),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid business email.'),
    mc: (v) => (v === '' || /^(mc-?)?\d{4,8}$/i.test(v) ? '' : 'Use digits only, for example 123456 or MC-123456.'),
    jobs: (v) => (v === '' || (Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 999) ? '' : 'Enter a whole number between 0 and 999.'),
  };
  const fields = [...form.elements].filter((el) => el.dataset && el.dataset.rule);
  const inputs = [...form.elements].filter((el) => el.name && el.dataset && el.dataset.key);

  const validate = (field) => {
    const msg = rules[field.dataset.rule](field.value.trim(), field);
    const err = document.getElementById(field.getAttribute('aria-describedby'));
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
    return !msg;
  };

  fields.forEach((field) => {
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
    field.addEventListener('blur', () => { if (field.value.trim()) validate(field); });
  });

  const showSuccess = () => {
    sent = true;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending || sent) return;          // blocks double submissions
    status.textContent = '';

    const invalid = fields.filter((f) => !validate(f));
    if (invalid.length) { invalid[0].focus(); return; }

    // Honeypot: only bots fill the hidden field
    if (form.elements.website && form.elements.website.value) { showSuccess(); return; }

    const data = {};
    inputs.forEach((el) => { data[el.dataset.key] = el.value.trim() || (el.dataset.rule === 'required' || el.dataset.rule === 'email' ? '' : (el.name === 'message' ? '(none)' : '(not given)')); });
    const subject = `${form.dataset.subject}: ${form.elements[form.dataset.subjectField].value.trim()}`;
    const email = form.elements.email.value.trim();

    sending = true;
    submit.disabled = true;
    label.textContent = 'Sending…';
    try {
      const res = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _replyto: email, _subject: subject, _template: 'table', _captcha: 'false' }),
      });
      const out = await res.json().catch(() => ({}));
      // FormSubmit answers 200 with success "false" when delivery didn't happen
      if (!res.ok || String(out.success) === 'false') throw new Error(out.message || String(res.status));
      showSuccess();
    } catch {
      const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
      const mailto = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = '';
      status.append('That didn’t go through, and nothing was lost. Please try again, or ');
      const a = document.createElement('a');
      a.href = mailto; a.textContent = `email ${form.dataset.email}`;
      status.append(a, '.');
    } finally {
      sending = false;
      if (!sent) { submit.disabled = false; label.textContent = idleLabel; }
    }
  });
})();
