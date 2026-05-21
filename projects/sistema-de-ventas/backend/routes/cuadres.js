const express = require('express');
const router = express.Router();
const cuadreController = require('../controllers/cuadreController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', cuadreController.getAll);
router.get('/resumen', cuadreController.resumen);
router.get('/fecha/:fecha', cuadreController.getByFecha);
router.get('/:id', cuadreController.getById);
router.post('/', cuadreController.create);

module.exports = router;