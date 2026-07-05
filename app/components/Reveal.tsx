"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

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
  // 动画完成后释放合成层，避免元素长期持有 will-change/filter 拖累移动端滚动
  const [done, setDone] = useState(false)
  // 移动端（粗指针）彻底禁用 blur 过渡：它在移动 GPU 上是最昂贵的操作，
  // 滚动中触发会与合成争抢并造成永久掉帧。仅桌面保留柔焦入场。
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(
      window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    )
  }, [])

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

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setDone(true), 1000)
    return () => clearTimeout(t)
  }, [visible])

  const offset = {
    up: "translateY(30px)",
    down: "translateY(-30px)",
    left: "translateX(30px)",
    right: "translateX(-30px)",
    none: "translateY(0)",
  }[direction]

  const Tag = as as any

  // 桌面：模糊 + 上浮 + 微缩放柔焦入场。移动端：仅 opacity + 位移（纯合成器属性，零重绘）。
  const style: CSSProperties = done
    ? {
        // 动画结束后完全清除任何合成层提示与变换，避免永久占用 GPU 图层
        opacity: 1,
        transform: "none",
        willChange: "auto",
      }
    : mobile
      ? {
          transitionProperty: "opacity, transform",
          transitionDuration: "700ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: `${delay}ms`,
          opacity: visible ? 1 : 0,
          transform: visible ? "translate3d(0,0,0)" : offset,
          willChange: "opacity, transform",
        }
      : {
          transitionProperty: "opacity, transform, filter",
          transitionDuration: "900ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: `${delay}ms`,
          opacity: visible ? 1 : 0,
          transform: visible ? "translate3d(0,0,0) scale(1)" : `${offset} translateZ(0) scale(0.97)`,
          filter: visible ? "blur(0px)" : "blur(6px)",
          willChange: "opacity, transform, filter",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }

  return (
    <Tag ref={ref} style={style} className={className}>
      {children}
    </Tag>
  )
}
