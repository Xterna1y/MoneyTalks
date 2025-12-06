// Transaction TypeScript interfaces
export interface Transaction {
    id: string;
    userId: string;
    accountId: string;
    amount: number;
    merchant: string;
    category: string;
    createdAt: number;
  
    // Optional fields — used mainly during precheck
    riskScore?: number;
    riskLevel?: "low" | "medium" | "high";
  }
  
