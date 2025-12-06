// Quick script to add a transaction for today
// Run with: node scripts/add-today-transaction.mjs

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { config } from "dotenv";

// Load environment variables
config({ path: "../.env.local" });

const client = new ConvexHttpClient(process.env.CONVEX_URL);

// Sample user ID
const USER_ID = "demo-user-001";

async function addTodayTransaction() {
  console.log("📝 Adding transaction for today...\n");

  try {
    // First, get an account ID (we'll use the first account)
    const accounts = await client.query(api.functions.accounts.getAccounts, {
      userId: USER_ID,
    });

    if (!accounts || accounts.length === 0) {
      console.error("❌ No accounts found. Please run seed-data.mjs first to create accounts.");
      return;
    }

    const accountId = accounts[0].id; // getAccounts returns { id, ... } not { _id, ... }
    const now = Date.now();

    // Add today's transaction
    const result = await client.mutation(api.functions.transactions.createTransaction, {
      userId: USER_ID,
      accountId: accountId,
      amount: 32.50,
      merchant: "7-Eleven",
      category: "Food",
      createdAt: now, // Today's timestamp
      riskScore: 3,
      riskLevel: "low",
    });

    console.log("✅ Transaction added successfully!");
    console.log("   • Merchant: 7-Eleven");
    console.log("   • Amount: RM 32.50");
    console.log("   • Category: Food");
    console.log("   • Date: Today");
    console.log("   • Transaction ID:", result.transactionId);
    console.log("\n🎉 Done! Check your dashboard to see the new transaction.");

  } catch (error) {
    console.error("\n❌ Error adding transaction:", error.message);
    console.error(error);
  }
}

addTodayTransaction();

