// nav.js – Navigation + effets de fond globaux

const pages = [
  { href: 'index.html',       label: 'Accueil' },
  { href: 'cv.html',          label: 'Mon CV' },
  { href: 'ateliers.html',    label: 'Ateliers' },
  { href: 'stages.html',      label: 'Stages' },
  { href: 'veille.html',      label: 'Veille' },
  { href: 'competences.html', label: 'Compétences' },
];

function buildNav() {
  const current = location.pathname.split('/').pop() || 'index.html';

  // ── Curseur custom ───────────────────────────────────────────────────
  const cursorCSS = document.createElement('link');
  cursorCSS.rel = 'stylesheet'; cursorCSS.href = 'cursor.css';
  document.head.appendChild(cursorCSS);

  const cursorJS = document.createElement('script');
  cursorJS.src = 'cursor.js';
  document.head.appendChild(cursorJS);

  // ── Navbar ──────────────────────────────────────────────────────────
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <a class="nav-logo" href="index.html">TUCOO</a>
    <ul class="nav-links">
      ${pages.map(p =>
        `<li><a href="${p.href}" class="${current===p.href?'active':''}">${p.label}</a></li>`
      ).join('')}
    </ul>`;
  document.body.prepend(nav);

  // ── Fond : dégradés ─────────────────────────────────────────────────
  const bg = document.createElement('div'); bg.className='bg-animated';
  document.body.prepend(bg);

  // ── Fond : nébuleuse ────────────────────────────────────────────────
  const neb = document.createElement('div'); neb.className='nebula';
  neb.innerHTML='<div class="nebula-blob nb1"></div><div class="nebula-blob nb2"></div><div class="nebula-blob nb3"></div>';
  document.body.prepend(neb);

  // ── Fond : grille ───────────────────────────────────────────────────
  const grid = document.createElement('div'); grid.className='grid-overlay';
  document.body.prepend(grid);

  // ── Canvas particules ───────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  initParticles(canvas);

  // ── Lightbox ────────────────────────────────────────────────────────
  const lb = document.createElement('div');
  lb.id = 'lightbox-overlay';
  lb.innerHTML = `
    <img id="lightbox-img" src="" alt="">
    <button id="lightbox-close">✕</button>
    <div id="lightbox-caption"></div>
  `;
  document.body.appendChild(lb);

  const lbImg     = document.getElementById('lightbox-img');
  const lbClose   = document.getElementById('lightbox-close');
  const lbCaption = document.getElementById('lightbox-caption');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbCaption.textContent = caption || '';
    lbCaption.style.display = caption ? 'block' : 'none';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 350);
  }

  lbClose.onclick = closeLightbox;
  lb.addEventListener('click', e => { if (e.target === lb || e.target === lbImg) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // Rend toutes les images zoomables (sauf logos et curseur)
  function initZoomable() {
    const exclude = '#cursor-canvas, .nav-card-icon, .stage-logo-wrap img, #modal-logo-img, .gallery-logo-item img, .et-glpi, .et-mdm, .et-n8n, .ap-tab-icon';
    document.querySelectorAll('img').forEach(img => {
      if (img.closest(exclude) || img.classList.contains('no-zoom')) return;
      if (img.classList.contains('zoomable')) return;
      img.classList.add('zoomable');
      img.addEventListener('click', () => {
        const cap = img.alt || img.closest('.schema-box')?.nextElementSibling?.textContent || '';
        openLightbox(img.src, cap);
      });
    });
  }

  // Lance une première fois + surveille les changements DOM (images chargées dynamiquement)
  setTimeout(initZoomable, 500);
  const zoomObs = new MutationObserver(() => initZoomable());
  zoomObs.observe(document.body, { childList: true, subtree: true });

  // ── Footer ──────────────────────────────────────────────────────────
  const footer = document.createElement('footer');
  footer.innerHTML = `&lt;TUCOO.Mathis&gt; — BTS SIO SISR — Lycée Saint John Perse, Pau — 2024/2026`;
  document.body.appendChild(footer);

  // ── Barre de progression scroll ─────────────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.appendChild(progressBar);

  // ── Bouton retour en haut ────────────────────────────────────────────
  const backTop = document.createElement('button');
  backTop.id = 'back-top';
  backTop.innerHTML = '↑';
  backTop.title = 'Retour en haut';
  backTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(backTop);

  // ── Scroll-reveal ───────────────────────────────────────────────────
  initScrollReveal();

  // ── Effets scroll globaux ────────────────────────────────────────────
  initScrollEffects();
}

/* ═══════════════════════════════════════════════════════
   CANVAS – version optimisée pour les FPS
   Optimisations :
   - shadowBlur supprimé (très coûteux sur GPU)
   - Particules réduites à 40
   - Distance connexions réduite (moins de paires)
   - Pulses limités à 8 max simultanés
   - setInterval remplacé par timer dans RAF
   - Colonnes de code : moins de colonnes, refresh plus rare
   - Pré-calcul des paths en une seule passe O(n) par grille
   ═══════════════════════════════════════════════════════ */
function initParticles(canvas) {
  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildCircuit(); buildCols(); });

  const C = {
    node:   'rgba(0,194,255,',
    line:   'rgba(0,194,255,',
    pulse:  'rgba(0,229,255,',
    purple: 'rgba(140,80,255,',
  };

  /* ── 1. CIRCUIT PCB ────────────────────────────────────
     O(n) : on ne connecte que les voisins directs sur grille
     ──────────────────────────────────────────────────────*/
  const circuit = { nodes: [], paths: [] };

  function buildCircuit() {
    circuit.nodes = [];
    circuit.paths = [];
    const GRID = 100; // espacement grille
    const cols = Math.floor(W / GRID);
    const rows = Math.floor(H / GRID);

    // Grille indexée pour connexions O(n) sans double boucle
    const grid = [];
    for (let r = 0; r <= rows; r++) {
      grid[r] = [];
      for (let c = 0; c <= cols; c++) {
        if (Math.random() < 0.5) {
          const idx = circuit.nodes.length;
          grid[r][c] = idx;
          circuit.nodes.push({
            x: c * GRID + (Math.random() - 0.5) * 35,
            y: r * GRID + (Math.random() - 0.5) * 35,
            r: Math.random() * 2 + 0.8,
            glow: Math.random() * Math.PI * 2,
            glowSpeed: 0.012 + Math.random() * 0.016,
            type: Math.random() < 0.12 ? 'chip' : 'dot',
          });
        } else {
          grid[r][c] = -1;
        }
      }
    }

    // Connexions uniquement avec voisin direct droite ou bas (O(n))
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const a = grid[r]?.[c];
        if (a === undefined || a < 0) continue;
        const right = grid[r]?.[c + 1];
        if (right !== undefined && right >= 0 && Math.random() < 0.5)
          circuit.paths.push({ a, b: right, axis: 'h' });
        const down = grid[r + 1]?.[c];
        if (down !== undefined && down >= 0 && Math.random() < 0.5)
          circuit.paths.push({ a, b: down, axis: 'v' });
      }
    }
  }
  buildCircuit();

  /* ── 2. PULSES – max 8 simultanés ─────────────────────*/
  const pulses = [];
  let pulseTimer = 0;

  /* ── 3. PARTICULES – 40 au lieu de 55 ─────────────────*/
  const particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * (W || 1200),
      y: Math.random() * (H || 800),
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.45 + 0.12,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.016 + Math.random() * 0.016,
    });
  }

  /* ── 4. COLONNES CODE – 15% actives, moins fréquentes ─*/
  const codeChars = '01ABCDEFabcdef{}[]<>/;:'.split('');
  let cols = [];
  function buildCols() {
    cols = [];
    const n = Math.floor(W / 28);
    for (let i = 0; i < n; i++) {
      if (Math.random() < 0.15) {
        cols.push({
          x: i * 28 + 14,
          y: Math.random() * -H,
          speed: 0.3 + Math.random() * 0.6,
          chars: Array.from({length: 14}, () => codeChars[Math.floor(Math.random()*codeChars.length)]),
          alpha: 0.05 + Math.random() * 0.06,
          len: 5 + Math.floor(Math.random() * 8),
          refreshTimer: 0,
        });
      }
    }
  }
  buildCols();

  /* ── 5. BOUCLE DE RENDU ────────────────────────────────
     - Plus de shadowBlur
     - beginPath/stroke batché par couleur
     - Connexions particules limitées à distance 100
     ──────────────────────────────────────────────────────*/
  let frame = 0;
  function draw() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    /* Circuit PCB – tous les tracés en un seul path */
    ctx.beginPath();
    for (const p of circuit.paths) {
      const a = circuit.nodes[p.a], b = circuit.nodes[p.b];
      if (p.axis === 'h') {
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, a.y); ctx.lineTo(b.x, b.y);
      } else {
        ctx.moveTo(a.x, a.y); ctx.lineTo(a.x, b.y); ctx.lineTo(b.x, b.y);
      }
    }
    ctx.strokeStyle = C.line + '0.08)';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    /* Noeuds – sans shadowBlur */
    for (const n of circuit.nodes) {
      n.glow += n.glowSpeed;
      const gv = 0.65 + 0.35 * Math.sin(n.glow);
      if (n.type === 'chip') {
        const s = n.r * 2.5;
        ctx.fillStyle   = C.node + (0.07 * gv) + ')';
        ctx.strokeStyle = C.node + (0.22 * gv) + ')';
        ctx.lineWidth   = 0.7;
        ctx.fillRect(n.x - s, n.y - s, s * 2, s * 2);
        ctx.strokeRect(n.x - s, n.y - s, s * 2, s * 2);
      } else {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * gv, 0, Math.PI * 2);
        ctx.fillStyle = C.node + (0.4 * gv) + ')';
        ctx.fill();
      }
    }

    /* Pulses – spawn interne au RAF toutes les ~200ms */
    pulseTimer++;
    if (pulseTimer >= 12 && pulses.length < 8 && circuit.paths.length > 0) {
      const path = circuit.paths[Math.floor(Math.random() * circuit.paths.length)];
      pulses.push({ path, t: 0, speed: 0.005 + Math.random() * 0.006,
        color: Math.random() < 0.2 ? C.purple : C.pulse });
      pulseTimer = 0;
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const pu = pulses[i];
      pu.t += pu.speed;
      if (pu.t >= 1) { pulses.splice(i, 1); continue; }
      const a = circuit.nodes[pu.path.a], b = circuit.nodes[pu.path.b];
      let px, py;
      if (pu.path.axis === 'h') {
        const mx = b.x, my = a.y;
        if (pu.t < 0.5) { px = a.x + (mx - a.x)*(pu.t/0.5); py = a.y; }
        else             { px = mx; py = a.y + (b.y - a.y)*((pu.t-0.5)/0.5); }
      } else {
        const mx = a.x, my = b.y;
        if (pu.t < 0.5) { px = a.x; py = a.y + (my - a.y)*(pu.t/0.5); }
        else             { px = a.x + (b.x - a.x)*((pu.t-0.5)/0.5); py = my; }
      }
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = pu.color + '0.85)';
      ctx.fill();
    }

    /* Particules – distance 100 au lieu de 120 */
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      p.pulse += p.pulseSpeed;
      const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,210,255,${a})`;
      ctx.fill();
    }
    /* Connexions en un seul path par plage de transparence */
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        if (dx * dx + dy * dy < 10000) { // 100² — évite sqrt
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
        }
      }
    }
    ctx.strokeStyle = 'rgba(0,194,255,0.08)';
    ctx.stroke();

    /* Colonnes de code – une frame sur deux */
    if (frame % 2 === 0) {
      ctx.font = '11px "Share Tech Mono", monospace';
      for (const col of cols) {
        col.y += col.speed * 2; // ×2 car on saute 1 frame sur 2
        if (col.y > H + col.len * 14) col.y = -col.len * 14;
        col.refreshTimer++;
        if (col.refreshTimer > 14) {
          col.chars[Math.floor(Math.random() * col.chars.length)] =
            codeChars[Math.floor(Math.random() * codeChars.length)];
          col.refreshTimer = 0;
        }
        for (let k = 0; k < col.len; k++) {
          const a = col.alpha * (k / col.len);
          ctx.fillStyle = k === col.len - 1
            ? `rgba(180,240,255,${a * 2})`
            : `rgba(0,194,255,${a})`;
          ctx.fillText(col.chars[k % col.chars.length], col.x, col.y + k * 14);
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ── Scroll-reveal avec IntersectionObserver ───────────────────────── */
function initScrollReveal() {
  // Injecte data-text sur les h1 pour l'effet glitch CSS
  document.querySelectorAll('.page-header h1').forEach(h => {
    h.dataset.text = h.textContent;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  let idx = 0;
  document.querySelectorAll('.anim-in').forEach(el => {
    el.dataset.delay = idx * 80;
    observer.observe(el);
    idx++;
  });
}

/* ═══════════════════════════════════════════════════
   EFFETS DE SCROLL : parallaxe + progress + glitch
   ═══════════════════════════════════════════════════ */
function initScrollEffects() {
  const progressBar = document.getElementById('scroll-progress');
  const backTop     = document.getElementById('back-top');
  const bgAnimated  = document.querySelector('.bg-animated');
  const nebBlobs    = document.querySelectorAll('.nebula-blob');
  const pageH1      = document.querySelector('.page-header h1');

  let lastScrollY   = 0;
  let ticking       = false;
  let glitchTimeout = null;

  /* ── Glitch sur le h1 de page ── */
  function triggerGlitch() {
    if (!pageH1) return;
    pageH1.classList.add('glitch-active');
    clearTimeout(glitchTimeout);
    glitchTimeout = setTimeout(() => pageH1.classList.remove('glitch-active'), 400);
  }

  /* ── Mise à jour au scroll ── */
  function onScroll() {
    const scrollY   = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress  = maxScroll > 0 ? scrollY / maxScroll : 0;

    /* Barre de progression */
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;

    /* Bouton retour en haut */
    if (backTop) backTop.classList.toggle('visible', scrollY > 300);

    /* Parallaxe doux sur le fond dégradé */
    if (bgAnimated) {
      const shift = scrollY * 0.04;
      bgAnimated.style.transform = `translateY(${shift}px)`;
    }

    /* Parallaxe sur les blobs (vitesses différentes) */
    nebBlobs.forEach((blob, i) => {
      const speeds = [0.06, -0.04, 0.05];
      blob.style.transform = `translateY(${scrollY * speeds[i % speeds.length]}px)`;
    });

    /* Glitch sur le h1 quand on commence à scroller */
    if (scrollY > 10 && lastScrollY === 0) triggerGlitch();
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', buildNav);
