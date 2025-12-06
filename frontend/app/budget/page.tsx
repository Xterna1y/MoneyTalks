"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const chartData = [
  { name: "This Month", Limit: 1000, Spent: 700 },
]

export default function BudgetPage() {
  const [limit, setLimit] = useState("1000")
  const spent = 700
  const percentUsed = Math.min((spent / Number(limit || "1")) * 100, 100)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto max-w-md space-y-6 pt-8">
        <h1 className="text-3xl font-bold text-slate-900">Monthly Budget</h1>

        {/* Chart */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">
              Limit vs Spent
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#1e293b" />
                <YAxis stroke="#1e293b" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                  itemStyle={{ color: "#0f172a" }}
                />
                <Legend />
                <Bar dataKey="Limit" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Spent" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Update Limit */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">
              Update Monthly Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-sm text-slate-700">New Limit (RM)</label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
                  min={0}
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 py-3 text-lg hover:bg-emerald-700">
                Save Limit
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Budget Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>70% of Budget Used</span>
              <span>RM {spent} / RM {limit || 0}</span>
            </div>
            <Progress value={percentUsed} />
          </CardContent>
        </Card>

        <Link href="/budget/history">
          <Button
            variant="outline"
            className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            View Budget History
          </Button>
        </Link>
      </div>
    </main>
  )
}
