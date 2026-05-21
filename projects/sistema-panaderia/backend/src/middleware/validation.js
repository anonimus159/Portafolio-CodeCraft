const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array()
    });
  }
  next();
};

const authValidation = {
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
    validate
  ],
  register: [
    body('nombre').trim().notEmpty().isLength({ min: 2, max: 50 }).withMessage('Nombre debe tener 2-50 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
    body('rol').optional().isIn(['admin', 'cajero', 'mesero', 'cocina']).withMessage('Rol inválido'),
    validate
  ]
};

const productoValidation = {
  create: [
    body('nombre').trim().notEmpty().isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener 2-100 caracteres'),
    body('precio').isFloat({ min: 0 }).withMessage('Precio debe ser positivo'),
    body('categoria_id').isInt({ min: 1 }).withMessage('Categoría inválida'),
    body('tipo').optional().isIn(['comida', 'bebida']).withMessage('Tipo inválido'),
    validate
  ],
  update: [
    param('id').isInt({ min: 1 }).withMessage('ID inválido'),
    body('nombre').optional().trim().notEmpty().isLength({ min: 2, max: 100 }),
    body('precio').optional().isFloat({ min: 0 }),
    validate
  ]
};

const pedidoValidation = {
  create: [
    body('mesa_id').optional().isInt({ min: 1 }),
    body('tipo').optional().isIn(['local', 'delivery', 'recoger']).withMessage('Tipo inválido'),
    body('nombre_cliente').optional().trim().isLength({ max: 100 }),
    validate
  ],
  agregarProducto: [
    param('id').isInt({ min: 1 }),
    body('producto_id').isInt({ min: 1 }).withMessage('Producto requerido'),
    body('cantidad').isInt({ min: 1 }).withMessage('Cantidad mínima es 1'),
    body('nota').optional().trim().isLength({ max: 200 }),
    validate
  ]
};

const inventarioValidation = {
  create: [
    body('nombre').trim().notEmpty().isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener 2-100 caracteres'),
    body('unidad').trim().notEmpty().isLength({ max: 20 }).withMessage('Unidad requerida'),
    body('cantidad').isFloat({ min: 0 }).withMessage('Cantidad debe ser positiva'),
    body('stock_minimo').isFloat({ min: 0 }).withMessage('Stock mínimo debe ser positivo'),
    body('precio_unitario').isFloat({ min: 0 }).withMessage('Precio unitario debe ser positivo'),
    validate
  ],
  ajustarCantidad: [
    param('id').isInt({ min: 1 }),
    body('cantidad').isFloat().withMessage('Cantidad requerida'),
    body('tipo').isIn(['entrada', 'salida', 'ajuste']).withMessage('Tipo inválido'),
    body('motivo').optional().trim().isLength({ max: 200 }),
    validate
  ]
};

const mesaValidation = {
  create: [
    body('numero').isInt({ min: 1 }).withMessage('Número de mesa requerido'),
    body('capacidad').isInt({ min: 1 }).withMessage('Capacidad mínima es 1'),
    body('posicion_x').optional().isInt({ min: 0 }),
    body('posicion_y').optional().isInt({ min: 0 }),
    validate
  ]
};

const categoriaValidation = {
  create: [
    body('nombre').trim().notEmpty().isLength({ min: 2, max: 50 }).withMessage('Nombre debe tener 2-50 caracteres'),
    body('tipo').isIn(['comida', 'bebida']).withMessage('Tipo inválido'),
    validate
  ]
};

const cuadreValidation = {
  crear: [
    body('usuario_id').isInt({ min: 1 }).withMessage('Usuario requerido'),
    body('efectivo_inicial').isFloat({ min: 0 }).withMessage('Efectivo inicial requerido'),
    validate
  ],
  agregarMovimiento: [
    param('cuadre_id').isInt({ min: 1 }),
    body('monto').isFloat({ min: 0.01 }).withMessage('Monto requerido'),
    body('descripcion').trim().notEmpty().isLength({ max: 200 }).withMessage('Descripción requerida'),
    body('tipo').isIn(['ingreso', 'gasto']).withMessage('Tipo inválido'),
    validate
  ]
};

module.exports = {
  validate,
  authValidation,
  productoValidation,
  pedidoValidation,
  inventarioValidation,
  mesaValidation,
  categoriaValidation,
  cuadreValidation
};