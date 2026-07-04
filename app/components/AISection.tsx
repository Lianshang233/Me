"use client"

import { useState } from "react"
import { Gamepad2, Puzzle, Swords } from "lucide-react"
import Reveal from "./Reveal"

export default function AISection() {
  const [activePanel, setActivePanel] = useState(0)

  const projects = [
    {
      title: "ichni",
      role: "美术PM / 项目管理",
      description: "主打 \"音游可视化创作\" 的差异化玩法，以极简抽象的线条视觉为核心风格，是音游赛道备受玩家关注的标杆级新作",
      tags: ["关卡设计", "美术统筹", "策划"],
      stats: ["统筹资源", "商业化", "统一美术"],
      icon: Gamepad2,
      video: "https://img.pagehost.cn/autoupload/Z-L8Ui8QwfyR3HS4UBOv_BFKraXKJIJ9E6aPixPcCpg/20260704/K4tf/1f5464f9fe21990252257fc193ca8f94.mp4",
      preview: [
        { label: "参与小项目", value: "8+", desc: "独立 / 商业" },
        { label: "设计素材", value: "50+", desc: "素材量" },
      ],
    },
    {
      title: "Minnes",
      role: "玩法策划 / 项目管理",
      description: "从零发起原创剧情向音游项目，无外部商业融资，需统筹美术、作曲、谱面、程序多管线协作",
      tags: ["项目管理", "系统策划", "体验优化"],
      stats: ["从零开始", "非商业化", "统筹"],
      icon: Puzzle,
      video: "https://img.pagehost.cn/autoupload/Z-L8Ui8QwfyR3HS4UBOv_BFKraXKJIJ9E6aPixPcCpg/20260704/mv9O/08557ff8b7729e5a4b1535e45b95711f.mp4",
      preview: [
        { label: "预约量", value: "150000+", desc: "独立 / 非商业" },
        { label: "热度", value: "4000000+", desc: "曝光" },
      ],
    },
    {
      title: "Orzmic",
      role: "美术 / 执行PM",
      description: "对接项目主策与美术负责人，明确 UI 与 3D 曲绘需求、交付标准与排期节点，同步制作进度与修改意见",
      tags: ["美术资源", "独立游戏", "美术"],
      stats: ["资源对接", "非商业化", "需求分析"],
      icon: Swords,
      video: "https://img.pagehost.cn/autoupload/Z-L8Ui8QwfyR3HS4UBOv_BFKraXKJIJ9E6aPixPcCpg/20260704/HDVw/6bf293562db0a04c83648532991edb84.mp4",
      preview: [
        { label: "交付曲绘", value: "20+", desc: "UI / 3D 曲绘" },
        { label: "热度", value: "2840000+", desc: "关注" },
      ],
    },
  ]

  return (
    <section id="ai" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-light tracking-wider mb-6 font-mono">游戏项目</h2>
          <div className="w-32 h-px bg-black mx-auto mb-8 animate-lineExpand"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">参与策划与设计的游戏项目，点击切换查看项目视频预览</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <Reveal direction="left" className="space-y-6">
            {projects.map((project, index) => {
              const IconComponent = project.icon
              return (
                <div
                  key={index}
                  className={`group border-2 p-8 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    activePanel === index ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setActivePanel(index)}
                >
                  {activePanel === index && (
                    <div className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-black/5 to-transparent skew-x-12 animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <IconComponent
                        size={24}
                        className={`text-gray-600 transition-transform duration-300 ${
                          activePanel === index ? "scale-110 animate-float" : "group-hover:scale-110"
                        }`}
                      />
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
                          <span
                            key={i}
                            className="bg-black text-white px-3 py-2 text-xs font-mono animate-popIn hover:scale-105 transition-transform"
                            style={{ animationDelay: `${i * 80}ms` }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {project.stats.map((stat, i) => (
                          <div
                            key={i}
                            className="border border-gray-300 px-2 py-3 text-center animate-popIn hover:border-black hover:-translate-y-1 transition-all duration-300"
                            style={{ animationDelay: `${i * 80 + 120}ms` }}
                          >
                            <span className="font-mono text-sm">{stat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </Reveal>

          <Reveal direction="right" delay={120} className="lg:sticky lg:top-24">
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
                {projects[activePanel].preview.map((item, i) => (
                  <div key={i} className="border-2 border-gray-200 p-6 bg-white">
                    <div className="text-xs font-mono text-gray-500 mb-2">{item.label}</div>
                    <div className="text-3xl font-mono font-bold">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
