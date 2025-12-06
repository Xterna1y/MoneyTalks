import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { getTheme, setTheme } from "@/lib/theme"

type ThemeVariant = "tabs" | "dropdown"
type ThemeSize = "sm" | "md" | "lg"
type ThemeValue = "light" | "dark" | "system"

interface ThemeProps {
  variant?: ThemeVariant
  size?: ThemeSize
  showLabel?: boolean
  themes?: ThemeValue[]
  className?: string
}

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const themeLabels = {
  light: "Light",
  dark: "Dark",
  system: "System",
}

export function Theme({
  variant = "tabs",
  size = "md",
  showLabel = false,
  themes = ["light", "dark", "system"],
  className,
}: ThemeProps) {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeValue>(getTheme())

  React.useEffect(() => {
    // Sync with global theme
    setCurrentTheme(getTheme())
  }, [])

  const handleThemeChange = (theme: ThemeValue) => {
    setCurrentTheme(theme)
    setTheme(theme)
    // Update body classes
    const isDark = document.documentElement.classList.contains("dark")
    document.body.className = `pb-[calc(6rem+env(safe-area-inset-bottom))] text-lg leading-relaxed bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 ${
      isDark ? "dark" : ""
    }`
  }

  const sizeClasses = {
    sm: "h-8 px-2 text-xs",
    md: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  if (variant === "tabs") {
    return (
      <div className={cn("inline-flex rounded-lg border border-emerald-200 bg-white p-1 dark:border-emerald-800 dark:bg-slate-700", className)}>
        {themes.map((theme) => {
          const Icon = themeIcons[theme]
          const isActive = currentTheme === theme
          return (
            <button
              key={theme}
              onClick={() => handleThemeChange(theme)}
              className={cn(
                "inline-flex items-center gap-2 rounded-md transition-all duration-200",
                sizeClasses[size],
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md dark:from-emerald-600 dark:to-emerald-700"
                  : "text-slate-700 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-emerald-900/20"
              )}
              aria-label={`Switch to ${themeLabels[theme]} theme`}
            >
              <Icon className={iconSizes[size]} />
              {showLabel && <span>{themeLabels[theme]}</span>}
            </button>
          )
        })}
      </div>
    )
  }

  // Dropdown variant (for future use)
  return null
}

