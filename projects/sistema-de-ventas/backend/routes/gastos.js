const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', gastoController.getAll);
router.post('/', gastoController.create);
router.delete('/:id', gastoController.delete);

module.exports = router;