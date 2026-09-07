import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Configuracion() {
  const { user, signOut, isSupabaseConfigured } = useAuth()
  const { showToast } = useToast()
  const [nombreFloristeria, setNombreFloristeria] = useState('VAAN FIORI')

  function handleSave(e) {
    e.preventDefault()
    showToast('Preferencias guardadas.')
  }

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="font-display text-3xl text-clay">Configuración</h1>
        <p className="text-bark/60 text-sm mt-1">Datos generales de tu cuenta.</p>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-4">
        <div>
          <label className="label-field">Nombre de la floristería</label>
          <input className="input-field" value={nombreFloristeria} onChange={(e) => setNombreFloristeria(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Correo de la cuenta</label>
          <input className="input-field bg-sand/40" value={user?.email || ''} disabled />
        </div>
        <button type="submit" className="btn-primary">Guardar cambios</button>
      </form>

      <div className="card p-6 space-y-4">
        <h2 className="font-display text-lg text-clay">Cuenta</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-bark/70">Estado de la conexión a la base de datos</span>
          <span className={`font-medium ${isSupabaseConfigured ? 'text-sage-600' : 'text-rose-600'}`}>
            {isSupabaseConfigured ? 'Conectado a Supabase' : 'Modo demostración'}
          </span>
        </div>
        <button onClick={signOut} className="btn-secondary">Cerrar sesión</button>
      </div>

      <div className="card p-6 space-y-2 opacity-60">
        <h2 className="font-display text-lg text-clay">Próximamente</h2>
        <ul className="text-sm text-bark/70 list-disc pl-5 space-y-1">
          <li>Cambio de contraseña</li>
          <li>Perfil del propietario</li>
          <li>Logo de la empresa</li>
          <li>Exportación de información</li>
        </ul>
      </div>
    </div>
  )
}
