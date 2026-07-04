"use client"

import { useEffect, useRef } from "react"

/**
 * 3D 粒子地球：
 * - 页面加载时粒子从四周散乱状态汇聚成球体
 * - 球体自动缓慢自转
 * - 鼠标移动时球体产生 3D 视差旋转
 * - 纯黑白极简风格，通过景深控制粒子大小与透明度营造 3D 感
 */
export default function ParticleGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let size = 0
    let cx = 0
    let cy = 0
    let radius = 0

    const isMobile = () => window.innerWidth < 768

    type Particle = {
      // 目标：单位球面坐标
      tx: number
      ty: number
      tz: number
      // 起始：散乱坐标
      sx: number
      sy: number
      sz: number
      // 当前坐标
      x: number
      y: number
      z: number
    }

    let particles: Particle[] = []

    const buildParticles = () => {
      const count = isMobile() ? 1100 : 2200
      const gAngle = Math.PI * (1 + Math.sqrt(5)) // 黄金角
      particles = Array.from({ length: count }, (_, i) => {
        // 斐波那契球均匀分布
        const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
        const theta = gAngle * i
        const tx = Math.sin(phi) * Math.cos(theta)
        const ty = Math.sin(phi) * Math.sin(theta)
        const tz = Math.cos(phi)
        // 起始散乱位置（更大范围的随机球体）
        const sr = 2.2 + Math.random() * 1.6
        const sPhi = Math.acos(2 * Math.random() - 1)
        const sTheta = Math.random() * Math.PI * 2
        return {
          tx,
          ty,
          tz,
          sx: sr * Math.sin(sPhi) * Math.cos(sTheta),
          sy: sr * Math.sin(sPhi) * Math.sin(sTheta),
          sz: sr * Math.cos(sPhi),
          x: 0,
          y: 0,
          z: 0,
        }
      })
    }

    const resize = () => {
      size = canvas.clientWidth
      cx = size / 2
      cy = size / 2
      radius = size * 0.42
      canvas.width = size * dpr
      canvas.height = size * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    buildParticles()
    resize()

    // 旋转状态
    let rotY = 0
    let rotX = 0
    let targetRotY = 0
    let targetRotX = 0
    let autoYaw = 0

    // 汇聚进度 0 -> 1
    let progress = 0
    const startTime = performance.now()
    const convergeDuration = 2200

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const fov = 3.2

    const render = () => {
      const now = performance.now()
      progress = Math.min(1, (now - startTime) / convergeDuration)
      const e = easeOutCubic(progress)

      // 平滑跟随鼠标目标旋转
      rotY += (targetRotY - rotY) * 0.06
      rotX += (targetRotX - rotX) * 0.06
      autoYaw += 0.0025

      const yaw = rotY + autoYaw
      const pitch = rotX
      const cosY = Math.cos(yaw)
      const sinY = Math.sin(yaw)
      const cosX = Math.cos(pitch)
      const sinX = Math.sin(pitch)

      ctx.clearRect(0, 0, size, size)

      // 先算屏幕坐标与深度，按深度排序（远的先画）
      const projected: Array<{ sx: number; sy: number; scale: number; depth: number }> = []

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        // 从散乱位置插值到球面位置
        const ux = p.sx + (p.tx - p.sx) * e
        const uy = p.sy + (p.ty - p.sy) * e
        const uz = p.sz + (p.tz - p.sz) * e

        // 绕 Y 轴旋转
        const x1 = ux * cosY - uz * sinY
        const z1 = ux * sinY + uz * cosY
        // 绕 X 轴旋转
        const y2 = uy * cosX - z1 * sinX
        const z2 = uy * sinX + z1 * cosX

        // 透视投影
        const scale = fov / (fov + z2)
        const screenX = cx + x1 * radius * scale
        const screenY = cy + y2 * radius * scale
        projected.push({ sx: screenX, sy: screenY, scale, depth: z2 })
      }

      projected.sort((a, b) => b.depth - a.depth)

      for (let i = 0; i < projected.length; i++) {
        const { sx, sy, scale, depth } = projected[i]
        // 深度归一 (-1 近 -> 1 远)，用于透明度
        const dn = (depth + 1) / 2 // 0 近 -> 1 远
        const alpha = (1 - dn) * 0.75 + 0.12
        const r = Math.max(0.25, scale * 0.95)
        ctx.beginPath()
        ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf.current = requestAnimationFrame(render)
    }

    const raf = { current: 0 as number }
    if (prefersReduced) {
      progress = 1
      render()
      cancelAnimationFrame(raf.current)
    } else {
      raf.current = requestAnimationFrame(render)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      targetRotY = nx * 0.7
      targetRotX = ny * 0.5
    }
    const handleDeviceOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      targetRotY = (e.gamma / 45) * 0.6
      targetRotX = (e.beta / 90) * 0.4
    }

    const handleResize = () => {
      buildParticles()
      resize()
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("deviceorientation", handleDeviceOrient)
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("deviceorientation", handleDeviceOrient)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
