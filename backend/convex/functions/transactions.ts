// CRUD for payment records
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Create a new transaction record
 * Called after user confirms a payment
 */
export const createTransaction = mutation({
  args: {
    userId: v.string(),
    accountId: v.string(),
    amount: v.number(),
    merchant: v.string(),
    category: v.string(),
    createdAt: v.number(),
    riskScore: v.optional(v.number()),
    riskLevel: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    const transactionId = await ctx.db.insert("transactions", {
      userId: args.userId,
      accountId: args.accountId,
      amount: args.amount,
      merchant: args.merchant,
      category: args.category,
      createdAt: args.createdAt,
      riskScore: args.riskScore,
      riskLevel: args.riskLevel,
    });

    return { transactionId };
  },
});

/**
 * Get transactions data for the dashboard
 * Returns: total this month, spending by category, recent transactions
 */
export const getTransactionsForDashboard = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all transactions for the user using the index
    const allTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Calculate the start of the current month (Unix timestamp in ms)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    // Filter transactions for current month
    const thisMonthTransactions = allTransactions.filter(
      (t) => t.createdAt >= startOfMonth
    );

    // Calculate total spent this month
    const totalThisMonth = thisMonthTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // Calculate spending by category for current month
    const categoryMap = new Map<string, number>();
    for (const t of thisMonthTransactions) {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    }

    const byCategory = Array.from(categoryMap.entries()).map(([name, amount]) => ({
      name,
      amount,
    }));

    // Get last 10 transactions (sorted by createdAt descending)
    const sortedTransactions = [...allTransactions].sort(
      (a, b) => b.createdAt - a.createdAt
    );
    const recentTransactions = sortedTransactions.slice(0, 10).map((t) => ({
      id: t._id,
      userId: t.userId,
      accountId: t.accountId,
      amount: t.amount,
      merchant: t.merchant,
      category: t.category,
      createdAt: t.createdAt,
      riskScore: t.riskScore,
      riskLevel: t.riskLevel,
    }));

    return {
      totalThisMonth,
      byCategory,
      recentTransactions,
    };
  },
});

/**
 * Get monthly budget history
 * Returns: array of monthly spending summaries for the last N months
 */
export const getMonthlyBudgetHistory = query({
  args: {
    userId: v.string(),
    months: v.optional(v.number()), // Number of months to retrieve (default: 6)
  },
  handler: async (ctx, args) => {
    const monthsToShow = args.months || 6;
    
    // Get all transactions for the user
    const allTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Get all budgets to calculate total limit
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);

    // Calculate monthly totals
    const now = new Date();
    const monthlyData: Array<{ month: string; monthKey: string; spent: number; limit: number }> = [];

    for (let i = 0; i < monthsToShow; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = date.getTime();
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

      // Filter transactions for this month
      const monthTransactions = allTransactions.filter(
        (t) => t.createdAt >= startOfMonth && t.createdAt <= endOfMonth
      );

      const spent = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        spent,
        limit: totalLimit,
      });
    }

    // Reverse to show oldest first
    return monthlyData.reverse();
  },
});
