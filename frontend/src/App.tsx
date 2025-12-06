import { useEffect } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
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
import HelpSupportPage from "@/pages/HelpSupportPage"
import LoginPage from "@/pages/LoginPage"
import OnboardingPage from "@/pages/OnboardingPage"

function AppRoutes() {
  const location = useLocation()
  const showNav = !["/login", "/onboarding"].includes(location.pathname)

  return (
    <>
      {showNav && <BottomNav />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/insights" element={<DashboardInsightsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/budget/history" element={<BudgetHistoryPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/profile" element={<SettingsProfilePage />} />
        <Route path="/settings/help" element={<HelpSupportPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  useEffect(() => {
    // Update body classes to support dark mode
    const updateBodyClasses = () => {
      const isDark = document.documentElement.classList.contains("dark")
      document.body.className = `text-lg leading-relaxed bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 ${
        isDark ? "dark" : ""
      }`
    }
    
    updateBodyClasses()
    
    // Watch for theme changes
    const observer = new MutationObserver(updateBodyClasses)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </>
  )
}
