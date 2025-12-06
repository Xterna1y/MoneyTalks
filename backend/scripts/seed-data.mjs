// Seed script to populate database with sample data
// Run with: node scripts/seed-data.mjs

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.CONVEX_URL);

// Sample user ID (use this in frontend testing)
const USER_ID = "demo-user-001";

async function seedData() {
  console.log("🌱 Seeding database with sample data...\n");
  console.log("📍 User ID for testing:", USER_ID);
  console.log("─".repeat(50));

  try {
    // ============ SEED ACCOUNTS ============
    console.log("\n🏦 Adding bank accounts...");
    
    const account1 = await client.mutation(api.functions.accounts.addAccount, {
      userId: USER_ID,
      bankName: "Maybank",
      accountType: "Savings",
      maskedNumber: "**** 1234",
    });
    console.log("   ✅ Maybank Savings added");

    const account2 = await client.mutation(api.functions.accounts.addAccount, {
      userId: USER_ID,
      bankName: "CIMB",
      accountType: "Checking",
      maskedNumber: "**** 5678",
    });
    console.log("   ✅ CIMB Checking added");

    const account3 = await client.mutation(api.functions.accounts.addAccount, {
      userId: USER_ID,
      bankName: "RHB",
      accountType: "Savings",
      maskedNumber: "**** 9012",
    });
    console.log("   ✅ RHB Savings added");

    // ============ SEED BUDGETS ============
    console.log("\n💰 Adding budgets...");

    await client.mutation(api.functions.budgets.createOrUpdateBudget, {
      userId: USER_ID,
      category: "Food",
      limit: 800,
    });
    console.log("   ✅ Food budget: RM 800");

    await client.mutation(api.functions.budgets.createOrUpdateBudget, {
      userId: USER_ID,
      category: "Shopping",
      limit: 500,
    });
    console.log("   ✅ Shopping budget: RM 500");

    await client.mutation(api.functions.budgets.createOrUpdateBudget, {
      userId: USER_ID,
      category: "Transport",
      limit: 300,
    });
    console.log("   ✅ Transport budget: RM 300");

    await client.mutation(api.functions.budgets.createOrUpdateBudget, {
      userId: USER_ID,
      category: "Entertainment",
      limit: 200,
    });
    console.log("   ✅ Entertainment budget: RM 200");

    await client.mutation(api.functions.budgets.createOrUpdateBudget, {
      userId: USER_ID,
      category: "Utilities",
      limit: 400,
    });
    console.log("   ✅ Utilities budget: RM 400");

    // ============ SEED TRANSACTIONS ============
    console.log("\n📝 Adding transactions...");

    // Current month transactions
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Food transactions
    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account1.accountId,
      amount: 25.90,
      merchant: "Grab Food",
      category: "Food",
      createdAt: now - (1 * oneDay),
      riskScore: 5,
      riskLevel: "low",
    });
    console.log("   ✅ Grab Food - RM 25.90");

    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account1.accountId,
      amount: 45.00,
      merchant: "Sushi King",
      category: "Food",
      createdAt: now - (2 * oneDay),
      riskScore: 3,
      riskLevel: "low",
    });
    console.log("   ✅ Sushi King - RM 45.00");

    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account2.accountId,
      amount: 18.50,
      merchant: "Starbucks",
      category: "Food",
      createdAt: now - (3 * oneDay),
      riskScore: 2,
      riskLevel: "low",
    });
    console.log("   ✅ Starbucks - RM 18.50");

    // Shopping transactions
    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account1.accountId,
      amount: 156.00,
      merchant: "Lazada",
      category: "Shopping",
      createdAt: now - (2 * oneDay),
      riskScore: 15,
      riskLevel: "low",
    });
    console.log("   ✅ Lazada - RM 156.00");

    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account2.accountId,
      amount: 89.90,
      merchant: "Shopee",
      category: "Shopping",
      createdAt: now - (5 * oneDay),
      riskScore: 12,
      riskLevel: "low",
    });
    console.log("   ✅ Shopee - RM 89.90");

    // Transport transactions
    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account1.accountId,
      amount: 35.00,
      merchant: "Grab Ride",
      category: "Transport",
      createdAt: now - (1 * oneDay),
      riskScore: 5,
      riskLevel: "low",
    });
    console.log("   ✅ Grab Ride - RM 35.00");

    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account1.accountId,
      amount: 50.00,
      merchant: "Shell Petrol",
      category: "Transport",
      createdAt: now - (4 * oneDay),
      riskScore: 3,
      riskLevel: "low",
    });
    console.log("   ✅ Shell Petrol - RM 50.00");

    // Entertainment
    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account2.accountId,
      amount: 45.00,
      merchant: "Netflix",
      category: "Entertainment",
      createdAt: now - (10 * oneDay),
      riskScore: 2,
      riskLevel: "low",
    });
    console.log("   ✅ Netflix - RM 45.00");

    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account1.accountId,
      amount: 68.00,
      merchant: "GSC Cinema",
      category: "Entertainment",
      createdAt: now - (6 * oneDay),
      riskScore: 5,
      riskLevel: "low",
    });
    console.log("   ✅ GSC Cinema - RM 68.00");

    // Utilities
    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account3.accountId,
      amount: 125.00,
      merchant: "TNB Electric",
      category: "Utilities",
      createdAt: now - (8 * oneDay),
      riskScore: 2,
      riskLevel: "low",
    });
    console.log("   ✅ TNB Electric - RM 125.00");

    await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: account3.accountId,
      amount: 89.00,
      merchant: "Unifi Internet",
      category: "Utilities",
      createdAt: now - (12 * oneDay),
      riskScore: 2,
      riskLevel: "low",
    });
    console.log("   ✅ Unifi Internet - RM 89.00");

    // ============ SUMMARY ============
    console.log("\n" + "═".repeat(50));
    console.log("🎉 SEED DATA COMPLETE!");
    console.log("═".repeat(50));
    console.log("\n📊 Summary:");
    console.log("   • User ID: " + USER_ID);
    console.log("   • Accounts: 3 (Maybank, CIMB, RHB)");
    console.log("   • Budgets: 5 categories");
    console.log("   • Transactions: 11 records");
    console.log("\n🧪 Test the API:");
    console.log("   GET http://localhost:3001/api/dashboard?userId=" + USER_ID);
    console.log("   GET http://localhost:3001/api/budgets?userId=" + USER_ID);
    console.log("   GET http://localhost:3001/api/accounts?userId=" + USER_ID);

  } catch (error) {
    console.error("\n❌ Error seeding data:", error.message);
  }
}

seedData();

