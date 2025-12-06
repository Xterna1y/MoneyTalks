import { config } from 'dotenv';
// Load environment variables from the local env file before other imports use them.
config({ path: '.env.local' });

import { analyzeFinances } from '../lib/anthropic';
import { generateSpeech } from '../lib/elevenlabs';

async function main() {
  console.log('Starting AI sanity test...');

  const userText =
    'I spent RM50 at Lotus on groceries yesterday. How is my budget looking?';

  console.log('\nAnalyzing finances with Claude...');
  const analysis = await analyzeFinances(userText);
  console.log('Analysis result:', analysis);

  console.log('\nGenerating speech with ElevenLabs...');
  const audioBuffer = await generateSpeech(
    analysis.response_text || 'Hello from MoneyTalks!'
  );
  console.log('Audio bytes length:', audioBuffer.byteLength);

  console.log('\nDone. If you see a byte length above, TTS worked.');
  console.log('Note: Groq STT requires an actual audio file; test separately.');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

