"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

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
    { title: "品牌视觉 01", category: "平面设计", code: "GD_001", color: "#111111" },
    { title: "海报设计 02", category: "平面设计", code: "GD_002", color: "#2b2b2b" },
    { title: "城市剪影", category: "摄影", code: "PH_001", color: "#3d3d3d" },
    { title: "人像光影", category: "摄影", code: "PH_002", color: "#1c1c1c" },
    { title: "自然纪实", category: "摄影", code: "PH_003", color: "#242424" },
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
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light tracking-wider mb-6 font-mono">图片展示</h2>
          <div className="w-32 h-px bg-black mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">平面设计、摄影与视觉作品精选，点击作品可展开查看全图</p>
        </div>

        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm font-mono border-2 transition-all duration-300 ${
                activeCategory === cat
                  ? "border-black bg-black text-white"
                  : "border-gray-300 text-gray-600 hover:border-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, index) => (
            <div
              key={item.code}
              className="group relative bg-white border-2 border-gray-200 hover:border-black transition-all duration-300 hover:-translate-y-1 cursor-pointer"
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
                    className="absolute inset-0 w-full h-full object-cover"
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
            className="relative bg-gray-50 border-2 border-black max-w-5xl w-full max-h-[90vh] overflow-y-auto"
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

            <div className="bg-black flex items-center justify-center">
              <img
                src={selected.image || "/placeholder.svg"}
                alt={selected.title}
                className="w-full max-h-[65vh] object-contain"
              />
            </div>

            <div className="px-6 py-5">
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
