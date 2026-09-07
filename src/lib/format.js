// Utilidades de formato para VAAN FIORI (moneda COP, fechas en español)

export function formatCOP(value) {
  const number = Number(value) || 0
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(number)
}

export function parseCOPInput(value) {
  if (typeof value === 'number') return value
  const cleaned = String(value).replace(/[^0-9-]/g, '')
  return cleaned ? parseInt(cleaned, 10) : 0
}

export function todayISO() {
  const d = new Date()
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10)
}

export function formatDateEs(isoDate) {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(y, (m || 1) - 1, d || 1)
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export function monthKeyFromISO(isoDate) {
  return isoDate ? isoDate.slice(0, 7) : ''
}

export function monthLabel(monthKey) {
  const [y, m] = monthKey.split('-').map(Number)
  return `${MESES[(m || 1) - 1]} ${y}`
}

export function currentMonthKey() {
  return todayISO().slice(0, 7)
}
