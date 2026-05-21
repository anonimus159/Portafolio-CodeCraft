const express = require('express');
const router = express.Router();
const db = require('../db/mysql');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { estado } = req.query;
    const pedidos = await db.delivery.getAll(estado);
    res.json({ success: true, data: pedidos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/zonas', async (req, res) => {
  try {
    const zonas = await db.delivery.getZonas();
    res.json({ success: true, data: zonas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/estadisticas', async (req, res) => {
  try {
    const { inicio, fin } = req.query;
    const stats = await db.delivery.getEstadisticas(inicio, fin);
    res.json({ success: true, data: stats[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pedido = await db.delivery.getById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido delivery no encontrado' });
    }
    res.json({ success: true, data: pedido });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { pedido_id, nombre_cliente, telefono, direccion, referencia, latitud, longitud, costo_envio, distancia_km, observaciones } = req.body;
    const nuevo = await db.delivery.crear({ pedido_id, nombre_cliente, telefono, direccion, referencia, latitud, longitud, costo_envio, distancia_km, observaciones });
    res.status(201).json({ success: true, message: 'Pedido delivery creado', data: { id: nuevo.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/asignar', async (req, res) => {
  try {
    const { repartidor_id } = req.body;
    await db.delivery.asignarRepartidor(req.params.id, repartidor_id);
    res.json({ success: true, message: 'Repartidor asignado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    await db.delivery.actualizarEstado(req.params.id, estado);
    res.json({ success: true, message: `Estado actualizado a ${estado}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/zonas', async (req, res) => {
  try {
    const { nombre, costo, tiempo_estimado } = req.body;
    const nueva = await db.delivery.crearZona({ nombre, costo, tiempo_estimado });
    res.status(201).json({ success: true, message: 'Zona creada', data: { id: nueva.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.delivery.actualizarEstado(req.params.id, 'cancelado');
    res.json({ success: true, message: 'Pedido delivery cancelado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;