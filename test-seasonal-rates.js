/**
 * Node.js test script for seasonal rate determination
 * Tests getNightlyRate() function with various dates and villas
 * 
 * Requirements: 4.3, 4.4
 */

// SEASONS array (copied from script.js)
const SEASONS = [
  // Nov 12 - Dec 20 (current season)
  {
    name: 'Current Season', label: '🌿 Current Season',
    start: { month: 11, day: 12 }, end: { month: 12, day: 20 },
    rates: { ekaant:7500, niwaant:11700, nishant:7500, nitaant:7500, savali:18000, sushaant:11700 }
  },
  // Dec 20 - Jan 5 (peak - double price)
  {
    name: 'Peak Season', label: '🎄 Peak Season',
    start: { month: 12, day: 20 }, end: { month: 1, day: 5 },
    rates: { ekaant:15000, niwaant:23400, nishant:15000, nitaant:15000, savali:36000, sushaant:23400 }
  }
];

// HOMES object (simplified - only need base prices)
const HOMES = {
  ekaant: { price: 12000 },
  savali: { price: 18000 },
  niwaant: { price: 15600 },
  nishant: { price: 10000 },
  nitaant: { price: 10000 },
  sushaant: { price: 15600 }
};

/**
 * Returns the season object that covers the given date,
 * or null for base pricing. `date` is a JS Date at midnight.
 */
function getSeasonForDate(date) {
  const m = date.getMonth() + 1; // 1–12
  const d = date.getDate();

  for (const season of SEASONS) {
    const s = season.start;
    const e = season.end;

    // Handle year-crossing ranges (e.g. Dec 25 – Jan 5)
    if (s.month > e.month) {
      if ((m === s.month && d >= s.day) || (m === e.month && d <= e.day)) {
        return season;
      }
    } else {
      if (
        (m === s.month && d >= s.day && (s.month !== e.month || d <= e.day)) ||
        (m === e.month && d <= e.day && s.month !== e.month)
      ) {
        return season;
      }
    }
  }
  return null; // base price
}

/**
 * Returns the per-night price for a home on a specific date.
 * `homeKey` is the key in HOMES; `date` is a JS Date at midnight.
 */
function getNightlyRate(homeKey, date) {
  const base   = HOMES[homeKey] ? HOMES[homeKey].price : 0;
  const season = getSeasonForDate(date);
  if (!season) return base;
  return (season.rates && season.rates[homeKey] != null) ? season.rates[homeKey] : base;
}

// Test framework
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(description, homeKey, dateStr, expectedRate, expectedSeason) {
  totalTests++;
  const testDate = new Date(dateStr + 'T00:00:00');
  const actualRate = getNightlyRate(homeKey, testDate);
  const actualSeason = getSeasonForDate(testDate);
  
  const rateMatch = actualRate === expectedRate;
  const seasonMatch = expectedSeason === null ? actualSeason === null : actualSeason?.name === expectedSeason;
  const passed = rateMatch && seasonMatch;
  
  if (passed) {
    passedTests++;
    console.log(`✓ ${description}`);
  } else {
    failedTests++;
    console.log(`✗ ${description}`);
    console.log(`  Villa: ${homeKey}, Date: ${dateStr}`);
    console.log(`  Expected: ₹${expectedRate} (${expectedSeason || 'Regular Season'})`);
    console.log(`  Got: ₹${actualRate} (${actualSeason?.name || 'Regular Season'})`);
  }
}

console.log('\n🗓️  Seasonal Rate Determination Tests\n');
console.log('=' .repeat(60));

// Test Current Season (Nov 12 - Dec 20)
console.log('\n📅 Testing Current Season (Nov 12 - Dec 20)...\n');

test('Ekaant - Start of Current Season (Nov 12)', 'ekaant', '2024-11-12', 7500, 'Current Season');
test('Ekaant - Middle of Current Season (Dec 1)', 'ekaant', '2024-12-01', 7500, 'Current Season');
test('Ekaant - Last day of Current Season (Dec 20)', 'ekaant', '2024-12-20', 7500, 'Current Season');
test('Savali - Start of Current Season (Nov 12)', 'savali', '2024-11-12', 18000, 'Current Season');
test('Savali - Middle of Current Season (Nov 25)', 'savali', '2024-11-25', 18000, 'Current Season');
test('Niwaant - Current Season (Dec 15)', 'niwaant', '2024-12-15', 11700, 'Current Season');

// Test Peak Season (Dec 20 - Jan 5)
console.log('\n📅 Testing Peak Season (Dec 20 - Jan 5)...\n');

test('Ekaant - Start of Peak Season (Dec 20)', 'ekaant', '2024-12-20', 7500, 'Current Season');
test('Ekaant - Peak Season (Dec 21)', 'ekaant', '2024-12-21', 15000, 'Peak Season');
test('Ekaant - Christmas during Peak Season (Dec 25)', 'ekaant', '2024-12-25', 15000, 'Peak Season');
test('Ekaant - New Year during Peak Season (Jan 1)', 'ekaant', '2025-01-01', 15000, 'Peak Season');
test('Ekaant - Last day of Peak Season (Jan 5)', 'ekaant', '2025-01-05', 15000, 'Peak Season');
test('Savali - Christmas during Peak Season (Dec 25)', 'savali', '2024-12-25', 36000, 'Peak Season');
test('Savali - New Year during Peak Season (Jan 1)', 'savali', '2025-01-01', 36000, 'Peak Season');
test('Niwaant - Peak Season (Dec 30)', 'niwaant', '2024-12-30', 23400, 'Peak Season');

// Test Regular Season (Outside defined seasons)
console.log('\n📅 Testing Regular Season (Base Prices)...\n');

test('Ekaant - Before Current Season (Nov 11)', 'ekaant', '2024-11-11', 12000, null);
test('Ekaant - After Peak Season (Jan 6)', 'ekaant', '2025-01-06', 12000, null);
test('Ekaant - Regular Season in Summer (Jun 15)', 'ekaant', '2025-06-15', 12000, null);
test('Savali - Before Current Season (Nov 1)', 'savali', '2024-11-01', 18000, null);
test('Savali - After Peak Season (Feb 1)', 'savali', '2025-02-01', 18000, null);
test('Savali - Regular Season in October (Oct 20)', 'savali', '2024-10-20', 18000, null);

// Test Season Boundaries (Critical!)
console.log('\n📅 Testing Season Boundaries...\n');

test('Boundary - Day before Current Season (Nov 11)', 'ekaant', '2024-11-11', 12000, null);
test('Boundary - First day of Current Season (Nov 12)', 'ekaant', '2024-11-12', 7500, 'Current Season');
test('Boundary - Last day of Current Season (Dec 20)', 'ekaant', '2024-12-20', 7500, 'Current Season');
test('Boundary - Day after Current Season (Dec 21)', 'ekaant', '2024-12-21', 15000, 'Peak Season');
test('Boundary - Last day of Peak Season (Jan 5)', 'ekaant', '2025-01-05', 15000, 'Peak Season');
test('Boundary - Day after Peak Season (Jan 6)', 'ekaant', '2025-01-06', 12000, null);

// Test Multiple Villas
console.log('\n📅 Testing Multiple Villas...\n');

test('Multiple - Niwaant Peak Season (Dec 25)', 'niwaant', '2024-12-25', 23400, 'Peak Season');
test('Multiple - Nishant Current Season (Nov 20)', 'nishant', '2024-11-20', 7500, 'Current Season');
test('Multiple - Nitaant Peak Season (Jan 1)', 'nitaant', '2025-01-01', 15000, 'Peak Season');
test('Multiple - Sushaant Current Season (Dec 10)', 'sushaant', '2024-12-10', 11700, 'Current Season');

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Test Summary:\n');
console.log(`Total Tests: ${totalTests}`);
console.log(`✓ Passed: ${passedTests}`);
console.log(`✗ Failed: ${failedTests}`);
console.log(`Pass Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

if (failedTests === 0) {
  console.log('✅ All tests passed! Seasonal rate determination is working correctly.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Review the output above for details.\n');
  process.exit(1);
}
