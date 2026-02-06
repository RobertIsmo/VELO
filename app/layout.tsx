import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { Nav } from "@/components/nav"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VELO - Collaborative Power Scaling",
  description:
    "Rate and rank fictional characters with the community using Elo-based matchups.",
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.className} bg-background text-foreground antialiased`}
      >
        <Nav />
        {children}
      </body>
    </html>
  )
}
