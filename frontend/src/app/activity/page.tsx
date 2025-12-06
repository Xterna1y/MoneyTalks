"use client"

import { Car, Utensils, ShoppingBag, Coffee } from "lucide-react"
import { Card } from "./../../components/ui/card"

type Transaction = {
  id: string
  title: string
  category: string
  amount: number
  icon: React.ReactNode
}

const todayTransactions: Transaction[] = [
  {
    id: "1",
    title: "7-Eleven",
    category: "Groceries",
    amount: 15.5,
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    id: "2",
    title: "Petronas",
    category: "Petrol",
    amount: 45.0,
    icon: <Car className="h-5 w-5" />,
  },
  {
    id: "3",
    title: "Starbucks",
    category: "Food",
    amount: 12.8,
    icon: <Coffee className="h-5 w-5" />,
  },
]

const yesterdayTransactions: Transaction[] = [
  {
    id: "4",
    title: "KFC",
    category: "Food",
    amount: 28.5,
    icon: <Utensils className="h-5 w-5" />,
  },
  {
    id: "5",
    title: "Tesco",
    category: "Groceries",
    amount: 67.3,
    icon: <ShoppingBag className="h-5 w-5" />,
  },
]

function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {/* Avatar */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        {transaction.icon}
      </div>

      {/* Transaction Info */}
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-medium text-slate-900">{transaction.title}</p>
        <p className="text-sm text-slate-600">{transaction.category}</p>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p className="font-semibold text-red-500">
          - RM {transaction.amount.toFixed(2)}
        </p>
      </div>
    </div>
  )
}

function TransactionGroup({
  title,
  transactions,
}: {
  title: string
  transactions: Transaction[]
}) {
  return (
    <div className="space-y-2">
      <h2 className="px-1 text-sm font-semibold text-slate-600">{title}</h2>
      <Card className="border-slate-200 bg-white shadow-md">
        <div className="divide-y divide-slate-200">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </Card>
    </div>
  )
}

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="pt-8">
          <h1 className="text-3xl font-bold text-slate-900">Activity</h1>
        </div>

        {/* Transaction Groups */}
        <div className="space-y-4">
          <TransactionGroup title="Today" transactions={todayTransactions} />
          <TransactionGroup
            title="Yesterday"
            transactions={yesterdayTransactions}
          />
        </div>
      </div>
    </div>
  )
}
