"use client"

import { useEffect, useState } from "react"
import CountUp from "./CountUp"
import ParticleGlobe from "./ParticleGlobe"

export default function Hero() {
  const [pulseScale, setPulseScale] = useState(1)

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseScale((prev) => (prev === 1 ? 1.03 : 1))
    }, 3000)

    return () => {
      clearInterval(pulseInterval)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[560px] flex items-center justify-center bg-white overflow-hidden"
    >
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

      {/* radial spotlight vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(0,0,0,0.05) 0%, transparent 55%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 border border-black opacity-20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 border border-black opacity-15 animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-black opacity-30 animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-1 bg-black opacity-10 rotate-12"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 border border-black opacity-10 rotate-45"></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center gap-0">
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div
            className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72"
            style={{ transform: `scale(${pulseScale})`, transition: "transform 3s ease-in-out" }}
          >
            <ParticleGlobe />

            <div
              className="absolute inset-0 border border-gray-300 rounded-full opacity-10 animate-spin"
              style={{ animationDuration: "30s" }}
            ></div>
            <div
              className="absolute inset-8 border border-gray-400 rounded-full opacity-[0.12] animate-spin"
              style={{ animationDuration: "20s", animationDirection: "reverse" }}
            ></div>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-wider mb-2 sm:mb-4 font-mono">
            Lian<span className="font-bold">shang</span>
          </h1>
          <div className="text-xl sm:text-3xl font-light tracking-wider mb-4 sm:mb-6 font-mono shimmer-text leading-relaxed">恋殇</div>
          <div className="w-32 sm:w-40 h-px bg-black mx-auto mb-4 sm:mb-6 relative animate-lineExpand">
            <div className="absolute left-0 top-0 h-full bg-black animate-pulse" style={{ width: "100%" }}></div>
          </div>
          <p className="text-lg sm:text-2xl font-light tracking-wide text-gray-600 max-w-3xl mx-auto leading-relaxed">
            个人作品集/在线简历
            <br />
            <span className="font-mono text-xs md:text-sm mt-4 sm:mt-9 block">平面设计 • 拍摄/制片/编导 • 游戏策划/PM • 桌面运维/采购</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto w-full">
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

      <button
        onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer"
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
