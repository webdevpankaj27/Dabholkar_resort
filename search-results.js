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
  
  // TODO: Continue with villa display logic (implemented in other tasks)
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearchResults);
} else {
  initSearchResults();
}
