"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  className?: string
  /** delay in ms for stagger effect */
  delay?: number
  /** translate direction on enter */
  direction?: "up" | "down" | "left" | "right" | "none"
  as?: "div" | "section" | "li" | "span"
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const offset = {
    up: "translateY(30px)",
    down: "translateY(-30px)",
    left: "translateX(30px)",
    right: "translateX(-30px)",
    none: "translateY(0)",
  }[direction]

  const Tag = as as any

  // 与首页 heroReveal 一致的"模糊 + 上浮 + 微缩放"入场
  return (
    <Tag
      ref={ref}
      style={{
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "900ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0) scale(1)" : `${offset} translateZ(0) scale(0.97)`,
        filter: visible ? "blur(0px)" : "blur(6px)",
        // 提升到稳定的 GPU 合成层，避免 blur 每帧在主线程离散重绘导致的"分级跳变"
        willChange: "opacity, transform, filter",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      className={className}
    >
      {children}
    </Tag>
  )
}
