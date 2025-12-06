import express from "express";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const router = express.Router();

let convex = null;
function getConvexClient() {
  if (!convex) {
    convex = new ConvexHttpClient(process.env.CONVEX_URL);
  }
  return convex;
}

// Simple test endpoint
router.get("/test", (req, res) => {
  return res.json({ ok: true, message: "prompts route alive" });
});

// Create prompt
router.post("/", async (req, res) => {
  try {
    const { userId, prompt, contextData } = req.body;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId" });
    }
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing or invalid prompt" });
    }

    const result = await getConvexClient().mutation(
      api.functions.prompts.createPrompt,
      {
        userId,
        prompt: prompt.trim(),
        contextData: contextData || undefined,
      }
    );

    return res.status(201).json({
      promptId: result.promptId,
      status: "pending",
      message: "Prompt created. AI will process it shortly.",
    });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return res.status(500).json({ error: "Failed to create prompt" });
  }
});

// Get prompts for a user (optional status filter)
router.get("/", async (req, res) => {
  try {
    const { userId, status } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId" });
    }

    const prompts = await getConvexClient().query(
      api.functions.prompts.getPromptsForUser,
      {
        userId,
        status: status && typeof status === "string" ? status : undefined,
      }
    );

    return res.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return res.status(500).json({ error: "Failed to fetch prompts" });
  }
});

// Get single prompt
router.get("/:promptId", async (req, res) => {
  try {
    const { promptId } = req.params;
    if (!promptId || typeof promptId !== "string") {
      return res.status(400).json({ error: "Missing or invalid promptId" });
    }

    const prompt = await getConvexClient().query(
      api.functions.prompts.getPrompt,
      { promptId }
    );

    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    return res.json(prompt);
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return res.status(500).json({ error: "Failed to fetch prompt" });
  }
});

// Update response
router.put("/:promptId/response", async (req, res) => {
  try {
    const { promptId } = req.params;
    const { response } = req.body;

    if (!promptId || typeof promptId !== "string") {
      return res.status(400).json({ error: "Missing or invalid promptId" });
    }
    if (!response || typeof response !== "string") {
      return res.status(400).json({ error: "Missing or invalid response" });
    }

    await getConvexClient().mutation(
      api.functions.prompts.updatePromptResponse,
      { promptId, response }
    );

    return res.json({ success: true, message: "Response updated" });
  } catch (error) {
    console.error("Error updating prompt response:", error);
    return res.status(500).json({ error: "Failed to update response" });
  }
});

// Update status
router.put("/:promptId/status", async (req, res) => {
  try {
    const { promptId } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "processing", "completed", "error"];
    if (!promptId || typeof promptId !== "string") {
      return res.status(400).json({ error: "Missing or invalid promptId" });
    }
    if (!status || !allowed.includes(status)) {
      return res
        .status(400)
        .json({ error: "Missing or invalid status", allowed });
    }

    await getConvexClient().mutation(
      api.functions.prompts.updatePromptStatus,
      { promptId, status }
    );

    return res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Error updating prompt status:", error);
    return res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;