const express = require('express');
const router = express.Router();
const cajaController = require('../controllers/cajaController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/abierta', cajaController.getAbierta);
router.post('/apertura', cajaController.apertura);
router.post('/cierre/:id', cajaController.cierre);
router.get('/historial', cajaController.historial);

module.exports = router;