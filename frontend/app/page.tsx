"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

export default function Home() {
  type Status = "idle" | "listening" | "sending" | "playing" | "error"

  const [status, setStatus] = useState<Status>("idle")
  const [transcript, setTranscript] = useState("Say something to begin...")
  const [supported, setSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Speech-to-text (browser) for live transcript
  useEffect(() => {
    const SpeechRecognition =
      (typeof window !== "undefined" &&
        (window.SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: SpeechRecognition })
            .webkitSpeechRecognition)) ||
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
      setTranscript(finalTranscript.trim() || "Listening...")
    }

    recognition.onerror = () => {
      setStatus("error")
      setTranscript("Microphone error. Please try again.")
      setError("Microphone error. Check permissions and try again.")
    }

    recognitionRef.current = recognition
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      mediaRecorderRef.current?.stop()
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      if (audioRef.current) audioRef.current.pause()
    }
  }, [])

  const toggleListening = async () => {
    if (!supported) {
      setTranscript("Voice input not supported in this browser.")
      return
    }

    if (status !== "listening") {
      // Ask for mic permission first
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
      } catch {
        setStatus("error")
        setTranscript("Microphone error. Please try again.")
        setError("Microphone error. Check permissions and try again.")
      }

      // Start recording to send to API
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
          const blob = new Blob(chunksRef.current, {
            type: "audio/webm;codecs=opus",
          })
          await sendAudio(blob)
          stream.getTracks().forEach((t) => t.stop())
        }

        recorder.start(150)
      } catch {
        setStatus("error")
        setTranscript("Could not start recording.")
        setError("Could not start recording. Check mic permissions.")
      }
    } else {
      setStatus("sending")
      recognitionRef.current?.stop()
      mediaRecorderRef.current?.stop()
      setTranscript((prev) => prev || "Sending for response...")
    }
  }

  const sendAudio = async (audioBlob: Blob) => {
    try {
      setStatus("sending")
      setTranscript("Processing with AI...")
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const response = await fetch("/api/voice", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const audioResponse = await response.blob()
      await playAudio(audioResponse)
    } catch (err) {
      setStatus("error")
      setError("Failed to process voice. Please try again.")
      setTranscript("Failed to process voice. Please try again.")
    }
  }

  const playAudio = async (audioBlob: Blob) => {
    try {
      setStatus("playing")
      const url = URL.createObjectURL(audioBlob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        URL.revokeObjectURL(url)
        setStatus("idle")
        setTranscript("Say something to begin...")
      }
      await audio.play()
    } catch {
      setStatus("error")
      setError("Failed to play response.")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Card className="w-full border-slate-200 bg-white shadow-lg">
          <CardContent className="flex flex-col items-center gap-8 p-8">
            <AudioVisualizer active={status === "listening"} />

            <div className="w-full space-y-3 text-center">
              <div
                className={cn(
                  "mx-auto w-fit rounded-full px-4 py-2 text-sm font-semibold",
                  status === "listening" && "bg-emerald-100 text-emerald-700",
                  status === "sending" && "bg-amber-100 text-amber-700",
                  status === "playing" && "bg-blue-100 text-blue-700",
                  status === "idle" && "bg-slate-100 text-slate-700",
                  status === "error" && "bg-red-100 text-red-700"
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
              <p className="text-lg font-medium text-slate-800">
                {supported ? transcript : "Voice input not supported in this browser."}
              </p>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <Button
              onClick={toggleListening}
              className="w-full bg-emerald-600 py-4 text-lg hover:bg-emerald-700"
            >
              {status === "listening" ? "Stop Listening" : "Start Speaking"}
            </Button>

            <p className="text-sm text-slate-500">Tip: Speak clearly and pause after your request.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
