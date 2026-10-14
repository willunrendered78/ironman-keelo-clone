import { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { USERS, getWorkout } from '../lib/data.js'
import { fmtScore, ago } from '../lib/util.js'
import { Avatar, Section } from '../components/UI.jsx'
import { Photo } from '../components/Photo.jsx'

function Post({ p }) {
  const { dispatch } = useStore()
  const [text, setText] = useState('')
  const u = USERS[p.userId], w = getWorkout(p.workoutId)
  const liked = p.likes.includes('me')
  return (
    <article className="card p-5">
      <div className="flex items-center gap-3">
        <Avatar tag={u.tag} />
        <div className="flex-1"><div className="font-bold text-sm">{u.name}</div><div className="text-xs text-mute">{ago(p.ts)}</div></div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-4">
        <div><div className="label">Completed</div><div className="text-2xl font-black uppercase">{w.name}</div></div>
        <div className="font-mono font-black text-2xl">{fmtScore(p.score)}</div>
      </div>
      {p.text && <p className="mt-3 text-sm text-ash">{p.text}</p>}
      <div className="mt-4 flex items-center gap-4">
        <button onClick={() => dispatch({ type: 'like', id: p.id })} aria-pressed={liked} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] border ${liked ? 'bg-white text-ink border-white' : 'border-line text-mute hover:text-white'}`}>
          {liked ? '■' : '□'} {p.likes.length} {p.likes.length === 1 ? 'Like' : 'Likes'}
        </button>
        <span className="label">{p.comments.length} comments</span>
      </div>
      {p.comments.length > 0 && <ul className="mt-3 space-y-2">{p.comments.map((c) => <li key={c.id} className="text-sm border-l-2 border-line pl-3"><b>{USERS[c.userId].name}</b> <span className="text-ash">{c.text}</span> <span className="text-xs text-mute">{ago(c.ts)}</span></li>)}</ul>}
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { dispatch({ type: 'comment', id: p.id, text: text.trim() }); setText('') } }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment" aria-label="Comment" />
        <button className="btn !py-2">Post</button>
      </form>
    </article>
  )
}

export default function Fam() {
  const { state, dispatch } = useStore()
  const feed = state.posts.filter((p) => p.userId === 'me' || state.following.includes(p.userId)).sort((a, b) => b.ts - a.ts)
  return (
    <>
      <section className="relative overflow-hidden border border-line mb-8 h-44 md:h-60">
        <Photo name="lifter" pos="center 60%" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute bottom-0 p-6"><div className="label">Community</div><h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">Ironman Fam</h1></div>
      </section>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-3 order-2 md:order-1">
          {feed.map((p) => <Post key={p.id} p={p} />)}
          {!feed.length && <div className="border border-dashed border-line p-10 text-center text-mute">Follow someone to fill your feed.</div>}
        </div>
        <aside className="order-1 md:order-2">
          <Section title="Connections">
            <div className="border border-line divide-y divide-line">
              {Object.entries(USERS).filter(([id]) => id !== 'me').map(([id, u]) => {
                const on = state.following.includes(id)
                return (
                  <div key={id} className="flex items-center gap-3 p-3">
                    <Avatar tag={u.tag} /><span className="flex-1 text-sm font-bold">{u.name}</span>
                    <button onClick={() => dispatch({ type: 'follow', id })} aria-pressed={on} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] border ${on ? 'border-line text-mute hover:text-white' : 'bg-white text-ink border-white'}`}>{on ? 'Following' : 'Follow'}</button>
                  </div>
                )
              })}
            </div>
          </Section>
        </aside>
      </div>
    </>
  )
}
