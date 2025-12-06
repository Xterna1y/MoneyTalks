"use client"

import { useState } from "react"
import { User, Phone, Mail, Globe2, Shield, ArrowLeft, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Link } from "react-router-dom"

export default function SettingsProfilePage() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [caregiver, setCaregiver] = useState("Adam (Son)")
  const [phone, setPhone] = useState("+60 12-345 6789")
  const [email, setEmail] = useState("grandma@example.com")
  const [timezone, setTimezone] = useState("GMT+8 (Kuala Lumpur)")
  const [emergencyContact, setEmergencyContact] = useState("Adam - 0123456789")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // Save logic here
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-6 pt-20 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-2xl space-y-6 pb-8">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Button
              variant="outline"
              className="flex h-10 w-10 items-center justify-center rounded-xl border-emerald-200 p-0 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/20"
            >
              <ArrowLeft className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            </Button>
          </Link>
          <div className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-2xl dark:from-emerald-700 dark:to-teal-700">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Profile &amp; Safety</h1>
                <p className="mt-1 text-emerald-100">Manage your account and security settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <Card className="group relative overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-500/10 dark:to-indigo-500/10"></div>
          <CardHeader className="relative border-b border-blue-100/50 bg-gradient-to-r from-blue-50 to-white dark:border-blue-900/50 dark:from-blue-900/20 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <User className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Contact Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4 p-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Phone Number
              </label>
              <div className="flex items-center gap-2 rounded-xl border-2 border-blue-100 bg-white px-4 py-3 transition-all duration-200 focus-within:border-blue-500 focus-within:bg-blue-50/50 focus-within:ring-4 focus-within:ring-blue-500/20 dark:border-blue-900/50 dark:bg-slate-700 dark:focus-within:border-blue-500 dark:focus-within:bg-blue-900/20">
                <Phone className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-slate-900 outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                  placeholder="+60 12-345 6789"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Email Address
              </label>
              <div className="flex items-center gap-2 rounded-xl border-2 border-blue-100 bg-white px-4 py-3 transition-all duration-200 focus-within:border-blue-500 focus-within:bg-blue-50/50 focus-within:ring-4 focus-within:ring-blue-500/20 dark:border-blue-900/50 dark:bg-slate-700 dark:focus-within:border-blue-500 dark:focus-within:bg-blue-900/20">
                <Mail className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-slate-900 outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Globe2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Timezone
              </label>
              <div className="flex items-center gap-2 rounded-xl border-2 border-blue-100 bg-white px-4 py-3 transition-all duration-200 focus-within:border-blue-500 focus-within:bg-blue-50/50 focus-within:ring-4 focus-within:ring-blue-500/20 dark:border-blue-900/50 dark:bg-slate-700 dark:focus-within:border-blue-500 dark:focus-within:bg-blue-900/20">
                <Globe2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <input
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-transparent text-slate-900 outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                  placeholder="GMT+8 (Kuala Lumpur)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Card */}
        <Card className="group relative overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-red-500/10 dark:to-orange-500/10"></div>
          <CardHeader className="relative border-b border-red-100/50 bg-gradient-to-r from-red-50 to-white dark:border-red-900/50 dark:from-red-900/20 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                <AlertCircle className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Emergency Contact</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4 p-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Phone className="h-4 w-4 text-red-600 dark:text-red-400" />
                Emergency Contact
              </label>
              <input
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g., Adam - 0123456789"
                className="w-full rounded-xl border-2 border-red-100 bg-white px-4 py-3 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-red-500 focus:bg-red-50/50 focus:outline-none focus:ring-4 focus:ring-red-500/20 dark:border-red-900/50 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-red-900/20"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">This contact will be notified in case of emergencies</p>
            </div>
          </CardContent>
        </Card>

        {/* Caretaker Card */}
        <Card className="group relative overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-purple-500/10 dark:to-pink-500/10"></div>
          <CardHeader className="relative border-b border-purple-100/50 bg-gradient-to-r from-purple-50 to-white dark:border-purple-900/50 dark:from-purple-900/20 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Caretaker</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4 p-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Linked Caretaker</label>
              <div className="rounded-xl border-2 border-purple-100 bg-gradient-to-r from-purple-50/50 to-white px-4 py-3 text-slate-900 dark:border-purple-900/50 dark:from-purple-900/20 dark:to-slate-700 dark:text-slate-100">
                {caregiver}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your trusted caretaker who can assist with your account</p>
            </div>
            <Button
              variant="outline"
              className="w-full border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:hover:border-purple-600"
              onClick={() => setCaregiver("Adam (Son)")}
            >
              Reset to Default
            </Button>
          </CardContent>
        </Card>

        {/* Safety & Alerts Card */}
        <Card className="group relative overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-amber-500/10 dark:to-yellow-500/10"></div>
          <CardHeader className="relative border-b border-amber-100/50 bg-gradient-to-r from-amber-50 to-white dark:border-amber-900/50 dark:from-amber-900/20 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Safety &amp; Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4 p-6">
            <div className="flex items-center justify-between rounded-xl border-2 border-amber-100 bg-gradient-to-r from-amber-50/50 to-white p-4 transition-all duration-200 hover:border-amber-200 hover:shadow-md dark:border-amber-900/50 dark:from-amber-900/20 dark:to-slate-700 dark:hover:border-amber-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Notifications</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Transaction &amp; bill alerts</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between rounded-xl border-2 border-amber-100 bg-gradient-to-r from-amber-50/50 to-white p-4 transition-all duration-200 hover:border-amber-200 hover:shadow-md dark:border-amber-900/50 dark:from-amber-900/20 dark:to-slate-700 dark:hover:border-amber-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                  <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Two-Factor Login</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Add extra security</p>
                </div>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/40"
        >
          Save All Changes
        </Button>
      </div>
    </main>
  )
}

