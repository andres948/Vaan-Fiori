import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useData } from '../context/DataContext'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { formatCOP, formatDateEs, currentMonthKey, monthLabel, MESES } from '../lib/format'
import { computeMonthSummary, computeMonthlySeries } from '../lib/finance'

export default function Dashboard() {
  const { pedidos, costos, loading } = useData()
  const [monthKey, setMonthKey] = useState(currentMonthKey())

  const summary = useMemo(() => computeMonthSummary(pedidos, costos, monthKey), [pedidos, costos, monthKey])
  const series = useMemo(() => computeMonthlySeries(pedidos, costos, monthKey, 6), [pedidos, costos, monthKey])

  const pedidosRecientes = useMemo(
    () => [...pedidos].sort((a, b) => (a.fecha_pedido < b.fecha_pedido ? 1 : -1)).slice(0, 5),
    [pedidos]
  )

  const [year, month] = monthKey.split('-').map(Number)

  function shiftMonth(delta) {
    const d = new Date(year, month - 1 + delta, 1)
    setMonthKey(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  if (loading) return <p className="text-bark/60">Cargando información…</p>

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-clay">Panel general</h1>
          <p className="text-bark/60 text-sm mt-1">Resumen financiero de tu floristería.</p>
        </div>
        <div className="flex items-center gap-2 card px-2 py-1.5">
          <button onClick={() => shiftMonth(-1)} className="p-1.5 rounded-lg hover:bg-clay/5 text-bark" aria-label="Mes anterior">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span className="text-sm font-medium text-clay px-1 min-w-[140px] text-center">{monthLabel(monthKey)}</span>
          <button onClick={() => shiftMonth(1)} className="p-1.5 rounded-lg hover:bg-clay/5 text-bark" aria-label="Mes siguiente">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Ventas del mes" value={formatCOP(summary.ventas)} hint={`${summary.cantidadPedidos} pedidos`} />
        <StatCard label="Total abonado" value={formatCOP(summary.abonado)} tone="sage" />
        <StatCard label="Pendiente por recibir" value={formatCOP(summary.pendienteCobro)} tone="rose" />
        <StatCard label="Costos del mes" value={formatCOP(summary.gastos)} />
        <StatCard label="Ganancia del mes" value={formatCOP(summary.ganancia)} tone={summary.ganancia >= 0 ? 'sage' : 'rose'} />
        <StatCard label="Pedidos pendientes" value={summary.pedidosPendientes} />
      </div>

      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-clay">Ingresos y gastos por mes</h2>
        </div>
        <div className="h-64 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ingresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B96F60" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#B96F60" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5E6F45" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#5E6F45" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="#EDE4D3" vertical={false} />
              <XAxis
                dataKey="mes"
                tickFormatter={(m) => MESES[Number(m.split('-')[1]) - 1].slice(0, 3)}
                tick={{ fill: '#5B4A42', fontSize: 12 }}
                axisLine={{ stroke: '#EDE4D3' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                tick={{ fill: '#5B4A42', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                formatter={(value, name) => [formatCOP(value), name === 'ingresos' ? 'Ingresos' : 'Gastos']}
                labelFormatter={(m) => monthLabel(m)}
                contentStyle={{ borderRadius: 12, border: '1px solid #EDE4D3', fontSize: 13 }}
              />
              <Area type="monotone" dataKey="ingresos" stroke="#B96F60" strokeWidth={2} fill="url(#ingresos)" />
              <Area type="monotone" dataKey="gastos" stroke="#5E6F45" strokeWidth={2} fill="url(#gastos)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-5 mt-2 text-xs text-bark/60">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Ingresos</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sage-600 inline-block" /> Gastos</span>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-clay">Pedidos recientes</h2>
          <Link to="/pedidos" className="text-sm font-medium text-rose-600 hover:text-rose-700">Ver todos</Link>
        </div>
        <div className="space-y-1 -mx-2">
          {pedidosRecientes.length === 0 && <p className="text-sm text-bark/50 px-2 py-3">Aún no hay pedidos registrados.</p>}
          {pedidosRecientes.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 px-2 py-2.5 rounded-lg hover:bg-clay/[0.03]">
              <div className="min-w-0">
                <p className="text-sm font-medium text-clay truncate">{p.nombre_detalle}</p>
                <p className="text-xs text-bark/55">{p.cliente} · {formatDateEs(p.fecha_pedido)}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-medium text-clay hidden sm:inline">{formatCOP(p.precio)}</span>
                <StatusBadge status={p.estado} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
