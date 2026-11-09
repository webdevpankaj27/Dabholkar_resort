/* ═══════════════════════════════════════════
   DABHOLKAR RESORT — script.js
   Clean single-file, no duplicate declarations
═══════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────
   SUPABASE CLIENT
───────────────────────────────────────────*/
const SUPABASE_URL = 'https://keytnnyuqahejpvnnskw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ES-q90fufUBmRpXtCVcMWA_DoA8gqwN';

// Lightweight Supabase REST helper (no npm needed)
const db = {
  async insert(table, row) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey':        SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=representation'
      },
      body: JSON.stringify(row)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Supabase insert error:', err);
      return { error: err };
    }
    return { data: await res.json() };
  }
};

/* ─────────────────────────────────────────
   HOME DATA
───────────────────────────────────────────*/
const HOMES = {
  ekaant: {
    name:'Ekaant', type:'Private Home', guests:'2 Guests',
    bed:'King Bed', size:'480 sq ft', price:12000,
    desc:'A sanctuary of solitude. Ekaant wraps you in the kind of stillness that is increasingly rare — where birdsong replaces notification chimes and time bends to your rhythm. The home opens onto a private garden where mango and coconut trees filter the morning light, and evenings are spent on your veranda watching fireflies emerge over the paddy fields.',
    images:['./assets/roominterior.jpeg','./assets/property1.jpeg','./assets/propertynight.jpeg','./assets/property3.jpeg'],
    facilities:['Private garden terrace','Outdoor rain shower','Living area with daybed','Personal safe','In-room wardrobe','Ceiling fan & AC','Writing desk','Bluetooth speaker'],
    amenities:{'In-Room':['24-hour in-room dining','Minibar','Tea & coffee maker','Large flat-screen TV','Bottled water','Newspapers on request','Iron & board','Yoga kit on request'],'Bathroom':['Four-fixture bathroom','Bathtub','Bath menu & salts on request','Forest Essentials amenities','Hair dryer','Welspun robes & slippers'],'Comfort':['Private balcony or veranda','Suit, skirt & padded hangers','Rollaway beds (extra charge)','Infant cribs on request','Full-length mirror'],'Services':['Daily housekeeping','Turndown service','24-hour laundry','Basic Wi-Fi inclusive','Premium Wi-Fi (nominal charge)']}
  },
  sushant: {
    name:'Sushant', type:'VIP Home', guests:'2 Guests',
    bed:'King Bed + Daybed', size:'680 sq ft', price:18000,
    desc:'Our most distinguished residence. Sushant is appointed with hand-carved Konkan furniture, heirloom textiles, and a private plunge pool that looks out over the Arabian Sea. Heritage architecture meets contemporary comfort in a space designed for those who understand that true luxury is space, light, and the freedom to do nothing beautifully.',
    images:['./assets/room_inter3.jpeg','./assets/room_inter4.jpeg','./assets/room_inter5.jpeg'],
    facilities:['Private plunge pool','Sea-view veranda','Separate living room','Walk-in wardrobe','Espresso machine','Personal safe','Outdoor shower garden','Bluetooth speaker'],
    amenities:{'In-Room':['24-hour in-room dining','Minibar','Tea & coffee maker','Large flat-screen TV','Bottled water','Newspapers on request','Iron & board','Yoga kit on request'],'Bathroom':['Four-fixture bathroom','Bathtub','Bath menu & salts on request','Forest Essentials amenities','Hair dryer','Welspun robes & slippers'],'Comfort':['Private balcony or veranda','Suit, skirt & padded hangers','Rollaway beds (extra charge)','Infant cribs on request','Full-length mirror'],'Services':['Daily housekeeping','Turndown service','24-hour laundry','Basic Wi-Fi inclusive','Premium Wi-Fi (nominal charge)']}
  },
  nishant: {
    name:'Nishant', type:'Couple Home', guests:'5 Guests',
    bed:'2 king Beds', size:'760 sq ft', price:20000,
    desc:'Nishant is built for the joy of being together. Generous communal spaces flow into two private bedrooms, making it ideal for families, close friends or multi-generational groups. The wraparound veranda becomes a natural gathering point for meals, card games, and the unhurried art of conversation.',
    images:['./assets/room_inter3.jpeg','./assets/room_inter4.jpeg','./assets/room_inter5.jpeg'],
    facilities:['Two separate bedrooms','Shared living room','Large wraparound veranda','Outdoor dining area','Mini kitchen pantry','Personal safe','Two full bathrooms','Ceiling fans & AC'],
    amenities:{'In-Room':['24-hour in-room dining','Minibar','Tea & coffee maker','Large flat-screen TV','Bottled water','Newspapers on request','Iron & board','Yoga kit on request'],'Bathroom':['Four-fixture bathroom','Bathtub','Bath menu & salts on request','Forest Essentials amenities','Hair dryer','Welspun robes & slippers'],'Comfort':['Private balcony or veranda','Suit, skirt & padded hangers','Rollaway beds (extra charge)','Infant cribs on request (up to age 2)','Full-length mirror'],'Services':['Daily housekeeping','Turndown service','24-hour laundry','Basic Wi-Fi inclusive','Premium Wi-Fi (nominal charge)']}
  },
  niwaant: {
    name:'Niwaant', type:'Serenity Home', guests:'2 Guests',
    bed:'King Bed', size:'520 sq ft', price:12000,
    desc:'Niwaant is an ode to quietude. Positioned at the quietest corner of the estate, facing a grove of arecanut palms. There is nothing here designed to demand your attention — only things designed to earn it gently. An ideal retreat for couples or solo travellers seeking genuine stillness.',
    images:['./assets/property1.jpeg','./assets/roominterior.jpeg','./assets/propertynight.jpeg','./assets/property2.jpeg'],
    facilities:['Private garden view','Hammock terrace','Reading nook with bookshelves','Personal safe','Ceiling fan & AC','In-room wardrobe','Outdoor soaking tub','Writing desk'],
    amenities:{'In-Room':['24-hour in-room dining','Minibar','Tea & coffee maker','Large flat-screen TV','Bottled water','Newspapers on request','Iron & board','Yoga kit on request'],'Bathroom':['Four-fixture bathroom','Bathtub','Bath menu & salts on request','Forest Essentials amenities','Hair dryer','Welspun robes & slippers'],'Comfort':['Private balcony or veranda','Suit, skirt & padded hangers','Rollaway beds (extra charge)','Infant cribs on request','Full-length mirror'],'Services':['Daily housekeeping','Turndown service','24-hour laundry','Basic Wi-Fi inclusive','Premium Wi-Fi (nominal charge)']}
  },
  savali: {
    name:'Savali', type:'Nature Home', guests:'2 Guests',
    bed:'Queen Bed', size:'440 sq ft', price:12000,
    desc:'Savali means "shade" in Marathi — and shade is precisely what this home delivers. Nestled under a dense canopy of jackfruit and cashew trees. Wake to the sounds of the forest, step outside onto a raised wooden deck, and feel the boundary between indoors and outdoors dissolve.',
    images:['./assets/property2.jpeg','./assets/property3.jpeg','./assets/roominterior2.jpeg','./assets/property1.jpeg'],
    facilities:['Raised forest-view deck','Outdoor shower','Hammock under canopy','Personal safe','Ceiling fan & AC','Nature trail access','Bird-watching kit','Writing desk'],
    amenities:{'In-Room':['24-hour in-room dining','Minibar','Tea & coffee maker','Large flat-screen TV','Bottled water','Newspapers on request','Iron & board','Yoga kit on request'],'Bathroom':['Four-fixture bathroom','Bathtub','Bath menu & salts on request','Forest Essentials amenities','Hair dryer','Welspun robes & slippers'],'Comfort':['Private balcony or veranda','Suit, skirt & padded hangers','Rollaway beds (extra charge)','Infant cribs on request','Full-length mirror'],'Services':['Daily housekeeping','Turndown service','24-hour laundry','Basic Wi-Fi inclusive','Premium Wi-Fi (nominal charge)']}
  }
};


/* ─────────────────────────────────────────
   NAVBAR SCROLL
───────────────────────────────────────────*/
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ─────────────────────────────────────────
   MOBILE HAMBURGER
───────────────────────────────────────────*/
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans[0].style.transform = spans[1].style.opacity = spans[2].style.transform = '';
  }
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = s.style.opacity = ''; });
  });
});


/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────*/
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = entry.target.parentElement.querySelectorAll('.reveal');
    let delay = 0;
    siblings.forEach((el, idx) => { if (el === entry.target) delay = idx * 80; });
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────────*/
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const increment = target / (1600 / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));


/* ─────────────────────────────────────────
   SMOOTH SCROLL  (anchor links — skip #book)
───────────────────────────────────────────*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#book') return;           // booking modal handles #book
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────
   HERO PARALLAX
───────────────────────────────────────────*/
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      heroContent.style.opacity   = String(1 - window.scrollY / (window.innerHeight * 0.7));
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────
   HERO VIDEO — UNMUTE TOGGLE
───────────────────────────────────────────*/
const heroVideo     = document.getElementById('heroVideo');
const heroUnmuteBtn = document.getElementById('heroUnmuteBtn');

if (heroVideo && heroUnmuteBtn) {
  const iconMuted   = heroUnmuteBtn.querySelector('.icon-muted');
  const iconUnmuted = heroUnmuteBtn.querySelector('.icon-unmuted');

  heroUnmuteBtn.addEventListener('click', () => {
    heroVideo.muted = !heroVideo.muted;
    iconMuted.style.display   = heroVideo.muted ? '' : 'none';
    iconUnmuted.style.display = heroVideo.muted ? 'none' : '';
    heroUnmuteBtn.setAttribute('aria-label', heroVideo.muted ? 'Unmute video' : 'Mute video');
  });
}


/* ─────────────────────────────────────────
   MODAL HELPERS
───────────────────────────────────────────*/
function openModal(overlay) {
  overlay.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('modal-visible')));
  const closeBtn = overlay.querySelector('.modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 80);
}

function closeModal(overlay) {
  overlay.classList.remove('modal-visible');
  overlay.addEventListener('transitionend', () => {
    overlay.setAttribute('hidden', '');
    if (!document.querySelector('.modal-overlay:not([hidden])')) {
      document.body.style.overflow = '';
    }
  }, { once: true });
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay); });
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal-overlay:not([hidden])').forEach(closeModal);
});


/* ─────────────────────────────────────────
   DETAILS MODAL
───────────────────────────────────────────*/
const detailsModal   = document.getElementById('detailsModal');
const mdCloseBtn     = document.getElementById('detailsModalClose');
const mdGalleryTrack = document.getElementById('mdGalleryTrack');
const mdDots         = document.getElementById('mdDots');
const mdPrev         = document.getElementById('mdPrev');
const mdNext         = document.getElementById('mdNext');
const mdType         = document.getElementById('mdType');
const mdName         = document.getElementById('mdName');
const mdDesc         = document.getElementById('mdDesc');
const mdSpecs        = document.getElementById('mdSpecs');
const mdFacilities   = document.getElementById('mdFacilities');
const mdAmenities    = document.getElementById('mdAmenities');
const mdBookBtn      = document.getElementById('mdBookBtn');

let mdCurrentIndex = 0;
let mdImages = [];

function renderDetailsModal(homeKey) {
  const h = HOMES[homeKey];
  if (!h) return;

  mdType.textContent = h.type;
  mdName.textContent = h.name;
  mdDesc.textContent = h.desc;

  mdSpecs.innerHTML = `
    <div class="md-spec-item"><span class="md-spec-label">Guests</span><span class="md-spec-value">${h.guests}</span></div>
    <div class="md-spec-item"><span class="md-spec-label">Bed Type</span><span class="md-spec-value">${h.bed}</span></div>
    <div class="md-spec-item"><span class="md-spec-label">Room Size</span><span class="md-spec-value">${h.size}</span></div>
    <div class="md-spec-item"><span class="md-spec-label">Per Night</span><span class="md-spec-value" style="color:var(--green);font-weight:600;">₹${h.price.toLocaleString('en-IN')}</span></div>`;

  mdFacilities.innerHTML = h.facilities.map(f => `<li>${f}</li>`).join('');
  mdAmenities.innerHTML  = Object.entries(h.amenities).map(([g, items]) => `
    <div class="md-amen-group">
      <h5>${g}</h5>
      <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`).join('');

  mdImages = h.images;
  mdCurrentIndex = 0;
  mdGalleryTrack.innerHTML = mdImages.map(src => `<img src="${src}" alt="${h.name}" />`).join('');
  refreshGalleryUI();

  mdBookBtn.onclick = () => { closeModal(detailsModal); setTimeout(() => openBookingModal(homeKey), 350); };
}

function refreshGalleryUI() {
  mdGalleryTrack.style.transform = `translateX(-${mdCurrentIndex * 100}%)`;
  mdDots.innerHTML = mdImages.map((_, i) =>
    `<button class="md-dot${i === mdCurrentIndex ? ' active' : ''}" aria-label="Photo ${i + 1}"></button>`
  ).join('');
  mdDots.querySelectorAll('.md-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => { mdCurrentIndex = i; refreshGalleryUI(); });
  });
}

mdPrev.addEventListener('click', () => { mdCurrentIndex = (mdCurrentIndex - 1 + mdImages.length) % mdImages.length; refreshGalleryUI(); });
mdNext.addEventListener('click', () => { mdCurrentIndex = (mdCurrentIndex + 1) % mdImages.length; refreshGalleryUI(); });
mdCloseBtn.addEventListener('click', () => closeModal(detailsModal));

detailsModal.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { mdCurrentIndex = (mdCurrentIndex - 1 + mdImages.length) % mdImages.length; refreshGalleryUI(); }
  if (e.key === 'ArrowRight') { mdCurrentIndex = (mdCurrentIndex + 1) % mdImages.length; refreshGalleryUI(); }
});

// "View Details" & "Photos" buttons on room cards
document.querySelectorAll('.btn-details').forEach(btn => {
  btn.addEventListener('click', () => { renderDetailsModal(btn.dataset.home); openModal(detailsModal); });
});
document.querySelectorAll('.room-card-gallery-btn').forEach(btn => {
  btn.addEventListener('click', () => { renderDetailsModal(btn.dataset.home); openModal(detailsModal); });
});


/* ─────────────────────────────────────────
   BOOKING MODAL
───────────────────────────────────────────*/
const bookingModal = document.getElementById('bookingModal');
const bmCloseBtn   = document.getElementById('bookingModalClose');
const bookingForm  = document.getElementById('bookingForm');
const bmFormWrap   = document.getElementById('bmFormWrap');
const bmConfirm    = document.getElementById('bmConfirm');
const bmDoneBtn    = document.getElementById('bmDoneBtn');
const bmHomeSelect = document.getElementById('bm-home');
const bmCheckin    = document.getElementById('bm-checkin');
const bmCheckout   = document.getElementById('bm-checkout');

function openBookingModal(homeKey) {
  bmFormWrap.hidden = false;
  bmConfirm.hidden  = true;
  bookingForm.reset();
  clearFormErrors();

  if (homeKey && HOMES[homeKey] && bmHomeSelect) {
    const name = HOMES[homeKey].name;
    Array.from(bmHomeSelect.options).forEach(opt => { opt.selected = opt.value === name; });
  }

  const today = new Date().toISOString().split('T')[0];
  if (bmCheckin)  bmCheckin.min  = today;
  if (bmCheckout) bmCheckout.min = today;

  openModal(bookingModal);
}

bmCloseBtn.addEventListener('click', () => closeModal(bookingModal));
bmDoneBtn.addEventListener('click',  () => closeModal(bookingModal));

// Room card "Book Now" buttons
document.querySelectorAll('.btn-book').forEach(btn => {
  btn.addEventListener('click', () => openBookingModal(btn.dataset.home));
});

// Nav / footer "Book Now" links (#book)
document.querySelectorAll('a[href="#book"]').forEach(link => {
  link.addEventListener('click', e => { e.preventDefault(); openBookingModal(null); });
});

// Checkout auto-min
if (bmCheckin) {
  bmCheckin.addEventListener('change', function () {
    if (bmCheckout) {
      bmCheckout.min = this.value;
      if (bmCheckout.value && bmCheckout.value <= this.value) bmCheckout.value = '';
    }
  });
}


/* ─────────────────────────────────────────
   FORM VALIDATION & SUBMIT
───────────────────────────────────────────*/
function clearFormErrors() {
  if (bookingForm) bookingForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function validateForm() {
  let valid = true;
  clearFormErrors();
  bookingForm.querySelectorAll('[required]').forEach(f => {
    if (!f.value.trim()) { f.classList.add('error'); valid = false; }
  });
  const emailEl = document.getElementById('bm-email');
  if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add('error'); valid = false;
  }
  if (bmCheckin && bmCheckout && bmCheckin.value && bmCheckout.value && bmCheckout.value <= bmCheckin.value) {
    bmCheckout.classList.add('error'); valid = false;
  }
  return valid;
}

function fmtDate(ds) {
  if (!ds) return '—';
  return new Date(ds + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
}
function calcNights(ci, co) {
  if (!ci || !co) return 0;
  return Math.max(0, (new Date(co) - new Date(ci)) / 86400000);
}

/* ─────────────────────────────────────────
   RAZORPAY PAYMENT
───────────────────────────────────────────*/
const RZP_KEY        = 'rzp_test_TwSanwRRGeMKB2';
const ADVANCE_AMOUNT = 200000; // ₹2,000 in paise (Razorpay uses paise)

function buildSummaryHTML(data) {
  const nights  = calcNights(data.checkin, data.checkout);
  const homeObj = Object.values(HOMES).find(h => h.name === data.home);
  const rate    = homeObj ? homeObj.price : null;
  const total   = rate && nights > 0 ? rate * nights : null;

  return `
    <h4>Reservation Summary</h4>
    <div class="bc-row"><span class="bc-key">Home</span><span class="bc-val">${data.home || '—'}</span></div>
    <div class="bc-row"><span class="bc-key">Check-in</span><span class="bc-val">${fmtDate(data.checkin)}</span></div>
    <div class="bc-row"><span class="bc-key">Check-out</span><span class="bc-val">${fmtDate(data.checkout)}</span></div>
    <div class="bc-row"><span class="bc-key">Duration</span><span class="bc-val">${nights > 0 ? nights + ' night' + (nights > 1 ? 's' : '') : '—'}</span></div>
    <div class="bc-row"><span class="bc-key">Guests</span><span class="bc-val">${data.guests ? data.guests + ' Guest' + (data.guests !== '1' ? 's' : '') : '—'}</span></div>
    ${rate  ? `<div class="bc-row"><span class="bc-key">Nightly Rate</span><span class="bc-val">₹${rate.toLocaleString('en-IN')}</span></div>` : ''}
    ${total ? `<div class="bc-row"><span class="bc-key">Est. Stay Total</span><span class="bc-val" style="font-weight:600;">₹${total.toLocaleString('en-IN')}</span></div>` : ''}
    <div class="bc-row bc-row--advance"><span class="bc-key">Advance Paid</span><span class="bc-val bc-advance">₹2,000 ✓</span></div>
    <div class="bc-row bc-row--note"><span style="font-size:.75rem;color:var(--text-mid);font-style:italic;">🍽 Lunch ₹1,000 · Dinner ₹1,000 per person extra.</span></div>
    ${data.requests ? `<div class="bc-row"><span class="bc-key">Requests</span><span class="bc-val">${data.requests}</span></div>` : ''}`;
}

function showConfirmation(data, paymentId) {
  document.getElementById('bcName').textContent  = `${data.fname || ''} ${data.lname || ''}`.trim();
  document.getElementById('bcEmail').textContent = data.email || '';
  document.getElementById('bcSummary').innerHTML = buildSummaryHTML(data);

  // Payment badge
  const badge = document.getElementById('bcPaymentBadge');
  if (badge && paymentId) {
    document.getElementById('bcPaymentAmt').textContent = '₹2,000';
    document.getElementById('bcPaymentId').textContent  = paymentId;
    badge.hidden = false;
  }

  // ── Save to Supabase ────────────────────
  const nights  = calcNights(data.checkin, data.checkout);
  const nameParts = (data.fname || '').trim().split(' ');
  const row = {
    fname:       data.fname    || '',
    lname:       data.lname    || '',
    email:       data.email    || '',
    phone:       data.phone    || '',
    home:        data.home     || '',
    guests:      data.guests   || '',
    checkin:     data.checkin  || null,
    checkout:    data.checkout || null,
    requests:    data.requests || '',
    status:      'pending',
    notes:       '',
    payment_id:  paymentId || '',
    amount_paid: paymentId ? 2000 : 0
  };

  db.insert('bookings', row).then(({ error }) => {
    if (error) {
      console.warn('Could not save to Supabase:', error);
    }
  });

  bmFormWrap.hidden = true;
  bmConfirm.hidden  = false;
  bookingModal.querySelector('.modal').scrollTop = 0;
}

function launchRazorpay(data) {
  const fullName = `${data.fname || ''} ${data.lname || ''}`.trim();
  const nights   = calcNights(data.checkin, data.checkout);
  const homeObj  = Object.values(HOMES).find(h => h.name === data.home);

  const options = {
    key:         RZP_KEY,
    amount:      ADVANCE_AMOUNT,              // paise
    currency:    'INR',
    name:        'Dabholkar Resort',
    description: `Advance booking — ${data.home || 'Home'} · ${nights > 0 ? nights + ' night' + (nights > 1 ? 's' : '') : 'Stay'}`,
    image: './assets/logo.png',
    prefill: {
      name:    fullName,
      email:   data.email  || '',
      contact: data.phone  || ''
    },
    notes: {
      home:     data.home    || '',
      checkin:  data.checkin || '',
      checkout: data.checkout || '',
      guests:   data.guests  || ''
    },
    theme: { color: '#2d4a3e' },

    handler: function (response) {
      // Payment successful — response.razorpay_payment_id is the payment ID
      showConfirmation(data, response.razorpay_payment_id);
    },

    modal: {
      ondismiss: function () {
        // User closed Razorpay without paying — re-enable button
        const submitBtn = bookingForm.querySelector('.bm-submit');
        if (submitBtn) {
          submitBtn.disabled    = false;
          submitBtn.innerHTML   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Review &amp; Pay ₹2,000`;
        }
      }
    }
  };

  const rzp = new Razorpay(options);
  rzp.on('payment.failed', function (response) {
    alert(`Payment failed: ${response.error.description}. Please try again.`);
    const submitBtn = bookingForm.querySelector('.bm-submit');
    if (submitBtn) {
      submitBtn.disabled  = false;
      submitBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Review &amp; Pay ₹2,000`;
    }
  });

  rzp.open();
}

if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    const data      = Object.fromEntries(new FormData(bookingForm));
    const submitBtn = bookingForm.querySelector('.bm-submit');

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled   = true;
      submitBtn.textContent = 'Opening payment…';
    }

    launchRazorpay(data);
  });
}


/* ─────────────────────────────────────────
   SITE GALLERY LIGHTBOX
───────────────────────────────────────────*/
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length) {
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <button class="lb-close" aria-label="Close">&times;</button>
      <button class="lb-prev" aria-label="Previous">&#8249;</button>
      <img src="" alt="" class="lb-img" />
      <button class="lb-next" aria-label="Next">&#8250;</button>
    </div>`;
  document.body.appendChild(lightbox);

  const lbStyle = document.createElement('style');
  lbStyle.textContent = `
    #lightbox{display:none;position:fixed;inset:0;z-index:3000;align-items:center;justify-content:center}
    #lightbox.active{display:flex}
    .lb-backdrop{position:absolute;inset:0;background:rgba(12,22,16,.93);cursor:pointer}
    .lb-content{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;max-width:90vw}
    .lb-img{max-width:82vw;max-height:86vh;width:auto;height:auto;object-fit:contain;display:block;box-shadow:0 24px 80px rgba(0,0,0,.5);transition:opacity .22s ease}
    .lb-close,.lb-prev,.lb-next{background:none;border:1px solid rgba(245,240,232,.25);color:rgba(245,240,232,.85);font-size:1.6rem;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;flex-shrink:0}
    .lb-close:hover,.lb-prev:hover,.lb-next:hover{background:rgba(245,240,232,.12);color:#fff;border-color:rgba(245,240,232,.5)}
    .lb-close{position:absolute;top:-52px;right:0;border:none;font-size:2rem}`;
  document.head.appendChild(lbStyle);

  let lbIndex = 0;
  const lbImages = Array.from(galleryItems).map(el => el.querySelector('img').src);
  const lbImg    = lightbox.querySelector('.lb-img');

  function openLightbox(i)  { lbIndex = i; lbImg.src = lbImages[i]; lightbox.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function closeLightbox()  { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
  function lbStep(dir)      {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    lbImg.style.opacity = '0';
    setTimeout(() => { lbImg.src = lbImages[lbIndex]; lbImg.style.opacity = '1'; }, 200);
  }

  galleryItems.forEach((item, i) => { item.style.cursor = 'pointer'; item.addEventListener('click', () => openLightbox(i)); });
  lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lb-prev').addEventListener('click', () => lbStep(-1));
  lightbox.querySelector('.lb-next').addEventListener('click', () => lbStep(1));
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  lbStep(-1);
    if (e.key === 'ArrowRight') lbStep(1);
  });
}


/* ─────────────────────────────────────────
   NEARBY DESTINATIONS
───────────────────────────────────────────*/
const filterBtns  = document.querySelectorAll('.nf-btn');
const nearbyCards = document.querySelectorAll('.nd-card');

// Category filter
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    nearbyCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('nd-hidden', !show);
      if (show && !card.classList.contains('visible')) card.classList.add('visible');
    });
  });
});

// Destination detail lightbox
const ndLightbox = document.createElement('div');
ndLightbox.className = 'nd-lightbox';
ndLightbox.setAttribute('hidden', '');
ndLightbox.setAttribute('role', 'dialog');
ndLightbox.setAttribute('aria-modal', 'true');
ndLightbox.setAttribute('aria-label', 'Destination details');
ndLightbox.innerHTML = `
  <div class="nd-lb-inner">
    <button class="nd-lb-close" aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="nd-lb-img-wrap">
      <img src="" alt="" id="ndLbImg" />
      <span class="nd-lb-tag" id="ndLbTag"></span>
    </div>
    <div class="nd-lb-body">
      <span class="nd-lb-dist" id="ndLbDist"></span>
      <h2 id="ndLbName"></h2>
      <p id="ndLbDesc"></p>
      <div class="nd-lb-actions">
        <button class="btn btn-solid" id="ndLbBook">Arrange a Visit</button>
      </div>
    </div>
  </div>`;
document.body.appendChild(ndLightbox);

function openNdLightbox(card) {
  const img  = card.querySelector('.nd-card-img img');
  const name = card.querySelector('h3').textContent;
  const desc = card.querySelector('p').textContent;
  const tag  = card.querySelector('.nd-tag').textContent;
  const dist = card.querySelector('.nd-dist').textContent;

  ndLightbox.querySelector('#ndLbImg').src          = img.src;
  ndLightbox.querySelector('#ndLbImg').alt          = name;
  ndLightbox.querySelector('#ndLbTag').textContent  = tag;
  ndLightbox.querySelector('#ndLbDist').textContent = dist + ' from resort';
  ndLightbox.querySelector('#ndLbName').textContent = name;
  ndLightbox.querySelector('#ndLbDesc').textContent = desc;

  ndLightbox.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => requestAnimationFrame(() => ndLightbox.classList.add('nd-lb-visible')));
}

function closeNdLightbox() {
  ndLightbox.classList.remove('nd-lb-visible');
  ndLightbox.addEventListener('transitionend', () => {
    ndLightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }, { once: true });
}

nearbyCards.forEach(card => {
  card.style.cursor = 'pointer';
  card.setAttribute('tabindex', '0');
  card.addEventListener('click',   () => openNdLightbox(card));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNdLightbox(card); } });
});

ndLightbox.querySelector('.nd-lb-close').addEventListener('click', closeNdLightbox);
ndLightbox.addEventListener('click', e => { if (e.target === ndLightbox) closeNdLightbox(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && ndLightbox.classList.contains('nd-lb-visible')) closeNdLightbox();
});
ndLightbox.querySelector('#ndLbBook').addEventListener('click', () => {
  closeNdLightbox();
  setTimeout(() => openBookingModal(null), 350);
});


/* ─────────────────────────────────────────
   NEWSLETTER FORM
───────────────────────────────────────────*/
function handleSubscribe(e) {
  e.preventDefault();
  const btn  = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Subscribed ✓';
  btn.style.cssText = 'background:#2d4a3e;color:#f5f0e8;border-color:#2d4a3e;';
  btn.disabled = true;
  e.target.reset();
  setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; btn.disabled = false; }, 3500);
}


/* ─────────────────────────────────────────
   SITE SETTINGS — load from Supabase
   Updates contact info, hero text, about
   text dynamically from admin settings
───────────────────────────────────────────*/
async function loadSiteSettings() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/settings?select=key,value`,
      {
        headers: {
          'apikey':        SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );
    if (!res.ok) return;

    const rows = await res.json();
    const s    = Object.fromEntries(rows.map(r => [r.key, r.value]));

    // ── Hero section ─────────────────────
    const headline = document.getElementById('site-headline');
    const subtext  = document.getElementById('site-subtext');
    if (headline && s.hero_headline) headline.innerHTML = s.hero_headline;
    if (subtext  && s.hero_subtext)  subtext.innerHTML  = s.hero_subtext;

    // ── About section ────────────────────
    const about = document.getElementById('site-about');
    if (about && s.about_text) about.textContent = s.about_text;

    // ── Footer contact ───────────────────
    const emailLink = document.getElementById('site-email-link');
    const phoneLink = document.getElementById('site-phone-link');
    const address   = document.getElementById('site-address');

    if (emailLink && s.email) {
      emailLink.textContent = s.email;
      emailLink.href        = `mailto:${s.email}`;
    }
    if (phoneLink && s.phone) {
      phoneLink.textContent = s.phone;
      phoneLink.href        = `tel:${s.phone.replace(/\s/g, '')}`;
    }
    if (address && s.address) {
      address.textContent = s.address;
    }

    // ── Page title ────────────────────────
    if (s.resort_name) {
      document.title = `${s.resort_name} — Luxury Heritage Stay in Ratnagiri, Konkan`;
    }

  } catch (err) {
    // Silently fail — page shows default values
    console.warn('Could not load site settings:', err);
  }
}

// Run on page load
loadSiteSettings();
