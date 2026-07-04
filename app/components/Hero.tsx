"use client"

import { useEffect, useRef, useState } from "react"
import CountUp from "./CountUp"
import ParticleLogo from "./ParticleLogo"

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export default function Hero() {
  const [progress, setProgress] = useState(0)
  const tiltRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const p = clamp(window.scrollY / (window.innerHeight * 0.7), 0, 1)
        setProgress(p)
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // 鼠标晃动时文案轻微 3D 视差（幅度很小，保持可读）
  useEffect(() => {
    const el = tiltRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      tx = -ny * 7
      ty = nx * 7
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `rotateX(${tx.toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg)`
      })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  // 向下滑动：标志逐渐放大并淡出，仿佛穿越进入
  const logoScale = 1 + progress * 2.4
  const logoOpacity = clamp(1 - progress * 1.5, 0, 1)
  // 文案随之上移淡出，让位给下一屏
  const contentOpacity = clamp(1 - progress * 1.4, 0, 1)
  const contentShift = -progress * 60

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[560px] flex items-center justify-center bg-white overflow-hidden"
    >
      {/* 背景网格 */}
      <div className="absolute inset-0 opacity-[0.04] animate-gridDrift pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* 径向光晕，增强纵深 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(0,0,0,0.05) 0%, transparent 55%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.06) 0%, transparent 60%)",
        }}
      />

      {/* 漂浮装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 border border-black opacity-20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 border border-black opacity-15 animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-black opacity-30 animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-1 bg-black opacity-10 rotate-12"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 border border-black opacity-10 rotate-45"></div>
      </div>

      {/* 粒子标志：居中背景层，粒子从四面八方汇聚成 Logo；向下滑动时放大淡出 */}
      <div
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
        style={{ transform: `scale(${logoScale})`, opacity: logoOpacity, transition: "none" }}
        aria-hidden="true"
      >
        <ParticleLogo />
      </div>

      {/* 主内容：位于地球之上，文案凸显 */}
      <div
        className="relative z-10 text-center max-w-6xl mx-auto px-6 flex flex-col items-center will-change-transform"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${contentShift}px)`,
          transition: "none",
          perspective: "1200px",
        }}
      >
        {/* 文案后方白色光晕，确保在地球上清晰可读 */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[90%] pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 45%, transparent 78%)",
          }}
          aria-hidden="true"
        />

        <div
          ref={tiltRef}
          className="relative flex flex-col items-center w-full"
          style={{ transition: "transform 0.2s ease-out", transformStyle: "preserve-3d" }}
        >
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-wider mb-2 sm:mb-4 font-mono animate-heroReveal"
          style={{ animationDelay: "0.15s", textShadow: "0 4px 40px rgba(255,255,255,0.95)" }}
        >
          Lian<span className="font-bold">shang</span>
        </h1>

        <div
          className="text-xl sm:text-3xl font-light tracking-wider mb-4 sm:mb-6 font-mono shimmer-text leading-relaxed animate-heroReveal"
          style={{ animationDelay: "0.3s" }}
        >
          恋殇
        </div>

        <div
          className="w-32 sm:w-40 h-px bg-black mx-auto mb-4 sm:mb-6 relative animate-lineExpand"
          style={{ animationDelay: "0.45s" }}
        >
          <div className="absolute left-0 top-0 h-full bg-black animate-pulse" style={{ width: "100%" }}></div>
        </div>

        <p
          className="text-lg sm:text-2xl font-light tracking-wide text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 animate-heroReveal"
          style={{ animationDelay: "0.55s", textShadow: "0 2px 24px rgba(255,255,255,0.95)" }}
        >
          个人作品集/在线简历
          <br />
          <span className="font-mono text-xs md:text-sm mt-4 sm:mt-9 block text-gray-600">
            平面设计 • 拍摄/制片/编导 • 游戏策划/PM • 桌面运维/采购
          </span>
        </p>

        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto w-full animate-heroReveal"
          style={{ animationDelay: "0.7s" }}
        >
          <div className="text-center group">
            <div className="text-3xl font-mono font-bold group-hover:scale-110 transition-transform">
              <CountUp end={3} suffix="+" />
            </div>
            <div className="text-xs text-gray-500 font-mono">年经验</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-mono font-bold group-hover:scale-110 transition-transform">
              <CountUp end={40} suffix="+" />
            </div>
            <div className="text-xs text-gray-500 font-mono">作品</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-mono font-bold group-hover:scale-110 transition-transform">
              <CountUp end={4600} suffix="+" />
            </div>
            <div className="text-xs text-gray-500 font-mono">合作/服务用户</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-mono font-bold group-hover:scale-110 transition-transform">
              <CountUp end={100} suffix="%" />
            </div>
            <div className="text-xs text-gray-500 font-mono">及时/准时率</div>
          </div>
        </div>
        </div>
      </div>

      <button
        onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer z-10"
        style={{ opacity: contentOpacity }}
        aria-label="向下滑动了解更多"
      >
        <span className="hidden sm:block text-xs font-mono tracking-[0.25em] text-gray-500 group-hover:text-black transition-colors">
          向下滑动了解更多
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-black animate-bounce"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  )
}
