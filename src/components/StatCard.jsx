export default function StatCard({ label, value, tone = 'neutral', hint }) {
  const toneClasses = {
    neutral: 'text-clay',
    rose: 'text-rose-600',
    sage: 'text-sage-600',
  }
  return (
    <div className="card p-5">
      <p className="text-sm text-bark/65">{label}</p>
      <p className={`font-display text-[28px] mt-1.5 ${toneClasses[tone]}`}>{value}</p>
      {hint && <p className="text-xs text-bark/50 mt-1">{hint}</p>}
    </div>
  )
}
