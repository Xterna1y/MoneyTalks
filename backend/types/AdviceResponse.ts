// AdviceResponse TypeScript interfaces

export interface AdviceResponse {
    budgetStatus: "ok" | "near_limit" | "over_budget";
    riskLevel: "low" | "medium" | "high";
    riskScore: number;
    adviceText: string;
    ttsText?: string;
    remainingAfter: number;  // Remaining budget if user proceeds
  }
  