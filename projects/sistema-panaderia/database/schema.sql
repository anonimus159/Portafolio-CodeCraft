-- ============================================
-- SISTEMA POS RESTAURANTE - ESQUEMA MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS pos_restaurante;
USE pos_restaurante;

-- ----------------------------
-- TABLA: usuarios
-- ----------------------------
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'cajero', 'mesero', 'cocina') NOT NULL DEFAULT 'mesero',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- TABLA: categorias
-- ----------------------------
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('comida', 'bebida') NOT NULL DEFAULT 'comida',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- TABLA: mesas
-- ----------------------------
CREATE TABLE mesas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero INT NOT NULL UNIQUE,
    capacidad INT DEFAULT 4,
    estado ENUM('libre', 'ocupada', 'por_pagar') DEFAULT 'libre',
    posicion_x INT DEFAULT 0,
    posicion_y INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- TABLA: productos
-- ----------------------------
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria_id INT NOT NULL,
    tipo ENUM('comida', 'bebida') NOT NULL DEFAULT 'comida',
    tiempo_preparacion INT DEFAULT 15,
    imagen VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- TABLA: inventario
-- ----------------------------
CREATE TABLE inventario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    unidad VARCHAR(20) NOT NULL,
    cantidad DECIMAL(10, 2) DEFAULT 0,
    stock_minimo DECIMAL(10, 2) DEFAULT 0,
    precio_unitario DECIMAL(10, 2) DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: turnos (Gestión de horarios de trabajo)
-- ============================================
CREATE TABLE turnos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dia (dia_semana),
    INDEX idx_activo (activo)
);

-- ----------------------------
-- TABLA: turno_usuario (Asignación de empleados a turnos)
-- ----------------------------
CREATE TABLE turno_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    turno_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada TIME,
    hora_salida TIME,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_fecha (usuario_id, fecha),
    INDEX idx_fecha (fecha)
);

-- ============================================
-- TABLA: promociones
-- ============================================
CREATE TABLE promociones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('porcentaje', 'fijo', 'buyget', 'combo') NOT NULL DEFAULT 'porcentaje',
    valor DECIMAL(10, 2) NOT NULL,
    producto_id INT,
    categoria_id INT,
    aplica_todos BOOLEAN DEFAULT FALSE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME DEFAULT '00:00:00',
    hora_fin TIME DEFAULT '23:59:59',
    dias_aplicar SET('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    cantidad_minima INT DEFAULT 1,
    maximo_usos INT,
    usos_actuales INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_activo (activo)
);

-- ----------------------------
-- TABLA: promocion_productos (Productos aplica promoción)
-- ----------------------------
CREATE TABLE promocion_productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promocion_id INT NOT NULL,
    producto_id INT NOT NULL,
    FOREIGN KEY (promocion_id) REFERENCES promociones(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_promocion_producto (promocion_id, producto_id)
);

-- ============================================
-- TABLA: modificadores (Opciones de productos: tamaños, ingredientes extra)
-- ============================================
CREATE TABLE modificadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    producto_id INT NOT NULL,
    tipo ENUM('ingrediente', 'tamanio', 'presentacion') NOT NULL DEFAULT 'ingrediente',
    precio_adicional DECIMAL(10, 2) DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id),
    INDEX idx_activo (activo)
);

-- ----------------------------
-- TABLA: modificador_inventario (Qué inventario usa cada modificador)
-- ----------------------------
CREATE TABLE modificador_inventario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    modificador_id INT NOT NULL,
    inventario_id INT NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (modificador_id) REFERENCES modificadores(id) ON DELETE CASCADE,
    FOREIGN KEY (inventario_id) REFERENCES inventario(id) ON DELETE CASCADE,
    UNIQUE KEY unique_modificador_inventario (modificador_id, inventario_id)
);

-- ============================================
-- TABLA: delivery (Pedidos a domicilio)
-- ============================================
CREATE TABLE delivery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    repartidor_id INT,
    nombre_cliente VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    referencia TEXT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    estado ENUM('pendiente', 'asignado', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
    hora_asignacion TIME,
    hora_entrega TIME,
    costo_envio DECIMAL(10, 2) DEFAULT 0,
    distancia_km DECIMAL(6, 2),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (repartidor_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_estado (estado),
    INDEX idx_repartidor (repartidor_id),
    INDEX idx_fecha (created_at)
);

-- ----------------------------
-- TABLA: zonas_entrega
-- ----------------------------
CREATE TABLE zonas_entrega (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    zona GEOMETRY NOT NULL,
    costo DECIMAL(10, 2) DEFAULT 0,
    tiempo_estimado INT DEFAULT 30,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activo (activo)
);

-- ----------------------------
-- TABLA: receta_detalle (ingredientes)
-- ----------------------------
CREATE TABLE receta_detalle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    receta_id INT NOT NULL,
    ingrediente_id INT NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (receta_id) REFERENCES recetas(id) ON DELETE CASCADE,
    FOREIGN KEY (ingrediente_id) REFERENCES inventario(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_receta_ingrediente (receta_id, ingrediente_id)
);

-- ----------------------------
-- TABLA: pedidos
-- ----------------------------
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mesa_id INT,
    usuario_id INT NOT NULL,
    estado ENUM('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado') DEFAULT 'pendiente',
    tipo ENUM('local', 'para_llavar') DEFAULT 'local',
    nombre_cliente VARCHAR(100),
    subtotal DECIMAL(10, 2) DEFAULT 0,
    iva DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'mixto') DEFAULT 'efectivo',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- ----------------------------
-- TABLA: pedido_detalle
-- ----------------------------
CREATE TABLE pedido_detalle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    notas TEXT,
    estado ENUM('pendiente', 'en_preparacion', 'listo') DEFAULT 'pendiente',
    lugar_preparacion ENUM('cocina', 'barra') DEFAULT 'cocina',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

-- ----------------------------
-- TABLA: cuadre (encabezado)
-- ----------------------------
CREATE TABLE cuadre (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_cierre TIME,
    total_ingresos DECIMAL(12, 2) DEFAULT 0,
    total_gastos DECIMAL(12, 2) DEFAULT 0,
    resultado DECIMAL(12, 2) DEFAULT 0,
    dinero_sistema DECIMAL(12, 2) DEFAULT 0,
    diferencia DECIMAL(12, 2) DEFAULT 0,
    observaciones TEXT,
    status ENUM('abierto', 'cerrado') DEFAULT 'abierto',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_fecha_usuario (fecha, usuario_id)
);

-- ----------------------------
-- TABLA: cuadre_detalle (movimientos)
-- ----------------------------
CREATE TABLE cuadre_detalle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cuadre_id INT NOT NULL,
    tipo ENUM('ingreso', 'gasto') NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    referencia VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuadre_id) REFERENCES cuadre(id) ON DELETE CASCADE
);

-- ----------------------------
-- TABLA: ventas (histórico para reportes)
-- ----------------------------
CREATE TABLE ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    usuario_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- ----------------------------
-- DATOS DE EJEMPLO
-- ----------------------------

-- Usuarios
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@restaurante.com', '$2a$10$wJrFmVtsXO0BoMqrsHaheee3smLDvpaBNTbTUH5ERRLFp3H2ePcZa', 'admin'),
('Carlos Cajero', 'carlos@restaurante.com', '$2a$10$wJrFmVtsXO0BoMqrsHaheee3smLDvpaBNTbTUH5ERRLFp3H2ePcZa', 'cajero'),
('María Mesero', 'maria@restaurante.com', '$2a$10$wJrFmVtsXO0BoMqrsHaheee3smLDvpaBNTbTUH5ERRLFp3H2ePcZa', 'mesero'),
('Chef Juan', 'juan@restaurante.com', '$2a$10$wJrFmVtsXO0BoMqrsHaheee3smLDvpaBNTbTUH5ERRLFp3H2ePcZa', 'cocina');

-- Categorías
INSERT INTO categorias (nombre, tipo) VALUES
('Entradas', 'comida'),
('Principales', 'comida'),
('Bebidas', 'bebida'),
('Postres', 'comida'),
('Cervezas', 'bebida'),
('Vinos', 'bebida');

-- Mesas
INSERT INTO mesas (numero, capacidad, posicion_x, posicion_y) VALUES
(1, 4, 0, 0),
(2, 4, 1, 0),
(3, 6, 2, 0),
(4, 2, 0, 1),
(5, 2, 1, 1),
(6, 8, 2, 1);

-- Productos
INSERT INTO productos (nombre, descripcion, precio, categoria_id, tipo, tiempo_preparacion) VALUES
('Hamburguesa Clásica', 'Hamburguesa con carne, queso, lechuga y tomate', 12.00, 2, 'comida', 15),
('Pizza Margarita', 'Pizza con salsa de tomate, mozzarella y albahaca', 15.00, 2, 'comida', 20),
('Pasta Carbonara', 'Pasta con bacon, huevo, queso parmesano', 13.00, 2, 'comida', 18),
('Ensalada César', 'Ensalada con lechuga, crutones y aderezo césar', 8.00, 1, 'comida', 5),
('Pollo Frito', 'Pollo frito crujiente con salsa BBQ', 11.00, 2, 'comida', 15),
('Gaseosa', 'Gaseosa 500ml', 2.00, 3, 'bebida', 1),
('Cerveza Nacional', 'Cerveza 330ml', 3.00, 4, 'bebida', 1),
('Cerveza Importada', 'Cerveza 330ml', 5.00, 4, 'bebida', 1),
('Vino Tinto', 'Copa de vino tinto 250ml', 6.00, 5, 'bebida', 1),
('Postre del Día', 'Consultar con el mesero', 5.00, 4, 'comida', 10);

-- Inventario
INSERT INTO inventario (nombre, unidad, cantidad, stock_minimo, precio_unitario) VALUES
('Pan de hamburguesa', 'unidad', 100, 20, 0.50),
('Carne de res', 'kg', 20, 5, 8.00),
('Queso cheddar', 'kg', 10, 3, 6.00),
('Lechuga', 'kg', 15, 5, 2.00),
('Tomate', 'kg', 20, 5, 2.50),
('Harina de trigo', 'kg', 50, 10, 1.50),
('Salsa de tomate', 'lt', 20, 5, 2.00),
('Mozzarella', 'kg', 15, 5, 7.00),
('Albácaca', 'kg', 5, 2, 4.00),
('Pasta italiana', 'kg', 25, 8, 3.00),
('Bacon', 'kg', 10, 3, 9.00),
('Huevos', 'docena', 15, 5, 3.50),
('Pollo', 'kg', 30, 10, 5.00),
('Gaseosa concentrada', 'lt', 30, 10, 1.00),
('Cerveza nacional', 'unidad', 100, 30, 1.50),
('Cerveza importada', 'unidad', 50, 15, 3.00),
('Vino tinto', 'lt', 10, 3, 12.00);