/**
 * 大字 outline 跑马灯分隔带：黑底白描边空心字持续平移，
 * 内容渲染两份实现无缝循环（transform 动画，合成器直通）。
 */
export default function MarqueeBand() {
  const words = ["GRAPHIC DESIGN", "PHOTOGRAPHY", "3D ART", "GAME PM", "FILM", "OPERATIONS"]
  const sequence = words.map((w) => `${w} · `).join("")

  return (
    <section className="bg-black py-10 sm:py-14 overflow-hidden border-t border-white/10" aria-hidden="true">
      <div className="flex w-max animate-marquee select-none">
        <span className="shrink-0 whitespace-nowrap font-mono text-5xl sm:text-7xl font-bold tracking-tight text-outline-white pr-4">
          {sequence}
        </span>
        <span className="shrink-0 whitespace-nowrap font-mono text-5xl sm:text-7xl font-bold tracking-tight text-outline-white pr-4">
          {sequence}
        </span>
      </div>
    </section>
  )
}
