# VAAN FIORI · Gestión financiera y de pedidos

Aplicación web para administrar los pedidos, costos y finanzas de VAAN FIORI,
floristería de flores eternas y detalles personalizados. Construida con
**React + Vite + Tailwind CSS**, con **Supabase** como base de datos y
autenticación.

## Funcionalidades

- Inicio de sesión privado (solo el propietario, sin registro público).
- Panel con resumen financiero del mes: ventas, abonos, saldo pendiente,
  costos, ganancia y pedidos pendientes, con gráfica de ingresos vs. gastos.
- **Pedidos**: registro con cálculo automático del saldo pendiente
  (precio − abono), fecha automática de creación, búsqueda, filtros por
  estado y fecha, edición, eliminación y marcado como entregado.
- **Costos**: registro de compras con cálculo automático del total
  (precio × cantidad) y fecha automática.
- **Finanzas**: ingresos, gastos y ganancia por mes, con selector de mes/año
  y gráfica comparativa.
- Interfaz totalmente en español, responsive (menú lateral en escritorio,
  menú y barra inferior en celular) y en pesos colombianos (COP).

## Modo demostración

Si no configuras Supabase, la aplicación funciona igual: puedes iniciar
sesión con cualquier correo y contraseña, y los datos se guardan en el
navegador (localStorage) con algunos pedidos y costos de ejemplo. Esto te
permite explorar la app de inmediato. En cuanto conectes Supabase (ver
abajo), la app usa la base de datos real automáticamente.

## Requisitos

- Node.js 18 o superior
- Una cuenta gratuita de [Supabase](https://supabase.com) (opcional, para
  datos reales y autenticación real)

## Instalación local

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Conectar Supabase (base de datos y autenticación reales)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el editor SQL de tu proyecto, ejecuta el contenido de
   `supabase/schema.sql` (crea las tablas `pedidos` y `costos` con sus
   reglas de seguridad).
3. En **Authentication → Providers**, deja activado el método de
   correo/contraseña y **desactiva** el registro público
   (Authentication → Settings → "Enable email signups" en apagado).
4. En **Authentication → Users**, crea manualmente el usuario del
   propietario (tu correo y contraseña).
5. Copia `.env.example` como `.env` y completa:

   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
   ```

   Estos valores están en Supabase, en **Project Settings → API**.
6. Reinicia `npm run dev`. La app iniciará sesión y guardará los datos en
   Supabase automáticamente.

Nunca subas el archivo `.env` a un repositorio público; ya está incluido en
`.gitignore`.

## Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub (o similar).
2. En [vercel.com](https://vercel.com), crea un nuevo proyecto e impórtalo
   desde el repositorio.
3. Vercel detecta automáticamente que es un proyecto Vite. Deja el comando
   de build como `npm run build` y el directorio de salida como `dist`.
4. En **Settings → Environment Variables**, agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Despliega. El archivo `vercel.json` incluido ya está configurado para
   que las rutas internas (Pedidos, Costos, Finanzas, etc.) funcionen
   correctamente al recargar la página.

## Estructura del proyecto

```
src/
  components/    Componentes reutilizables (Sidebar, MobileNav, tarjetas, modal…)
  context/       Estado global: autenticación, datos (pedidos/costos), notificaciones
  data/          Datos de demostración (bórralos cuando uses datos reales)
  lib/           Utilidades: formato de moneda/fecha, cálculos financieros, cliente Supabase
  pages/         Pantallas: Login, Panel, Pedidos, Costos, Finanzas, Configuración
supabase/
  schema.sql     Script SQL para crear las tablas y políticas de seguridad
```

## Quitar los datos de demostración

Los datos ficticios viven en `src/data/demoData.js` y solo se usan cuando no
hay Supabase configurado. Para partir de cero en modo demostración, vacía
los arreglos `demoPedidos` y `demoCostos` de ese archivo, o simplemente
borra los datos guardados en el navegador (localStorage) y conecta Supabase
para trabajar con información real.
