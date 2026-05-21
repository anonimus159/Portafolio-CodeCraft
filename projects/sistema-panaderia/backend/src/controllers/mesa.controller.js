const db = require('../db/mysql');

exports.getAll = async (req, res) => {
  try {
    const mesas = await db.mesas.getAll();
    res.json({ success: true, data: mesas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const mesa = await db.mesas.getById(req.params.id);
    if (!mesa) {
      return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
    }

    const pedidos = await db.pedidos.getAll().then(p => p.filter(p => p.mesa_id === parseInt(req.params.id) && !['entregado', 'cancelado'].includes(p.estado)));
    const pedidoActivo = pedidos[0] || null;

    res.json({
      success: true,
      data: { mesa, pedido_activo: pedidoActivo || null }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { numero, capacidad, posicion_x, posicion_y } = req.body;

    const existing = await db.mesas.getByNumber(numero);
    if (existing) {
      return res.status(400).json({ success: false, message: 'El número de mesa ya existe' });
    }

    const newMesa = await db.mesas.create({
      numero,
      capacidad: capacidad || 4,
      posicion_x: posicion_x || 0,
      posicion_y: posicion_y || 0
    });

    res.status(201).json({
      success: true,
      message: 'Mesa creada',
      data: { id: newMesa.id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { numero, capacidad, estado, posicion_x, posicion_y } = req.body;
    const updated = await db.mesas.update(req.params.id, {
      numero, capacidad, estado, posicion_x, posicion_y
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
    }

    res.json({ success: true, message: 'Mesa actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['libre', 'ocupada', 'por_pagar'].includes(estado)) {
      return res.status(400).json({ success: false, message: 'Estado inválido' });
    }

    await db.mesas.update(req.params.id, { estado });
    res.json({ success: true, message: `Mesa ahora está ${estado}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const pedidos = await db.pedidos.getAll().then(p => p.filter(p => p.mesa_id === parseInt(req.params.id) && !['entregado', 'cancelado'].includes(p.estado)));
    
    if (pedidos.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La mesa tiene pedidos activos'
      });
    }

    await db.mesas.remove(req.params.id);
    res.json({ success: true, message: 'Mesa eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unirMesas = async (req, res) => {
  try {
    const { mesa1_id, mesa2_id } = req.body;

    if (!mesa1_id || !mesa2_id) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar dos mesas para unir'
      });
    }

    await db.transaction(async (conn) => {
      const pedidos = await conn.execute('SELECT id FROM pedidos WHERE mesa_id = ? AND estado NOT IN (?, ?)', [mesa2_id, 'entregado', 'cancelado']);
      
      for (const pedido of pedidos[0]) {
        await conn.execute('UPDATE pedidos SET mesa_id = ? WHERE id = ?', [mesa1_id, pedido.id]);
      }

      await conn.execute('UPDATE mesas SET estado = ? WHERE id = ?', ['libre', mesa2_id]);
    });

    res.json({
      success: true,
      message: 'Mesas unidas correctamente'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};