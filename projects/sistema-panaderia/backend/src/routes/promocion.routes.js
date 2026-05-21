const express = require('express');
const router = express.Router();
const db = require('../db/mysql');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const promociones = await db.promociones.getAll();
    res.json({ success: true, data: promociones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/activas', async (req, res) => {
  try {
    const promociones = await db.promociones.getActivas();
    res.json({ success: true, data: promociones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const promo = await db.promociones.getById(req.params.id);
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promoción no encontrada' });
    }
    const productos = await db.promociones.getProductos(req.params.id);
    res.json({ success: true, data: { ...promo, productos } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, tipo, valor, producto_id, categoria_id, aplica_todos, fecha_inicio, fecha_fin, hora_inicio, hora_fin, dias_aplicar, cantidad_minima, maximo_usos, productos } = req.body;
    const nueva = await db.promociones.create({ nombre, descripcion, tipo, valor, producto_id, categoria_id, aplica_todos, fecha_inicio, fecha_fin, hora_inicio, hora_fin, dias_aplicar, cantidad_minima, maximo_usos, productos });
    res.status(201).json({ success: true, message: 'Promoción creada', data: { id: nueva.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, tipo, valor, fecha_inicio, fecha_fin, activo } = req.body;
    await db.promociones.update(req.params.id, { nombre, descripcion, tipo, valor, fecha_inicio, fecha_fin, activo });
    res.json({ success: true, message: 'Promoción actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.promociones.delete(req.params.id);
    res.json({ success: true, message: 'Promoción eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/aplicar', async (req, res) => {
  try {
    const { pedido_id, productos, subtotal } = req.body;
    const descuento = await db.promociones.aplicar(pedido_id, productos, subtotal);
    res.json({ success: true, data: { descuento } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;