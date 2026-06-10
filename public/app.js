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

// ===== HERO SLIDER (FADE-BASED) =====
const slides = Array.from(document.querySelectorAll('.slide'));
const dots   = Array.from(document.querySelectorAll('.dot'));
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
const TOTAL = 2;
let current = 0;
let autoTimer = null;
let isAnimating = false;

function goTo(index) {
  if (isAnimating || index === current) return;
  isAnimating = true;

  const prev = current;
  current = (index + TOTAL) % TOTAL;

  // Mark old slide as leaving (absolute, fades out)
  slides[prev].classList.remove('active');
  slides[prev].classList.add('leaving');

  // Show new slide
  slides[current].classList.add('active');

  // Update dots
  dots.forEach((d, i) => d.classList.toggle('active', i === current));

  // After transition, clean up leaving class
  setTimeout(() => {
    slides[prev].classList.remove('leaving');
    isAnimating = false;
  }, 780);
}

function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(current + 1), 4500);
}

prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
dots.forEach(dot => {
  dot.addEventListener('click', () => { goTo(+dot.dataset.index); startAuto(); });
});

// Touch / swipe
let touchStartX = 0;
const wrapper = document.getElementById('sliderWrapper');
wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
wrapper.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
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

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.video-card, .about-terminal, .about-text, .stat-item');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity .5s ease ${i * 0.08}s, transform .5s ease ${i * 0.08}s`;
  observer.observe(el);
});

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
