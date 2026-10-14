import { WORKOUTS, GROUPS, GROUP_LABEL, accessible } from './data.js'

const DAY = 864e5

/** Recency-weighted training load per muscle group (half-life ~3 days). */
export function groupLoad(logs, now = Date.now()) {
  const load = Object.fromEntries(GROUPS.map((g) => [g, 0]))
  for (const l of logs) {
    const w = Math.exp(-(now - l.ts) / DAY / 4.3)
    for (const g of l.groups || []) if (g in load) load[g] += w
  }
  return load
}

/**
 * Pick workouts that hit the least-stimulated muscle groups, skipping
 * recently-done sessions and anything the current equipment can't support.
 */
export function recommend(logs, equipment, now = Date.now()) {
  const load = groupLoad(logs, now)
  const max = Math.max(...Object.values(load), 1)
  const pool = WORKOUTS.filter((w) => accessible(w, equipment))
  const scored = pool.map((w) => {
    const need = w.groups.reduce((s, g) => s + (max - load[g]) / max, 0) / w.groups.length
    const last = logs.filter((l) => l.workoutId === w.id).sort((a, b) => b.ts - a.ts)[0]
    const ageDays = last ? (now - last.ts) / DAY : 99
    const penalty = ageDays < 3 ? 1.5 : ageDays < 7 ? 0.4 : 0
    return { workout: w, score: need - penalty + Math.min(ageDays, 30) * 0.004 }
  })
  scored.sort((a, b) => b.score - a.score)
  const out = scored.map((s) => ({ ...s, reason: reasonFor(s.workout, load, logs.length) }))
  return out
}

function reasonFor(w, load, n) {
  if (!n) return 'Fresh start. A balanced full-body session to set your baseline.'
  const ranked = [...GROUPS].sort((a, b) => load[a] - load[b])
  const hit = ranked.filter((g) => w.groups.includes(g)).slice(0, 2).map((g) => GROUP_LABEL[g].toLowerCase())
  return `Your ${hit.join(' and ')} ${hit.length > 1 ? 'have' : 'has'} had the least stimulus lately. This session targets ${hit.length > 1 ? 'them' : 'it'} directly.`
}
