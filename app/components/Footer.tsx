"use client"

import { Mail, MessageCircle, MessageSquare } from "lucide-react"
import Reveal from "./Reveal"

export default function Footer() {
  const services = [
    { name: "平面设计", desc: "海报 · 概念 · 3D" },
    { name: "拍摄/制片/编导", desc: "2D · 3D · 商业" },
    { name: "游戏策划/PM", desc: "策划 · 系统 · 统筹" },
    { name: "桌面运维/采购", desc: "终端 · 安全 · 网络" },
  ]

  return (
    <footer id="contact" className="bg-gray-50 border-t border-gray-200 py-20 relative">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div className="font-mono text-xs tracking-[0.4em] text-gray-400 mb-5">05 — CONTACT</div>
          <h2 className="text-4xl sm:text-5xl font-light tracking-wider mb-6 font-mono">联系</h2>
          <div className="w-16 h-px bg-black mx-auto mb-8 animate-lineExpand"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">欢迎洽谈合作、约稿与项目委托</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="font-mono font-bold text-4xl mb-1 tracking-wider">
              Lian<span className="font-bold">shang</span>
            </h3>
            <div className="font-mono tracking-[0.3em] text-xl mb-5">恋殇</div>
            <div className="text-gray-600 leading-relaxed text-xs font-light space-y-0">
              <p>集游戏项目管理、视觉创作、桌面运维能力于一体的复合型从业者。</p>
              <p className="mt-2">深耕音游赛道，拥有原创项目从 0 到 1 全周期 PM 经验，可统筹多管线与外包资源，主导项目 TapTap 预约 10w+；</p>
              <p className="mt-2">精通 Blender、PR、AE，覆盖商业摄影、平面设计、3D 美术全链路，服务广电、酒店、游戏等多领域客户；</p>
              <p className="mt-2">具备硬件采购 - 部署 - 运维全流程桌面运维能力，累计管理终端 110 + 台，硬件兼容故障率 0%。</p>
              <p className="mt-2">跨领域适配性强，执行力突出，可高效支撑项目全链路落地</p>
            </div>
          </div>

          <div>
            <h4 className="font-mono font-bold mb-8 tracking-wide text-xl">服务方向</h4>
            <div className="space-y-6">
              {services.map((service) => (
                <div key={service.name} className="group border-l border-gray-300 pl-4 hover:border-black transition-colors">
                  <div className="font-mono font-bold">{service.name}</div>
                  <div className="text-sm text-gray-500 font-mono mt-1">{service.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono font-bold mb-8 tracking-wide text-xl">联系方式</h4>
            <div className="space-y-6">
              <a href="mailto:lianshangowo@outlook.com" className="group flex items-center space-x-3">
                <div className="shrink-0 w-10 h-10 border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-mono text-gray-500">邮箱</div>
                  <div className="font-mono text-sm sm:text-base group-hover:text-gray-600 transition-colors break-all">
                    lianshangowo@outlook.com
                  </div>
                </div>
              </a>
              <a href="mailto:lianshangowo@163.com" className="group flex items-center space-x-3">
                <div className="shrink-0 w-10 h-10 border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-mono text-gray-500">备用邮箱</div>
                  <div className="font-mono text-sm sm:text-base group-hover:text-gray-600 transition-colors break-all">
                    lianshangowo@163.com
                  </div>
                </div>
              </a>
              <div className="group flex items-center space-x-3">
                <div className="shrink-0 w-10 h-10 border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <MessageCircle size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-mono text-gray-500">微信</div>
                  <div className="font-mono text-sm sm:text-base group-hover:text-gray-600 transition-colors break-all">LianshangOwO</div>
                </div>
              </div>
              <div className="group flex items-center space-x-3">
                <div className="shrink-0 w-10 h-10 border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <MessageSquare size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-mono text-gray-500">QQ</div>
                  <div className="font-mono text-sm sm:text-base group-hover:text-gray-600 transition-colors break-all">1552309639</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-16">
          <a
            href="https://qm.qq.com/q/5JkkFDevxS"
            target="_blank"
            rel="noopener noreferrer"
            className="group font-mono border border-black px-10 py-4 text-lg hover:bg-black hover:text-white transition-colors tracking-wide"
          >
            面试邀约/合作 <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="pt-10 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 font-mono mb-6 md:mb-0">
              © 2026 Lianshang · 恋殇. 保留所有权利。
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-mono">
              <span className="flex items-center space-x-2 group">
                <div className="w-2 h-2 bg-black animate-pulse"></div>
                <span className="group-hover:text-gray-600 transition-colors">平面设计</span>
              </span>
              <span className="flex items-center space-x-2 group">
                <div className="w-2 h-2 bg-gray-400"></div>
                <span className="group-hover:text-gray-600 transition-colors">摄影</span>
              </span>
              <span className="flex items-center space-x-2 group">
                <div className="w-2 h-2 bg-black"></div>
                <span className="group-hover:text-gray-600 transition-colors">游戏策划</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
