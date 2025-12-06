// Dashboard API route
// GET /api/dashboard?userId=xxx
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
 * GET /api/dashboard
 * Returns dashboard data for a user
 * Query params: userId (required)
 * 
 * Response: {
 *   totalThisMonth: number,
 *   byCategory: { name: string, amount: number }[],
 *   recentTransactions: Transaction[]
 * }
 */
router.get("/", async (req, res) => {
  try {
    // Get userId from query params
    const { userId } = req.query;

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: "Missing or invalid userId parameter",
      });
    }

    // Call Convex query
    const dashboardData = await getConvexClient().query(
      api.functions.transactions.getTransactionsForDashboard,
      { userId }
    );

    // Return the dashboard data
    return res.json({
      totalThisMonth: dashboardData.totalThisMonth,
      byCategory: dashboardData.byCategory,
      recentTransactions: dashboardData.recentTransactions,
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({
      error: "Failed to fetch dashboard data",
    });
  }
});

export default router;

