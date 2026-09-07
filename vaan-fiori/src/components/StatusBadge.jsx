const STATUS_STYLES = {
  'Pendiente': 'bg-sand text-bark',
  'En preparación': 'bg-rose-100 text-rose-700',
  'Listo': 'bg-sage-100 text-sage-700',
  'Entregado': 'bg-sage-300/50 text-sage-700',
  'Cancelado': 'bg-clay/10 text-clay/60 line-through decoration-1',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status] || 'bg-sand text-bark'}`}>
      {status}
    </span>
  )
}

export const ESTADOS = ['Pendiente', 'En preparación', 'Listo', 'Entregado', 'Cancelado']
