const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');

// Rutas
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const mesaRoutes = require('./routes/mesa.routes');
const productoRoutes = require('./routes/producto.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const recetaRoutes = require('./routes/receta.routes');
const cuadreRoutes = require('./routes/cuadre.routes');
const reportesRoutes = require('./routes/reportes.routes');
const turnoRoutes = require('./routes/turno.routes');
const promocionRoutes = require('./routes/promocion.routes');
const modificadorRoutes = require('./routes/modificador.routes');
const deliveryRoutes = require('./routes/delivery.routes');

const app = express();

// CORS seguro - configurar orígenes permitidos
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Demasiadas solicitudes' }
});
app.use(globalLimiter);

// Servir archivos estáticos (imágenes de productos)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mesas', mesaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/recetas', recetaRoutes);
app.use('/api/cuadre', cuadreRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/turnos', turnoRoutes);
app.use('/api/promociones', promocionRoutes);
app.use('/api/modificadores', modificadorRoutes);
app.use('/api/delivery', deliveryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(config.port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
  console.log(`📸 Imágenes disponibles en http://localhost:${config.port}/uploads/`);
});

module.exports = app;

