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

    // Sort alphabetically by category
    const sortedBudgets = budgets.sort((a, b) =>
      a.category.localeCompare(b.category)
    );

    // Map to Budget type shape
    return sortedBudgets.map((b) => ({
      id: b._id,
      userId: b.userId,
      category: b.category,
      limit: b.limit,
      spent: b.spent,
      remaining: b.remaining,
    }));
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
