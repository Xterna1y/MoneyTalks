"use client"

import { useState, useEffect } from "react"
import { Clock3, Wallet, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { fetchDashboard, fetchBudgetHistory, DEFAULT_USER_ID } from "@/lib/api"

function formatTransactionDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (transactionDate.getTime() === today.getTime()) {
    return `Today, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
  } else if (transactionDate.getTime() === yesterday.getTime()) {
    return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
  } else {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return `${days[date.getDay()]}, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
  }
}

export default function BudgetHistoryPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [monthlyHistory, setMonthlyHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [dashboard, history] = await Promise.all([
          fetchDashboard(DEFAULT_USER_ID),
          fetchBudgetHistory(DEFAULT_USER_ID, 6),
        ])
        setDashboardData(dashboard)
        setMonthlyHistory(history)
        setError(null)
      } catch (err) {
        console.error("Error loading budget history:", err)
        setError("Failed to load budget history. Make sure backend is running on http://localhost:3001")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
        <div className="mx-auto max-w-md space-y-6 pt-8">
          <div className="text-center text-lg text-slate-600">Loading budget history...</div>
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
        <div className="flex items-center gap-2">
          <Clock3 className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-semibold">Budget History</h1>
        </div>

        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">Monthly Recap</CardTitle>
            <Wallet className="h-6 w-6 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyHistory.length > 0 ? (
              monthlyHistory.map((month) => {
                const pct = month.limit > 0 ? Math.min((month.spent / month.limit) * 100, 100) : 0
                return (
                  <div key={month.monthKey} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-800">{month.month}</span>
                      <span className="text-slate-600">
                        RM {month.spent.toFixed(2)} / RM {month.limit.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={pct} />
                  </div>
                )
              })
            ) : (
              <div className="text-center text-slate-600 py-4">
                No budget history available. Set up budgets and make transactions to see your history!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">Recent Deductions</CardTitle>
            <TrendingDown className="h-6 w-6 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
              dashboardData.recentTransactions.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900">{transaction.merchant}</p>
                    <p className="text-xs text-slate-600">{formatTransactionDate(transaction.createdAt)}</p>
                  </div>
                  <p className="text-sm font-semibold text-red-500">- RM {transaction.amount.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-600 py-4">No recent transactions</div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

