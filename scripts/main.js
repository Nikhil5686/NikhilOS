'use strict';
/*  NikhilOS — JavaScript Engine v2
    Boot · Cursor · Navigation · Tilt · Typewriter · Canvas · Radar · Ripple  */

/* ============================================================
   1. BOOT SEQUENCE
   ============================================================ */
const BOOT_LINES = [
  '[  0.001] Kernel AI-Core v9001 initializing...',
  '[  0.043] Memory map: 16384 MB DRAM OK',
  '[  0.112] Neural interface: ONLINE',
  '[  0.203] Cybersecurity module: ACTIVE',
  '[  0.315] Loading identity layer: nikhilraj',
  '[  0.440] Mounting project registry: 4 modules found',
  '[  0.580] Achievement log: 2 records unlocked',
  '[  0.700] Skills matrix calibrated: 6 cores',
  '[  0.850] Content module: READY',
  '[  0.999] ▶ NikhilOS — System booted successfully'
];

function runBoot() {
  const logEl  = document.getElementById('boot-log');
  const barEl  = document.getElementById('boot-bar');
  const pctEl  = document.getElementById('boot-pct');
  const total  = BOOT_LINES.length;

  BOOT_LINES.forEach((msg, i) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'bl-line';
      line.textContent = msg;
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
      const pct = Math.round(((i + 1) / total) * 100);
      barEl.style.width = pct + '%';
      pctEl.textContent = pct + '%';
    }, i * 160);
  });

  setTimeout(() => {
    const boot  = document.getElementById('boot');
    const shell = document.getElementById('shell');
    boot.classList.add('boot-exit');
    shell.classList.remove('shell-hidden');
    setTimeout(() => { boot.style.display = 'none'; startOS(); }, 900);
  }, total * 160 + 500);
}

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const dot  = document.getElementById('cx-dot');
  const ring = document.getElementById('cx-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  dot.style.left = '0px'; dot.style.top = '0px';
  ring.style.left = '0px'; ring.style.top = '0px';

  function animCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // Hide ring on leave
  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; });
}

/* ============================================================
   3. CLOCK
   ============================================================ */
function startClock() {
  const el = document.getElementById('nr-clock');
  const tick = () => { el.textContent = new Date().toLocaleTimeString('en-GB',{hour12:false}); };
  tick(); setInterval(tick, 1000);
}

/* ============================================================
   4. NAVIGATION
   ============================================================ */
let currentSection = 'home';

function navigate(id) {
  if (id === currentSection) return;
  const prev = document.getElementById(currentSection);
  const next = document.getElementById(id);
  if (!prev || !next) return;

  prev.classList.remove('s-active');
  prev.style.display = 'none';
  currentSection = id;

  next.style.display = 'block';
  next.classList.add('s-active');

  // Update nav
  document.querySelectorAll('.ni').forEach(n => {
    n.classList.toggle('active', n.dataset.s === id);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  onSectionEnter(id);

  // Close drawer if open
  closeDrawer();
}

function onSectionEnter(id) {
  if (id === 'home')         { startTyping(); animateCounters(); }
  if (id === 'skills')       { animateSkillBars(); drawRadar(); }
  if (id === 'projects')     { animateModBars(); startRakshakTerminal(); animateRing(); }
  if (id === 'achievements') { /* subtle entrance handled by CSS */ }
}

// Wire nav items
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ni').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.s));
  });
  // Keyboard support
  document.querySelectorAll('.ni').forEach(item => {
    item.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') navigate(item.dataset.s); });
  });
});

/* ============================================================
   5. MOBILE DRAWER
   ============================================================ */
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer-backdrop').classList.add('show');
  document.getElementById('burger').classList.add('open');
  document.getElementById('burger').setAttribute('aria-expanded','true');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-backdrop').classList.remove('show');
  document.getElementById('burger').classList.remove('open');
  document.getElementById('burger').setAttribute('aria-expanded','false');
}
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  if (burger) burger.addEventListener('click', () => {
    burger.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  // Drawer nav
  document.querySelectorAll('.drawer li').forEach(li => {
    li.addEventListener('click', closeDrawer);
  });
});

/* ============================================================
   6. TYPEWRITER — CYCLING PHRASES
   ============================================================ */
const PHRASES = [
  'Building AI systems that matter',
  'Engineering cybersecurity solutions',
  'Architecting intelligent experiences',
  'Creating next-gen tech content',
  'Turning ideas into live systems',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false, typingTimer;

function startTyping() {
  clearTimeout(typingTimer);
  const el = document.getElementById('typed');
  if (!el) return;
  charIdx = 0; isDeleting = false; phraseIdx = 0; el.textContent = '';
  typeStep();
}

function typeStep() {
  const el = document.getElementById('typed');
  if (!el) return;
  const phrase = PHRASES[phraseIdx];

  if (!isDeleting) {
    el.textContent = phrase.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) {
      isDeleting = true;
      typingTimer = setTimeout(typeStep, 1800);
    } else {
      typingTimer = setTimeout(typeStep, 55);
    }
  } else {
    el.textContent = phrase.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % PHRASES.length;
      typingTimer = setTimeout(typeStep, 400);
    } else {
      typingTimer = setTimeout(typeStep, 28);
    }
  }
}

/* ============================================================
   7. COUNTER ANIMATION
   ============================================================ */
function animateCounters() {
  document.querySelectorAll('.hm-val[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let val = 0;
    const step = () => {
      val++;
      el.textContent = val;
      if (val < target) setTimeout(step, 120);
    };
    step();
  });
}

/* ============================================================
   8. 3D CARD TILT
   ============================================================ */
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotY = dx * 10;
      const rotX = -dy * 10;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
  });
}

/* ============================================================
   9. RIPPLE EFFECT
   ============================================================ */
function initRipple() {
  document.querySelectorAll('.ripple-el').forEach(el => {
    el.addEventListener('click', function(e) {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size/2;
      const y = e.clientY - rect.top  - size/2;
      const wave = document.createElement('span');
      wave.classList.add('ripple-wave');
      wave.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      el.appendChild(wave);
      setTimeout(() => wave.remove(), 700);
    });
  });
}

/* ============================================================
   10. MODULE BARS ANIMATION
   ============================================================ */
function animateModBars() {
  document.querySelectorAll('.mod-fill[data-w]').forEach(fill => {
    fill.style.width = '0';
    setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, 200);
  });
}

/* ============================================================
   11. RAKSHAK AI TERMINAL
   ============================================================ */
const RAKSHAK_LINES = [
  { color: 'l-green',  text: '▶ threat_scan --realtime --deep' },
  { color: 'l-cyan',   text: '█ Initializing neural engine...' },
  { color: 'l-green',  text: '✓ Model v3.1 loaded — 88% confidence' },
  { color: 'l-cyan',   text: '█ Scanning behavioral patterns...' },
  { color: 'l-green',  text: '✓ 0 anomalies detected' },
  { color: 'l-purple', text: '▶ status: SYSTEM PROTECTED ▮' },
];

function startRakshakTerminal() {
  const body = document.getElementById('rakshak-term');
  if (!body) return;
  body.innerHTML = '';
  RAKSHAK_LINES.forEach((ln, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'fss-seq-line';
      div.innerHTML = `<span class="${ln.color}">${ln.text}</span>`;
      body.appendChild(div);
    }, i * 500);
  });
}

/* ============================================================
   12. RING CHART ANIMATION (Rakshak)
   ============================================================ */
function animateRing() {
  const ring = document.getElementById('rakshak-ring');
  if (!ring) return;
  // circumference = 2*PI*34 ≈ 213.6
  const circ = 213.6;
  const pct  = 88 / 100;
  ring.style.strokeDashoffset = circ;
  setTimeout(() => {
    ring.style.transition = 'stroke-dashoffset 1.5s ease';
    ring.style.strokeDashoffset = circ - (circ * pct);
  }, 300);

  // Add gradient defs to SVG
  const svg = ring.closest('svg');
  if (svg && !svg.querySelector('defs')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
    defs.innerHTML = `<linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>`;
    svg.insertBefore(defs, svg.firstChild);
  }
}

/* ============================================================
   13. SKILL BARS ANIMATION
   ============================================================ */
function animateSkillBars() {
  document.querySelectorAll('.ski-fill[data-w]').forEach(fill => {
    fill.style.width = '0';
    setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, 150);
  });
}

/* ============================================================
   14. RADAR CHART (Canvas)
   ============================================================ */
function drawRadar() {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=canvas.width, H=canvas.height, cx=W/2, cy=H/2;
  const maxR = Math.min(W,H)/2 - 24;
  const labels = ['AI Dev','Cybersec','App Dev','Design','Content','Research'];
  const values = [0.90, 0.82, 0.85, 0.88, 0.80, 0.75];
  const n = labels.length;

  ctx.clearRect(0,0,W,H);
  let prog = 0;

  function frame() {
    ctx.clearRect(0,0,W,H);
    const p = Math.min(1, prog);

    // Grid rings
    [0.25,0.5,0.75,1].forEach(lvl => {
      ctx.beginPath();
      for (let i=0;i<n;i++) {
        const a = (Math.PI*2/n)*i - Math.PI/2;
        const x=cx+Math.cos(a)*maxR*lvl, y=cy+Math.sin(a)*maxR*lvl;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle='rgba(0,240,255,0.08)'; ctx.lineWidth=1; ctx.stroke();
    });

    // Spokes
    for (let i=0;i<n;i++) {
      const a=(Math.PI*2/n)*i-Math.PI/2;
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(a)*maxR, cy+Math.sin(a)*maxR);
      ctx.strokeStyle='rgba(0,240,255,0.07)'; ctx.lineWidth=1; ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    for (let i=0;i<n;i++) {
      const a=(Math.PI*2/n)*i-Math.PI/2;
      const r=maxR*values[i]*p;
      const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.fillStyle='rgba(0,240,255,0.1)'; ctx.fill();
    ctx.strokeStyle='#00f0ff'; ctx.lineWidth=2;
    ctx.shadowColor='#00f0ff'; ctx.shadowBlur=10; ctx.stroke(); ctx.shadowBlur=0;

    // Dots
    for (let i=0;i<n;i++) {
      const a=(Math.PI*2/n)*i-Math.PI/2;
      const r=maxR*values[i]*p;
      ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r, cy+Math.sin(a)*r, 4, 0, Math.PI*2);
      ctx.fillStyle='#00f0ff'; ctx.shadowColor='#00f0ff'; ctx.shadowBlur=8; ctx.fill(); ctx.shadowBlur=0;
    }

    // Labels
    ctx.font='500 10px "JetBrains Mono",monospace'; ctx.fillStyle='#6b7fa8';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    for (let i=0;i<n;i++) {
      const a=(Math.PI*2/n)*i-Math.PI/2;
      ctx.fillText(labels[i], cx+Math.cos(a)*(maxR+18), cy+Math.sin(a)*(maxR+18));
    }

    if (prog < 1) { prog += 0.04; requestAnimationFrame(frame); }
  }
  frame();
}

/* ============================================================
   15. PARTICLE CANVAS BACKGROUND
   ============================================================ */
function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x=Math.random()*W; this.y=Math.random()*H;
      this.vx=(Math.random()-0.5)*0.25; this.vy=(Math.random()-0.5)*0.25;
      this.r=Math.random()*1.4+0.4; this.a=Math.random()*0.4+0.05;
      this.color=['#00f0ff','#8b5cf6','#10ffb0'][Math.floor(Math.random()*3)];
    }
    update() {
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=this.color; ctx.globalAlpha=this.a;
      ctx.shadowColor=this.color; ctx.shadowBlur=6; ctx.fill();
      ctx.globalAlpha=1; ctx.shadowBlur=0;
    }
  }

  for(let i=0;i<80;i++) particles.push(new P());

  function loop() {
    // Deep BG gradient
    const g=ctx.createRadialGradient(W*.5,H*.25,0,W*.5,H*.5,H);
    g.addColorStop(0,'rgba(8,11,24,1)'); g.addColorStop(1,'rgba(3,4,10,1)');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

    // Connect nearby particles
    const maxD=100;
    for(let i=0;i<particles.length;i++) {
      for(let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<maxD) {
          ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(0,240,255,${(1-d/maxD)*0.06})`; ctx.lineWidth=1; ctx.stroke();
        }
      }
    }

    particles.forEach(p=>{p.update();p.draw();});
    requestAnimationFrame(loop);
  }
  loop();
}

/* ============================================================
   16. LIVE ACTIVITY LOG
   ============================================================ */
const LOG_POOL = [
  { t:'info',    text:'System heartbeat OK — latency 2ms' },
  { t:'success', text:'Rakshak AI threat scan complete — 0 threats' },
  { t:'warn',    text:'BranchIQ API call — latency spike, auto-resolved' },
  { t:'info',    text:'Content idea queued: AI reels batch #12' },
  { t:'success', text:'SecureChat encryption keys rotated' },
  { t:'info',    text:'GitHub push — NikhilOS portfolio update' },
  { t:'warn',    text:'DoseWiz safety check — all dosage flags cleared' },
  { t:'success', text:'Neural model checkpoint saved — Rakshak v3.2' },
];
let logPoolIdx = 0;

function initLog() {
  const initial = [
    { t:'info',    text:'NikhilOS content module initialized' },
    { t:'success', text:'AI tutorial queued for upload' },
    { t:'warn',    text:'Rakshak AI v3.1 threat model deployed' },
    { t:'info',    text:'Cybersecurity research session — 3h 20m' },
    { t:'success', text:'BranchIQ production deployment verified' },
  ];
  const el = document.getElementById('log-scroll');
  if (!el) return;

  initial.forEach(addLogEntry);
  setInterval(() => {
    addLogEntry(LOG_POOL[logPoolIdx % LOG_POOL.length]);
    logPoolIdx++;
  }, 5000);
}

function addLogEntry(entry) {
  const el = document.getElementById('log-scroll');
  if (!el) return;
  const now = new Date();
  const ts = `[${now.toLocaleDateString('en-CA')} ${now.toLocaleTimeString('en-GB',{hour12:false})}]`;
  const typeMap={ info:'le-type-i INFO', success:'le-type-s SUCCESS', warn:'le-type-w BUILD' };
  const classMap={ info:'le-info', success:'le-success', warn:'le-warn' };
  const [typeCls, typeLabel] = typeMap[entry.t].split(' ');

  const div=document.createElement('div');
  div.className=`log-entry ${classMap[entry.t]}`;
  div.innerHTML=`<span class="le-time">${ts}</span><span class="${typeCls}">[${typeLabel}]</span> ${entry.text}`;
  el.insertBefore(div, el.firstChild);
  while(el.children.length > 14) el.removeChild(el.lastChild);
}

/* ============================================================
   17. INTERSECTION OBSERVER — animate on viewport
   ============================================================ */
function initObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'secIn 0.5s cubic-bezier(0.16,1,0.3,1) both';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.glass-card').forEach(c => obs.observe(c));
}

/* ============================================================
   18. MAIN START
   ============================================================ */
function startOS() {
  startClock();
  initCursor();
  initBackground();
  initTilt();
  initRipple();
  initObserver();
  initLog();
  // Fire home section features directly (navigate guard skips if already 'home')
  setTimeout(() => {
    startTyping();
    animateCounters();
  }, 200);
}

/* ---- BOOT ---- */
document.addEventListener('DOMContentLoaded', runBoot);
