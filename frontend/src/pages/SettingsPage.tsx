"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function SettingsPage() {
  const [voiceOnly, setVoiceOnly] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [contact, setContact] = useState("")
  const [preferredName, setPreferredName] = useState("Grandma")
  const [currency, setCurrency] = useState("MYR (RM)")
  const [reminderTime, setReminderTime] = useState("9:00 AM")
  const [dailySummary, setDailySummary] = useState(true)
  const [responseLength, setResponseLength] = useState<"short" | "long">("short")
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto max-w-md space-y-6 pt-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>

        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Personalization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-slate-700">Preferred name</label>
              <input
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
                placeholder="e.g., Aunty Lee"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-700">Currency</label>
              <input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
                placeholder="MYR (RM)"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Daily summary</p>
                <p className="text-sm text-slate-600">Show a morning recap</p>
              </div>
              <Switch checked={dailySummary} onCheckedChange={setDailySummary} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-700">Reminder time</label>
              <input
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
                placeholder="e.g., 9:00 AM"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-700">Response length</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResponseLength("short")}
                  className={`rounded-md border px-3 py-2 text-sm font-medium ${
                    responseLength === "short"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  Short
                </button>
                <button
                  type="button"
                  onClick={() => setResponseLength("long")}
                  className={`rounded-md border px-3 py-2 text-sm font-medium ${
                    responseLength === "long"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  Detailed
                </button>
              </div>
              <p className="text-xs text-slate-600">Choose shorter replies or detailed explanations.</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-700">Voice</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVoiceGender("female")}
                  className={`rounded-md border px-3 py-2 text-sm font-medium ${
                    voiceGender === "female"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceGender("male")}
                  className={`rounded-md border px-3 py-2 text-sm font-medium ${
                    voiceGender === "male"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  Male
                </button>
              </div>
              <p className="text-xs text-slate-600">Set preferred voice gender for responses.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Accessibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Voice Mode Only</p>
                <p className="text-sm text-slate-600">Hide on-screen buttons</p>
              </div>
              <Switch checked={voiceOnly} onCheckedChange={setVoiceOnly} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Large Text</p>
                <p className="text-sm text-slate-600">Increase font sizes</p>
              </div>
              <Switch checked={largeText} onCheckedChange={setLargeText} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">High Contrast</p>
                <p className="text-sm text-slate-600">Boost readability</p>
              </div>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleSave}>
              <div className="space-y-1">
                <label className="text-sm text-slate-700">Phone / Name</label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g., Adam - 0123456789"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 py-3 text-lg hover:bg-emerald-700">
                Save
              </Button>
            </form>
          </CardContent>
        </Card>

        <Link to="/settings/profile">
          <Button
            variant="outline"
            className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            Profile &amp; Safety
          </Button>
        </Link>
      </div>
    </main>
  )
}

