const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getReporteVentas,
  getReporteProductos,
  getReporteInventario,
  getReportePedidos
} = require('../controllers/reporte.controller');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/dashboard', getDashboard);

router.get('/ventas', getReporteVentas);

router.get('/productos', getReporteProductos);

router.get('/inventario', getReporteInventario);

router.get('/pedidos', getReportePedidos);

module.exports = router;