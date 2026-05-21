const originalFetch = window.fetch;

const mockData = {
  stats: { ingresos: 12500.50, pedidos: 154, activos: 8, entregados: 140, pendientes: 6 },
  salesWeek: [
    { dia: 'Lun', total: 1200 }, { dia: 'Mar', total: 1500 }, { dia: 'Mié', total: 1100 },
    { dia: 'Jue', total: 1800 }, { dia: 'Vie', total: 2400 }, { dia: 'Sáb', total: 3100 }, { dia: 'Dom', total: 2800 }
  ],
  salesHour: [
    { hora: '08:00', ventas: 5 }, { hora: '10:00', ventas: 15 }, { hora: '12:00', ventas: 30 },
    { hora: '14:00', ventas: 25 }, { hora: '16:00', ventas: 20 }, { hora: '18:00', ventas: 40 }
  ],
  topProducts: [
    { nombre: 'Pan de Muerto', cantidad: 150 }, { nombre: 'Concha Vainilla', cantidad: 120 },
    { nombre: 'Café Americano', cantidad: 90 }, { nombre: 'Croissant', cantidad: 85 }
  ],
  lowStock: [
    { nombre: 'Harina de Trigo', stock: 5, minimo: 20 }, { nombre: 'Azúcar Refinada', stock: 2, minimo: 15 }
  ],
  tables: [
    { id: 1, name: 'Mesa 1', status: 'ocupada', total: 250.00 },
    { id: 2, name: 'Mesa 2', status: 'libre', total: 0 },
    { id: 3, name: 'Mesa 3', status: 'libre', total: 0 },
    { id: 4, name: 'Barra 1', status: 'ocupada', total: 85.50 },
    { id: 5, name: 'Terraza 1', status: 'sucia', total: 0 },
  ],
  products: [
    { id: 1, name: 'Concha Chocolate', price: 15.00, category: 'Pan Dulce', stock: 45 },
    { id: 2, name: 'Baguette', price: 35.00, category: 'Pan Salado', stock: 20 },
    { id: 3, name: 'Capuccino', price: 45.00, category: 'Bebidas', stock: 100 },
    { id: 4, name: 'Pastel Tres Leches', price: 350.00, category: 'Pastelería', stock: 3 },
  ],
  orders: [
    { id: 101, tableId: 1, status: 'pending', total: 250.00, items: [] },
    { id: 102, tableId: 4, status: 'ready', total: 85.50, items: [] }
  ],
  inventory: [
    { id: 1, item: 'Harina', quantity: 50, unit: 'kg' },
    { id: 2, item: 'Azúcar', quantity: 30, unit: 'kg' },
    { id: 3, item: 'Huevos', quantity: 200, unit: 'pz' }
  ],
  users: [
    { id: 1, name: 'Admin User', role: 'ADMIN', email: 'admin@demo.com' }
  ]
};

window.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.url;

  // Solo interceptamos si es llamada a /api/
  if (url.includes('/api/')) {
    
    // Auth & Me
    if (url.includes('/api/auth/me')) return jsonResponse(mockData.users[0]);
    if (url.includes('/api/auth/logout')) return jsonResponse({ success: true });

    // Dashboard
    if (url.includes('/api/dashboard/stats')) return jsonResponse(mockData.stats);
    if (url.includes('/api/dashboard/sales-week')) return jsonResponse(mockData.salesWeek);
    if (url.includes('/api/dashboard/sales-by-hour')) return jsonResponse(mockData.salesHour);
    if (url.includes('/api/dashboard/top-products')) return jsonResponse(mockData.topProducts);
    if (url.includes('/api/dashboard/low-stock')) return jsonResponse(mockData.lowStock);

    // Tablas & Pedidos
    if (url.includes('/api/tables')) return jsonResponse(mockData.tables);
    if (url.includes('/api/orders')) return jsonResponse(mockData.orders);
    
    // Productos & Inventario
    if (url.includes('/api/products') || url.includes('/api/inventory/ingredients') || url.includes('/api/ingredients')) {
      return jsonResponse(mockData.products); 
    }
    
    if (url.includes('/api/recipes')) return jsonResponse([]);
    if (url.includes('/api/turnos/activo')) return jsonResponse({ id: 1, status: 'open', startTime: new Date().toISOString() });
    if (url.includes('/api/config') || url.includes('/api/metas')) return jsonResponse({});
    if (url.includes('/api/clientes')) return jsonResponse([]);
    if (url.includes('/api/audit')) return jsonResponse({ data: [], total: 0 });
    if (url.includes('/api/caja/resumen')) return jsonResponse({ ventas: 1500, gastos: 200, total: 1300 });
    if (url.includes('/api/caja')) return jsonResponse([]);
    if (url.includes('/api/descuentos')) return jsonResponse([]);
    if (url.includes('/api/ventas/historial')) return jsonResponse({ data: [], total: 0 });

    // Para endpoints POST/PUT/DELETE genéricos o no manejados, devolvemos success
    return jsonResponse({ success: true, message: 'Mocked request' });
  }

  // Dejar pasar peticiones normales a Vite/assets
  return originalFetch(input, init);
};

function jsonResponse(data) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
