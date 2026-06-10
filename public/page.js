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

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== LEGAL TABS (legal.html only) =====
const legalTabs = document.querySelectorAll('.legal-page-tab');
if (legalTabs.length) {
  // Check URL hash on load
  const hash = window.location.hash.replace('#', '') || 'privasi';

  function switchLegalTab(tabId) {
    legalTabs.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    document.querySelectorAll('.legal-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'panel-' + tabId);
    });
    window.location.hash = tabId;
  }

  legalTabs.forEach(btn => {
    btn.addEventListener('click', () => switchLegalTab(btn.dataset.tab));
  });

  // Activate from hash
  switchLegalTab(['privasi', 'syarat', 'disclaimer'].includes(hash) ? hash : 'privasi');
}

// ===== FLOATING PARTICLES =====
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-bg';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.40;';
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
      this.r    = Math.random() * 1.4 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.28;
      this.vy   = (Math.random() - 0.5) * 0.28;
      this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = Math.random() * 0.6 + 0.2;
      this.dl   = (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1);
    };
    this.reset();
  }

  for (let i = 0; i < 70; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.life += p.dl;
      if (p.life <= 0 || p.life >= 1 || p.x < -10 || p.x > W+10 || p.y < -10 || p.y > H+10) p.reset();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.life + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== CURSOR GLOW =====
(function() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const trail = document.createElement('div');
  trail.style.cssText = `position:fixed;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,rgba(10,132,255,.7) 0%,transparent 70%);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
  document.body.appendChild(trail);
  document.addEventListener('mousemove', e => {
    trail.style.left = e.clientX + 'px';
    trail.style.top  = e.clientY + 'px';
  }, { passive: true });
})();
