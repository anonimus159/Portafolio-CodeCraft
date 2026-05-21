import api from './api.js';

const mockData = {
    productos: [
        { id: 1, codigo_barras: '7501001', nombre: 'Coca Cola 600ml', precio_compra: 10, precio_venta: 18, stock: 50, stock_minimo: 15, categoria_id: 1 },
        { id: 2, codigo_barras: '7501002', nombre: 'Papas Sabritas', precio_compra: 12, precio_venta: 20, stock: 30, stock_minimo: 10, categoria_id: 2 },
        { id: 3, codigo_barras: '7501003', nombre: 'Galletas Emperador', precio_compra: 15, precio_venta: 25, stock: 25, stock_minimo: 10, categoria_id: 2 },
        { id: 4, codigo_barras: '7501004', nombre: 'Leche Alpura 1L', precio_compra: 20, precio_venta: 30, stock: 5, stock_minimo: 10, categoria_id: 3 }
    ],
    categorias: [
        { id: 1, nombre: 'Bebidas' },
        { id: 2, nombre: 'Botanas' },
        { id: 3, nombre: 'Lácteos' }
    ],
    reportes: {
        resumen: { ventasHoy: 1250.50, productosBajos: 1, gananciasMes: 8400.00, clientesAtendidos: 45 },
        productosMasVendidos: [
            { nombre: 'Coca Cola 600ml', cantidad: 120 },
            { nombre: 'Papas Sabritas', cantidad: 85 },
            { nombre: 'Galletas Emperador', cantidad: 60 }
        ],
        ventas: [
            { fecha: '2026-05-18', total: 1100 },
            { fecha: '2026-05-19', total: 1400 },
            { fecha: '2026-05-20', total: 1250 }
        ]
    },
    caja: { id: 1, fecha_apertura: new Date().toISOString(), saldo_inicial: 500, estado: 'abierta' },
    ventas: [
        { id: 101, total: 38, fecha: new Date().toISOString(), metodo_pago: 'efectivo' }
    ]
};

const originalRequest = api.request;

api.request = async (endpoint, options = {}) => {
    // Auth
    if (endpoint === '/auth/me') return { id: 1, nombre: 'Admin POS', rol: 'admin', email: 'admin@pos.com' };
    if (endpoint === '/auth/login') return { token: 'mock-token', user: { id: 1, nombre: 'Admin', rol: 'admin' } };

    // Dashboard & Reportes
    if (endpoint === '/reportes/resumen') return mockData.reportes.resumen;
    if (endpoint === '/reportes/productos-mas-vendidos') return mockData.reportes.productosMasVendidos;
    if (endpoint.startsWith('/reportes/ventas')) return mockData.reportes.ventas;
    
    // Productos
    if (endpoint.startsWith('/productos/alertas')) return mockData.productos.filter(p => p.stock <= p.stock_minimo);
    if (endpoint.startsWith('/productos/barras/')) {
        const cod = endpoint.split('/').pop();
        const p = mockData.productos.find(x => x.codigo_barras === cod);
        if(p) return p; else throw new Error("No encontrado");
    }
    if (endpoint.startsWith('/productos')) return mockData.productos;

    // Categorias
    if (endpoint.startsWith('/categorias')) return mockData.categorias;

    // Caja
    if (endpoint === '/caja/abierta') return mockData.caja;

    // Ventas
    if (endpoint.startsWith('/ventas')) return mockData.ventas;

    // Generic fallback for others
    return [];
};
