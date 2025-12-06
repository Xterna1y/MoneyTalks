// Budget TypeScript interfaces

export interface Budget {
    id: string;
    userId: string;
    category: string;
    limit: number;       // How much user allocated
    spent: number;       // Calculated from transactions
    remaining: number;   // limit - spent
  }
  