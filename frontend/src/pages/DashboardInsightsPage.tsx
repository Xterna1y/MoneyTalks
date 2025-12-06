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
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-6 pt-20 pb-12 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-16 top-8 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-400/15" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-teal-300/10 blur-3xl dark:bg-teal-300/10" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-100 dark:ring-emerald-500/30">
            Dashboard
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Spending Insights</h1>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
              Updated today
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">Trends, categories, and alerts to keep you on track.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border border-emerald-200 bg-white/90 shadow-xl backdrop-blur dark:border-emerald-500/20 dark:bg-white/5 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg text-slate-900 dark:text-white">Monthly Trend</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-300">Last 6 months total spend</p>
              </div>
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" />
                    <XAxis dataKey="month" stroke="#64748b" className="dark:stroke-slate-400" />
                    <YAxis stroke="#64748b" className="dark:stroke-slate-400" tickFormatter={(v) => `RM ${v}`} />
                    <Tooltip
                      formatter={(value: number) => [`RM ${value}`, "Total spend"]}
                      contentStyle={{ 
                        backgroundColor: "#ffffff", 
                        border: "1px solid #e2e8f0", 
                        color: "#0f172a",
                        borderRadius: "8px"
                      }}
                      labelStyle={{ color: "#0f172a" }}
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                    />
                    <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2.5} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">68% of monthly target reached</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                    RM 5.8k / RM 8.5k
                  </span>
                </div>
                <Progress value={68} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white/90 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">By Category</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-300">Spend vs. limits for key categories.</p>
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
                      contentStyle={{ 
                        backgroundColor: "#ffffff", 
                        border: "1px solid #e2e8f0", 
                        color: "#0f172a",
                        borderRadius: "8px"
                      }}
                      labelStyle={{ color: "#0f172a" }}
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {categories.map((cat) => {
                const usedPct = Math.min((cat.value / cat.limit) * 100, 100)
                return (
                  <div key={cat.name} className="space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-900 dark:text-white">{cat.name}</span>
                      <span className="text-slate-600 dark:text-slate-200">
                        RM {cat.value} / {cat.limit}
                      </span>
                    </div>
                    <Progress value={usedPct} />
                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                      <span>{usedPct.toFixed(1)}% used</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                        RM {(cat.limit - cat.value).toFixed(0)} left
                      </span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-slate-200 bg-white/90 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-lg text-slate-900 dark:text-white">Alerts</CardTitle>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                {alerts.length} items
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Quick flags and positives on your recent activity.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {alert.tone === "warn" ? (
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500 dark:text-amber-400" />
                ) : (
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                )}
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{alert.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{alert.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
