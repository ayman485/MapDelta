(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const store = {
    get(key) { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } },
    set(key, value) { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } },
  };

  /* ------------------------------------------------------------------------
     Measurement. Provider-agnostic: events go to window.dataLayer, and to
     Plausible or Vercel Analytics only if the founder later installs one.
     No third-party script is loaded by this file.
     ------------------------------------------------------------------------ */
  const attribution = (() => {
    const saved = store.get('md_attr');
    if (saved) return saved;
    const params = new URLSearchParams(location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const attr = {};
    keys.forEach((k) => { if (params.get(k)) attr[k] = params.get(k).slice(0, 120); });
    let ref = '';
    try { ref = document.referrer && new URL(document.referrer).hostname !== location.hostname ? new URL(document.referrer).hostname : ''; } catch { ref = ''; }
    if (ref) attr.referrer = ref;
    attr.landing_page = location.pathname;
    store.set('md_attr', attr);
    return attr;
  })();

  const track = (event, props = {}) => {
    const payload = { event, page: location.pathname, ...attribution, ...props };
    (window.dataLayer = window.dataLayer || []).push(payload);
    if (typeof window.plausible === 'function') window.plausible(event, { props: payload });
    if (typeof window.va === 'function') window.va('event', { name: event, data: payload });
  };
  track('page_view');
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track, { cta: el.dataset.cta || el.textContent.trim().slice(0, 60) });
  });

  /* ------------------------------------------------------------------------
     Spring: a damped harmonic oscillator stepped at a fixed 120 Hz.
     ------------------------------------------------------------------------ */
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
      if (Math.abs(v) < 0.002 && Math.abs(x - 1) < 0.001) { onUpdate(1); if (onDone) onDone(); return; }
      onUpdate(x);
      requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), delay);
  };

  /* ------------------------------------------------------------------------
     Header: background once scrolled; mobile menu sheet
     ------------------------------------------------------------------------ */
  const header = $('#site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const toggle = $('.menu-toggle', header);
    const sheet = $('#menu-sheet');
    if (toggle && sheet) {
      const label = $('.menu-label', toggle);
      const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Close' : 'Menu';
        sheet.hidden = !open;
        header.classList.toggle('is-open', open);
        if (open) { const first = $('a', sheet); if (first) first.focus(); }
      };
      toggle.addEventListener('click', () => setOpen(sheet.hidden));
      sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !sheet.hidden) { setOpen(false); toggle.focus(); }
      });
    }
  }

  /* ------------------------------------------------------------------------
     Email links: a mailto does nothing on computers without a mail app,
     so a click also copies the address and offers Gmail.
     ------------------------------------------------------------------------ */
  const mailLinks = $$('a[href^="mailto:"]');
  if (mailLinks.length) {
    const toast = document.createElement('div');
    toast.className = 'mail-toast';
    toast.setAttribute('role', 'status');
    toast.hidden = true;
    document.body.append(toast);
    let timer;
    mailLinks.forEach((link) => link.addEventListener('click', () => {
      const address = link.getAttribute('href').slice(7).split('?')[0];
      const copied = navigator.clipboard ? navigator.clipboard.writeText(address).then(() => true, () => false) : Promise.resolve(false);
      copied.then((ok) => {
        toast.textContent = ok ? `Copied ${address}` : address;
        const a = document.createElement('a');
        a.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(address)}`;
        a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Open in Gmail';
        toast.append(a);
        toast.hidden = false;
        clearTimeout(timer);
        timer = setTimeout(() => { toast.hidden = true; }, 6000);
      });
    }));
  }

  /* ------------------------------------------------------------------------
     Hero: headline rises in, ledger rows settle, the copper trail draws.
     Content is readable from first paint; nothing waits on this.
     ------------------------------------------------------------------------ */
  const hero = $('.hero');
  if (hero) {
    const ledger = $('.ledger-doc', hero);
    const trail = $('.trail', hero);
    if (reduceMotion) {
      hero.classList.add('in');
    } else {
      requestAnimationFrame(() => hero.classList.add('in'));
      if (ledger) {
        $$('tbody tr', ledger).forEach((tr, i) => { tr.style.transitionDelay = `${300 + i * 60}ms`; });
        setTimeout(() => ledger.classList.add('in'), 60);
      }
      if (trail) setTimeout(() => trail.classList.add('in'), 900);
    }
  }

  /* ------------------------------------------------------------------------
     Reveal on scroll, once: a short spring rise; siblings stagger by 60ms
     ------------------------------------------------------------------------ */
  const reveals = $$('.reveal');
  const show = (el, delay) => spring({
    stiffness: 120, damping: 20, delay,
    onUpdate: (p) => {
      el.style.opacity = Math.min(1, p * 1.4).toFixed(3);
      el.style.transform = `translateY(${(16 * (1 - p)).toFixed(2)}px)`;
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

  /* ------------------------------------------------------------------------
     Problem: scattered records spring into an aligned case file
     ------------------------------------------------------------------------ */
  const slips = $('.slips');
  if (slips && !reduceMotion && 'IntersectionObserver' in window) {
    const items = $$('.slip', slips);
    const offsets = items.map((el) => ({
      x: parseFloat(el.dataset.x || 0), y: parseFloat(el.dataset.y || 0), r: parseFloat(el.dataset.r || 0),
    }));
    const place = (el, o, k) => { el.style.transform = `translate(${(o.x * k).toFixed(1)}px, ${(o.y * k).toFixed(1)}px) rotate(${(o.r * k).toFixed(2)}deg)`; };
    items.forEach((el, i) => place(el, offsets[i], 1));
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      items.forEach((el, i) => spring({
        stiffness: 90, damping: 15, delay: 150 + i * 70,
        onUpdate: (p) => place(el, offsets[i], 1 - p),
        onDone: () => { el.style.transform = ''; },
      }));
    }, { threshold: 0.35 });
    io.observe(slips);
  }

  /* ------------------------------------------------------------------------
     Approach: the stage spine fills as the section scrolls past (read-only,
     no scroll hijacking); stages light as the fill reaches them.
     ------------------------------------------------------------------------ */
  const stages = $('.stages');
  if (stages) {
    const fill = $('.spine-fill', stages);
    const rows = $$('.stage-row', stages);
    if (reduceMotion) {
      rows.forEach((r) => r.classList.add('is-lit'));
    } else {
      let queued = false;
      const update = () => {
        queued = false;
        const box = stages.getBoundingClientRect();
        const line = window.innerHeight * 0.6;
        const p = Math.max(0, Math.min(1, (line - box.top) / box.height));
        fill.style.setProperty('--p', p.toFixed(4));
        rows.forEach((r) => r.classList.toggle('is-lit', r.getBoundingClientRect().top + 40 < line));
      };
      const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
    }
  }

  /* ------------------------------------------------------------------------
     Illustrative claim register: filter by status
     ------------------------------------------------------------------------ */
  const register = $('.register');
  if (register) {
    const chips = $$('.chip', register);
    const rows = $$('tbody tr', register);
    const count = $('#register-count');
    const apply = (filter) => {
      let shown = 0;
      rows.forEach((tr) => {
        const match = filter === 'all' || tr.dataset.group === filter;
        if (match && tr.hidden && !reduceMotion) { tr.classList.remove('fade'); void tr.offsetWidth; tr.classList.add('fade'); }
        tr.hidden = !match;
        if (match) shown += 1;
      });
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));
      if (count) count.textContent = `${shown} of ${rows.length} illustrative cases shown`;
    };
    chips.forEach((c) => c.addEventListener('click', () => { apply(c.dataset.filter); track('register_filter', { filter: c.dataset.filter }); }));
    apply('all');
  }

  /* ------------------------------------------------------------------------
     Contact form
     ------------------------------------------------------------------------ */
  const form = $('#contact-form');
  if (!form) return;

  const success = $('#form-success');
  const status = $('.form-status', form);
  const submit = $('button[type="submit"]', form);
  const label = $('.btn-label', submit);
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const rules = {
    name: (v) => (v ? '' : 'Enter your name.'),
    company: (v) => (v ? '' : 'Enter your company name.'),
    email: (v) => (emailOk(v) ? '' : 'Enter a valid business email.'),
    title: (v) => (v ? '' : 'Enter your job title.'),
    retailers: (v) => (v ? '' : 'Tell us which retailers you supply.'),
    problem: (v) => (v.length >= 10 ? '' : 'Give us a sentence or two about the current situation.'),
  };
  const fields = Object.keys(rules).map((n) => form.elements[n]);

  const validate = (field) => {
    const msg = rules[field.name](field.value.trim());
    const err = document.getElementById(field.getAttribute('aria-describedby').split(' ')[0]);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
    return !msg;
  };
  fields.forEach((field) => {
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
    field.addEventListener('blur', () => { if (field.value.trim()) validate(field); });
  });

  let started = false;
  form.addEventListener('input', () => { if (!started) { started = true; track('form_start'); } });

  const values = () => ({
    name: form.elements.name.value.trim(),
    company: form.elements.company.value.trim(),
    email: form.elements.email.value.trim(),
    title: form.elements.title.value.trim(),
    retailers: form.elements.retailers.value.trim(),
    volume: form.elements.volume.value,
    problem: form.elements.problem.value.trim(),
  });
  const sourceLine = () => Object.entries(attribution).map(([k, v]) => `${k}=${v}`).join(', ') || '(direct)';
  const mailtoFor = (d) => `mailto:${form.dataset.email}?subject=${encodeURIComponent(`Deduction backlog: ${d.company}`)}&body=${encodeURIComponent(
    `Name: ${d.name}\nCompany: ${d.company}\nBusiness email: ${d.email}\nJob title: ${d.title}\nRetailers: ${d.retailers}\nApproximate monthly deduction volume: ${d.volume || '(not given)'}\n\n${d.problem}`)}`;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    const invalid = fields.filter((f) => !validate(f));
    if (invalid.length) { invalid[0].focus(); return; }

    // Honeypot: only bots fill the hidden field
    if (form.elements.website.value) { form.hidden = true; success.hidden = false; return; }

    const d = values();
    submit.disabled = true;
    label.textContent = 'Sending…';
    try {
      const res = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          'Name': d.name,
          'Company': d.company,
          'Business email': d.email,
          'Job title': d.title,
          'Retailers': d.retailers,
          'Approximate monthly deduction volume': d.volume || '(not given)',
          'Current problem': d.problem,
          'Source': sourceLine(),
          _replyto: d.email,
          _subject: `Deduction backlog enquiry: ${d.company}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const out = await res.json().catch(() => ({}));
      // FormSubmit answers 200 with success "false" when delivery didn't happen
      if (!res.ok || String(out.success) === 'false') throw new Error(out.message || String(res.status));
      track('form_submit', { volume: d.volume || 'not_given' });
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      track('form_error');
      status.textContent = 'That didn’t go through. Please try again, or ';
      const a = document.createElement('a');
      a.href = mailtoFor(d);
      a.textContent = `email ${form.dataset.email}`;
      status.append(a, ' with the same details.');
    } finally {
      submit.disabled = false;
      label.textContent = 'Discuss Your Deduction Backlog';
    }
  });
})();
