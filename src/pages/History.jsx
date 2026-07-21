import { useMemo, useState } from 'react'
import { getPersonalRecords, useWorkouts } from '../hooks/useWorkouts'

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function History() {
  const { workouts, loading, deleteWorkout } = useWorkouts()
  const [expanded, setExpanded] = useState(null)
  const prMap = useMemo(() => getPersonalRecords(workouts), [workouts])

  if (loading) {
    return (
      <div className="page">
        <div className="center-loader" style={{ minHeight: 200 }}>
          <span className="spinner" />
        </div>
      </div>
    )
  }

  if (workouts.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 5h16M4 12h16M4 19h10" strokeLinecap="round" />
          </svg>
          <h3>Aún no hay entrenamientos</h3>
          <p>Registra tu primera sesión en la pestaña "Hoy" y aparecerá aquí.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="section-label">{workouts.length} sesiones registradas</div>
      {workouts.map((w) => {
        const isOpen = expanded === w.id
        const prsThisSession = prMap[w.id] || []
        const totalVolume = (w.exercises || []).reduce(
          (acc, ex) => acc + ex.sets.reduce((a, s) => a + (s.reps || 0) * (s.weight || 0), 0),
          0
        )
        return (
          <div className="card" key={w.id}>
            <div className="card-header" onClick={() => setExpanded(isOpen ? null : w.id)} style={{ cursor: 'pointer' }}>
              <div>
                <div className="card-title">{formatDate(w.date)}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12.5, marginTop: 2 }}>
                  {(w.exercises || []).length} ejercicios · {Math.round(totalVolume).toLocaleString('es')} lb volumen
                </div>
              </div>
              {prsThisSession.length > 0 && (
                <span className="badge badge-ember">🔥 {prsThisSession.length} PR</span>
              )}
            </div>

            {isOpen && (
              <div style={{ marginTop: 10 }}>
                {(w.exercises || []).map((ex, i) => {
                  const isPR = prsThisSession.includes(ex.name)
                  const topSet = ex.sets.reduce(
                    (best, s) => (s.weight > best.weight ? s : best),
                    { weight: 0, reps: 0 }
                  )
                  return (
                    <div key={i} style={{ padding: '8px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</span>
                        {isPR && <span className="pr-flag">RÉCORD</span>}
                      </div>
                      <div className="mono" style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3 }}>
                        {ex.sets.map((s, si) => (
                          <span key={si}>
                            {s.weight}lb×{s.reps}
                            {s.rir != null ? ` (RIR ${s.rir})` : ''}
                            {si < ex.sets.length - 1 ? '  ·  ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {w.notes && (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10, fontStyle: 'italic' }}>
                    "{w.notes}"
                  </p>
                )}
                <button
                  className="btn btn-danger"
                  style={{ marginTop: 12 }}
                  onClick={() => {
                    if (confirm('¿Borrar esta sesión de entrenamiento?')) deleteWorkout(w.id)
                  }}
                >
                  Borrar sesión
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
