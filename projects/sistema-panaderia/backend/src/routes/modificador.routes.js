const express = require('express');
const router = express.Router();
const db = require('../db/mysql');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const modificadores = await db.modificadores.getAll();
    res.json({ success: true, data: modificadores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/producto/:producto_id', async (req, res) => {
  try {
    const modificadores = await db.modificadores.getByProducto(req.params.producto_id);
    res.json({ success: true, data: modificadores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/grupo/:producto_id', async (req, res) => {
  try {
    const grupos = await db.modificadores.getGrupos(req.params.producto_id);
    res.json({ success: true, data: grupos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const modificador = await db.modificadores.getById(req.params.id);
    if (!modificador) {
      return res.status(404).json({ success: false, message: 'Modificador no encontrado' });
    }
    res.json({ success: true, data: modificador });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { producto_id, nombre, tipo, precio_adicional, inventario_id, cantidad_inventario } = req.body;
    const nuevo = await db.modificadores.create({ producto_id, nombre, tipo, precio_adicional, inventario_id, cantidad_inventario });
    res.status(201).json({ success: true, message: 'Modificador creado', data: { id: nuevo.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nombre, precio_adicional, activo } = req.body;
    await db.modificadores.update(req.params.id, { nombre, precio_adicional, activo });
    res.json({ success: true, message: 'Modificador actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.modificadores.delete(req.params.id);
    res.json({ success: true, message: 'Modificador eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;