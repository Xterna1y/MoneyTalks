// Express Server Entry Point
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env.local
// Try multiple paths to ensure we find it
import { existsSync } from "fs";

const possiblePaths = [
  path.resolve(__dirname, "..", ".env.local"), // From backend/ directory
  path.resolve(process.cwd(), ".env.local"), // From current working directory
  path.resolve(process.cwd(), "..", ".env.local"), // From project root if running from subdirectory
];

let envPath = null;
for (const possiblePath of possiblePaths) {
  if (existsSync(possiblePath)) {
    envPath = possiblePath;
    console.log("Found .env.local at:", envPath);
    break;
  }
}

if (!envPath) {
  // Fallback to the most likely path
  envPath = path.resolve(__dirname, "..", ".env.local");
  console.log("Using default path:", envPath);
}

console.log("Loading environment variables from:", envPath);
const result = config({ path: envPath });

if (result.error) {
  console.warn("⚠ Warning: Error loading .env.local:", result.error.message);
} else {
  console.log("✓ Environment variables loaded successfully");
}

// Log environment variable status (without exposing values)
console.log("Environment check:");
console.log("  CONVEX_URL:", process.env.CONVEX_URL ? "✓ Set" : "✗ Missing");
const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
const elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID;
console.log("  ELEVENLABS_API_KEY:", elevenLabsKey ? `✓ Set (length: ${elevenLabsKey.length}, starts with: ${elevenLabsKey.substring(0, 10)}...)` : "✗ Missing");
console.log("  ELEVENLABS_VOICE_ID:", elevenLabsVoiceId ? `✓ Set (${elevenLabsVoiceId})` : "✗ Missing");
console.log("  ANTHROPIC_API_KEY:", process.env.ANTHROPIC_API_KEY ? "✓ Set" : "✗ Missing");

// Verify the API key matches what we expect
if (elevenLabsKey && elevenLabsKey.length !== 64) {
  console.warn("⚠ Warning: ELEVENLABS_API_KEY length is", elevenLabsKey.length, "expected 64. Check for whitespace or formatting issues.");
}

// Import routes
import dashboardRoutes from "./routes/dashboard.js";
import budgetsRoutes from "./routes/budgets.js";
import accountsRoutes from "./routes/accounts.js";
import promptsRoutes from "./routes/prompts.js";
import voiceRoutes from "./routes/voice.js";
import spendingPatternsRoutes from "./routes/spending-patterns.js";
// Backend B routes (placeholders)
// import precheckRoutes from "./routes/precheck.js";
// import confirmTransactionRoutes from "./routes/confirm-transaction.js";
// import settingsRoutes from "./routes/settings.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes - Backend A (Working)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budgets", budgetsRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/prompts", promptsRoutes);
app.use("/api/voice-flow", voiceRoutes);
app.use("/api/spending-patterns", spendingPatternsRoutes);

// API Routes - Backend B (TODO)
// app.use("/api/precheck", precheckRoutes);
// app.use("/api/confirm-transaction", confirmTransactionRoutes);
// app.use("/api/settings", settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard?userId=demo-user-001`);
  console.log(`💰 Budgets:   http://localhost:${PORT}/api/budgets?userId=demo-user-001`);
  console.log(`🏦 Accounts:  http://localhost:${PORT}/api/accounts?userId=demo-user-001`);
  console.log(`📈 Patterns:  http://localhost:${PORT}/api/spending-patterns?userId=demo-user-001`);
  console.log(`💚 Health:    http://localhost:${PORT}/health`);
});
