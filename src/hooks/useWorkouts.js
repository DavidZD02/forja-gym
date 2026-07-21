import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

// Cada usuario tiene su propia subcolección: users/{uid}/workouts
function workoutsRef(uid) {
  return collection(db, 'users', uid, 'workouts')
}

export function useWorkouts() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setWorkouts([])
      setLoading(false)
      return
    }
    const q = query(workoutsRef(user.uid), orderBy('date', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setWorkouts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error('Error leyendo entrenamientos:', err)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [user])

  async function addWorkout(workout) {
    if (!user) return
    await addDoc(workoutsRef(user.uid), {
      ...workout,
      createdAt: serverTimestamp(),
    })
  }

  async function updateWorkout(id, data) {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'workouts', id), data)
  }

  async function deleteWorkout(id) {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'workouts', id))
  }

  return { workouts, loading, addWorkout, updateWorkout, deleteWorkout }
}

// Calcula el mejor peso histórico levantado por ejercicio (para detectar PRs)
export function getPersonalRecords(workouts) {
  const records = {}
  // Recorremos del más antiguo al más reciente para saber en qué sesión se batió cada récord
  const chronological = [...workouts].sort((a, b) => a.date.localeCompare(b.date))
  const prByWorkoutId = {}

  for (const w of chronological) {
    prByWorkoutId[w.id] = []
    for (const ex of w.exercises || []) {
      const maxWeightInSession = Math.max(
        0,
        ...(ex.sets || []).map((s) => Number(s.weight) || 0)
      )
      if (maxWeightInSession <= 0) continue
      const prev = records[ex.name] || 0
      if (maxWeightInSession > prev) {
        records[ex.name] = maxWeightInSession
        prByWorkoutId[w.id].push(ex.name)
      }
    }
  }
  return prByWorkoutId
}
