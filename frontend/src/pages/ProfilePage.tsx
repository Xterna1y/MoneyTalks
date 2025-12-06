"use client"

import { useState } from "react"
import { Phone, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

function SettingItem({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
        {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

export default function ProfilePage() {
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [slowVoice, setSlowVoice] = useState(false)

  const handleLogout = () => {
    console.log("Logging out...")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-6 pt-20 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage your accessibility and account settings</p>
        </div>

        <Card className="border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Accessibility Settings</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-200 dark:divide-slate-700">
            <SettingItem label="Large Text Mode" checked={largeText} onCheckedChange={setLargeText} />
            <SettingItem label="High Contrast" checked={highContrast} onCheckedChange={setHighContrast} />
            <SettingItem label="Slow Voice Speed" checked={slowVoice} onCheckedChange={setSlowVoice} />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Caretaker Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <span className="text-lg font-semibold">A</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Adam (Son)</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Connected</p>
                </div>
              </div>
              <Button size="sm" className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500" onClick={() => console.log("Calling Adam...")}>
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </main>
  )
}

