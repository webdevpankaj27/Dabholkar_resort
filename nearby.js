'use strict';

/* ═══════════════════════════════════════════
   NEARBY DESTINATIONS — JavaScript
═══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   DESTINATION DATA
   Full details for each card's overlay panel
───────────────────────────────────────────*/
const DESTINATIONS = [
  {
    name:     'Kondura Beach',
    category: 'beach',
    dist:     '~12 km from resort',
    image:    'nearby/kondura_beach.webp',
    desc:     'A crescent of golden sand framed by coconut groves, largely untouched by commercial tourism. The beach faces west, making it one of the finest sunset spots in the region. Arrive early to watch local fishermen cast their nets as the morning mist lifts off the Arabian Sea.',
    facts: [
      { label: 'Distance',    value: '~12 km' },
      { label: 'Best Time',   value: 'Oct – Mar' },
      { label: 'Type',        value: 'Beach' },
      { label: 'Activity',    value: 'Swimming, Sunrise walks' }
    ]
  },
  {
    name:     'Sindhudurg Fort',
    category: 'heritage',
    dist:     '~35 km from resort',
    image:    'nearby/sindudurg_fort.jpg',
    desc:     'Built by Chhatrapati Shivaji Maharaj between 1664 and 1667 on a rocky island, Sindhudurg Fort is one of the most remarkable achievements of Maratha naval architecture. The fort\'s walls stretch over 3 km and enclose freshwater wells, temples, and royal quarters. A boat ride from Malvan brings you to its gates.',
    facts: [
      { label: 'Distance',    value: '~35 km' },
      { label: 'Built',       value: '1664–1667' },
      { label: 'Type',        value: 'Heritage Fort' },
      { label: 'Entry',       value: 'Boat from Malvan' }
    ]
  },
  {
    name:     'Tarkarli',
    category: 'beach',
    dist:     '~38 km from resort',
    image:    'nearby/tarkarli.jpg',
    desc:     'Tarkarli is famed for its gin-clear waters, coral reefs and the dramatic confluence of the Karli River with the Arabian Sea. It is one of the best spots for snorkelling and scuba diving on the Konkan coast, with visibility often exceeding 15 metres. The beach itself is a long, palm-fringed expanse of white sand.',
    facts: [
      { label: 'Distance',    value: '~38 km' },
      { label: 'Best For',    value: 'Snorkelling, Scuba' },
      { label: 'Type',        value: 'Beach & Water Sports' },
      { label: 'Visibility',  value: 'Up to 15 metres' }
    ]
  },
  {
    name:     'Nivti Rocks',
    category: 'nature',
    dist:     '~8 km from resort',
    image:    'nearby/nivti_rocks.jpg',
    desc:     'Just a short drive from the resort, Nivti Rocks is a dramatic outcrop of ancient volcanic basalt that juts into the sea. The formation creates a series of natural platforms and tide pools teeming with marine life. At sunset, the rocks glow a deep amber-gold — a scene that photographers and painters return to repeatedly.',
    facts: [
      { label: 'Distance',    value: '~8 km' },
      { label: 'Best Time',   value: 'Sunset hour' },
      { label: 'Type',        value: 'Natural Formation' },
      { label: 'Activity',    value: 'Photography, Tide-pooling' }
    ]
  },
  {
    name:     'Yashwantgad Fort',
    category: 'heritage',
    dist:     '~18 km from resort',
    image:    'nearby/yashwant_gad.jpg',
    desc:     'Perched on a cliff 60 metres above sea level, Yashwantgad is a lesser-known coastal fort that rewards those who seek it with sweeping 180-degree views of the Konkan coastline. Built in the 17th century, much of its original stonework remains intact. The approach through a casuarina forest adds to its sense of discovery.',
    facts: [
      { label: 'Distance',    value: '~18 km' },
      { label: 'Elevation',   value: '~60 m above sea' },
      { label: 'Type',        value: 'Heritage Fort' },
      { label: 'Activity',    value: 'Trekking, History' }
    ]
  },
  {
    name:     'Vengurla Beach',
    category: 'beach',
    dist:     '~22 km from resort',
    image:    'nearby/vengurla_beach.jpg',
    desc:     'One of the widest beaches in Sindhudurg district, Vengurla Beach stretches for nearly 3 km with shallow, calm waters ideal for wading and swimming. The beach faces a cluster of small uninhabited islands, and at low tide, sandbars emerge that local children use as natural playgrounds. Evenings bring food vendors and a warm, unhurried community atmosphere.',
    facts: [
      { label: 'Distance',    value: '~22 km' },
      { label: 'Width',       value: 'Approx. 3 km stretch' },
      { label: 'Type',        value: 'Beach' },
      { label: 'Best For',    value: 'Family swimming' }
    ]
  },
  {
    name:     'Turtle Point',
    category: 'nature',
    dist:     '~28 km from resort',
    image:    'nearby/turtle_point.webp',
    desc:     'A protected nesting site for Olive Ridley sea turtles, Turtle Point is one of Konkan\'s most quietly remarkable natural experiences. Between November and February, turtles come ashore to nest on the beach. Conservation volunteers guide visitors respectfully — you can observe the process without disturbing the animals. Hatchling releases, when they occur, are unforgettable.',
    facts: [
      { label: 'Distance',    value: '~28 km' },
      { label: 'Season',      value: 'Nov – Feb' },
      { label: 'Type',        value: 'Wildlife Sanctuary' },
      { label: 'Species',     value: 'Olive Ridley Turtle' }
    ]
  },
  {
    name:     'Vengurla Lighthouse',
    category: 'heritage',
    dist:     '~24 km from resort',
    image:    'nearby/light_house.png',
    desc:     'One of the oldest operational lighthouses on the western coast of India, the Vengurla Lighthouse has guided mariners since the colonial era. The lighthouse stands 20 metres tall and still sweeps the sea every night. Visitors can climb to the top on select days for panoramic views of the coast, the town, and the open sea.',
    facts: [
      { label: 'Distance',    value: '~24 km' },
      { label: 'Height',      value: '20 metres' },
      { label: 'Type',        value: 'Colonial Heritage' },
      { label: 'Open',        value: 'Select days, check locally' }
    ]
  },
  {
    name:     'Sagreshwar Beach',
    category: 'beach',
    dist:     '~6 km from resort',
    image:    'nearby/sagreshwer_beach.jpg',
    desc:     'The closest beach to Dabholkar Resort and the perfect spot for an unhurried evening walk. Sagreshwar is a working fishing beach — in the late afternoon, wooden boats return laden with the day\'s catch, and the shore comes alive briefly before settling into a deep, peaceful silence as the sun dips below the horizon.',
    facts: [
      { label: 'Distance',    value: '~6 km' },
      { label: 'Best Time',   value: 'Late afternoon' },
      { label: 'Type',        value: 'Fishing Beach' },
      { label: 'Activity',    value: 'Walking, Local culture' }
    ]
  },
  {
    name:     'Shiroda Velaghar',
    category: 'beach',
    dist:     '~14 km from resort',
    image:    'nearby/shiroda_velaghar.jpg',
    desc:     'A long, gently curved beach that sits at the mouth of the Vagad River, Shiroda Velaghar is beloved by locals for its tranquillity and clean sands. The confluence of fresh and salt water creates a unique ecosystem, and the beach is fringed by casuarina and palm trees that provide natural shade throughout the day.',
    facts: [
      { label: 'Distance',    value: '~14 km' },
      { label: 'Feature',     value: 'River-sea confluence' },
      { label: 'Type',        value: 'Beach' },
      { label: 'Crowd',       value: 'Very low' }
    ]
  },
  {
    name:     'Khavne Village',
    category: 'nature',
    dist:     '~20 km from resort',
    image:    'nearby/khavne.jpg',
    desc:     'An unhurried Konkan village surrounded by paddy fields, cashew orchards and mango groves, Khavne offers a genuinely immersive glimpse into the rhythms of coastal rural life. Walk through narrow red-laterite lanes, visit a traditional Konkan-style wada house, or simply sit at the edge of a paddy field and listen to the quiet.',
    facts: [
      { label: 'Distance',    value: '~20 km' },
      { label: 'Character',   value: 'Rural Konkan village' },
      { label: 'Type',        value: 'Nature & Culture' },
      { label: 'Activity',    value: 'Village walks, Orchards' }
    ]
  },
  {
    name:     'Waigani Beach',
    category: 'beach',
    dist:     '~10 km from resort',
    image:    'nearby/waigani_beach.webp',
    desc:     'Hidden behind a dense belt of casuarina trees, Waigani Beach is the kind of place that rewards those willing to seek it. The approach through the forest adds to the anticipation, and the beach itself delivers: fine white sand, calm waters and an almost complete absence of other visitors — even on weekends.',
    facts: [
      { label: 'Distance',    value: '~10 km' },
      { label: 'Access',      value: 'Forest trail approach' },
      { label: 'Type',        value: 'Secluded Beach' },
      { label: 'Crowd',       value: 'Minimal year-round' }
    ]
  },
  {
    name:     'Vengurla Bandar',
    category: 'heritage',
    dist:     '~25 km from resort',
    image:    'nearby/vengurla_bandar.jpg',
    desc:     'Vengurla was one of the most significant ports on the Konkan coast during the Portuguese and Dutch colonial period, and its old harbour — the Bandar — still carries that history in its bones. Weathered warehouses, a daily fish auction, and fishing trawlers loading ice and fuel make this one of the most atmospheric spots in the region.',
    facts: [
      { label: 'Distance',    value: '~25 km' },
      { label: 'Period',      value: 'Portuguese era port' },
      { label: 'Type',        value: 'Heritage & Culture' },
      { label: 'Best Time',   value: 'Dawn fish market' }
    ]
  },
  {
    name:     'Tarkarli Backwaters',
    category: 'beach',
    dist:     '~40 km from resort',
    image:    'nearby/tarkarlil.jpg',
    desc:     'The backwaters behind Tarkarli Beach offer a completely different face of the Konkan landscape — serene, mirror-still channels fringed with mangroves, coconut palms and paddy fields. Explore by kayak, canoe or traditional dugout boat. The silence here is punctuated only by kingfishers and the dip of paddles in still water.',
    facts: [
      { label: 'Distance',    value: '~40 km' },
      { label: 'Best By',     value: 'Kayak or dugout' },
      { label: 'Type',        value: 'Backwaters' },
      { label: 'Activity',    value: 'Kayaking, Bird watching' }
    ]
  }
];


/* ─────────────────────────────────────────
   NAVBAR (reuse same scroll behaviour)
───────────────────────────────────────────*/
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  // Already solid on this page — just ensure it stays so
}, { passive: true });

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


/* ─────────────────────────────────────────
   FILTER
───────────────────────────────────────────*/
const filterBtns = document.querySelectorAll('.nb-filter-btn');
const cards      = document.querySelectorAll('.nb-card');
const nbEmpty    = document.getElementById('nbEmpty');

let activeFilter = 'all';

function applyFilter(filter) {
  activeFilter = filter;
  let visibleCount = 0;

  cards.forEach(card => {
    const matches = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hidden', !matches);
    if (matches) visibleCount++;
  });

  nbEmpty.hidden = visibleCount > 0;

  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
});


/* ─────────────────────────────────────────
   DETAIL OVERLAY
───────────────────────────────────────────*/
const overlay   = document.getElementById('nbOverlay');
const panel     = document.getElementById('nbPanel');
const backdrop  = document.getElementById('nbBackdrop');
const ovClose   = document.getElementById('nbOvClose');
const ovImg     = document.getElementById('nbOvImg');
const ovTag     = document.getElementById('nbOvTag');
const ovDist    = document.getElementById('nbOvDist');
const ovName    = document.getElementById('nbOvName');
const ovDesc    = document.getElementById('nbOvDesc');
const ovInfo    = document.getElementById('nbOvInfo');
const ovCount   = document.getElementById('nbOvCount');
const ovPrev    = document.getElementById('nbOvPrev');
const ovNext    = document.getElementById('nbOvNext');

let currentIndex = 0;
// Indices of currently visible (filtered) cards
function visibleIndices() {
  return Array.from(cards)
    .filter(c => !c.classList.contains('hidden'))
    .map(c => parseInt(c.dataset.index, 10));
}

function renderOverlay(destIndex) {
  const d = DESTINATIONS[destIndex];
  if (!d) return;

  // Fade image before swap
  ovImg.style.opacity = '0';
  setTimeout(() => {
    ovImg.src = d.image;
    ovImg.alt = d.name;
    ovImg.style.opacity = '1';
  }, 150);

  ovName.textContent = d.name;
  ovDesc.textContent = d.desc;
  ovDist.textContent = d.dist;

  // Tag
  ovTag.textContent  = d.category.charAt(0).toUpperCase() + d.category.slice(1);
  ovTag.className    = `nb-ov-tag ${d.category}`;

  // Facts grid
  ovInfo.innerHTML = d.facts.map(f => `
    <div class="nb-ov-fact">
      <span class="nb-ov-fact-label">${f.label}</span>
      <span class="nb-ov-fact-value">${f.value}</span>
    </div>`).join('');

  // Prev / Next among visible cards
  const vis = visibleIndices();
  const pos = vis.indexOf(destIndex);
  ovCount.textContent = `${pos + 1} / ${vis.length}`;
  ovPrev.disabled = pos <= 0;
  ovNext.disabled = pos >= vis.length - 1;

  currentIndex = destIndex;
}

function openOverlay(destIndex) {
  renderOverlay(destIndex);
  overlay.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('nb-open'));
  ovClose.focus();
}

function closeOverlay() {
  overlay.classList.remove('nb-open');
  overlay.addEventListener('transitionend', () => {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }, { once: true });
}

// Open on card click (card or explore btn)
cards.forEach(card => {
  card.addEventListener('click', () => {
    openOverlay(parseInt(card.dataset.index, 10));
  });
});

// Close triggers
ovClose.addEventListener('click', closeOverlay);
backdrop.addEventListener('click', closeOverlay);
document.addEventListener('keydown', e => {
  if (overlay.hasAttribute('hidden')) return;
  if (e.key === 'Escape')      closeOverlay();
  if (e.key === 'ArrowLeft')   navigateOverlay(-1);
  if (e.key === 'ArrowRight')  navigateOverlay(1);
});

// Prev / Next navigation
function navigateOverlay(dir) {
  const vis = visibleIndices();
  const pos = vis.indexOf(currentIndex);
  const next = pos + dir;
  if (next >= 0 && next < vis.length) renderOverlay(vis[next]);
}
ovPrev.addEventListener('click', () => navigateOverlay(-1));
ovNext.addEventListener('click', () => navigateOverlay(1));

// Touch swipe support on panel
let touchStartX = 0;
panel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
panel.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) navigateOverlay(dx < 0 ? 1 : -1);
}, { passive: true });


/* ─────────────────────────────────────────
   FILTER BAR — sticky offset update on scroll
   (accounts for navbar height)
───────────────────────────────────────────*/
const filterBar = document.getElementById('filterBar');
function updateFilterTop() {
  const navH = navbar ? navbar.offsetHeight : 64;
  filterBar.style.top = navH + 'px';
}
updateFilterTop();
window.addEventListener('resize', updateFilterTop, { passive: true });


/* ─────────────────────────────────────────
   CARD REVEAL ANIMATION (simple observer)
───────────────────────────────────────────*/
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }, i * 60);
    cardObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

cards.forEach(card => {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(28px)';
  card.style.transition = 'opacity 0.55s ease, transform 0.55s ease, box-shadow 0.4s ease, transform 0.4s ease';
  cardObserver.observe(card);
});
