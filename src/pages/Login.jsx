import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function Login() {
  const { signIn, isSupabaseConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'No fue posible iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linen px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.35]">
        <svg className="absolute -top-24 -right-24 w-[420px] h-[420px]" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#E3AFA6" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="65" fill="none" stroke="#CE8A7D" strokeWidth="1" />
        </svg>
        <svg className="absolute -bottom-16 -left-16 w-[300px] h-[300px]" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="70" fill="none" stroke="#B7C29E" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="card p-7 sm:p-8">
          <h1 className="font-display text-2xl text-clay mb-1">Bienvenida de nuevo</h1>
          <p className="text-sm text-bark/60 mb-6">Ingresa a tu panel de gestión.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field" htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tuflorería@correo.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>

          {!isSupabaseConfigured && (
            <p className="text-xs text-bark/50 mt-5 text-center">
              Modo demostración: ingresa cualquier correo y contraseña para explorar la aplicación.
              Conecta Supabase para autenticación real.
            </p>
          )}
        </div>
        <p className="text-center text-xs text-bark/40 mt-6">Acceso exclusivo para la propietaria de VAAN FIORI.</p>
      </div>
    </div>
  )
}
