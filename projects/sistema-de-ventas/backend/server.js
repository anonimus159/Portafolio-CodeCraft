const express = require('express');
const cors = require('cors');
const config = require('./config/config');

const authRoutes = require('./routes/auth');
const productoRoutes = require('./routes/productos');
const categoriaRoutes = require('./routes/categorias');
const ventaRoutes = require('./routes/ventas');
const proveedorRoutes = require('./routes/proveedores');
const compraRoutes = require('./routes/compras');
const gastoRoutes = require('./routes/gastos');
const cajaRoutes = require('./routes/cajas');
const reporteRoutes = require('./routes/reportes');
const cuadreRoutes = require('./routes/cuadres');

const app = express();

// CORS - permitir cualquier origen para desarrollo
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON con límite de tamaño
app.use(express.json({ limit: '10mb' }));

// Log de todas las peticiones
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('[Server] Body:', req.body);
    }
    next();
});

// Endpoint de prueba
app.get('/api', (req, res) => {
    console.log('[Server] GET /api - Health check');
    res.json({ message: 'API del Sistema POS funcionando', version: '1.0', timestamp: new Date().toISOString() });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/gastos', gastoRoutes);
app.use('/api/caja', cajaRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/cuadres', cuadreRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('[Server] Error no manejado:', err);
    console.error('[Server] Stack:', err.stack);

    // Si ya se envió una respuesta, no intentar enviar otra
    if (res.headersSent) {
        return next(err);
    }

    // Error de parseo JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'JSON inválido en la petición' });
    }

    // Error genérico
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Ruta 404
app.use((req, res) => {
    console.log('[Server] Ruta no encontrada:', req.method, req.url);
    res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = config.PORT;

app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/api`);
    console.log('========================================');
});