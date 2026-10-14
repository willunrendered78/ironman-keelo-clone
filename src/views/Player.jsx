import { useEffect, useRef, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { getWorkout } from '../lib/data.js'
import { fmtTime } from '../lib/util.js'
import { PlankArt } from '../components/Art.jsx'
import { Photo } from '../components/Photo.jsx'
import { GroupTags, Tag, go } from '../components/UI.jsx'

/** Wall-clock based so it stays accurate when the tab is throttled. */
function useClock() {
  const [, tick] = useState(0)
  const ref = useRef({ acc: 0, start: null })
  useEffect(() => { const t = setInterval(() => tick((n) => n + 1), 100); return () => clearInterval(t) }, [])
  const elapsed = () => (ref.current.acc + (ref.current.start ? Date.now() - ref.current.start : 0)) / 1000
  return {
    elapsed,
    running: ref.current.start != null,
    start() { if (!ref.current.start) { ref.current.start = Date.now(); tick((n) => n + 1) } },
    pause() { if (ref.current.start) { ref.current.acc += Date.now() - ref.current.start; ref.current.start = null; tick((n) => n + 1) } },
    reset() { ref.current = { acc: 0, start: null }; tick((n) => n + 1) },
  }
}

export default function Player({ id }) {
  const w = getWorkout(id)
  const { dispatch } = useStore()
  const clock = useClock()
  const [phase, setPhase] = useState('brief') // brief | run | done
  const [checked, setChecked] = useState([])
  const [splits, setSplits] = useState([])
  const [focus, setFocus] = useState(() => Math.max(0, (w?.m || []).findIndex((m) => m.cx)))
  const [final, setFinal] = useState(0)
  const [form, setForm] = useState({ rounds: 0, reps: 0, time: '', notes: '', sets: {} })

  const total = w?.type === 'AMRAP' ? w.minutes * 60 : 0
  const el = clock.elapsed()
  const remaining = Math.max(0, total - el)

  useEffect(() => {
    if (phase === 'run' && w?.type === 'AMRAP' && el >= total) finish()
  })

  if (!w) return <div className="py-20 text-center"><p className="mb-4 text-mute">Workout not found.</p><a href="#/library" className="btn">Library</a></div>

  function begin() { clock.reset(); setSplits([]); setPhase('run'); clock.start() }
  function finish() {
    clock.pause()
    const secs = Math.min(clock.elapsed(), w.type === 'AMRAP' ? total : 1e9)
    setFinal(secs)
    setForm((f) => ({ ...f, rounds: splits.length, time: fmtTime(secs) }))
    setPhase('done')
  }
  function save() {
    let score
    if (w.type === 'AMRAP') score = { rounds: Number(form.rounds) || 0, reps: Number(form.reps) || 0 }
    else {
      const parts = form.time.split(':').map(Number)
      const secs = parts.some(isNaN) ? final : parts.reduce((a, b) => a * 60 + b, 0)
      score = { seconds: secs }
    }
    dispatch({ type: 'log', log: { workoutId: w.id, ts: Date.now(), score, seconds: Math.round(final), splits, notes: form.notes, sets: form.sets } })
    go('progress')
  }

  const mv = w.m[focus] || w.m[0]
  const shown = w.m.find((m, i) => i === focus && m.cx)
  const big = w.type === 'AMRAP' ? remaining : el
  const urgent = w.type === 'AMRAP' && phase === 'run' && remaining <= 10

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => { clock.pause(); history.back() }} className="label hover:text-white mb-4">← Back</button>
      <div className="flex flex-wrap items-start gap-3 justify-between mb-6">
        <div>
          <div className="label">{w.type === 'AMRAP' ? `AMRAP · ${w.minutes} minute cap` : `For time${w.rounds > 1 ? ` · ${w.rounds} rounds` : ''} · ${w.cap} min cap`}</div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mt-1">{w.name}</h1>
        </div>
        <GroupTags groups={w.groups} />
      </div>

      {phase !== 'done' && (
        <div className={`card p-6 md:p-10 text-center mb-6 ${urgent ? 'border-white' : ''}`}>
          <div className="label">{w.type === 'AMRAP' ? 'Countdown' : 'Elapsed'}</div>
          <div className={`font-mono font-black tabular-nums text-7xl md:text-9xl leading-none mt-3 ${urgent && Math.floor(remaining * 2) % 2 ? 'opacity-40' : ''}`} aria-live="off">{fmtTime(w.type === 'AMRAP' && phase === 'brief' ? total : big)}</div>
          {phase === 'brief' && <button className="btn mt-8" onClick={begin}>Start {w.type === 'AMRAP' ? 'countdown' : 'timer'}</button>}
          {phase === 'run' && (
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button className="btn" onClick={() => (clock.running ? clock.pause() : clock.start())}>{clock.running ? 'Pause' : 'Resume'}</button>
              <button className="btn-ghost" onClick={() => setSplits((s) => [...s, Math.round(clock.elapsed())])}>+ Round ({splits.length})</button>
              <button className="btn-ghost" onClick={finish}>Finish</button>
            </div>
          )}
          {phase === 'run' && splits.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center font-mono text-xs text-mute">
              {splits.map((s, i) => <span key={i} className="border border-line px-2 py-1">R{i + 1} {fmtTime(i ? s - splits[i - 1] : s)}</span>)}
            </div>
          )}
        </div>
      )}

      {phase !== 'done' && (
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-6">
            {phase === 'brief' && (
              <div>
                <h2 className="label !text-white mb-3">Warm-up</h2>
                <ul className="border border-line divide-y divide-line">
                  {w.warmup.map((x, i) => (
                    <li key={i}>
                      <label className="flex items-center gap-3 p-3 cursor-pointer">
                        <input type="checkbox" className="!w-4 !h-4 accent-white" checked={checked.includes(i)} onChange={() => setChecked((c) => c.includes(i) ? c.filter((n) => n !== i) : [...c, i])} />
                        <span className={`text-sm ${checked.includes(i) ? 'line-through text-dim' : ''}`}>{x}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h2 className="label !text-white mb-3">{w.type === 'AMRAP' ? 'Repeat for as many rounds as possible' : w.rounds > 1 ? `${w.rounds} rounds` : 'Complete in order'}</h2>
              <ol className="border border-line divide-y divide-line">
                {w.m.map((m, i) => (
                  <li key={m.n}>
                    <button onClick={() => setFocus(i)} className={`w-full flex items-center gap-4 p-4 text-left ${focus === i ? 'bg-smoke' : 'hover:bg-char'}`}>
                      <span className="font-mono text-mute w-5">{i + 1}</span>
                      <span className="font-mono font-bold text-xl w-20 shrink-0">{m.r}</span>
                      <span className="flex-1 uppercase font-bold tracking-wide text-sm">{m.n}</span>
                      {m.cx && <Tag>Diagram</Tag>}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="card sticky top-20">
              <Photo name="plank" pos="center 35%" className="w-full h-36 border-b border-line" />
              {shown ? <PlankArt highlight={shown.hl} className="w-full" /> : <div className="aspect-[760/360] grid place-items-center text-xs text-mute uppercase tracking-[0.2em] p-6 text-center">No diagram for this movement</div>}
              <div className="p-4 border-t border-line"><div className="label">Selected</div><div className="font-black uppercase mt-1">{mv.n}</div>
                {shown && <div className="text-xs text-mute mt-1">Working: {shown.hl.join(', ')}</div>}</div>
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="card p-6 md:p-8 max-w-xl">
          <div className="label">Workout complete</div>
          <div className="font-mono font-black text-6xl mt-2">{fmtTime(final)}</div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {w.type === 'AMRAP' ? (<>
              <label><span className="label">Rounds</span><input type="number" min="0" value={form.rounds} onChange={(e) => setForm({ ...form, rounds: e.target.value })} /></label>
              <label><span className="label">Extra reps</span><input type="number" min="0" value={form.reps} onChange={(e) => setForm({ ...form, reps: e.target.value })} /></label>
            </>) : (
              <label className="col-span-2"><span className="label">Finish time (mm:ss)</span><input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label>
            )}
          </div>
          <div className="mt-6"><div className="label mb-2">Set scores (best set reps / load, optional)</div>
            <div className="grid grid-cols-2 gap-3">
              {w.m.map((m) => <label key={m.n} className="text-xs text-mute">{m.n}<input className="mt-1" placeholder="e.g. 12 or 12 @ 40kg" value={form.sets[m.n] || ''} onChange={(e) => setForm({ ...form, sets: { ...form.sets, [m.n]: e.target.value } })} /></label>)}
            </div></div>
          <label className="block mt-6"><span className="label">Notes (shared to Fam)</span><textarea rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
          <div className="flex gap-3 mt-6"><button className="btn" onClick={save}>Log workout</button><button className="btn-ghost" onClick={() => go('dashboard')}>Discard</button></div>
        </div>
      )}
    </div>
  )
}
