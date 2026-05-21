const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', compraController.getAll);
router.get('/:id', compraController.getById);
router.post('/', compraController.create);

module.exports = router;