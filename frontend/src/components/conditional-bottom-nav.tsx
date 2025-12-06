"use client"

import { useLocation } from "react-router-dom"
import { BottomNav } from "./bottom-nav"

const hiddenRoutes = ["/login", "/onboarding"]

export function ConditionalBottomNav() {
  const { pathname } = useLocation()

  if (!pathname) return null
  if (hiddenRoutes.some((route) => pathname.startsWith(route))) {
    return null
  }

  return <BottomNav />
}

