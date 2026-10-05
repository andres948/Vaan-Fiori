import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Configuracion() {
  const { user, signOut } = useAuth()
  const { showToast } = useToast()

  const [nombreNegocio, setNombreNegocio] = useState(
    () => localStorage.getItem('vf_nombre_negocio') || 'Vaan Fiori'
  )
  const [moneda, setMoneda] = useState(
    () => localStorage.getItem('vf_moneda') || 'COP'
  )
  const [saving, setSaving] = useState(false)

  function saveConfig() {
    setSaving(true)
    localStorage.setItem('vf_nombre_negocio', nombreNegocio)
    localStorage.setItem('vf_moneda', moneda)
    setTimeout(() => {
      setSaving(false)
      showToast('Configuración guardada.')
    }, 400)
  }

  function clearData() {
    if (!confirm('¿Borrar todos los pedidos, costos y gastos guardados localmente? Esta acción no se puede deshacer.')) return
    localStorage.removeItem('vaanfiori_pedidos')
    localStorage.removeItem('vaanfiori_costos')
    localStorage.removeItem('vaanfiori_gastos_personales')
    showToast('Datos locales eliminados. Recarga la página.')
  }

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="font-display text-3xl text-clay">Configuración</h1>
        <p className="text-bark/60 text-sm mt-1">Ajustes generales de tu floristería.</p>
      </div>

      {/* Cuenta */}
      <section className="card p-5 sm:p-6 space-y-4">
        <h2 className="font-display text-lg text-clay">Cuenta</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-display text-xl font-semibold">
            {user?.email?.[0]?.toUpperCase() || 'V'}
          </div>
          <div>
            <p className="text-sm font-medium text-clay">{user?.email || 'Demo'}</p>
            <p className="text-xs text-bark/50 mt-0.5">
              {user?.id === 'demo-user' ? 'Modo demo — sin Supabase' : 'Autenticado con Supabase'}
            </p>
          </div>
        </div>
        <button onClick={signOut} className="btn-ghost text-rose-600 text-sm w-full justify-start">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Cerrar sesión
        </button>
      </section>

      {/* Negocio */}
      <section className="card p-5 sm:p-6 space-y-4">
        <h2 className="font-display text-lg text-clay">Negocio</h2>
        <div>
          <label className="label-field">Nombre del negocio</label>
          <input
            className="input-field"
            value={nombreNegocio}
            onChange={e => setNombreNegocio(e.target.value)}
            placeholder="Vaan Fiori"
          />
        </div>
        <div>
          <label className="label-field">Moneda</label>
          <select className="input-field w-auto" value={moneda} onChange={e => setMoneda(e.target.value)}>
            <option value="COP">COP — Peso colombiano</option>
            <option value="USD">USD — Dólar</option>
            <option value="EUR">EUR — Euro</option>
          </select>
        </div>
        <button onClick={saveConfig} disabled={saving} className="btn-primary">
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </section>

      {/* Datos */}
      <section className="card p-5 sm:p-6 space-y-4">
        <h2 className="font-display text-lg text-clay">Datos</h2>
        <p className="text-sm text-bark/60">
          Mientras no tengas Supabase configurado, los datos se guardan en el almacenamiento local de tu navegador.
          Puedes borrarlos aquí para empezar desde cero.
        </p>
        <button
          onClick={clearData}
          className="btn-ghost text-rose-600 text-sm border border-rose-200 px-4 py-2 rounded-xl hover:bg-rose-50"
        >
          Borrar datos locales
        </button>
      </section>

      {/* Acerca de */}
      <section className="card p-5 sm:p-6 space-y-2">
        <h2 className="font-display text-lg text-clay">Acerca de</h2>
        <p className="text-sm text-bark/60">Vaan Fiori — Sistema de gestión de pedidos florales.</p>
        <p className="text-xs text-bark/40">Versión 1.0.0</p>
      </section>
    </div>
  )
}
