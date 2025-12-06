// CRUD for user budgets
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get all budgets for a user
 * Used by Budgeting Page to display category limits
 */
export const getBudgets = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all budgets for the user using index
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Calculate start and end of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

    // Get all transactions for the user
    const allTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter to only current month transactions
    const transactionsThisMonth = allTransactions.filter(
      (t) => t.createdAt >= startOfMonth && t.createdAt <= endOfMonth
    );

    // Calculate spent per category for current month
    const categorySpentMap = new Map<string, number>();
    for (const t of transactionsThisMonth) {
      categorySpentMap.set(t.category, (categorySpentMap.get(t.category) || 0) + t.amount);
    }

    // Sort alphabetically by category
    const sortedBudgets = budgets.sort((a, b) =>
      a.category.localeCompare(b.category)
    );

    // Map to Budget type shape with dynamically calculated spent
    return sortedBudgets.map((b) => {
      const spent = categorySpentMap.get(b.category) || 0;
      const remaining = b.limit - spent;
      return {
        id: b._id,
        userId: b.userId,
        category: b.category,
        limit: b.limit,
        spent,
        remaining,
      };
    });
  },
});

/**
 * Create or update a budget for a category
 * If budget exists for (userId + category) -> update
 * If not -> create new budget entry
 */
export const createOrUpdateBudget = mutation({
  args: {
    userId: v.string(),
    category: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if budget already exists for this user + category
    const existing = await ctx.db
      .query("budgets")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", args.userId).eq("category", args.category)
      )
      .first();

    if (existing) {
      // Update existing budget
      // Recalculate remaining based on new limit
      const newRemaining = args.limit - existing.spent;

      await ctx.db.patch(existing._id, {
        limit: args.limit,
        remaining: newRemaining,
      });

      return {
        id: existing._id,
        userId: existing.userId,
        category: existing.category,
        limit: args.limit,
        spent: existing.spent,
        remaining: newRemaining,
      };
    } else {
      // Create new budget
      // New budget starts with 0 spent
      const budgetId = await ctx.db.insert("budgets", {
        userId: args.userId,
        category: args.category,
        limit: args.limit,
        spent: 0,
        remaining: args.limit,
      });

      return {
        id: budgetId,
        userId: args.userId,
        category: args.category,
        limit: args.limit,
        spent: 0,
        remaining: args.limit,
      };
    }
  },
});

/**
 * Delete a budget entry
 * Used when user wants to remove a category budget
 */
export const deleteBudget = mutation({
  args: {
    budgetId: v.id("budgets"),
  },
  handler: async (ctx, args) => {
    // Delete the budget
    await ctx.db.delete(args.budgetId);

    return { success: true };
  },
});
