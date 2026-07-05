"use client"

import { useEffect, useMemo, useState } from "react"
import { X, ArrowUpRight } from "lucide-react"
import Reveal from "./Reveal"
import { experiences, experienceCategories, type ExperienceItem } from "../data/experience"

const starBlocks = (item: ExperienceItem) => [
  { key: "S", label: "情境 SITUATION", text: item.situation },
  { key: "T", label: "任务 TASK", text: item.task },
  { key: "A", label: "行动 ACTION", text: item.action },
  { key: "R", label: "结果 RESULT", text: item.result },
]

export default function ExperienceSection() {
  const [active, setActive] = useState("all")
  const [selected, setSelected] = useState<ExperienceItem | null>(null)

  const filtered = useMemo(
    () => (active === "all" ? experiences : experiences.filter((e) => e.category === active)),
    [active],
  )

  // 打开弹窗时锁定页面滚动
  useEffect(() => {
    if (selected) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [selected])

  // Esc 关闭弹窗
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selected])

  return (
    <section id="experience" className="py-32 bg-white text-black relative overflow-hidden">
      {/* 极淡背景网格 */}
      <div className="absolute inset-0 opacity-[0.03] overflow-hidden pointer-events-none">
        <div
          className="absolute animate-gridDrift"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div className="font-mono text-xs tracking-[0.4em] text-gray-400 mb-5">05 — EXPERIENCE</div>
          <h2 className="text-4xl sm:text-5xl font-light tracking-wider mb-6 font-mono">项目经历</h2>
          <div className="w-16 h-px bg-black mx-auto mb-8 animate-lineExpand" />
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            覆盖游戏研发、影像演出、品牌运营与 IT 运维的全链路项目实践 · 点击任意条目查看 STAR 详情
          </p>
        </Reveal>

        {/* 分类筛选（总览） */}
        <Reveal className="flex flex-wrap justify-center gap-3 mb-12">
          {experienceCategories.map((cat) => {
            const count =
              cat.key === "all" ? experiences.length : experiences.filter((e) => e.category === cat.key).length
            return (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className={`px-5 py-2 text-xs tracking-widest font-mono border transition-colors duration-300 flex items-center gap-2 ${
                  active === cat.key
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-500 hover:border-black hover:text-black"
                }`}
              >
                <span>{cat.label}</span>
                <span className={active === cat.key ? "text-gray-400" : "text-gray-300"}>{count}</span>
              </button>
            )
          })}
        </Reveal>

        {/* 紧凑列表 */}
        <div className="border-t border-gray-200">
          {filtered.map((item, i) => (
            <Reveal key={item.code} delay={Math.min(i, 5) * 60}>
              <button
                onClick={() => setSelected(item)}
                className="group w-full text-left border-b border-gray-200 py-6 px-2 sm:px-4 flex items-start sm:items-center gap-4 sm:gap-6 hover:bg-black hover:text-white transition-colors duration-300"
              >
                <span className="font-mono text-xs text-gray-400 group-hover:text-gray-500 pt-1 sm:pt-0 tabular-nums shrink-0">
                  {item.code}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                    <h3 className="font-mono font-bold text-base sm:text-lg truncate">{item.title}</h3>
                    <span className="font-mono text-xs text-gray-400 group-hover:text-gray-500 shrink-0">
                      {item.period}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] tracking-wider px-2 py-0.5 border border-gray-200 text-gray-500 group-hover:border-white/30 group-hover:text-gray-300 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <ArrowUpRight
                  size={18}
                  className="shrink-0 mt-1 sm:mt-0 text-gray-300 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 详情弹窗 */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/70"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.title} 详情`}
        >
          <div
            className="relative bg-white border border-black w-full max-w-3xl max-h-[90vh] flex flex-col animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="flex items-start justify-between gap-4 p-6 sm:p-8 border-b border-gray-200 shrink-0">
              <div className="min-w-0">
                <div className="font-mono text-xs tracking-widest text-gray-400 mb-2">{selected.code}</div>
                <h3 className="font-mono font-bold text-xl sm:text-2xl leading-snug text-balance">{selected.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="font-mono text-xs text-gray-500">{selected.period}</span>
                  <span className="text-gray-300">·</span>
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] tracking-wider px-2 py-0.5 border border-gray-300 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="shrink-0 w-9 h-9 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                aria-label="关闭"
              >
                <X size={18} />
              </button>
            </div>

            {/* STAR 详情 */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              {starBlocks(selected).map((block) => (
                <div key={block.key} className="flex gap-4 sm:gap-5">
                  <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 border border-black flex items-center justify-center font-mono font-bold text-sm">
                    {block.key}
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <div className="font-mono text-[11px] tracking-widest text-gray-400 mb-2">{block.label}</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{block.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
