import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { demoPedidos, demoCostos } from '../data/demoData'
import { todayISO } from '../lib/format'

const DataContext = createContext(null)

const LOCAL_PEDIDOS_KEY = 'vaanfiori_pedidos'
const LOCAL_COSTOS_KEY = 'vaanfiori_costos'

function loadLocal(key, fallback) {
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return fallback
    }
  }
  return fallback
}

function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function DataProvider({ children }) {
  const [pedidos, setPedidos] = useState([])
  const [costos, setCostos] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    setLoading(true)
    if (isSupabaseConfigured) {
      const [{ data: pedidosData, error: pedidosErr }, { data: costosData, error: costosErr }] = await Promise.all([
        supabase.from('pedidos').select('*').order('fecha_pedido', { ascending: false }),
        supabase.from('costos').select('*').order('fecha', { ascending: false }),
      ])
      if (pedidosErr) console.error(pedidosErr)
      if (costosErr) console.error(costosErr)
      setPedidos(pedidosData || [])
      setCostos(costosData || [])
    } else {
      setPedidos(loadLocal(LOCAL_PEDIDOS_KEY, demoPedidos))
      setCostos(loadLocal(LOCAL_COSTOS_KEY, demoCostos))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // ---------- Pedidos ----------

  async function addPedido(pedido) {
    const nuevo = {
      ...pedido,
      fecha_pedido: todayISO(),
      estado: pedido.estado || 'Pendiente',
    }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('pedidos').insert(nuevo).select().single()
      if (error) throw error
      setPedidos((prev) => [data, ...prev])
      return data
    }
    const conId = { ...nuevo, id: uid() }
    setPedidos((prev) => {
      const next = [conId, ...prev]
      saveLocal(LOCAL_PEDIDOS_KEY, next)
      return next
    })
    return conId
  }

  async function updatePedido(id, changes) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('pedidos').update(changes).eq('id', id).select().single()
      if (error) throw error
      setPedidos((prev) => prev.map((p) => (p.id === id ? data : p)))
      return data
    }
    setPedidos((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
      saveLocal(LOCAL_PEDIDOS_KEY, next)
      return next
    })
  }

  async function deletePedido(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('pedidos').delete().eq('id', id)
      if (error) throw error
    }
    setPedidos((prev) => {
      const next = prev.filter((p) => p.id !== id)
      if (!isSupabaseConfigured) saveLocal(LOCAL_PEDIDOS_KEY, next)
      return next
    })
  }

  // ---------- Costos ----------

  async function addCosto(costo) {
    const nuevo = { ...costo, fecha: todayISO() }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('costos').insert(nuevo).select().single()
      if (error) throw error
      setCostos((prev) => [data, ...prev])
      return data
    }
    const conId = { ...nuevo, id: uid() }
    setCostos((prev) => {
      const next = [conId, ...prev]
      saveLocal(LOCAL_COSTOS_KEY, next)
      return next
    })
    return conId
  }

  async function updateCosto(id, changes) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('costos').update(changes).eq('id', id).select().single()
      if (error) throw error
      setCostos((prev) => prev.map((c) => (c.id === id ? data : c)))
      return data
    }
    setCostos((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...changes } : c))
      saveLocal(LOCAL_COSTOS_KEY, next)
      return next
    })
  }

  async function deleteCosto(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('costos').delete().eq('id', id)
      if (error) throw error
    }
    setCostos((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (!isSupabaseConfigured) saveLocal(LOCAL_COSTOS_KEY, next)
      return next
    })
  }

  return (
    <DataContext.Provider
      value={{
        pedidos,
        costos,
        loading,
        addPedido,
        updatePedido,
        deletePedido,
        addCosto,
        updateCosto,
        deleteCosto,
        reload: loadAll,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider')
  return ctx
}
