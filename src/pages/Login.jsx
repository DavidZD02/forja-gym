import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const errorMessages = {
  'auth/invalid-email': 'El correo no es válido.',
  'auth/user-not-found': 'No existe una cuenta con ese correo.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
}

export default function Login() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password)
      }
    } catch (err) {
      setError(errorMessages[err.code] || 'Ocurrió un error. Intenta de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-logo">
        FORJA<span className="ember-dot">.</span>
      </div>
      <p className="auth-tag">Tu registro de entrenamiento, sin distracciones.</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Correo electrónico</label>
          <input
            className="input"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input
            className="input"
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? <span className="spinner" /> : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>

      <div className="auth-switch">
        {mode === 'login' ? (
          <>
            ¿No tienes cuenta?
            <button onClick={() => setMode('register')}>Regístrate</button>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?
            <button onClick={() => setMode('login')}>Inicia sesión</button>
          </>
        )}
      </div>
    </div>
  )
}
