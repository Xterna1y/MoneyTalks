// lib/anthropic.ts
// Uses Anthropic Claude 3.5 Sonnet to analyze user text and return structured JSON.

import Anthropic from '@anthropic-ai/sdk';

export interface FinancialAnalysis {
  response_text: string; // The thing the AI will speak
  sentiment: 'positive' | 'neutral' | 'concerned';
  intent: 'transaction' | 'query' | 'general_chat';
  transaction_data?: {
    amount: number;
    currency: string;
    category: string;
    merchant: string;
  };
}

const SYSTEM_PROMPT = [
  'You are a localized Malaysian Financial Guardian.',
  'You are empathetic but strict with budgets.',
  'You speak in concise, natural English with slight local flair.',
  'Return **valid JSON only** matching the FinancialAnalysis interface.',
  'In `response_text`, include a clear recommendation plus a brief rationale (1-2 sentences).',
  'Ensure `response_text` is friendly and ready to be spoken aloud.',
].join(' ');

// Preferred model; adjust if your account lacks access.
const MODEL = 'claude-3-haiku-20240307';

/**
 * Sends user text to Claude and parses the structured financial analysis.
 */
export async function analyzeFinances(userText: string): Promise<FinancialAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY');
  }

  // Instantiate the client lazily so env vars loaded at runtime are picked up.
  const client = new Anthropic({ apiKey });

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    temperature: 0.2,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: userText,
      },
    ],
  });

  const content = msg.content?.[0];
  if (!content || content.type !== 'text') {
    throw new Error('Anthropic returned no text content');
  }

  const parsed = safeParseJSON(content.text);
  if (!parsed) {
    throw new Error('Anthropic response was not valid JSON');
  }

  return parsed as FinancialAnalysis;
}

// Gracefully parse JSON; return null on failure to keep errors predictable.
function safeParseJSON(payload: string): unknown | null {
  try {
    return JSON.parse(payload);
  } catch (err) {
    console.error('JSON parse error:', err, 'payload:', payload);
    return null;
  }
}

