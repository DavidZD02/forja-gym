import { useMemo, useState } from 'react'
import { useWorkouts } from '../hooks/useWorkouts'

function formatShort(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// Gráfico de línea minimalista en SVG puro (sin dependencias externas)
function LineChart({ points }) {
  if (points.length === 0) return null
  const width = 300
  const height = 140
  const padding = 24
  const values = points.map((p) => p.value)
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const range = maxV - minV || 1

  const coords = points.map((p, i) => {
    const x = points.length === 1 ? width / 2 : padding + (i / (points.length - 1)) * (width - padding * 2)
    const y = height - padding - ((p.value - minV) / range) * (height - padding * 2)
    return { x, y, ...p }
  })

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border)" strokeWidth="1" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={i === coords.length - 1 ? 4.5 : 3} fill={i === coords.length - 1 ? 'var(--accent)' : 'var(--surface)'} stroke="var(--accent)" strokeWidth="2" />
      ))}
    </svg>
  )
}

export default function Progress() {
  const { workouts, loading } = useWorkouts()

  const exerciseNames = useMemo(() => {
    const set = new Set()
    workouts.forEach((w) => (w.exercises || []).forEach((ex) => set.add(ex.name)))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
  }, [workouts])

  const [selected, setSelected] = useState('')
  const activeExercise = selected || exerciseNames[0] || ''

  const series = useMemo(() => {
    if (!activeExercise) return []
    return [...workouts]
      .filter((w) => (w.exercises || []).some((ex) => ex.name === activeExercise))
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((w) => {
        const ex = w.exercises.find((e) => e.name === activeExercise)
        const maxWeight = Math.max(...ex.sets.map((s) => s.weight || 0))
        const estimatedBest = ex.sets.reduce((best, s) => {
          // Epley 1RM estimado, útil para comparar sesiones con reps distintas
          const e1rm = s.weight * (1 + s.reps / 30)
          return e1rm > best ? e1rm : best
        }, 0)
        return { date: w.date, label: formatShort(w.date), value: maxWeight, e1rm: Math.round(estimatedBest) }
      })
  }, [workouts, activeExercise])

  if (loading) {
    return (
      <div className="page">
        <div className="center-loader" style={{ minHeight: 200 }}>
          <span className="spinner" />
        </div>
      </div>
    )
  }

  if (exerciseNames.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19V9M11 19V4M18 19v-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3>Sin datos todavía</h3>
          <p>Registra entrenamientos para ver tu progreso por ejercicio.</p>
        </div>
      </div>
    )
  }

  const first = series[0]
  const last = series[series.length - 1]
  const delta = last && first ? last.value - first.value : 0

  return (
    <div className="page">
      <div className="field">
        <label>Ejercicio</label>
        <select className="select" value={activeExercise} onChange={(e) => setSelected(e.target.value)}>
          {exerciseNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Peso máximo por sesión</span>
          {series.length > 1 && (
            <span className={'badge ' + (delta >= 0 ? 'badge-accent' : 'badge-muted')}>
              {delta >= 0 ? '+' : ''}
              {delta} lb
            </span>
          )}
        </div>
        <LineChart points={series} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>
          <span>{series[0]?.label}</span>
          <span>{series[series.length - 1]?.label}</span>
        </div>
      </div>

      <div className="section-label">Historial de sesiones</div>
      {[...series].reverse().map((s, i) => (
        <div className="card" key={i} style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{s.label}</span>
            <span className="mono" style={{ fontWeight: 600 }}>{s.value} lb</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 2 }}>1RM estimado: ~{s.e1rm} lb</div>
        </div>
      ))}
    </div>
  )
}
