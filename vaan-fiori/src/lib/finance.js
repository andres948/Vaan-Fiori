import { monthKeyFromISO } from './format'

// Calcula los totales financieros de un mes específico (formato 'YYYY-MM')
// a partir de los pedidos (ingresos, según fecha_pedido) y los costos
// (gastos, según su fecha de registro).
export function computeMonthSummary(pedidos, costos, monthKey) {
  const pedidosDelMes = pedidos.filter(
    (p) => monthKeyFromISO(p.fecha_pedido) === monthKey && p.estado !== 'Cancelado'
  )
  const costosDelMes = costos.filter((c) => monthKeyFromISO(c.fecha) === monthKey)

  const ventas = pedidosDelMes.reduce((sum, p) => sum + (Number(p.precio) || 0), 0)
  const abonado = pedidosDelMes.reduce((sum, p) => sum + (Number(p.abono) || 0), 0)
  const pendienteCobro = ventas - abonado
  const gastos = costosDelMes.reduce(
    (sum, c) => sum + (Number(c.precio) || 0) * (Number(c.cantidad) || 0),
    0
  )
  const ganancia = ventas - gastos

  const pedidosPendientes = pedidos.filter((p) =>
    ['Pendiente', 'En preparación', 'Listo'].includes(p.estado)
  ).length

  return { ventas, abonado, pendienteCobro, gastos, ganancia, pedidosPendientes, cantidadPedidos: pedidosDelMes.length }
}

// Devuelve un arreglo con los últimos `count` meses (incluido el mes dado)
// junto con sus ingresos y gastos, para graficar la evolución.
export function computeMonthlySeries(pedidos, costos, endMonthKey, count = 6) {
  const [endYear, endMonth] = endMonthKey.split('-').map(Number)
  const months = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(endYear, endMonth - 1 - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push(key)
  }
  return months.map((key) => {
    const { ventas, gastos, ganancia } = computeMonthSummary(pedidos, costos, key)
    return { mes: key, ingresos: ventas, gastos, ganancia }
  })
}
