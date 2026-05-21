const pool = require('./connection');

const db = {
  async query(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async getConnection() {
    return pool.getConnection();
  },

  async transaction(asyncFn) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      const result = await asyncFn(conn);
      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  usuarios: {
    async getAll() {
      return db.query('SELECT id, nombre, email, rol, activo, created_at FROM usuarios WHERE activo = true');
    },
    async getById(id) {
      const rows = await db.query('SELECT id, nombre, email, rol, activo, created_at FROM usuarios WHERE id = ?', [id]);
      return rows[0] || null;
    },
    async getByEmail(email) {
      const rows = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      return rows[0] || null;
    },
    async create(data) {
      const result = await db.query(
        'INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, ?)',
        [data.nombre, data.email, data.password, data.rol || 'mesero', true]
      );
      return { id: result.insertId, ...data };
    },
    async update(id, data) {
      const fields = [];
      const values = [];
      if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
      if (data.email) { fields.push('email = ?'); values.push(data.email); }
      if (data.password) { fields.push('password = ?'); values.push(data.password); }
      if (data.rol) { fields.push('rol = ?'); values.push(data.rol); }
      if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo); }
      values.push(id);
      await db.query(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.getById(id);
    },
    async remove(id) {
      await db.query('UPDATE usuarios SET activo = false WHERE id = ?', [id]);
    }
  },

  categorias: {
    async getAll() {
      return db.query('SELECT * FROM categorias WHERE activo = true ORDER BY nombre');
    },
    async getById(id) {
      const rows = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);
      return rows[0] || null;
    },
    async create(data) {
      const result = await db.query(
        'INSERT INTO categorias (nombre, tipo, activo) VALUES (?, ?, ?)',
        [data.nombre, data.tipo || 'comida', true]
      );
      return { id: result.insertId, ...data };
    },
    async update(id, data) {
      const fields = [];
      const values = [];
      if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
      if (data.tipo) { fields.push('tipo = ?'); values.push(data.tipo); }
      if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo); }
      values.push(id);
      await db.query(`UPDATE categorias SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.getById(id);
    },
    async remove(id) {
      await db.query('UPDATE categorias SET activo = false WHERE id = ?', [id]);
    }
  },

  mesas: {
    async getAll() {
      return db.query('SELECT * FROM mesas ORDER BY numero');
    },
    async getById(id) {
      const rows = await db.query('SELECT * FROM mesas WHERE id = ?', [id]);
      return rows[0] || null;
    },
    async getByNumber(numero) {
      const rows = await db.query('SELECT * FROM mesas WHERE numero = ?', [numero]);
      return rows[0] || null;
    },
    async create(data) {
      const result = await db.query(
        'INSERT INTO mesas (numero, capacidad, estado, posicion_x, posicion_y) VALUES (?, ?, ?, ?, ?)',
        [data.numero, data.capacidad, 'libre', data.posicion_x || 0, data.posicion_y || 0]
      );
      return { id: result.insertId, ...data };
    },
    async update(id, data) {
      const fields = [];
      const values = [];
      if (data.numero !== undefined) { fields.push('numero = ?'); values.push(data.numero); }
      if (data.capacidad !== undefined) { fields.push('capacidad = ?'); values.push(data.capacidad); }
      if (data.estado) { fields.push('estado = ?'); values.push(data.estado); }
      if (data.posicion_x !== undefined) { fields.push('posicion_x = ?'); values.push(data.posicion_x); }
      if (data.posicion_y !== undefined) { fields.push('posicion_y = ?'); values.push(data.posicion_y); }
      values.push(id);
      await db.query(`UPDATE mesas SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.getById(id);
    },
    async remove(id) {
      await db.query('DELETE FROM mesas WHERE id = ?', [id]);
    }
  },

  productos: {
    async getAll() {
      return db.query(`
        SELECT p.*, c.nombre as categoria_nombre 
        FROM productos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.activo = true
        ORDER BY p.nombre
      `);
    },
    async getById(id) {
      const rows = await db.query(
        `SELECT p.*, c.nombre as categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = ?`,
        [id]
      );
      return rows[0] || null;
    },
    async getByCategoria(categoria_id) {
      return db.query(
        'SELECT * FROM productos WHERE categoria_id = ? AND activo = true',
        [categoria_id]
      );
    },
    async create(data) {
      const result = await db.query(
        `INSERT INTO productos (nombre, descripcion, precio, categoria_id, tipo, tiempo_preparacion, imagen, activo) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.nombre, data.descripcion, data.precio, data.categoria_id,
          data.tipo || 'comida', data.tiempo_preparacion || 15, data.imagen, true
        ]
      );
      return { id: result.insertId, ...data };
    },
    async update(id, data) {
      const fields = [];
      const values = [];
      if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
      if (data.descripcion !== undefined) { fields.push('descripcion = ?'); values.push(data.descripcion); }
      if (data.precio !== undefined) { fields.push('precio = ?'); values.push(data.precio); }
      if (data.categoria_id) { fields.push('categoria_id = ?'); values.push(data.categoria_id); }
      if (data.tipo) { fields.push('tipo = ?'); values.push(data.tipo); }
      if (data.tiempo_preparacion) { fields.push('tiempo_preparacion = ?'); values.push(data.tiempo_preparacion); }
      if (data.imagen !== undefined) { fields.push('imagen = ?'); values.push(data.imagen); }
      if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo); }
      values.push(id);
      await db.query(`UPDATE productos SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.getById(id);
    },
    async remove(id) {
      await db.query('UPDATE productos SET activo = false WHERE id = ?', [id]);
    }
  },

  inventario: {
    async getAll() {
      return db.query('SELECT * FROM inventario WHERE activo = true ORDER BY nombre');
    },
    async getById(id) {
      const rows = await db.query('SELECT * FROM inventario WHERE id = ?', [id]);
      return rows[0] || null;
    },
    async getAlertas() {
      return db.query(
        'SELECT * FROM inventario WHERE activo = true AND cantidad <= stock_minimo ORDER BY cantidad ASC'
      );
    },
    async create(data) {
      const result = await db.query(
        `INSERT INTO inventario (nombre, unidad, cantidad, stock_minimo, precio_unitario, activo) VALUES (?, ?, ?, ?, ?, ?)`,
        [data.nombre, data.unidad, data.cantidad, data.stock_minimo, data.precio_unitario, true]
      );
      return { id: result.insertId, ...data };
    },
    async update(id, data) {
      const fields = [];
      const values = [];
      if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
      if (data.unidad) { fields.push('unidad = ?'); values.push(data.unidad); }
      if (data.cantidad !== undefined) { fields.push('cantidad = ?'); values.push(data.cantidad); }
      if (data.stock_minimo !== undefined) { fields.push('stock_minimo = ?'); values.push(data.stock_minimo); }
      if (data.precio_unitario !== undefined) { fields.push('precio_unitario = ?'); values.push(data.precio_unitario); }
      if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo); }
      values.push(id);
      await db.query(`UPDATE inventario SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.getById(id);
    },
    async ajustarCantidad(id, cantidad, tipo, descripcion) {
      const item = await this.getById(id);
      if (!item) throw new Error('Inventario no encontrado');
      
      const cantidadAnterior = parseFloat(item.cantidad);
      let cantidadNueva;
      
      if (tipo === 'entrada') {
        cantidadNueva = cantidadAnterior + cantidad;
      } else if (tipo === 'salida') {
        cantidadNueva = cantidadAnterior - cantidad;
      } else {
        cantidadNueva = cantidad;
      }
      
      await db.transaction(async (conn) => {
        await conn.execute('UPDATE inventario SET cantidad = ? WHERE id = ?', [cantidadNueva, id]);
        await conn.execute(
          `INSERT INTO inventario_movimientos (inventario_id, tipo, cantidad, cantidad_anterior, cantidad_nueva, descripcion) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, tipo, cantidad, cantidadAnterior, cantidadNueva, descripcion]
        );
      });
      
      return this.getById(id);
    },
    async getMovimientos(limit = 50) {
      return db.query(
        `SELECT m.*, i.nombre as inventario_nombre 
         FROM inventario_movimientos m 
         LEFT JOIN inventario i ON m.inventario_id = i.id 
         ORDER BY m.created_at DESC LIMIT ?`,
        [limit]
      );
    },
    async remove(id) {
      await db.query('UPDATE inventario SET activo = false WHERE id = ?', [id]);
    }
  },

  pedidos: {
    async getAll(estado) {
      if (estado) {
        return db.query(
          `SELECT p.*, m.numero as mesa_numero, u.nombre as mesero 
           FROM pedidos p 
           LEFT JOIN mesas m ON p.mesa_id = m.id 
           LEFT JOIN usuarios u ON p.usuario_id = u.id 
           WHERE p.estado = ? 
           ORDER BY p.created_at DESC`,
          [estado]
        );
      }
      return db.query(
        `SELECT p.*, m.numero as mesa_numero, u.nombre as mesero 
         FROM pedidos p 
         LEFT JOIN mesas m ON p.mesa_id = m.id 
         LEFT JOIN usuarios u ON p.usuario_id = u.id 
         ORDER BY p.created_at DESC`
      );
    },
    async getById(id) {
      const rows = await db.query(
        `SELECT p.*, m.numero as mesa_numero, u.nombre as mesero 
         FROM pedidos p 
         LEFT JOIN mesas m ON p.mesa_id = m.id 
         LEFT JOIN usuarios u ON p.usuario_id = u.id 
         WHERE p.id = ?`,
        [id]
      );
      return rows[0] || null;
    },
    async getDetalles(pedido_id) {
      return db.query(
        `SELECT d.*, p.nombre as producto_nombre, p.tipo as producto_tipo, p.imagen as producto_imagen
         FROM pedido_detalle d
         LEFT JOIN productos p ON d.producto_id = p.id
         WHERE d.pedido_id = ?
         ORDER BY d.id`,
        [pedido_id]
      );
    },
    async create(conn, data) {
      const [result] = await conn.execute(
        `INSERT INTO pedidos (mesa_id, usuario_id, estado, tipo, nombre_cliente, observaciones, subtotal, iva, total) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.mesa_id || null, data.usuario_id, 'pendiente', data.tipo || 'local',
          data.nombre_cliente, data.observaciones, 0, 0, 0
        ]
      );
      return result.insertId;
    },
    async updateEstado(id, estado) {
      await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
      return this.getById(id);
    },
    async facturar(id, metodo_pago) {
      await db.transaction(async (conn) => {
        const pedido = await conn.execute('SELECT * FROM pedidos WHERE id = ?', [id]);
        if (!pedido[0][0]) throw new Error('Pedido no encontrado');
        
        await conn.execute(
          'UPDATE pedidos SET metodo_pago = ?, estado = ? WHERE id = ?',
          [metodo_pago, 'entregado', id]
        );
        
        await conn.execute(
          'INSERT INTO ventas (pedido_id, usuario_id, total, metodo_pago) VALUES (?, ?, ?, ?)',
          [id, pedido[0][0].usuario_id, pedido[0][0].total, metodo_pago]
        );
        
        if (pedido[0][0].mesa_id) {
          await conn.execute('UPDATE mesas SET estado = ? WHERE id = ?', ['libre', pedido[0][0].mesa_id]);
        }
      });
      return this.getById(id);
    }
  },

  pedido_detalle: {
    async agregar(conn, pedido_id, data) {
      const producto = await db.query('SELECT precio FROM productos WHERE id = ?', [data.producto_id]);
      if (!producto[0]) throw new Error('Producto no encontrado');
      
      const [result] = await conn.execute(
        `INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario, notas, estado, lugar_preparacion) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          pedido_id, data.producto_id, data.cantidad, producto[0].precio,
          data.nota, 'pendiente', data.lugar_preparacion || 'cocina'
        ]
      );
      return result.insertId;
    },
    async cambiarEstado(id, estado) {
      await db.query('UPDATE pedido_detalle SET estado = ? WHERE id = ?', [estado, id]);
    }
  },

  cuadre: {
    async getAll() {
      return db.query('SELECT c.*, u.nombre as usuario_nombre FROM cuadre c LEFT JOIN usuarios u ON c.usuario_id = u.id ORDER BY c.fecha DESC');
    },
    async getById(id) {
      const rows = await db.query(
        `SELECT c.*, u.nombre as usuario_nombre FROM cuadre c LEFT JOIN users u ON c.usuario_id = u.id WHERE c.id = ?`,
        [id]
      );
      return rows[0] || null;
    },
    async getActivo(usuario_id) {
      const rows = await db.query(
        'SELECT * FROM cuadre WHERE usuario_id = ? AND status = ? ORDER BY created_at DESC LIMIT 1',
        [usuario_id, 'abierto']
      );
      return rows[0] || null;
    },
    async create(data) {
      const result = await db.query(
        `INSERT INTO cuadre (usuario_id, fecha, dinero_sistema, status) VALUES (?, ?, ?, ?)`,
        [data.usuario_id, new Date().toISOString().split('T')[0], data.efectivo_inicial, 'abierto']
      );
      return { id: result.insertId, ...data };
    },
    async agregarMovimiento(cuadre_id, tipo, data) {
      await db.query(
        `INSERT INTO cuadre_detalle (cuadre_id, tipo, descripcion, monto, tipo_ingreso) VALUES (?, ?, ?, ?, ?)`,
        [cuadre_id, tipo, data.descripcion, data.monto, data.tipo_ingreso || 'ventas']
      );
      
      if (tipo === 'ingreso') {
        await db.query('UPDATE cuadre SET total_ingresos = total_ingresos + ? WHERE id = ?', [data.monto, cuadre_id]);
      } else {
        await db.query('UPDATE cuadre SET total_gastos = total_gastos + ? WHERE id = ?', [data.monto, cuadre_id]);
      }
    },
    async cerrar(id, resultado, observaciones) {
      await db.query(
        `UPDATE cuadre SET hora_cierre = NOW(), resultado = ?, observaciones = ?, status = ? WHERE id = ?`,
        [resultado, observaciones, 'cerrado', id]
      );
    }
  },

  ventas: {
    async getByFecha(inicio, fin) {
      return db.query(
        `SELECT v.*, p.id as pedido_id FROM ventas v LEFT JOIN pedidos p ON v.pedido_id = p.id WHERE DATE(v.created_at) BETWEEN ? AND ?`,
        [inicio, fin]
      );
    }
  },

  turnos: {
    async getAll() {
      return db.query('SELECT * FROM turnos WHERE activo = true ORDER BY hora_inicio');
    },
    async getById(id) {
      const rows = await db.query('SELECT * FROM turnos WHERE id = ?', [id]);
      return rows[0] || null;
    },
    async create(data) {
      const result = await db.query(
        'INSERT INTO turnos (nombre, hora_inicio, hora_fin, dia_semana, activo) VALUES (?, ?, ?, ?, ?)',
        [data.nombre, data.hora_inicio, data.hora_fin, data.dia_semana, true]
      );
      return { id: result.insertId, ...data };
    },
    async update(id, data) {
      const fields = [];
      const values = [];
      if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
      if (data.hora_inicio) { fields.push('hora_inicio = ?'); values.push(data.hora_inicio); }
      if (data.hora_fin) { fields.push('hora_fin = ?'); values.push(data.hora_fin); }
      if (data.dia_semana) { fields.push('dia_semana = ?'); values.push(data.dia_semana); }
      if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo); }
      values.push(id);
      await db.query(`UPDATE turnos SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.getById(id);
    },
    async getAsignaciones(usuario_id, fecha) {
      return db.query(
        `SELECT tu.*, t.nombre as turno_nombre, t.hora_inicio, t.hora_fin 
         FROM turno_usuario tu 
         JOIN turnos t ON tu.turno_id = t.id 
         WHERE tu.usuario_id = ? AND tu.fecha = ?`,
        [usuario_id, fecha]
      );
    },
    async getAsignacionById(id) {
      const rows = await db.query(
        `SELECT tu.*, t.nombre as turno_nombre, t.hora_inicio, t.hora_fin, u.nombre as usuario_nombre
         FROM turno_usuario tu 
         JOIN turnos t ON tu.turno_id = t.id 
         JOIN usuarios u ON tu.usuario_id = u.id 
         WHERE tu.id = ?`,
        [id]
      );
      return rows[0] || null;
    },
    async asignarUsuario(turno_id, usuario_id, fecha) {
      const result = await db.query(
        'INSERT INTO turno_usuario (turno_id, usuario_id, fecha) VALUES (?, ?, ?)',
        [turno_id, usuario_id, fecha]
      );
      return { id: result.insertId };
    },
    async iniciarTurno(asignacion_id) {
      await db.query('UPDATE turno_usuario SET hora_entrada = CURTIME() WHERE id = ?', [asignacion_id]);
    },
    async finalizarTurno(asignacion_id) {
      await db.query('UPDATE turno_usuario SET hora_salida = CURTIME() WHERE id = ?', [asignacion_id]);
    },
    async getAllAsignaciones(fecha) {
      return db.query(
        `SELECT tu.*, t.nombre as turno_nombre, t.hora_inicio, t.hora_fin, u.nombre as usuario_nombre
         FROM turno_usuario tu 
         JOIN turnos t ON tu.turno_id = t.id 
         JOIN usuarios u ON tu.usuario_id = u.id 
         WHERE tu.fecha = ?
         ORDER BY t.hora_inicio`,
        [fecha]
      );
    },
    async getUsuariosSinAsignar(fecha) {
      return db.query(
        `SELECT u.id, u.nombre, u.email, u.rol 
         FROM usuarios u 
         WHERE u.activo = true AND u.id NOT IN (
           SELECT usuario_id FROM turno_usuario WHERE fecha = ?
         )`,
        [fecha]
      );
    }
  },

  promociones: {
    async getAll() {
      return db.query('SELECT * FROM promociones ORDER BY fecha_inicio DESC');
    },
    async getById(id) {
      const rows = await db.query('SELECT * FROM promociones WHERE id = ?', [id]);
      return rows[0] || null;
    },
    async getActivas() {
      const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
      const diaActual = dias[new Date().getDay()];
      const horaActual = new Date().toTimeString().slice(0, 8);
      return db.query(
        `SELECT * FROM promociones WHERE activo = true 
         AND fecha_inicio <= CURDATE() 
         AND fecha_fin >= CURDATE()
         AND (hora_inicio IS NULL OR hora_inicio <= ?)
         AND (hora_fin IS NULL OR hora_fin >= ?)
         AND (dias_aplicar IS NULL OR FIND_IN_SET(?, dias_aplicar) > 0)
         AND (maximo_usos IS NULL OR usos_actuales < maximo_usos)`,
        [horaActual, horaActual, diaActual]
      );
    },
    async create(data) {
      const result = await db.query(
        `INSERT INTO promociones (nombre, descripcion, tipo, valor, producto_id, categoria_id, aplica_todos, fecha_inicio, fecha_fin, hora_inicio, hora_fin, dias_aplicar, cantidad_minima, maximo_usos, activo) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.nombre, data.descripcion, data.tipo, data.valor, data.producto_id, data.categoria_id, data.aplica_todos || false, data.fecha_inicio, data.fecha_fin, data.hora_inicio || '00:00:00', data.hora_fin || '23:59:59', data.dias_aplicar, data.cantidad_minima || 1, data.maximo_usos, true]
      );
      if (data.productos) {
        for (const producto_id of data.productos) {
          await db.query('INSERT INTO promocion_productos (promocion_id, producto_id) VALUES (?, ?)', [result.insertId, producto_id]);
        }
      }
      return { id: result.insertId, ...data };
    },
    async update(id, data) {
      const fields = [];
      const values = [];
      if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
      if (data.descripcion !== undefined) { fields.push('descripcion = ?'); values.push(data.descripcion); }
      if (data.tipo) { fields.push('tipo = ?'); values.push(data.tipo); }
      if (data.valor !== undefined) { fields.push('valor = ?'); values.push(data.valor); }
      if (data.fecha_inicio) { fields.push('fecha_inicio = ?'); values.push(data.fecha_inicio); }
      if (data.fecha_fin) { fields.push('fecha_fin = ?'); values.push(data.fecha_fin); }
      if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo); }
      values.push(id);
      await db.query(`UPDATE promociones SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.getById(id);
    },
    async delete(id) {
      await db.query('UPDATE promociones SET activo = false WHERE id = ?', [id]);
    },
    async getProductos(promocion_id) {
      return db.query(
        `SELECT p.* FROM productos p 
         JOIN promocion_productos pp ON p.id = pp.producto_id 
         WHERE pp.promocion_id = ?`,
        [promocion_id]
      );
    },
    async aplicar(pedido_id, productos, subtotal) {
      const promo = await this.getActivas();
      let descuento = 0;
      
      for (const p of promo) {
        if (p.aplica_todos) {
          descuento = p.tipo === 'porcentaje' ? subtotal * (p.valor / 100) : p.valor;
        } else if (p.producto_id) {
          const prods = await this.getProductos(p.id);
          const tieneProducto = prods.some(pr => productos.includes(pr.producto_id));
          if (tieneProducto) {
            descuento = p.tipo === 'porcentaje' ? subtotal * (p.valor / 100) : p.valor;
          }
        }
      }
      if (descuento > 0) {
        await db.query('UPDATE promociones SET usos_actuales = usos_actuales + 1 WHERE id IN (SELECT promocion_id FROM promociones WHERE activo = true)', []);
      }
      return descuento;
    }
  },

  modificadores: {
    async getByProducto(producto_id) {
      return db.query(
        `SELECT m.*, mi.inventario_id, mi.cantidad as cantidad_inventario, i.nombre as inventario_nombre
         FROM modificadores m 
         LEFT JOIN modificador_inventario mi ON m.id = mi.modificador_id
         LEFT JOIN inventario i ON mi.inventario_id = i.id
         WHERE m.producto_id = ? AND m.activo = true`,
        [producto_id]
      );
    },
    async getById(id) {
      const rows = await db.query('SELECT * FROM modificadores WHERE id = ?', [id]);
      return rows[0] || null;
    },
    async create(data) {
      const result = await db.query(
        'INSERT INTO modificadores (producto_id, nombre, tipo, precio_adicional, activo) VALUES (?, ?, ?, ?, ?)',
        [data.producto_id, data.nombre, data.tipo || 'ingrediente', data.precio_adicional || 0, true]
      );
      if (data.inventario_id && data.cantidad_inventario) {
        await db.query('INSERT INTO modificador_inventario (modificador_id, inventario_id, cantidad) VALUES (?, ?, ?)',
          [result.insertId, data.inventario_id, data.cantidad_inventario]);
      }
      return { id: result.insertId };
    },
    async update(id, data) {
      const fields = [];
      const values = [];
      if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
      if (data.precio_adicional !== undefined) { fields.push('precio_adicional = ?'); values.push(data.precio_adicional); }
      if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo); }
      values.push(id);
      await db.query(`UPDATE modificadores SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.getById(id);
    },
    async delete(id) {
      await db.query('UPDATE modificadores SET activo = false WHERE id = ?', [id]);
    },
    async getAll() {
      return db.query(
        `SELECT m.*, p.nombre as producto_nombre 
         FROM modificadores m 
         JOIN productos p ON m.producto_id = p.id 
         ORDER BY p.nombre, m.nombre`
      );
    },
    async getGrupos(producto_id) {
      return db.query(
        `SELECT tipo, COUNT(*) as total, SUM(precio_adicional) as precio_max
         FROM modificadores 
         WHERE producto_id = ? AND activo = true 
         GROUP BY tipo`,
        [producto_id]
      );
    }
  },

  delivery: {
    async getAll(estado) {
      let query = `
        SELECT d.*, p.total as pedido_total, u.nombre as repartidor_nombre 
        FROM delivery d 
        LEFT JOIN pedidos p ON d.pedido_id = p.id 
        LEFT JOIN usuarios u ON d.repartidor_id = u.id`;
      if (estado) {
        query += ' WHERE d.estado = ?';
        return db.query(query + ' ORDER BY d.created_at DESC', [estado]);
      }
      return db.query(query + ' ORDER BY d.created_at DESC');
    },
    async getById(id) {
      const rows = await db.query(
        `SELECT d.*, p.total as pedido_total, p.estado as pedido_estado
         FROM delivery d 
         LEFT JOIN pedidos p ON d.pedido_id = p.id 
         WHERE d.id = ?`,
        [id]
      );
      return rows[0] || null;
    },
    async crear(data) {
      const result = await db.query(
        `INSERT INTO delivery (pedido_id, nombre_cliente, telefono, direccion, referencia, latitud, longitud, costo_envio, distancia_km, observaciones) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.pedido_id, data.nombre_cliente, data.telefono, data.direccion, data.referencia, data.latitud, data.longitud, data.costo_envio || 0, data.distancia_km, data.observaciones]
      );
      return { id: result.insertId };
    },
    async asignarRepartidor(delivery_id, repartidor_id) {
      await db.query(
        'UPDATE delivery SET repartidor_id = ?, estado = ?, hora_asignacion = CURTIME() WHERE id = ?',
        [repartidor_id, 'asignado', delivery_id]
      );
    },
    async actualizarEstado(delivery_id, estado) {
      const horaEntrega = estado === 'entregado' ? 'CURTIME()' : 'NULL';
      await db.query(
        `UPDATE delivery SET estado = ?, ${estado === 'entregado' ? 'hora_entrega = CURTIME()' : 'hora_entrega = NULL'} WHERE id = ?`,
        [estado, delivery_id]
      );
    },
    async getZonas() {
      return db.query('SELECT * FROM zonas_entrega WHERE activo = true');
    },
    async crearZona(data) {
      const result = await db.query(
        'INSERT INTO zonas_entrega (nombre, costo, tiempo_estimado, activo) VALUES (?, ?, ?, ?)',
        [data.nombre, data.costo || 0, data.tiempo_estimado || 30, true]
      );
      return { id: result.insertId };
    },
    async getEstadisticas(fechaInicio, fechaFin) {
      return db.query(
        `SELECT 
           COUNT(*) as total_pedidos,
           SUM(CASE WHEN estado = 'entregado' THEN 1 ELSE 0 END) as entregados,
           SUM(costo_envio) as ingresos_envio,
           AVG(distancia_km) as distancia_promedio
         FROM delivery 
         WHERE DATE(created_at) BETWEEN ? AND ?`,
        [fechaInicio, fechaFin]
      );
    }
  }
};

module.exports = db;