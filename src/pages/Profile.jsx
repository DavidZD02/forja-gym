import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWorkouts } from '../hooks/useWorkouts'

export default function Profile() {
  const { user, logout } = useAuth()
  const { workouts } = useWorkouts()

  const stats = useMemo(() => {
    const totalSessions = workouts.length
    const last30 = workouts.filter((w) => {
      const d = new Date(w.date + 'T00:00:00')
      return (Date.now() - d.getTime()) / 86400000 <= 30
    }).length
    const totalSets = workouts.reduce(
      (acc, w) => acc + (w.exercises || []).reduce((a, ex) => a + ex.sets.length, 0),
      0
    )
    return { totalSessions, last30, totalSets }
  }, [workouts])

  return (
    <div className="page">
      <div className="card">
        <div className="card-title" style={{ marginBottom: 6 }}>Cuenta</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user?.email}</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat-box">
          <div className="stat-value mono">{stats.totalSessions}</div>
          <div className="stat-label">Sesiones totales</div>
        </div>
        <div className="stat-box">
          <div className="stat-value mono">{stats.last30}</div>
          <div className="stat-label">Últimos 30 días</div>
        </div>
        <div className="stat-box">
          <div className="stat-value mono">{stats.totalSets}</div>
          <div className="stat-label">Series totales</div>
        </div>
      </div>

      <button className="btn btn-secondary" onClick={logout}>
        Cerrar sesión
      </button>

      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', textAlign: 'center', marginTop: 24 }}>
        FORJA · Tus datos se guardan en la nube y se sincronizan entre dispositivos.
      </p>
    </div>
  )
}
