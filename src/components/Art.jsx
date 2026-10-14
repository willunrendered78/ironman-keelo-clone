// Original monochrome SVG artwork (black / smoke grey / white). Vector, so crisp at any viewport.
import { useId } from 'react'

export function BarbellArt({ className = '' }) {
  const id = useId()
  return (
    <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Knurled barbell end cap and matte black weight plate">
      <defs>
        <pattern id={`k${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#18181b" />
          <path d="M0 14 14 0M-3 3 3 -3M11 17 17 11" stroke="#71717a" strokeWidth="2" />
          <path d="M0 0 14 14M-3 11 3 17M11 -3 17 3" stroke="#3f3f46" strokeWidth="2" />
        </pattern>
        <linearGradient id={`bg${id}`} x1="0" x2="1"><stop offset="0" stopColor="#000" /><stop offset="1" stopColor="#27272a" /></linearGradient>
        <linearGradient id={`sh${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset=".25" stopColor="#fff" stopOpacity="0" /><stop offset=".8" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".7" /></linearGradient>
      </defs>
      <rect width="1200" height="420" fill={`url(#bg${id})`} />
      {/* bar with knurling */}
      <rect x="-20" y="170" width="640" height="80" fill={`url(#k${id})`} />
      <rect x="-20" y="170" width="640" height="80" fill={`url(#sh${id})`} />
      <rect x="560" y="150" width="60" height="120" fill="#52525b" />
      <rect x="560" y="150" width="60" height="120" fill={`url(#sh${id})`} />
      {/* end cap + sleeve collar */}
      <rect x="620" y="140" width="70" height="140" fill="#3f3f46" />
      <rect x="620" y="140" width="70" height="140" fill={`url(#sh${id})`} />
      {/* plate */}
      <circle cx="900" cy="210" r="260" fill="#050505" stroke="#3f3f46" strokeWidth="3" />
      <circle cx="900" cy="210" r="232" fill="none" stroke="#27272a" strokeWidth="10" />
      <circle cx="900" cy="210" r="196" fill="none" stroke="#18181b" strokeWidth="4" />
      <circle cx="900" cy="210" r="120" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="3" />
      <circle cx="900" cy="210" r="52" fill="#27272a" stroke="#71717a" strokeWidth="3" />
      <circle cx="900" cy="210" r="30" fill="#000" />
      <path d="M690 130v160" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
      <text x="900" y="90" fill="#52525b" fontSize="34" fontWeight="800" letterSpacing="14" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">20 KG</text>
      <circle cx="900" cy="210" r="260" fill={`url(#sh${id})`} />
    </svg>
  )
}

export function RopeArt({ className = '' }) {
  const id = useId()
  const coils = Array.from({ length: 9 }, (_, i) => i)
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Coiled battle rope, interlocking black fibers">
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#18181b" /><stop offset="1" stopColor="#27272a" /></linearGradient>
      </defs>
      <rect width="1200" height="500" fill={`url(#g${id})`} />
      {coils.map((i) => {
        const cy = 330 - i * 14, rx = 460 - i * 10, ry = 150 - i * 3
        return (
          <g key={i}>
            <ellipse cx="760" cy={cy} rx={rx} ry={ry} fill="none" stroke="#000" strokeWidth="38" />
            <ellipse cx="760" cy={cy} rx={rx} ry={ry} fill="none" stroke="#3f3f46" strokeWidth="30" strokeDasharray="7 11" />
            <ellipse cx="760" cy={cy - 6} rx={rx} ry={ry} fill="none" stroke="#71717a" strokeWidth="2" strokeDasharray="3 18" />
          </g>
        )
      })}
      {/* loose tail */}
      <path d="M300 420C180 470 90 380 -20 450" fill="none" stroke="#000" strokeWidth="38" />
      <path d="M300 420C180 470 90 380 -20 450" fill="none" stroke="#3f3f46" strokeWidth="30" strokeDasharray="7 11" />
    </svg>
  )
}

const REG = {
  shoulders: <path d="M560 128 628 120 650 168 590 190Z" />,
  arms: <path d="M588 190 640 170 656 300 606 304Z" />,
  core: <path d="M590 190 240 205 270 160 560 128Z" />,
  glutes: <path d="M270 160 240 205 170 232 190 170Z" />,
  legs: <path d="M190 170 170 232 70 292 52 262Z" />,
}
export function PlankArt({ highlight = [], className = '' }) {
  const id = useId()
  return (
    <svg viewBox="0 0 760 360" className={className} role="img" aria-label="Plank pose silhouette with working muscles highlighted">
      <defs>
        <pattern id={`h${id}`} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#52525b" /><path d="M0 8 8 0" stroke="#a1a1aa" strokeWidth="1.5" /></pattern>
      </defs>
      <rect width="760" height="360" fill="#000" />
      <path d="M30 316H730" stroke="#3f3f46" strokeWidth="2" />
      {[...Array(15)].map((_, i) => <path key={i} d={`M${60 + i * 46} 316l-14 18`} stroke="#27272a" strokeWidth="2" />)}
      <g stroke="#fff" strokeWidth="2" strokeLinejoin="miter" fill="#0a0a0a">
        <circle cx="690" cy="128" r="30" />
        <path d="M660 150 628 160" strokeWidth="14" />
        {Object.entries(REG).map(([k, el]) => (
          <g key={k} fill={highlight.includes(k) ? `url(#h${id})` : '#18181b'}>{el}</g>
        ))}
        <path d="M52 262 40 300 88 304 90 280" fill="#0a0a0a" />
        <path d="M606 304 596 316 664 316 656 300" fill="#0a0a0a" />
      </g>
      {highlight.map((k, i) => (
        <text key={k} x="28" y={40 + i * 22} fill="#a1a1aa" fontSize="13" fontWeight="700" letterSpacing="4" fontFamily="Inter,Arial,sans-serif">■ {k.toUpperCase()}</text>
      ))}
    </svg>
  )
}

const octa = (cx, cy, r) =>
  Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i - Math.PI / 8
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')

export function RadarArt({ values, className = '' }) {
  const c = 200
  const pts = values ? values.map((v, i) => {
    const a = ((Math.PI * 2) / values.length) * i - Math.PI / 2
    const r = 20 + 130 * v
    return `${(c + r * Math.cos(a)).toFixed(1)},${(c + r * Math.sin(a)).toFixed(1)}`
  }).join(' ') : null
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Ironman progress radar: three concentric angular rings">
      <rect width="400" height="400" fill="#27272a" />
      {[165, 110, 55].map((r, i) => <polygon key={r} points={octa(c, c, r)} fill="none" stroke="#fff" strokeWidth={i === 0 ? 5 : 3} strokeLinejoin="miter" />)}
      {Array.from({ length: 8 }, (_, i) => { const a = (Math.PI / 4) * i - Math.PI / 8; return <line key={i} x1={c} y1={c} x2={c + 165 * Math.cos(a)} y2={c + 165 * Math.sin(a)} stroke="#fff" strokeOpacity=".25" /> })}
      <path d={`M${c} ${c} L${c + 165} ${c - 10} A165 165 0 0 0 ${c + 140} ${c - 90}Z`} fill="#fff" fillOpacity=".22" />
      {pts && <polygon points={pts} fill="#fff" fillOpacity=".35" stroke="#fff" strokeWidth="2.5" />}
      <rect x={c - 6} y={c - 6} width="12" height="12" fill="#fff" transform={`rotate(45 ${c} ${c})`} />
    </svg>
  )
}
