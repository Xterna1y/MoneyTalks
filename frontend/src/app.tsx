"use client"

import { Routes, Route } from "react-router-dom"
import SpeakRoute from "./routes/Speak"
import DashboardRoute from "./routes/Dashboard"
import DashboardInsightsRoute from "./routes/Dashboard/Insights"
import BudgetRoute from "./routes/Budget"
import BudgetHistoryRoute from "./routes/Budget/History"
import ActivityRoute from "./routes/Activity"
import SettingsRoute from "./routes/Settings"
import SettingsProfileRoute from "./routes/Settings/Profile"
import LoginRoute from "./routes/Login"
import OnboardingRoute from "./routes/Onboarding"
import NotFoundRoute from "./routes/NotFound"
import { AuthGate } from "./components/auth/auth-gate"
import { ConditionalBottomNav } from "./components/conditional-bottom-nav"
import { OnboardingProvider } from "./components/providers/onboarding-provider"

export default function App() {
  return (
    <OnboardingProvider>
      <AuthGate>
        <Routes>
          <Route path="/" element={<SpeakRoute />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/onboarding" element={<OnboardingRoute />} />
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/dashboard/insights" element={<DashboardInsightsRoute />} />
          <Route path="/budget" element={<BudgetRoute />} />
          <Route path="/budget/history" element={<BudgetHistoryRoute />} />
          <Route path="/activity" element={<ActivityRoute />} />
          <Route path="/settings" element={<SettingsRoute />} />
          <Route path="/settings/profile" element={<SettingsProfileRoute />} />
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
        <ConditionalBottomNav />
      </AuthGate>
    </OnboardingProvider>
  )
}

