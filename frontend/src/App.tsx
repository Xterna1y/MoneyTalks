import { useEffect } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { BottomNav } from "@/components/bottom-nav"
import ActivityPage from "@/pages/ActivityPage"
import BudgetHistoryPage from "@/pages/BudgetHistoryPage"
import BudgetPage from "@/pages/BudgetPage"
import DashboardInsightsPage from "@/pages/DashboardInsightsPage"
import DashboardPage from "@/pages/DashboardPage"
import HomePage from "@/pages/HomePage"
import ProfilePage from "@/pages/ProfilePage"
import SettingsPage from "@/pages/SettingsPage"
import SettingsProfilePage from "@/pages/SettingsProfilePage"

export default function App() {
  useEffect(() => {
    document.body.className =
      "pb-[calc(6rem+env(safe-area-inset-bottom))] text-lg leading-relaxed bg-slate-50 text-slate-900"
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/insights" element={<DashboardInsightsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/budget/history" element={<BudgetHistoryPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/profile" element={<SettingsProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  )
}

