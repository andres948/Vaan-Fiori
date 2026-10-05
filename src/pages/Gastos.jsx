import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal'
import { formatCOP, formatDateEs, todayISO, currentMonthKey, monthLabel } from '../lib/format'

const CATEGORIAS = [
  { id: 'alimentacion', label: 'Alimentación', emoji: '🍽️' },
  { id: 'transporte',   label: 'Transporte',   emoji: '🚌' },
  { id: 'gustos',       label: 'Gustos',        emoji: '🛍️' },
  { id: 'servicios',    label: 'Servicios',     emoji: '💡' },
  { id: 'salud',        label: 'Salud',         emoji: '💊' },
  { id: 'hogar',        label: 'Hogar',         emoji: '🏠' },
  { id: 'otro',         label: 'Otro',          emoji: '💸' },
]

const emptyForm = {
  descripcion: '',
  categoria: 'alimentacion',
  valor: '',
  fecha: todayISO(),
  notas: '',
}

export default function Gastos() {
  const { gastosPersonales, addGastoPersonal, updateGastoPersonal, deleteGastoPersonal } = useData()
  const { showToast } = useToast()

  const [monthKey, setMonthKey] = useState(currentMonthKey())
  const [catFilter, setCatFilter] = useState('todas')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const [year, month] = monthKey.split('-').map(Number)
  function shiftMonth(d) {
    const nd = new Date(year, month - 1 + d, 1)
    setMonthKey(`${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}`)
  }

  const gastosMes = useMemo(() =>
    (gastosPersonales || []).filter(g => (g.fecha || '').startsWith(monthKey)),
    [gastosPersonales, monthKey]
  )

  const gastosFiltrados = useMemo(() =>
    catFilter === 'todas' ? gastosMes : gastosMes.filter(g => g.categoria === catFilter),
    [gastosMes, catFilter]
  )

  const totalMes = gastosMes.reduce((a, b) => a + (Number(b.valor) || 0), 0)

  const porCategoria = useMemo(() =>
    CATEGORIAS.map(c => ({
      ...c,
      total: gastosMes.filter(g => g.categoria === c.id).reduce((a, b) => a + (Number(b.valor) || 0), 0),
    })),
    [gastosMes]
  )

  function openNew() {
    setEditing(null)
    setForm({ ...emptyForm, fecha: todayISO() })
    setModalOpen(true)
  }

  function openEdit(g) {
    setEditing(g)
    setForm({
      descripcion: g.descripcion,
      categoria: g.categoria,
      valor: g.valor,
      fecha: g.fecha,
      notas: g.notas || '',
    })
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.descripcion || !form.valor) {
      showToast('Completa la descripción y el valor.', 'error')
      return
    }
    setSaving(true)
    try {
      const payload = {
        descripcion: form.descripcion,
        categoria: form.categoria,
        valor: Number(form.valor) || 0,
        fecha: form.fecha,
        notas: form.notas,
      }
      if (editing) {
        await updateGastoPersonal(editing.id, payload)
        showToast('Gasto actualizado.')
      } else {
        await addGastoPersonal(payload)
        showToast('Gasto registrado.')
      }
      setModalOpen(false)
    } catch (err) {
      showToast(err.message || 'No se pudo guardar.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este gasto?')) return
    try {
      await deleteGastoPersonal(id)
      showToast('Gasto eliminado.')
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar.', 'error')
    }
  }

  const catActual = CATEGORIAS.find(c => c.id === form.categoria)

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-clay">Gastos personales</h1>
          <p className="text-bark/60 text-sm mt-1">Comida, transporte, gustos y más.</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo gasto
        </button>
      </div>

      {/* Navegador de mes */}
      <div className="flex items-center gap-2 card px-2 py-1.5 w-fit">
        <button onClick={() => shiftMonth(-1)} className="p-1.5 rounded-lg hover:bg-clay/5 text-bark">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span className="text-sm font-medium text-clay px-1 min-w-[140px] text-center">{monthLabel(monthKey)}</span>
        <button onClick={() => shiftMonth(1)} className="p-1.5 rounded-lg hover:bg-clay/5 text-bark">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>

      {/* Total del mes */}
      <div className="card p-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-bark/50 font-medium mb-1">Total gastado en {monthLabel(monthKey)}</p>
          <p className="font-display text-3xl text-clay">{formatCOP(totalMes)}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-2xl">💸</div>
      </div>

      {/* Resumen por categoría */}
      <div>
        <h2 className="font-display text-lg text-clay mb-3">Por categoría</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Botón "Todas" */}
          <button
            onClick={() => setCatFilter('todas')}
            className={`card p-3 text-center transition-all ${catFilter === 'todas' ? 'ring-2 ring-rose-400 bg-rose-50' : 'hover:bg-clay/[0.03]'}`}
          >
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs font-medium text-clay">Todas</p>
            <p className="text-xs text-bark/60 mt-0.5">{formatCOP(totalMes)}</p>
          </button>
          {porCategoria.map(c => (
            <button
              key={c.id}
              onClick={() => setCatFilter(catFilter === c.id ? 'todas' : c.id)}
              className={`card p-3 text-center transition-all ${catFilter === c.id ? 'ring-2 ring-rose-400 bg-rose-50' : 'hover:bg-clay/[0.03]'}`}
            >
              <div className="text-2xl mb-1">{c.emoji}</div>
              <p className="text-xs font-medium text-clay">{c.label}</p>
              <p className="text-xs text-bark/60 mt-0.5">{formatCOP(c.total)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de gastos — escritorio */}
      <div className="card overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-bark/55 border-b border-sand">
              <th className="font-medium py-3 px-5">Descripción</th>
              <th className="font-medium py-3 px-3">Categoría</th>
              <th className="font-medium py-3 px-3">Fecha</th>
              <th className="font-medium py-3 px-3">Valor</th>
              <th className="font-medium py-3 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gastosFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-bark/50 py-10">
                  Sin gastos registrados para {monthLabel(monthKey)}.
                </td>
              </tr>
            )}
            {[...gastosFiltrados].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)).map(g => {
              const cat = CATEGORIAS.find(c => c.id === g.categoria) || CATEGORIAS[6]
              return (
                <tr key={g.id} className="border-b border-sand/70 last:border-0 hover:bg-clay/[0.02]">
                  <td className="py-3 px-5">
                    <p className="font-medium text-clay">{g.descripcion}</p>
                    {g.notas && <p className="text-xs text-bark/50 mt-0.5">{g.notas}</p>}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-sand/60 text-bark rounded-full px-2.5 py-1">
                      {cat.emoji} {cat.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-bark">{formatDateEs(g.fecha)}</td>
                  <td className="py-3 px-3 font-semibold text-clay">{formatCOP(g.valor)}</td>
                  <td className="py-3 px-5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(g)} className="btn-ghost text-xs">Editar</button>
                      <button onClick={() => handleDelete(g.id)} className="btn-ghost text-xs text-rose-600">Eliminar</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Lista de gastos — móvil */}
      <div className="md:hidden space-y-3">
        {gastosFiltrados.length === 0 && (
          <p className="text-center text-bark/50 py-10 text-sm">Sin gastos para {monthLabel(monthKey)}.</p>
        )}
        {[...gastosFiltrados].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)).map(g => {
          const cat = CATEGORIAS.find(c => c.id === g.categoria) || CATEGORIAS[6]
          return (
            <div key={g.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-clay truncate">{g.descripcion}</p>
                  <p className="text-xs text-bark/55 mt-0.5">{cat.emoji} {cat.label} · {formatDateEs(g.fecha)}</p>
                </div>
                <p className="font-semibold text-clay shrink-0">{formatCOP(g.valor)}</p>
              </div>
              {g.notas && <p className="text-xs text-bark/50 mt-1">{g.notas}</p>}
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(g)} className="btn-secondary text-xs flex-1">Editar</button>
                <button onClick={() => handleDelete(g.id)} className="btn-ghost text-xs text-rose-600">Eliminar</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar gasto' : 'Nuevo gasto personal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Descripción</label>
            <input
              required
              className="input-field"
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Ej. Almuerzo, pasaje, ropa…"
            />
          </div>

          <div>
            <label className="label-field">Categoría</label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {CATEGORIAS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setForm({ ...form, categoria: c.id })}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    form.categoria === c.id
                      ? 'border-rose-400 bg-rose-50 text-rose-700'
                      : 'border-sand text-bark/70 hover:border-clay/30'
                  }`}
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Valor</label>
              <input
                required
                type="number"
                min="0"
                className="input-field"
                value={form.valor}
                onChange={e => setForm({ ...form, valor: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="label-field">Fecha</label>
              <input
                type="date"
                className="input-field"
                value={form.fecha}
                onChange={e => setForm({ ...form, fecha: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label-field">Notas (opcional)</label>
            <input
              className="input-field"
              value={form.notas}
              onChange={e => setForm({ ...form, notas: e.target.value })}
              placeholder="Detalle adicional…"
            />
          </div>

          {/* Resumen */}
          {form.valor && (
            <div className="bg-sand/50 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
              <span className="text-bark/70">{catActual?.emoji} {catActual?.label}</span>
              <span className="font-semibold text-clay">{formatCOP(Number(form.valor) || 0)}</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Guardando…' : 'Guardar gasto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
