const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', proveedorController.getAll);
router.get('/:id', proveedorController.getById);
router.post('/', proveedorController.create);
router.put('/:id', proveedorController.update);
router.delete('/:id', proveedorController.delete);

module.exports = router;