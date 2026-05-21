const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/ventas', reporteController.ventas);
router.get('/productos-mas-vendidos', reporteController.productosMasVendidos);
router.get('/resumen', reporteController.resumen);
router.get('/utilidad', reporteController.utilidad);

module.exports = router;