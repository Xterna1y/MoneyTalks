"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { 
  User, 
  Bell, 
  Volume2, 
  Eye, 
  Phone, 
  Settings as SettingsIcon,
  Sparkles,
  Shield,
  Palette,
  LogOut
} from "lucide-react"
import { Theme } from "@/components/ui/theme"

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
    // Save logic here
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      // Clear any stored user data
      localStorage.clear()
      // Redirect to home or login page
      window.location.href = "/"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-6 pt-20 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-2xl space-y-6 pb-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-2xl dark:from-emerald-700 dark:to-teal-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <SettingsIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Settings</h1>
              <p className="mt-1 text-emerald-100">Customize your MoneyTalks experience</p>
            </div>
          </div>
        </div>

        {/* Personalization Card */}
        <Card className="group relative overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-emerald-500/10 dark:to-teal-500/10"></div>
          <CardHeader className="relative border-b border-emerald-100/50 bg-gradient-to-r from-emerald-50 to-white dark:border-emerald-900/50 dark:from-slate-800 dark:to-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Personalization</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-5 p-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Preferred name
              </label>
              <input
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                className="w-full rounded-xl border-2 border-emerald-100 bg-white px-4 py-3 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-emerald-50/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:border-emerald-900/50 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-emerald-500 dark:focus:bg-emerald-900/20"
                placeholder="e.g., Aunty Lee"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Palette className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Currency
              </label>
              <input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border-2 border-emerald-100 bg-white px-4 py-3 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-emerald-50/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:border-emerald-900/50 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-emerald-500 dark:focus:bg-emerald-900/20"
                placeholder="MYR (RM)"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border-2 border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-white p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-md dark:border-emerald-900/50 dark:from-slate-700/50 dark:to-slate-800 dark:hover:border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Daily summary</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Show a morning recap</p>
                </div>
              </div>
              <Switch checked={dailySummary} onCheckedChange={setDailySummary} />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Reminder time
              </label>
              <input
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full rounded-xl border-2 border-emerald-100 bg-white px-4 py-3 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-emerald-50/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:border-emerald-900/50 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-emerald-500 dark:focus:bg-emerald-900/20"
                placeholder="e.g., 9:00 AM"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Response length
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResponseLength("short")}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    responseLength === "short"
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 dark:from-emerald-600 dark:to-emerald-700"
                      : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  Short
                </button>
                <button
                  type="button"
                  onClick={() => setResponseLength("long")}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    responseLength === "long"
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 dark:from-emerald-600 dark:to-emerald-700"
                      : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  Detailed
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose shorter replies or detailed explanations.</p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Voice preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVoiceGender("female")}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    voiceGender === "female"
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 dark:from-emerald-600 dark:to-emerald-700"
                      : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceGender("male")}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    voiceGender === "male"
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 dark:from-emerald-600 dark:to-emerald-700"
                      : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  Male
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Set preferred voice gender for responses.</p>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Card */}
        <Card className="group relative overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-teal-500/10 dark:to-emerald-500/10"></div>
          <CardHeader className="relative border-b border-teal-100/50 bg-gradient-to-r from-teal-50 to-white dark:border-teal-900/50 dark:from-slate-800 dark:to-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg dark:from-teal-600 dark:to-teal-700">
                <Eye className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Accessibility</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4 p-6">
            <div className="flex items-center justify-between rounded-xl border-2 border-teal-100 bg-gradient-to-r from-teal-50/50 to-white p-4 transition-all duration-200 hover:border-teal-200 hover:shadow-md dark:border-teal-900/50 dark:from-slate-700/50 dark:to-slate-800 dark:hover:border-teal-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/50">
                  <Volume2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Voice Mode Only</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hide on-screen buttons</p>
                </div>
              </div>
              <Switch checked={voiceOnly} onCheckedChange={setVoiceOnly} />
            </div>
            <div className="flex items-center justify-between rounded-xl border-2 border-teal-100 bg-gradient-to-r from-teal-50/50 to-white p-4 transition-all duration-200 hover:border-teal-200 hover:shadow-md dark:border-teal-900/50 dark:from-slate-700/50 dark:to-slate-800 dark:hover:border-teal-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/50">
                  <Eye className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Large Text</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Increase font sizes</p>
                </div>
              </div>
              <Switch checked={largeText} onCheckedChange={setLargeText} />
            </div>
            <div className="flex items-center justify-between rounded-xl border-2 border-teal-100 bg-gradient-to-r from-teal-50/50 to-white p-4 transition-all duration-200 hover:border-teal-200 hover:shadow-md dark:border-teal-900/50 dark:from-slate-700/50 dark:to-slate-800 dark:hover:border-teal-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/50">
                  <Palette className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">High Contrast</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Boost readability</p>
                </div>
              </div>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
            <div className="space-y-3 rounded-xl border-2 border-teal-100 bg-gradient-to-r from-teal-50/50 to-white p-4 transition-all duration-200 hover:border-teal-200 hover:shadow-md dark:border-teal-900/50 dark:from-slate-700/50 dark:to-slate-800 dark:hover:border-teal-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/50">
                  <Palette className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">App Theme</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Choose light, dark, or system theme</p>
                </div>
              </div>
              <div className="flex justify-center pt-2">
                <Theme
                  variant="tabs"
                  size="md"
                  showLabel
                  themes={["light", "dark", "system"]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link to="/settings/profile">
            <Card className="group relative h-full cursor-pointer overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-emerald-500/10 dark:to-teal-500/10"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg dark:from-emerald-600 dark:to-emerald-700">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Profile &amp; Safety</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Manage contacts &amp; security</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/settings/help">
            <Card className="group relative h-full cursor-pointer overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-500/10 dark:to-indigo-500/10"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg dark:from-blue-600 dark:to-blue-700">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Help &amp; Support</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Get assistance when needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/40 dark:from-emerald-700 dark:to-teal-700 dark:hover:from-emerald-800 dark:hover:to-teal-800"
        >
          Save All Settings
        </Button>

        {/* Logout Section */}
        <Card className="group relative overflow-hidden border-2 border-red-100 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:border-red-900/50 dark:bg-slate-800">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-red-500/10 dark:to-orange-500/10"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg dark:from-red-600 dark:to-red-700">
                  <LogOut className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Account</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sign out of your account</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

