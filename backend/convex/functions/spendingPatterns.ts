// CRUD for spending patterns
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Create or update a spending pattern
 * If a pattern with the same userId and patternType exists, it will be updated
 */
export const createOrUpdateSpendingPattern = mutation({
  args: {
    userId: v.string(),
    patternType: v.string(),
    patternData: v.any(),
    aiAnalysis: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if pattern already exists
    const existing = await ctx.db
      .query("spendingPatterns")
      .withIndex("by_user_and_type", (q) =>
        q.eq("userId", args.userId).eq("patternType", args.patternType)
      )
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing pattern
      await ctx.db.patch(existing._id, {
        patternData: args.patternData,
        aiAnalysis: args.aiAnalysis,
        updatedAt: now,
        ...(args.aiAnalysis && { lastAnalyzedAt: now }),
      });
      return { patternId: existing._id, isNew: false };
    } else {
      // Create new pattern
      const patternId = await ctx.db.insert("spendingPatterns", {
        userId: args.userId,
        patternType: args.patternType,
        patternData: args.patternData,
        aiAnalysis: args.aiAnalysis,
        createdAt: now,
        updatedAt: now,
        ...(args.aiAnalysis && { lastAnalyzedAt: now }),
      });
      return { patternId, isNew: true };
    }
  },
});

/**
 * Update AI analysis for a spending pattern
 * Called by AI after analyzing spending patterns
 */
export const updateSpendingPatternAnalysis = mutation({
  args: {
    patternId: v.id("spendingPatterns"),
    aiAnalysis: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.patternId, {
      aiAnalysis: args.aiAnalysis,
      lastAnalyzedAt: now,
      updatedAt: now,
    });
    return { success: true, lastAnalyzedAt: now };
  },
});

/**
 * Get spending pattern by userId and patternType
 */
export const getSpendingPattern = query({
  args: {
    userId: v.string(),
    patternType: v.string(),
  },
  handler: async (ctx, args) => {
    const pattern = await ctx.db
      .query("spendingPatterns")
      .withIndex("by_user_and_type", (q) =>
        q.eq("userId", args.userId).eq("patternType", args.patternType)
      )
      .first();

    if (!pattern) {
      return null;
    }

    return {
      id: pattern._id,
      userId: pattern.userId,
      patternType: pattern.patternType,
      patternData: pattern.patternData,
      aiAnalysis: pattern.aiAnalysis,
      lastAnalyzedAt: pattern.lastAnalyzedAt,
      createdAt: pattern.createdAt,
      updatedAt: pattern.updatedAt,
    };
  },
});

/**
 * Get all spending patterns for a user
 */
export const getSpendingPatterns = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const patterns = await ctx.db
      .query("spendingPatterns")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return patterns.map((pattern) => ({
      id: pattern._id,
      userId: pattern.userId,
      patternType: pattern.patternType,
      patternData: pattern.patternData,
      aiAnalysis: pattern.aiAnalysis,
      lastAnalyzedAt: pattern.lastAnalyzedAt,
      createdAt: pattern.createdAt,
      updatedAt: pattern.updatedAt,
    }));
  },
});

/**
 * Delete a spending pattern
 */
export const deleteSpendingPattern = mutation({
  args: {
    patternId: v.id("spendingPatterns"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.patternId);
    return { success: true };
  },
});

