"use client"

import { useState, useEffect, useMemo } from "react"
import { AlertTriangle, Banknote, Link2, PhoneCall, PlusCircle, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDashboard, fetchAccounts, fetchBudgets, DEFAULT_USER_ID } from "@/lib/api"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [dashboard, accountsData, budgetsData] = await Promise.all([
          fetchDashboard(DEFAULT_USER_ID),
          fetchAccounts(DEFAULT_USER_ID),
          fetchBudgets(DEFAULT_USER_ID),
        ])
        setDashboardData(dashboard)
        setAccounts(accountsData)
        setBudgets(budgetsData)
        setError(null)
      } catch (err) {
        console.error("Error loading dashboard:", err)
        setError("Failed to load dashboard. Make sure backend is running on http://localhost:3001")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const calculateWeeklySpending = () => {
    if (!dashboardData?.recentTransactions) {
      return [
        { day: "Mon", spent: 0 },
        { day: "Tue", spent: 0 },
        { day: "Wed", spent: 0 },
        { day: "Thu", spent: 0 },
        { day: "Fri", spent: 0 },
        { day: "Sat", spent: 0 },
        { day: "Sun", spent: 0 },
      ]
    }

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const dayTotals = new Map<string, number>()
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    dashboardData.recentTransactions.forEach((tx: any) => {
      const txDate = new Date(tx.createdAt)
      if (txDate >= startOfWeek) {
        const dayName = dayNames[txDate.getDay()]
        const amount = Number(tx.amount) || 0
        dayTotals.set(dayName, (dayTotals.get(dayName) || 0) + amount)
      }
    })

    return dayNames.map((day) => ({
      day,
      spent: Math.round(dayTotals.get(day) || 0),
    }))
  }

  const getBudgetAlerts = () => {
    if (!dashboardData?.byCategory || !budgets.length) return []

    const categorySpending = new Map<string, number>()
    dashboardData.byCategory.forEach((cat: any) => {
      categorySpending.set(cat.name, Number(cat.amount) || 0)
    })

    const alerts: any[] = []
    budgets.forEach((budget) => {
      const spent = categorySpending.get(budget.category) || 0
      const percent = (spent / budget.limit) * 100

      if (percent >= 100) {
        alerts.push({
          title: `Over budget: ${budget.category}`,
          detail: `Spent RM ${spent.toFixed(2)} of RM ${budget.limit.toFixed(2)}`,
          tone: "warn",
        })
      } else if (percent >= 80) {
        alerts.push({
          title: `Near budget limit: ${budget.category}`,
          detail: `${percent.toFixed(0)}% of budget used`,
          tone: "warn",
        })
      }
    })

    return alerts
  }

  const weeklySpend = calculateWeeklySpending()
  const budgetAlerts = getBudgetAlerts()
  const totalThisMonth = dashboardData?.totalThisMonth || 0
  const spendGradientId = useMemo(() => `spend-${Math.random().toString(36).slice(2, 8)}`, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-6 pt-20 pb-12 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
        <div className="mx-auto max-w-5xl space-y-6 pt-8">
          <div className="rounded-xl border border-slate-200 bg-white/90 p-6 text-center text-base text-slate-700 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
            Loading dashboard...
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-6 pt-20 pb-12 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
        <div className="mx-auto max-w-5xl space-y-6 pt-8">
          <Card className="border-red-200 bg-red-50/90 backdrop-blur dark:border-red-200/40 dark:bg-red-500/10">
            <CardContent className="p-5 text-red-800 dark:text-red-100">
              <p>{error}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-6 pt-20 pb-12 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-400/15" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-teal-300/10 blur-3xl dark:bg-teal-300/10" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-100 dark:ring-emerald-500/30">
            Dashboard
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Overview</h1>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
              Synced now
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">Spending snapshot, accounts, and quick actions in one place.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-emerald-200 bg-white/90 shadow-xl backdrop-blur dark:border-emerald-500/20 dark:bg-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-700 dark:text-slate-200">Spent This Month</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-3xl font-bold text-slate-900 dark:text-white">RM {totalThisMonth.toFixed(2)}</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-200">Current month total</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white/90 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-700 dark:text-slate-200">Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-3xl font-bold text-slate-900 dark:text-white">RM 430</p>
              <p className="text-sm text-amber-600 dark:text-amber-200">3 due this week</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white/90 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-700 dark:text-slate-200">Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-4">
              {budgetAlerts.length > 0 ? (
                budgetAlerts.slice(0, 2).map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500 dark:text-amber-400" />
                    <div className="text-xs text-slate-700 dark:text-slate-200">
                      <p className="font-semibold text-slate-900 dark:text-white">{alert.title}</p>
                      <p>{alert.detail}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">No alerts right now.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-emerald-200 bg-white/90 shadow-xl backdrop-blur dark:border-emerald-500/20 dark:bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-900 dark:text-white">Weekly Spending</CardTitle>
            <Banknote className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySpend}>
                <defs>
                  <linearGradient id={spendGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" />
                <XAxis dataKey="day" stroke="#64748b" className="dark:stroke-slate-400" />
                <YAxis stroke="#64748b" className="dark:stroke-slate-400" tickFormatter={(v) => `RM ${v}`} />
                <Tooltip
                  formatter={(value: number) => [`RM ${value}`, "Spent"]}
                  contentStyle={{ 
                    backgroundColor: "#ffffff", 
                    border: "1px solid #e2e8f0", 
                    color: "#0f172a",
                    borderRadius: "8px"
                  }}
                  labelStyle={{ color: "#0f172a" }}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                />
                <Area type="monotone" dataKey="spent" stroke="#22c55e" fill={`url(#${spendGradientId})`} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {budgetAlerts.length > 0 && (
          <Card className="border border-amber-200 bg-amber-50/90 shadow-xl backdrop-blur dark:border-amber-300/20 dark:bg-amber-500/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white">Recent Alerts</CardTitle>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 dark:bg-white/5 dark:text-amber-100 dark:ring-amber-200/30">
                {budgetAlerts.length} items
              </span>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {budgetAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border border-amber-200 bg-white p-4 shadow-sm dark:border-white/20 dark:bg-white/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-100">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="text-sm text-amber-800 dark:text-amber-50">
                    <p className="font-semibold text-slate-900 dark:text-white">{alert.title}</p>
                    <p>{alert.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="border border-slate-200 bg-white/90 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-900 dark:text-white">Accounts</CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-emerald-600 text-emerald-700 ring-1 ring-emerald-500/30 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-400 dark:text-emerald-100 dark:hover:bg-emerald-500/10 dark:hover:text-white"
            >
              <Link2 className="h-4 w-4" />
              Link bank
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {accounts.length > 0 ? (
              accounts.map((acct) => (
                <div
                  key={acct.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{acct.bankName}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-200">
                      {acct.accountType} • {acct.maskedNumber}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <p>No accounts linked yet</p>
                <p className="mt-1 text-sm">Link a bank account to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Button className="h-24 flex-col items-center justify-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-white dark:hover:bg-emerald-400/20">
              <PlusCircle className="h-6 w-6" />
              <span className="text-base">Add Expense</span>
            </Button>
            <Button className="h-24 flex-col items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
              <PhoneCall className="h-6 w-6" />
              <span className="text-base">Call Emergency</span>
            </Button>
            <Button className="h-24 flex-col items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
              <Link2 className="h-6 w-6" />
              <span className="text-base">Link Bank</span>
            </Button>
            <Link to="/dashboard/insights" className="col-span-2 md:col-span-1">
              <Button
                variant="outline"
                className="h-24 w-full flex-col items-center justify-center gap-2 border-emerald-600 bg-white text-emerald-700 ring-1 ring-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-400 dark:bg-white/5 dark:text-emerald-100 dark:hover:bg-emerald-500/10 dark:hover:text-white"
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-base">View Insights</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
