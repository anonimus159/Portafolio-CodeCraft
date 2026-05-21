const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', ventaController.getAll);
router.get('/dia/:fecha', ventaController.getByFecha);
router.get('/:id', ventaController.getById);
router.post('/', ventaController.create);

module.exports = router;