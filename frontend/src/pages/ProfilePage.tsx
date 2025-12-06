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
        <p className="font-medium text-white">{label}</p>
        {description && <p className="text-sm text-zinc-400">{description}</p>}
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
    <div className="min-h-screen bg-zinc-950 p-4 text-white">
      <div className="mx-auto max-w-md space-y-6">
        <div className="pt-8">
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl">Accessibility Settings</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-zinc-800">
            <SettingItem label="Large Text Mode" checked={largeText} onCheckedChange={setLargeText} />
            <SettingItem label="High Contrast" checked={highContrast} onCheckedChange={setHighContrast} />
            <SettingItem label="Slow Voice Speed" checked={slowVoice} onCheckedChange={setSlowVoice} />
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl">Caretaker Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
                  <span className="text-lg font-semibold">A</span>
                </div>
                <div>
                  <p className="font-medium text-white">Adam (Son)</p>
                  <p className="text-sm text-zinc-400">Connected</p>
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => console.log("Calling Adam...")}>
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  )
}

