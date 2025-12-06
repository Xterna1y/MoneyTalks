// Simple test to verify spending patterns API after server restart
// Run this AFTER restarting the server: npm start (in backend directory)

import { config } from "dotenv";
config({ path: "../.env.local" });

const API_BASE = "http://localhost:3001";
const USER_ID = "demo-user-001";

async function testEndpoint(method, url, body = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

async function main() {
  console.log("🧪 Testing Spending Patterns API\n");

  // Test 1: POST create pattern
  console.log("1️⃣  POST /api/spending-patterns");
  const createResult = await testEndpoint("POST", `${API_BASE}/api/spending-patterns`, {
    userId: USER_ID,
    patternType: "test_weekly",
    patternData: { Monday: 100, Tuesday: 200 },
  });
  console.log(`   Status: ${createResult.status}`);
  if (createResult.status === 201 || createResult.status === 200) {
    console.log(`   ✅ Pattern created/updated: ${createResult.data.patternId}`);
    const patternId = createResult.data.patternId;

    // Test 2: GET all patterns
    console.log("\n2️⃣  GET /api/spending-patterns?userId=...");
    const getAllResult = await testEndpoint("GET", `${API_BASE}/api/spending-patterns?userId=${USER_ID}`);
    console.log(`   Status: ${getAllResult.status}`);
    if (getAllResult.status === 200) {
      console.log(`   ✅ Found ${Array.isArray(getAllResult.data) ? getAllResult.data.length : 1} pattern(s)`);
    }

    // Test 3: GET specific pattern
    console.log("\n3️⃣  GET /api/spending-patterns?userId=...&patternType=test_weekly");
    const getOneResult = await testEndpoint("GET", `${API_BASE}/api/spending-patterns?userId=${USER_ID}&patternType=test_weekly`);
    console.log(`   Status: ${getOneResult.status}`);
    if (getOneResult.status === 200) {
      console.log(`   ✅ Pattern retrieved`);
    }

    // Test 4: PUT update AI analysis
    console.log("\n4️⃣  PUT /api/spending-patterns/:patternId/analysis");
    const updateAnalysisResult = await testEndpoint("PUT", `${API_BASE}/api/spending-patterns/${patternId}/analysis`, {
      aiAnalysis: "Test AI analysis: This is a test pattern with higher spending on Tuesday.",
    });
    console.log(`   Status: ${updateAnalysisResult.status}`);
    if (updateAnalysisResult.status === 200) {
      console.log(`   ✅ AI analysis updated`);
    }

    // Test 5: DELETE pattern
    console.log("\n5️⃣  DELETE /api/spending-patterns/:patternId");
    const deleteResult = await testEndpoint("DELETE", `${API_BASE}/api/spending-patterns/${patternId}`);
    console.log(`   Status: ${deleteResult.status}`);
    if (deleteResult.status === 200) {
      console.log(`   ✅ Pattern deleted`);
    }

    console.log("\n✅ All tests completed!");
  } else {
    console.log(`   ❌ Failed: ${JSON.stringify(createResult.data || createResult.error)}`);
    console.log("\n⚠️  Make sure the server is running: npm start (in backend directory)");
  }
}

main();

