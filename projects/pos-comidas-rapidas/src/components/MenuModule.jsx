import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, Check, X, Tag, Map, Utensils, Users, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MenuModule = ({ products, setProducts, categories, setCategories, tables = [], setTables, onOpenModal, onCloseModal, inventory = [] }) => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'tables'
  const [productModalTab, setProductModalTab] = useState('general'); // 'general' | 'variants' | 'recipe'
  const [search, setSearch] = useState('');
  
  // Product state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: categories[0]?.id || '',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    favorite: false,
    variants: [],
    modifiers: [],
    recipe: []
  });

  const [newRecipeIng, setNewRecipeIng] = useState({ ingredientId: '', amount: '' });

  const [newVar, setNewVar] = useState({ name: '', price: '' });
  const [newMod, setNewMod] = useState({ name: '', price: '' });

  // Table state
  const [showAddTable, setShowAddTable] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [tableForm, setTableForm] = useState({
    id: '',
    name: '',
    capacity: 4,
    zone: 'indoor',
    status: 'free'
  });

  /* ── Product Handlers ─────────────────────────── */
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.price) return;
    const newProduct = {
      ...productForm,
      id: Date.now(),
      price: parseInt(productForm.price)
    };
    setProducts([...products, newProduct]);
    resetProductForm();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setProductForm({ ...product });
    setShowAddProduct(true);
  };

  const handleSaveEditProduct = () => {
    setProducts(products.map(p => p.id === editingProduct ? { ...productForm, price: parseInt(productForm.price) } : p));
    resetProductForm();
  };

  const handleDeleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (onOpenModal) {
      onOpenModal({
        title: 'Eliminar Producto',
        message: `¿Estás seguro de eliminar "${product?.name}"? Esta acción es permanente.`,
        type: 'danger',
        requirePin: true,
        onConfirm: () => {
          setProducts(products.filter(p => p.id !== id));
          onCloseModal();
        }
      });
    } else if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      category: categories[0]?.id || '',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
      favorite: false,
      variants: [],
      modifiers: []
    });
    setNewVar({ name: '', price: '' });
    setNewMod({ name: '', price: '' });
    setNewRecipeIng({ ingredientId: '', amount: '' });
    setEditingProduct(null);
    setShowAddProduct(false);
    setProductModalTab('general');
  };

  /* ── Table Handlers ───────────────────────────── */
  const filteredTables = tables.filter(t => 
    String(t.id).toLowerCase().includes(search.toLowerCase()) ||
    t.zone.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTable = () => {
    if (!tableForm.id) return;
    const newTable = {
      ...tableForm,
      id: parseInt(tableForm.id)
    };
    setTables([...tables, newTable]);
    resetTableForm();
  };

  const handleEditTable = (table) => {
    setEditingTable(table.id);
    setTableForm({ ...table });
    setShowAddTable(true);
  };

  const handleSaveEditTable = () => {
    setTables(tables.map(t => t.id === editingTable ? { ...tableForm, id: parseInt(tableForm.id) } : t));
    resetTableForm();
  };

  const handleDeleteTable = (id) => {
    if (onOpenModal) {
      onOpenModal({
        title: 'Eliminar Mesa',
        message: `¿Estás seguro de eliminar la Mesa ${id}?`,
        type: 'danger',
        requirePin: true,
        onConfirm: () => {
          setTables(tables.filter(t => t.id !== id));
          onCloseModal();
        }
      });
    } else if (window.confirm('¿Estás seguro de eliminar esta mesa?')) {
      setTables(tables.filter(t => t.id !== id));
    }
  };

  const resetTableForm = () => {
    setTableForm({
      id: '',
      name: '',
      capacity: 4,
      zone: 'indoor',
      status: 'free'
    });
    setEditingTable(null);
    setShowAddTable(false);
  };

  return (
    <div className="flex flex-col gap-6 pt-6 h-full">
      {/* Header with Tabs */}
      <div className="flex-between flex-wrap gap-4">
        <div className="flex gap-1 bg-bg-surface p-1 rounded-xl border border-border-light">
          <button
            onClick={() => { setActiveTab('products'); setSearch(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'products' ? 'bg-accent-primary text-white shadow-glow' : 'text-text-tertiary hover:text-white'
            }`}
          >
            <Utensils size={16} /> Productos
          </button>
          <button
            onClick={() => { setActiveTab('tables'); setSearch(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'tables' ? 'bg-accent-primary text-white shadow-glow' : 'text-text-tertiary hover:text-white'
            }`}
          >
            <Map size={16} /> Mesas / Salón
          </button>
        </div>

        <div className="flex gap-3">
          <div className="command-bar m-0 w-[250px]">
            <Search size={16} className="text-text-tertiary" />
            <input
              type="text"
              placeholder={activeTab === 'products' ? "Buscar productos..." : "Buscar mesas..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => activeTab === 'products' ? setShowAddProduct(true) : setShowAddTable(true)}
          >
            <Plus size={16} /> {activeTab === 'products' ? 'Agregar Producto' : 'Nueva Mesa'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 scroll-hide">
        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="enterprise-card p-0 overflow-hidden group relative"
                >
                  <div className="h-40 w-full relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex-center gap-3">
                      <button onClick={() => handleEditProduct(product)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex-center text-white hover:bg-white/40 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="w-10 h-10 rounded-full bg-danger/20 backdrop-blur-md flex-center text-white hover:bg-danger/40 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-text-primary mb-1">{product.name}</h3>
                    <p className="text-lg font-black text-accent-primary mono-font">${product.price.toLocaleString('es-CO')}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <AnimatePresence>
              {filteredTables.map(table => (
                <motion.div
                  layout
                  key={table.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="enterprise-card p-6 flex flex-col items-center gap-2 group relative text-center"
                >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => handleEditTable(table)} className="text-text-tertiary hover:text-accent-primary p-1"><Edit2 size={14}/></button>
                    <button onClick={() => handleDeleteTable(table.id)} className="text-text-tertiary hover:text-danger p-1"><Trash2 size={14}/></button>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex-center text-text-tertiary mb-2">
                    <Map size={24} />
                  </div>
                  <h3 className="text-lg font-black mono-font">Mesa {table.id}</h3>
                  <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest">{table.zone}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Users size={12} className="text-text-tertiary" />
                    <span className="text-xs font-bold">{table.capacity}</span>
                  </div>
                </motion.div>
              ))}
              
              {/* Quick Add Table Card */}
              <motion.div
                layout
                onClick={() => setShowAddTable(true)}
                className="enterprise-card p-6 flex flex-col items-center justify-center gap-3 border-dashed border-white/10 hover:border-accent-primary/50 hover:bg-accent-primary/5 cursor-pointer transition-all group min-h-[160px]"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex-center text-text-tertiary group-hover:text-accent-primary group-hover:bg-accent-primary/10 transition-all">
                  <Plus size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-secondary group-hover:text-white">Nueva Mesa</p>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-tighter">Click para agregar</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex-center p-6"
            onClick={resetProductForm}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="enterprise-card w-full max-w-2xl p-0 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border-subtle flex-between bg-bg-surface">
                <h3 className="text-xl font-bold">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <button onClick={resetProductForm} className="text-text-tertiary hover:text-white p-1"><X size={20} /></button>
              </div>
              <div className="px-6 border-b border-border-subtle flex gap-6 bg-bg-surface">
                {['general', 'variants', 'recipe'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setProductModalTab(tab)}
                    className={`py-4 px-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                      productModalTab === tab ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-tertiary hover:text-white'
                    }`}
                  >
                    {tab === 'general' ? 'Información' : tab === 'variants' ? 'Variantes / Extras' : 'Receta / Insumos'}
                  </button>
                ))}
              </div>
              
              <div className="p-8 space-y-6">
                {productModalTab === 'general' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-text-tertiary font-bold uppercase">Nombre del Plato</label>
                        <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})}
                          className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm" placeholder="Ej: Hamb. Especial" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-text-tertiary font-bold uppercase">Precio Base ($)</label>
                        <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})}
                          className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm mono-font" placeholder="0" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-text-tertiary font-bold uppercase">Categoría</label>
                        <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}
                          className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm">
                          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-text-tertiary font-bold uppercase">Imagen URL</label>
                        <input type="text" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})}
                          className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {productModalTab === 'variants' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] text-accent-primary font-bold uppercase tracking-widest block">Variantes (Tamaños/Tipos)</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Nombre" value={newVar.name} onChange={e => setNewVar({...newVar, name: e.target.value})} className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none" />
                        <input type="number" placeholder="$" value={newVar.price} onChange={e => setNewVar({...newVar, price: e.target.value})} className="w-20 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white mono-font outline-none" />
                        <button onClick={() => {
                          if(!newVar.name || !newVar.price) return;
                          setProductForm({...productForm, variants: [...(productForm.variants || []), { id: `v-${Date.now()}`, ...newVar, price: parseInt(newVar.price) }]});
                          setNewVar({ name: '', price: '' });
                        }} className="w-9 h-9 rounded-lg bg-accent-primary text-white flex-center hover:shadow-glow transition-all"><Plus size={16}/></button>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-hide">
                        {productForm.variants?.map((v, idx) => (
                          <div key={idx} className="flex-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                            <span className="text-xs font-medium text-text-secondary">{v.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] mono-font text-text-tertiary">${v.price.toLocaleString()}</span>
                              <button onClick={() => setProductForm({...productForm, variants: productForm.variants.filter((_, i) => i !== idx)})} className="p-1 text-text-tertiary hover:text-danger transition-colors"><X size={14}/></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] text-accent-primary font-bold uppercase tracking-widest block">Modificadores (Extras)</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Nombre" value={newMod.name} onChange={e => setNewMod({...newMod, name: e.target.value})} className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none" />
                        <input type="number" placeholder="$" value={newMod.price} onChange={e => setNewMod({...newMod, price: e.target.value})} className="w-20 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white mono-font outline-none" />
                        <button onClick={() => {
                          if(!newMod.name) return;
                          setProductForm({...productForm, modifiers: [...(productForm.modifiers || []), { id: `m-${Date.now()}`, ...newMod, price: parseInt(newMod.price || 0) }]});
                          setNewMod({ name: '', price: '' });
                        }} className="w-9 h-9 rounded-lg bg-accent-primary text-white flex-center hover:shadow-glow transition-all"><Plus size={16}/></button>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-hide">
                        {productForm.modifiers?.map((m, idx) => (
                          <div key={idx} className="flex-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                            <span className="text-xs font-medium text-text-secondary">{m.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] mono-font text-text-tertiary">{m.price > 0 ? `+$${m.price.toLocaleString()}` : 'Gratis'}</span>
                              <button onClick={() => setProductForm({...productForm, modifiers: productForm.modifiers.filter((_, i) => i !== idx)})} className="text-text-tertiary hover:text-danger transition-colors"><X size={14}/></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {productModalTab === 'recipe' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-accent-primary/5 border border-accent-primary/10 rounded-2xl flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent-primary/20 flex-center text-accent-primary flex-shrink-0">
                        <Tag size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-accent-primary">Control de Insumos Automático</p>
                        <p className="text-[10px] text-text-tertiary leading-relaxed mt-1">
                          Define qué ingredientes consume este plato. Cada vez que se complete una venta, el stock de estos insumos se descontará automáticamente.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <select 
                        value={newRecipeIng.ingredientId} 
                        onChange={e => setNewRecipeIng({...newRecipeIng, ingredientId: e.target.value})}
                        className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                      >
                        <option value="">Seleccionar Insumo...</option>
                        {inventory.map(ing => (
                          <option key={ing.id} value={ing.id}>{ing.item} ({ing.unit})</option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        placeholder="Cant." 
                        value={newRecipeIng.amount} 
                        onChange={e => setNewRecipeIng({...newRecipeIng, amount: e.target.value})}
                        className="w-24 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white mono-font outline-none" 
                      />
                      <button 
                        onClick={() => {
                          if (!newRecipeIng.ingredientId || !newRecipeIng.amount) return;
                          const ing = inventory.find(i => i.id === newRecipeIng.ingredientId);
                          setProductForm({
                            ...productForm, 
                            recipe: [...(productForm.recipe || []), { 
                              ingredientId: ing.id, 
                              name: ing.item, 
                              amount: parseFloat(newRecipeIng.amount), 
                              unit: ing.unit 
                            }]
                          });
                          setNewRecipeIng({ ingredientId: '', amount: '' });
                        }}
                        className="w-11 h-11 rounded-xl bg-accent-primary text-white flex-center hover:shadow-glow transition-all"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-hide">
                      {productForm.recipe?.map((ing, idx) => (
                        <div key={idx} className="flex-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex-center text-text-tertiary">
                              <Box size={14} />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-text-secondary">{ing.name}</span>
                              <p className="text-[10px] text-text-tertiary">Insumo de inventario</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-black mono-font text-accent-primary">{ing.amount} {ing.unit}</span>
                            <button onClick={() => setProductForm({...productForm, recipe: productForm.recipe.filter((_, i) => i !== idx)})} className="p-1.5 text-text-tertiary hover:text-danger opacity-0 group-hover:opacity-100 transition-all">
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!productForm.recipe || productForm.recipe.length === 0) && (
                        <div className="text-center py-10 opacity-30">
                          <p className="text-xs italic">No hay insumos vinculados a este plato.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6 border-t border-white/5">
                  <button onClick={resetProductForm} className="btn btn-secondary flex-1">Cancelar</button>
                  <button onClick={editingProduct ? handleSaveEditProduct : handleAddProduct} className="btn btn-accent flex-1 shadow-glow">
                    <Check size={16} /> {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Modal */}
      <AnimatePresence>
        {showAddTable && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex-center p-6"
            onClick={resetTableForm}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="enterprise-card w-full max-w-md p-0 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border-subtle flex-between bg-bg-surface">
                <h3 className="text-xl font-bold">{editingTable ? 'Editar Mesa' : 'Nueva Mesa'}</h3>
                <button onClick={resetTableForm} className="text-text-tertiary hover:text-white p-1"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase">Número de Mesa</label>
                    <input type="number" value={tableForm.id} onChange={e => setTableForm({...tableForm, id: e.target.value})}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm mono-font" placeholder="Ej: 15" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase">Capacidad (Pax)</label>
                    <input type="number" value={tableForm.capacity} onChange={e => setTableForm({...tableForm, capacity: parseInt(e.target.value)})}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm mono-font" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase">Zona / Ubicación</label>
                  <select value={tableForm.zone} onChange={e => setTableForm({...tableForm, zone: e.target.value})}
                    className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm">
                    <option value="indoor">Comedor Principal</option>
                    <option value="patio">Patio Exterior</option>
                    <option value="bar">Bar</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={resetTableForm} className="btn btn-secondary flex-1">Cancelar</button>
                  <button onClick={editingTable ? handleSaveEditTable : handleAddTable} className="btn btn-accent flex-1 shadow-glow">
                    <Check size={16} /> {editingTable ? 'Guardar Cambios' : 'Crear Mesa'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuModule;
