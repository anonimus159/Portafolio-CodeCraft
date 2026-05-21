const db = require('../db/jsonDb');

// Ventas diarias
exports.ventasDiarias = async (req, res) => {
  try {
    const { fecha } = req.query;
    const fechaConsulta = fecha || new Date().toISOString().split('T')[0];

    const ventas = await db.get('ventas');
    const delDia = ventas.filter(v => v.created_at?.startsWith(fechaConsulta));

    const total = delDia.reduce((sum, v) => sum + v.total, 0);
    const porMetodo = {};

    delDia.forEach(v => {
      porMetodo[v.metodo_pago] = (porMetodo[v.metodo_pago] || 0) + v.total;
    });

    res.json({
      success: true,
      data: {
        fecha: fechaConsulta,
        resumen: { num_ventas: delDia.length, total },
        detalle: Object.entries(porMetodo).map(([metodo_pago, total]) => ({ metodo_pago, total }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Productos más vendidos
exports.productosMasVendidos = async (req, res) => {
  try {
    const detalles = await db.get('pedido_detalle');
    const productos = await db.get('productos');

    const ventasPorProducto = {};

    detalles.forEach(d => {
      if (!ventasPorProducto[d.producto_id]) {
        ventasPorProducto[d.producto_id] = { cantidad_vendida: 0, total_ventas: 0 };
      }
      ventasPorProducto[d.producto_id].cantidad_vendida += d.cantidad;
      ventasPorProducto[d.producto_id].total_ventas += d.cantidad * d.precio_unitario;
    });

    const result = Object.entries(ventasPorProducto).map(([producto_id, data]) => {
      const producto = productos.find(p => p.id === parseInt(producto_id));
      return {
        producto_id: parseInt(producto_id),
        nombre: producto?.nombre || 'Unknown',
        ...data
      };
    }).sort((a, b) => b.cantidad_vendida - a.cantidad_vendida);

    res.json({ success: true, data: result.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ventas por usuario
exports.ventasPorUsuario = async (req, res) => {
  try {
    const ventas = await db.get('ventas');
    const usuarios = await db.get('usuarios');

    const ventasPorUsuario = {};

    ventas.forEach(v => {
      if (!ventasPorUsuario[v.usuario_id]) {
        ventasPorUsuario[v.usuario_id] = { num_ventas: 0, total: 0 };
      }
      ventasPorUsuario[v.usuario_id].num_ventas++;
      ventasPorUsuario[v.usuario_id].total += v.total;
    });

    const result = Object.entries(ventasPorUsuario).map(([usuario_id, data]) => {
      const usuario = usuarios.find(u => u.id === parseInt(usuario_id));
      return {
        id: parseInt(usuario_id),
        nombre: usuario?.nombre || 'Unknown',
        ...data
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ventas por método de pago
exports.ventasPorMetodoPago = async (req, res) => {
  try {
    const ventas = await db.get('ventas');

    const porMetodo = {};

    ventas.forEach(v => {
      const metodo = v.metodo_pago || 'sin_especificar';
      if (!porMetodo[metodo]) {
        porMetodo[metodo] = { metodo_pago: metodo, num_ventas: 0, total: 0 };
      }
      porMetodo[metodo].num_ventas++;
      porMetodo[metodo].total += v.total;
    });

    const result = Object.values(porMetodo);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ventas semanales (últimos 7 días)
exports.ventasSemanales = async (req, res) => {
  try {
    const ventas = await db.get('ventas');

    // Obtener últimos 7 días
    const hoy = new Date();
    const dias = [];

    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      dias.push(fecha.toISOString().split('T')[0]);
    }

    // Agrupar ventas por día
    const porDia = {};

    dias.forEach(fecha => {
      porDia[fecha] = { fecha, num_ventas: 0, total: 0 };
    });

    ventas.forEach(v => {
      const fecha = v.created_at?.split('T')[0];
      if (porDia[fecha]) {
        porDia[fecha].num_ventas++;
        porDia[fecha].total += v.total;
      }
    });

    res.json({ success: true, data: Object.values(porDia) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resumen inventario
exports.resumenInventario = async (req, res) => {
  try {
    let inventario = await db.get('inventario');

    // Asegurar que es un array
    if (!Array.isArray(inventario)) {
      inventario = [];
    }

    inventario = inventario.filter(i => i.activo !== false);

    const alertas = inventario.filter(i => i.cantidad <= i.stock_minimo);

    res.json({
      success: true,
      data: {
        total_items: inventario.length,
        alertas: alertas.length,
        ok: inventario.length - alertas.length,
        items: inventario
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ventas por rango de fechas
exports.ventasRango = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const ventas = await db.get('ventas');

    const filtered = ventas.filter(v => {
      const fecha = v.created_at?.split('T')[0];
      return fecha >= desde && fecha <= hasta;
    });

    const porFecha = {};
    filtered.forEach(v => {
      const fecha = v.created_at?.split('T')[0];
      if (fecha) {
        if (!porFecha[fecha]) porFecha[fecha] = { num_ventas: 0, total: 0 };
        porFecha[fecha].num_ventas++;
        porFecha[fecha].total += v.total;
      }
    });

    const ventasArray = Object.entries(porFecha).map(([fecha, data]) => ({ fecha, ...data }));
    const totales = filtered.reduce(
      (acc, v) => ({ num_ventas: acc.num_ventas + 1, total: acc.total + v.total }),
      { num_ventas: 0, total: 0 }
    );

    res.json({ success: true, data: { ventas: ventasArray, totales } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
