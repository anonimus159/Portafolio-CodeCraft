const express = require('express');
const router = express.Router();
const {
  getAll, getById, create, update, remove, cambiarEstado, unirMesas
} = require('../controllers/mesa.controller');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.patch('/:id/estado', cambiarEstado);
router.post('/unir', unirMesas);
router.delete('/:id', remove);

module.exports = router;