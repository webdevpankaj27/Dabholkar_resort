'use strict';

/* ── Navbar ──────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = s.style.opacity = ''; });
  }
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = s.style.opacity = ''; });
  });
});

/* ── Filter ──────────────────────────────── */
const filterBtns = document.querySelectorAll('.gl-filter-btn');
const glItems    = document.querySelectorAll('.gl-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    glItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('gl-hidden', !show);
    });
  });
});

/* ── Lightbox ────────────────────────────── */
const lightbox  = document.getElementById('glLightbox');
const lbImg     = document.getElementById('glLbImg');
const lbClose   = document.getElementById('glLbClose');
const lbPrev    = document.getElementById('glLbPrev');
const lbNext    = document.getElementById('glLbNext');
const lbCounter = document.getElementById('glLbCounter');
const lbBackdrop= document.getElementById('glLbBackdrop');

let currentIndex = 0;

function visibleItems() {
  return Array.from(glItems).filter(i => !i.classList.contains('gl-hidden'));
}

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const visible = visibleItems();
  const item    = visible[currentIndex];
  if (!item) return;
  const img = item.querySelector('img');
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbImg.style.opacity = '1';
  }, 150);
  lbCounter.textContent = `${currentIndex + 1} / ${visible.length}`;
  lbPrev.style.opacity = currentIndex === 0 ? '0.3' : '1';
  lbNext.style.opacity = currentIndex === visible.length - 1 ? '0.3' : '1';
}

function step(dir) {
  const visible = visibleItems();
  currentIndex = Math.max(0, Math.min(visible.length - 1, currentIndex + dir));
  updateLightbox();
}

glItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    const visible = visibleItems();
    const visIndex = visible.indexOf(item);
    if (visIndex > -1) openLightbox(visIndex);
  });
});

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => step(-1));
lbNext.addEventListener('click', () => step(1));

document.addEventListener('keydown', e => {
  if (lightbox.hasAttribute('hidden')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   step(-1);
  if (e.key === 'ArrowRight')  step(1);
});

/* Touch swipe */
let touchX = 0;
lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
}, { passive: true });
