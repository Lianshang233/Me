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
  title: "NexoraSIM™ - AI 驱动的 eSIM 与物联网平台 | 缅甸",
  description:
    "面向缅甸的符合 GSMA 标准的 eSIM 与物联网连接平台。由 AI 驱动的先进解决方案，覆盖全球，基于 Vercel 基础设施。",
  keywords: "eSIM, 物联网, 缅甸, GSMA, AI, 连接, 电信, Vercel, 边缘计算, SGP.22",
  authors: [{ name: "NexoraSIM" }],
  robots: "index, follow",
  openGraph: {
    title: "NexoraSIM™ - AI 驱动的 eSIM 与物联网平台",
    description: "面向缅甸的符合 GSMA 标准的 eSIM 与物联网连接平台",
    type: "website",
    locale: "zh_CN",
    siteName: "NexoraSIM",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexoraSIM™ - AI 驱动的 eSIM 与物联网平台",
    description: "面向缅甸的符合 GSMA 标准的 eSIM 与物联网连接平台",
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
