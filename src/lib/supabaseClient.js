import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// La app funciona en "modo demo" (datos locales en memoria) cuando no hay
// credenciales de Supabase configuradas, para poder previsualizarla de
// inmediato. En cuanto se definan las variables de entorno VITE_SUPABASE_URL
// y VITE_SUPABASE_ANON_KEY, se conecta automáticamente a la base de datos real.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
