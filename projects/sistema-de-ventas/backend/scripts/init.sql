-- =============================================
-- SISTEMA POS - Script de Base de Datos
-- =============================================

SET FOREIGN_KEY_CHECKS = 0;

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS pos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pos_db;

-- =============================================
-- TABLA: usuarios
-- =============================================
DROP TABLE IF EXISTS detalle_ventas;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS detalle_compras;
DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS gastos;
DROP TABLE IF EXISTS cajas;
DROP TABLE IF EXISTS cuadres;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'cajero') DEFAULT 'cajero',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: categorias
-- =============================================
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: productos
-- =============================================
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 5,
    codigo_barras VARCHAR(50) UNIQUE,
    categoria_id INT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- =============================================
-- TABLA: proveedores
-- =============================================
CREATE TABLE proveedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: clientes
-- =============================================
CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: compras (encabezado)
-- =============================================
CREATE TABLE compras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    usuario_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =============================================
-- TABLA: detalle_compras
-- =============================================
CREATE TABLE detalle_compras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    compra_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- =============================================
-- TABLA: ventas (encabezado)
-- =============================================
CREATE TABLE ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    cliente_id INT,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
    total DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
);

-- =============================================
-- TABLA: detalle_ventas
-- =============================================
CREATE TABLE detalle_ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- =============================================
-- TABLA: cajas
-- =============================================
CREATE TABLE cajas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP NULL,
    monto_inicial DECIMAL(10, 2) DEFAULT 0,
    monto_final DECIMAL(10, 2),
    estado ENUM('abierta', 'cerrada') DEFAULT 'abierta',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =============================================
-- TABLA: cuadres (añadido posteriormente)
-- =============================================
CREATE TABLE cuadres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ventas_efectivo DECIMAL(10, 2) DEFAULT 0,
    ventas_tarjeta DECIMAL(10, 2) DEFAULT 0,
    ventas_transferencia DECIMAL(10, 2) DEFAULT 0,
    total_ventas DECIMAL(10, 2) DEFAULT 0,
    gastos DECIMAL(10, 2) DEFAULT 0,
    deudas_cobradas DECIMAL(10, 2) DEFAULT 0,
    deudas_pendientes DECIMAL(10, 2) DEFAULT 0,
    monto_inicial DECIMAL(10, 2) DEFAULT 0,
    total_ingresos DECIMAL(10, 2) DEFAULT 0,
    total_egresos DECIMAL(10, 2) DEFAULT 0,
    diferencia DECIMAL(10, 2) DEFAULT 0,
    observaciones TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =============================================
-- TABLA: gastos
-- =============================================
CREATE TABLE gastos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =============================================
-- INDICES
-- =============================================
CREATE INDEX idx_productos_codigo ON productos(codigo_barras);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX idx_compras_fecha ON compras(fecha);
CREATE INDEX idx_cuadres_fecha ON cuadres(fecha);
CREATE INDEX idx_cuadres_usuario ON cuadres(usuario_id);

-- =============================================
-- DATOS SEED - Usuarios
-- =============================================
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@pos.com', '$2a$10$BUYlLQN0OS4KxflurYBvt.pCh9Z6AXrKkWFpCR1h1b49PF5AtcV0G', 'admin'),
('Cajero Principal', 'cajero@pos.com', '$2a$10$BUYlLQN0OS4KxflurYBvt.pCh9Z6AXrKkWFpCR1h1b49PF5AtcV0G', 'cajero');

-- Password para ambos: admin123

-- =============================================
-- DATOS SEED - Clientes
-- =============================================
INSERT INTO clientes (nombre, telefono, email) VALUES
('Cliente General', NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;