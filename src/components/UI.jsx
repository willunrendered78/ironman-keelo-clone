import { useStore } from '../lib/store.jsx'
import { GROUP_LABEL } from '../lib/data.js'

export const go = (path) => { window.location.hash = path }

export function Tag({ children, solid }) {
  return <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] border ${solid ? 'bg-white text-ink border-white' : 'border-line text-mute'}`}>{children}</span>
}
export const GroupTags = ({ groups }) => <div className="flex flex-wrap gap-1.5">{groups.map((g) => <Tag key={g}>{GROUP_LABEL[g]}</Tag>)}</div>

export function EquipmentToggle({ compact }) {
  const { state, dispatch } = useStore()
  const opts = [['home', 'Home / Bodyweight'], ['gym', 'Full Gym']]
  return (
    <div role="group" aria-label="Equipment setup" className="flex border border-line">
      {opts.map(([v, l]) => (
        <button key={v} aria-pressed={state.equipment === v} onClick={() => dispatch({ type: 'equipment', value: v })}
          className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${state.equipment === v ? 'bg-white text-ink' : 'text-mute hover:text-white'}`}>
          {compact ? (v === 'home' ? 'Home' : 'Gym') : l}
        </button>
      ))}
    </div>
  )
}

export function Avatar({ tag }) {
  return <div className="w-9 h-9 shrink-0 bg-white text-ink grid place-items-center text-[11px] font-black tracking-wider">{tag}</div>
}

export function Section({ title, right, children }) {
  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-4 gap-4">
        <h2 className="label !text-white">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  )
}

export function Stat({ label, value, sub }) {
  return (
    <div className="card p-4">
      <div className="label">{label}</div>
      <div className="mt-2 text-3xl font-black font-mono tabular-nums">{value}</div>
      {sub && <div className="text-xs text-mute mt-1">{sub}</div>}
    </div>
  )
}
