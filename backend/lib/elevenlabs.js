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

  console.log("ElevenLabs config check:", {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + "..." : "none",
    apiKeySuffix: apiKey ? "..." + apiKey.substring(apiKey.length - 10) : "none",
    hasVoiceId: !!voiceId,
    voiceId: voiceId || "none"
  });

  if (!apiKey) throw new Error("Missing ELEVENLABS_API_KEY");
  if (!voiceId) throw new Error("Missing ELEVENLABS_VOICE_ID");

  // Trim any whitespace that might have been introduced
  const trimmedApiKey = apiKey.trim();
  const trimmedVoiceId = voiceId.trim();

  console.log("Making ElevenLabs API request to:", `${ELEVEN_API_URL}/${trimmedVoiceId}`);
  console.log("API Key (first 20 chars):", trimmedApiKey.substring(0, 20) + "...");

  const res = await fetch(`${ELEVEN_API_URL}/${trimmedVoiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": trimmedApiKey,
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
    console.error("ElevenLabs API error:", {
      status: res.status,
      statusText: res.statusText,
      error: errText,
      apiKeyLength: trimmedApiKey.length,
      apiKeyPrefix: trimmedApiKey.substring(0, 10),
      apiKeySuffix: trimmedApiKey.substring(trimmedApiKey.length - 10)
    });
    throw new Error(`ElevenLabs TTS failed: ${res.status} ${errText}`);
  }

  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
}

export default generateSpeechBuffer;

