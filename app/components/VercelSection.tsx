"use client"

import { useState } from "react"

type VideoItem = {
  title: string
  category: string
  code: string
  src: string
}

export default function VercelSection() {
  const videos: VideoItem[] = [
    {
      title: "作品集短片",
      category: "剪辑",
      code: "VID_001",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    {
      title: "动态视觉",
      category: "动效",
      code: "VID_002",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
      title: "宣传片段",
      category: "商业",
      code: "VID_003",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      title: "幕后花絮",
      category: "记录",
      code: "VID_004",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
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
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light tracking-wider mb-6 font-mono">视频</h2>
          <div className="w-32 h-px bg-white mx-auto mb-8"></div>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">视频作品与动态展示（示例视频，可替换为真实内容）</p>
        </div>

        <div className="mb-12 border-2 border-gray-700 bg-gray-900 p-4 md:p-6">
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
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <button
              key={video.code}
              onClick={() => setActiveVideo(index)}
              className={`group text-left border-2 bg-gray-900 p-4 transition-all duration-300 hover:-translate-y-1 ${
                activeVideo === index ? "border-white" : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <div className="aspect-video w-full bg-black border border-gray-700 flex items-center justify-center mb-3 relative overflow-hidden">
                <div
                  className={`w-0 h-0 border-y-8 border-y-transparent border-l-[14px] transition-colors duration-300 ${
                    activeVideo === index ? "border-l-white" : "border-l-gray-500 group-hover:border-l-white"
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
          ))}
        </div>
      </div>
    </section>
  )
}
