"use client"

import { useEffect, useState, useRef } from "react"

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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    const particles: Array<{ x: number; y: number; vx: number; vy: number; opacity: number }> = []

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.fillStyle = `rgba(0, 0, 0, ${particle.opacity})`
        ctx.fillRect(particle.x, particle.y, 1, 1)
      })

      requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />

      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 border border-black opacity-20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 border border-black opacity-15 animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-black opacity-30 animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-1 bg-black opacity-10 rotate-12"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 border border-black opacity-10 rotate-45"></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 pt-28 pb-32 flex flex-col items-center">
        <div className="mb-8 flex justify-center">
          <div className="relative w-56 h-56 md:w-72 md:h-72" style={{ transform: `scale(${pulseScale})` }}>
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

        <div className="mb-10">
          <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-4 font-mono">
            Lian<span className="font-bold">shang</span>
          </h1>
          <div className="text-2xl md:text-3xl font-light tracking-[0.3em] mb-6 font-mono">恋 殇</div>
          <div className="w-40 h-px bg-black mx-auto mb-6 relative">
            <div className="absolute left-0 top-0 h-full bg-black animate-pulse" style={{ width: "100%" }}></div>
          </div>
          <p className="text-xl md:text-2xl font-light tracking-wide text-gray-600 max-w-3xl mx-auto leading-relaxed">
            个人创作作品集
            <br />
            <span className="font-mono text-base md:text-lg">平面设计 • 摄影 • 游戏策划</span>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm font-mono mb-12">
          <div className="flex items-center space-x-2 group">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <span className="group-hover:text-gray-600 transition-colors">接单中</span>
          </div>
          <div className="flex items-center space-x-2 group">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="group-hover:text-gray-600 transition-colors">平面设计</span>
          </div>
          <div className="flex items-center space-x-2 group">
            <div className="w-2 h-2 bg-black rounded-full animate-ping"></div>
            <span className="group-hover:text-gray-600 transition-colors">摄影</span>
          </div>
          <div className="flex items-center space-x-2 group">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <span className="group-hover:text-gray-600 transition-colors">游戏策划</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold">5+</div>
            <div className="text-xs text-gray-500 font-mono">年经验</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold">120+</div>
            <div className="text-xs text-gray-500 font-mono">作品</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold">60+</div>
            <div className="text-xs text-gray-500 font-mono">合作客户</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold">100%</div>
            <div className="text-xs text-gray-500 font-mono">好评率</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group cursor-pointer"
        aria-label="向下滑动了解更多"
      >
        <span className="text-xs font-mono tracking-[0.25em] text-gray-500 group-hover:text-black transition-colors">
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
