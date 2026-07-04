"use client"

import { useEffect, useRef, useState } from "react"

type CountUpProps = {
  end: number
  suffix?: string
  duration?: number
  className?: string
}

export default function CountUp({ end, suffix = "", duration = 1600, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setValue(end)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const step = (now: number) => {
              const progress = Math.min((now - start) / duration, 1)
              // easeOutCubic
              const eased = 1 - Math.pow(1 - progress, 3)
              setValue(Math.round(eased * end))
              if (progress < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}
