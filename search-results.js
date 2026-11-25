/* ═══════════════════════════════════════════
   DABHOLKAR RESORT — search-results.js
   Search results page functionality
═══════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────
   URL PARAMETER PARSING
───────────────────────────────────────────*/

/**
 * Parses and validates URL parameters for search criteria.
 * 
 * @returns {SearchParams|null} Object with {checkin, checkout, guests} or null if invalid
 * 
 * Validates:
 * - checkin is a valid ISO date string (YYYY-MM-DD)
 * - checkout is a valid ISO date string (YYYY-MM-DD)
 * - guests is a positive integer >= 1
 * - checkin is today or in the future
 * - checkout is strictly after checkin
 * 
 * Requirements: 2.1, 3.4, 3.5, 3.6
 */
function parseSearchParams() {
  console.log('[parseSearchParams] Starting URL parameter parsing...');
  
  // Extract parameters from URL query string
  const params = new URLSearchParams(window.location.search);
  const checkin = params.get('checkin');
  const checkout = params.get('checkout');
  const guestsStr = params.get('guests');
  
  console.log('[parseSearchParams] Raw parameters:', {
    checkin,
    checkout,
    guests: guestsStr
  });
  
  // Validate presence of all required parameters
  if (!checkin || !checkout || !guestsStr) {
    console.error('[parseSearchParams] Missing required parameters');
    return null;
  }
  
  // Parse guest count as integer
  const guests = parseInt(guestsStr, 10);
  
  // Validate guest count is a positive integer >= 1
  if (isNaN(guests) || guests < 1) {
    console.error('[parseSearchParams] Invalid guest count:', guestsStr);
    return null;
  }
  
  // Validate date format using ISO date string format (YYYY-MM-DD)
  // This regex ensures the format is correct before parsing
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!isoDatePattern.test(checkin)) {
    console.error('[parseSearchParams] Invalid checkin date format:', checkin);
    return null;
  }
  
  if (!isoDatePattern.test(checkout)) {
    console.error('[parseSearchParams] Invalid checkout date format:', checkout);
    return null;
  }
  
  // Parse dates and validate they are valid calendar dates
  const checkinDate = new Date(checkin + 'T00:00:00');
  const checkoutDate = new Date(checkout + 'T00:00:00');
  
  // Check if dates are valid (not NaN)
  if (isNaN(checkinDate.getTime())) {
    console.error('[parseSearchParams] Invalid checkin date:', checkin);
    return null;
  }
  
  if (isNaN(checkoutDate.getTime())) {
    console.error('[parseSearchParams] Invalid checkout date:', checkout);
    return null;
  }
  
  // Validate checkin is today or in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (checkinDate < today) {
    console.error('[parseSearchParams] Check-in date is in the past:', checkin);
    return null;
  }
  
  // Validate checkout is strictly after checkin
  if (checkoutDate <= checkinDate) {
    console.error('[parseSearchParams] Check-out date must be after check-in:', {
      checkin,
      checkout
    });
    return null;
  }
  
  // All validations passed - return SearchParams object
  const searchParams = {
    checkin,
    checkout,
    guests
  };
  
  console.log('[parseSearchParams] Successfully parsed and validated parameters:', searchParams);
  
  return searchParams;
}

/* ─────────────────────────────────────────
   ERROR HANDLING
───────────────────────────────────────────*/

/**
 * Displays error message and redirects to homepage after 2 seconds.
 * 
 * Requirements: 2.2, 3.7, 3.8
 */
function handleInvalidParameters() {
  console.log('[handleInvalidParameters] Handling invalid search parameters...');
  
  // Get DOM elements
  const errorContainer = document.getElementById('error-container');
  const villaResults = document.getElementById('villa-results');
  const resultsCount = document.getElementById('results-count');
  const searchCriteriaBar = document.querySelector('.search-criteria-bar');
  
  // Hide villa results container
  if (villaResults) {
    villaResults.style.display = 'none';
  }
  
  // Hide results count
  if (resultsCount) {
    resultsCount.style.display = 'none';
  }
  
  // Hide search criteria display
  if (searchCriteriaBar) {
    searchCriteriaBar.style.display = 'none';
  }
  
  // Update error message content
  const errorTitle = document.getElementById('error-title');
  const errorMessage = document.getElementById('error-message');
  
  if (errorTitle) {
    errorTitle.textContent = 'Invalid Search Parameters';
  }
  
  if (errorMessage) {
    errorMessage.textContent = 'Invalid search parameters. Please enter your dates again.';
  }
  
  // Show error container
  if (errorContainer) {
    errorContainer.style.display = 'block';
  }
  
  console.log('[handleInvalidParameters] Error message displayed. Redirecting in 2 seconds...');
  
  // Redirect to homepage after 2 seconds
  setTimeout(() => {
    console.log('[handleInvalidParameters] Redirecting to homepage...');
    window.location.href = 'index.html#book-bar';
  }, 2000);
}

/* ─────────────────────────────────────────
   SEARCH CRITERIA DISPLAY
───────────────────────────────────────────*/

/**
 * Formats a date string (YYYY-MM-DD) into a readable format.
 * Example: "2024-12-25" => "Dec 25, 2024"
 * 
 * @param {string} dateStr - ISO date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDisplayDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Formats guest count for display.
 * Example: 1 => "1 Guest", 2 => "2 Guests"
 * 
 * @param {number} count - Number of guests
 * @returns {string} Formatted guest count string
 */
function formatGuestCount(count) {
  return `${count} ${count === 1 ? 'Guest' : 'Guests'}`;
}

/**
 * Displays search criteria in the search criteria bar section.
 * Updates the check-in, check-out, and guest count displays.
 * 
 * @param {SearchParams} searchParams - Object with {checkin, checkout, guests}
 * 
 * Requirements: 2.1, 3.9
 */
function displaySearchCriteria(searchParams) {
  console.log('[displaySearchCriteria] Displaying search criteria:', searchParams);
  
  // Get DOM elements for display
  const checkinEl = document.getElementById('sc-checkin');
  const checkoutEl = document.getElementById('sc-checkout');
  const guestsEl = document.getElementById('sc-guests');
  
  // Format and display check-in date
  if (checkinEl) {
    const formattedCheckin = formatDisplayDate(searchParams.checkin);
    checkinEl.textContent = formattedCheckin;
    console.log('[displaySearchCriteria] Check-in displayed:', formattedCheckin);
  } else {
    console.error('[displaySearchCriteria] Check-in element #sc-checkin not found');
  }
  
  // Format and display check-out date
  if (checkoutEl) {
    const formattedCheckout = formatDisplayDate(searchParams.checkout);
    checkoutEl.textContent = formattedCheckout;
    console.log('[displaySearchCriteria] Check-out displayed:', formattedCheckout);
  } else {
    console.error('[displaySearchCriteria] Check-out element #sc-checkout not found');
  }
  
  // Format and display guest count
  if (guestsEl) {
    const formattedGuests = formatGuestCount(searchParams.guests);
    guestsEl.textContent = formattedGuests;
    console.log('[displaySearchCriteria] Guests displayed:', formattedGuests);
  } else {
    console.error('[displaySearchCriteria] Guests element #sc-guests not found');
  }
}

/* ─────────────────────────────────────────
   PAGE INITIALIZATION
───────────────────────────────────────────*/

/**
 * Initialize the search results page.
 * Parse URL parameters, display search criteria, and handle errors if validation fails.
 * 
 * Requirements: 2.1, 2.2, 3.7, 3.8, 3.9
 */

/* -----------------------------------------
   EXTRA BED CALCULATION
-------------------------------------------*/

function calculateExtraBeds(guests, capacity) {
  const extraCount = Math.max(0, guests - capacity);
  return {
    count: extraCount,
    charge: extraCount * 2000
  };
}

/* -----------------------------------------
   VILLA CARD RENDERING
-------------------------------------------*/

function renderVillaCards(searchParams) {
  console.log('[renderVillaCards] Starting villa rendering...');
  
  const container = document.getElementById('villa-results');
  if (!container) {
    console.error('[renderVillaCards] Villa results container not found');
    return;
  }
  
  container.innerHTML = '';
  let villaCount = 0;
  
  for (const [villaKey, villa] of Object.entries(HOMES)) {
    console.log(`[renderVillaCards] Processing villa: ${villaKey}`);
    
    const pricing = calcSeasonalTotal(villaKey, searchParams.checkin, searchParams.checkout);
    if (!pricing) {
      console.error(`[renderVillaCards] Failed to calculate pricing for ${villaKey}`);
      continue;
    }
    
    const capacityMatch = villa.guests.match(/\d+/);
    const capacity = capacityMatch ? parseInt(capacityMatch[0], 10) : 2;
    
    const extraBeds = calculateExtraBeds(searchParams.guests, capacity);
    const grandTotal = pricing.total + extraBeds.charge;
    
    const card = document.createElement('article');
    card.className = 'villa-card reveal';
    card.dataset.home = villaKey;
    
    let breakdownHTML = '';
    if (pricing.breakdown.length > 1) {
      let segmentsHTML = pricing.breakdown.map(seg => {
        const icon = seg.label.split(' ')[0];
        const name = seg.label.substring(2);
        return `
          <div class="breakdown-item">
            <span class="breakdown-label">
              <span class="season-icon">${icon}</span>
              ${name}
              <span class="breakdown-nights">(${seg.nights}n)</span>
            </span>
            <span class="breakdown-subtotal">?${seg.subtotal.toLocaleString('en-IN')}</span>
          </div>
        `;
      }).join('');
      
      breakdownHTML = `
        <div class="seasonal-breakdown">
          <div class="breakdown-title">Price Breakdown</div>
          <div class="breakdown-items">
            ${segmentsHTML}
          </div>
        </div>
      `;
    }
    
    let extraBedHTML = '';
    if (extraBeds.count > 0) {
      extraBedHTML = `
        <div class="extra-bed-charge">
          <span class="extra-bed-label">
            <span class="extra-bed-icon">???</span>
            ${extraBeds.count} Extra Bed${extraBeds.count > 1 ? 's' : ''}
          </span>
          <span class="extra-bed-amount">?${extraBeds.charge.toLocaleString('en-IN')}</span>
        </div>
      `;
    }
    
    card.innerHTML = `
      <div class="villa-card-img">
        <img src="${villa.images[0]}" alt="${villa.name} — ${villa.type}">
        <div class="villa-card-badge">${villa.type}</div>
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
            <span class="total-amount">?${grandTotal.toLocaleString('en-IN')}</span>
          </div>
          <span class="nights-label">${pricing.nights} night${pricing.nights > 1 ? 's' : ''}</span>
          
          ${breakdownHTML}
          ${extraBedHTML}
        </div>
        
        <div class="villa-card-actions">
          <button class="btn btn-view-details" onclick="alert('View details coming soon')">View Details</button>
          <button class="btn btn-book-now" onclick="alert('Booking modal integration coming soon')">Book Now</button>
        </div>
      </div>
    `;
    
    container.appendChild(card);
    villaCount++;
    
    console.log(`[renderVillaCards] Added ${villa.name} with grand total: ?${grandTotal.toLocaleString('en-IN')}`);
  }
  
  const countEl = document.getElementById('results-count');
  if (countEl) {
    countEl.textContent = `Showing ${villaCount} ${villaCount === 1 ? 'villa' : 'villas'}`;
    console.log(`[renderVillaCards] Updated results count: ${villaCount} villas`);
  }
  
  console.log(`[renderVillaCards] Successfully rendered ${villaCount} villas`);
}


function initSearchResults() {
  console.log('[initSearchResults] Initializing search results page...');
  
  // Parse and validate URL parameters
  const searchParams = parseSearchParams();
  
  // If parameters are invalid, show error and redirect
  if (!searchParams) {
    console.error('[initSearchResults] Invalid search parameters. Showing error message.');
    handleInvalidParameters();
    return;
  }
  
  console.log('[initSearchResults] Search parameters validated successfully:', searchParams);
  
  // Display search criteria in the search bar
  displaySearchCriteria(searchParams);
  
  console.log('[initSearchResults] Search results page initialized successfully');
  
  // Render villa cards with pricing
  renderVillaCards(searchParams);
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearchResults);
} else {
  initSearchResults();
}
