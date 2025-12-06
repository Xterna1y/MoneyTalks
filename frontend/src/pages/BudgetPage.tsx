"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { fetchBudgets, createOrUpdateBudget, DEFAULT_USER_ID } from "@/lib/api"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Target,
  Wallet
} from "lucide-react"
import { cn } from "@/lib/utils"

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

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalLimit - totalSpent
  const percentUsed = totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0

  const chartData =
    budgets.length > 0
      ? budgets.map((b) => ({
          name: b.category.length > 10 ? b.category.substring(0, 10) + "..." : b.category,
          Limit: b.limit,
          Spent: b.spent,
        }))
      : []

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-emerald-500",
      Shopping: "bg-teal-500",
      Transport: "bg-cyan-500",
      Entertainment: "bg-blue-500",
      Utilities: "bg-indigo-500",
    }
    return colors[category] || "bg-slate-500"
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      Food: "🍔",
      Shopping: "🛍️",
      Transport: "🚗",
      Entertainment: "🎬",
      Utilities: "💡",
    }
    return icons[category] || "💰"
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-6 pt-20 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-md space-y-6 pt-8">
          <div className="text-center text-lg text-slate-600 dark:text-slate-400">Loading budgets...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-6 pt-20 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-md space-y-6 pt-8">
          <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
            <CardContent className="p-4">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 p-4 pt-20 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              Monthly Budget
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Track and manage your spending across categories
            </p>
          </div>
          <Link to="/budget/history">
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            >
              <Calendar className="mr-2 h-4 w-4" />
              History
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-emerald-200 bg-white/90 shadow-lg dark:border-emerald-800 dark:bg-slate-800/90">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Budget</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    RM {totalLimit.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                  <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white/90 shadow-lg dark:border-blue-800 dark:bg-slate-800/90">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Spent</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    RM {totalSpent.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-white/90 shadow-lg dark:border-teal-800 dark:bg-slate-800/90">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Remaining</p>
                  <p className={cn(
                    "mt-1 text-2xl font-bold",
                    totalRemaining >= 0 
                      ? "text-teal-600 dark:text-teal-400" 
                      : "text-red-600 dark:text-red-400"
                  )}>
                    RM {totalRemaining.toFixed(2)}
                  </p>
                </div>
                <div className={cn(
                  "rounded-full p-3",
                  totalRemaining >= 0 
                    ? "bg-teal-100 dark:bg-teal-900/30" 
                    : "bg-red-100 dark:bg-red-900/30"
                )}>
                  {totalRemaining >= 0 ? (
                    <CheckCircle2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="border-slate-200 bg-white/90 shadow-lg dark:border-slate-700 dark:bg-slate-800/90">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Overall Budget Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-300">
                {percentUsed.toFixed(1)}% of budget used
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                RM {totalSpent.toFixed(2)} / RM {totalLimit.toFixed(2)}
              </span>
            </div>
            <Progress 
              value={percentUsed} 
              className="h-3"
            />
            {percentUsed > 90 && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                <AlertCircle className="h-4 w-4" />
                <span>You're approaching your budget limit!</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="border-slate-200 bg-white/90 shadow-lg dark:border-slate-700 dark:bg-slate-800/90">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    className="dark:stroke-slate-400"
                    tick={{ fill: "#64748b" }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    className="dark:stroke-slate-400"
                    tick={{ fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    itemStyle={{ color: "#0f172a" }}
                    className="dark:bg-slate-800 dark:border-slate-700"
                  />
                  <Legend />
                  <Bar dataKey="Limit" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Spent" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-600 dark:text-slate-400">
                <Target className="mb-2 h-12 w-12 opacity-50" />
                <p className="text-center">No budgets to display. Create a budget below!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Update Budget Form */}
        <Card className="border-slate-200 bg-white/90 shadow-lg dark:border-slate-700 dark:bg-slate-800/90">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              {selectedCategory ? "Update Budget" : "Create New Budget"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all ring-emerald-500 focus:border-emerald-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-emerald-500"
                >
                  <option value="">Select a category</option>
                  <option value="Food">🍔 Food</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Transport">🚗 Transport</option>
                  <option value="Entertainment">🎬 Entertainment</option>
                  <option value="Utilities">💡 Utilities</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Limit (RM)</label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all ring-emerald-500 focus:border-emerald-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-emerald-500"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <Button 
                type="submit" 
                disabled={saving || !selectedCategory || !limit} 
                className="w-full bg-emerald-600 py-3 text-lg font-semibold hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {selectedCategory ? "Update Budget" : "Create Budget"}
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Category Budgets List */}
        <Card className="border-slate-200 bg-white/90 shadow-lg dark:border-slate-700 dark:bg-slate-800/90">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Category Budgets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.length > 0 ? (
              budgets.map((budget) => {
                const budgetPercent = budget.limit > 0 ? Math.min((budget.spent / budget.limit) * 100, 100) : 0
                const isOverBudget = budgetPercent >= 100
                const isNearLimit = budgetPercent >= 80
                
                return (
                  <div 
                    key={budget.id} 
                    className={cn(
                      "space-y-3 rounded-xl border p-4 transition-all hover:shadow-md",
                      isOverBudget 
                        ? "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-900/10" 
                        : isNearLimit
                        ? "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-900/10"
                        : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full text-2xl",
                          getCategoryColor(budget.category),
                          "bg-opacity-10 dark:bg-opacity-20"
                        )}>
                          {getCategoryIcon(budget.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {budget.category}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {budgetPercent.toFixed(1)}% used
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          RM {budget.spent.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          of RM {budget.limit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress 
                        value={budgetPercent} 
                        className={cn(
                          "h-2",
                          isOverBudget && "bg-red-200 dark:bg-red-900/30",
                          isNearLimit && !isOverBudget && "bg-amber-200 dark:bg-amber-900/30"
                        )}
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className={cn(
                          "flex items-center gap-1",
                          isOverBudget 
                            ? "text-red-600 dark:text-red-400" 
                            : isNearLimit
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-slate-600 dark:text-slate-400"
                        )}>
                          {isOverBudget ? (
                            <>
                              <AlertCircle className="h-3 w-3" />
                              Over budget by RM {Math.abs(budget.remaining).toFixed(2)}
                            </>
                          ) : isNearLimit ? (
                            <>
                              <AlertCircle className="h-3 w-3" />
                              RM {budget.remaining.toFixed(2)} remaining
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              RM {budget.remaining.toFixed(2)} remaining
                            </>
                          )}
                        </span>
                        {isOverBudget && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                            Over Limit
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-700">
                <Target className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">
                  No budgets set yet. Create your first budget above!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

