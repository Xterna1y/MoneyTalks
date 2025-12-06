import { config } from 'dotenv';
config({ path: '.env.local' }); // load API keys

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { analyzeFinances } from '../lib/anthropic';
import { generateSpeech } from '../lib/elevenlabs';

async function ask(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await new Promise<string>((resolve) =>
    rl.question(prompt, (value) => resolve(value))
  );
  rl.close();
  return answer.trim();
}

async function main() {
  const userText = await ask('Type your message: ');
  if (!userText) {
    console.log('No text provided. Exiting.');
    return;
  }

  console.log('Calling Claude (analyzeFinances)...');
  const analysis = await analyzeFinances(userText);
  console.log('Analysis:', analysis);

  // Prefer the model's spoken response. If missing, synthesize from other fields.
  const recommendation =
    (analysis as any).recommendation && typeof (analysis as any).recommendation === 'string'
      ? (analysis as any).recommendation
      : '';
  const analysisPoint =
    Array.isArray((analysis as any).analysis) && (analysis as any).analysis.length > 0
      ? String((analysis as any).analysis[0])
      : '';

  const reply =
    analysis.response_text ||
    [recommendation, analysisPoint].filter(Boolean).join(' ') ||
    'No response generated.';

  console.log('Generating speech with ElevenLabs...');
  const audioBuffer = await generateSpeech(reply);

  const outPath = path.join(process.cwd(), 'voice-output.mp3');
  fs.writeFileSync(outPath, Buffer.from(new Uint8Array(audioBuffer)));

  console.log(`Done. Saved audio to: ${outPath}`);
  console.log('Play it with your preferred player (e.g., VLC/QuickTime).');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});

