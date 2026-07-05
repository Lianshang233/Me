"use client"

import { useEffect, useRef } from "react"

/**
 * 顶部 2px 阅读进度线。
 * 被动 scroll + rAF 节流 + 命令式 scaleX（零 React 重渲染、零布局，合成器直通）。
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    let ticking = false
    let last = -1

    const update = () => {
      ticking = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (Math.abs(p - last) < 0.001) return
      last = p
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        raf = requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[60] pointer-events-none" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full w-full bg-black origin-left will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  )
}
