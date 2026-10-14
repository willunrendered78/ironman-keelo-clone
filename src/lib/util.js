export const fmtTime = (s) => {
  s = Math.max(0, Math.round(s))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  const mm = String(m).padStart(2, '0'), ss = String(sec).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
export const fmtScore = (sc) => (!sc ? '—' : sc.seconds != null ? fmtTime(sc.seconds) : `${sc.rounds} rds + ${sc.reps || 0}`)
export const ago = (ts) => {
  const d = Date.now() - ts, m = Math.floor(d / 6e4)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m`
  if (m < 1440) return `${Math.floor(m / 60)}h`
  return `${Math.floor(m / 1440)}d`
}
export const dayKey = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` }
export const startOfDay = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime() }
// numeric value for comparing scores of the same workout
export const scoreValue = (sc) => (!sc ? 0 : sc.seconds != null ? sc.seconds : sc.rounds * 1000 + (sc.reps || 0))
export const uid = () => Math.random().toString(36).slice(2, 10)
