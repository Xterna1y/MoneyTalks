// Express Server Entry Point
import express from "express";
import cors from "cors";
import { config } from "dotenv";

// Load environment variables from root .env.local
config({ path: "../.env.local" });

// Import routes
import dashboardRoutes from "./routes/dashboard.js";
import budgetsRoutes from "./routes/budgets.js";
import accountsRoutes from "./routes/accounts.js";
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
  console.log(`💚 Health:    http://localhost:${PORT}/health`);
});
