"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const [systemStatus, setSystemStatus] = useState({
    API: "运行正常",
    数据库: "健康",
    网络: "最佳",
    安全: "已保护",
  })

  useEffect(() => {
    const statusInterval = setInterval(() => {
      const statuses = ["运行正常", "健康", "最佳"]
      setSystemStatus(() => ({
        API: statuses[Math.floor(Math.random() * statuses.length)],
        数据库: statuses[Math.floor(Math.random() * statuses.length)],
        网络: statuses[Math.floor(Math.random() * statuses.length)],
        安全: "已保护",
      }))
    }, 15000)

    return () => clearInterval(statusInterval)
  }, [])

  return (
    <footer id="contact" className="bg-gray-50 border-t-2 border-gray-200 py-20 relative">
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full animate-pulse"
          style={{
            backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-12 left-12 w-4 h-4 border border-black opacity-20 rotate-45 animate-spin"
          style={{ animationDuration: "15s" }}
        ></div>
        <div className="absolute bottom-20 right-20 w-6 h-6 border border-black opacity-15 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-3 h-12 bg-black opacity-10 rotate-12"></div>
        <div className="absolute bottom-1/3 right-1/3 w-8 h-8 border border-black opacity-10 rotate-45"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-16 bg-white border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-bold text-lg">系统状态</h3>
            <div className="flex items-center space-x-6 text-sm font-mono">
              {Object.entries(systemStatus).map(([key, status]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-black animate-pulse"></div>
                  <span>
                    {key}: {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-mono font-bold text-4xl mb-8 tracking-wider">
              NEXORA<span className="font-light">SIM</span>
              <sup className="text-lg">™</sup>
            </h3>
            <p className="text-gray-600 mb-10 leading-relaxed text-lg">
              专为缅甸数字基础设施打造的先进 eSIM 与物联网连接平台。由人工智能驱动、符合 GSMA 标准的解决方案，部署于 Vercel 前沿基础设施之上。
            </p>

            <div className="border-2 border-gray-300 p-8 inline-block hover:border-black transition-colors duration-300 mb-8">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 border-2 border-black flex items-center justify-center">
                  <span className="text-2xl font-mono font-bold">G</span>
                </div>
                <div>
                  <div className="text-xl font-mono font-bold">GSMA 认证</div>
                  <div className="text-sm text-gray-500 font-mono">符合 SGP.22 标准 • 安全有保障</div>
                  <div className="text-xs text-gray-400 font-mono mt-1">证书编号：GSMA-SGP22-2024-001</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">API 版本</div>
                <div className="font-mono font-bold text-lg">v2.1.0</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">协议</div>
                <div className="font-mono font-bold text-lg">SGP.22</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">加密</div>
                <div className="font-mono font-bold text-lg">AES-256</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">合规</div>
                <div className="font-mono font-bold text-lg">GSMA</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-mono font-bold mb-8 tracking-wide text-xl">联系方式</h4>
            <div className="space-y-6">
              <div className="group">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin size={16} className="text-gray-500" />
                  <div className="text-gray-500 text-xs font-mono">总部</div>
                </div>
                <div className="group-hover:text-gray-600 transition-colors pl-7">
                  缅甸仰光
                  <br />
                  数字创新区
                  <br />
                  7 号楼 12 层
                </div>
              </div>
              <div className="group">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail size={16} className="text-gray-500" />
                  <div className="text-gray-500 text-xs font-mono">邮箱</div>
                </div>
                <div className="font-mono group-hover:text-gray-600 transition-colors pl-7">
                  contact@nexorasim.com
                  <br />
                  support@nexorasim.com
                </div>
              </div>
              <div className="group">
                <div className="flex items-center space-x-3 mb-2">
                  <Phone size={16} className="text-gray-500" />
                  <div className="text-gray-500 text-xs font-mono">支持热线</div>
                </div>
                <div className="font-mono group-hover:text-gray-600 transition-colors pl-7">
                  7×24 技术支持
                  <br />
                  +95-1-NEXORA-1
                  <br />
                  紧急：+95-1-NEXORA-911
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-mono font-bold mb-8 tracking-wide text-xl">性能指标</h4>
            <div className="space-y-6">
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">可用率</div>
                <div className="font-mono font-bold text-2xl">99.99%</div>
                <div className="text-xs text-gray-400">SLA 保障</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">延迟</div>
                <div className="font-mono font-bold text-2xl">{"< 30ms"}</div>
                <div className="text-xs text-gray-400">全球平均</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">吞吐量</div>
                <div className="font-mono font-bold text-2xl">10K+</div>
                <div className="text-xs text-gray-400">请求/秒</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">覆盖范围</div>
                <div className="font-mono font-bold text-2xl">全球</div>
                <div className="text-xs text-gray-400">23 个区域</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">扩缩容</div>
                <div className="font-mono font-bold text-2xl">自动</div>
                <div className="text-xs text-gray-400">Vercel 边缘</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t-2 border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 font-mono mb-6 md:mb-0">
              © 2024 NEXORASIM™. 保留所有权利。• 缅甸数字基础设施
            </div>

            <div className="flex items-center space-x-8 text-sm font-mono">
              <span className="flex items-center space-x-2 group">
                <div className="w-2 h-2 bg-black animate-pulse"></div>
                <span className="group-hover:text-gray-600 transition-colors">由 Vercel 驱动</span>
              </span>
              <span className="flex items-center space-x-2 group">
                <div className="w-2 h-2 bg-gray-400"></div>
                <span className="group-hover:text-gray-600 transition-colors">AI 驱动</span>
              </span>
              <span className="flex items-center space-x-2 group">
                <div className="w-2 h-2 bg-black"></div>
                <span className="group-hover:text-gray-600 transition-colors">缅甸就绪</span>
              </span>
              <span className="flex items-center space-x-2 group">
                <div className="w-2 h-2 bg-gray-600"></div>
                <span className="group-hover:text-gray-600 transition-colors">GSMA 合规</span>
              </span>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 text-center">
            <div className="text-xs font-mono text-gray-400 space-x-6">
              <span>基于 NEXT.JS 15 构建</span>
              <span>•</span>
              <span>部署于 VERCEL 边缘</span>
              <span>•</span>
              <span>TLS 1.3 加密保护</span>
              <span>•</span>
              <span>7×24 监控</span>
              <span>•</span>
              <span>GSMA SGP.22 认证</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
