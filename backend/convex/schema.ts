// All DB models
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    name: v.string(),
    primaryAccountId: v.string(), // References accounts._id
  }),

  // Accounts table (bank accounts linked to users)
  accounts: defineTable({
    userId: v.string(),           // References users._id
    bankName: v.string(),         // e.g. "RytBank", "Maybank", "CIMB"
    accountType: v.string(),      // e.g. "Savings", "Checking", "Wallet"
    maskedNumber: v.string(),     // e.g. "**** 1234"
  }).index("by_user", ["userId"]),

  // Transactions table
  transactions: defineTable({
    userId: v.string(),           // References users._id
    accountId: v.string(),        // References accounts._id
    amount: v.number(),
    merchant: v.string(),
    category: v.string(),
    createdAt: v.number(),        // Unix timestamp
    // Optional fields — used mainly during precheck
    riskScore: v.optional(v.number()),
    riskLevel: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"])
    .index("by_created", ["createdAt"]),

  // Budgets table
  budgets: defineTable({
    userId: v.string(),           // References users._id
    category: v.string(),
    limit: v.number(),            // How much user allocated
    spent: v.number(),            // Calculated from transactions
    remaining: v.number(),        // limit - spent
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"]),
});
