// API routes for spending patterns
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

/**
 * POST /api/spending-patterns
 * Create or update a spending pattern
 * Body: { userId, patternType, patternData }
 */
router.post("/", async (req, res) => {
  try {
    const { userId, patternType, patternData, aiAnalysis } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId" });
    }

    if (!patternType || typeof patternType !== "string") {
      return res.status(400).json({ error: "Missing or invalid patternType" });
    }

    if (!patternData) {
      return res.status(400).json({ error: "Missing patternData" });
    }

    const result = await getConvexClient().mutation(
      api.functions.spendingPatterns.createOrUpdateSpendingPattern,
      {
        userId,
        patternType,
        patternData,
        aiAnalysis: aiAnalysis || undefined,
      }
    );

    return res.status(result.isNew ? 201 : 200).json({
      patternId: result.patternId,
      isNew: result.isNew,
      message: result.isNew
        ? "Spending pattern created successfully"
        : "Spending pattern updated successfully",
    });
  } catch (error) {
    console.error("Error creating/updating spending pattern:", error);
    return res.status(500).json({
      error: "Failed to create/update spending pattern",
      message: error.message,
    });
  }
});

/**
 * PUT /api/spending-patterns/:patternId/analysis
 * Update AI analysis for a spending pattern
 * Body: { aiAnalysis: "..." }
 */
router.put("/:patternId/analysis", async (req, res) => {
  try {
    const { patternId } = req.params;
    const { aiAnalysis } = req.body;

    if (!patternId) {
      return res.status(400).json({ error: "Missing patternId parameter" });
    }

    if (!aiAnalysis || typeof aiAnalysis !== "string") {
      return res.status(400).json({ error: "Missing or invalid aiAnalysis" });
    }

    const result = await getConvexClient().mutation(
      api.functions.spendingPatterns.updateSpendingPatternAnalysis,
      {
        patternId,
        aiAnalysis,
      }
    );

    return res.json({
      success: true,
      lastAnalyzedAt: result.lastAnalyzedAt,
      message: "AI analysis updated successfully",
    });
  } catch (error) {
    console.error("Error updating AI analysis:", error);
    return res.status(500).json({
      error: "Failed to update AI analysis",
      message: error.message,
    });
  }
});

/**
 * GET /api/spending-patterns?userId=xxx&patternType=xxx
 * Get a specific spending pattern by userId and patternType
 * If patternType is not provided, returns all patterns for the user
 */
router.get("/", async (req, res) => {
  try {
    const { userId, patternType } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId parameter" });
    }

    if (patternType && typeof patternType === "string") {
      // Get specific pattern
      const pattern = await getConvexClient().query(
        api.functions.spendingPatterns.getSpendingPattern,
        {
          userId,
          patternType,
        }
      );

      if (!pattern) {
        return res.status(404).json({ error: "Spending pattern not found" });
      }

      return res.json(pattern);
    } else {
      // Get all patterns for user
      const patterns = await getConvexClient().query(
        api.functions.spendingPatterns.getSpendingPatterns,
        {
          userId,
        }
      );

      return res.json(patterns);
    }
  } catch (error) {
    console.error("Error retrieving spending patterns:", error);
    return res.status(500).json({
      error: "Failed to retrieve spending patterns",
      message: error.message,
    });
  }
});

/**
 * DELETE /api/spending-patterns/:patternId
 * Delete a spending pattern
 */
router.delete("/:patternId", async (req, res) => {
  try {
    const { patternId } = req.params;

    if (!patternId) {
      return res.status(400).json({ error: "Missing patternId parameter" });
    }

    await getConvexClient().mutation(
      api.functions.spendingPatterns.deleteSpendingPattern,
      {
        patternId,
      }
    );

    return res.json({ success: true, message: "Spending pattern deleted successfully" });
  } catch (error) {
    console.error("Error deleting spending pattern:", error);
    return res.status(500).json({
      error: "Failed to delete spending pattern",
      message: error.message,
    });
  }
});

export default router;

