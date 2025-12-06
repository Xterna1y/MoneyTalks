import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const createPrompt = mutation({
  args: {
    userId: v.string(),
    prompt: v.string(),
    contextData: v.optional(v.object({
      totalSpent: v.optional(v.number()),
      budgets: v.optional(v.array(v.object({
        category: v.string(),
        limit: v.number(),
        spent: v.number(),
      }))),
      recentTransactions: v.optional(v.array(v.object({
        amount: v.number(),
        merchant: v.string(),
        category: v.string(),
      }))),
    })),
  },
  handler: async (ctx, args) => {
    const promptId = await ctx.db.insert("prompts", {
      userId: args.userId,
      prompt: args.prompt,
      status: "pending",
      createdAt: Date.now(),
      contextData: args.contextData,
    });
    return { promptId };
  },
});

export const updatePromptResponse = mutation({
  args: {
    promptId: v.id("prompts"),
    response: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.promptId, {
      response: args.response,
      status: "completed",
      completedAt: Date.now(),
    });
    return { success: true };
  },
});

export const updatePromptStatus = mutation({
  args: {
    promptId: v.id("prompts"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.promptId, {
      status: args.status,
      completedAt: args.status === "completed" ? Date.now() : undefined,
    });
    return { success: true };
  },
});

export const getPrompt = query({
  args: {
    promptId: v.id("prompts"),
  },
  handler: async (ctx, args) => {
    return ctx.db.get(args.promptId);
  },
});

export const getPromptsForUser = query({
  args: {
    userId: v.string(),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    )),
  },
  handler: async (ctx, args) => {
    let queryBuilder = ctx.db
      .query("prompts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.status) {
      queryBuilder = ctx.db
        .query("prompts")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", args.userId).eq("status", args.status)
        );
    }

    return queryBuilder.collect();
  },
});

export const getPendingPrompts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("prompts")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", "pending")
      )
      .collect();
  },
});

