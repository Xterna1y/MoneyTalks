const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const DEFAULT_USER_ID = 'demo-user-001';

export { API_BASE_URL, DEFAULT_USER_ID };

export async function fetchDashboard(userId: string = DEFAULT_USER_ID) {
  const response = await fetch(`${API_BASE_URL}/api/dashboard?userId=${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchBudgets(userId: string = DEFAULT_USER_ID) {
  const response = await fetch(`${API_BASE_URL}/api/budgets?userId=${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch budgets: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchAccounts(userId: string = DEFAULT_USER_ID) {
  const response = await fetch(`${API_BASE_URL}/api/accounts?userId=${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch accounts: ${response.statusText}`);
  }
  return response.json();
}

export async function createOrUpdateBudget(
  userId: string,
  category: string,
  limit: number
) {
  const response = await fetch(`${API_BASE_URL}/api/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, category, limit }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update budget: ${response.statusText}`);
  }
  return response.json();
}

export async function addAccount(
  userId: string,
  bankName: string,
  accountType: string,
  maskedNumber: string
) {
  const response = await fetch(`${API_BASE_URL}/api/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, bankName, accountType, maskedNumber }),
  });
  if (!response.ok) {
    throw new Error(`Failed to add account: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteAccount(accountId: string) {
  const response = await fetch(`${API_BASE_URL}/api/accounts/${accountId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete account: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchBudgetHistory(userId: string = DEFAULT_USER_ID, months: number = 6) {
  const response = await fetch(`${API_BASE_URL}/api/budgets/history?userId=${userId}&months=${months}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch budget history: ${response.statusText}`);
  }
  return response.json();
}

export async function processVoicePrompt(
  text: string,
  userId: string = DEFAULT_USER_ID
): Promise<{ promptId: string; textResponse: string; audioBase64: string; contentType: string }> {
  const response = await fetch(`${API_BASE_URL}/api/voice-flow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, text }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to process voice prompt: ${errorText}`);
  }

  return response.json();
}

