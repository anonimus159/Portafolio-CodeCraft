const db = require('../db/jsonDb');

// Listar recetas
exports.getAll = async (req, res) => {
  try {
    const recetas = await db.get('recetas');
    const productos = await db.get('productos');

    const result = recetas.map(r => ({
      ...r,
      producto_nombre: productos.find(p => p.id === r.producto_id)?.nombre || 'Unknown'
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener receta con ingredientes
exports.getById = async (req, res) => {
  try {
    const receta = await db.findById('recetas', req.params.id);
    if (!receta) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' });
    }

    const productos = await db.get('productos');
    const ingredientes = await db.query('receta_detalle', { receta_id: receta.id });
    const inventario = await db.get('inventario');

    const ingredientesConNombre = ingredientes.map(i => ({
      ...i,
      ingrediente_nombre: inventario.find(inv => inv.id === i.ingrediente_id)?.nombre || 'Unknown',
      unidad: inventario.find(inv => inv.id === i.ingrediente_id)?.unidad || '',
      stock_actual: inventario.find(inv => inv.id === i.ingrediente_id)?.cantidad || 0
    }));

    res.json({
      success: true,
      data: {
        ...receta,
        producto_nombre: productos.find(p => p.id === receta.producto_id)?.nombre || 'Unknown',
        ingredientes: ingredientesConNombre
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener receta por producto
exports.getByProducto = async (req, res) => {
  try {
    const recetas = await db.get('recetas');
    const receta = recetas.find(r => r.producto_id === parseInt(req.params.producto_id));

    if (!receta) {
      return res.status(404).json({ success: false, message: 'Producto no tiene receta' });
    }

    const ingredientes = await db.query('receta_detalle', { receta_id: receta.id });
    const inventario = await db.get('inventario');

    const result = ingredientes.map(i => ({
      ...i,
      ingrediente_nombre: inventario.find(inv => inv.id === i.ingrediente_id)?.nombre || 'Unknown',
      unidad: inventario.find(inv => inv.id === i.ingrediente_id)?.unidad || ''
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crear receta
exports.create = async (req, res) => {
  try {
    const { producto_id, descripcion } = req.body;
    const newReceta = await db.create('recetas', { producto_id, descripcion });
    res.status(201).json({ success: true, message: 'Receta creada', data: { id: newReceta.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Agregar ingrediente
exports.agregarIngrediente = async (req, res) => {
  try {
    const { receta_id, ingrediente_id, cantidad } = req.body;

    // Verificar si ya existe
    const existentes = await db.query('receta_detalle', { receta_id, ingrediente_id });
    if (existentes.length > 0) {
      // Actualizar cantidad
      await db.update('receta_detalle', existentes[0].id, { cantidad });
    } else {
      // Crear nuevo
      await db.create('receta_detalle', { receta_id, ingrediente_id, cantidad });
    }

    res.status(201).json({ success: true, message: 'Ingrediente agregado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar ingrediente
exports.updateIngrediente = async (req, res) => {
  try {
    const { cantidad } = req.body;
    await db.update('receta_detalle', req.params.id, { cantidad });
    res.json({ success: true, message: 'Ingrediente actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar ingrediente
exports.eliminarIngrediente = async (req, res) => {
  try {
    await db.delete('receta_detalle', req.params.id);
    res.json({ success: true, message: 'Ingrediente eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar receta
exports.remove = async (req, res) => {
  try {
    // Eliminar detalles primero
    const detalles = await db.query('receta_detalle', { receta_id: parseInt(req.params.id) });
    for (const d of detalles) {
      await db.delete('receta_detalle', d.id);
    }

    await db.delete('recetas', req.params.id);
    res.json({ success: true, message: 'Receta eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};