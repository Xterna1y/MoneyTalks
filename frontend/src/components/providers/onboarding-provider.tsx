"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type OnboardingData = {
  profile: {
    name: string
    salutation?: string
  }
  income: {
    frequency: "Weekly" | "Bi-Weekly" | "Monthly" | "Irregular/Gig Work"
    amount?: number
    hasNoIncome: boolean
  }
  bills: {
    name: string
    amount: number
    dueDay: number
  }[]
  goals: {
    savingsRate: number
    targetAmount?: number
  }
}

type OnboardingContextValue = {
  data: OnboardingData | null
  setOnboardingData: (data: OnboardingData) => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem("onboardingData")
      if (stored) {
        setData(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const value = useMemo<OnboardingContextValue>(
    () => ({
      data,
      setOnboardingData: (next) => {
        setData(next)
        if (typeof window !== "undefined") {
          localStorage.setItem("onboardingData", JSON.stringify(next))
          localStorage.setItem("onboarded", "true")
        }
      },
    }),
    [data]
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider")
  return ctx
}

