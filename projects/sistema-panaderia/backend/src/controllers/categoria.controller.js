const db = require('../db/mysql');

exports.getAll = async (req, res) => {
  try {
    const categorias = await db.categorias.getAll();
    res.json({ success: true, data: categorias });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const categoria = await db.categorias.getById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }
    res.json({ success: true, data: categoria });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, tipo } = req.body;
    const newCategoria = await db.categorias.create({ nombre, tipo: tipo || 'comida' });
    res.status(201).json({ success: true, message: 'Categoría creada', data: { id: newCategoria.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, tipo, activo } = req.body;
    const updated = await db.categorias.update(req.params.id, { nombre, tipo, activo });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    res.json({ success: true, message: 'Categoría actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.categorias.remove(req.params.id);
    res.json({ success: true, message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};