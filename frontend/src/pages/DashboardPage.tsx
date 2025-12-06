"use client"

import { useState, useEffect } from "react"
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
        dayTotals.set(dayName, (dayTotals.get(dayName) || 0) + tx.amount)
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
      categorySpending.set(cat.name, cat.amount)
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

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
        <div className="mx-auto max-w-md space-y-6 pt-8">
          <div className="text-center text-lg text-slate-600">Loading dashboard...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
        <div className="mx-auto max-w-md space-y-6 pt-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }
  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto flex max-w-md flex-col gap-6 pt-8">
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-slate-200 bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-600">Spent This Month</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-3xl font-bold text-slate-900">RM {totalThisMonth.toFixed(2)}</p>
              <p className="text-sm text-emerald-600">Current month total</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-600">Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-3xl font-bold text-slate-900">RM 430</p>
              <p className="text-sm text-amber-600">3 due this week</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">Weekly Spending</CardTitle>
            <Banknote className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySpend}>
                <defs>
                  <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `RM ${v}`} />
                <Tooltip
                  formatter={(value: number) => [`RM ${value}`, "Spent"]}
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                  labelStyle={{ color: "#0f172a" }}
                />
                <Area type="monotone" dataKey="spent" stroke="#16a34a" fill="url(#spend)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {budgetAlerts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-600">Recent Alerts</h2>
            {budgetAlerts.map((alert, idx) => (
              <Card key={idx} className="border-amber-200 bg-amber-50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-amber-800">{alert.title}</p>
                    <p className="text-sm text-amber-700">{alert.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">Accounts</CardTitle>
            <Button size="sm" variant="outline" className="gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50">
              <Link2 className="h-4 w-4" />
              Link bank
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {accounts.length > 0 ? (
              accounts.map((acct) => (
                <div
                  key={acct.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{acct.bankName}</p>
                    <p className="text-sm text-slate-600">
                      {acct.accountType} • {acct.maskedNumber}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-600 py-4">
                <p>No accounts linked yet</p>
                <p className="text-sm mt-1">Link a bank account to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-600">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-24 flex-col items-center justify-center gap-2 border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-100">
              <PlusCircle className="h-6 w-6" />
              <span className="text-base">Add Expense</span>
            </Button>
            <Button className="h-24 flex-col items-center justify-center gap-2 border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-100">
              <PhoneCall className="h-6 w-6" />
              <span className="text-base">Call Emergency</span>
            </Button>
            <Link to="/dashboard/insights" className="col-span-2">
              <Button
                variant="outline"
                className="w-full justify-center gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <TrendingUp className="h-5 w-5" />
                View Spending Insights
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

