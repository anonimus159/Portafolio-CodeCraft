-- ============================================
-- SISTEMA POS RESTAURANTE - ESQUEMA MySQL ACTUALIZADO
-- Versión Mejorada 2026
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol)
);

-- ----------------------------
-- TABLA: categorias
-- ----------------------------
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('comida', 'bebida') NOT NULL DEFAULT 'comida',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_estado (estado)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    INDEX idx_categoria (categoria_id),
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo)
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_activo (activo),
    INDEX idx_stock (cantidad, stock_minimo)
);

-- ----------------------------
-- TABLA: inventario_movimientos (HISTORIAL)
-- ----------------------------
CREATE TABLE inventario_movimientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inventario_id INT NOT NULL,
    tipo ENUM('entrada', 'salida') NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL,
    cantidad_anterior DECIMAL(10, 2) DEFAULT 0,
    cantidad_nueva DECIMAL(10, 2) DEFAULT 0,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventario_id) REFERENCES inventario(id) ON DELETE RESTRICT,
    INDEX idx_inventario (inventario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_fecha (created_at)
);

-- ----------------------------
-- TABLA: recetas (encabezado)
-- ----------------------------
CREATE TABLE recetas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id)
);

-- ----------------------------
-- TABLA: receta_detalle (ingredientes)
-- ----------------------------
CREATE TABLE receta_detalle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    receta_id INT NOT NULL,
    ingrediente_id INT NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'mixto'),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_mesa (mesa_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (created_at)
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
    estado ENUM('pendiente', 'en_preparacion', 'listo', 'cancelado') DEFAULT 'pendiente',
    lugar_preparacion ENUM('cocina', 'barra') DEFAULT 'cocina',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    INDEX idx_pedido (pedido_id),
    INDEX idx_estado (estado),
    INDEX idx_lugar (lugar_preparacion)
);

-- ----------------------------
-- TABLA: cuadre (encabezado)
-- ----------------------------
CREATE TABLE cuadre (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_apertura TIME DEFAULT '08:00:00',
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
    UNIQUE KEY unique_fecha_usuario (fecha, usuario_id),
    INDEX idx_fecha (fecha),
    INDEX idx_status (status)
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
    tipo_ingreso VARCHAR(50) DEFAULT 'ventas',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuadre_id) REFERENCES cuadre(id) ON DELETE CASCADE,
    INDEX idx_cuadre (cuadre_id),
    INDEX idx_tipo (tipo)
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
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_pedido (pedido_id),
    INDEX idx_fecha (created_at),
    INDEX idx_usuario (usuario_id)
);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Usuarios (password en producción debe estar hasheado con bcrypt)
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
(6, 8, 2, 1),
(7, 4, 3, 0),
(8, 4, 3, 1);

-- Productos
INSERT INTO productos (nombre, descripcion, precio, categoria_id, tipo, tiempo_preparacion) VALUES
('Hamburguesa Clásica', 'Hamburguesa con carne, queso, lechuga y tomate', 12.00, 2, 'comida', 15),
('Pizza Margarita', 'Pizza con salsa de tomate, mozzarella y albahaca', 15.00, 2, 'comida', 20),
('Pasta Carbonara', 'Pasta con bacon, huevo, queso parmesano', 13.00, 2, 'comida', 18),
('Ensalada César', 'Ensalada con lechuga, crutones y aderezo césar', 8.00, 1, 'comida', 5),
('Pollo Frito', 'Pollo frito crujiente con salsa BBQ', 11.00, 2, 'comida', 15),
('Gaseosa', 'Gaseosa 500ml', 2.00, 3, 'bebida', 1),
('Cerveza Nacional', 'Cerveza 330ml', 3.00, 5, 'bebida', 1),
('Cerveza Importada', 'Cerveza 330ml', 5.00, 5, 'bebida', 1),
('Vino Tinto', 'Copa de vino tinto 250ml', 6.00, 6, 'bebida', 1),
('Postre del Día', 'Consultar con el mesero', 5.00, 4, 'comida', 10),
('Papas Fritas', 'Papas fritas crujientes', 4.00, 1, 'comida', 10),
('Hot Dog', 'Perro caliente con toppings', 6.00, 2, 'comida', 8),
('Jugo Natural', 'Jugo de fruta natural 300ml', 3.50, 3, 'bebida', 3),
('Café Americano', 'Taza de café americano', 2.50, 3, 'bebida', 2),
('Brownie', 'Brownie de chocolate con helado', 5.50, 4, 'comida', 5);

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
('Albahaca', 'kg', 5, 2, 4.00),
('Pasta italiana', 'kg', 25, 8, 3.00),
('Bacon', 'kg', 10, 3, 9.00),
('Huevos', 'docena', 15, 5, 3.50),
('Pollo', 'kg', 30, 10, 5.00),
('Gaseosa concentrada', 'lt', 30, 10, 1.00),
('Cerveza nacional', 'unidad', 100, 30, 1.50),
('Cerveza importada', 'unidad', 50, 15, 3.00),
('Vino tinto', 'lt', 10, 3, 12.00),
('Papas', 'kg', 40, 10, 1.20),
('Pan de hot dog', 'unidad', 80, 20, 0.40),
('Frutas variadas', 'kg', 25, 8, 3.00),
('Café en grano', 'kg', 8, 2, 15.00),
('Chocolate', 'kg', 12, 4, 8.00);

-- Recetas
INSERT INTO recetas (producto_id, descripcion) VALUES
(1, 'Hamburguesa clásica con acompañamientos'),
(2, 'Pizza margarita tradicional'),
(3, 'Pasta carbonara italiana'),
(4, 'Ensalada césar fresca'),
(5, 'Pollo frito crujiente'),
(11, 'Papas fritas doradas'),
(12, 'Hot dog completo'),
(15, 'Brownie de chocolate');

-- Ingredientes de recetas
INSERT INTO receta_detalle (receta_id, ingrediente_id, cantidad) VALUES
-- Hamburguesa (receta 1)
(1, 1, 1),    -- 1 pan
(1, 2, 0.15), -- 150g carne
(1, 3, 0.05), -- 50g queso
(1, 4, 0.03), -- 30g lechuga
(1, 5, 0.05), -- 50g tomate
-- Pizza (receta 2)
(2, 6, 0.3),  -- 300g harina
(2, 7, 0.1),  -- 100ml salsa tomate
(2, 8, 0.15), -- 150g mozzarella
(2, 9, 0.01), -- 10g albahaca
-- Pasta Carbonara (receta 3)
(3, 10, 0.2), -- 200g pasta
(3, 11, 0.08),-- 80g bacon
(3, 12, 1),   -- 1 huevo
(3, 3, 0.05), -- 50g parmesano (usamos cheddar como aprox)
-- Ensalada César (receta 4)
(4, 4, 0.15), -- 150g lechuga
(4, 3, 0.03), -- 30g queso
-- Pollo Frito (receta 5)
(5, 13, 0.25),-- 250g pollo
(5, 6, 0.05), -- 50g harina
-- Papas Fritas (receta 6)
(6, 18, 0.2), -- 200g papas
-- Hot Dog (receta 7)
(7, 19, 1),   -- 1 pan
(7, 2, 0.1),  -- 100g carne/salchicha
(7, 5, 0.03), -- 30g tomate
-- Brownie (receta 8)
(8, 22, 0.1), -- 100g chocolate
(8, 12, 2),   -- 2 huevos
(8, 6, 0.1);  -- 100g harina

-- ============================================
-- VISTAS ÚTILES PARA REPORTES
-- ============================================

-- Vista: Productos más vendidos
CREATE OR REPLACE VIEW v_productos_mas_vendidos AS
SELECT
    p.id,
    p.nombre,
    p.precio,
    SUM(pd.cantidad) as total_vendido,
    SUM(pd.cantidad * pd.precio_unitario) as total_ingresos
FROM productos p
JOIN pedido_detalle pd ON p.id = pd.producto_id
JOIN pedidos pe ON pd.pedido_id = pe.id
WHERE pe.estado NOT IN ('cancelado')
GROUP BY p.id, p.nombre, p.precio
ORDER BY total_vendido DESC;

-- Vista: Ventas por día
CREATE OR REPLACE VIEW v_ventas_diarias AS
SELECT
    DATE(created_at) as fecha,
    COUNT(*) as num_ventas,
    SUM(total) as total_ventas,
    AVG(total) as ticket_promedio
FROM ventas
GROUP BY DATE(created_at)
ORDER BY fecha DESC;

-- Vista: Estado de mesas
CREATE OR REPLACE VIEW v_estado_mesas AS
SELECT
    m.id,
    m.numero,
    m.capacidad,
    m.estado,
    COALESCE(SUM(p.total), 0) as total_consumido,
    COUNT(p.id) as num_pedidos_activos
FROM mesas m
LEFT JOIN pedidos p ON m.id = p.mesa_id AND p.estado NOT IN ('entregado', 'cancelado')
GROUP BY m.id, m.numero, m.capacidad, m.estado;

-- ============================================
-- PROCEDIMIENTO ALMACENADO: Descontar inventario
-- ============================================

DELIMITER //
CREATE PROCEDURE sp_descontar_inventario_pedido(IN pedido_id_param INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_producto_id INT;
    DECLARE v_cantidad INT;
    DECLARE v_receta_id INT;
    DECLARE v_ingrediente_id INT;
    DECLARE v_cantidad_ingrediente DECIMAL(10,2);
    DECLARE v_cantidad_total DECIMAL(10,2);

    -- Cursor para obtener detalles del pedido
    DECLARE pedido_cursor CURSOR FOR
        SELECT producto_id, cantidad FROM pedido_detalle WHERE pedido_id = pedido_id_param;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN pedido_cursor;

    read_loop: LOOP
        FETCH pedido_cursor INTO v_producto_id, v_cantidad;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Obtener receta del producto
        SELECT id INTO v_receta_id FROM recetas WHERE producto_id = v_producto_id;

        IF v_receta_id IS NOT NULL THEN
            -- Cursor para ingredientes de la receta
            BEGIN
                DECLARE receta_cursor CURSOR FOR
                    SELECT ingrediente_id, cantidad FROM receta_detalle WHERE receta_id = v_receta_id;
                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

                OPEN receta_cursor;

                read_receta: LOOP
                    FETCH receta_cursor INTO v_ingrediente_id, v_cantidad_ingrediente;
                    IF done THEN
                        LEAVE read_receta;
                    END IF;

                    SET v_cantidad_total = v_cantidad_ingrediente * v_cantidad;

                    -- Descontar del inventario
                    UPDATE inventario
                    SET cantidad = GREATEST(0, cantidad - v_cantidad_total)
                    WHERE id = v_ingrediente_id;

                    -- Registrar movimiento
                    INSERT INTO inventario_movimientos (inventario_id, tipo, cantidad, descripcion)
                    VALUES (v_ingrediente_id, 'salida', v_cantidad_total,
                            CONCAT('Pedido ', pedido_id_param, ' - Producto ', v_producto_id));
                END LOOP;

                CLOSE receta_cursor;
            END;
        END IF;

        SET done = FALSE;
    END LOOP;

    CLOSE pedido_cursor;
END //
DELIMITER ;

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
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activo (activo)
);
