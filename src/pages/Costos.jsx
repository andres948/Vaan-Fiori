import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal'
import { formatCOP, formatDateEs, todayISO } from '../lib/format'

const emptyForm = { producto: '', precio: '', cantidad: '1' }

export default function Costos() {
  const { costos, addCosto, updateCosto, deleteCosto } = useData()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    return costos
      .filter((c) => (dateFilter ? c.fecha === dateFilter : true))
      .filter((c) => c.producto.toLowerCase().includes(search.trim().toLowerCase()))
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
  }, [costos, search, dateFilter])

  const totalListado = useMemo(
    () => filtered.reduce((sum, c) => sum + (Number(c.precio) || 0) * (Number(c.cantidad) || 0), 0),
    [filtered]
  )

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(c) {
    setEditing(c)
    setForm({ producto: c.producto, precio: c.precio, cantidad: c.cantidad })
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.producto || !form.precio || !form.cantidad) {
      showToast('Completa el producto, el precio y la cantidad.', 'error')
      return
    }
    setSaving(true)
    try {
      const payload = {
        producto: form.producto,
        precio: Number(form.precio) || 0,
        cantidad: Number(form.cantidad) || 0,
      }
      if (editing) {
        await updateCosto(editing.id, payload)
        showToast('Costo actualizado con éxito.')
      } else {
        await addCosto(payload)
        showToast('Costo registrado con éxito.')
      }
      setModalOpen(false)
    } catch (err) {
      showToast(err.message || 'No se pudo guardar el costo.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este costo?')) return
    try {
      await deleteCosto(id)
      showToast('Costo eliminado.')
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar el costo.', 'error')
    }
  }

  const total = (Number(form.precio) || 0) * (Number(form.cantidad) || 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-clay">Costos</h1>
          <p className="text-bark/60 text-sm mt-1">Compras e insumos de la floristería.</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" /></svg>
          Agregar costo
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Buscar producto…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-xs"
        />
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input-field w-auto" />
        {dateFilter && <button onClick={() => setDateFilter('')} className="btn-ghost text-xs">Limpiar fecha</button>}
        <span className="ml-auto text-sm text-bark/60">Total filtrado: <span className="font-semibold text-clay">{formatCOP(totalListado)}</span></span>
      </div>

      <div className="card overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-bark/55 border-b border-sand">
              <th className="font-medium py-3 px-5">Producto</th>
              <th className="font-medium py-3 px-3">Precio unitario</th>
              <th className="font-medium py-3 px-3">Cantidad</th>
              <th className="font-medium py-3 px-3">Total</th>
              <th className="font-medium py-3 px-3">Fecha</th>
              <th className="font-medium py-3 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-sand/70 last:border-0 hover:bg-clay/[0.02]">
                <td className="py-3 px-5 font-medium text-clay">{c.producto}</td>
                <td className="py-3 px-3 text-bark">{formatCOP(c.precio)}</td>
                <td className="py-3 px-3 text-bark">{c.cantidad}</td>
                <td className="py-3 px-3 font-medium text-clay">{formatCOP((Number(c.precio) || 0) * (Number(c.cantidad) || 0))}</td>
                <td className="py-3 px-3 text-bark">{formatDateEs(c.fecha)}</td>
                <td className="py-3 px-5">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="btn-ghost text-xs">Editar</button>
                    <button onClick={() => handleDelete(c.id)} className="btn-ghost text-xs text-rose-600">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center text-bark/50 py-10">No hay costos que coincidan con la búsqueda.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-clay">{c.producto}</p>
              <p className="font-semibold text-clay shrink-0">{formatCOP((Number(c.precio) || 0) * (Number(c.cantidad) || 0))}</p>
            </div>
            <p className="text-xs text-bark/55 mt-1">{formatCOP(c.precio)} × {c.cantidad} · {formatDateEs(c.fecha)}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => openEdit(c)} className="btn-secondary text-xs flex-1">Editar</button>
              <button onClick={() => handleDelete(c.id)} className="btn-ghost text-xs text-rose-600">Eliminar</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-bark/50 py-10 text-sm">No hay costos que coincidan con la búsqueda.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar costo' : 'Agregar costo'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Producto</label>
            <input required className="input-field" value={form.producto} onChange={(e) => setForm({ ...form, producto: e.target.value })} placeholder="Ej. Rosas preservadas" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Precio unitario</label>
              <input required type="number" min="0" className="input-field" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="20000" />
            </div>
            <div>
              <label className="label-field">Cantidad</label>
              <input required type="number" min="0" className="input-field" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} placeholder="10" />
            </div>
          </div>
          <div className="bg-sand/50 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-bark/70">Costo total</span>
            <span className="font-semibold text-clay">{formatCOP(total)}</span>
          </div>
          {!editing && (
            <p className="text-xs text-bark/50">La fecha se registrará automáticamente como hoy, {formatDateEs(todayISO())}.</p>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Guardando…' : 'Guardar costo'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
