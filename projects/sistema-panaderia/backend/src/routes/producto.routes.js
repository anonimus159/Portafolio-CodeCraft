const express = require('express');
const router = express.Router();
const {
  getAll, getById, create, update, remove, getByCategoria, getByTipo
} = require('../controllers/producto.controller');
const { upload, handleUploadError } = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth');
const { productoValidation } = require('../middleware/validation');

router.use(authMiddleware);

router.get('/', getAll);
router.get('/categoria/:categoria_id', getByCategoria);
router.get('/tipo/:tipo', getByTipo);
router.get('/:id', getById);

// Crear con imagen
router.post('/', (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    create(req, res);
  });
});

// Actualizar con imagen
router.put('/:id', (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    update(req, res);
  });
});

router.delete('/:id', remove);

module.exports = router;
