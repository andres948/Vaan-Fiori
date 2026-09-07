import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { useData } from '../context/DataContext'
import { formatCOP, currentMonthKey, monthLabel, MESES } from '../lib/format'
import { computeMonthSummary } from '../lib/finance'

export default function Finanzas() {
  const { pedidos, costos } = useData()
  const [monthKey, setMonthKey] = useState(currentMonthKey())
  const [year, month] = monthKey.split('-').map(Number)

  const summary = useMemo(() => computeMonthSummary(pedidos, costos, monthKey), [pedidos, costos, monthKey])

  const chartData = [
    { nombre: monthLabel(monthKey), Ingresos: summary.ventas, Gastos: summary.gastos, Ganancia: summary.ganancia },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-clay">Finanzas</h1>
        <p className="text-bark/60 text-sm mt-1">Resultados financieros mes a mes.</p>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm text-bark/60 mr-1">Selecciona el mes:</span>
          <select
            value={month}
            onChange={(e) => setMonthKey(`${year}-${String(Number(e.target.value)).padStart(2, '0')}`)}
            className="input-field w-auto"
          >
            {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select
            value={year}
            onChange={(e) => setMonthKey(`${e.target.value}-${String(month).padStart(2, '0')}`)}
            className="input-field w-auto"
          >
            {[year - 1, year, year + 1].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-bark/60">Resumen de {monthLabel(monthKey).toLowerCase()}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <Metric label="Ingresos" value={summary.ventas} />
          <Metric label="Abonos recibidos" value={summary.abonado} tone="sage" />
          <Metric label="Pendiente por cobrar" value={summary.pendienteCobro} tone="rose" />
          <Metric label="Gastos" value={summary.gastos} />
          <Metric label="Ganancia" value={summary.ganancia} big tone={summary.ganancia >= 0 ? 'sage' : 'rose'} />
          <Metric label="Total de ventas" value={summary.ventas} />
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={10}>
              <CartesianGrid strokeDasharray="3 6" stroke="#EDE4D3" vertical={false} />
              <XAxis dataKey="nombre" tick={{ fill: '#5B4A42', fontSize: 12 }} axisLine={{ stroke: '#EDE4D3' }} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} tick={{ fill: '#5B4A42', fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
              <Tooltip formatter={(v) => formatCOP(v)} contentStyle={{ borderRadius: 12, border: '1px solid #EDE4D3', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar dataKey="Ingresos" fill="#B96F60" radius={[6, 6, 0, 0]} maxBarSize={64} />
              <Bar dataKey="Gastos" fill="#5E6F45" radius={[6, 6, 0, 0]} maxBarSize={64} />
              <Bar dataKey="Ganancia" fill="#3A2E2A" radius={[6, 6, 0, 0]} maxBarSize={64} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, tone = 'neutral', big = false }) {
  const toneClasses = { neutral: 'text-clay', rose: 'text-rose-600', sage: 'text-sage-600' }
  return (
    <div className={`rounded-xl2 border border-sand px-4 py-4 ${big ? 'bg-sand/40' : ''}`}>
      <p className="text-xs text-bark/60">{label}</p>
      <p className={`font-display mt-1 ${big ? 'text-2xl' : 'text-xl'} ${toneClasses[tone]}`}>{formatCOP(value)}</p>
    </div>
  )
}
