import { useMemo, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { useData } from '../context/DataContext'
import StatCard from '../components/StatCard'
import { formatCOP, currentMonthKey, monthLabel, MESES } from '../lib/format'
import { computeMonthSummary, computeMonthlySeries } from '../lib/finance'

const AÑOS = [2025, 2026, 2027]

export default function Finanzas() {
  const { pedidos, costos, gastosPersonales, loading } = useData()
  const [monthKey, setMonthKey] = useState(currentMonthKey())
  const [anioVista, setAnioVista] = useState(new Date().getFullYear())

  const [year, month] = monthKey.split('-').map(Number)
  function shiftMonth(d) {
    const nd = new Date(year, month - 1 + d, 1)
    setMonthKey(`${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}`)
  }

  const summary = useMemo(
    () => computeMonthSummary(pedidos, costos, monthKey, gastosPersonales),
    [pedidos, costos, monthKey, gastosPersonales]
  )

  // Serie de los últimos 6 meses para el gráfico de área
  const series6 = useMemo(
    () => computeMonthlySeries(pedidos, costos, monthKey, 6, gastosPersonales),
    [pedidos, costos, monthKey, gastosPersonales]
  )

  // Serie anual completa (12 meses del año seleccionado)
  const seriesAnual = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const mk = `${anioVista}-${String(i + 1).padStart(2, '0')}`
      const ordsMes = pedidos.filter(p => (p.fecha_pedido || '').startsWith(mk))
      const costosMes = costos.filter(c => (c.fecha || '').startsWith(mk))
      const gastosMes = (gastosPersonales || []).filter(g => (g.fecha || '').startsWith(mk))

      const ingresos = ordsMes
        .filter(p => p.estado === 'Entregado')
        .reduce((a, b) => a + (Number(b.precio) || 0), 0)
      const abonos = ordsMes.reduce((a, b) => a + (Number(b.abono) || 0), 0)
      const gastosProd = costosMes.reduce((a, b) => a + (Number(b.precio) || 0) * (Number(b.cantidad) || 1), 0)
      const gastosPerso = gastosMes.reduce((a, b) => a + (Number(b.valor) || 0), 0)

      return {
        mes: mk,
        ingresos,
        abonos,
        gastosProd,
        gastosPerso,
        balance: ingresos - gastosProd - gastosPerso,
      }
    })
  }, [pedidos, costos, gastosPersonales, anioVista])

  // Top clientes
  const topClientes = useMemo(() => {
    const map = {}
    pedidos.filter(p => p.estado === 'Entregado').forEach(p => {
      map[p.cliente] = (map[p.cliente] || 0) + (Number(p.precio) || 0)
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [pedidos])

  const maxTop = topClientes[0]?.[1] || 1

  if (loading) return <p className="text-bark/60">Cargando información…</p>

  const totalAnio = seriesAnual.reduce((a, b) => a + b.ingresos, 0)
  const totalGastosAnio = seriesAnual.reduce((a, b) => a + b.gastosProd + b.gastosPerso, 0)
  const mejorMes = [...seriesAnual].sort((a, b) => b.ingresos - a.ingresos)[0]

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-clay">Finanzas</h1>
          <p className="text-bark/60 text-sm mt-1">Ventas, gastos y balance general.</p>
        </div>
        <div className="flex items-center gap-2 card px-2 py-1.5">
          <button onClick={() => shiftMonth(-1)} className="p-1.5 rounded-lg hover:bg-clay/5 text-bark">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span className="text-sm font-medium text-clay px-1 min-w-[140px] text-center">{monthLabel(monthKey)}</span>
          <button onClick={() => shiftMonth(1)} className="p-1.5 rounded-lg hover:bg-clay/5 text-bark">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      {/* KPIs del mes */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Ventas del mes" value={formatCOP(summary.ventas)} hint={`${summary.cantidadPedidos} pedidos`} />
        <StatCard label="Total abonado" value={formatCOP(summary.abonado)} tone="sage" />
        <StatCard label="Pendiente por cobrar" value={formatCOP(summary.pendienteCobro)} tone="rose" />
        <StatCard label="Costos de producción" value={formatCOP(summary.gastos)} />
        <StatCard label="Gastos personales" value={formatCOP(summary.gastosPersonales || 0)} />
        <StatCard label="Ganancia neta" value={formatCOP(summary.ganancia)} tone={summary.ganancia >= 0 ? 'sage' : 'rose'} />
      </div>

      {/* Gráfico área — últimos 6 meses */}
      <div className="card p-5 sm:p-6">
        <h2 className="font-display text-lg text-clay mb-4">Ingresos vs Gastos — últimos 6 meses</h2>
        <div className="h-64 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series6} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B96F60" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#B96F60" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5E6F45" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#5E6F45" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPerso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="#EDE4D3" vertical={false} />
              <XAxis
                dataKey="mes"
                tickFormatter={m => MESES[Number(m.split('-')[1]) - 1].slice(0, 3)}
                tick={{ fill: '#5B4A42', fontSize: 12 }}
                axisLine={{ stroke: '#EDE4D3' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => `$${Math.round(v / 1000)}k`}
                tick={{ fill: '#5B4A42', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                formatter={(v, name) => [
                  formatCOP(v),
                  name === 'ingresos' ? 'Ingresos' : name === 'gastos' ? 'Costos prod.' : 'Gastos pers.',
                ]}
                labelFormatter={m => monthLabel(m)}
                contentStyle={{ borderRadius: 12, border: '1px solid #EDE4D3', fontSize: 13 }}
              />
              <Area type="monotone" dataKey="ingresos" stroke="#B96F60" strokeWidth={2} fill="url(#gIngresos)" />
              <Area type="monotone" dataKey="gastos" stroke="#5E6F45" strokeWidth={2} fill="url(#gGastos)" />
              <Area type="monotone" dataKey="gastosPerso" stroke="#C9A96E" strokeWidth={2} fill="url(#gPerso)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-5 mt-2 text-xs text-bark/60 flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Ingresos</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5E6F45] inline-block" /> Costos producción</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E] inline-block" /> Gastos personales</span>
        </div>
      </div>

      {/* Gráfico barras — vista anual */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-display text-lg text-clay">Balance mensual {anioVista}</h2>
          <select
            value={anioVista}
            onChange={e => setAnioVista(Number(e.target.value))}
            className="input-field w-auto text-sm"
          >
            {AÑOS.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        {/* KPIs anuales */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-sand/50 rounded-xl p-3 text-center">
            <p className="text-xs text-bark/55 mb-1">Ingresos {anioVista}</p>
            <p className="font-display text-lg text-clay">{formatCOP(totalAnio)}</p>
          </div>
          <div className="bg-sand/50 rounded-xl p-3 text-center">
            <p className="text-xs text-bark/55 mb-1">Gastos {anioVista}</p>
            <p className="font-display text-lg text-clay">{formatCOP(totalGastosAnio)}</p>
          </div>
          <div className="bg-sand/50 rounded-xl p-3 text-center">
            <p className="text-xs text-bark/55 mb-1">Mejor mes</p>
            <p className="font-display text-lg text-clay">
              {mejorMes?.ingresos > 0 ? MESES[Number(mejorMes.mes.split('-')[1]) - 1] : '—'}
            </p>
          </div>
        </div>

        <div className="h-64 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seriesAnual} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 6" stroke="#EDE4D3" vertical={false} />
              <XAxis
                dataKey="mes"
                tickFormatter={m => MESES[Number(m.split('-')[1]) - 1].slice(0, 3)}
                tick={{ fill: '#5B4A42', fontSize: 11 }}
                axisLine={{ stroke: '#EDE4D3' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => `$${Math.round(v / 1000)}k`}
                tick={{ fill: '#5B4A42', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                formatter={(v, name) => [
                  formatCOP(v),
                  name === 'ingresos' ? 'Ingresos' : name === 'gastosProd' ? 'Costos prod.' : name === 'gastosPerso' ? 'Gastos pers.' : 'Balance',
                ]}
                labelFormatter={m => monthLabel(m)}
                contentStyle={{ borderRadius: 12, border: '1px solid #EDE4D3', fontSize: 13 }}
              />
              <Bar dataKey="ingresos" fill="#B96F60" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastosProd" fill="#5E6F45" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastosPerso" fill="#C9A96E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-5 mt-2 text-xs text-bark/60 flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Ingresos</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5E6F45] inline-block" /> Costos prod.</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E] inline-block" /> Gastos pers.</span>
        </div>
      </div>

      {/* Tabla mensual */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-sand">
          <h2 className="font-display text-lg text-clay">Detalle por mes — {anioVista}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-bark/55 border-b border-sand">
                <th className="font-medium py-3 px-5">Mes</th>
                <th className="font-medium py-3 px-3">Ingresos</th>
                <th className="font-medium py-3 px-3">Costos prod.</th>
                <th className="font-medium py-3 px-3">Gastos pers.</th>
                <th className="font-medium py-3 px-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {seriesAnual.map((d, i) => {
                const prev = i > 0 ? seriesAnual[i - 1].ingresos : null
                const trend = prev !== null && prev > 0 && d.ingresos > 0
                  ? Math.round(((d.ingresos - prev) / prev) * 100) : null
                return (
                  <tr key={d.mes} className="border-b border-sand/70 last:border-0 hover:bg-clay/[0.02]">
                    <td className="py-3 px-5 font-medium text-clay">{MESES[i]}</td>
                    <td className="py-3 px-3 text-clay">
                      {formatCOP(d.ingresos)}
                      {trend !== null && (
                        <span className={`ml-1.5 text-xs ${trend >= 0 ? 'text-green-600' : 'text-rose-500'}`}>
                          {trend >= 0 ? '▲' : '▼'}{Math.abs(trend)}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-bark">{formatCOP(d.gastosProd)}</td>
                    <td className="py-3 px-3 text-bark">{formatCOP(d.gastosPerso)}</td>
                    <td className={`py-3 px-3 font-semibold ${d.balance >= 0 ? 'text-green-700' : 'text-rose-600'}`}>
                      {formatCOP(d.balance)}
                    </td>
                  </tr>
                )
              })}
              <tr className="bg-sand/30 font-semibold">
                <td className="py-3 px-5 text-clay">Total {anioVista}</td>
                <td className="py-3 px-3 text-clay">{formatCOP(totalAnio)}</td>
                <td className="py-3 px-3 text-bark">{formatCOP(seriesAnual.reduce((a, b) => a + b.gastosProd, 0))}</td>
                <td className="py-3 px-3 text-bark">{formatCOP(seriesAnual.reduce((a, b) => a + b.gastosPerso, 0))}</td>
                <td className={`py-3 px-3 ${totalAnio - totalGastosAnio >= 0 ? 'text-green-700' : 'text-rose-600'}`}>
                  {formatCOP(totalAnio - totalGastosAnio)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Top clientes */}
      <div className="card p-5 sm:p-6">
        <h2 className="font-display text-lg text-clay mb-4">Top clientes por ventas</h2>
        {topClientes.length === 0
          ? <p className="text-sm text-bark/50">Sin datos aún.</p>
          : topClientes.map(([nombre, total], i) => (
            <div key={nombre} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium text-clay">{i + 1}. {nombre}</span>
                <span className="text-sm text-rose-600 font-medium">{formatCOP(total)}</span>
              </div>
              <div className="h-2 bg-sand rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-700"
                  style={{ width: `${Math.round((total / maxTop) * 100)}%` }}
                />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
