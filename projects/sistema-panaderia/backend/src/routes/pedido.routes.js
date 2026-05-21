const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  create, getById, getByEstado, getPedidosCocina,
  agregarProducto, updateDetalle, deleteDetalle,
  cambiarEstado, cambiarEstadoDetalle,
  facturar, dividirCuenta, cerrarPedido
} = require('../controllers/pedido.controller');

router.use(authMiddleware);

router.post('/', create);
router.get('/estado/:estado?', getByEstado);
router.get('/cocina', getPedidosCocina);
router.get('/:id', getById);

router.post('/:id/producto', agregarProducto);
router.put('/:id/detalle/:detalle_id', updateDetalle);
router.delete('/:id/detalle/:detalle_id', deleteDetalle);

router.patch('/:id/estado', cambiarEstado);
router.patch('/detalle/:detalle_id/estado', cambiarEstadoDetalle);

router.post('/:id/facturar', facturar);
router.post('/:id/dividir', dividirCuenta);
router.post('/:id/cerrar', cerrarPedido);

module.exports = router;
