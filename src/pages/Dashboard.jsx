import { useEffect, useMemo, useState } from 'react'
import ExerciseBlock from '../components/ExerciseBlock'
import { useWorkouts } from '../hooks/useWorkouts'

function todayISO() {
  const d = new Date()
  const tz = d.getTimezoneOffset()
  return new Date(d.getTime() - tz * 60000).toISOString().slice(0, 10)
}

function emptyExercise() {
  return { name: '', sets: [{ reps: '', weight: '', rir: '' }] }
}

export default function Dashboard() {
  const { workouts, loading, addWorkout, updateWorkout, deleteWorkout } = useWorkouts()
  const today = todayISO()
  const existing = useMemo(() => workouts.find((w) => w.date === today), [workouts, today])

  const [exercises, setExercises] = useState([emptyExercise()])
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // Si ya existe un entrenamiento hoy, cargarlo para poder seguir editándolo
  useEffect(() => {
    if (existing) {
      setExercises(existing.exercises?.length ? existing.exercises : [emptyExercise()])
      setNotes(existing.notes || '')
    }
  }, [existing?.id])

  function updateExercise(index, updated) {
    setExercises((prev) => prev.map((ex, i) => (i === index ? updated : ex)))
  }

  function addExercise() {
    setExercises((prev) => [...prev, emptyExercise()])
  }

  function removeExercise(index) {
    setExercises((prev) => prev.filter((_, i) => i !== index))
  }

  function cleanExercises(list) {
    return list
      .filter((ex) => ex.name.trim())
      .map((ex) => ({
        name: ex.name.trim(),
        sets: ex.sets
          .filter((s) => s.reps !== '' || s.weight !== '')
          .map((s) => ({
            reps: Number(s.reps) || 0,
            weight: Number(s.weight) || 0,
            rir: s.rir === '' ? null : Number(s.rir),
          })),
      }))
      .filter((ex) => ex.sets.length > 0)
  }

  async function handleSave() {
    const clean = cleanExercises(exercises)
    if (clean.length === 0) return
    setSaving(true)
    try {
      if (existing) {
        await updateWorkout(existing.id, { exercises: clean, notes })
      } else {
        await addWorkout({ date: today, exercises: clean, notes })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 1800)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!existing) return
    if (!confirm('¿Borrar el entrenamiento de hoy? Esta acción no se puede deshacer.')) return
    await deleteWorkout(existing.id)
    setExercises([emptyExercise()])
    setNotes('')
  }

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  const totalVolume = exercises.reduce(
    (acc, ex) => acc + ex.sets.reduce((a, s) => a + (Number(s.reps) || 0) * (Number(s.weight) || 0), 0),
    0
  )

  return (
    <div className="page">
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat-box">
          <div className="stat-value mono">{exercises.filter((e) => e.name.trim()).length}</div>
          <div className="stat-label">Ejercicios</div>
        </div>
        <div className="stat-box">
          <div className="stat-value mono">{totalSets}</div>
          <div className="stat-label">Series</div>
        </div>
        <div className="stat-box">
          <div className="stat-value mono">{Math.round(totalVolume).toLocaleString('es')}</div>
          <div className="stat-label">Volumen lb</div>
        </div>
      </div>

      {existing && (
        <div className="badge badge-accent" style={{ marginBottom: 12 }}>
          Editando entrenamiento ya guardado hoy
        </div>
      )}

      {exercises.map((ex, i) => (
        <ExerciseBlock
          key={i}
          exercise={ex}
          onChange={(updated) => updateExercise(i, updated)}
          onRemove={() => removeExercise(i)}
        />
      ))}

      <button className="btn btn-secondary" onClick={addExercise} style={{ marginBottom: 16 }}>
        + Añadir ejercicio
      </button>

      <div className="field">
        <label>Notas de la sesión (opcional)</label>
        <textarea
          className="input"
          rows={2}
          placeholder="Ej. Buena sensación, subí peso en sentadilla..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving || totalSets === 0}>
        {saving ? <span className="spinner" /> : saved ? '✓ Guardado' : existing ? 'Guardar cambios' : 'Guardar entrenamiento'}
      </button>

      {existing && (
        <button className="btn btn-danger" style={{ marginTop: 10 }} onClick={handleDelete}>
          Borrar entrenamiento de hoy
        </button>
      )}
    </div>
  )
}
