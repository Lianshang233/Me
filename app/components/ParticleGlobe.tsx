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
      // 随机变化因子
      rf: number // 大小随机 0.6 - 1.5
      af: number // 亮度随机 0.7 - 1.25
      tw: number // 闪烁相位
      tws: number // 闪烁速度
    }

    let particles: Particle[] = []

    const buildParticles = () => {
      const count = isMobile() ? 2000 : 4200
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
          rf: 0.6 + Math.random() * 0.9,
          af: 0.7 + Math.random() * 0.55,
          tw: Math.random() * Math.PI * 2,
          tws: 0.6 + Math.random() * 1.8,
        }
      })
    }

    const resize = () => {
      size = canvas.clientWidth
      cx = size / 2
      cy = size / 2
      radius = size * 0.49
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

    // 分桶批量绘制：按透明度量化到若干层，减少 fillStyle 切换与逐帧排序开销
    const BUCKETS = 14
    const bX: number[][] = Array.from({ length: BUCKETS }, () => [])
    const bY: number[][] = Array.from({ length: BUCKETS }, () => [])
    const bR: number[][] = Array.from({ length: BUCKETS }, () => [])
    const bN: number[] = new Array(BUCKETS).fill(0)

    let visible = true

    const render = () => {
      if (!visible) {
        raf.current = 0
        return
      }
      const now = performance.now()
      progress = Math.min(1, (now - startTime) / convergeDuration)
      const e = easeOutCubic(progress)

      // 平滑跟随鼠标目标旋转
      rotY += (targetRotY - rotY) * 0.06
      rotX += (targetRotX - rotX) * 0.06
      autoYaw += 0.001

      const yaw = rotY + autoYaw
      const pitch = rotX
      const cosY = Math.cos(yaw)
      const sinY = Math.sin(yaw)
      const cosX = Math.cos(pitch)
      const sinX = Math.sin(pitch)

      ctx.clearRect(0, 0, size, size)

      // 重置分桶计数（复用数组，避免逐帧分配）
      for (let b = 0; b < BUCKETS; b++) bN[b] = 0

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        // 更新闪烁相位
        p.tw += 0.016 * p.tws
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

        // 深度归一 (-1 近 -> 1 远)，用于透明度
        const dn = (z2 + 1) / 2
        const twinkle = 0.85 + Math.sin(p.tw) * 0.15
        const alpha = Math.min(1, ((1 - dn) * 0.7 + 0.12) * p.af * twinkle)
        const r = Math.max(0.18, scale * 0.62 * p.rf)

        // 按透明度量化到桶（低透明度桶先画，近似由远及近）
        let b = (alpha * (BUCKETS - 1)) | 0
        if (b < 0) b = 0
        else if (b > BUCKETS - 1) b = BUCKETS - 1
        const n = bN[b]
        bX[b][n] = screenX
        bY[b][n] = screenY
        bR[b][n] = r
        bN[b] = n + 1
      }

      const TWO_PI = Math.PI * 2
      for (let b = 1; b < BUCKETS; b++) {
        const n = bN[b]
        if (!n) continue
        ctx.fillStyle = `rgba(0,0,0,${(b / (BUCKETS - 1)).toFixed(3)})`
        ctx.beginPath()
        const xs = bX[b]
        const ys = bY[b]
        const rs = bR[b]
        for (let k = 0; k < n; k++) {
          const rr = rs[k]
          ctx.moveTo(xs[k] + rr, ys[k])
          ctx.arc(xs[k], ys[k], rr, 0, TWO_PI)
        }
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
      targetRotY = nx * 0.32
      targetRotX = ny * 0.22
    }
    const handleDeviceOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      targetRotY = (e.gamma / 45) * 0.28
      targetRotX = (e.beta / 90) * 0.18
    }

    const handleResize = () => {
      buildParticles()
      resize()
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
        if (visible && !prefersReduced && !raf.current) {
          raf.current = requestAnimationFrame(render)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("deviceorientation", handleDeviceOrient)
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(raf.current)
      io.disconnect()
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("deviceorientation", handleDeviceOrient)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
