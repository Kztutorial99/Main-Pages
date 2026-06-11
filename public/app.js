// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== HERO SLIDER (SLIDE-LEFT SMOOTH) =====
const slides = Array.from(document.querySelectorAll('.slide'));
const dots   = Array.from(document.querySelectorAll('.dot'));
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
const TOTAL = 4;
let current = 0;
let autoTimer = null;
let isAnimating = false;

const SLIDE_DURATION = 820; // ms
const SLIDE_EASE     = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // easeOutQuad — silky & natural
const BLUR_IN        = 'blur(14px)';
const BLUR_NONE      = 'blur(0px)';

// Init: slide 0 visible, rest hidden right + blurred
slides.forEach((s, i) => {
  s.style.transform  = i === 0 ? 'translateX(0)'   : 'translateX(100%)';
  s.style.filter     = i === 0 ? BLUR_NONE          : BLUR_IN;
  s.style.opacity    = i === 0 ? '1'                : '0';
  s.style.scale      = '1';
  s.style.transition = 'none';
});

function goTo(index, dir) {
  if (isAnimating) return;
  const next = (index + TOTAL) % TOTAL;
  if (next === current) return;

  const direction = dir !== undefined ? dir : (next > current ? 1 : -1);
  isAnimating = true;

  const prev = current;
  current = next;

  // Curved edges: direction=1 → incoming from right, leading edge = left side
  const rIn  = direction === 1 ? '2.2rem 0 0 2.2rem' : '0 2.2rem 2.2rem 0';
  const rOut = direction === 1 ? '0 2.2rem 2.2rem 0' : '2.2rem 0 0 2.2rem';

  // ── Set incoming slide starting state (no transition yet) ──
  slides[current].style.transition   = 'none';
  slides[current].style.transform    = `translateX(${direction * 100}%)`;
  slides[current].style.filter       = BLUR_IN;
  slides[current].style.opacity      = '0.5';
  slides[current].style.scale        = '0.97';
  slides[current].style.borderRadius = rIn;

  // Force reflow
  slides[current].offsetHeight;

  // ── Shared transition string ──
  const T = `transform ${SLIDE_DURATION}ms ${SLIDE_EASE},
             filter       ${SLIDE_DURATION * 0.9}ms ${SLIDE_EASE},
             opacity      ${SLIDE_DURATION * 0.75}ms ease,
             scale        ${SLIDE_DURATION}ms ${SLIDE_EASE},
             border-radius ${Math.round(SLIDE_DURATION * 0.65)}ms ${SLIDE_EASE}`;

  // ── Incoming: slide in + unblur + straighten edges ──
  slides[current].style.transition   = T;
  slides[current].style.transform    = 'translateX(0)';
  slides[current].style.filter       = BLUR_NONE;
  slides[current].style.opacity      = '1';
  slides[current].style.scale        = '1';
  slides[current].style.borderRadius = '0';

  // ── Outgoing: slide out + blur + curve trailing edge ──
  slides[prev].style.transition   = T;
  slides[prev].style.transform    = `translateX(${-direction * 100}%)`;
  slides[prev].style.filter       = BLUR_IN;
  slides[prev].style.opacity      = '0.3';
  slides[prev].style.scale        = '0.96';
  slides[prev].style.borderRadius = rOut;

  slides[current].classList.add('active');
  slides[prev].classList.remove('active');

  dots.forEach((d, i) => d.classList.toggle('active', i === current));

  setTimeout(() => {
    slides[prev].style.transition   = 'none';
    slides[prev].style.filter       = BLUR_IN;
    slides[prev].style.opacity      = '0';
    slides[prev].style.scale        = '1';
    slides[prev].style.borderRadius = '0';
    isAnimating = false;
  }, SLIDE_DURATION + 30);
}

function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(current + 1, 1), 5500);
}

prevBtn.addEventListener('click', () => { goTo(current - 1, -1); startAuto(); });
nextBtn.addEventListener('click', () => { goTo(current + 1,  1); startAuto(); });
dots.forEach(dot => {
  dot.addEventListener('click', () => { goTo(+dot.dataset.index); startAuto(); });
});

// Touch / swipe
let touchStartX = 0;
const wrapper = document.getElementById('sliderWrapper');
wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
wrapper.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    const dir = diff > 0 ? 1 : -1;
    goTo(current + dir, dir);
    startAuto();
  }
}, { passive: true });

startAuto();

// ===== FETCH VIDEO TITLES via oEmbed =====
const videoData = [
  { id: 'C3AEE8_Mzpk', elId: 'title1' },
  { id: '4h8A771ipAE', elId: 'title2' },
  { id: 'jkAyvGKsA7c', elId: 'title3' },
];
videoData.forEach(({ id, elId }) => {
  const el = document.getElementById(elId);
  fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`)
    .then(r => r.json())
    .then(data => { if (data?.title) el.textContent = data.title; else el.textContent = 'Kz.tutorial Video'; })
    .catch(() => { el.textContent = 'Kz.tutorial Video'; });
});

// ===== SCROLL REVEAL — per-group so stagger starts fresh each section =====
function makeRevealGroup(selector, dur, stagger) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity ${dur} cubic-bezier(.25,.46,.45,.94) ${i * stagger}s, transform ${dur} cubic-bezier(.25,.46,.45,.94) ${i * stagger}s`;
    obs.observe(el);
  });
}
makeRevealGroup('.video-card',  '.3s',  0.07);
makeRevealGroup('.about-card',  '.32s', 0.09);
makeRevealGroup('.intro-badge', '.35s', 0.05);

// ===== SMOOTH ANCHOR =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});

// ===== FLOATING PARTICLES =====
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-bg';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.55;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = ['rgba(10,132,255,', 'rgba(94,92,230,', 'rgba(90,200,250,'];

  function Particle() {
    this.reset = function() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.r    = Math.random() * 1.6 + 0.4;
      this.vx   = (Math.random() - 0.5) * 0.35;
      this.vy   = (Math.random() - 0.5) * 0.35;
      this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = Math.random() * 0.6 + 0.2;
      this.dl   = (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1);
    };
    this.reset();
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.life += p.dl;
      if (p.life <= 0 || p.life >= 1 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) p.reset();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.life + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== CURSOR GLOW TRAIL =====
(function() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const trail = document.createElement('div');
  trail.id = 'cursor-glow';
  trail.style.cssText = `
    position:fixed;width:22px;height:22px;border-radius:50%;
    background:radial-gradient(circle, rgba(10,132,255,.75) 0%, transparent 70%);
    pointer-events:none;z-index:9999;
    transform:translate(-50%,-50%);
    transition:transform .08s ease, opacity .3s ease;
    mix-blend-mode:screen;
  `;
  document.body.appendChild(trail);

  const outer = document.createElement('div');
  outer.style.cssText = `
    position:fixed;width:42px;height:42px;border-radius:50%;
    border:1px solid rgba(10,132,255,.35);
    pointer-events:none;z-index:9998;
    transform:translate(-50%,-50%);
    transition:left .18s ease,top .18s ease;
    mix-blend-mode:screen;
  `;
  document.body.appendChild(outer);

  let mx = -100, my = -100;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    trail.style.left = mx + 'px';
    trail.style.top  = my + 'px';
    outer.style.left = mx + 'px';
    outer.style.top  = my + 'px';
  }, { passive: true });

  document.addEventListener('mousedown', () => { trail.style.transform = 'translate(-50%,-50%) scale(1.6)'; });
  document.addEventListener('mouseup',   () => { trail.style.transform = 'translate(-50%,-50%) scale(1)'; });
})();

// ===== CARD 3D TILT =====
document.querySelectorAll('.video-card, .about-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px) scale(1.025)`;
    card.style.transition = 'transform .08s ease';
    const glow = card.querySelector('.card-glow');
    if (glow) {
      glow.style.opacity = '1';
      glow.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(10,132,255,.18) 0%, transparent 65%)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .45s cubic-bezier(.25,.46,.45,.94)';
    const glow = card.querySelector('.card-glow');
    if (glow) glow.style.opacity = '0';
  });

  const glow = document.createElement('div');
  glow.className = 'card-glow';
  glow.style.cssText = 'position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s ease;z-index:0;';
  card.style.position = 'relative';
  card.prepend(glow);
});

// ===== TYPING EFFECT on intro tagline =====
(function() {
  const el = document.querySelector('.intro-tagline');
  if (!el) return;
  const original = el.innerHTML;
  const text = el.textContent;
  el.innerHTML = '';
  el.style.opacity = '1';
  let i = 0;

  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    el.innerHTML = '';
    function type() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(type, i < 30 ? 30 : 18);
      } else {
        el.innerHTML = original;
      }
    }
    setTimeout(type, 300);
  }, { threshold: 0.5 });
  io.observe(el);
})();

// ===== COUNTER ANIMATION on section eyebrows =====
(function() {
  const counters = [
    { el: document.querySelector('.section-eyebrow'), prefix: 'Paling Banyak Ditonton' },
  ];
  // Number count-up for stats if they exist
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      let start = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = Math.floor(start).toLocaleString();
        if (start >= target) clearInterval(timer);
      }, 16);
    }, { threshold: 0.5 });
    io.observe(el);
  });
})();

// ===== GLITCH EFFECT on logo text =====
(function() {
  const logo = document.querySelector('.logo-text');
  if (!logo) return;
  logo.style.position = 'relative';
  logo.style.display  = 'inline-block';

  let glitching = false;
  function glitch() {
    if (glitching) return;
    glitching = true;
    const orig = logo.style.cssText;
    const frames = [
      () => { logo.style.textShadow = '2px 0 #0A84FF, -2px 0 #5E5CE6'; logo.style.transform = 'skewX(-4deg)'; },
      () => { logo.style.textShadow = '-3px 0 #5AC8FA, 3px 0 #0A84FF';  logo.style.transform = 'skewX(3deg) translateX(2px)'; },
      () => { logo.style.textShadow = '1px 0 #5E5CE6, -1px 0 #5AC8FA';  logo.style.transform = 'skewX(-1deg)'; },
      () => { logo.style.textShadow = ''; logo.style.transform = ''; glitching = false; }
    ];
    let fi = 0;
    const run = () => { frames[fi](); if (++fi < frames.length) setTimeout(run, 60); };
    run();
  }

  document.querySelector('.nav-logo').addEventListener('mouseenter', glitch);
  setInterval(glitch, 7000);
})();
