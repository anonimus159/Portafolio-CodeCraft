const express = require('express');
const router = express.Router();
const {
  getCuadreActivo, getAll, getById,
  agregarIngreso, agregarGasto, eliminarMovimiento, cerrarCuadre
} = require('../controllers/cuadre.controller');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/activo/:usuario_id', getCuadreActivo);
router.get('/', getAll);
router.get('/:id', getById);

router.post('/:cuadre_id/ingreso', agregarIngreso);
router.post('/:cuadre_id/gasto', agregarGasto);
router.delete('/movimiento/:id', eliminarMovimiento);
router.post('/:id/cerrar', cerrarCuadre);

module.exports = router;