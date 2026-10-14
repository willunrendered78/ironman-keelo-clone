import { startOfDay, dayKey } from '../lib/util.js'

/** Workouts per week, last N weeks. */
export function WeeklyBars({ logs, weeks = 10 }) {
  const wk = 7 * 864e5
  const startThis = startOfDay(Date.now()) - ((new Date().getDay() + 6) % 7) * 864e5 // Monday
  const data = Array.from({ length: weeks }, (_, i) => {
    const from = startThis - (weeks - 1 - i) * wk
    return { from, n: logs.filter((l) => l.ts >= from && l.ts < from + wk).length }
  })
  const max = Math.max(4, ...data.map((d) => d.n))
  const W = 400, H = 140, bw = W / weeks
  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} className="w-full" role="img" aria-label="Workouts per week">
      {[0, 0.5, 1].map((t) => <line key={t} x1="0" x2={W} y1={H - t * (H - 14)} y2={H - t * (H - 14)} stroke="#3f3f46" strokeDasharray="2 4" />)}
      {data.map((d, i) => {
        const h = (d.n / max) * (H - 14)
        return (
          <g key={i}>
            <rect x={i * bw + 6} y={H - h} width={bw - 12} height={Math.max(h, 1)} fill={i === weeks - 1 ? '#fff' : '#71717a'} />
            {d.n > 0 && <text x={i * bw + bw / 2} y={H - h - 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">{d.n}</text>}
            <text x={i * bw + bw / 2} y={H + 14} textAnchor="middle" fill="#a1a1aa" fontSize="9">{new Date(d.from).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</text>
          </g>
        )
      })}
    </svg>
  )
}

/** Frequency map: columns = weeks, rows = Mon..Sun. */
export function FrequencyMap({ logs, weeks = 18 }) {
  const counts = {}
  logs.forEach((l) => { const k = dayKey(l.ts); counts[k] = (counts[k] || 0) + 1 })
  const monday = startOfDay(Date.now()) - ((new Date().getDay() + 6) % 7) * 864e5
  const cell = 16, gap = 3
  const cols = Array.from({ length: weeks }, (_, w) => Array.from({ length: 7 }, (_, d) => {
    const t = monday - (weeks - 1 - w) * 7 * 864e5 + d * 864e5
    return { t, n: counts[dayKey(t)] || 0, future: t > Date.now() }
  }))
  const fill = (n) => (n === 0 ? '#27272a' : n === 1 ? '#a1a1aa' : '#fff')
  const W = weeks * (cell + gap)
  return (
    <svg viewBox={`0 0 ${W} ${7 * (cell + gap)}`} className="w-full" role="img" aria-label="Workout frequency map">
      {cols.map((col, w) => col.map((c, d) => !c.future && (
        <rect key={`${w}-${d}`} x={w * (cell + gap)} y={d * (cell + gap)} width={cell} height={cell} fill={fill(c.n)}>
          <title>{new Date(c.t).toLocaleDateString()}: {c.n} workout{c.n === 1 ? '' : 's'}</title>
        </rect>
      )))}
    </svg>
  )
}

/** Simple line chart; values oriented so that "better" is up (caller inverts if needed). */
export function Line({ points, fmt = (v) => v }) {
  if (points.length < 2) return <div className="text-sm text-mute py-10 text-center border border-dashed border-line">Log this workout at least twice to see a trend.</div>
  const W = 400, H = 140, pad = 8
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y)
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
  const px = (x) => pad + ((x - x0) / (x1 - x0 || 1)) * (W - 2 * pad)
  const py = (y) => H - pad - ((y - y0) / (y1 - y0 || 1)) * (H - 2 * pad)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Score progression">
      <polyline points={points.map((p) => `${px(p.x)},${py(p.y)}`).join(' ')} fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="miter" />
      {points.map((p, i) => (
        <rect key={i} x={px(p.x) - 4} y={py(p.y) - 4} width="8" height="8" fill="#fff" transform={`rotate(45 ${px(p.x)} ${py(p.y)})`}><title>{fmt(p.raw)}</title></rect>
      ))}
    </svg>
  )
}

export function Bar({ value, label, right }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span className="uppercase tracking-[0.18em] font-bold">{label}</span><span className="text-mute font-mono">{right}</span></div>
      <div className="h-2 bg-ink border border-line"><div className="h-full bg-white" style={{ width: `${Math.round(value * 100)}%` }} /></div>
    </div>
  )
}
