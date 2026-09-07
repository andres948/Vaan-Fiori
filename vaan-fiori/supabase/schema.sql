-- Esquema de base de datos para VAAN FIORI
-- Ejecuta este script en el editor SQL de tu proyecto de Supabase.

create extension if not exists "pgcrypto";

-- ---------- Tabla: pedidos ----------
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  nombre_detalle text not null,
  cliente text not null,
  telefono text,
  precio numeric not null default 0,
  abono numeric not null default 0,
  fecha_pedido date not null default current_date,
  fecha_entrega date,
  estado text not null default 'Pendiente'
    check (estado in ('Pendiente', 'En preparación', 'Listo', 'Entregado', 'Cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Tabla: costos ----------
create table if not exists public.costos (
  id uuid primary key default gen_random_uuid(),
  producto text not null,
  precio numeric not null default 0,
  cantidad numeric not null default 1,
  total numeric generated always as (precio * cantidad) stored,
  fecha date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Actualiza automáticamente "updated_at" en cada modificación
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_pedidos_updated_at on public.pedidos;
create trigger trg_pedidos_updated_at
  before update on public.pedidos
  for each row execute function public.set_updated_at();

drop trigger if exists trg_costos_updated_at on public.costos;
create trigger trg_costos_updated_at
  before update on public.costos
  for each row execute function public.set_updated_at();

-- ---------- Seguridad (RLS) ----------
-- Solo el propietario autenticado (cualquier usuario autenticado en este
-- proyecto, ya que no hay registro público) puede leer y escribir.
alter table public.pedidos enable row level security;
alter table public.costos enable row level security;

create policy "Usuarios autenticados pueden leer pedidos"
  on public.pedidos for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden escribir pedidos"
  on public.pedidos for all
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden leer costos"
  on public.costos for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden escribir costos"
  on public.costos for all
  to authenticated
  using (true)
  with check (true);

-- ---------- Nota sobre usuarios ----------
-- La autenticación se maneja con Supabase Auth (tabla interna auth.users).
-- Crea la cuenta del propietario desde el panel de Supabase:
-- Authentication > Users > Add user (correo + contraseña), y desactiva el
-- registro público en Authentication > Settings.
