export interface Account {
    id: string;
    userId: string;
    bankName: string;        // e.g. "RytBank", "Maybank", "CIMB"
    accountType: string;     // e.g. "Savings", "Checking", "Wallet"
    maskedNumber: string;    // e.g. "**** 1234"
  }
  