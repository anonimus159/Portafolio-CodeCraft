const fs = require('fs');
const path = require('path');

// Use absolute path based on process working directory
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Archivos de datos
const DB_FILES = {
  usuarios: 'usuarios.json',
  mesas: 'mesas.json',
  categorias: 'categorias.json',
  productos: 'productos.json',
  inventario: 'inventario.json',
  pedidos: 'pedidos.json',
  pedido_detalle: 'pedido_detalle.json',
  cuadre: 'cuadre.json',
  cuadre_detalle: 'cuadre_detalle.json',
  ventas: 'ventas.json',
  recetas: 'recetas.json',
  receta_detalle: 'receta_detalle.json'
};

// Inicializar datos si no existen
const defaultData = {
  usuarios: [
    { id: 1, nombre: 'Administrador', email: 'admin@restaurante.com', password: 'admin123', rol: 'admin', activo: true },
    { id: 2, nombre: 'Carlos Cajero', email: 'carlos@restaurante.com', password: 'carlos123', rol: 'cajero', activo: true },
    { id: 3, nombre: 'María Mesero', email: 'maria@restaurante.com', password: 'maria123', rol: 'mesero', activo: true },
    { id: 4, nombre: 'Chef Juan', email: 'juan@restaurante.com', password: 'juan123', rol: 'cocina', activo: true }
  ],
  mesas: [
    { id: 1, numero: 1, capacidad: 4, estado: 'libre', posicion_x: 0, posicion_y: 0 },
    { id: 2, numero: 2, capacidad: 4, estado: 'libre', posicion_x: 1, posicion_y: 0 },
    { id: 3, numero: 3, capacidad: 6, estado: 'libre', posicion_x: 2, posicion_y: 0 },
    { id: 4, numero: 4, capacidad: 2, estado: 'libre', posicion_x: 0, posicion_y: 1 },
    { id: 5, numero: 5, capacidad: 2, estado: 'libre', posicion_x: 1, posicion_y: 1 },
    { id: 6, numero: 6, capacidad: 8, estado: 'libre', posicion_x: 2, posicion_y: 1 }
  ],
  categorias: [
    { id: 1, nombre: 'Entradas', tipo: 'comida', activo: true },
    { id: 2, nombre: 'Principales', tipo: 'comida', activo: true },
    { id: 3, nombre: 'Bebidas', tipo: 'bebida', activo: true },
    { id: 4, nombre: 'Postres', tipo: 'comida', activo: true }
  ],
  productos: [
    { id: 1, nombre: 'Hamburguesa Clásica', descripcion: 'Carne, queso, lechuga', precio: 12.00, categoria_id: 2, tipo: 'comida', activo: true },
    { id: 2, nombre: 'Pizza Margarita', descripcion: 'Salsa, mozzarella, albahaca', precio: 15.00, categoria_id: 2, tipo: 'comida', activo: true },
    { id: 3, nombre: 'Pasta Carbonara', descripcion: 'Bacon, huevo, parmesano', precio: 13.00, categoria_id: 2, tipo: 'comida', activo: true },
    { id: 4, nombre: 'Ensalada César', descripcion: 'Lechuga, crutones, aderezo', precio: 8.00, categoria_id: 1, tipo: 'comida', activo: true },
    { id: 5, nombre: 'Gaseosa', descripcion: '500ml', precio: 2.00, categoria_id: 3, tipo: 'bebida', activo: true },
    { id: 6, nombre: 'Cerveza', descripcion: '330ml', precio: 3.00, categoria_id: 3, tipo: 'bebida', activo: true },
    { id: 7, nombre: 'Café', descripcion: 'Taza de café', precio: 2.50, categoria_id: 3, tipo: 'bebida', activo: true },
    { id: 8, nombre: 'Brownie', descripcion: 'Con helado', precio: 5.00, categoria_id: 4, tipo: 'comida', activo: true }
  ],
  inventario: [
    { id: 1, nombre: 'Pan de hamburguesa', unidad: 'unidad', cantidad: 100, stock_minimo: 20, precio_unitario: 0.50, activo: true },
    { id: 2, nombre: 'Carne de res', unidad: 'kg', cantidad: 20, stock_minimo: 5, precio_unitario: 8.00, activo: true },
    { id: 3, nombre: 'Queso cheddar', unidad: 'kg', cantidad: 10, stock_minimo: 3, precio_unitario: 6.00, activo: true },
    { id: 4, nombre: 'Gaseosa concentrada', unidad: 'lt', cantidad: 30, stock_minimo: 10, precio_unitario: 1.00, activo: true }
  ],
  recetas: [],
  receta_detalle: [],
  pedido_detalle: [],
  pedidos: [],
  cuadre: [],
  cuadre_detalle: [],
  ventas: []
};

// Inicializar archivos si no existen
Object.entries(defaultData).forEach(([key, value]) => {
  const filePath = path.join(DATA_DIR, DB_FILES[key]);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
  }
});

// Funciones de base de datos
const db = {
  // Asegurar que existe el archivo
  async ensureFile(collection) {
    const filePath = path.join(DATA_DIR, DB_FILES[collection]);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
  },

  // Leer colección
  async get(collection) {
    await this.ensureFile(collection);
    const filePath = path.join(DATA_DIR, DB_FILES[collection]);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  },

  // Escribir colección
  async set(collection, data) {
    const filePath = path.join(DATA_DIR, DB_FILES[collection]);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  },

  // Buscar por ID
  async findById(collection, id) {
    const data = await this.get(collection);
    return data.find(item => item.id === parseInt(id));
  },

  // Crear nuevo registro
  async create(collection, item) {
    const data = await this.get(collection);
    const maxId = data.length > 0 ? Math.max(...data.map(i => i.id)) : 0;
    item.id = maxId + 1;
    item.created_at = new Date().toISOString();
    data.push(item);
    await this.set(collection, data);
    return item;
  },

  // Actualizar registro
  async update(collection, id, updates) {
    const data = await this.get(collection);
    const index = data.findIndex(item => item.id === parseInt(id));
    if (index === -1) return null;
    data[index] = { ...data[index], ...updates, updated_at: new Date().toISOString() };
    await this.set(collection, data);
    return data[index];
  },

  // Eliminar registro
  async delete(collection, id) {
    const data = await this.get(collection);
    const index = data.findIndex(item => item.id === parseInt(id));
    if (index === -1) return false;
    data.splice(index, 1);
    await this.set(collection, data);
    return true;
  },

  // Query genérico (simula WHERE)
  async query(collection, filter = {}) {
    let data = await this.get(collection);
    Object.entries(filter).forEach(([key, value]) => {
      data = data.filter(item => item[key] === value);
    });
    return data;
  }
};

module.exports = db;