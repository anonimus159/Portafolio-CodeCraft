const db = require('../db/mysql');

exports.getAll = async (req, res) => {
  try {
    const productos = await db.productos.getAll();
    res.json({ success: true, data: productos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getByCategoria = async (req, res) => {
  try {
    const productos = await db.productos.getByCategoria(req.params.categoria_id);
    res.json({ success: true, data: productos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getByTipo = async (req, res) => {
  try {
    const productos = await db.query(
      'SELECT * FROM productos WHERE tipo = ? AND activo = true',
      [req.params.tipo]
    );
    res.json({ success: true, data: productos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const producto = await db.productos.getById(req.params.id);
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria_id, tipo, tiempo_preparacion } = req.body;
    let imagen = null;
    if (req.file) {
      imagen = req.file.filename;
    }

    const newProducto = await db.productos.create({
      nombre,
      descripcion,
      precio,
      categoria_id,
      tipo: tipo || 'comida',
      tiempo_preparacion: tiempo_preparacion || 15,
      imagen
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado',
      data: { id: newProducto.id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria_id, tipo, tiempo_preparacion } = req.body;
    let imagen;
    if (req.file) {
      imagen = req.file.filename;
    }

    const updated = await db.productos.update(req.params.id, {
      nombre, descripcion, precio, categoria_id, tipo, tiempo_preparacion, imagen
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, message: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.productos.remove(req.params.id);
    res.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};