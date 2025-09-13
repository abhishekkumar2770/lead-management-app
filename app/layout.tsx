import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Lead Manager - Professional Buyer Lead Management",
  description:
    "Comprehensive lead management application for real estate and sales teams. Track buyer information, manage interactions, and close more deals.",
  keywords: "lead management, CRM, real estate, sales, buyer leads, customer management",
  authors: [{ name: "Lead Manager Team" }],
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Lead Manager - Professional Buyer Lead Management",
    description: "Comprehensive lead management application for real estate and sales teams",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading...</p>
              </div>
            </div>
          }
        >
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
