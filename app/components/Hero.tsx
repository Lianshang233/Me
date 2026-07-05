"use client"

import { useCallback, useEffect, useRef } from "react"
import CountUp from "./CountUp"
import ParticleLogo from "./ParticleLogo"

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export default function Hero() {
  const tiltRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const logoWrapRef = useRef<HTMLDivElement>(null)
  const contentWrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 命令式应用"穿越"进度：直接改 DOM 样式，滚动时完全不触发 React 重渲染，
  // 这是消除移动端上滑永久卡顿的关键（refs 稳定，useCallback 依赖为空安全）。
  const applyProgress = useCallback((p: number) => {
    const logoScale = 1 + p * 2.4
    const logoOpacity = clamp(1 - p * 1.5, 0, 1)
    const contentOpacity = clamp(1 - p * 1.4, 0, 1)
    const contentShift = -p * 60
    if (logoWrapRef.current) {
      logoWrapRef.current.style.transform = `scale(${logoScale})`
      logoWrapRef.current.style.opacity = String(logoOpacity)
    }
    if (contentWrapRef.current) {
      contentWrapRef.current.style.opacity = String(contentOpacity)
      contentWrapRef.current.style.transform = `translateY(${contentShift}px)`
    }
    if (buttonRef.current) buttonRef.current.style.opacity = String(contentOpacity)
  }, [])

  // 主页首屏：阻尼滚动 —— 在顶部时劫持滚轮/触摸，把滚动意图累积为带阻力的进度，
  // 越过阈值后自动吸附滑入下一屏（Features）。其余区域保持原生滚动，此效果仅首屏有。
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    let raf = 0
    let lastP = -1
    // 只在进度真正变化时写 DOM（用 rAF 批处理），避免滚动时的无谓布局写入
    const setP = (v: number) => {
      if (Math.abs(v - lastP) < 0.002) return
      lastP = v
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => applyProgress(v))
    }

    // 移动端（粗指针）：完全不劫持触摸，使用被动 scroll 把滚动位置映射为进度。
    // 命令式改样式 + 去重，滚动全程零 React 重渲染、走合成器线程，上滑/下滑都零卡顿。
    const coarse = window.matchMedia("(pointer: coarse)").matches
    if (coarse) {
      const vhFactor = () => window.innerHeight * 0.7
      const onScrollMobile = () => {
        const y = window.scrollY
        // 滚出首屏范围后进度恒为 1，setP 的去重会直接跳过，杜绝无谓写入
        setP(y >= vhFactor() ? 1 : clamp(y / vhFactor(), 0, 1))
      }
      onScrollMobile()
      window.addEventListener("scroll", onScrollMobile, { passive: true })
      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener("scroll", onScrollMobile)
      }
    }

    // 桌面（滚轮）：阻尼滚动 —— 顶部时累积滚动意图，过阈值吸附滑入下一屏。
    const THRESHOLD = 420 // 需要累积的滚动量，越大越"重"
    let intent = 0
    let released = false // 是否已吸附进入下一屏
    let locked = false // 吸附动画进行中，锁定输入

    const atTop = () => window.scrollY <= 2

    const snap = () => {
      if (locked) return
      locked = true
      released = true
      intent = 0
      setP(1)
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
      window.setTimeout(() => {
        locked = false
      }, 750)
    }

    const rearm = () => {
      released = false
      intent = 0
      setP(0)
    }

    const accumulate = (delta: number): boolean => {
      if (locked) return true
      if (released || !atTop()) return false
      if (delta > 0) {
        intent += delta
        const p = clamp(intent / THRESHOLD, 0, 1)
        setP(p)
        if (p >= 1) snap()
        return true
      }
      if (delta < 0) {
        intent = Math.max(0, intent + delta)
        setP(clamp(intent / THRESHOLD, 0, 1))
      }
      return false
    }

    const onWheel = (e: WheelEvent) => {
      if (accumulate(e.deltaY)) e.preventDefault()
    }
    const onScroll = () => {
      if (released && atTop() && !locked) rearm()
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("wheel", onWheel)
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

  // 移动端陀螺仪感应：设备倾斜时，首屏内容与光晕做轻微 3D 视差摆动
  useEffect(() => {
    const el = tiltRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!window.matchMedia("(pointer: coarse)").matches) return
    if (typeof window.DeviceOrientationEvent === "undefined") return

    let raf = 0
    let baseBeta: number | null = null // 以初次朝向为基准，避免持握角度造成偏移
    let baseGamma: number | null = null

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return
      if (baseBeta === null) {
        baseBeta = e.beta
        baseGamma = e.gamma
      }
      const db = clamp(e.beta - baseBeta, -22, 22) // 前后倾
      const dg = clamp(e.gamma - (baseGamma ?? 0), -22, 22) // 左右倾
      const rx = (db / 22) * 6
      const ry = (dg / 22) * 6
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `rotateX(${(-rx).toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      })
    }

    const enable = () => window.addEventListener("deviceorientation", onOrient)

    // iOS 13+ 需在用户手势中申请权限；借用页面首次触摸作为手势
    const req = (window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
      .requestPermission
    let onFirstTouch: (() => void) | null = null
    if (typeof req === "function") {
      onFirstTouch = () => {
        req()
          .then((state) => {
            if (state === "granted") enable()
          })
          .catch(() => {})
      }
      window.addEventListener("touchend", onFirstTouch, { once: true })
    } else {
      enable()
    }

    return () => {
      window.removeEventListener("deviceorientation", onOrient)
      if (onFirstTouch) window.removeEventListener("touchend", onFirstTouch)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[100svh] min-h-[560px] flex items-center justify-center bg-white overflow-hidden"
    >
      {/* 背景网格（transform 平移漂移，纯合成器，移动端安全） */}
      <div className="absolute inset-0 opacity-[0.04] overflow-hidden pointer-events-none">
        <div
          className="absolute animate-gridDrift"
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

      {/* 漂浮装饰（pulse/bounce/ping 均为 transform/opacity 动画，合成器直通） */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 border border-black opacity-20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 border border-black opacity-15 animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-black opacity-30 animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-1 bg-black opacity-10 rotate-12"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 border border-black opacity-10 rotate-45"></div>
      </div>

      {/* 粒子标志：居中背景层，粒子从四面八方汇聚成 Logo；向下滑动时放大淡出 */}
      <div
        ref={logoWrapRef}
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
        style={{
          transform: "scale(1)",
          opacity: 1,
          transition: "transform 0.25s ease-out, opacity 0.25s ease-out",
        }}
        aria-hidden="true"
      >
        <ParticleLogo />
      </div>

      {/* 主内容：位于地球之上，文案凸显 */}
      <div
        ref={contentWrapRef}
        className="relative z-10 text-center max-w-6xl mx-auto px-6 flex flex-col items-center will-change-transform"
        style={{
          opacity: 1,
          transform: "translateY(0px)",
          transition: "transform 0.25s ease-out, opacity 0.25s ease-out",
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
          className="text-xl sm:text-3xl font-light tracking-wider mb-4 sm:mb-6 font-mono leading-relaxed animate-heroReveal"
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
        ref={buttonRef}
        onClick={() => {
          applyProgress(1)
          document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
        }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer z-10"
        style={{ opacity: 1 }}
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
