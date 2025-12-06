import { Mic, LayoutDashboard, PieChart, Settings } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/home", label: "Speak", icon: Mic },
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/budget", label: "Budget", icon: PieChart },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function BottomNav() {
  const { pathname } = useLocation()

  const isActive = (href: string) => {
    if (href === "/home") return pathname === "/home"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo/Brand Section */}
        <Link to="/home" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">MoneyTalks</span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                aria-label={item.label}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-out",
                  "hover:scale-105 active:scale-95",
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                )}
              >
                {/* Active indicator background */}
                {active && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-md shadow-emerald-200/50 dark:from-emerald-900/40 dark:to-emerald-900/20 dark:shadow-emerald-900/30" />
                )}

                {/* Icon */}
                <div className={cn(
                  "relative z-10 flex items-center justify-center transition-all duration-300",
                  active 
                    ? "scale-110" 
                    : "group-hover:scale-105"
                )}>
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      active 
                        ? "text-emerald-600 drop-shadow-sm dark:text-emerald-400" 
                        : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300"
                    )}
                  />
                  {/* Active pulse effect */}
                  {active && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
                  )}
                </div>

                {/* Label */}
                <span className={cn(
                  "relative z-10 whitespace-nowrap transition-all duration-300",
                  active
                    ? "text-emerald-700 font-bold dark:text-emerald-300"
                    : "text-slate-600 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200"
                )}>
                  {item.label}
                </span>

                {/* Active bottom indicator */}
                {active && (
                  <div className="absolute -bottom-0.5 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-400/50 dark:from-emerald-400 dark:to-emerald-500" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
