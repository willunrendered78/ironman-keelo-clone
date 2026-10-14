import { useEffect, useState } from 'react'
import Dashboard from './views/Dashboard.jsx'
import Library from './views/Library.jsx'
import Player from './views/Player.jsx'
import Progress from './views/Progress.jsx'
import Fam from './views/Fam.jsx'
import { EquipmentToggle } from './components/UI.jsx'
import { PHOTOS } from './components/Photo.jsx'

const NAV = [['dashboard', 'Dashboard'], ['library', 'Library'], ['progress', 'Progress'], ['fam', 'Fam']]

function useRoute() {
  const parse = () => (window.location.hash.replace(/^#\/?/, '') || 'dashboard').split('/')
  const [r, setR] = useState(parse)
  useEffect(() => {
    const f = () => { setR(parse()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return r
}

export default function App() {
  const [page, arg] = useRoute()
  const Active = { dashboard: Dashboard, library: Library, progress: Progress, fam: Fam }[page]
  const inPlayer = page === 'player'
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-ink border-b border-line">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <a href="#/dashboard" className="flex items-center gap-2 font-black tracking-[0.3em] text-sm">
            <svg width="18" height="18" viewBox="0 0 32 32"><path d="M16 3 29 16 16 29 3 16Z" fill="none" stroke="#fff" strokeWidth="4" /></svg>IRONMAN
          </a>
          <nav className="hidden md:flex ml-8 gap-1">
            {NAV.map(([k, l]) => (
              <a key={k} href={`#/${k}`} className={`px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] border-b-2 ${page === k ? 'border-white text-white' : 'border-transparent text-mute hover:text-white'}`}>{l}</a>
            ))}
          </nav>
          <div className="ml-auto"><EquipmentToggle compact /></div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-10">
        {inPlayer ? <Player id={arg} /> : Active ? <Active /> : <Dashboard />}
      </main>
      <footer className="max-w-6xl w-full mx-auto px-4 pb-24 md:pb-8 text-[10px] text-dim leading-relaxed">
        Photos from Unsplash (Unsplash License):{' '}
        {Object.values(PHOTOS).map((p, i) => <span key={p.href}>{i > 0 && ' · '}<a className="underline hover:text-white" href={p.href} target="_blank" rel="noreferrer">{p.title}</a> by {p.by}</span>)}
      </footer>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-ink border-t border-line grid grid-cols-4">
        {NAV.map(([k, l]) => (
          <a key={k} href={`#/${k}`} className={`py-4 text-center text-[10px] font-bold uppercase tracking-[0.18em] ${page === k ? 'bg-white text-ink' : 'text-mute'}`}>{l}</a>
        ))}
      </nav>
    </div>
  )
}
