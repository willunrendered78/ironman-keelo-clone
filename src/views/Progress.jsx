import { useMemo, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { GROUPS, GROUP_LABEL, WORKOUTS, getWorkout } from '../lib/data.js'
import { groupLoad } from '../lib/recommend.js'
import { fmtScore, fmtTime, scoreValue } from '../lib/util.js'
import { RadarArt } from '../components/Art.jsx'
import { Section, Stat, Tag } from '../components/UI.jsx'
import { WeeklyBars, FrequencyMap, Line, Bar } from '../components/Charts.jsx'

export default function Progress() {
  const { state, dispatch } = useStore()
  const { logs } = state
  const [sel, setSel] = useState('')
  const [adding, setAdding] = useState(false)

  const month = logs.filter((l) => l.ts > Date.now() - 28 * 864e5)
  const load = groupLoad(logs)
  const max = Math.max(...Object.values(load), 1)
  const norm = GROUPS.map((g) => load[g] / max)
  const balance = norm.length ? 1 - (Math.max(...norm) - Math.min(...norm)) / 1 : 0
  const consistency = Math.min(month.length / 12, 1)
  const index = logs.length ? Math.round(consistency * 60 + (balance * 40)) : 0

  const done = useMemo(() => [...new Set(logs.map((l) => l.workoutId))], [logs])
  const active = sel || done[0] || ''
  const aw = getWorkout(active)
  const pts = logs.filter((l) => l.workoutId === active).sort((a, b) => a.ts - b.ts).map((l) => ({ x: l.ts, raw: l.score, y: aw?.type === 'FORTIME' ? -scoreValue(l.score) : scoreValue(l.score) }))
  const history = [...logs].sort((a, b) => b.ts - a.ts)

  return (
    <>
      <div className="grid md:grid-cols-5 gap-6 mb-10">
        <div className="md:col-span-2 card">
          <RadarArt values={logs.length ? norm : null} className="w-full" />
          <div className="p-5 border-t border-line">
            <div className="label">Ironman index</div>
            <div className="text-6xl font-black font-mono">{index}<span className="text-xl text-mute">/100</span></div>
            <p className="text-xs text-mute mt-2">60% consistency (12 sessions per 28 days = full marks) + 40% muscle-group balance.</p>
          </div>
        </div>
        <div className="md:col-span-3 grid grid-cols-2 gap-3 content-start">
          <Stat label="Sessions" value={logs.length} />
          <Stat label="Last 28 days" value={month.length} sub={`${consistency >= 1 ? 'Target hit' : `${12 - month.length} to target`}`} />
          <Stat label="Balance" value={`${Math.round(balance * 100)}%`} />
          <Stat label="Total time" value={fmtTime(logs.reduce((s, l) => s + (l.seconds || 0), 0))} />
          <div className="col-span-2 card p-5 space-y-3">
            {GROUPS.map((g, i) => <Bar key={g} label={GROUP_LABEL[g]} value={norm[i]} right={load[g].toFixed(1)} />)}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Section title="Workouts per week"><div className="card p-5"><WeeklyBars logs={logs} /></div></Section>
        <Section title="Frequency map · 18 weeks"><div className="card p-5"><FrequencyMap logs={logs} />
          <div className="flex gap-3 text-[10px] text-mute mt-3 items-center uppercase tracking-widest"><span className="w-3 h-3 bg-smoke border border-line" />0<span className="w-3 h-3 bg-mute" />1<span className="w-3 h-3 bg-white" />2+</div></div></Section>
      </div>

      <Section title="Score progression" right={done.length > 0 && <select className="!w-auto" value={active} onChange={(e) => setSel(e.target.value)} aria-label="Workout">{done.map((d) => <option key={d} value={d}>{getWorkout(d).name}</option>)}</select>}>
        <div className="card p-5">{done.length ? <><Line points={pts} fmt={fmtScore} /><div className="text-xs text-mute mt-2">{aw.type === 'FORTIME' ? 'Faster is higher.' : 'More rounds is higher.'}</div></> : <div className="text-sm text-mute py-8 text-center">No history yet. <a className="underline text-white" href="#/dashboard">Get today's workout</a>.</div>}</div>
      </Section>

      <Section title="History" right={<button className="btn-ghost !py-2" onClick={() => setAdding(true)}>+ Log manually</button>}>
        {adding && <ManualLog onClose={() => setAdding(false)} dispatch={dispatch} />}
        <div className="border border-line divide-y divide-line">
          {history.map((l) => (
            <div key={l.id} className="p-4 flex flex-wrap items-center gap-x-6 gap-y-1">
              <div className="min-w-0 flex-1"><div className="font-black uppercase">{l.name}</div><div className="text-xs text-mute">{new Date(l.ts).toLocaleString()}{l.notes ? ` · ${l.notes}` : ''}</div>
                {l.sets && Object.entries(l.sets).filter(([, v]) => v).length > 0 && <div className="text-xs text-mute font-mono mt-1">{Object.entries(l.sets).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(' · ')}</div>}</div>
              <Tag solid>{fmtScore(l.score)}</Tag>
              <button className="label hover:text-white" onClick={() => dispatch({ type: 'deleteLog', id: l.id })} aria-label={`Delete ${l.name}`}>Delete</button>
            </div>
          ))}
          {!history.length && <div className="p-8 text-center text-sm text-mute">Nothing logged. Do a workout.</div>}
        </div>
      </Section>
    </>
  )
}

function ManualLog({ onClose, dispatch }) {
  const [wid, setWid] = useState(WORKOUTS[0].id)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [v, setV] = useState({ rounds: '', reps: '', time: '', notes: '' })
  const w = getWorkout(wid)
  function submit(e) {
    e.preventDefault()
    let score, seconds = 0
    if (w.type === 'AMRAP') { score = { rounds: Number(v.rounds) || 0, reps: Number(v.reps) || 0 }; seconds = w.minutes * 60 }
    else { seconds = v.time.split(':').map(Number).reduce((a, b) => a * 60 + b, 0) || 0; score = { seconds } }
    dispatch({ type: 'log', log: { workoutId: wid, ts: new Date(date + 'T12:00:00').getTime(), score, seconds, notes: v.notes } })
    onClose()
  }
  return (
    <form onSubmit={submit} className="card p-5 mb-4 grid sm:grid-cols-4 gap-3">
      <label className="sm:col-span-2"><span className="label">Workout</span><select value={wid} onChange={(e) => setWid(e.target.value)}>{WORKOUTS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      <label className="sm:col-span-2"><span className="label">Date</span><input type="date" value={date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} required /></label>
      {w.type === 'AMRAP' ? (<>
        <label><span className="label">Rounds</span><input type="number" min="0" required value={v.rounds} onChange={(e) => setV({ ...v, rounds: e.target.value })} /></label>
        <label><span className="label">Reps</span><input type="number" min="0" value={v.reps} onChange={(e) => setV({ ...v, reps: e.target.value })} /></label>
      </>) : <label className="sm:col-span-2"><span className="label">Time (mm:ss)</span><input required pattern="\d+(:\d{1,2}){1,2}" placeholder="12:34" value={v.time} onChange={(e) => setV({ ...v, time: e.target.value })} /></label>}
      <label className="sm:col-span-2"><span className="label">Notes</span><input value={v.notes} onChange={(e) => setV({ ...v, notes: e.target.value })} /></label>
      <div className="sm:col-span-4 flex gap-3"><button className="btn">Save</button><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </form>
  )
}
