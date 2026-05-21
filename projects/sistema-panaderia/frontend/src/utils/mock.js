import api from './api.js';

const mockData = {
  dashboard: {
    ventas_hoy: 4500,
    pedidos_activos: 12,
    alertas_inventario: 3
  },
  mesas: [
    { id: 1, numero: 1, capacidad: 4, posicion_x: 0, posicion_y: 0 },
    { id: 2, numero: 2, capacidad: 2, posicion_x: 100, posicion_y: 0 },
    { id: 3, numero: 3, capacidad: 4, posicion_x: 200, posicion_y: 100 },
  ],
  inventario: [
    { id: 1, nombre: 'Harina de Trigo', cantidad: 10, stock_minimo: 20, unidad: 'kg' },
    { id: 2, nombre: 'Azúcar', cantidad: 50, stock_minimo: 15, unidad: 'kg' },
    { id: 3, nombre: 'Huevos', cantidad: 120, stock_minimo: 100, unidad: 'pz' }
  ],
  inventarioAlertas: [
    { id: 1, nombre: 'Harina de Trigo', cantidad: 10, stock_minimo: 20, unidad: 'kg' }
  ],
  pedidosEstado: [
    { id: 101, mesa_id: 1, estado: 'pendiente', total: 120.00 },
    { id: 102, mesa_id: 2, estado: 'preparando', total: 45.00 }
  ],
  pedidosCocina: [
    { id: 201, detalle_id: 1, pedido_id: 101, producto: 'Concha', cantidad: 2, estado: 'pendiente', notas: 'Sin azúcar glass' },
    { id: 202, detalle_id: 2, pedido_id: 102, producto: 'Café', cantidad: 1, estado: 'preparando' }
  ],
  productos: [
    { id: 1, nombre: 'Concha Chocolate', precio: 15, tipo: 'pan', categoria_id: 1 },
    { id: 2, nombre: 'Café Americano', precio: 35, tipo: 'bebida', categoria_id: 2 },
    { id: 3, nombre: 'Pastel Zanahoria', precio: 300, tipo: 'pan', categoria_id: 1 },
  ],
  categorias: [
    { id: 1, nombre: 'Panadería' },
    { id: 2, nombre: 'Bebidas' }
  ],
  cuadreActivo: {
    id: 1, fecha: new Date().toISOString(), saldo_inicial: 500, ingresos: 1200, gastos: 100, saldo_esperado: 1600
  },
  reportes: {
    ventasDiarias: [{ fecha: '2026-05-20', total: 4500 }],
    productos: [{ nombre: 'Concha', cantidad: 150 }, { nombre: 'Café', cantidad: 90 }],
    usuarios: [{ usuario: 'Admin', total: 4500 }],
    metodoPago: [{ metodo: 'Efectivo', total: 2000 }, { metodo: 'Tarjeta', total: 2500 }],
    inventario: [{ nombre: 'Harina', valor: 500 }],
    semanales: [{ dia: 'Lun', total: 1200 }, { dia: 'Mar', total: 1500 }]
  }
};

const originalAdapter = api.defaults.adapter;

api.defaults.adapter = async (config) => {
  const url = config.url;

  if (!url.startsWith('/')) return originalAdapter(config); // Or generic mock

  const respond = (data, status = 200) => {
    return Promise.resolve({
      data: { data, message: 'Mocked', success: true },
      status,
      statusText: 'OK',
      headers: {},
      config,
      request: {}
    });
  };

  // Auth
  if (url.includes('/auth/me') || url.includes('/auth/verify')) return respond({ id: 1, nombre: 'Admin', rol: 'ADMIN', email: 'admin@demo.com' });
  if (url.includes('/auth/login')) return respond({ token: 'mock-token', usuario: { id: 1, nombre: 'Admin', rol: 'ADMIN' }});

  // Dashboard
  if (url.includes('/reportes/dashboard')) return respond(mockData.dashboard);

  // Mesas & Pedidos
  if (url.includes('/mesas')) return respond(mockData.mesas);
  if (url.includes('/pedidos/estado/por_pagar') || url.includes('/pedidos/estado')) return respond(mockData.pedidosEstado);
  if (url.includes('/pedidos/cocina')) return respond(mockData.pedidosCocina);
  
  // A specific pedido (like /pedidos/101)
  if (url.match(/\/pedidos\/\d+$/)) return respond({ id: 101, mesa_id: 1, estado: 'pendiente', total: 120, detalles: [] });

  // Inventario & Productos
  if (url.includes('/inventario/alertas')) return respond(mockData.inventarioAlertas);
  if (url.includes('/inventario')) return respond(mockData.inventario);
  if (url.includes('/productos')) return respond(mockData.productos);
  if (url.includes('/categorias')) return respond(mockData.categorias);
  if (url.includes('/recetas')) return respond([]);

  // Caja & Cuadre
  if (url.includes('/cuadre/activo')) return respond(mockData.cuadreActivo);

  // Reportes
  if (url.includes('/reportes/ventas/diarias')) return respond(mockData.reportes.ventasDiarias);
  if (url.includes('/reportes/ventas/productos')) return respond(mockData.reportes.productos);
  if (url.includes('/reportes/ventas/usuarios')) return respond(mockData.reportes.usuarios);
  if (url.includes('/reportes/ventas/metodo-pago')) return respond(mockData.reportes.metodoPago);
  if (url.includes('/reportes/inventario')) return respond(mockData.reportes.inventario);
  if (url.includes('/reportes/ventas/semanales')) return respond(mockData.reportes.semanales);

  // Generics para POST/PUT/DELETE
  return respond({});
};
