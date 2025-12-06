// Budgets API routes
// GET    /api/budgets?userId=xxx     - Get all budgets for user
// POST   /api/budgets                - Create or update a budget
// DELETE /api/budgets/:budgetId      - Delete a budget
import express from "express";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const router = express.Router();

// Lazy initialization of Convex client (after env vars are loaded)
let convex = null;
function getConvexClient() {
  if (!convex) {
    convex = new ConvexHttpClient(process.env.CONVEX_URL);
  }
  return convex;
}

/**
 * GET /api/budgets/history
 * Get monthly budget history for a user
 * Query params: userId (required), months (optional, default: 6)
 */
router.get("/history", async (req, res) => {
  try {
    const { userId, months } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId parameter" });
    }
    
    const monthsParam = months ? parseInt(months, 10) : undefined;
    const history = await getConvexClient().query(
      api.functions.transactions.getMonthlyBudgetHistory,
      { userId, months: monthsParam }
    );
    return res.json(history);
  } catch (error) {
    console.error("Error fetching budget history:", error);
    return res.status(500).json({ error: "Failed to fetch budget history" });
  }
});

/**
 * GET /api/budgets
 * Get all budgets for a user
 * Query params: userId (required)
 * 
 * Response: Budget[]
 */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: "Missing or invalid userId parameter",
      });
    }

    // Call Convex query
    const budgets = await getConvexClient().query(
      api.functions.budgets.getBudgets,
      { userId }
    );

    return res.json(budgets);

  } catch (error) {
    console.error("Error fetching budgets:", error);
    return res.status(500).json({
      error: "Failed to fetch budgets",
    });
  }
});

/**
 * POST /api/budgets
 * Create or update a budget
 * Body: { userId, category, limit }
 * 
 * Response: Budget (created or updated)
 */
router.post("/", async (req, res) => {
  try {
    const { userId, category, limit } = req.body;

    // Validate required fields
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: "Missing or invalid userId",
      });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({
        error: "Missing or invalid category",
      });
    }

    if (typeof limit !== "number" || limit < 0) {
      return res.status(400).json({
        error: "Missing or invalid limit (must be a non-negative number)",
      });
    }

    // Call Convex mutation
    const budget = await getConvexClient().mutation(
      api.functions.budgets.createOrUpdateBudget,
      { userId, category, limit }
    );

    return res.status(201).json(budget);

  } catch (error) {
    console.error("Error creating/updating budget:", error);
    return res.status(500).json({
      error: "Failed to create or update budget",
    });
  }
});

/**
 * DELETE /api/budgets/:budgetId
 * Delete a budget
 * Params: budgetId (required)
 * 
 * Response: { success: true }
 */
router.delete("/:budgetId", async (req, res) => {
  try {
    const { budgetId } = req.params;

    // Validate budgetId
    if (!budgetId || typeof budgetId !== "string") {
      return res.status(400).json({
        error: "Missing or invalid budgetId",
      });
    }

    // Call Convex mutation
    await getConvexClient().mutation(
      api.functions.budgets.deleteBudget,
      { budgetId }
    );

    return res.json({ success: true });

  } catch (error) {
    console.error("Error deleting budget:", error);
    return res.status(500).json({
      error: "Failed to delete budget",
    });
  }
});

export default router;

