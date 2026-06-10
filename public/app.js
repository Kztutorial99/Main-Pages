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

const SLIDE_DURATION = 700; // ms
const SLIDE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'; // easeOutExpo — silky float landing

// Init: slide 0 visible at center, rest hidden to the right
slides.forEach((s, i) => {
  s.style.transform = i === 0 ? 'translateX(0)' : 'translateX(100%)';
  s.style.transition = 'none';
});

function goTo(index, dir) {
  if (isAnimating) return;
  const next = (index + TOTAL) % TOTAL;
  if (next === current) return;

  // Direction: 1 = slide left (next), -1 = slide right (prev)
  const direction = dir !== undefined ? dir : (next > current ? 1 : -1);
  isAnimating = true;

  const prev = current;
  current = next;

  // Position incoming slide off-screen instantly (no transition)
  slides[current].style.transition = 'none';
  slides[current].style.transform = `translateX(${direction * 100}%)`;

  // Force reflow so the browser registers the starting position
  slides[current].offsetHeight;

  // Animate both slides simultaneously
  const t = `transform ${SLIDE_DURATION}ms ${SLIDE_EASE}`;
  slides[current].style.transition = t;
  slides[current].style.transform = 'translateX(0)';

  slides[prev].style.transition = t;
  slides[prev].style.transform = `translateX(${-direction * 100}%)`;

  slides[current].classList.add('active');
  slides[prev].classList.remove('active');

  dots.forEach((d, i) => d.classList.toggle('active', i === current));

  setTimeout(() => { isAnimating = false; }, SLIDE_DURATION);
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

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.video-card, .about-card, .intro-badge');
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
