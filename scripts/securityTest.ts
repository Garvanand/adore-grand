import { normalizePlateNumber, maskPhoneNumber } from "../src/lib/utils";
import { sanitizeRegexQuery, checkRateLimit } from "../src/lib/rateLimit";

function runSecurityTests() {
  console.log("--------------------------------------------------");
  console.log("🔒 Running AdorePark Automated Security Test Suite...");
  console.log("--------------------------------------------------");

  // Test 1: Vehicle Plate Normalization
  console.log("\n[Test 1] Vehicle Plate Normalization");
  const testPlates = [
    { input: "HR26 AB 1234", expected: "HR26AB1234" },
    { input: "hr26ab1234", expected: "HR26AB1234" },
    { input: "HR-26-AB-1234", expected: "HR26AB1234" },
  ];

  for (const t of testPlates) {
    const norm = normalizePlateNumber(t.input);
    if (norm === t.expected) {
      console.log(`  ✅ '${t.input}' normalized cleanly -> '${norm}'`);
    } else {
      console.error(`  ❌ Failed normalizing '${t.input}'. Got '${norm}', expected '${t.expected}'`);
      process.exit(1);
    }
  }

  // Test 2: Phone Privacy Masking
  console.log("\n[Test 2] Resident Phone Privacy Masking");
  const rawPhone = "+919876543210";
  const masked = maskPhoneNumber(rawPhone);
  if (masked.includes("***") && !masked.includes("6543")) {
    console.log(`  ✅ Phone '${rawPhone}' properly masked -> '${masked}'`);
  } else {
    console.error(`  ❌ Phone privacy masking failed. Got '${masked}'`);
    process.exit(1);
  }

  // Test 3: Regex Injection Sanitization
  console.log("\n[Test 3] MongoDB Regex Injection Sanitization");
  const dangerousInputs = [".*", "HR26.*", "HR26($|a)", "^HR26"];
  for (const input of dangerousInputs) {
    const clean = sanitizeRegexQuery(input);
    if (!clean.includes(".*") || clean.includes("\\.")) {
      console.log(`  ✅ Injection payload '${input}' sanitized -> '${clean}'`);
    } else {
      console.error(`  ❌ Failed sanitizing '${input}'`);
      process.exit(1);
    }
  }

  // Test 4: Rate Limiter Sliding Window
  console.log("\n[Test 4] Rate Limiter Sliding Window");
  const testUser = "test_security_user_1";
  let countAllowed = 0;
  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit("incident", testUser, 3, 10000);
    if (res.allowed) countAllowed++;
  }

  if (countAllowed === 3) {
    console.log(`  ✅ Rate limiter correctly blocked after 3 requests (allowed: ${countAllowed}/5)`);
  } else {
    console.error(`  ❌ Rate limiter failed. Allowed ${countAllowed} instead of 3`);
    process.exit(1);
  }

  console.log("\n--------------------------------------------------");
  console.log("🎉 All Security Attack Case Tests Passed Successfully!");
  console.log("--------------------------------------------------");
}

runSecurityTests();
