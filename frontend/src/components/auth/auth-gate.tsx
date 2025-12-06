"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const publicRoutes = ["/login", "/onboarding"]

export function AuthGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const isPublic = publicRoutes.some((route) => pathname.startsWith(route))

    if (isPublic) {
      setReady(true)
      return
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null

    if (!token) {
      navigate("/login", { replace: true })
      return
    }

    setReady(true)
  }, [pathname, navigate])

  if (!ready) return null

  return <>{children}</>
}

