// Datos ficticios únicamente para demostrar el funcionamiento visual de la
// aplicación. Se guardan en memoria (o localStorage) mientras Supabase no
// esté configurado. Bórralos cuando conectes tus datos reales: basta con
// vaciar estos dos arreglos.

export const demoPedidos = [
  {
    id: 'p1',
    nombre_detalle: 'Caja de rosas eternas grande',
    cliente: 'María Fernanda Ruiz',
    telefono: '3112345678',
    precio: 350000,
    abono: 200000,
    fecha_pedido: '2026-09-02',
    fecha_entrega: '2026-09-10',
    estado: 'En preparación',
  },
  {
    id: 'p2',
    nombre_detalle: 'Ramo mixto flores preservadas',
    cliente: 'Laura Gómez',
    telefono: '3009876543',
    precio: 180000,
    abono: 180000,
    fecha_pedido: '2026-09-04',
    fecha_entrega: '2026-09-06',
    estado: 'Listo',
  },
  {
    id: 'p3',
    nombre_detalle: 'Detalle personalizado aniversario',
    cliente: 'Camilo Torres',
    telefono: '3201122334',
    precio: 260000,
    abono: 100000,
    fecha_pedido: '2026-08-20',
    fecha_entrega: '2026-08-28',
    estado: 'Entregado',
  },
  {
    id: 'p4',
    nombre_detalle: 'Cúpula de flores eternas mediana',
    cliente: 'Valentina Ospina',
    telefono: '',
    precio: 220000,
    abono: 50000,
    fecha_pedido: '2026-09-05',
    fecha_entrega: '2026-09-15',
    estado: 'Pendiente',
  },
  {
    id: 'p5',
    nombre_detalle: 'Caja pequeña + peluche',
    cliente: 'Santiago Melo',
    telefono: '3157788990',
    precio: 130000,
    abono: 0,
    fecha_pedido: '2026-08-15',
    fecha_entrega: '2026-08-18',
    estado: 'Cancelado',
  },
]

export const demoCostos = [
  {
    id: 'c1',
    producto: 'Rosas preservadas (paquete x50)',
    precio: 20000,
    cantidad: 10,
    fecha: '2026-09-01',
  },
  {
    id: 'c2',
    producto: 'Cajas de madera premium',
    precio: 15000,
    cantidad: 12,
    fecha: '2026-09-03',
  },
  {
    id: 'c3',
    producto: 'Cintas y empaque',
    precio: 8000,
    cantidad: 20,
    fecha: '2026-09-04',
  },
  {
    id: 'c4',
    producto: 'Follaje eterno decorativo',
    precio: 12000,
    cantidad: 15,
    fecha: '2026-08-22',
  },
  {
    id: 'c5',
    producto: 'Transporte y domicilios',
    precio: 25000,
    cantidad: 4,
    fecha: '2026-08-25',
  },
]
