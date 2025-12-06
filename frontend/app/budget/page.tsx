"use client"

import { useState, useEffect } from "react"
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
import { fetchBudgets, createOrUpdateBudget, DEFAULT_USER_ID } from "@/lib/api"

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [limit, setLimit] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadBudgets() {
      try {
        setLoading(true)
        const data = await fetchBudgets(DEFAULT_USER_ID)
        setBudgets(data)
        setError(null)
      } catch (err) {
        console.error("Error loading budgets:", err)
        setError("Failed to load budgets. Make sure backend is running on http://localhost:3001")
      } finally {
        setLoading(false)
      }
    }
    loadBudgets()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory || !limit) {
      alert("Please select a category and enter a limit")
      return
    }

    try {
      setSaving(true)
      await createOrUpdateBudget(DEFAULT_USER_ID, selectedCategory, parseFloat(limit))
      // Reload budgets
      const data = await fetchBudgets(DEFAULT_USER_ID)
      setBudgets(data)
      setLimit("")
      setSelectedCategory("")
      alert("Budget updated successfully!")
    } catch (err) {
      console.error("Error updating budget:", err)
      alert("Failed to update budget")
    } finally {
      setSaving(false)
    }
  }

  // Calculate totals
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const percentUsed = totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0

  // Chart data
  const chartData = budgets.length > 0
    ? budgets.map((b) => ({
        name: b.category.length > 10 ? b.category.substring(0, 10) + "..." : b.category,
        Limit: b.limit,
        Spent: b.spent,
      }))
    : []

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 text-slate-900">
        <div className="mx-auto max-w-md space-y-6 pt-8">
          <div className="text-center text-lg text-slate-600">Loading budgets...</div>
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
      <div className="mx-auto max-w-md space-y-6 pt-8">
        <h1 className="text-3xl font-bold text-slate-900">Monthly Budget</h1>

        {/* Chart */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Limit vs Spent</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {chartData.length > 0 ? (
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
            ) : (
              <div className="flex h-full items-center justify-center text-slate-600">
                <p>No budgets to display. Create a budget above!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Limit */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Update Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-sm text-slate-700">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-700">Limit (RM)</label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-2"
                  min={0}
                  step="0.01"
                  placeholder="Enter budget limit"
                />
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-600 py-3 text-lg hover:bg-emerald-700"
              >
                {saving ? "Saving..." : "Save Budget"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Budget List */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Your Budgets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {budgets.length > 0 ? (
              budgets.map((budget) => {
                const budgetPercent = budget.limit > 0
                  ? Math.min((budget.spent / budget.limit) * 100, 100)
                  : 0
                return (
                  <div key={budget.id} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{budget.category}</span>
                      <span className="text-sm text-slate-600">
                        RM {budget.spent.toFixed(2)} / RM {budget.limit.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={budgetPercent} />
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{budgetPercent.toFixed(1)}% used</span>
                      <span>RM {budget.remaining.toFixed(2)} remaining</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-slate-600">No budgets set yet. Create one above!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Total Budget Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>{percentUsed.toFixed(1)}% of Total Budget Used</span>
              <span>RM {totalSpent.toFixed(2)} / RM {totalLimit.toFixed(2)}</span>
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
