import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Lianshang · 恋殇 - 个人创作作品集",
  description: "Lianshang（恋殇）的个人作品集，专注平面设计、摄影与游戏策划。",
  keywords: "作品集, 平面设计, 摄影, 游戏策划, 恋殇, Lianshang, 设计师",
  authors: [{ name: "Lianshang" }],
  robots: "index, follow",
  openGraph: {
    title: "Lianshang · 恋殇 - 个人创作作品集",
    description: "专注平面设计、摄影与游戏策划的个人作品集",
    type: "website",
    locale: "zh_CN",
    siteName: "Lianshang",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lianshang · 恋殇 - 个人创作作品集",
    description: "专注平面设计、摄影与游戏策划的个人作品集",
  },
  generator: 'v0.app'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable} bg-white`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
