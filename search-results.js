/* ═══════════════════════════════════════════
   DABHOLKAR RESORT — search-results.js
═══════════════════════════════════════════ */
'use strict';

/* ── URL Parameter Parsing ──────────────── */
function parseSearchParams() {
  const params   = new URLSearchParams(window.location.search);
  const checkin  = params.get('checkin');
  const checkout = params.get('checkout');
  const guestsStr = params.get('guests');

  if (!checkin || !checkout || !guestsStr) return null;

  const guests = parseInt(guestsStr, 10);
  if (isNaN(guests) || guests < 1) return null;

  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (!iso.test(checkin) || !iso.test(checkout)) return null;

  const ci = new Date(checkin  + 'T00:00:00');
  const co = new Date(checkout + 'T00:00:00');
  if (isNaN(ci) || isNaN(co)) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (ci < today) return null;
  if (co <= ci)   return null;

  return { checkin, checkout, guests };
}

/* ── Error Handling ─────────────────────── */
function handleInvalidParameters() {
  const villaResults   = document.getElementById('villa-results');
  const resultsCount   = document.getElementById('results-count');
  const errorContainer = document.getElementById('error-container');

  if (villaResults)   villaResults.style.display   = 'none';
  if (resultsCount)   resultsCount.style.display   = 'none';
  if (errorContainer) errorContainer.style.display = 'block';

  setTimeout(() => { window.location.href = 'index.html'; }, 3000);
}

/* ── Display Search Criteria ────────────── */
function displaySearchCriteria(p) {
  const fmt = ds => new Date(ds + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  const ci  = document.getElementById('sc-checkin');
  const co  = document.getElementById('sc-checkout');
  const gu  = document.getElementById('sc-guests');
  if (ci) ci.textContent = fmt(p.checkin);
  if (co) co.textContent = fmt(p.checkout);
  if (gu) gu.textContent = `${p.guests} ${p.guests === 1 ? 'Guest' : 'Guests'}`;
}

/* ── Extra Bed Calculation ──────────────── */
function calculateExtraBeds(guests, capacity) {
  const count = Math.max(0, guests - capacity);
  return { count, charge: count * 2000 };
}

/* ── Villa Card Rendering ───────────────── */
function renderVillaCards(p) {
  const container = document.getElementById('villa-results');
  if (!container) return;

  container.innerHTML = '';

  if (typeof HOMES === 'undefined') {
    console.error('HOMES not defined — script.js may not have loaded');
    return;
  }

  let count = 0;

  for (const [key, villa] of Object.entries(HOMES)) {
    const pricing = calculateTotalPricing(key, p.checkin, p.checkout, p.guests);
    if (!pricing) continue;

    const { grandTotal, extraBedCount, extraBedCharge, nights, breakdown } = pricing;

    /* Seasonal breakdown rows */
    let breakdownHTML = '';
    if (breakdown.length > 1) {
      const rows = breakdown.map(seg => `
        <div class="breakdown-item">
          <span class="breakdown-label">${seg.label} <span class="breakdown-nights">(${seg.nights}n)</span></span>
          <span class="breakdown-subtotal">&#8377;${seg.subtotal.toLocaleString('en-IN')}</span>
        </div>`).join('');
      breakdownHTML = `
        <div class="seasonal-breakdown">
          <div class="breakdown-title">Price Breakdown</div>
          <div class="breakdown-items">${rows}</div>
        </div>`;
    }

    /* Extra bed row */
    const extraBedHTML = extraBedCount > 0 ? `
      <div class="extra-bed-charge">
        <span class="extra-bed-label">&#x1F6CF; ${extraBedCount} Extra Bed${extraBedCount > 1 ? 's' : ''}</span>
        <span class="extra-bed-amount">&#8377;${extraBedCharge.toLocaleString('en-IN')}</span>
      </div>` : '';

    const card = document.createElement('article');
    card.className = 'villa-card';        /* NO 'reveal' — avoids IntersectionObserver hiding */
    card.dataset.home = key;

    card.innerHTML = `
      <div class="villa-card-img">
        <img src="${villa.images[0]}" alt="${villa.name}" loading="lazy">
        <span class="villa-card-badge">${villa.type}</span>
      </div>
      <div class="villa-card-body">
        <div class="villa-card-meta">
          <span class="villa-type">${villa.type}</span>
          <span class="villa-guests">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            ${villa.guests}
          </span>
        </div>
        <h3>${villa.name}</h3>
        <div class="villa-card-specs">
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M2 4v16M22 4v16M2 8h20M2 16h20M6 8v8M10 8v8M14 8v8M18 8v8"/>
            </svg>
            ${villa.bed}
          </span>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            ${villa.size}
          </span>
        </div>
        <div class="villa-pricing">
          <div class="pricing-total">
            <span class="total-label">Total Price</span>
            <span class="total-amount">&#8377;${grandTotal.toLocaleString('en-IN')}</span>
          </div>
          <span class="nights-label">${nights} night${nights > 1 ? 's' : ''}</span>
          ${breakdownHTML}
          ${extraBedHTML}
        </div>
        <div class="villa-card-actions">
          <button class="btn-view-details" onclick="alert('Details coming soon')">View Details</button>
          <button class="btn-book-now"     data-home="${key}">Book Now</button>
        </div>
      </div>`;

    container.appendChild(card);
    count++;
  }

  const countEl = document.getElementById('results-count');
  if (countEl) countEl.textContent = `Showing ${count} ${count === 1 ? 'villa' : 'villas'}`;
}

/* ── Book Now Button Handler ────────────── */
function setupBookNowButtons(params) {
  document.querySelectorAll('.btn-book-now').forEach(btn => {
    btn.addEventListener('click', () => {
      const homeKey = btn.dataset.home;

      // Open modal using script.js function
      openBookingModal(homeKey);

      // Pre-fill dates and guests from search URL params
      setTimeout(() => {
        const ci = document.getElementById('bm-checkin');
        const co = document.getElementById('bm-checkout');
        const gu = document.getElementById('bm-guests');
        if (ci && params.checkin)  ci.value = params.checkin;
        if (co && params.checkout) co.value = params.checkout;
        if (gu && params.guests)   gu.value = String(params.guests);
        // Trigger live price preview
        if (typeof updatePricePreview === 'function') updatePricePreview();
      }, 50);
    });
  });
}

/* ── Init ───────────────────────────────── */
function initSearchResults() {
  const params = parseSearchParams();
  if (!params) { handleInvalidParameters(); return; }
  displaySearchCriteria(params);
  renderVillaCards(params);
  setupBookNowButtons(params);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearchResults);
} else {
  initSearchResults();
}