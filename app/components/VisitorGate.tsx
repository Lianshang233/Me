"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// CounterAPI v1：公开、无需认证的托管计数服务，适合 GitHub Pages 静态站全站共享计数
const COUNTER_NS = "lianshang-portfolio"
const COUNTER_KEY = "visits"
const GET_URL = `https://api.counterapi.dev/v1/${COUNTER_NS}/${COUNTER_KEY}/`
const UP_URL = `https://api.counterapi.dev/v1/${COUNTER_NS}/${COUNTER_KEY}/up`
// 同一会话内已同意则不再弹窗、不重复计数
const SESSION_KEY = "ls_visit_consent"

type Status = "pending" | "agreed" | "declined"

interface VisitorState {
  count: number | null
  status: Status
}

const VisitorContext = createContext<VisitorState>({ count: null, status: "pending" })

export function useVisitor() {
  return useContext(VisitorContext)
}

function parseCount(data: unknown): number | null {
  if (data && typeof data === "object" && "count" in data) {
    const c = (data as { count: unknown }).count
    if (typeof c === "number") return c
  }
  return null
}

export default function VisitorGate({ children }: { children: ReactNode }) {
  const [count, setCount] = useState<number | null>(null)
  const [status, setStatus] = useState<Status>("pending")

  // 挂载时读取当前累计数用于展示；若本会话已同意则直接放行
  useEffect(() => {
    let alive = true
    const consented = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1"
    if (consented) setStatus("agreed")

    fetch(GET_URL)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setCount(parseCount(d))
      })
      .catch(() => {})

    return () => {
      alive = false
    }
  }, [])

  const agree = async () => {
    setStatus("agreed")
    try {
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {}
    try {
      const r = await fetch(UP_URL)
      const d = await r.json()
      const c = parseCount(d)
      if (c !== null) setCount(c)
    } catch {
      // 计数失败不阻塞访问，保持已展示数值
    }
  }

  const decline = () => setStatus("declined")
  const reconsider = () => setStatus("pending")

  return (
    <VisitorContext.Provider value={{ count, status }}>
      {children}

      {status === "pending" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="visit-gate-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-black animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500">Visitor Notice</span>
            </div>
            <h2 id="visit-gate-title" className="mb-3 font-mono text-xl font-bold tracking-wide text-black">
              访客计量提示
            </h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              您将进入访客计量网站，若您不同意计数则无法访问。是否同意？
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={agree}
                className="flex-1 rounded-lg bg-black px-4 py-3 font-mono text-sm font-bold tracking-wide text-white transition-colors hover:bg-gray-800"
              >
                我同意
              </button>
              <button
                onClick={decline}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm font-bold tracking-wide text-gray-700 transition-colors hover:bg-gray-50"
              >
                不同意
              </button>
            </div>
          </div>
        </div>
      )}

      {status === "declined" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-md text-center">
            <h2 className="mb-3 font-mono text-xl font-bold tracking-wide text-black">无法访问</h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              您已选择不同意访客计量，因此无法访问本站内容。如需访问，请重新选择并同意计数。
            </p>
            <button
              onClick={reconsider}
              className="rounded-lg bg-black px-6 py-3 font-mono text-sm font-bold tracking-wide text-white transition-colors hover:bg-gray-800"
            >
              重新选择
            </button>
          </div>
        </div>
      )}
    </VisitorContext.Provider>
  )
}
