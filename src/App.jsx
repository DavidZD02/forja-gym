import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Progress from './pages/Progress'
import Profile from './pages/Profile'

const titles = {
  '/': ['Hoy', 'Registra tu sesión de entrenamiento'],
  '/historial': ['Historial', 'Tus sesiones pasadas'],
  '/progreso': ['Progreso', 'Evolución de tus cargas'],
  '/perfil': ['Perfil', 'Tu cuenta y estadísticas'],
}

function Topbar() {
  const { pathname } = useLocation()
  const [title, sub] = titles[pathname] || titles['/']
  return (
    <header className="topbar">
      <h1 className="topbar-title">
        {title}
        <span className="ember-dot">.</span>
      </h1>
      <p className="topbar-sub">{sub}</p>
    </header>
  )
}

function PrivateArea() {
  return (
    <div className="app-shell">
      <Topbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/historial" element={<History />} />
        <Route path="/progreso" element={<Progress />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Navbar />
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="center-loader">
        <span className="spinner" />
      </div>
    )
  }

  return <HashRouter>{user ? <PrivateArea /> : <Login />}</HashRouter>
}
