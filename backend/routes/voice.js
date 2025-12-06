// Voice + AI flow:
// 1) Frontend sends text (from Web Speech).
// 2) Create prompt record (Convex).
// 3) Pull context (dashboard, budgets, history, accounts).
// 4) Ask Claude.
// 5) Store response on prompt (Convex).
// 6) Generate speech with ElevenLabs.
// 7) Return text + base64 audio to frontend.

import express from "express";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { generateClaudeResponse } from "../lib/claude.js";
import { generateSpeechBuffer } from "../lib/elevenlabs.js";

const router = express.Router();
const ALLOWED_STATUSES = ["pending", "processing", "completed", "error"];

let convex = null;
function getConvexClient() {
  if (!convex) {
    convex = new ConvexHttpClient(process.env.CONVEX_URL);
  }
  return convex;
}

// Helper to fetch context data in parallel
async function fetchContext(convexClient, userId) {
  const [dashboard, budgets, history, accounts] = await Promise.all([
    convexClient.query(api.functions.transactions.getTransactionsForDashboard, {
      userId,
    }),
    convexClient.query(api.functions.budgets.getBudgets, { userId }),
    convexClient.query(api.functions.transactions.getMonthlyBudgetHistory, {
      userId,
      months: 6,
    }),
    convexClient.query(api.functions.accounts.getAccounts, { userId }),
  ]);

  return { dashboard, budgets, history, accounts };
}

router.post("/", async (req, res) => {
  const convexClient = getConvexClient();

  // Accept multiple field names from the frontend (text | prompt | message)
  const { userId, text, prompt, message, contextData } = req.body || {};
  const promptText =
    [text, prompt, message].find(
      (v) => typeof v === "string" && v.trim().length > 0
    )?.trim() || "";

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Missing or invalid userId" });
  }
  if (!promptText) {
    return res.status(400).json({ error: "Missing prompt text" });
  }

  let promptId = null;

  try {
    // 1) Create prompt record (pending)
    const created = await convexClient.mutation(
      api.functions.prompts.createPrompt,
      { userId, prompt: promptText, contextData }
    );
    promptId = created.promptId;

    // 2) Mark processing
    await convexClient.mutation(api.functions.prompts.updatePromptStatus, {
      promptId,
      status: "processing",
    });

    // 3) Fetch context data
    const context = await fetchContext(convexClient, userId);

    // 4) Ask Claude
    const aiResponse = await generateClaudeResponse(promptText, context);

    // 5) Store response (sets status completed)
    await convexClient.mutation(api.functions.prompts.updatePromptResponse, {
      promptId,
      response: aiResponse,
    });

    // 6) Generate speech
    console.log("Generating speech for response:", aiResponse.substring(0, 50) + "...");
    let audioBuffer;
    try {
      audioBuffer = await generateSpeechBuffer(aiResponse);
      console.log("Speech generated successfully, buffer size:", audioBuffer.length);
    } catch (ttsError) {
      console.error("ElevenLabs TTS error:", ttsError);
      throw new Error(`Text-to-speech failed: ${ttsError.message || "Unknown error"}`);
    }

    // 7) Return text + audio (base64) to frontend
    const audioBase64 = audioBuffer.toString("base64");
    console.log("Returning response with audio base64 length:", audioBase64.length);
    
    return res.json({
      promptId,
      textResponse: aiResponse,
      audioBase64,
      contentType: "audio/mpeg",
      status: "completed",
    });
  } catch (error) {
    console.error("Error in voice flow:", error);

    // Best-effort mark as error
    if (promptId) {
      try {
        await convexClient.mutation(api.functions.prompts.updatePromptStatus, {
          promptId,
          status: "error",
        });
      } catch (e) {
        console.error("Failed to mark prompt error:", e);
      }
    }

    const message = error?.message || "Failed to process voice request";
    return res.status(500).json({ error: message });
  }
});

// Optional: simple health/test endpoint for this flow
router.get("/health", (req, res) => {
  return res.json({ ok: true, status: "voice route alive" });
});

export default router;

