"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Reveal from "./Reveal"

type GalleryItem = {
  title: string
  category: string
  code: string
  color: string
  image?: string
  description?: string
}

export default function Features() {
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  const categories = ["全部", "平面设计", "摄影", "视觉"]
  const [activeCategory, setActiveCategory] = useState("全部")

  const items: GalleryItem[] = [
    {
      title: "个人简介",
      category: "平面设计",
      code: "GD_001",
      color: "#3a3128",
      image: "/works/graphic-profile.jpeg",
      description: "复古做旧风格个人简介版面设计，撕纸拼贴与半调质感结合，平面排版作品。",
    },
    {
      title: "韵临律界 II 主视觉",
      category: "平面设计",
      code: "GD_002",
      color: "#1a2330",
      image: "/works/graphic-poster.png",
      description: "线下演出活动《韵临律界 II》宣传主视觉海报设计，科技感排版与人物立绘结合。",
    },
    {
      title: "夜水倒影",
      category: "摄影",
      code: "PH_001",
      color: "#0f1a2b",
      image: "/works/photo-reflection.jpg",
      description: "夜晚水岸摄影，暖调灯光倒影与冷调水面形成对比，捕捉光影律动。",
    },
    {
      title: "今朝逐梦",
      category: "摄影",
      code: "PH_002",
      color: "#2a2018",
      image: "/works/photo-dream.jpg",
      description: "现场纪实摄影，浅景深聚焦手持书法卡片，记录活动瞬间的情绪与仪式感。",
    },
    {
      title: "夏日写真",
      category: "摄影",
      code: "PH_003",
      color: "#2b4a63",
      image: "/works/photo-pool.jpg",
      description: "泳池边人像写真，自然光线与清爽色调，展现夏日轻盈氛围。",
    },
    {
      title: "Mars Ashes 荧临余烬",
      category: "视觉",
      code: "VS_001",
      color: "#0b0f14",
      image: "/works/mars-ashes.png",
      description: "赛博朋克风格场景合成，青色霓虹光效与数据流氛围营造，主视觉设计。",
    },
    {
      title: "LIANSHANG 钢琴",
      category: "视觉",
      code: "VS_002",
      color: "#8ba06a",
      image: "/works/lianshang-piano.png",
      description: "唯美自然场景合成，水面钢琴与光晕氛围渲染，个人主视觉作品（后期协力 ZZYFISH）。",
    },
    {
      title: "Replace 忤逆",
      category: "视觉",
      code: "VS_003",
      color: "#1a1d24",
      image: "/works/replace.jpeg",
      description: "故障艺术专辑封面设计，等距结构与棱镜光效结合噪点质感（CHEN ING MUSIC）。",
    },
  ]

  const filtered = activeCategory === "全部" ? items : items.filter((i) => i.category === activeCategory)

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [selected])

  return (
    <section id="features" className="py-32 bg-gray-50 relative">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#000" strokeWidth="1" />
            </pattern>
            <pattern id="dots" width="64" height="64" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="1.5" fill="#000" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-transparent to-gray-50 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light tracking-wider mb-6 font-mono shimmer-text">图片展示</h2>
          <div className="w-32 h-px bg-black mx-auto mb-8 animate-lineExpand"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">平面设计、摄影与视觉作品精选，点击作品可展开查看全图<div className="mx-auto px-7 text-xs font-light leading-relaxed mt-3 text-gray-500">覆盖商业品牌、线下演出、游戏美术、零售终端、广电栏目五大领域，累计服务 7 家企业 / 独立项目，具备商业实拍 — 平面设计 —3D 美术 — 动态视觉全链路创作能力。累计产出商业摄影素材 150 + 组、平面视觉设计作品 120 + 件、3D 美术与动态视觉资产 60 + 套；作品落地于短视频平台、线下舞台、游戏客户端、官方宣传渠道、实体门店等多元载体，直接服务于品牌曝光、产品引流与用户增长。</div></p>
        </Reveal>

        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm font-mono border-2 transition-all duration-300 hover:-translate-y-0.5 ${
                activeCategory === cat
                  ? "border-black bg-black text-white scale-105"
                  : "border-gray-300 text-gray-600 hover:border-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, index) => (
            <Reveal key={item.code} delay={(index % 4) * 90}>
            <div
              className="group relative bg-white border-2 border-gray-200 hover:border-black transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
              onMouseEnter={() => setActiveItem(index)}
              onMouseLeave={() => setActiveItem(null)}
              onClick={() => item.image && setSelected(item)}
            >
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black z-10 transition-all duration-300 group-hover:w-10 group-hover:h-10"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-black z-10 transition-all duration-300 group-hover:w-10 group-hover:h-10"></div>

              <div
                className="aspect-square w-full flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: item.color }}
              >
                {item.image ? (
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="font-mono text-white/40 text-sm tracking-widest">{item.code}</span>
                )}
                <div
                  className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                    activeItem === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-white font-mono text-sm tracking-wide border border-white/50 px-4 py-2">
                    {item.image ? "查看全图" : "查看作品"}
                  </span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-sm">{item.title}</div>
                  <div className="text-xs text-gray-400 font-mono mt-1">{item.category}</div>
                </div>
                <div className="w-2 h-2 bg-black group-hover:animate-pulse"></div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8 animate-fadeIn"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <div
            className="relative bg-gray-50 border-2 border-black inline-flex flex-col w-auto max-w-[92vw] max-h-[92vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-black z-10"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-black z-10"></div>

            <div className="flex items-center justify-between border-b-2 border-black px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-gray-400">{selected.code}</span>
                <span className="font-mono font-bold text-lg">{selected.title}</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="关闭"
                className="w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <img
              src={selected.image || "/placeholder.svg"}
              alt={selected.title}
              className="block w-auto h-auto max-w-[92vw] max-h-[70vh] object-contain"
            />

            <div className="px-6 py-5 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-black text-white px-3 py-1.5 text-xs font-mono">{selected.category}</span>
                <span className="border border-gray-300 px-3 py-1.5 text-xs font-mono text-gray-500">
                  {selected.code}
                </span>
              </div>
              {selected.description && (
                <p className="text-gray-600 leading-relaxed">{selected.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
