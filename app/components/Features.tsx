"use client"

import { useState } from "react"

type GalleryItem = {
  title: string
  category: string
  code: string
  color: string
}

export default function Features() {
  const [activeItem, setActiveItem] = useState<number | null>(null)

  const categories = ["全部", "平面设计", "摄影", "视觉"]
  const [activeCategory, setActiveCategory] = useState("全部")

  const items: GalleryItem[] = [
    { title: "品牌视觉 01", category: "平面设计", code: "GD_001", color: "#111111" },
    { title: "海报设计 02", category: "平面设计", code: "GD_002", color: "#2b2b2b" },
    { title: "城市剪影", category: "摄影", code: "PH_001", color: "#3d3d3d" },
    { title: "人像光影", category: "摄影", code: "PH_002", color: "#1c1c1c" },
    { title: "包装设计", category: "平面设计", code: "GD_003", color: "#4a4a4a" },
    { title: "自然纪实", category: "摄影", code: "PH_003", color: "#242424" },
    { title: "UI 概念稿", category: "视觉", code: "VS_001", color: "#333333" },
    { title: "字体实验", category: "视觉", code: "VS_002", color: "#0f0f0f" },
  ]

  const filtered = activeCategory === "全部" ? items : items.filter((i) => i.category === activeCategory)

  return (
    <section id="features" className="py-32 bg-gray-50 relative">
      <div className="absolute inset-0 opacity-8">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="circuit" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 0 60 L 30 60 L 30 30 L 90 30 L 90 90 L 120 90" fill="none" stroke="#000" strokeWidth="1" />
              <circle cx="30" cy="60" r="3" fill="#000" />
              <circle cx="90" cy="30" r="3" fill="#000" />
              <rect x="85" y="85" width="10" height="10" fill="none" stroke="#000" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light tracking-wider mb-6 font-mono">图片展示</h2>
          <div className="w-32 h-px bg-black mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">平面设计与摄影作品精选（封面为占位色块，可替换为真实作品）</p>
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
            >
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black z-10 transition-all duration-300 group-hover:w-10 group-hover:h-10"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-black z-10 transition-all duration-300 group-hover:w-10 group-hover:h-10"></div>

              <div
                className="aspect-square w-full flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: item.color }}
              >
                <span className="font-mono text-white/40 text-sm tracking-widest">{item.code}</span>
                <div
                  className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                    activeItem === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-white font-mono text-sm tracking-wide border border-white/50 px-4 py-2">
                    查看作品
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
    </section>
  )
}
