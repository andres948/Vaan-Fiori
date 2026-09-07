import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 left-5 sm:left-auto z-[100] flex flex-col gap-2 items-center sm:items-end pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto max-w-sm w-full sm:w-auto px-4 py-3 rounded-xl shadow-soft border text-sm font-medium flex items-center gap-2 animate-[fadeIn_.2s_ease-out] ${
              t.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-sage-100 border-sage-300 text-sage-700'
            }`}
          >
            <span className="text-base leading-none">{t.type === 'error' ? '✕' : '✓'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}
