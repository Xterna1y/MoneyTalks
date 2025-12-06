import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { processVoicePrompt, DEFAULT_USER_ID } from "@/lib/api"

type LayerConfig = {
  size: number
  color: string
  delay: number
}

function AudioVisualizer({ active }: { active: boolean }) {
  const layers: LayerConfig[] = useMemo(
    () => [
      { size: 240, color: "bg-emerald-500/15", delay: 0 },
      { size: 200, color: "bg-teal-400/25", delay: 0.2 },
      { size: 160, color: "bg-emerald-400/40", delay: 0.4 },
      { size: 120, color: "bg-teal-300/50", delay: 0.6 },
      { size: 90, color: "bg-emerald-300", delay: 0.8 },
    ],
    []
  )

  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      {layers.map((layer, idx) => (
        <motion.div
          key={idx}
          className={`absolute rounded-full ${layer.color}`}
          style={{ width: layer.size, height: layer.size }}
          animate={
            active
              ? {
                  scale: [1, 1.05, 0.98, 1.08, 1],
                  opacity: [0.7, 1, 0.9, 1, 0.7],
                }
              : { scale: 1, opacity: 0.7 }
          }
          transition={{
            duration: 2.4,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
            delay: layer.delay,
          }}
        />
      ))}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50">
        <Mic className="h-10 w-10 text-white" strokeWidth={2.2} />
      </div>
    </div>
  )
}

export default function HomePage() {
  type Status = "idle" | "listening" | "sending" | "playing" | "error"

  const [status, setStatus] = useState<Status>("idle")
  const [transcript, setTranscript] = useState("")
  const [supported, setSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasSpokenRef = useRef(false)
  const lastUserTranscriptRef = useRef("")

  const SILENCE_MS = 3000

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }

  const triggerAutoStop = () => {
    if (!hasSpokenRef.current) return
    setStatus("sending")
    setTranscript((prev) => prev || "Processing…")
    recognitionRef.current?.stop()
    mediaRecorderRef.current?.stop()
  }

  const resetSilenceTimer = () => {
    clearSilenceTimer()
    silenceTimerRef.current = setTimeout(triggerAutoStop, SILENCE_MS)
  }

  useEffect(() => {
    const SpeechRecognition =
      (typeof window !== "undefined" &&
        (window.SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: SpeechRecognition }).webkitSpeechRecognition)) ||
      null

    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      let finalTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript
        finalTranscript += chunk
      }
      setStatus("listening")
      setTranscript(finalTranscript.trim() || "Listening...")
      if (finalTranscript.trim().length > 0) {
        hasSpokenRef.current = true
        lastUserTranscriptRef.current = finalTranscript.trim()
        resetSilenceTimer()
      }
    }

    recognition.onstart = () => {
      setStatus("listening")
      setError(null)
      clearSilenceTimer()
    }

    recognition.onerror = () => {
      setStatus("error")
      setTranscript("Microphone error. Please try again.")
      setError("Microphone error. Check permissions and try again.")
      clearSilenceTimer()
    }

    recognitionRef.current = recognition
  }, [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      mediaRecorderRef.current?.stop()
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      if (audioRef.current) audioRef.current.pause()
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
      clearSilenceTimer()
    }
  }, [])

  const toggleListening = async () => {
    if (!supported) {
      setTranscript("Voice input not supported in this browser.")
      return
    }

    if (status === "playing") {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
      setStatus("idle")
      setTranscript("Say something to begin...")
      lastUserTranscriptRef.current = ""
      clearSilenceTimer()
      return
    }

    if (status !== "listening") {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (err) {
        setError("Microphone blocked. Please allow access and try again.")
        setTranscript("Microphone blocked.")
        return
      }

      setStatus("listening")
      setTranscript("Listening...")

      try {
        recognitionRef.current?.start()
        setError(null)
        resetSilenceTimer()
      } catch {
        setStatus("error")
        setTranscript("Microphone error. Please try again.")
        setError("Microphone error. Check permissions and try again.")
        clearSilenceTimer()
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        chunksRef.current = []
        const recorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        })
        mediaRecorderRef.current = recorder

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }

        recorder.onstop = async () => {
          await sendTranscript()
          stream.getTracks().forEach((t) => t.stop())
        }

        recorder.start(150)
      } catch {
        setStatus("error")
        setTranscript("Could not start recording.")
        setError("Could not start recording. Check mic permissions.")
        clearSilenceTimer()
      }
    } else {
      setStatus("sending")
      recognitionRef.current?.stop()
      mediaRecorderRef.current?.stop()
      setTranscript((prev) => prev || "Sending for response...")
      clearSilenceTimer()
    }
  }

  const sendTranscript = async () => {
    try {
      setStatus("sending")
      setTranscript("Processing with AI...")
      clearSilenceTimer()

      const text = lastUserTranscriptRef.current.trim() || transcript.trim()
      if (!text) {
        throw new Error("No transcript to send")
      }

      console.log("Sending transcript to API:", text)
      const result = await processVoicePrompt(text, DEFAULT_USER_ID)
      console.log("Received response from API:", { 
        hasAudio: !!result.audioBase64, 
        hasText: !!result.textResponse,
        audioLength: result.audioBase64?.length 
      })

      if (!result.audioBase64) {
        throw new Error("No audio data received from server")
      }

      if (result.audioBase64.length === 0) {
        throw new Error("Audio data is empty")
      }

      // Decode base64 audio
      try {
        const binaryString = atob(result.audioBase64)
        if (binaryString.length === 0) {
          throw new Error("Decoded audio data is empty")
        }
        
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const audioBlob = new Blob([bytes], { type: result.contentType || "audio/mpeg" })
        console.log("Created audio blob:", { size: audioBlob.size, type: audioBlob.type })

        if (audioBlob.size === 0) {
          throw new Error("Audio blob is empty after creation")
        }

        await playAudio(audioBlob)
        setTranscript(result.textResponse || text)
      } catch (audioError) {
        console.error("Error decoding audio:", audioError)
        throw new Error(`Failed to decode audio: ${audioError instanceof Error ? audioError.message : "Unknown error"}`)
      }
    } catch (err) {
      console.error("Error in sendTranscript:", err)
      setStatus("error")
      const errorMessage = err instanceof Error ? err.message : "Failed to process voice. Please try again."
      setError(errorMessage)
      setTranscript(errorMessage)
    }
  }

  const playAudio = async (audioBlob: Blob) => {
    try {
      setStatus("playing")
      clearSilenceTimer()
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }
      const url = URL.createObjectURL(audioBlob)
      audioUrlRef.current = url
      const audio = new Audio(url)
      audioRef.current = audio
      
      audio.onerror = (e) => {
        console.error("Audio playback error:", e)
        setStatus("error")
        setError("Failed to play audio. The audio file may be corrupted.")
      }
      
      audio.onended = () => {
        URL.revokeObjectURL(url)
        audioUrlRef.current = null
        setStatus("idle")
        setTranscript("Say something to begin...")
        lastUserTranscriptRef.current = ""
      }
      
      console.log("Playing audio:", { url, blobSize: audioBlob.size })
      await audio.play()
      console.log("Audio playback started successfully")
    } catch (playError) {
      console.error("Error playing audio:", playError)
      setStatus("error")
      const errorMessage = playError instanceof Error ? playError.message : "Failed to play response."
      setError(errorMessage)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-4 pt-20 pb-10 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="flex w-full max-w-lg flex-col items-center gap-6">
        <div className="relative w-full">
          <div className="absolute inset-0 blur-3xl bg-emerald-200/40 dark:bg-emerald-900/20" aria-hidden />
          <Card className="relative w-full border-slate-200 bg-white/90 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
            <CardContent className="flex flex-col items-center gap-8 p-8">
              <div className="flex w-full items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Mic ready
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {status === "idle"
                    ? "Tap to speak"
                    : status === "listening"
                    ? "Listening"
                    : status === "sending"
                    ? "Processing"
                    : status === "playing"
                    ? "Playing"
                    : "Error"}
                </span>
              </div>

              <AudioVisualizer active={status === "listening"} />

              <div className="w-full space-y-3 text-center">
                <div
                  className={cn(
                    "mx-auto w-fit rounded-full px-4 py-2 text-sm font-semibold shadow-sm",
                    status === "listening" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                    status === "sending" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                    status === "playing" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                    status === "idle" && "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
                    status === "error" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  )}
                >
                  {status === "listening"
                    ? "Listening…"
                    : status === "sending"
                    ? "Processing…"
                    : status === "playing"
                    ? "Playing response…"
                    : status === "error"
                    ? "Something went wrong"
                    : "Tap to start"}
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {supported ? transcript : "Voice input not supported in this browser."}
                </p>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              </div>

              <Button onClick={toggleListening} className="w-full bg-emerald-600 py-4 text-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                {status === "listening" ? "Stop Listening" : "Start Speaking"}
              </Button>

              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-left text-slate-700 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Try asking:</p>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  <li>"How much did I spend this week?"</li>
                  <li>"Remind me to pay my electric bill."</li>
                  <li>"What's my groceries budget left?"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

