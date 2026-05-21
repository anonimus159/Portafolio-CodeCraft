const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authController = {
    async login(req, res) {
        console.log('[Auth] Intento de login recibido');
        console.log('[Auth] Body:', req.body);

        try {
            const { email, password } = req.body;

            // Validar que vengan los campos
            if (!email || !password) {
                console.log('[Auth] Faltan campos requeridos');
                return res.status(400).json({ error: 'Email y contraseña son requeridos' });
            }

            // Consultar usuario
            console.log('[Auth] Consultando usuario:', email);
            const [users] = await pool.query(
                'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ? AND activo = TRUE',
                [email]
            );

            console.log('[Auth] Usuarios encontrados:', users.length);

            if (users.length === 0) {
                console.log('[Auth] Usuario no encontrado');
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const user = users[0];
            console.log('[Auth] Usuario encontrado:', user.email);

            // Verificar contraseña
            console.log('[Auth] Verificando contraseña...');
            const validPassword = await bcrypt.compare(password, user.password);
            console.log('[Auth] Contraseña válida:', validPassword);

            if (!validPassword) {
                console.log('[Auth] Contraseña incorrecta');
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Generar token
            console.log('[Auth] Generando token...');
            const token = jwt.sign(
                { id: user.id, email: user.email, rol: user.rol, nombre: user.nombre },
                config.JWT_SECRET,
                { expiresIn: config.JWT_EXPIRES }
            );

            console.log('[Auth] Login exitoso para:', user.email);

            // Responder con token y user
            return res.json({
                token,
                user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
            });

        } catch (error) {
            console.error('[Auth] Error en login:', error);
            console.error('[Auth] Stack:', error.stack);

            // Error de MySQL específico
            if (error.code === 'ER_ACCESS_DENIED_ERROR') {
                return res.status(500).json({ error: 'Error de conexión a la base de datos. Verifique credenciales.' });
            }
            if (error.code === 'ER_NO_SUCH_TABLE') {
                return res.status(500).json({ error: 'Error interno. Tablas no encontradas.' });
            }
            if (error.code === 'ECONNREFUSED') {
                return res.status(500).json({ error: 'No se pudo conectar a la base de datos.' });
            }

            // Error genérico
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    },

    async register(req, res) {
        try {
            const { nombre, email, password, rol } = req.body;

            if (!nombre || !email || !password) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }

            // Verificar si el email ya existe
            const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
            if (existing.length > 0) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await pool.query(
                'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
                [nombre, email, hashedPassword, rol || 'cajero']
            );

            return res.status(201).json({ message: 'Usuario creado', id: result.insertId });
        } catch (error) {
            console.error('Register error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    },

    async me(req, res) {
        try {
            const [users] = await pool.query(
                'SELECT id, nombre, email, rol, activo, created_at FROM usuarios WHERE id = ?',
                [req.user.id]
            );

            if (users.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            return res.json(users[0]);
        } catch (error) {
            console.error('Me error:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    }
};

module.exports = authController;