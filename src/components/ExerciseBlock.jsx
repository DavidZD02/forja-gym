function emptySet() {
  return { reps: '', weight: '', rir: '' }
}

export default function ExerciseBlock({ exercise, onChange, onRemove }) {
  function updateName(name) {
    onChange({ ...exercise, name })
  }

  function updateSet(index, field, value) {
    const sets = exercise.sets.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    onChange({ ...exercise, sets })
  }

  function addSet() {
    onChange({ ...exercise, sets: [...exercise.sets, emptySet()] })
  }

  function removeSet(index) {
    onChange({ ...exercise, sets: exercise.sets.filter((_, i) => i !== index) })
  }

  return (
    <div className="exercise-block">
      <div className="exercise-block-header">
        <input
          className="input"
          style={{ fontWeight: 600 }}
          placeholder="Nombre del ejercicio (ej. Press banca)"
          value={exercise.name}
          onChange={(e) => updateName(e.target.value)}
        />
        <button className="btn-ghost" onClick={onRemove} aria-label="Eliminar ejercicio" style={{ marginLeft: 8 }}>
          ✕
        </button>
      </div>

      <div className="set-row-labels">
        <span>#</span>
        <span>Peso kg</span>
        <span>Reps</span>
        <span>RIR</span>
        <span></span>
      </div>

      {exercise.sets.map((set, i) => (
        <div className="set-row" key={i}>
          <span className="set-index">{i + 1}</span>
          <input
            inputMode="decimal"
            placeholder="0"
            value={set.weight}
            onChange={(e) => updateSet(i, 'weight', e.target.value)}
          />
          <input
            inputMode="numeric"
            placeholder="0"
            value={set.reps}
            onChange={(e) => updateSet(i, 'reps', e.target.value)}
          />
          <input
            inputMode="numeric"
            placeholder="0-4"
            value={set.rir}
            onChange={(e) => updateSet(i, 'rir', e.target.value)}
          />
          <button className="remove-set" onClick={() => removeSet(i)} aria-label="Quitar serie">
            ✕
          </button>
        </div>
      ))}

      <button className="btn btn-secondary" style={{ marginTop: 6 }} onClick={addSet}>
        + Añadir serie
      </button>
    </div>
  )
}
