import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Convert audio blob to text using Whisper
 */
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // Convert Blob to File-like object for OpenAI
    const audioFile = new File([audioBlob], "audio.webm", {
      type: audioBlob.type || "audio/webm",
    })

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en", // Optional: specify language for better accuracy
      response_format: "text",
    })

    return transcription as unknown as string
  } catch (error) {
    console.error("Error in transcription:", error)
    throw new Error("Failed to transcribe audio")
  }
}

/**
 * Process transcription with AI (GPT)
 */
async function processWithAI(transcription: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for faster, cheaper responses
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Respond concisely and naturally, as if speaking.",
        },
        {
          role: "user",
          content: transcription,
        },
      ],
      max_tokens: 200, // Limit response length for voice
      temperature: 0.7,
    })

    const responseText = completion.choices[0]?.message?.content?.trim()

    if (!responseText) {
      throw new Error("No response from AI")
    }

    return responseText
  } catch (error) {
    console.error("Error in AI processing:", error)
    throw new Error("Failed to process with AI")
  }
}

/**
 * Convert text to speech using OpenAI TTS
 */
async function textToSpeech(text: string): Promise<Buffer> {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Use "tts-1-hd" for higher quality (slower)
      voice: "alloy", // Options: alloy, echo, fable, onyx, nova, shimmer
      input: text,
      response_format: "mp3",
      speed: 1.0, // 0.25 to 4.0
    })

    // Convert response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer())
    return buffer
  } catch (error) {
    console.error("Error in text-to-speech:", error)
    throw new Error("Failed to convert text to speech")
  }
}

/**
 * Main API handler
 * Flow: Audio Input → STT (Whisper) → AI (GPT) → TTS → Audio Output
 */
export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured in environment variables" },
        { status: 500 }
      )
    }

    // Get audio file from form data
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      )
    }

    // Validate file size (limit to 25MB for Whisper)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: "Audio file too large. Maximum size is 25MB." },
        { status: 400 }
      )
    }

    console.log(`Processing audio: ${audioFile.size} bytes, type: ${audioFile.type}`)

    // Step 1: Convert audio to text (Speech-to-Text)
    console.log("Step 1: Transcribing audio...")
    const transcription = await transcribeAudio(audioFile)
    console.log("Transcription:", transcription)

    // Step 2: Process with AI
    console.log("Step 2: Processing with AI...")
    const aiResponse = await processWithAI(transcription)
    console.log("AI Response:", aiResponse)

    // Step 3: Convert response to speech (Text-to-Speech)
    console.log("Step 3: Converting to speech...")
    const audioBuffer = await textToSpeech(aiResponse)
    console.log(`Generated audio: ${audioBuffer.length} bytes`)

    // Step 4: Return audio response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error("Error processing voice request:", error)
    
    // Return more specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: "Failed to process voice request",
          details: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS (if needed)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
