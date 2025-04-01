import "./globals.css"

import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PDF Converter",
  description: "Convert HTML and URLs to PDF",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex flex-col flex-grow">{children}</main>
            </div>
          </AuthProvider>

          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
