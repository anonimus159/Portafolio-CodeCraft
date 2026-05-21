export const CATEGORIES = [
  { id: 'hamburgers', name: 'Hamburguesas', icon: '🍔' },
  { id: 'hotdogs', name: 'Perros Calientes', icon: '🌭' },
  { id: 'drinks', name: 'Bebidas', icon: '🥤' },
  { id: 'combos', name: 'Combos', icon: '🍱' },
  { id: 'extras', name: 'Adiciones', icon: '🍟' },
];

export const PRODUCTS = [
  { 
    id: 1, name: 'Hamb. Clásica', category: 'hamburgers', price: 15000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', favorite: true,
    variants: [
      { id: 'v1', name: 'Sencilla', price: 15000 },
      { id: 'v2', name: 'Doble Carne', price: 22000 },
      { id: 'v3', name: 'Combo (Papas + Gaseosa)', price: 26000 }
    ],
    modifiers: [
      { id: 'm1', name: 'Extra Queso', price: 2000 },
      { id: 'm2', name: 'Extra Tocino', price: 3500 },
      { id: 'm3', name: 'Sin Cebolla', price: 0 },
      { id: 'm4', name: 'Sin Pepinillos', price: 0 }
    ],
    recipe: [
      { ingredientId: 'INV-001', name: 'Carne Angus', amount: 1, unit: 'unidades' },
      { ingredientId: 'INV-002', name: 'Pan Brioche', amount: 1, unit: 'unidades' },
      { ingredientId: 'INV-003', name: 'Queso Cheddar', amount: 1, unit: 'tajadas' }
    ]
  },
  { 
    id: 2, category: 'hamburgers', name: 'Hamb. Especial', price: 22000, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80', favorite: true,
    recipe: [
      { ingredientId: 'INV-001', name: 'Carne Angus', amount: 1, unit: 'unidades' },
      { ingredientId: 'INV-002', name: 'Pan Brioche', amount: 1, unit: 'unidades' },
      { ingredientId: 'INV-003', name: 'Queso Cheddar', amount: 2, unit: 'tajadas' }
    ]
  },
  { id: 3, category: 'hotdogs', name: 'Perro Sencillo', price: 12000, image: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?w=500&q=80', favorite: false },
  { id: 4, category: 'hotdogs', name: 'Perro Suizo', price: 18000, image: 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?w=500&q=80', favorite: true },
  { 
    id: 5, category: 'drinks', name: 'Coca Cola 400ml', price: 4500, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80', favorite: false,
    recipe: [
      { ingredientId: 'INV-006', name: 'Sirope Coca Cola', amount: 1, unit: 'cajas' }
    ]
  },
  { id: 6, category: 'drinks', name: 'Limonada Cerezada', price: 8500, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', favorite: true },
  { 
    id: 7, category: 'combos', name: 'Combo Mega', price: 35000, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80', favorite: true,
    isCombo: true,
    comboSlots: [
      { id: 's1', name: 'Plato Principal', category: 'hamburgers' },
      { id: 's2', name: 'Acompañamiento', category: 'extras' },
      { id: 's3', name: 'Bebida', category: 'drinks' }
    ]
  },
  { id: 8, category: 'extras', name: 'Papas Francesas', price: 7000, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', favorite: false },
];

export const TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Mesa ${i + 1}`,
  status: 'free',
  capacity: 4,
  currentOrder: null
}));

export const INITIAL_ORDERS = [];

export const INITIAL_INVENTORY = [
  { id: 'INV-001', item: 'Carne Angus',     category: 'Carnes',    stock: 45,  unit: 'unidades', status: 'low',      cost: 2500  },
  { id: 'INV-002', item: 'Pan Brioche',      category: 'Panadería', stock: 120, unit: 'unidades', status: 'optimal',  cost: 800   },
  { id: 'INV-003', item: 'Queso Cheddar',    category: 'Lácteos',   stock: 200, unit: 'tajadas',  status: 'optimal',  cost: 300   },
  { id: 'INV-004', item: 'Aceite de Trufa',  category: 'Despensa',  stock: 2,   unit: 'botellas', status: 'critical', cost: 45000 },
  { id: 'INV-005', item: 'Lechuga Romana',   category: 'Verduras',  stock: 15,  unit: 'kg',       status: 'low',      cost: 4000  },
  { id: 'INV-006', item: 'Sirope Coca Cola', category: 'Bebidas',   stock: 8,   unit: 'cajas',    status: 'optimal',  cost: 35000 },
];

export const INITIAL_STAFF = [
  { 
    id: 1, name: 'Jean Pierre', role: 'Chef Principal', department: 'Cocina', status: 'En Turno', 
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean', username: 'jean', password: '123',
    permissions: ['kitchen', 'inventory', 'menu']
  },
  { 
    id: 2, name: 'Alex Peterson', role: 'Mesero Líder', department: 'Servicio', status: 'En Turno', 
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', username: 'alex', password: '123',
    permissions: ['tables', 'pos']
  },
  { 
    id: 3, name: 'Maria Gonzalez', role: 'Sous Chef', department: 'Cocina', status: 'Fuera de Turno', 
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', username: 'maria', password: '123',
    permissions: ['kitchen']
  },
  { 
    id: 4, name: 'David Smith', role: 'Cajero', department: 'Servicio', status: 'En Descanso', 
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', username: 'david', password: '123',
    permissions: ['cashier', 'tables', 'pos']
  },
  { 
    id: 5, name: 'Sarah Connor', role: 'Gerente', department: 'Administración', status: 'En Turno', 
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', username: 'admin', password: 'admin',
    permissions: ['dashboard', 'tables', 'pos', 'kitchen', 'cashier', 'inventory', 'menu', 'reports', 'users', 'settings']
  },
];
