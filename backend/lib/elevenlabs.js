// ElevenLabs TTS wrapper (JS version)

const ELEVEN_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const ELEVEN_MODEL = "eleven_turbo_v2_5";

/**
 * Converts text to speech and returns a Buffer of audio/mpeg.
 * @param {string} text
 * @returns {Promise<Buffer>}
 */
export async function generateSpeechBuffer(text) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey) throw new Error("Missing ELEVENLABS_API_KEY");
  if (!voiceId) throw new Error("Missing ELEVENLABS_VOICE_ID");

  const res = await fetch(`${ELEVEN_API_URL}/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: ELEVEN_MODEL,
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`ElevenLabs TTS failed: ${res.status} ${errText}`);
  }

  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
}

export default generateSpeechBuffer;

