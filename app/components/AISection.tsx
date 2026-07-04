"use client"

import { useState } from "react"
import { Gamepad2, Puzzle, Swords } from "lucide-react"

export default function AISection() {
  const [activePanel, setActivePanel] = useState(0)

  const projects = [
    {
      title: "像素冒险：回声",
      role: "主策划 / 关卡设计",
      description: "一款 2D 像素平台冒险游戏，负责世界观设定、关卡节奏与核心玩法循环设计。",
      tags: ["关卡设计", "数值策划", "叙事"],
      stats: ["12 关卡", "3 结局", "8 小时流程"],
      icon: Gamepad2,
      video: "https://img.pagehost.cn/autoupload/Z-L8Ui8QwfyR3HS4UBOv_BFKraXKJIJ9E6aPixPcCpg/20260704/K4tf/1f5464f9fe21990252257fc193ca8f94.mp4",
    },
    {
      title: "谜境：齿轮之城",
      role: "玩法策划 / 谜题设计",
      description: "解谜类独立游戏，主导机关谜题体系与难度曲线，注重玩家心流体验。",
      tags: ["谜题设计", "系统策划", "体验优化"],
      stats: ["40+ 谜题", "5 章节", "Steam 上架"],
      icon: Puzzle,
      video: "https://img.pagehost.cn/autoupload/Z-L8Ui8QwfyR3HS4UBOv_BFKraXKJIJ9E6aPixPcCpg/20260704/mv9O/08557ff8b7729e5a4b1535e45b95711f.mp4",
    },
    {
      title: "群星战线",
      role: "系统策划 / 平衡设计",
      description: "多人策略对战游戏，负责兵种平衡、经济系统与匹配机制的设计与调优。",
      tags: ["平衡设计", "经济系统", "多人对战"],
      stats: ["24 兵种", "PVP", "赛季机制"],
      icon: Swords,
      video: "https://img.pagehost.cn/autoupload/Z-L8Ui8QwfyR3HS4UBOv_BFKraXKJIJ9E6aPixPcCpg/20260704/HDVw/6bf293562db0a04c83648532991edb84.mp4",
    },
  ]

  return (
    <section id="ai" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light tracking-wider mb-6 font-mono">游戏项目</h2>
          <div className="w-32 h-px bg-black mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">参与策划与设计的游戏项目，点击切换查看项目视频预览</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            {projects.map((project, index) => {
              const IconComponent = project.icon
              return (
                <div
                  key={index}
                  className={`border-2 p-8 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    activePanel === index ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setActivePanel(index)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <IconComponent size={24} className="text-gray-600" />
                      <h3 className="font-mono font-bold text-xl">{project.title}</h3>
                    </div>
                    <div className={`w-4 h-4 ${activePanel === index ? "bg-black animate-pulse" : "bg-gray-300"}`}></div>
                  </div>

                  <div className="text-xs font-mono text-gray-400 mb-4">{project.role}</div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>

                  {activePanel === index && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex flex-wrap gap-3">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="bg-black text-white px-3 py-2 text-xs font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {project.stats.map((stat, i) => (
                          <div key={i} className="border border-gray-300 px-2 py-3 text-center">
                            <span className="font-mono text-sm">{stat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="border-2 border-gray-200 bg-gray-50 p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-mono font-bold text-lg">项目预览</h4>
                <span className="text-xs font-mono text-gray-400">{`0${activePanel + 1} / 0${projects.length}`}</span>
              </div>

              <div className="relative border-2 border-black">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 z-10 pointer-events-none"></div>
                <video
                  key={projects[activePanel].video}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full aspect-video bg-black block"
                >
                  <source src={projects[activePanel].video} type="video/mp4" />
                  您的浏览器不支持视频播放。
                </video>
              </div>

              <div className="mt-6">
                <div className="font-mono font-bold text-xl mb-2">{projects[activePanel].title}</div>
                <div className="text-sm text-gray-500 font-mono">{projects[activePanel].role}</div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="border-2 border-gray-200 p-6 bg-white">
                  <div className="text-xs font-mono text-gray-500 mb-2">参与项目</div>
                  <div className="text-3xl font-mono font-bold">8+</div>
                  <div className="text-xs text-gray-500">独立 / 商业</div>
                </div>
                <div className="border-2 border-gray-200 p-6 bg-white">
                  <div className="text-xs font-mono text-gray-500 mb-2">设计文档</div>
                  <div className="text-3xl font-mono font-bold">50+</div>
                  <div className="text-xs text-gray-500">策划案</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
