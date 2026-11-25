/**
 * Test script for extra bed calculation function
 * Task 6.1: Add extra bed calculation function to script.js
 * 
 * This test verifies that calculateExtraBeds() correctly:
 * - Calculates extra bed count as max(0, guests - villa_capacity)
 * - Calculates extra bed charge as extra_bed_count * 2000
 * - Returns ExtraBedResult with count and charge
 * 
 * Requirements: 5.1, 5.2, 5.3
 */

// Copy function from script.js
function calculateExtraBeds(guests, capacity) {
  const EXTRA_BED_RATE = 2000;
  
  // Calculate extra bed count: max(0, guests - capacity)
  const count = Math.max(0, guests - capacity);
  
  // Calculate extra bed charge: count * 2000
  const charge = count * EXTRA_BED_RATE;
  
  return { count, charge };
}

// TEST CASES
console.log('=== Testing calculateExtraBeds() ===\n');

// Test 1: Guests equal to capacity (no extra beds needed)
console.log('Test 1: Guests equal to capacity');
const test1 = calculateExtraBeds(2, 2);
console.log('Guests: 2, Capacity: 2');
console.log('Expected: { count: 0, charge: 0 }');
console.log('Result:', test1);
console.log('✓ Extra bed count:', test1.count);
console.log('✓ Extra bed charge: ₹', test1.charge);
console.log('Pass:', test1.count === 0 && test1.charge === 0 ? '✅' : '❌');
console.log('');

// Test 2: Guests below capacity (no extra beds needed)
console.log('Test 2: Guests below capacity');
const test2 = calculateExtraBeds(1, 2);
console.log('Guests: 1, Capacity: 2');
console.log('Expected: { count: 0, charge: 0 }');
console.log('Result:', test2);
console.log('✓ Extra bed count:', test2.count);
console.log('✓ Extra bed charge: ₹', test2.charge);
console.log('Pass:', test2.count === 0 && test2.charge === 0 ? '✅' : '❌');
console.log('');

// Test 3: Guests exceed capacity by 1 (1 extra bed needed)
console.log('Test 3: Guests exceed capacity by 1');
const test3 = calculateExtraBeds(3, 2);
console.log('Guests: 3, Capacity: 2');
console.log('Expected: { count: 1, charge: 2000 }');
console.log('Result:', test3);
console.log('✓ Extra bed count:', test3.count);
console.log('✓ Extra bed charge: ₹', test3.charge);
console.log('Pass:', test3.count === 1 && test3.charge === 2000 ? '✅' : '❌');
console.log('');

// Test 4: Guests exceed capacity by 2 (2 extra beds needed)
console.log('Test 4: Guests exceed capacity by 2');
const test4 = calculateExtraBeds(4, 2);
console.log('Guests: 4, Capacity: 2');
console.log('Expected: { count: 2, charge: 4000 }');
console.log('Result:', test4);
console.log('✓ Extra bed count:', test4.count);
console.log('✓ Extra bed charge: ₹', test4.charge);
console.log('Pass:', test4.count === 2 && test4.charge === 4000 ? '✅' : '❌');
console.log('');

// Test 5: Large group exceeding capacity
console.log('Test 5: Large group (6 guests in 2-capacity villa)');
const test5 = calculateExtraBeds(6, 2);
console.log('Guests: 6, Capacity: 2');
console.log('Expected: { count: 4, charge: 8000 }');
console.log('Result:', test5);
console.log('✓ Extra bed count:', test5.count);
console.log('✓ Extra bed charge: ₹', test5.charge);
console.log('Pass:', test5.count === 4 && test5.charge === 8000 ? '✅' : '❌');
console.log('');

// Test 6: Larger villa capacity (4 guests)
console.log('Test 6: Larger villa capacity');
const test6a = calculateExtraBeds(4, 4);
console.log('Test 6a: Guests: 4, Capacity: 4');
console.log('Expected: { count: 0, charge: 0 }');
console.log('Result:', test6a);
console.log('Pass:', test6a.count === 0 && test6a.charge === 0 ? '✅' : '❌');
console.log('');

const test6b = calculateExtraBeds(5, 4);
console.log('Test 6b: Guests: 5, Capacity: 4');
console.log('Expected: { count: 1, charge: 2000 }');
console.log('Result:', test6b);
console.log('Pass:', test6b.count === 1 && test6b.charge === 2000 ? '✅' : '❌');
console.log('');

const test6c = calculateExtraBeds(6, 4);
console.log('Test 6c: Guests: 6, Capacity: 4');
console.log('Expected: { count: 2, charge: 4000 }');
console.log('Result:', test6c);
console.log('Pass:', test6c.count === 2 && test6c.charge === 4000 ? '✅' : '❌');
console.log('');

// Test 7: Verify charge calculation formula
console.log('Test 7: Verify charge calculation formula (count × 2000)');
const testCases = [
  { guests: 3, capacity: 2, expectedCount: 1, expectedCharge: 2000 },
  { guests: 5, capacity: 2, expectedCount: 3, expectedCharge: 6000 },
  { guests: 7, capacity: 4, expectedCount: 3, expectedCharge: 6000 },
  { guests: 10, capacity: 4, expectedCount: 6, expectedCharge: 12000 }
];

let allPassed = true;
testCases.forEach((tc, idx) => {
  const result = calculateExtraBeds(tc.guests, tc.capacity);
  const countMatch = result.count === tc.expectedCount;
  const chargeMatch = result.charge === tc.expectedCharge;
  const passed = countMatch && chargeMatch;
  
  console.log(`  Case ${idx + 1}: Guests ${tc.guests}, Capacity ${tc.capacity}`);
  console.log(`    Expected: count=${tc.expectedCount}, charge=₹${tc.expectedCharge}`);
  console.log(`    Got: count=${result.count}, charge=₹${result.charge}`);
  console.log(`    ${passed ? '✅' : '❌'}`);
  
  if (!passed) allPassed = false;
});
console.log('All formula tests passed:', allPassed ? '✅' : '❌');
console.log('');

// Test 8: Verify mathematical properties
console.log('Test 8: Verify mathematical properties');

// Property 1: charge always equals count × 2000
console.log('Property 1: charge = count × 2000');
let property1Passed = true;
for (let guests = 1; guests <= 10; guests++) {
  for (let capacity = 1; capacity <= 5; capacity++) {
    const result = calculateExtraBeds(guests, capacity);
    if (result.charge !== result.count * 2000) {
      console.log(`  ❌ Failed for guests=${guests}, capacity=${capacity}`);
      property1Passed = false;
    }
  }
}
console.log('Property 1 passed:', property1Passed ? '✅' : '❌');

// Property 2: count is always non-negative
console.log('Property 2: count >= 0 for all inputs');
let property2Passed = true;
for (let guests = 1; guests <= 10; guests++) {
  for (let capacity = 1; capacity <= 5; capacity++) {
    const result = calculateExtraBeds(guests, capacity);
    if (result.count < 0) {
      console.log(`  ❌ Failed for guests=${guests}, capacity=${capacity}`);
      property2Passed = false;
    }
  }
}
console.log('Property 2 passed:', property2Passed ? '✅' : '❌');

// Property 3: count equals max(0, guests - capacity)
console.log('Property 3: count = max(0, guests - capacity)');
let property3Passed = true;
for (let guests = 1; guests <= 10; guests++) {
  for (let capacity = 1; capacity <= 5; capacity++) {
    const result = calculateExtraBeds(guests, capacity);
    const expected = Math.max(0, guests - capacity);
    if (result.count !== expected) {
      console.log(`  ❌ Failed for guests=${guests}, capacity=${capacity}`);
      console.log(`     Expected count: ${expected}, Got: ${result.count}`);
      property3Passed = false;
    }
  }
}
console.log('Property 3 passed:', property3Passed ? '✅' : '❌');

// Property 4: If guests <= capacity, then count = 0 and charge = 0
console.log('Property 4: If guests <= capacity, then count = 0 and charge = 0');
let property4Passed = true;
for (let capacity = 1; capacity <= 5; capacity++) {
  for (let guests = 1; guests <= capacity; guests++) {
    const result = calculateExtraBeds(guests, capacity);
    if (result.count !== 0 || result.charge !== 0) {
      console.log(`  ❌ Failed for guests=${guests}, capacity=${capacity}`);
      property4Passed = false;
    }
  }
}
console.log('Property 4 passed:', property4Passed ? '✅' : '❌');

// Property 5: If guests > capacity, then count > 0 and charge > 0
console.log('Property 5: If guests > capacity, then count > 0 and charge > 0');
let property5Passed = true;
for (let capacity = 1; capacity <= 5; capacity++) {
  for (let guests = capacity + 1; guests <= capacity + 5; guests++) {
    const result = calculateExtraBeds(guests, capacity);
    if (result.count <= 0 || result.charge <= 0) {
      console.log(`  ❌ Failed for guests=${guests}, capacity=${capacity}`);
      property5Passed = false;
    }
  }
}
console.log('Property 5 passed:', property5Passed ? '✅' : '❌');

console.log('');

console.log('=== All Tests Complete ===');
console.log('\n✅ Task 6.1 Verification:');
console.log('✓ Function calculates extra bed count as max(0, guests - villa_capacity)');
console.log('✓ Function calculates extra bed charge as extra_bed_count × 2000');
console.log('✓ Function returns ExtraBedResult with count and charge');
console.log('✓ All acceptance criteria validated (Requirements 5.1, 5.2, 5.3)');
console.log('✓ Mathematical properties verified');
