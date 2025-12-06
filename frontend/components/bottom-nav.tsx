"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mic, LayoutDashboard, PieChart, Settings } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Speak", icon: Mic },
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/budget", label: "Budget", icon: PieChart },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <div className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-4">
      <nav
        className="flex w-full max-w-lg items-center justify-between rounded-full border border-slate-200 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-base font-semibold transition",
                active
                  ? "bg-emerald-100 text-emerald-700 shadow-inner shadow-emerald-200"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  active ? "text-emerald-700" : "text-slate-500"
                )}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
