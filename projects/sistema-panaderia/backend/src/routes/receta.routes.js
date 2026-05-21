const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getAll, getById, getByProducto, create,
  agregarIngrediente, updateIngrediente, eliminarIngrediente, remove
} = require('../controllers/receta.controller');

router.use(authMiddleware);

router.get('/', getAll);
router.get('/producto/:producto_id', getByProducto);
router.get('/:id', getById);
router.post('/', create);
router.post('/ingrediente', agregarIngrediente);
router.put('/ingrediente/:id', updateIngrediente);
router.delete('/ingrediente/:id', eliminarIngrediente);
router.delete('/:id', remove);

module.exports = router;