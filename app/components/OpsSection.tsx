"use client"

import { useState, useEffect } from "react"
import { Monitor, ShieldCheck, Cpu, HardDrive, Wifi, Terminal, Activity } from "lucide-react"

export default function OpsSection() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => (t + 1) % 1000), 1200)
    return () => clearInterval(timer)
  }, [])

  const services = [
    { icon: Monitor, title: "桌面终端运维", desc: "系统部署、软件安装、故障排查与日常维护，保障办公终端稳定运行。" },
    { icon: ShieldCheck, title: "安全与备份", desc: "杀毒防护、权限管理与数据定期备份，降低数据丢失与安全风险。" },
    { icon: Wifi, title: "网络与外设", desc: "局域网配置、打印机与外设接入调试，快速解决连接类问题。" },
    { icon: Terminal, title: "系统重装优化", desc: "系统重装、驱动配置与性能调优，让老旧设备重获流畅体验。" },
  ]

  const metrics = [
    { icon: Cpu, label: "CPU 负载", value: 18 + (tick % 12) },
    { icon: HardDrive, label: "磁盘占用", value: 46 + (tick % 8) },
    { icon: Activity, label: "在线率", value: 99 },
  ]

  return (
    <section id="ops" className="py-32 bg-black text-white relative overflow-hidden">
      {/* animated grid backdrop */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>
      {/* scanning line */}
      <div className="absolute left-0 right-0 h-px bg-white/30 animate-scan pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 border border-white/20 px-4 py-1 mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-gray-400">SYSTEM ONLINE</span>
          </div>
          <h2 className="text-5xl font-light tracking-wider mb-6 font-mono">运维</h2>
          <div className="w-32 h-px bg-white mx-auto mb-8" />
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">桌面运维 · 保障设备与系统稳定高效运行</p>
        </div>

        {/* live metrics bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} className="border-2 border-gray-800 bg-gray-950 p-6 group hover:border-white/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon size={18} className="text-gray-400" />
                    <span className="text-xs font-mono text-gray-500 tracking-wider">{m.label}</span>
                  </div>
                  <span className="font-mono font-bold text-2xl tabular-nums">{m.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-700 ease-out"
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="relative border-2 border-gray-800 bg-gray-950 p-8 overflow-hidden group hover:bg-gray-900 hover:border-white/40 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/30 group-hover:border-white transition-colors pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/30 group-hover:border-white transition-colors pointer-events-none" />
                <div className="flex items-start space-x-5">
                  <div className="shrink-0 w-14 h-14 border-2 border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-xs font-mono text-gray-600">OPS_{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="font-mono font-bold text-lg">{s.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
