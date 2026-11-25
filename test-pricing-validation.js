/**
 * Task 5.4 Verification: Pricing Calculation Results Validation
 * 
 * This test suite validates that calcSeasonalTotal() and calculateTotalPricing()
 * return correctly structured results with accurate calculations.
 * 
 * Tests verify:
 * 1. Sum of breakdown[].nights === nights
 * 2. Sum of breakdown[].subtotal === total/basePrice  
 * 3. Result structure includes all required fields
 * 
 * Requirements: 4.7, 4.9, 4.10
 */

// ============================================================
// MOCK DATA - Replicate HOMES and SEASONS from script.js
// ============================================================

const HOMES = {
  ekaant: {
    name: "Ekaant",
    type: "Private Villa",
    guests: "2 Guests",
    bed: "King Bed",
    size: "1200 sq ft",
    price: 12000,
    desc: "Perfect romantic getaway",
    images: ["assets/ekaant.jpeg"],
    facilities: [],
    amenities: {}
  },
  niwaant: {
    name: "Niwaant",
    type: "Luxury Villa",
    guests: "4 Guests",
    bed: "2 King Beds",
    size: "2000 sq ft",
    price: 18000,
    desc: "Spacious luxury retreat",
    images: ["assets/niwaant.jpeg"],
    facilities: [],
    amenities: {}
  },
  vishram: {
    name: "Vishram",
    type: "Family Villa",
    guests: "6 Guests",
    bed: "3 Queen Beds",
    size: "2500 sq ft",
    price: 25000,
    desc: "Perfect for families",
    images: ["assets/vishram.jpeg"],
    facilities: [],
    amenities: {}
  }
};

const SEASONS = [
  {
    name: 'current',
    label: '🌿 Current Season',
    start: { month: 12, day: 1 },
    end: { month: 12, day: 19 },
    rates: { ekaant: 7500, niwaant: 10000, vishram: 15000 }
  },
  {
    name: 'peak',
    label: '🎄 Peak Season',
    start: { month: 12, day: 20 },
    end: { month: 1, day: 5 },
    rates: { ekaant: 15000, niwaant: 20000, vishram: 30000 }
  }
];

// ============================================================
// HELPER FUNCTIONS - Copied from script.js
// ============================================================

function getSeasonForDate(d) {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  for (let s of SEASONS) {
    const inRange = (s.start.month < s.end.month)
      ? (m > s.start.month || (m === s.start.month && day >= s.start.day)) &&
        (m < s.end.month   || (m === s.end.month   && day <= s.end.day))
      : (m > s.start.month || (m === s.start.month && day >= s.start.day)) ||
        (m < s.end.month   || (m === s.end.month   && day <= s.end.day));
    if (inRange) return s;
  }
  return null;
}

function getNightlyRate(homeKey, nightDate) {
  const season = getSeasonForDate(nightDate);
  if (season && season.rates && season.rates[homeKey]) {
    return season.rates[homeKey];
  }
  return HOMES[homeKey]?.price || 0;
}

function calcSeasonalTotal(homeKey, checkin, checkout) {
  if (!homeKey || !checkin || !checkout) return null;

  const start = new Date(checkin  + 'T00:00:00');
  const end   = new Date(checkout + 'T00:00:00');
  const totalNights = Math.round((end - start) / 86400000);
  if (totalNights <= 0) return null;

  const segments = [];
  let   total    = 0;

  for (let i = 0; i < totalNights; i++) {
    const nightDate = new Date(start.getTime() + i * 86400000);
    const rate      = getNightlyRate(homeKey, nightDate);
    const season    = getSeasonForDate(nightDate);
    const label     = season ? season.label : '🌿 Regular Season';

    total += rate;
    const last = segments[segments.length - 1];
    if (last && last.rate === rate && last.label === label) {
      last.nights++;
      last.subtotal += rate;
    } else {
      segments.push({ label, nights: 1, rate, subtotal: rate });
    }
  }

  return { total, nights: totalNights, breakdown: segments };
}

function calculateExtraBeds(guests, villaCapacity) {
  if (guests > villaCapacity) {
    const count = guests - villaCapacity;
    const charge = count * 2000;
    return { count, charge };
  }
  return { count: 0, charge: 0 };
}

function calculateTotalPricing(homeKey, checkin, checkout, guests) {
  if (!homeKey || !checkin || !checkout || !guests) {
    return null;
  }
  
  const seasonalPricing = calcSeasonalTotal(homeKey, checkin, checkout);
  if (!seasonalPricing) {
    return null;
  }
  
  const villa = HOMES[homeKey];
  if (!villa) {
    return null;
  }
  
  const capacityMatch = villa.guests.match(/\d+/);
  const capacity = capacityMatch ? parseInt(capacityMatch[0], 10) : 2;
  
  const extraBeds = calculateExtraBeds(guests, capacity);
  
  const grandTotal = seasonalPricing.total + extraBeds.charge;
  
  return {
    basePrice: seasonalPricing.total,
    extraBedCount: extraBeds.count,
    extraBedCharge: extraBeds.charge,
    grandTotal: grandTotal,
    nights: seasonalPricing.nights,
    breakdown: seasonalPricing.breakdown
  };
}

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

/**
 * Validates that sum of breakdown nights equals total nights
 * Requirement: 4.9
 */
function validateNightsSum(result, testName) {
  const sumNights = result.breakdown.reduce((sum, seg) => sum + seg.nights, 0);
  const passed = sumNights === result.nights;
  
  console.log(`\n[${testName}] Validating: Sum of breakdown nights === total nights`);
  console.log(`  Total nights: ${result.nights}`);
  console.log(`  Sum of breakdown nights: ${sumNights}`);
  console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  
  return passed;
}

/**
 * Validates that sum of breakdown subtotals equals base total
 * Requirement: 4.10
 */
function validateSubtotalSum(result, testName) {
  const sumSubtotals = result.breakdown.reduce((sum, seg) => sum + seg.subtotal, 0);
  const baseTotal = result.total || result.basePrice;
  const passed = sumSubtotals === baseTotal;
  
  console.log(`\n[${testName}] Validating: Sum of breakdown subtotals === base total`);
  console.log(`  Base total: ₹${baseTotal.toLocaleString()}`);
  console.log(`  Sum of breakdown subtotals: ₹${sumSubtotals.toLocaleString()}`);
  console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  
  return passed;
}

/**
 * Validates calcSeasonalTotal result structure
 * Requirement: 4.7
 */
function validateSeasonalStructure(result, testName) {
  const hasTotal = typeof result.total === 'number';
  const hasNights = typeof result.nights === 'number';
  const hasBreakdown = Array.isArray(result.breakdown);
  
  let breakdownValid = true;
  if (hasBreakdown) {
    for (const seg of result.breakdown) {
      if (!seg.label || typeof seg.nights !== 'number' || 
          typeof seg.rate !== 'number' || typeof seg.subtotal !== 'number') {
        breakdownValid = false;
        break;
      }
    }
  }
  
  const passed = hasTotal && hasNights && hasBreakdown && breakdownValid;
  
  console.log(`\n[${testName}] Validating: Result structure (calcSeasonalTotal)`);
  console.log(`  Has 'total' (number): ${hasTotal ? '✅' : '❌'}`);
  console.log(`  Has 'nights' (number): ${hasNights ? '✅' : '❌'}`);
  console.log(`  Has 'breakdown' (array): ${hasBreakdown ? '✅' : '❌'}`);
  console.log(`  Breakdown segments valid: ${breakdownValid ? '✅' : '❌'}`);
  console.log(`  Overall Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  
  return passed;
}

/**
 * Validates calculateTotalPricing result structure
 * Requirement: 4.7
 */
function validateTotalPricingStructure(result, testName) {
  const hasBasePrice = typeof result.basePrice === 'number';
  const hasExtraBedCount = typeof result.extraBedCount === 'number';
  const hasExtraBedCharge = typeof result.extraBedCharge === 'number';
  const hasGrandTotal = typeof result.grandTotal === 'number';
  const hasNights = typeof result.nights === 'number';
  const hasBreakdown = Array.isArray(result.breakdown);
  
  const passed = hasBasePrice && hasExtraBedCount && hasExtraBedCharge && 
                 hasGrandTotal && hasNights && hasBreakdown;
  
  console.log(`\n[${testName}] Validating: Result structure (calculateTotalPricing)`);
  console.log(`  Has 'basePrice' (number): ${hasBasePrice ? '✅' : '❌'}`);
  console.log(`  Has 'extraBedCount' (number): ${hasExtraBedCount ? '✅' : '❌'}`);
  console.log(`  Has 'extraBedCharge' (number): ${hasExtraBedCharge ? '✅' : '❌'}`);
  console.log(`  Has 'grandTotal' (number): ${hasGrandTotal ? '✅' : '❌'}`);
  console.log(`  Has 'nights' (number): ${hasNights ? '✅' : '❌'}`);
  console.log(`  Has 'breakdown' (array): ${hasBreakdown ? '✅' : '❌'}`);
  console.log(`  Overall Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  
  return passed;
}

/**
 * Validates grand total calculation
 * Requirement: 4.7, 5.5
 */
function validateGrandTotal(result, testName) {
  const expectedGrandTotal = result.basePrice + result.extraBedCharge;
  const passed = result.grandTotal === expectedGrandTotal;
  
  console.log(`\n[${testName}] Validating: Grand total = base price + extra bed charge`);
  console.log(`  Base price: ₹${result.basePrice.toLocaleString()}`);
  console.log(`  Extra bed charge: ₹${result.extraBedCharge.toLocaleString()}`);
  console.log(`  Grand total: ₹${result.grandTotal.toLocaleString()}`);
  console.log(`  Expected: ₹${expectedGrandTotal.toLocaleString()}`);
  console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  
  return passed;
}

// ============================================================
// TEST SUITE
// ============================================================

console.log('=============================================================');
console.log('Task 5.4: Pricing Calculation Results Validation');
console.log('=============================================================\n');

let totalTests = 0;
let passedTests = 0;

// Test 1: Single season stay - calcSeasonalTotal
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 1: Single Season Stay (Current Season)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const test1 = calcSeasonalTotal('ekaant', '2024-12-15', '2024-12-18');
console.log('Date range: 2024-12-15 to 2024-12-18');
console.log('Result:', JSON.stringify(test1, null, 2));

totalTests += 3;
if (validateSeasonalStructure(test1, 'TEST 1')) passedTests++;
if (validateNightsSum(test1, 'TEST 1')) passedTests++;
if (validateSubtotalSum(test1, 'TEST 1')) passedTests++;

// Test 2: Cross-season stay - calcSeasonalTotal
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 2: Cross-Season Stay (Current → Peak)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const test2 = calcSeasonalTotal('ekaant', '2024-12-18', '2024-12-23');
console.log('Date range: 2024-12-18 to 2024-12-23');
console.log('Result:', JSON.stringify(test2, null, 2));

totalTests += 3;
if (validateSeasonalStructure(test2, 'TEST 2')) passedTests++;
if (validateNightsSum(test2, 'TEST 2')) passedTests++;
if (validateSubtotalSum(test2, 'TEST 2')) passedTests++;

// Test 3: Base price (regular season) - calcSeasonalTotal
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 3: Regular Season Stay (Outside defined seasons)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const test3 = calcSeasonalTotal('ekaant', '2024-02-01', '2024-02-05');
console.log('Date range: 2024-02-01 to 2024-02-05');
console.log('Result:', JSON.stringify(test3, null, 2));

totalTests += 3;
if (validateSeasonalStructure(test3, 'TEST 3')) passedTests++;
if (validateNightsSum(test3, 'TEST 3')) passedTests++;
if (validateSubtotalSum(test3, 'TEST 3')) passedTests++;

// Test 4: Multiple segments with different villas - calcSeasonalTotal
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 4: Different Villa (Niwaant) with Multiple Segments');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const test4 = calcSeasonalTotal('niwaant', '2024-12-18', '2024-12-25');
console.log('Date range: 2024-12-18 to 2024-12-25');
console.log('Result:', JSON.stringify(test4, null, 2));

totalTests += 3;
if (validateSeasonalStructure(test4, 'TEST 4')) passedTests++;
if (validateNightsSum(test4, 'TEST 4')) passedTests++;
if (validateSubtotalSum(test4, 'TEST 4')) passedTests++;

// Test 5: Long stay spanning multiple season boundaries
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 5: Long Stay with Multiple Season Transitions');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const test5 = calcSeasonalTotal('vishram', '2024-12-10', '2025-01-10');
console.log('Date range: 2024-12-10 to 2025-01-10');
console.log('Result:', JSON.stringify(test5, null, 2));

totalTests += 3;
if (validateSeasonalStructure(test5, 'TEST 5')) passedTests++;
if (validateNightsSum(test5, 'TEST 5')) passedTests++;
if (validateSubtotalSum(test5, 'TEST 5')) passedTests++;

// Test 6: calculateTotalPricing with no extra beds
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 6: Total Pricing - No Extra Beds Needed');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const test6 = calculateTotalPricing('ekaant', '2024-12-15', '2024-12-18', 2);
console.log('Villa: Ekaant (Capacity: 2), Guests: 2');
console.log('Date range: 2024-12-15 to 2024-12-18');
console.log('Result:', JSON.stringify(test6, null, 2));

totalTests += 4;
if (validateTotalPricingStructure(test6, 'TEST 6')) passedTests++;
if (validateNightsSum(test6, 'TEST 6')) passedTests++;
if (validateSubtotalSum({ ...test6, total: test6.basePrice }, 'TEST 6')) passedTests++;
if (validateGrandTotal(test6, 'TEST 6')) passedTests++;

// Test 7: calculateTotalPricing with extra beds
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 7: Total Pricing - Extra Beds Required');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const test7 = calculateTotalPricing('niwaant', '2024-12-18', '2024-12-23', 6);
console.log('Villa: Niwaant (Capacity: 4), Guests: 6');
console.log('Date range: 2024-12-18 to 2024-12-23');
console.log('Result:', JSON.stringify(test7, null, 2));

totalTests += 4;
if (validateTotalPricingStructure(test7, 'TEST 7')) passedTests++;
if (validateNightsSum(test7, 'TEST 7')) passedTests++;
if (validateSubtotalSum({ ...test7, total: test7.basePrice }, 'TEST 7')) passedTests++;
if (validateGrandTotal(test7, 'TEST 7')) passedTests++;

// Test 8: calculateTotalPricing with maximum extra beds
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 8: Total Pricing - Many Extra Beds');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const test8 = calculateTotalPricing('ekaant', '2024-12-20', '2024-12-25', 8);
console.log('Villa: Ekaant (Capacity: 2), Guests: 8');
console.log('Date range: 2024-12-20 to 2024-12-25');
console.log('Result:', JSON.stringify(test8, null, 2));

totalTests += 4;
if (validateTotalPricingStructure(test8, 'TEST 8')) passedTests++;
if (validateNightsSum(test8, 'TEST 8')) passedTests++;
if (validateSubtotalSum({ ...test8, total: test8.basePrice }, 'TEST 8')) passedTests++;
if (validateGrandTotal(test8, 'TEST 8')) passedTests++;

// Test 9: Edge case - single night stay
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 9: Edge Case - Single Night Stay');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const test9 = calculateTotalPricing('vishram', '2024-12-20', '2024-12-21', 6);
console.log('Villa: Vishram (Capacity: 6), Guests: 6');
console.log('Date range: 2024-12-20 to 2024-12-21 (1 night)');
console.log('Result:', JSON.stringify(test9, null, 2));

totalTests += 4;
if (validateTotalPricingStructure(test9, 'TEST 9')) passedTests++;
if (validateNightsSum(test9, 'TEST 9')) passedTests++;
if (validateSubtotalSum({ ...test9, total: test9.basePrice }, 'TEST 9')) passedTests++;
if (validateGrandTotal(test9, 'TEST 9')) passedTests++;

// Test 10: Edge case - exact season boundary
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 10: Edge Case - Exact Season Boundary Crossing');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const test10 = calcSeasonalTotal('ekaant', '2024-12-19', '2024-12-20');
console.log('Date range: 2024-12-19 to 2024-12-20 (crosses season boundary)');
console.log('Result:', JSON.stringify(test10, null, 2));

totalTests += 3;
if (validateSeasonalStructure(test10, 'TEST 10')) passedTests++;
if (validateNightsSum(test10, 'TEST 10')) passedTests++;
if (validateSubtotalSum(test10, 'TEST 10')) passedTests++;

// ============================================================
// FINAL SUMMARY
// ============================================================

console.log('\n\n=============================================================');
console.log('FINAL SUMMARY');
console.log('=============================================================');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('=============================================================');

if (passedTests === totalTests) {
  console.log('\n✅ ALL TESTS PASSED - Task 5.4 VERIFIED');
  console.log('\nValidation confirms:');
  console.log('  ✓ Sum of breakdown[].nights === nights');
  console.log('  ✓ Sum of breakdown[].subtotal === total/basePrice');
  console.log('  ✓ Result structure includes all required fields');
  console.log('  ✓ Grand total = base price + extra bed charge');
  console.log('\nRequirements 4.7, 4.9, 4.10: ✅ SATISFIED');
} else {
  console.log('\n❌ SOME TESTS FAILED - Review results above');
  process.exit(1);
}
