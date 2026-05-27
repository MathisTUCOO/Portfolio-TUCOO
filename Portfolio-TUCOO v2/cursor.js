// cursor.js – Curseur cyberpunk pro v2
(function () {
  /* ── Canvas ── */
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W, H;
  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  /* ── État ── */
  let mx = -200, my = -200;   // souris instantanée
  let tx = -200, ty = -200;   // cible lissée (traînée)
  let clickable = false;
  let prevClickable = false;
  let modeT = 0;              // 0 = nav, 1 = click (transition douce)
  let t = 0;                  // temps global (frames)

  /* Particules au clic */
  const particles = [];

  /* Transition entrée/sortie */
  let enterT = 0;             // 0–1 fondu d'entrée

  /* ── Sélecteurs cliquables ── */
  const SEL = 'a,button,input,select,textarea,[onclick],[role="button"],.stage-tab,.nav-card,.gallery-logo-item,.carousel-btn,.tt-btn,.slides-trigger,.doc-link,.comp-item,.btn,.prod-link,.tag,.nav-links a';

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    const el = document.elementFromPoint(mx, my);
    clickable = el ? !!el.closest(SEL) : false;
  });

  document.addEventListener('mousedown', () => { if (clickable) spawnParticles(mx, my); });
  document.addEventListener('mouseleave', () => { mx = -500; my = -500; enterT = 0; });
  document.addEventListener('mouseenter', () => { enterT = 0; });

  /* ── Particules au clic ── */
  function spawnParticles(x, y) {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.04 + Math.random() * 0.04,
        r: Math.random() * 2 + 1,
        type: Math.random() < 0.4 ? 'line' : 'dot',
        len: 6 + Math.random() * 12,
        angle,
      });
    }
  }

  /* ── Dessine les particules ── */
  function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.92; p.vy *= 0.92;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      const a = p.life;
      ctx.globalAlpha = a;
      if (p.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.cos(p.angle) * p.len * p.life, p.y + Math.sin(p.angle) * p.len * p.life);
        ctx.strokeStyle = `rgba(0,229,255,1)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,1)`;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  /* ── MODE NAVIGATION : croix fine + anneau fantôme ── */
  function drawNav(x, y, lx, ly, alpha) {
    const col = '#00e5ff';
    ctx.globalAlpha = alpha;

    /* Traînée douce */
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,229,255,0.18)';
    ctx.fill();

    /* Croix — 4 branches avec léger écart au centre */
    const GAP = 4, LEN = 9;
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.3;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 5; ctx.shadowColor = col;
    ctx.beginPath();
    ctx.moveTo(x - GAP - LEN, y); ctx.lineTo(x - GAP, y);
    ctx.moveTo(x + GAP, y);       ctx.lineTo(x + GAP + LEN, y);
    ctx.moveTo(x, y - GAP - LEN); ctx.lineTo(x, y - GAP);
    ctx.moveTo(x, y + GAP);       ctx.lineTo(x, y + GAP + LEN);
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* Dot central */
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  /* ── MODE CLIQUABLE : viseur sci-fi animé ── */
  function drawClick(x, y, lx, ly, alpha) {
    const col = '#00e5ff';
    const now = t;
    ctx.globalAlpha = alpha;

    /* Traînée lissée (plus grande) */
    ctx.beginPath();
    ctx.arc(lx, ly, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,229,255,0.1)';
    ctx.fill();

    /* ── 1. Anneau externe rotatif avec 4 arcs gaps ── */
    const R1 = 18;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(now * 0.025);
    for (let i = 0; i < 4; i++) {
      const a0 = (Math.PI / 2) * i + 0.25;
      const a1 = a0 + Math.PI / 2 - 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, R1, a0, a1);
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8; ctx.shadowColor = col;
      ctx.stroke();
    }
    ctx.restore();
    ctx.shadowBlur = 0;

    /* ── 2. Anneau interne contra-rotatif, plus fin ── */
    const R2 = 10;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-now * 0.04);
    for (let i = 0; i < 3; i++) {
      const a0 = (Math.PI * 2 / 3) * i + 0.3;
      const a1 = a0 + Math.PI * 2 / 3 - 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, R2, a0, a1);
      ctx.strokeStyle = 'rgba(0,229,255,0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    /* ── 3. Coins du viseur (4 coins fixes autour) ── */
    const RC = 22, CL = 6;
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6; ctx.shadowColor = col;
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx, sy]) => {
      const cx2 = x + sx * RC, cy2 = y + sy * RC;
      ctx.beginPath();
      ctx.moveTo(cx2, cy2 - sy * CL);
      ctx.lineTo(cx2, cy2);
      ctx.lineTo(cx2 - sx * CL, cy2);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;

    /* ── 4. Petits points orbitants ── */
    for (let i = 0; i < 3; i++) {
      const angle = now * 0.06 + (Math.PI * 2 / 3) * i;
      const px = x + Math.cos(angle) * 28;
      const py = y + Math.sin(angle) * 28;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,229,255,0.7)';
      ctx.shadowBlur = 5; ctx.shadowColor = col;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    /* ── 5. Dot central pulsant ── */
    const pulse = 1 + 0.25 * Math.sin(now * 0.12);
    ctx.beginPath();
    ctx.arc(x, y, 2.5 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.shadowBlur = 10; ctx.shadowColor = col;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 1;
  }

  /* ── Boucle de rendu principale ── */
  function draw() {
    t++;
    ctx.clearRect(0, 0, W, H);

    /* Fondu d'entrée */
    if (mx > -400) enterT = Math.min(1, enterT + 0.08);
    else           enterT = Math.max(0, enterT - 0.08);

    /* Lissage de position (traînée) */
    tx += (mx - tx) * 0.16;
    ty += (my - ty) * 0.16;

    /* Transition douce entre modes */
    const target = clickable ? 1 : 0;
    modeT += (target - modeT) * 0.12;
    prevClickable = clickable;

    if (enterT > 0.01) {
      /* Dessine les deux modes en cross-fade */
      if (modeT < 0.99) drawNav(mx, my, tx, ty, (1 - modeT) * enterT);
      if (modeT > 0.01) drawClick(mx, my, tx, ty, modeT * enterT);
    }

    /* Particules (toujours) */
    drawParticles();

    requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', draw);
  else draw();
})();
