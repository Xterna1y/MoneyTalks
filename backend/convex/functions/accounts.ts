// bank accounts (simulated integration)
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get all accounts for a user
 * Used by Settings page to display linked bank accounts
 */
export const getAccounts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all accounts for the user using index
    const accounts = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Map to Account type shape
    return accounts.map((a) => ({
      id: a._id,
      userId: a.userId,
      bankName: a.bankName,
      accountType: a.accountType,
      maskedNumber: a.maskedNumber,
    }));
  },
});

/**
 * Add a new bank account
 * Used when user links a new bank account
 */
export const addAccount = mutation({
  args: {
    userId: v.string(),
    bankName: v.string(),
    accountType: v.string(),
    maskedNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const accountId = await ctx.db.insert("accounts", {
      userId: args.userId,
      bankName: args.bankName,
      accountType: args.accountType,
      maskedNumber: args.maskedNumber,
    });

    return { accountId };
  },
});

/**
 * Delete a bank account
 * Used when user unlinks a bank account
 */
export const deleteAccount = mutation({
  args: {
    accountId: v.id("accounts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.accountId);

    return { success: true };
  },
});
