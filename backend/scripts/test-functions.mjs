// Test script for Convex functions
// Run with: node scripts/test-functions.mjs

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

// Load environment variables from root .env.local
import { config } from "dotenv";
config({ path: "../.env.local" });

const client = new ConvexHttpClient(process.env.CONVEX_URL);

async function runTests() {
  console.log("🧪 Testing Convex Functions...\n");
  console.log("CONVEX_URL:", process.env.CONVEX_URL);
  console.log("─".repeat(50));

  try {
    // ============ TEST ACCOUNTS ============
    console.log("\n📦 ACCOUNTS TESTS");
    console.log("─".repeat(30));

    // Test 1: Add Account
    console.log("\n1️⃣ addAccount...");
    const accountResult = await client.mutation(api.functions.accounts.addAccount, {
      userId: "test-user-1",
      bankName: "Maybank",
      accountType: "Savings",
      maskedNumber: "**** 1234",
    });
    console.log("✅ Account created:", accountResult);
    const testAccountId = accountResult.accountId;

    // Test 2: Get Accounts
    console.log("\n2️⃣ getAccounts...");
    const accounts = await client.query(api.functions.accounts.getAccounts, {
      userId: "test-user-1",
    });
    console.log("✅ Accounts retrieved:", accounts);

    // ============ TEST BUDGETS ============
    console.log("\n📦 BUDGETS TESTS");
    console.log("─".repeat(30));

    // Test 3: Create Budget
    console.log("\n3️⃣ createOrUpdateBudget (create)...");
    const budgetResult = await client.mutation(api.functions.budgets.createOrUpdateBudget, {
      userId: "test-user-1",
      category: "Food",
      limit: 500,
    });
    console.log("✅ Budget created:", budgetResult);

    // Test 4: Update Budget
    console.log("\n4️⃣ createOrUpdateBudget (update)...");
    const budgetUpdate = await client.mutation(api.functions.budgets.createOrUpdateBudget, {
      userId: "test-user-1",
      category: "Food",
      limit: 600,
    });
    console.log("✅ Budget updated:", budgetUpdate);

    // Test 5: Get Budgets
    console.log("\n5️⃣ getBudgets...");
    const budgets = await client.query(api.functions.budgets.getBudgets, {
      userId: "test-user-1",
    });
    console.log("✅ Budgets retrieved:", budgets);

    // ============ TEST TRANSACTIONS ============
    console.log("\n📦 TRANSACTIONS TESTS");
    console.log("─".repeat(30));

    // Test 6: Create Transaction
    console.log("\n6️⃣ createTransaction...");
    const txResult = await client.mutation(api.functions.transactions.createTransaction, {
      userId: "test-user-1",
      accountId: testAccountId,
      amount: 45.50,
      merchant: "Grab Food",
      category: "Food",
      createdAt: Date.now(),
    });
    console.log("✅ Transaction created:", txResult);

    // Test 7: Create another transaction
    console.log("\n7️⃣ createTransaction (second)...");
    const txResult2 = await client.mutation(api.functions.transactions.createTransaction, {
      userId: "test-user-1",
      accountId: testAccountId,
      amount: 120.00,
      merchant: "Lazada",
      category: "Shopping",
      createdAt: Date.now(),
      riskScore: 25,
      riskLevel: "low",
    });
    console.log("✅ Transaction created:", txResult2);

    // Test 8: Get Dashboard Data
    console.log("\n8️⃣ getTransactionsForDashboard...");
    const dashboard = await client.query(api.functions.transactions.getTransactionsForDashboard, {
      userId: "test-user-1",
    });
    console.log("✅ Dashboard data:");
    console.log("   Total this month: RM", dashboard.totalThisMonth);
    console.log("   By category:", dashboard.byCategory);
    console.log("   Recent transactions:", dashboard.recentTransactions.length, "items");

    // ============ SUMMARY ============
    console.log("\n" + "═".repeat(50));
    console.log("🎉 ALL TESTS PASSED!");
    console.log("═".repeat(50));

  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error(error);
  }
}

runTests();

