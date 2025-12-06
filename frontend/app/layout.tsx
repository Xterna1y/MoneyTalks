import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/bottom-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Voice Interface",
  description: "A voice interface application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} pb-[calc(6rem+env(safe-area-inset-bottom))] text-lg leading-relaxed bg-slate-50 text-slate-900`}
      >
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
