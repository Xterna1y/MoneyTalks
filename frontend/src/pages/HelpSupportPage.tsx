"use client"

import { useState } from "react"
import { ArrowLeft, Phone, Mail, MessageCircle, BookOpen, HelpCircle, FileText, Video, Headphones } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function HelpSupportPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      questions: [
        {
          q: "How do I link my bank account?",
          a: "Go to Settings > Profile & Safety > Accounts section. Click 'Link Bank Account' and follow the instructions to securely connect your account.",
        },
        {
          q: "How do I set up my first budget?",
          a: "Navigate to the Budget page, select a category (Food, Shopping, etc.), enter your monthly limit, and click 'Save Budget'. The system will track your spending automatically.",
        },
        {
          q: "How does voice interaction work?",
          a: "Tap the microphone button on the home screen, speak your question or command, and MoneyTalks will analyze your finances and respond with helpful insights.",
        },
      ],
    },
    {
      id: "transactions",
      title: "Transactions & Spending",
      icon: FileText,
      questions: [
        {
          q: "How are transactions tracked?",
          a: "Transactions are automatically recorded when you make purchases. You can view all transactions in the Activity page, organized by date.",
        },
        {
          q: "Can I manually add a transaction?",
          a: "Yes! Go to Dashboard and click 'Add Expense' to manually record a transaction. This is useful for cash purchases or transactions not automatically detected.",
        },
        {
          q: "How do I categorize a transaction?",
          a: "Transactions are automatically categorized based on the merchant. You can update categories in the transaction details if needed.",
        },
      ],
    },
    {
      id: "budgets",
      title: "Budgets & Limits",
      icon: HelpCircle,
      questions: [
        {
          q: "What happens when I exceed my budget?",
          a: "You'll receive an alert notification when you reach 80% of your budget, and another when you exceed it. Check the Dashboard for budget alerts.",
        },
        {
          q: "Can I change my budget mid-month?",
          a: "Yes, you can update your budget limits at any time from the Budget page. Changes take effect immediately.",
        },
        {
          q: "How are budget calculations done?",
          a: "Budgets are calculated monthly. Spending resets at the start of each month, and you can view your budget history to see past months.",
        },
      ],
    },
    {
      id: "voice-ai",
      title: "Voice AI & Features",
      icon: MessageCircle,
      questions: [
        {
          q: "What can I ask the voice assistant?",
          a: "You can ask about your spending, budget status, recent transactions, financial advice, and more. Try asking 'How much did I spend this week?' or 'What's my groceries budget left?'",
        },
        {
          q: "Is my voice data secure?",
          a: "Yes, all voice interactions are processed securely and your data is encrypted. Voice recordings are not stored permanently.",
        },
        {
          q: "Can I change the voice gender?",
          a: "Yes! Go to Settings > Personalization > Voice preference to choose between male or female voice.",
        },
      ],
    },
  ]

  const supportOptions = [
    {
      title: "Call Support",
      description: "Speak directly with our support team",
      icon: Phone,
      action: "Call +60 1-800-MONEY",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      icon: Mail,
      action: "support@moneytalks.com",
      color: "from-teal-500 to-teal-600",
    },
    {
      title: "Live Chat",
      description: "Chat with us in real-time",
      icon: MessageCircle,
      action: "Start Chat",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      icon: Video,
      action: "View Tutorials",
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-6 pt-20 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-2xl space-y-6 pb-8">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Button
              variant="outline"
              className="flex h-10 w-10 items-center justify-center rounded-xl border-emerald-200 p-0 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/20"
            >
              <ArrowLeft className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            </Button>
          </Link>
          <div className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-2xl dark:from-emerald-700 dark:to-teal-700">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Headphones className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Help &amp; Support</h1>
                <p className="mt-1 text-emerald-100">Get assistance when you need it</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {supportOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card
                key={option.title}
                className="group relative overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-emerald-500/10 dark:to-teal-500/10"></div>
                <CardContent className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${option.color} text-white shadow-lg dark:from-opacity-80 dark:to-opacity-80`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{option.title}</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{option.description}</p>
                      <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{option.action}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <Card className="group relative overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-500/10 dark:to-indigo-500/10"></div>
          <CardHeader className="relative border-b border-blue-100/50 bg-gradient-to-r from-blue-50 to-white dark:border-blue-900/50 dark:from-slate-800 dark:to-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg dark:from-blue-600 dark:to-blue-700">
                <HelpCircle className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Frequently Asked Questions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4 p-6">
            {faqCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.id} className="space-y-3">
                  <button
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-blue-100 bg-gradient-to-r from-blue-50/50 to-white p-4 transition-all duration-200 hover:border-blue-200 hover:shadow-md dark:border-blue-900/50 dark:from-slate-700/50 dark:to-slate-800 dark:hover:border-blue-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{category.title}</span>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400">
                      {selectedCategory === category.id ? "−" : "+"}
                    </span>
                  </button>
                  {selectedCategory === category.id && (
                    <div className="space-y-3 rounded-xl border-2 border-blue-100 bg-white p-4 dark:border-blue-900/50 dark:bg-slate-700">
                      {category.questions.map((faq, idx) => (
                        <div key={idx} className="border-b border-blue-100 pb-3 last:border-0 last:pb-0 dark:border-blue-900/50">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">{faq.q}</h4>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="group relative overflow-hidden border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800 dark:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-red-500/10 dark:to-orange-500/10"></div>
          <CardHeader className="relative border-b border-red-100/50 bg-gradient-to-r from-red-50 to-white dark:border-red-900/50 dark:from-slate-800 dark:to-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                <Phone className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Emergency Support</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4 p-6">
            <div className="rounded-xl border-2 border-red-100 bg-gradient-to-r from-red-50/50 to-white p-4 dark:border-red-900/50 dark:from-slate-700/50 dark:to-slate-800">
              <p className="font-semibold text-slate-900 dark:text-slate-100">24/7 Emergency Hotline</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                For urgent financial issues or account security concerns
              </p>
              <p className="mt-2 text-lg font-bold text-red-600 dark:text-red-400">+60 1-800-EMERGENCY</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

