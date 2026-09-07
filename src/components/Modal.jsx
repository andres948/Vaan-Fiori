export default function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-clay/40" onClick={onClose} />
      <div
        className={`relative w-full ${wide ? 'sm:max-w-lg' : 'sm:max-w-md'} bg-porcelain rounded-t-2xl sm:rounded-2xl shadow-soft max-h-[90vh] overflow-y-auto animate-[fadeIn_.18s_ease-out]`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 sticky top-0 bg-porcelain">
          <h2 className="font-display text-xl text-clay">{title}</h2>
          <button aria-label="Cerrar" onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-bark/60 hover:bg-clay/5">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  )
}
