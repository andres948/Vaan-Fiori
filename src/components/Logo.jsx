export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={compact ? '20' : '24'} height={compact ? '20' : '24'} viewBox="0 0 32 32" className="shrink-0 -mt-0.5">
        <circle cx="16" cy="16" r="3.4" fill="#B96F60" />
        <ellipse cx="16" cy="7.5" rx="3.6" ry="5.4" fill="#E3AFA6" />
        <ellipse cx="16" cy="24.5" rx="3.6" ry="5.4" fill="#7C8F5F" />
        <ellipse cx="7.5" cy="16" rx="5.4" ry="3.6" fill="#CE8A7D" />
        <ellipse cx="24.5" cy="16" rx="5.4" ry="3.6" fill="#B7C29E" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className={`font-display font-medium tracking-tight text-clay ${compact ? 'text-lg' : 'text-xl'}`}>
          Vaan Fiori
        </span>
        {!compact && (
          <span className="text-[11px] mt-1 text-bark/55 font-body italic">
            Flores que perduran
          </span>
        )}
      </div>
    </div>
  )
}
