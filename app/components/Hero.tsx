"use client"

import { useEffect, useState, useRef } from "react"
import CountUp from "./CountUp"

export default function Hero() {
  const [rotation, setRotation] = useState(0)
  const [pulseScale, setPulseScale] = useState(1)
  const [connectionNodes, setConnectionNodes] = useState<Array<{ x: number; y: number; active: boolean }>>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const nodes = [
      { x: 80, y: 100, active: false },
      { x: 240, y: 120, active: false },
      { x: 120, y: 220, active: false },
      { x: 200, y: 200, active: false },
      { x: 160, y: 80, active: false },
      { x: 280, y: 180, active: false },
    ]
    setConnectionNodes(nodes)

    const rotationInterval = setInterval(() => {
      setRotation((prev) => prev + 0.2)
    }, 50)

    const pulseInterval = setInterval(() => {
      setPulseScale((prev) => (prev === 1 ? 1.03 : 1))
    }, 3000)

    const nodeInterval = setInterval(() => {
      setConnectionNodes((prev) =>
        prev.map((node) => ({
          ...node,
          active: Math.random() > 0.8,
        })),
      )
    }, 2000)

    return () => {
      clearInterval(rotationInterval)
      clearInterval(pulseInterval)
      clearInterval(nodeInterval)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const isMobile = () => window.innerWidth < 768
    const mouse = { x: -9999, y: -9999 }

    type P = { x: number; y: number; vx: number; vy: number; r: number }
    let particles: P[] = []

    const buildParticles = () => {
      const count = isMobile() ? 42 : 84
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.6,
      }))
    }

    const resizeCanvas = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildParticles()
    }

    resizeCanvas()

    const linkDist = () => (isMobile() ? 95 : 140)
    const mouseDist = 170

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      const maxDist = linkDist()

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // subtle attraction toward cursor for an interactive tech feel
        const mdx = mouse.x - p.x
        const mdy = mouse.y - p.y
        const md = Math.hypot(mdx, mdy)
        if (md < mouseDist && md > 0.001) {
          const pull = (1 - md / mouseDist) * 0.04
          p.vx += (mdx / md) * pull
          p.vy += (mdy / md) * pull
        }
        // damping to keep speeds calm
        p.vx = Math.max(-0.8, Math.min(0.8, p.vx * 0.99))
        p.vy = Math.max(-0.8, Math.min(0.8, p.vy * 0.99))

        // connect to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.hypot(dx, dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18
            ctx.strokeStyle = `rgba(0,0,0,${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        // connect to cursor
        if (md < mouseDist) {
          const alpha = (1 - md / mouseDist) * 0.35
          ctx.strokeStyle = `rgba(0,0,0,${alpha})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }

        ctx.fillStyle = "rgba(0,0,0,0.55)"
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    const rafRef = { current: 0 as number }
    if (!prefersReduced) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      // draw a single static frame
      ctx.fillStyle = "rgba(0,0,0,0.4)"
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseout", handleMouseLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseout", handleMouseLeave)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[560px] flex items-center justify-center bg-white overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-40 pointer-events-none" />

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
            className="relative w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64"
            style={{ transform: `scale(${pulseScale})` }}
          >
            <svg
              viewBox="0 0 384 384"
              className="absolute inset-0 w-full h-full"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <pattern id="worldMap" patternUnits="userSpaceOnUse" width="384" height="384">
                  <path
                    d="M100 150 Q120 140 140 150 Q160 160 180 150 Q200 140 220 150"
                    fill="none"
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <path
                    d="M80 200 Q100 190 120 200 Q140 210 160 200"
                    fill="none"
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.2"
                  />
                </pattern>
              </defs>

              <circle
                cx="192"
                cy="192"
                r="180"
                fill="none"
                stroke="#000"
                strokeWidth="1"
                opacity="0.4"
                filter="url(#glow)"
              />

              <circle cx="192" cy="192" r="150" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
              <circle cx="192" cy="192" r="120" fill="none" stroke="#000" strokeWidth="1" opacity="0.2" />
              <circle cx="192" cy="192" r="90" fill="none" stroke="#000" strokeWidth="1" opacity="0.15" />
              <circle cx="192" cy="192" r="60" fill="none" stroke="#000" strokeWidth="1" opacity="0.1" />

              <path d="M 192 12 Q 192 192 192 372" fill="none" stroke="#000" strokeWidth="1" opacity="0.4" />
              <path d="M 192 12 Q 120 192 192 372" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
              <path d="M 192 12 Q 264 192 192 372" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
              <path d="M 192 12 Q 156 192 192 372" fill="none" stroke="#000" strokeWidth="1" opacity="0.2" />
              <path d="M 192 12 Q 228 192 192 372" fill="none" stroke="#000" strokeWidth="1" opacity="0.2" />

              <ellipse cx="192" cy="192" rx="180" ry="60" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
              <ellipse cx="192" cy="192" rx="180" ry="120" fill="none" stroke="#000" strokeWidth="1" opacity="0.2" />
              <ellipse cx="192" cy="192" rx="150" ry="40" fill="none" stroke="#000" strokeWidth="1" opacity="0.2" />

              {connectionNodes.map((node, index) => (
                <g key={index}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.active ? "4" : "2"}
                    fill="#000"
                    opacity={node.active ? "0.9" : "0.5"}
                  />
                  {node.active && (
                    <circle cx={node.x} cy={node.y} r="8" fill="none" stroke="#000" strokeWidth="1" opacity="0.4">
                      <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              ))}

              <line x1="100" y1="120" x2="280" y2="140" stroke="#000" strokeWidth="1" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="140" y1="260" x2="240" y2="240" stroke="#000" strokeWidth="1" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2.5s" repeatCount="indefinite" />
              </line>
              <line x1="192" y1="100" x2="320" y2="220" stroke="#000" strokeWidth="1" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" />
              </line>

              <circle cx="100" cy="120" r="1" fill="#000">
                <animateMotion dur="3s" repeatCount="indefinite">
                  <path d="M 0 0 L 180 20 L 140 140" />
                </animateMotion>
              </circle>
              <circle cx="280" cy="140" r="1" fill="#000">
                <animateMotion dur="4s" repeatCount="indefinite">
                  <path d="M 0 0 L -140 100 L -40 -40" />
                </animateMotion>
              </circle>
            </svg>

            <div
              className="absolute inset-0 border border-gray-300 rounded-full opacity-10 animate-spin"
              style={{ animationDuration: "30s" }}
            ></div>
            <div
              className="absolute inset-8 border border-gray-400 rounded-full opacity-15 animate-spin"
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
