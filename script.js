// ezryn® — cerebro del portafolio
(() => {
  console.log('%cezryn® — hola, curioso 👀\n%csitios · mods · bots — hola@ezryn.cl', 'font-size:20px;font-weight:900', 'color:#97919f');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  // ---------- Loader ----------
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loadBar');
  const pct = document.getElementById('loadPct');
  document.body.classList.add('locked');
  let p = 0;
  const tick = setInterval(() => {
    p = Math.min(100, p + Math.random() * 16 + 6);
    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = Math.round(p);
    if (p >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        loader?.classList.add('done');
        document.body.classList.remove('locked');
        revealAll();
      }, 350);
    }
  }, 130);

  // ---------- Año + hora Chillán ----------
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const clock = document.getElementById('clock');
  const updateClock = () => {
    try {
      const t = new Intl.DateTimeFormat('es-CL', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Santiago' }).format(new Date());
      if (clock) clock.textContent = t;
    } catch { if (clock) clock.textContent = new Date().toLocaleTimeString().slice(0, 5); }
  };
  updateClock(); setInterval(updateClock, 20000);

  // ---------- Progreso + nav ----------
  const pbar = document.getElementById('progressBar');
  const nav = document.getElementById('nav');
  addEventListener('scroll', () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (pbar) pbar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    nav?.classList.toggle('scrolled', h.scrollTop > 30);
  }, { passive: true });

  // ---------- Menú ----------
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const toggleMenu = (force) => {
    const open = force ?? !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('locked', open);
  };
  burger?.addEventListener('click', () => toggleMenu());
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // ---------- Reveal ----------
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  const revealAll = () => document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  // por si el loader falla
  setTimeout(revealAll, 2500);

  // ---------- Contadores ----------
  const cio = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count;
      cio.unobserve(el);
      if (reduced) { el.textContent = target; return; }
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min((t - t0) / 1200, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  // ---------- Acordeón ----------
  document.querySelectorAll('#acc li').forEach(li => {
    const head = li.querySelector('.acc-head');
    const body = li.querySelector('.acc-body');
    const sync = () => { body.style.maxHeight = li.classList.contains('open') ? body.scrollHeight + 'px' : '0px'; };
    sync(); addEventListener('resize', sync);
    head?.addEventListener('click', () => {
      const wasOpen = li.classList.contains('open');
      document.querySelectorAll('#acc li.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.acc-head')?.setAttribute('aria-expanded', 'false');
        o.querySelector('.acc-body').style.maxHeight = '0px';
      });
      if (!wasOpen) {
        li.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // ---------- Filtros ----------
  const fbtns = document.querySelectorAll('.filters button');
  const cards = document.querySelectorAll('#stack .card');
  fbtns.forEach(b => b.addEventListener('click', () => {
    fbtns.forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    const f = b.dataset.f;
    cards.forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.cat !== f));
  }));

  // ---------- Magnéticos + tilt ----------
  if (fine && !reduced) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ---------- Polvo de píxeles ----------
  const canvas = document.getElementById('dust');
  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d');
    let W, H, parts = [];
    const resize = () => {
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
      parts = Array.from({ length: Math.min(90, W / 14) }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        s: Math.random() * 2.2 + 0.6, v: Math.random() * 0.35 + 0.08,
        o: Math.random() * 0.5 + 0.15, hue: Math.random() > 0.82,
      }));
    };
    resize(); addEventListener('resize', resize);
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      parts.forEach(pt => {
        pt.y -= pt.v;
        if (pt.y < -4) { pt.y = H + 4; pt.x = Math.random() * W; }
        ctx.globalAlpha = pt.o;
        ctx.fillStyle = pt.hue ? '#d8ff3d' : '#a898ff';
        ctx.fillRect(pt.x, pt.y, pt.s, pt.s);
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    })();
  }

  // ---------- Copiar correo ----------
  const toast = document.getElementById('toast');
  document.getElementById('copyBtn')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('hola@ezryn.cl');
      toast.textContent = 'hola@ezryn.cl copiado ✓';
    } catch { toast.textContent = 'escríbeme: hola@ezryn.cl'; }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  });

  // ---------- Easter egg: E x3 ----------
  let presses = [], timer;
  addEventListener('keydown', e => {
    if (e.key.toLowerCase() !== 'e' || e.metaKey || e.ctrlKey) return;
    presses.push(Date.now());
    clearTimeout(timer);
    timer = setTimeout(() => (presses = []), 1200);
    if (presses.length >= 3) {
      presses = [];
      document.body.classList.toggle('party');
      toast.textContent = document.body.classList.contains('party')
        ? 'modo creativo activado ⚡'
        : 'modo creativo desactivado';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1800);
    }
  });
})();
