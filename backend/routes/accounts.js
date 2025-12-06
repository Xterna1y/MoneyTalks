// Accounts API routes
// GET    /api/accounts?userId=xxx       - Get all accounts for user
// POST   /api/accounts                  - Add a new bank account
// DELETE /api/accounts/:accountId       - Delete a bank account
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
 * GET /api/accounts
 * Get all bank accounts for a user
 * Query params: userId (required)
 * 
 * Response: Account[]
 */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: "Missing userId parameter",
      });
    }

    // Call Convex query
    const accounts = await getConvexClient().query(
      api.functions.accounts.getAccounts,
      { userId }
    );

    return res.json(accounts);

  } catch (error) {
    console.error("Error fetching accounts:", error);
    return res.status(500).json({
      error: "Failed to fetch accounts",
    });
  }
});

/**
 * POST /api/accounts
 * Add a new bank account
 * Body: { userId, bankName, accountType, maskedNumber }
 * 
 * Response: { accountId }
 */
router.post("/", async (req, res) => {
  try {
    const { userId, bankName, accountType, maskedNumber } = req.body;

    // Validate required fields
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: "Missing or invalid userId",
      });
    }

    if (!bankName || typeof bankName !== "string") {
      return res.status(400).json({
        error: "Missing or invalid bankName",
      });
    }

    if (!accountType || typeof accountType !== "string") {
      return res.status(400).json({
        error: "Missing or invalid accountType",
      });
    }

    if (!maskedNumber || typeof maskedNumber !== "string") {
      return res.status(400).json({
        error: "Missing or invalid maskedNumber",
      });
    }

    // Call Convex mutation
    const result = await getConvexClient().mutation(
      api.functions.accounts.addAccount,
      { userId, bankName, accountType, maskedNumber }
    );

    return res.status(201).json(result);

  } catch (error) {
    console.error("Error adding account:", error);
    return res.status(500).json({
      error: "Failed to add account",
    });
  }
});

/**
 * DELETE /api/accounts/:accountId
 * Delete a bank account
 * Params: accountId (required)
 * 
 * Response: { success: true }
 */
router.delete("/:accountId", async (req, res) => {
  try {
    const { accountId } = req.params;

    // Validate accountId
    if (!accountId || typeof accountId !== "string") {
      return res.status(400).json({
        error: "Missing or invalid accountId",
      });
    }

    // Call Convex mutation
    await getConvexClient().mutation(
      api.functions.accounts.deleteAccount,
      { accountId }
    );

    return res.json({ success: true });

  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      error: "Failed to delete account",
    });
  }
});

export default router;

