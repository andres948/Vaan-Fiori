import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { demoPedidos, demoCostos, demoGastosPersonales } from '../data/demoData'
import { todayISO } from '../lib/format'

const DataContext = createContext(null)

const LOCAL_PEDIDOS_KEY  = 'vaanfiori_pedidos'
const LOCAL_COSTOS_KEY   = 'vaanfiori_costos'
const LOCAL_GASTOS_KEY   = 'vaanfiori_gastos_personales'

function loadLocal(key, fallback) {
  const stored = localStorage.getItem(key)
  if (stored) {
    try { return JSON.parse(stored) } catch { return fallback }
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
  const [pedidos,           setPedidos]           = useState([])
  const [costos,            setCostos]            = useState([])
  const [gastosPersonales,  setGastosPersonales]  = useState([])
  const [loading,           setLoading]           = useState(true)

  const loadAll = useCallback(async () => {
    setLoading(true)
    if (isSupabaseConfigured) {
      const [
        { data: pedidosData,  error: pedidosErr  },
        { data: costosData,   error: costosErr   },
        { data: gastosData,   error: gastosErr   },
      ] = await Promise.all([
        supabase.from('pedidos').select('*').order('fecha_pedido', { ascending: false }),
        supabase.from('costos').select('*').order('fecha', { ascending: false }),
        supabase.from('gastos_personales').select('*').order('fecha', { ascending: false }),
      ])
      if (pedidosErr)  console.error(pedidosErr)
      if (costosErr)   console.error(costosErr)
      if (gastosErr)   console.error(gastosErr)
      setPedidos(pedidosData  || [])
      setCostos(costosData    || [])
      setGastosPersonales(gastosData || [])
    } else {
      setPedidos(loadLocal(LOCAL_PEDIDOS_KEY, demoPedidos))
      setCostos(loadLocal(LOCAL_COSTOS_KEY, demoCostos))
      setGastosPersonales(loadLocal(LOCAL_GASTOS_KEY, demoGastosPersonales))
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // ─── Pedidos ───────────────────────────────────────────────

  async function addPedido(pedido) {
    const nuevo = {
      ...pedido,
      fecha_pedido: todayISO(),
      estado: pedido.estado || 'Pendiente',
    }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('pedidos').insert(nuevo).select().single()
      if (error) throw error
      setPedidos(prev => [data, ...prev])
      return data
    }
    const conId = { ...nuevo, id: uid() }
    setPedidos(prev => {
      const next = [conId, ...prev]
      saveLocal(LOCAL_PEDIDOS_KEY, next)
      return next
    })
    return conId
  }

  async function updatePedido(id, changes) {
    // ── Liquidación automática ──────────────────────────────
    // Si el pedido pasa a "Entregado", el abono se iguala al precio total
    // para que el saldo pendiente quede en $0.
    let finalChanges = { ...changes }
    if (changes.estado === 'Entregado') {
      // Necesitamos el precio actual del pedido
      const pedidoActual = pedidos.find(p => p.id === id)
      if (pedidoActual) {
        finalChanges.abono = Number(pedidoActual.precio) || 0
      }
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('pedidos')
        .update(finalChanges)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      setPedidos(prev => prev.map(p => (p.id === id ? data : p)))
      return data
    }
    setPedidos(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...finalChanges } : p))
      saveLocal(LOCAL_PEDIDOS_KEY, next)
      return next
    })
  }

  async function deletePedido(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('pedidos').delete().eq('id', id)
      if (error) throw error
    }
    setPedidos(prev => {
      const next = prev.filter(p => p.id !== id)
      if (!isSupabaseConfigured) saveLocal(LOCAL_PEDIDOS_KEY, next)
      return next
    })
  }

  // ─── Costos de producción ──────────────────────────────────

  async function addCosto(costo) {
    const nuevo = { ...costo, fecha: todayISO() }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('costos').insert(nuevo).select().single()
      if (error) throw error
      setCostos(prev => [data, ...prev])
      return data
    }
    const conId = { ...nuevo, id: uid() }
    setCostos(prev => {
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
      setCostos(prev => prev.map(c => (c.id === id ? data : c)))
      return data
    }
    setCostos(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, ...changes } : c))
      saveLocal(LOCAL_COSTOS_KEY, next)
      return next
    })
  }

  async function deleteCosto(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('costos').delete().eq('id', id)
      if (error) throw error
    }
    setCostos(prev => {
      const next = prev.filter(c => c.id !== id)
      if (!isSupabaseConfigured) saveLocal(LOCAL_COSTOS_KEY, next)
      return next
    })
  }

  // ─── Gastos personales ─────────────────────────────────────

  async function addGastoPersonal(gasto) {
    const nuevo = { ...gasto, fecha: gasto.fecha || todayISO() }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('gastos_personales').insert(nuevo).select().single()
      if (error) throw error
      setGastosPersonales(prev => [data, ...prev])
      return data
    }
    const conId = { ...nuevo, id: uid() }
    setGastosPersonales(prev => {
      const next = [conId, ...prev]
      saveLocal(LOCAL_GASTOS_KEY, next)
      return next
    })
    return conId
  }

  async function updateGastoPersonal(id, changes) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('gastos_personales').update(changes).eq('id', id).select().single()
      if (error) throw error
      setGastosPersonales(prev => prev.map(g => (g.id === id ? data : g)))
      return data
    }
    setGastosPersonales(prev => {
      const next = prev.map(g => (g.id === id ? { ...g, ...changes } : g))
      saveLocal(LOCAL_GASTOS_KEY, next)
      return next
    })
  }

  async function deleteGastoPersonal(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('gastos_personales').delete().eq('id', id)
      if (error) throw error
    }
    setGastosPersonales(prev => {
      const next = prev.filter(g => g.id !== id)
      if (!isSupabaseConfigured) saveLocal(LOCAL_GASTOS_KEY, next)
      return next
    })
  }

  return (
    <DataContext.Provider
      value={{
        pedidos,
        costos,
        gastosPersonales,
        loading,
        addPedido,
        updatePedido,
        deletePedido,
        addCosto,
        updateCosto,
        deleteCosto,
        addGastoPersonal,
        updateGastoPersonal,
        deleteGastoPersonal,
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
