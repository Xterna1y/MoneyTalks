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

  // Prompts table (AI prompt lifecycle)
  prompts: defineTable({
    userId: v.string(), // References users._id (string id used across app)
    prompt: v.string(),
    contextData: v.optional(v.any()), // Optional contextual payload fetched by AI
    response: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    ),
    createdAt: v.number(), // Unix timestamp (ms)
    updatedAt: v.optional(v.number()), // Unix timestamp (ms) - optional for backward compatibility
    completedAt: v.optional(v.number()), // Unix timestamp (ms) - optional for backward compatibility
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),

  // Spending patterns table
  spendingPatterns: defineTable({
    userId: v.string(), // References users._id
    patternType: v.string(), // e.g., "weekly", "monthly", "category", "time_of_day"
    patternData: v.any(), // Flexible structure for different pattern types
    // Example patternData structures:
    // Weekly: { "Monday": 150, "Tuesday": 200, ... }
    // Monthly: { "week1": 500, "week2": 600, ... }
    // Category: { "Food": 800, "Shopping": 500, ... }
    // TimeOfDay: { "morning": 200, "afternoon": 400, "evening": 300 }
    aiAnalysis: v.optional(v.string()), // AI-generated analysis and insights about the spending pattern
    lastAnalyzedAt: v.optional(v.number()), // Unix timestamp (ms) when AI last analyzed this pattern
    createdAt: v.number(), // Unix timestamp (ms)
    updatedAt: v.number(), // Unix timestamp (ms)
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "patternType"]),
});
