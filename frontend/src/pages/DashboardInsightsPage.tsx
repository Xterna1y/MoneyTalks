"use client"

import { TrendingUp, AlertCircle, ShieldCheck, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"

const categories = [
  { name: "Groceries", value: 520, limit: 800 },
  { name: "Utilities", value: 260, limit: 300 },
  { name: "Healthcare", value: 180, limit: 400 },
  { name: "Transport", value: 120, limit: 250 },
]

const pieColors = ["#22c55e", "#f59e0b", "#6366f1", "#06b6d4"]

const monthlyTrend = [
  { month: "Mar", total: 920 },
  { month: "Apr", total: 880 },
  { month: "May", total: 1010 },
  { month: "Jun", total: 940 },
  { month: "Jul", total: 1020 },
  { month: "Aug", total: 980 },
]

const alerts = [
  { title: "High utility spend", detail: "Electricity 30% above average", tone: "warn" },
  { title: "Healthy groceries trend", detail: "Within weekly target", tone: "ok" },
]

export default function DashboardInsightsPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto flex max-w-md flex-col gap-6 pt-8">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-semibold">Spending Insights</h1>
        </div>

        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">Monthly Trend</CardTitle>
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">Last 6 months total spend</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `RM ${v}`} />
                  <Tooltip
                    formatter={(value: number) => [`RM ${value}`, "Total spend"]}
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                    labelStyle={{ color: "#0f172a" }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2.5} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Progress value={68} />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">By Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {categories.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _, props) => [`RM ${value}`, props?.name || ""]}
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                    labelStyle={{ color: "#0f172a" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {categories.map((cat) => {
              const usedPct = Math.min((cat.value / cat.limit) * 100, 100)
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-800">{cat.name}</span>
                    <span className="text-slate-600">
                      RM {cat.value} / {cat.limit}
                    </span>
                  </div>
                  <Progress value={usedPct} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
              >
                {alert.tone === "warn" ? (
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
                ) : (
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                )}
                <div>
                  <p className="font-semibold text-slate-900">{alert.title}</p>
                  <p className="text-sm text-slate-600">{alert.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

