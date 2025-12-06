// lib/groq.ts
// Helper to transcribe audio via Groq's Whisper endpoint.
// Accepts File | Blob so it can run in Next.js server actions or API routes.

const GROQ_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const WHISPER_MODEL = 'distil-whisper-large-v3-en';

/**
 * Transcribes audio using Groq Whisper.
 * Returns an empty string on failure to keep calling code resilient.
 */
export async function transcribeAudio(audioFile: File | Blob): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    console.error('Missing GROQ_API_KEY');
    return '';
  }

  try {
    const formData = new FormData();
    formData.append('file', audioFile, (audioFile as File).name ?? 'audio.webm');
    formData.append('model', WHISPER_MODEL);

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error');
      console.error('Groq transcription failed:', res.status, errText);
      return '';
    }

    const data = (await res.json()) as { text?: string };
    return typeof data.text === 'string' ? data.text : '';
  } catch (err) {
    console.error('Groq transcription error:', err);
    return '';
  }
}

