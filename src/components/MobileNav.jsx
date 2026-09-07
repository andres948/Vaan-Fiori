import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { links } from './Sidebar'

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const { signOut } = useAuth()

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-porcelain/95 backdrop-blur border-b border-sand">
        <Logo compact />
        <button
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
          className="p-2 -mr-2 rounded-lg text-clay hover:bg-clay/5"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-clay/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-porcelain shadow-soft flex flex-col animate-[slideIn_.22s_ease-out]">
            <div className="flex items-center justify-between px-5 pt-6 pb-4">
              <Logo compact />
              <button aria-label="Cerrar menú" onClick={() => setOpen(false)} className="p-2 -mr-2 text-clay">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-3 space-y-1">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-[15px] font-medium ${
                      isActive ? 'bg-rose-50 text-rose-700' : 'text-bark'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="px-3 pb-6 pt-3 border-t border-sand mx-3">
              <button onClick={signOut} className="btn-ghost w-full justify-start text-bark/70">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra inferior para acceso rápido con el pulgar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-porcelain/95 backdrop-blur border-t border-sand flex justify-around py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        {links.slice(0, 4).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[11px] font-medium ${
                isActive ? 'text-rose-600' : 'text-bark/60'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
