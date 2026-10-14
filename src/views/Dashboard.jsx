import { useMemo } from 'react'
import { useStore } from '../lib/store.jsx'
import { recommend, groupLoad } from '../lib/recommend.js'
import { GROUPS, GROUP_LABEL, getWorkout } from '../lib/data.js'
import { fmtTime, fmtScore, ago, startOfDay } from '../lib/util.js'
import { RopeArt } from '../components/Art.jsx'
import { Photo } from '../components/Photo.jsx'
import { GroupTags, Tag, Section, Stat, Avatar } from '../components/UI.jsx'
import { Bar } from '../components/Charts.jsx'
import { USERS } from '../lib/data.js'

export default function Dashboard() {
  const { state } = useStore()
  const recs = useMemo(() => recommend(state.logs, state.equipment), [state.logs, state.equipment])
  const top = recs[0], others = recs.slice(1, 3)
  const w = top.workout
  const load = groupLoad(state.logs)
  const max = Math.max(...Object.values(load), 1)
  const weekAgo = Date.now() - 7 * 864e5
  const thisWeek = state.logs.filter((l) => l.ts > weekAgo)
  const days = new Set(state.logs.map((l) => startOfDay(l.ts)))
  let streak = 0
  let d = startOfDay(Date.now())
  if (!days.has(d)) d -= 864e5
  while (days.has(d)) { streak++; d -= 864e5 }
  const feed = state.posts.filter((p) => p.userId === 'me' || state.following.includes(p.userId)).slice(0, 4)

  return (
    <>
      <section className="relative overflow-hidden border border-line mb-8">
        <RopeArt className="absolute inset-0 w-full h-full opacity-40" />
        <Photo name="rope" pos="center 60%" className="absolute right-0 top-0 h-full w-full md:w-3/5 opacity-50 md:opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 md:via-ink/60 to-transparent" />
        <div className="relative p-6 md:p-12 max-w-2xl">
          <div className="label">Today's recommended workout</div>
          <h1 className="mt-4 text-5xl md:text-7xl font-black uppercase tracking-tight leading-none">{w.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Tag solid>{w.type === 'AMRAP' ? `AMRAP ${w.minutes}'` : `${w.rounds > 1 ? w.rounds + ' rounds ' : ''}for time`}</Tag>
            <Tag>{state.equipment === 'gym' ? 'Full gym' : 'Bodyweight'}</Tag>
            <Tag>{w.level}</Tag>
          </div>
          <p className="mt-5 text-ash max-w-md">{top.reason}</p>
          <ul className="mt-5 text-sm font-mono text-ash space-y-1">
            {w.m.map((m) => <li key={m.n}><span className="text-white">{m.r}</span> {m.n}</li>)}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`#/player/${w.id}`} className="btn">Don't think. Just do. →</a>
            <a href="#/library" className="btn-ghost">Browse library</a>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Stat label="Total sessions" value={state.logs.length} />
        <Stat label="Last 7 days" value={thisWeek.length} />
        <Stat label="Day streak" value={streak} />
        <Stat label="Time trained" value={fmtTime(state.logs.reduce((s, l) => s + (l.seconds || 0), 0))} />
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <Section title="Also good today">
            <div className="grid sm:grid-cols-2 gap-3">
              {others.map(({ workout: o }) => (
                <a key={o.id} href={`#/player/${o.id}`} className="card p-5 hover:border-white transition-colors block">
                  <div className="text-xl font-black uppercase">{o.name}</div>
                  <div className="text-xs text-mute mt-1 mb-3">{o.type === 'AMRAP' ? `AMRAP ${o.minutes}'` : 'For time'} · {o.level}</div>
                  <GroupTags groups={o.groups} />
                </a>
              ))}
            </div>
          </Section>
          <Section title="Activity feed" right={<a href="#/fam" className="label hover:text-white">Open Fam →</a>}>
            <div className="border border-line divide-y divide-line">
              {feed.map((p) => {
                const u = USERS[p.userId], wk = getWorkout(p.workoutId)
                return (
                  <div key={p.id} className="flex items-center gap-3 p-4">
                    <Avatar tag={u.tag} />
                    <div className="min-w-0 flex-1"><div className="text-sm"><b>{u.name}</b> · {wk.name}</div><div className="text-xs text-mute font-mono">{fmtScore(p.score)}</div></div>
                    <div className="text-xs text-mute">{ago(p.ts)}</div>
                  </div>
                )
              })}
              {!feed.length && <div className="p-6 text-sm text-mute">Nothing yet. Follow people in Fam.</div>}
            </div>
          </Section>
        </div>
        <div className="md:col-span-2">
          <Section title="Muscle balance · 7-day weighted">
            <div className="card p-5 space-y-4">
              {GROUPS.map((g) => <Bar key={g} label={GROUP_LABEL[g]} value={load[g] / max} right={load[g].toFixed(1)} />)}
              <p className="text-xs text-mute pt-2">The recommender picks the workout that fills your emptiest bars.</p>
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}
