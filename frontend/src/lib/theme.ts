// Global theme management
// This ensures dark mode applies to the entire app

export function initTheme() {
  // Get theme from localStorage or system preference
  const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
  const root = document.documentElement

  if (savedTheme === "system" || !savedTheme) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    root.classList.toggle("dark", prefersDark)
    if (!savedTheme) {
      localStorage.setItem("theme", "system")
    }
  } else {
    root.classList.toggle("dark", savedTheme === "dark")
  }

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    const currentTheme = localStorage.getItem("theme")
    if (currentTheme === "system" || !currentTheme) {
      root.classList.toggle("dark", e.matches)
    }
  })
}

export function setTheme(theme: "light" | "dark" | "system") {
  const root = document.documentElement
  localStorage.setItem("theme", theme)

  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    root.classList.toggle("dark", prefersDark)
  } else {
    root.classList.toggle("dark", theme === "dark")
  }
}

export function getTheme(): "light" | "dark" | "system" {
  return (localStorage.getItem("theme") as "light" | "dark" | "system") || "system"
}

