-- Tablas para Turnos, Promociones, Modificadores y Delivery

-- TURNOSturnos
CREATE TABLE IF NOT EXISTS turnos (
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

CREATE TABLE IF NOT EXISTS turno_usuario (
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

-- PROMOCIONES
CREATE TABLE IF NOT EXISTS promociones (
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

CREATE TABLE IF NOT EXISTS promocion_productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promocion_id INT NOT NULL,
    producto_id INT NOT NULL,
    FOREIGN KEY (promocion_id) REFERENCES promociones(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_promocion_producto (promocion_id, producto_id)
);

-- MODIFICADORES
CREATE TABLE IF NOT EXISTS modificadores (
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

CREATE TABLE IF NOT EXISTS modificador_inventario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    modificador_id INT NOT NULL,
    inventario_id INT NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (modificador_id) REFERENCES modificadores(id) ON DELETE CASCADE,
    FOREIGN KEY (inventario_id) REFERENCES inventario(id) ON DELETE CASCADE,
    UNIQUE KEY unique_modificador_inventario (modificador_id, inventario_id)
);

-- DELIVERY
CREATE TABLE IF NOT EXISTS delivery (
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

CREATE TABLE IF NOT EXISTS zonas_entrega (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    costo DECIMAL(10, 2) DEFAULT 0,
    tiempo_estimado INT DEFAULT 30,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activo (activo)
);