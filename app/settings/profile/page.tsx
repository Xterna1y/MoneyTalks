"use client"

import { useState } from "react"
import { User, Phone, Mail, Globe2, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SettingsProfilePage() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [caregiver, setCaregiver] = useState("Adam (Son)")
  const [phone, setPhone] = useState("+60 12-345 6789")
  const [email, setEmail] = useState("grandma@example.com")
  const [timezone, setTimezone] = useState("GMT+8 (Kuala Lumpur)")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto max-w-md space-y-6 pt-8">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-semibold">Profile & Safety</h1>
        </div>

        {/* Contact info */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleSave}>
              <div className="space-y-1">
                <label className="text-sm text-slate-700">Phone</label>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-700">Email</label>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-700">Timezone</label>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <Globe2 className="h-4 w-4 text-slate-500" />
                  <input
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 py-3 text-lg hover:bg-emerald-700">
                Save Contact
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Caregiver link */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">Caretaker</CardTitle>
            <Shield className="h-6 w-6 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-slate-700">Linked contact</p>
              <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900">
                {caregiver}
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              onClick={() => setCaregiver("Adam (Son)")}
            >
              Reset to Adam
            </Button>
          </CardContent>
        </Card>

        {/* Safety toggles */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Safety & Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Notifications</p>
                <p className="text-sm text-slate-600">Transaction & bill alerts</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Two-Factor Login</p>
                <p className="text-sm text-slate-600">Add extra security</p>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
