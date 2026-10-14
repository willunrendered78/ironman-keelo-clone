import { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { WORKOUTS, GROUPS, GROUP_LABEL, accessible } from '../lib/data.js'
import { Photo } from '../components/Photo.jsx'
import { GroupTags, Tag, EquipmentToggle } from '../components/UI.jsx'

export default function Library() {
  const { state } = useStore()
  const [group, setGroup] = useState('all')
  const [type, setType] = useState('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)
  const list = WORKOUTS.filter((w) => accessible(w, state.equipment) && (group === 'all' || w.groups.includes(group)) && (type === 'all' || w.type === type) && (w.name + w.m.map((m) => m.n).join(' ')).toLowerCase().includes(q.toLowerCase()))
  const hidden = WORKOUTS.length - WORKOUTS.filter((w) => accessible(w, state.equipment)).length
  const chip = (on) => `px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] border ${on ? 'bg-white text-ink border-white' : 'border-line text-mute hover:text-white'}`

  return (
    <>
      <section className="relative overflow-hidden border border-line mb-6 h-56 md:h-72">
        <Photo name="barbell" pos="center 55%" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="absolute bottom-0 p-6">
          <div className="label">Library</div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">Equipment &amp; Workouts</h1>
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
        <EquipmentToggle />
        <input placeholder="Search workouts or movements" value={q} onChange={(e) => setQ(e.target.value)} className="md:max-w-xs" aria-label="Search" />
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {['all', ...GROUPS].map((g) => <button key={g} onClick={() => setGroup(g)} className={chip(group === g)}>{g === 'all' ? 'All muscles' : GROUP_LABEL[g]}</button>)}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {[['all', 'All formats'], ['AMRAP', 'AMRAP'], ['FORTIME', 'For time']].map(([v, l]) => <button key={v} onClick={() => setType(v)} className={chip(type === v)}>{l}</button>)}
      </div>
      {hidden > 0 && <p className="text-xs text-mute mb-4">{hidden} gym workouts hidden. Switch to Full Gym to see everything.</p>}

      <div className="grid md:grid-cols-2 gap-3">
        {list.map((w) => (
          <article key={w.id} className="card">
            <button onClick={() => setOpen(open === w.id ? null : w.id)} className="w-full text-left p-5" aria-expanded={open === w.id}>
              <div className="flex justify-between gap-3 items-start">
                <h3 className="text-2xl font-black uppercase">{w.name}</h3>
                <Tag solid>{w.type === 'AMRAP' ? `AMRAP ${w.minutes}'` : 'For time'}</Tag>
              </div>
              <p className="text-sm text-mute mt-1 mb-3">{w.desc}</p>
              <div className="flex flex-wrap gap-3 items-center"><GroupTags groups={w.groups} /><Tag>{w.equipment === 'gym' ? 'Gym' : 'Bodyweight'}</Tag><Tag>{w.level}</Tag></div>
            </button>
            {open === w.id && (
              <div className="border-t border-line p-5">
                <ul className="font-mono text-sm space-y-1 mb-5">{w.m.map((m) => <li key={m.n}><span className="text-white">{m.r}</span> <span className="text-ash">{m.n}</span></li>)}</ul>
                <a href={`#/player/${w.id}`} className="btn">Start workout →</a>
              </div>
            )}
          </article>
        ))}
      </div>
      {!list.length && <div className="border border-dashed border-line p-10 text-center text-mute">No workouts match. Loosen a filter.</div>}
    </>
  )
}
