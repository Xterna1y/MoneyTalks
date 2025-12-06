"use client"

import { AlertTriangle, Banknote, Link2, PhoneCall, PlusCircle, TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const weeklySpend = [
  { day: "Mon", spent: 95 },
  { day: "Tue", spent: 120 },
  { day: "Wed", spent: 80 },
  { day: "Thu", spent: 140 },
  { day: "Fri", spent: 110 },
  { day: "Sat", spent: 160 },
  { day: "Sun", spent: 90 },
]

const accounts = [
  { name: "Maybank Savings", masked: "••9832", balance: "RM 2,150.00", linked: true },
  { name: "CIMB Debit", masked: "••4471", balance: "RM 820.50", linked: true },
  { name: "Add a bank", masked: "", balance: "Tap to connect", linked: false },
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto flex max-w-md flex-col gap-6 pt-8">
        {/* Totals */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-slate-200 bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-600">Total Balance</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-3xl font-bold text-slate-900">RM 4,250.00</p>
              <p className="text-sm text-emerald-600">+RM 120 today</p>
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

        {/* Weekly spend chart */}
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
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#16a34a"
                  fill="url(#spend)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-600">Recent Alerts</h2>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-semibold text-amber-800">
                  Electric bill is due tomorrow.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">Accounts</CardTitle>
            <Button size="sm" variant="outline" className="gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50">
              <Link2 className="h-4 w-4" />
              Link bank
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {accounts.map((acct, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-slate-900">{acct.name}</p>
                  <p className="text-sm text-slate-600">
                    {acct.linked ? acct.masked : "Securely connect your bank"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{acct.linked ? acct.balance : ""}</p>
                  {!acct.linked && (
                    <Button size="sm" variant="outline" className="mt-1 border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
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
            <Link href="/dashboard/insights" className="col-span-2">
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
