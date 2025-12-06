"use client"

import { Clock3, Wallet, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const months = [
  { month: "Jan", spent: 820, limit: 1000 },
  { month: "Feb", spent: 780, limit: 1000 },
  { month: "Mar", spent: 640, limit: 1000 },
  { month: "Apr", spent: 910, limit: 1000 },
]

const recent = [
  { title: "Grocery top-up", amount: "- RM 85.40", time: "Today, 10:20 AM" },
  { title: "Clinic visit", amount: "- RM 120.00", time: "Yesterday, 3:05 PM" },
  { title: "Electric bill", amount: "- RM 210.00", time: "Mon, 7:45 PM" },
]

export default function BudgetHistoryPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto flex max-w-md flex-col gap-6 pt-8">
        <div className="flex items-center gap-2">
          <Clock3 className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-semibold">Budget History</h1>
        </div>

        {/* Monthly summary */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">Monthly Recap</CardTitle>
            <Wallet className="h-6 w-6 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-4">
            {months.map((m) => {
              const pct = Math.min((m.spent / m.limit) * 100, 100)
              return (
                <div key={m.month} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-800">{m.month}</span>
                    <span className="text-slate-600">RM {m.spent} / {m.limit}</span>
                  </div>
                  <Progress value={pct} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent deductions */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">Recent Deductions</CardTitle>
            <TrendingDown className="h-6 w-6 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="space-y-1">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.time}</p>
                </div>
                <p className="text-sm font-semibold text-red-500">{item.amount}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
