const db = require('../db/mysql');

exports.getAll = async (req, res) => {
  try {
    const inventario = await db.inventario.getAll();
    res.json({ success: true, data: inventario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await db.inventario.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item no encontrado' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, unidad, cantidad, stock_minimo, precio_unitario } = req.body;
    const newItem = await db.inventario.create({
      nombre,
      unidad,
      cantidad: cantidad || 0,
      stock_minimo: stock_minimo || 0,
      precio_unitario: precio_unitario || 0
    });
    res.status(201).json({
      success: true,
      message: 'Item creado',
      data: { id: newItem.id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, unidad, cantidad, stock_minimo, precio_unitario, activo } = req.body;
    const updated = await db.inventario.update(req.params.id, {
      nombre, unidad, cantidad, stock_minimo, precio_unitario, activo
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Item no encontrado' });
    }

    res.json({ success: true, message: 'Item actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.inventario.remove(req.params.id);
    res.json({ success: true, message: 'Item eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.ajustarCantidad = async (req, res) => {
  try {
    const { cantidad, tipo, motivo } = req.body;
    await db.inventario.ajustarCantidad(req.params.id, cantidad, tipo, motivo);
    res.json({ success: true, message: 'Cantidad ajustada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.alertasStock = async (req, res) => {
  try {
    const alertas = await db.inventario.getAlertas();
    res.json({ success: true, data: alertas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMovimientos = async (req, res) => {
  try {
    const movimientos = await db.inventario.getMovimientos();
    res.json({ success: true, data: movimientos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};