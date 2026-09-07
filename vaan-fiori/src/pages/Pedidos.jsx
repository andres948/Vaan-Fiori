import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal'
import StatusBadge, { ESTADOS } from '../components/StatusBadge'
import { formatCOP, formatDateEs, todayISO } from '../lib/format'

const emptyForm = {
  nombre_detalle: '',
  cliente: '',
  telefono: '',
  precio: '',
  abono: '',
  fecha_entrega: '',
  estado: 'Pendiente',
}

export default function Pedidos() {
  const { pedidos, addPedido, updatePedido, deletePedido } = useData()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [dateFilter, setDateFilter] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    return pedidos
      .filter((p) => (estadoFilter === 'Todos' ? true : p.estado === estadoFilter))
      .filter((p) => (dateFilter ? p.fecha_pedido === dateFilter : true))
      .filter((p) => {
        const q = search.trim().toLowerCase()
        if (!q) return true
        return p.nombre_detalle.toLowerCase().includes(q) || p.cliente.toLowerCase().includes(q)
      })
      .sort((a, b) => (a.fecha_pedido < b.fecha_pedido ? 1 : -1))
  }, [pedidos, search, estadoFilter, dateFilter])

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(p) {
    setEditing(p)
    setForm({
      nombre_detalle: p.nombre_detalle,
      cliente: p.cliente,
      telefono: p.telefono || '',
      precio: p.precio,
      abono: p.abono,
      fecha_entrega: p.fecha_entrega || '',
      estado: p.estado,
    })
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre_detalle || !form.cliente || !form.precio) {
      showToast('Completa el detalle, el cliente y el precio.', 'error')
      return
    }
    setSaving(true)
    try {
      const payload = {
        nombre_detalle: form.nombre_detalle,
        cliente: form.cliente,
        telefono: form.telefono,
        precio: Number(form.precio) || 0,
        abono: Number(form.abono) || 0,
        fecha_entrega: form.fecha_entrega,
        estado: form.estado,
      }
      if (editing) {
        await updatePedido(editing.id, payload)
        showToast('Pedido actualizado con éxito.')
      } else {
        await addPedido(payload)
        showToast('Pedido registrado con éxito.')
      }
      setModalOpen(false)
    } catch (err) {
      showToast(err.message || 'No se pudo guardar el pedido.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return
    try {
      await deletePedido(id)
      showToast('Pedido eliminado.')
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar el pedido.', 'error')
    }
  }

  async function markDelivered(p) {
    await updatePedido(p.id, { estado: 'Entregado' })
    showToast(`"${p.nombre_detalle}" marcado como entregado.`)
  }

  const saldo = (Number(form.precio) || 0) - (Number(form.abono) || 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-clay">Pedidos</h1>
          <p className="text-bark/60 text-sm mt-1">Detalles solicitados por tus clientes.</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" /></svg>
          Nuevo pedido
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por detalle o cliente…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-xs"
        />
        <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="input-field w-auto">
          <option>Todos</option>
          {ESTADOS.map((e) => <option key={e}>{e}</option>)}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="input-field w-auto"
        />
        {dateFilter && (
          <button onClick={() => setDateFilter('')} className="btn-ghost text-xs">Limpiar fecha</button>
        )}
      </div>

      {/* Vista de tabla en escritorio */}
      <div className="card overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-bark/55 border-b border-sand">
              <th className="font-medium py-3 px-5">Detalle</th>
              <th className="font-medium py-3 px-3">Cliente</th>
              <th className="font-medium py-3 px-3">Precio</th>
              <th className="font-medium py-3 px-3">Saldo</th>
              <th className="font-medium py-3 px-3">Entrega</th>
              <th className="font-medium py-3 px-3">Estado</th>
              <th className="font-medium py-3 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const pendiente = (Number(p.precio) || 0) - (Number(p.abono) || 0)
              return (
                <tr key={p.id} className="border-b border-sand/70 last:border-0 hover:bg-clay/[0.02]">
                  <td className="py-3 px-5">
                    <button className="font-medium text-clay hover:text-rose-600 text-left" onClick={() => setViewing(p)}>
                      {p.nombre_detalle}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-bark">{p.cliente}</td>
                  <td className="py-3 px-3 text-clay">{formatCOP(p.precio)}</td>
                  <td className={`py-3 px-3 font-medium ${pendiente > 0 ? 'text-rose-600' : 'text-sage-600'}`}>
                    {formatCOP(pendiente)}
                  </td>
                  <td className="py-3 px-3 text-bark">{formatDateEs(p.fecha_entrega)}</td>
                  <td className="py-3 px-3"><StatusBadge status={p.estado} /></td>
                  <td className="py-3 px-5">
                    <div className="flex justify-end gap-1">
                      {p.estado !== 'Entregado' && p.estado !== 'Cancelado' && (
                        <button onClick={() => markDelivered(p)} className="btn-ghost text-xs">Entregado</button>
                      )}
                      <button onClick={() => openEdit(p)} className="btn-ghost text-xs">Editar</button>
                      <button onClick={() => handleDelete(p.id)} className="btn-ghost text-xs text-rose-600">Eliminar</button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center text-bark/50 py-10">No hay pedidos que coincidan con la búsqueda.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas en celular */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => {
          const pendiente = (Number(p.precio) || 0) - (Number(p.abono) || 0)
          return (
            <div key={p.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-clay truncate">{p.nombre_detalle}</p>
                  <p className="text-xs text-bark/55 mt-0.5">{p.cliente}</p>
                </div>
                <StatusBadge status={p.estado} />
              </div>
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-bark/60">Precio <span className="text-clay font-medium">{formatCOP(p.precio)}</span></span>
                <span className={`font-medium ${pendiente > 0 ? 'text-rose-600' : 'text-sage-600'}`}>Saldo {formatCOP(pendiente)}</span>
              </div>
              <p className="text-xs text-bark/50 mt-1">Entrega: {formatDateEs(p.fecha_entrega)}</p>
              <div className="flex gap-2 mt-3">
                {p.estado !== 'Entregado' && p.estado !== 'Cancelado' && (
                  <button onClick={() => markDelivered(p)} className="btn-secondary text-xs flex-1">Entregado</button>
                )}
                <button onClick={() => openEdit(p)} className="btn-secondary text-xs flex-1">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="btn-ghost text-xs text-rose-600">Eliminar</button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <p className="text-center text-bark/50 py-10 text-sm">No hay pedidos que coincidan con la búsqueda.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar pedido' : 'Nuevo pedido'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Nombre del detalle</label>
            <input required className="input-field" value={form.nombre_detalle} onChange={(e) => setForm({ ...form, nombre_detalle: e.target.value })} placeholder="Ej. Caja de flores eternas" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Cliente</label>
              <input required className="input-field" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} placeholder="Nombre del cliente" />
            </div>
            <div>
              <label className="label-field">Teléfono (opcional)</label>
              <input className="input-field" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="300 000 0000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Precio total</label>
              <input required type="number" min="0" className="input-field" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="150000" />
            </div>
            <div>
              <label className="label-field">Abono</label>
              <input type="number" min="0" className="input-field" value={form.abono} onChange={(e) => setForm({ ...form, abono: e.target.value })} placeholder="50000" />
            </div>
          </div>
          <div className="bg-sand/50 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-bark/70">Saldo pendiente</span>
            <span className="font-semibold text-clay">{formatCOP(saldo)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Fecha para la que se necesita</label>
              <input type="date" className="input-field" value={form.fecha_entrega} min={todayISO()} onChange={(e) => setForm({ ...form, fecha_entrega: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Estado</label>
              <select className="input-field" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                {ESTADOS.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
          {!editing && (
            <p className="text-xs text-bark/50">La fecha del pedido se registrará automáticamente como hoy, {formatDateEs(todayISO())}.</p>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Guardando…' : 'Guardar pedido'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Detalle del pedido">
        {viewing && (
          <div className="space-y-3 text-sm">
            <Row label="Detalle" value={viewing.nombre_detalle} />
            <Row label="Cliente" value={viewing.cliente} />
            {viewing.telefono && <Row label="Teléfono" value={viewing.telefono} />}
            <Row label="Precio total" value={formatCOP(viewing.precio)} />
            <Row label="Abono" value={formatCOP(viewing.abono)} />
            <Row label="Saldo pendiente" value={formatCOP((Number(viewing.precio) || 0) - (Number(viewing.abono) || 0))} />
            <Row label="Fecha del pedido" value={formatDateEs(viewing.fecha_pedido)} />
            <Row label="Fecha de entrega" value={formatDateEs(viewing.fecha_entrega)} />
            <Row label="Estado" value={<StatusBadge status={viewing.estado} />} />
          </div>
        )}
      </Modal>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-sand last:border-0">
      <span className="text-bark/60">{label}</span>
      <span className="font-medium text-clay">{value}</span>
    </div>
  )
}
