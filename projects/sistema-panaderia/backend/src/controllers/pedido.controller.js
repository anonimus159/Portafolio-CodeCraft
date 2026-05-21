const db = require('../db/mysql');

exports.create = async (req, res) => {
  try {
    const { mesa_id, tipo, nombre_cliente, observaciones } = req.body;
    const usuario_id = req.usuario.id;

    let pedidoId;
    await db.transaction(async (conn) => {
      if (mesa_id) {
        await conn.execute('UPDATE mesas SET estado = ? WHERE id = ?', ['ocupada', mesa_id]);
      }

      const [result] = await conn.execute(
        `INSERT INTO pedidos (mesa_id, usuario_id, estado, tipo, nombre_cliente, observaciones, subtotal, iva, total) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [mesa_id || null, usuario_id, 'pendiente', tipo || 'local', nombre_cliente || null, observaciones || null, 0, 0, 0]
      );
      pedidoId = result.insertId;
    });

    res.status(201).json({
      success: true,
      message: 'Pedido creado',
      data: { id: pedidoId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const pedido = await db.pedidos.getById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }

    const detalles = await db.pedidos.getDetalles(req.params.id);

    res.json({
      success: true,
      data: { ...pedido, detalles }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getByEstado = async (req, res) => {
  try {
    const estado = req.params.estado;
    const pedidos = await db.pedidos.getAll(estado);
    res.json({ success: true, data: pedidos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPedidosCocina = async (req, res) => {
  try {
    const detalles = await db.query(
      `SELECT d.*, p.nombre as producto_nombre, p.tipo as producto_tipo, p.imagen as producto_imagen,
              pe.observaciones, m.numero as mesa_numero
       FROM pedido_detalle d
       LEFT JOIN productos p ON d.producto_id = p.id
       LEFT JOIN pedidos pe ON d.pedido_id = pe.id
       LEFT JOIN mesas m ON pe.mesa_id = m.id
       WHERE d.estado IN ('pendiente', 'en_preparacion')
       ORDER BY d.created_at ASC`
    );
    res.json({ success: true, data: detalles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.agregarProducto = async (req, res) => {
  try {
    const pedido_id = req.params.id;
    const { producto_id, cantidad, notas, lugar_preparacion } = req.body;

    const pedido = await db.pedidos.getById(pedido_id);
    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }

    if (pedido.estado === 'entregado' || pedido.estado === 'cancelado') {
      return res.status(400).json({ success: false, message: 'No se puede modificar un pedido cerrado' });
    }

    await db.transaction(async (conn) => {
      const [producto] = await conn.execute('SELECT precio FROM productos WHERE id = ?', [producto_id]);
      if (!producto[0]) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      await conn.execute(
        `INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario, notas, estado, lugar_preparacion) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [pedido_id, producto_id, cantidad || 1, producto[0].precio, notas || null, 'pendiente', lugar_preparacion || 'cocina']
      );

      await recalcularTotal(conn, pedido_id);
    });

    res.status(201).json({ success: true, message: 'Producto agregado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function recalcularTotal(conn, pedido_id) {
  const [detalles] = await conn.execute(
    'SELECT SUM(cantidad * precio_unitario) as subtotal FROM pedido_detalle WHERE pedido_id = ?',
    [pedido_id]
  );

  const subtotal = parseFloat(detalles[0].subtotal) || 0;
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  await conn.execute(
    'UPDATE pedidos SET subtotal = ?, iva = ?, total = ? WHERE id = ?',
    [subtotal, iva, total, pedido_id]
  );
}

exports.updateDetalle = async (req, res) => {
  try {
    const { cantidad, notas } = req.body;
    const { id, detalle_id } = req.params;

    const pedido = await db.pedidos.getById(id);
    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }

    await db.transaction(async (conn) => {
      if (cantidad !== undefined) {
        await conn.execute('UPDATE pedido_detalle SET cantidad = ? WHERE id = ?', [cantidad, detalle_id]);
      }
      if (notas !== undefined) {
        await conn.execute('UPDATE pedido_detalle SET notas = ? WHERE id = ?', [notas, detalle_id]);
      }

      await recalcularTotal(conn, id);
    });

    res.json({ success: true, message: 'Detalle actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDetalle = async (req, res) => {
  try {
    const { id, detalle_id } = req.params;

    await db.transaction(async (conn) => {
      await conn.execute('DELETE FROM pedido_detalle WHERE id = ?', [detalle_id]);
      await recalcularTotal(conn, id);
    });

    res.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const pedido = await db.pedidos.getById(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }

    await db.pedidos.updateEstado(req.params.id, estado);
    res.json({ success: true, message: `Estado actualizado a ${estado}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cambiarEstadoDetalle = async (req, res) => {
  try {
    const { estado } = req.body;
    await db.pedido_detalle.cambiarEstado(req.params.detalle_id, estado);
    res.json({ success: true, message: `Estado actualizado a ${estado}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.facturar = async (req, res) => {
  try {
    const { metodo_pago } = req.body;
    const pedido = await db.pedidos.getById(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }

    await db.pedidos.facturar(req.params.id, metodo_pago);
    res.json({ success: true, message: 'Pedido facturado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.dividirCuenta = async (req, res) => {
  try {
    const { division } = req.body;
    const detalles = await db.pedidos.getDetalles(req.params.id);

    const partes = {};
    division.forEach((d, idx) => {
      partes[idx + 1] = detalles.filter(p => d.productos.includes(p.producto_id));
    });

    res.json({ success: true, data: partes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cerrarPedido = async (req, res) => {
  try {
    const { metodo_pago } = req.body;
    
    await db.pedidos.facturar(req.params.id, metodo_pago);
    res.json({ success: true, message: 'Pedido cerrado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};