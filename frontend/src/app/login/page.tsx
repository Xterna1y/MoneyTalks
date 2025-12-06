"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { z } from "zod"

import { Button } from "./../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../../components/ui/card"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isFirstTimeUser = true // Mocked flag; replace with real auth check later

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginForm) => {
    setIsSubmitting(true)
    // Simulate an auth request
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock token persistence so refreshes stay behind auth
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", "demo-token")
    }

    if (isFirstTimeUser) {
      navigate("/onboarding")
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900 px-4 py-12 text-slate-100">
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-slate-800 bg-slate-900/70 text-slate-100 shadow-2xl backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-bold text-white">
                Welcome back
              </CardTitle>
              <CardDescription className="text-lg text-slate-300">
                We’ll keep your money story organized while you focus on what
                matters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">
                    Email
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-emerald-300">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">
                    Password
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-emerald-300">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full bg-emerald-500 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  {isSubmitting ? "Signing you in..." : "Log In"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-300">
                New here?{" "}
                <Link
                  to="/onboarding"
                  className="font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  Create Account
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}

