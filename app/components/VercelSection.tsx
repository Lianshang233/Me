"use client"

import { useState } from "react"
import Reveal from "./Reveal"

type VideoItem = {
  title: string
  category: string
  code: string
  src: string
  description: string
}

export default function VercelSection() {
  const videos: VideoItem[] = [
    {
      title: "酒店文旅宣传",
      category: "实拍",
      code: "VID_001",
      src: "https://img.pagehost.cn/autoupload/Z-L8Ui8QwfyR3HS4UBOv_BFKraXKJIJ9E6aPixPcCpg/20260704/fYqJ/983d4bf0a93c14c22ead1e2283c5683b.mp4",
      description: "酒店文旅宣传实拍作品，实景拍摄与剪辑，呈现空间氛围与品牌调性。",
    },
    {
      title: "3D 后期作品",
      category: "3D / 后期",
      code: "VID_002",
      src: "https://img.pagehost.cn/autoupload/Z-L8Ui8QwfyR3HS4UBOv_BFKraXKJIJ9E6aPixPcCpg/20260704/Nogi/3053af9e12487d7f257647383cd51bcb.mp4",
      description: "以 3D 为主的后期合成作品，Blender 为主、AE 为辅助，注重画面质感与镜头表现。",
    },
    {
      title: "低预算快制作品",
      category: "快制",
      code: "VID_003",
      src: "https://img.pagehost.cn/autoupload/Z-L8Ui8QwfyR3HS4UBOv_BFKraXKJIJ9E6aPixPcCpg/20260704/a29g/cf1d5d07f3dc3fcd4e5d3603bde7ced0.mp4",
      description: "低预算作品，制作周期短、效率高，效果略有取舍，适合快速交付的需求。",
    },
  ]

  const [activeVideo, setActiveVideo] = useState(0)

  return (
    <section id="vercel" className="py-32 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="circuit-pattern" width="150" height="150" patternUnits="userSpaceOnUse">
              <path
                d="M 0 75 L 37.5 75 L 37.5 37.5 L 112.5 37.5 L 112.5 112.5 L 150 112.5"
                fill="none"
                stroke="#fff"
                strokeWidth="1"
              />
              <circle cx="37.5" cy="75" r="5" fill="#fff" />
              <circle cx="112.5" cy="37.5" r="5" fill="#fff" />
              <rect x="107.5" y="107.5" width="10" height="10" fill="none" stroke="#fff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-light tracking-wider mb-6 font-mono shimmer-text">视频</h2>
          <div className="w-32 h-px bg-white mx-auto mb-8 animate-lineExpand"></div>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">视频作品与动态展示</p>
          <p className="text-gray-500 max-w-3xl mx-auto text-sm font-mono mt-4">
            如需了解更多请转到下面《联系》
          </p>
        </Reveal>

        <Reveal className="mb-12 border-2 border-gray-700 bg-gray-900 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-gray-500">{videos[activeVideo].code}</span>
              <h3 className="font-mono font-bold text-lg">{videos[activeVideo].title}</h3>
            </div>
            <span className="text-xs font-mono text-gray-400 border border-gray-600 px-3 py-1">
              {videos[activeVideo].category}
            </span>
          </div>

          <div className="relative border-2 border-white/20">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white z-10 pointer-events-none"></div>
            <video
              key={videos[activeVideo].src}
              controls
              playsInline
              preload="metadata"
              className="w-full aspect-video bg-black"
            >
              <source src={videos[activeVideo].src} type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed mt-4 font-mono">{videos[activeVideo].description}</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <Reveal
              key={video.code}
              delay={index * 100}
              as="span"
              className="block"
            >
            <button
              onClick={() => setActiveVideo(index)}
              className={`group text-left w-full border-2 bg-gray-900 p-4 transition-all duration-300 hover:-translate-y-1 ${
                activeVideo === index ? "border-white" : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <div className="aspect-video w-full bg-black border border-gray-700 flex items-center justify-center mb-3 relative overflow-hidden">
                <div
                  className={`w-0 h-0 border-y-8 border-y-transparent border-l-[14px] transition-all duration-300 group-hover:scale-125 ${
                    activeVideo === index
                      ? "border-l-white animate-breathe"
                      : "border-l-gray-500 group-hover:border-l-white"
                  }`}
                ></div>
                <span className="absolute bottom-1 right-2 text-[10px] font-mono text-gray-600">{video.code}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-sm">{video.title}</div>
                  <div className="text-xs text-gray-500 font-mono mt-1">{video.category}</div>
                </div>
                {activeVideo === index && <div className="w-2 h-2 bg-white animate-pulse"></div>}
              </div>
            </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
