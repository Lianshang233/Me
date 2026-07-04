"use client"

import { useEffect, useRef } from "react"

/**
 * 粒子 Logo：加载真实标志 PNG（白色图形 + 透明背景），采样其不透明像素为大量圆点，
 * 打开页面时粒子从四面八方汇聚拼成标志，之后随鼠标轻微移动。
 */

// 真实标志图片的原始像素宽高比（用于等比缩放采样）
const LOGO_ASPECT = 1470 / 795

type Particle = {
  tx: number
  ty: number
  sx: number
  sy: number
  r: number
  a: number
  delay: number
  dur: number
  ph: number
  amp: number
  depth: number
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export default function ParticleLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const isMobile = () => window.innerWidth < 768

    let width = 0
    let height = 0
    let cx = 0
    let cy = 0
    let particles: Particle[] = []
    let startTime = 0
    const raf = { current: 0 }
    let visible = true

    // 目标鼠标位置（归一化 -1..1）与平滑值
    let mnx = 0
    let mny = 0
    let px = 0
    let py = 0

    // 由 SVG 生成目标点
    const buildTargets = (): Array<{ x: number; y: number }> => {
      // 宽版标志：以宽度为主导等比缩放，并限制高度不超过视口
      let logoW = width * (isMobile() ? 0.94 : 0.78)
      let logoH = logoW / LOGO_ASPECT
      const maxH = height * (isMobile() ? 0.62 : 0.8)
      if (logoH > maxH) {
        logoH = maxH
        logoW = logoH * LOGO_ASPECT
      }
      const gap = isMobile() ? 4 : 3
      const off = document.createElement("canvas")
      off.width = Math.round(logoW)
      off.height = Math.round(logoH)
      const octx = off.getContext("2d")
      if (!octx) return []
      octx.drawImage(imgRef, 0, 0, off.width, off.height)
      const data = octx.getImageData(0, 0, off.width, off.height).data

      const originX = cx - logoW / 2
      const originY = cy - logoH / 2
      const pts: Array<{ x: number; y: number }> = []
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          const alpha = data[(y * off.width + x) * 4 + 3]
          if (alpha > 128) {
            // 加入亚像素抖动，让点分布更自然
            pts.push({
              x: originX + x + (Math.random() - 0.5) * gap,
              y: originY + y + (Math.random() - 0.5) * gap,
            })
          }
        }
      }
      return pts
    }

    const buildParticles = () => {
      const targets = buildTargets()
      const MAX = isMobile() ? 1500 : 2800
      // 若点过多则随机降采样
      let selected = targets
      if (targets.length > MAX) {
        selected = []
        const stride = targets.length / MAX
        for (let i = 0; i < targets.length; i += stride) {
          selected.push(targets[Math.floor(i)])
        }
      }
      const maxDim = Math.hypot(width, height)
      particles = selected.map((t) => {
        const ang = Math.random() * Math.PI * 2
        const dist = maxDim * (0.55 + Math.random() * 0.7)
        return {
          tx: t.x,
          ty: t.y,
          sx: cx + Math.cos(ang) * dist,
          sy: cy + Math.sin(ang) * dist,
          r: 0.7 + Math.random() * 1.5,
          a: 0.16 + Math.random() * 0.22,
          delay: Math.random() * 500,
          dur: 900 + Math.random() * 800,
          ph: Math.random() * Math.PI * 2,
          amp: 0.25 + Math.random() * 0.6,
          depth: 0.35 + Math.random() * 0.65,
        }
      })
      startTime = performance.now()
    }

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      cx = width / 2
      cy = height / 2
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (imgLoaded) buildParticles()
    }

    const render = () => {
      if (!visible) {
        raf.current = 0
        return
      }
      const now = performance.now()
      const elapsed = now - startTime

      // 平滑跟随鼠标
      px += (mnx - px) * 0.06
      py += (mny - py) * 0.06

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const t = Math.max(0, Math.min(1, (elapsed - p.delay) / p.dur))
        const e = easeOutCubic(t)
        const baseX = p.sx + (p.tx - p.sx) * e
        const baseY = p.sy + (p.ty - p.sy) * e

        // 成形后叠加轻微漂浮与鼠标视差
        const drift = e
        const idleX = Math.sin(now * 0.0006 + p.ph) * p.amp * drift
        const idleY = Math.cos(now * 0.0005 + p.ph) * p.amp * drift
        const parX = px * 14 * p.depth * drift
        const parY = py * 14 * p.depth * drift

        const x = baseX + idleX + parX
        const y = baseY + idleY + parY

        ctx.globalAlpha = p.a * (0.15 + e * 0.85)
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      raf.current = requestAnimationFrame(render)
    }

    // 加载真实标志 PNG
    let imgLoaded = false
    const imgRef = new Image()
    imgRef.crossOrigin = "anonymous"
    imgRef.onload = () => {
      imgLoaded = true
      ctx.fillStyle = "#111111"
      resize()
      if (prefersReduced) {
        // 直接绘制成形静态帧
        startTime = performance.now() - 100000
        render()
      } else {
        raf.current = requestAnimationFrame(render)
      }
    }
    imgRef.src = "/logo-mark.png"

    const onMove = (ev: MouseEvent) => {
      mnx = (ev.clientX / window.innerWidth) * 2 - 1
      mny = (ev.clientY / window.innerHeight) * 2 - 1
    }

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 150)
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

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf.current)
      io.disconnect()
      window.clearTimeout(resizeTimer)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
