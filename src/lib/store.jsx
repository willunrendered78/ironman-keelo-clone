import { createContext, useContext, useEffect, useReducer } from 'react'
import { seedPosts, getWorkout } from './data.js'
import { uid } from './util.js'

const KEY = 'ironman.v1'

const initial = () => ({ equipment: 'home', logs: [], following: ['u2', 'u3'], posts: seedPosts() })

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial(), ...JSON.parse(raw) }
  } catch { /* storage unavailable or corrupt: fall back to defaults */ }
  return initial()
}

function reducer(s, a) {
  switch (a.type) {
    case 'equipment': return { ...s, equipment: a.value }
    case 'log': {
      const w = getWorkout(a.log.workoutId)
      const log = { id: uid(), groups: w.groups, name: w.name, wtype: w.type, ...a.log }
      const post = { id: uid(), userId: 'me', workoutId: w.id, ts: log.ts, score: log.score, text: log.notes || '', likes: [], comments: [] }
      return { ...s, logs: [...s.logs, log], posts: [post, ...s.posts] }
    }
    case 'deleteLog': return { ...s, logs: s.logs.filter((l) => l.id !== a.id) }
    case 'like': return { ...s, posts: s.posts.map((p) => p.id !== a.id ? p : { ...p, likes: p.likes.includes('me') ? p.likes.filter((u) => u !== 'me') : [...p.likes, 'me'] }) }
    case 'comment': return { ...s, posts: s.posts.map((p) => p.id !== a.id ? p : { ...p, comments: [...p.comments, { id: uid(), userId: 'me', text: a.text, ts: Date.now() }] }) }
    case 'follow': return { ...s, following: s.following.includes(a.id) ? s.following.filter((u) => u !== a.id) : [...s.following, a.id] }
    case 'reset': return initial()
    default: return s
  }
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore quota/private mode */ }
  }, [state])
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
