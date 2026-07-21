import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/',
    label: 'Hoy',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6.5 6.5h11M4 12h16M6.5 17.5h11" strokeLinecap="round" />
        <circle cx="4" cy="6.5" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="20" cy="17.5" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: '/historial',
    label: 'Historial',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 5h16M4 12h16M4 19h10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/progreso',
    label: 'Progreso',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19V9M11 19V4M18 19v-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/perfil',
    label: 'Perfil',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function Navbar() {
  return (
    <nav className="tabbar">
      <div className="tabbar-inner">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}
          >
            {t.icon}
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
