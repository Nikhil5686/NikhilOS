'use strict';
/*  NikhilOS — JavaScript Engine v3
    Cinematic AI Robotics Portfolio
    Boot · Cursor · Navigation · Magnetic · Hex Grid · SVG Animation  */

/* ============================================================
   1. BOOT SEQUENCE
   ============================================================ */
const BOOT_LINES = [
  '[  0.001] Kernel AI-Core v9001 initializing...',
  '[  0.043] Hardware interface: NEURAL_LINK OK',
  '[  0.112] Motor control node: STANDBY',
  '[  0.203] Cybersecurity protocol: ZERO_TRUST ACTIVE',
  '[  0.315] Loading identity layer: nikhilraj.sys',
  '[  0.440] Mounting mission archive: 4 deployed systems found',
  '[  0.580] Calibrating telemetry sensors...',
  '[  0.700] Capability matrix initialized: 6 operational domains',
  '[  0.850] Handshake secure. Encryption E2E verified.',
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
      line.innerHTML = `<span>[SYS]</span> ${msg}`;
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
    setTimeout(() => { boot.style.display = 'none'; startOS(); }, 800);
  }, total * 160 + 400);
}

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const dot  = document.getElementById('cx-dot');
  const ring = document.getElementById('cx-ring');
  if (!dot || !ring) return;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; });
}

/* ============================================================
   3. CLOCK
   ============================================================ */
function startClock() {
  const el = document.getElementById('nr-clock');
  const tick = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-GB', { hour12: false }) + '.' + Math.floor(now.getMilliseconds()/100);
  };
  tick(); setInterval(tick, 100);
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
  setTimeout(() => prev.style.display = 'none', 400);

  currentSection = id;
  
  next.style.display = 'block';
  // Small delay to ensure display:block applies before animation class
  requestAnimationFrame(() => {
    next.classList.add('s-active');
  });

  document.querySelectorAll('.ni').forEach(n => {
    n.classList.toggle('active', n.dataset.s === id);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  onSectionEnter(id);
  closeDrawer();
}

function onSectionEnter(id) {
  if (id === 'home')     { startTyping(); animateCounters(); }
  if (id === 'projects') { startRakshakTerminal(); initRakshakArchDiagram(); }
  // other sections have scroll reveals
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ni').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.s));
  });
});

/* ============================================================
   5. MOBILE DRAWER
   ============================================================ */
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer-backdrop').classList.add('show');
  document.getElementById('burger').classList.add('open');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-backdrop').classList.remove('show');
  document.getElementById('burger').classList.remove('open');
}
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  if (burger) burger.addEventListener('click', () => {
    burger.classList.contains('open') ? closeDrawer() : openDrawer();
  });
});

/* ============================================================
   6. TYPEWRITER
   ============================================================ */
const PHRASES = [
  'Building autonomous intelligent agents.',
  'Engineering zero-trust secure infrastructure.',
  'Bridging neural logic with physical movement.',
  'Architecting resilient edge systems.',
  'Code that acts in the real world.'
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
      typingTimer = setTimeout(typeStep, 2000);
    } else {
      typingTimer = setTimeout(typeStep, 45);
    }
  } else {
    el.textContent = phrase.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % PHRASES.length;
      typingTimer = setTimeout(typeStep, 500);
    } else {
      typingTimer = setTimeout(typeStep, 20);
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
    const dur = 1500;
    const steps = 60;
    const inc = target / steps;
    const stepTime = dur / steps;
    
    const step = () => {
      val += inc;
      if (val >= target) {
        el.textContent = target;
      } else {
        el.textContent = Math.floor(val);
        setTimeout(step, stepTime);
      }
    };
    step();
  });
}

/* ============================================================
   8. MAGNETIC BUTTONS (Premium Feel)
   ============================================================ */
function initMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ============================================================
   9. 3D CARD TILT
   ============================================================ */
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotY = dx * 8;
      const rotX = -dy * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

/* ============================================================
   10. RIPPLE EFFECT
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
   11. RAKSHAK AI TERMINAL & SVG DIAGRAM
   ============================================================ */
const RAKSHAK_LINES = [
  { color: 'l-green',  text: '▶ sys.init(defense_node_01)' },
  { color: 'l-cyan',   text: '█ Loading spatial awareness model...' },
  { color: 'l-green',  text: '✓ Inference engine online — 12ms latency' },
  { color: 'l-cyan',   text: '█ Calibrating LiDAR and IR streams...' },
  { color: 'l-green',  text: '✓ Environment mapped. Zero anomalies.' },
  { color: 'l-purple', text: '▶ status: AUTONOMOUS OVERWATCH ▮' },
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
    }, i * 600);
  });
}

function initRakshakArchDiagram() {
  // Re-trigger path animations
  const paths = document.querySelectorAll('.arch-path');
  paths.forEach(p => {
    p.style.animation = 'none';
    p.offsetHeight; // trigger reflow
    p.style.animation = null;
  });

  // Particle animation along paths
  const p1 = document.getElementById('particle1');
  const p2 = document.getElementById('particle2');
  if(!p1 || !p2) return;

  let start = performance.now();
  function animateParticles(time) {
    const elapsed = time - start;
    const cycle = 3000;
    const progress = (elapsed % cycle) / cycle;

    // Path 1 approx coords: M 80 50 L 95 50 L 95 100 L 115 100
    if(progress < 0.5) {
      p1.setAttribute('opacity', '1');
      let x, y;
      const p = progress * 2; // 0 to 1
      if(p < 0.33) { x = 80 + (15 * (p/0.33)); y = 50; }
      else if(p < 0.66) { x = 95; y = 50 + (50 * ((p-0.33)/0.33)); }
      else { x = 95 + (20 * ((p-0.66)/0.34)); y = 100; }
      p1.setAttribute('cx', x);
      p1.setAttribute('cy', y);
    } else { p1.setAttribute('opacity', '0'); }

    // Path 2 approx coords: M 185 100 L 205 100 L 205 50 L 220 50
    if(progress > 0.5) {
      p2.setAttribute('opacity', '1');
      let x, y;
      const p = (progress - 0.5) * 2; // 0 to 1
      if(p < 0.33) { x = 185 + (20 * (p/0.33)); y = 100; }
      else if(p < 0.66) { x = 205; y = 100 - (50 * ((p-0.33)/0.33)); }
      else { x = 205 + (15 * ((p-0.66)/0.34)); y = 50; }
      p2.setAttribute('cx', x);
      p2.setAttribute('cy', y);
    } else { p2.setAttribute('opacity', '0'); }

    requestAnimationFrame(animateParticles);
  }
  requestAnimationFrame(animateParticles);
}

/* ============================================================
   12. CAPABILITY MATRIX (Hex Grid Interaction)
   ============================================ */
const DOMAIN_DATA = {
  ai: {
    title: 'Neural Architectures & ML',
    desc: 'Designing and deploying deep learning models, focusing on edge inference and real-time processing. Experience with custom model architectures for specific physical-world tasks.',
    tags: ['TensorFlow', 'PyTorch', 'TensorRT', 'Edge TPU', 'ONNX']
  },
  robotics: {
    title: 'Robotic Integration',
    desc: 'Bridging the gap between software and hardware. Building control loops, processing sensor telemetry, and orchestrating complex movement logic.',
    tags: ['ROS2', 'C++', 'Python', 'Kinematics', 'Sensor Fusion']
  },
  cyber: {
    title: 'Zero-Trust Security',
    desc: 'Architecting secure communication channels for IoT and robotic nodes. Implementing end-to-end encryption, anomaly detection, and secure key exchanges.',
    tags: ['Cryptography', 'Network Security', 'Penetration Testing', 'AES/RSA']
  },
  core: {
    title: 'Systems Engineering',
    desc: 'The glue that holds everything together. Designing the high-level architecture, ensuring fault tolerance, and managing the lifecycle of complex, multi-layered systems.',
    tags: ['System Design', 'Linux Kernel', 'Docker', 'CI/CD', 'Architecture']
  },
  backend: {
    title: 'Distributed Backend',
    desc: 'Building scalable, high-throughput server infrastructures to handle massive streams of telemetry data, coordinate multi-agent systems, and serve intelligent APIs.',
    tags: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'WebSockets', 'gRPC']
  },
  vision: {
    title: 'Computer Vision',
    desc: 'Extracting semantic meaning from pixel arrays. Implementing real-time object detection, SLAM (Simultaneous Localization and Mapping), and spatial tracking.',
    tags: ['OpenCV', 'YOLO', 'CUDA', 'Point Clouds', 'LiDAR Data']
  },
  embedded: {
    title: 'Embedded Logic',
    desc: 'Writing highly optimized, low-level code for microcontrollers. Managing hardware interrupts, memory constraints, and direct peripheral communication.',
    tags: ['C', 'RTOS', 'SPI/I2C/UART', 'MicroPython', 'ARM Cortex']
  }
};

function initCapabilityMatrix() {
  const cells = document.querySelectorAll('.hex-cell');
  const panel = document.getElementById('cap-details-panel');
  const empty = document.querySelector('.cd-empty');
  const content = document.querySelector('.cd-content');
  const title = document.getElementById('cd-title');
  const desc = document.getElementById('cd-desc');
  const tagsContainer = document.getElementById('cd-tags');

  cells.forEach(cell => {
    cell.addEventListener('mouseenter', () => {
      const domain = cell.dataset.domain;
      if(!domain || !DOMAIN_DATA[domain]) return;
      
      cells.forEach(c => c.classList.remove('active'));
      cell.classList.add('active');

      const data = DOMAIN_DATA[domain];
      empty.classList.add('hidden');
      content.classList.remove('hidden');
      
      title.textContent = data.title;
      desc.textContent = data.desc;
      
      tagsContainer.innerHTML = '';
      data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tt';
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });
      
      // Update panel border color based on hex
      const style = window.getComputedStyle(cell);
      const bg = style.backgroundColor;
      panel.style.borderColor = bg.replace(/[^,]+(?=\))/, '0.3'); // slight opacity tweak
      panel.style.boxShadow = `0 10px 40px ${bg.replace(/[^,]+(?=\))/, '0.1')}`;
    });
  });
}

/* ============================================================
   13. PARTICLE CANVAS BACKGROUND
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
      this.vx=(Math.random()-0.5)*0.3; this.vy=(Math.random()-0.5)*0.3;
      this.r=Math.random()*1.5+0.5; this.a=Math.random()*0.3+0.05;
      this.color=['#00f0ff','#8b5cf6','#10ffb0'][Math.floor(Math.random()*3)];
    }
    update() {
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=this.color; ctx.globalAlpha=this.a;
      ctx.fill(); ctx.globalAlpha=1;
    }
  }

  for(let i=0;i<60;i++) particles.push(new P());

  function loop() {
    ctx.clearRect(0,0,W,H);
    
    const maxD=120;
    for(let i=0;i<particles.length;i++) {
      for(let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<maxD) {
          ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(255,255,255,${(1-d/maxD)*0.03})`; ctx.lineWidth=1; ctx.stroke();
        }
      }
    }

    particles.forEach(p=>{p.update();p.draw();});
    requestAnimationFrame(loop);
  }
  loop();
}

/* ============================================================
   14. SCROLL REVEAL OBSERVER
   ============================================================ */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const elements = document.querySelectorAll('.glass-card, .time-node, .sec-hdr, .section-lead');
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    obs.observe(el);
  });
}

/* ============================================================
   15. MAIN START
   ============================================================ */
function startOS() {
  startClock();
  initCursor();
  initBackground();
  initTilt();
  initRipple();
  initMagneticButtons();
  initCapabilityMatrix();
  initScrollReveal();
  
  // Fire home section features
  setTimeout(() => {
    startTyping();
    animateCounters();
  }, 200);
}

/* ---- BOOT ---- */
document.addEventListener('DOMContentLoaded', runBoot);
