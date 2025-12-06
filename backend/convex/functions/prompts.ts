import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

const statusValue = v.union(
  v.literal("pending"),
  v.literal("processing"),
  v.literal("completed"),
  v.literal("error")
);

/**
 * Create a new prompt entry
 */
export const createPrompt = mutation({
  args: {
    userId: v.string(),
    prompt: v.string(),
    contextData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const promptId = await ctx.db.insert("prompts", {
      userId: args.userId,
      prompt: args.prompt,
      contextData: args.contextData,
      response: undefined,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return { promptId, status: "pending" as const };
  },
});

/**
 * List prompts for a user, optionally filtered by status
 */
export const listPrompts = query({
  args: {
    userId: v.string(),
    status: v.optional(statusValue),
  },
  handler: async (ctx, args) => {
    let prompts;

    if (args.status) {
      prompts = await ctx.db
        .query("prompts")
        .withIndex("by_user_status", (q) =>
          q.eq("userId", args.userId).eq("status", args.status!)
        )
        .collect();
    } else {
      prompts = await ctx.db
        .query("prompts")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();
    }

    // Sort newest first
    const sorted = prompts.sort((a, b) => b.createdAt - a.createdAt);

    return sorted.map((p) => ({
      id: p._id,
      userId: p.userId,
      prompt: p.prompt,
      contextData: p.contextData,
      response: p.response,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  },
});

/**
 * Get a single prompt by id
 */
export const getPrompt = query({
  args: { promptId: v.id("prompts") },
  handler: async (ctx, args) => {
    const prompt = await ctx.db.get(args.promptId);

    if (!prompt) {
      return null;
    }

    return {
      id: prompt._id,
      userId: prompt.userId,
      prompt: prompt.prompt,
      contextData: prompt.contextData,
      response: prompt.response,
      status: prompt.status,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    };
  },
});

/**
 * Update the AI response (marks prompt as completed)
 */
export const updatePromptResponse = mutation({
  args: {
    promptId: v.id("prompts"),
    response: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.promptId);
    if (!existing) {
      throw new Error("Prompt not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.promptId, {
      response: args.response,
      status: "completed",
      updatedAt: now,
    });

    return { success: true, status: "completed" as const, updatedAt: now };
  },
});

/**
 * Update prompt status (pending|processing|completed|error)
 */
export const updatePromptStatus = mutation({
  args: {
    promptId: v.id("prompts"),
    status: statusValue,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.promptId);
    if (!existing) {
      throw new Error("Prompt not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.promptId, {
      status: args.status,
      updatedAt: now,
    });

    return { success: true, status: args.status, updatedAt: now };
  },
});

