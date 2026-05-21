const express = require('express');
const router = express.Router();
const {
  getAll, getById, create, update, remove,
  ajustarCantidad, alertasStock, getMovimientos
} = require('../controllers/inventario.controller');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getAll);
router.get('/alertas', alertasStock);
router.get('/movimientos', getMovimientos);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.patch('/:id/cantidad', ajustarCantidad);
router.delete('/:id', remove);

module.exports = router;
