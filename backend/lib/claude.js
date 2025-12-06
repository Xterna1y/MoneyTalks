// Claude wrapper: consumes user prompt + financial context and returns a reply.
// Uses Anthropic Messages API.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
// Use a widely available model; adjust if your account allows newer releases.
const ANTHROPIC_MODEL = "claude-3-haiku-20240307";

/**
 * @typedef {Object} FinancialContext
 * @property {any} [dashboard]
 * @property {any} [budgets]
 * @property {any} [history]
 * @property {any} [accounts]
 */

/**
 * Call Claude with the user prompt and injected financial context.
 * @param {string} userPrompt
 * @param {FinancialContext} context
 * @returns {Promise<string>}
 */
export async function generateClaudeResponse(userPrompt, context) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const systemPrompt = `
You are MoneyTalks, a concise personal finance assistant via voice response.
Be brief (2-4 sentences). Only mention budgets/history/transactions if directly needed.
If you do not understand the user's prompt, just say "I'm sorry, I don't understand your request.", you dont need to mention about the budgets/history/transactions.
Avoid long lists. If data is missing, state that briefly.
Output response such as RM12.45 as 12 ringgit 45 cents.
`;

  const contextBlock = JSON.stringify(context || {}, null, 2);

  const body = {
    model: ANTHROPIC_MODEL,
    max_tokens: 150,
    temperature: 0.4,
    system: systemPrompt.trim(),
    messages: [
      {
        role: "user",
        content: `User prompt: ${userPrompt}\n\nFinancial context:\n${contextBlock}`,
      },
    ],
  };

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`Claude API failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const content = data?.content?.[0]?.text || data?.content || "";
  if (!content || typeof content !== "string") {
    throw new Error("Claude response empty");
  }

  return content.trim();
}

export default generateClaudeResponse;

