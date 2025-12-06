// AFTER payment → log transaction
// TODO: Backend A can implement this

import express from "express";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const router = express.Router();

// Lazy initialization of Convex client
let convex = null;
function getConvexClient() {
  if (!convex) {
    convex = new ConvexHttpClient(process.env.CONVEX_URL);
  }
  return convex;
}

// POST /api/confirm-transaction
// Called when user confirms a payment after seeing precheck advice
router.post("/", async (req, res) => {
  // TODO: Implement transaction confirmation
  // - Validate input
  // - Call createTransaction
  // - Update budget spent amount
  res.status(501).json({ error: "Not implemented yet" });
});

export default router;

