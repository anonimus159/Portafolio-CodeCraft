import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Filter, AlertTriangle, Package, MoreHorizontal, X, Check, Download, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';

const INITIAL_INVENTORY = [
  { id: 'INV-001', item: 'Carne Angus',     category: 'Carnes',    stock: 45,  unit: 'unidades', status: 'low',      cost: 2500  },
  { id: 'INV-002', item: 'Pan Brioche',      category: 'Panadería', stock: 120, unit: 'unidades', status: 'optimal',  cost: 800   },
  { id: 'INV-003', item: 'Queso Cheddar',    category: 'Lácteos',   stock: 200, unit: 'tajadas',  status: 'optimal',  cost: 300   },
  { id: 'INV-004', item: 'Aceite de Trufa',  category: 'Despensa',  stock: 2,   unit: 'botellas', status: 'critical', cost: 45000 },
  { id: 'INV-005', item: 'Lechuga Romana',   category: 'Verduras',  stock: 15,  unit: 'kg',       status: 'low',      cost: 4000  },
  { id: 'INV-006', item: 'Sirope Coca Cola', category: 'Bebidas',   stock: 8,   unit: 'cajas',    status: 'optimal',  cost: 35000 },
];

const TABS = ['ingredientes', 'empaques', 'bebidas', 'limpieza'];

const STORAGE_KEY = 'fastpos_inventory';

const getStatus = (stock) => stock <= 5 ? 'critical' : stock <= 20 ? 'low' : 'optimal';

const InventoryModule = ({ settings = {}, inventory = [], setInventory }) => {
  const [activeTab, setActiveTab]   = useState('ingredientes');
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAdd, setShowAdd]       = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editId, setEditId]         = useState(null);


  // Helper to adjust stock by delta and auto-recalculate status
  const adjustStock = (id, delta) => {
    setInventory(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newStock = Math.max(0, i.stock + delta);
      return { ...i, stock: newStock, status: getStatus(newStock) };
    }));
  };

  // New item form state
  const [newItem, setNewItem] = useState({ item: '', category: 'Carnes', stock: '', unit: 'unidades', cost: '' });

  const filtered = useMemo(() => {
    return (inventory || []).filter(i => {
      const itemName = i.item || '';
      const itemId = i.id || '';
      const cat = (i.category || '').toLowerCase().trim();
      
      const matchSearch = itemName.toLowerCase().includes(search.toLowerCase()) || itemId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || i.status === filterStatus;
      
      let matchTab = false;
      
      if (activeTab === 'ingredientes') {
        matchTab = ['carnes', 'panadería', 'panaderia', 'lácteos', 'lacteos', 'despensa', 'verduras'].includes(cat);
      } else if (activeTab === 'bebidas') {
        matchTab = cat === 'bebidas';
      } else if (activeTab === 'empaques') {
        matchTab = cat === 'empaques';
      } else if (activeTab === 'limpieza') {
        matchTab = cat === 'limpieza';
      }
      
      return matchSearch && matchStatus && matchTab;
    });
  }, [inventory, search, filterStatus, activeTab]);

  const handleAddItem = () => {
    if (!newItem.item || !newItem.stock) return;
    const stock = parseInt(newItem.stock);
    const status = getStatus(stock);
    setInventory(prev => [...prev, {
      id: `INV-${String(prev.length + 1).padStart(3, '0')}`,
      ...newItem,
      stock,
      cost: parseInt(newItem.cost) || 0,
      status,
    }]);
    setNewItem({ item: '', category: 'Carnes', stock: '', unit: 'unidades', cost: '' });
    setShowAdd(false);
  };

  const handleDeleteItem = (id) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    setEditId(null);
  };

  const handleExport = () => {
    const csv = [
      'ID,Item,Categoría,Stock,Unidad,Costo',
      ...inventory.map(i => `${i.id || ''},${i.item || ''},${i.category || ''},${i.stock || 0},${i.unit || ''},${i.cost || 0}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'inventario.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 pt-6 h-full">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Valor Total en Inventario', value: formatCurrency((inventory || []).reduce((a,i)=>a+(Number(i.stock)||0)*(Number(i.cost)||0),0)), up: true },
          { label: 'Alertas de Stock Bajo', value: `${(inventory || []).filter(i=>i.status!=='optimal').length} Items`, up: false, alert: true },
          { label: 'Entregas Pendientes', value: '2 Pedidos', up: true },
        ].map((kpi, i) => (
          <div key={i} className="enterprise-card p-6">
            <div className="flex-between mb-2">
              <p className="text-sm text-text-tertiary font-semibold uppercase tracking-wider">{kpi.label}</p>
              {kpi.alert && <AlertTriangle size={16} className="text-danger" />}
            </div>
            <h3 className={`text-3xl font-bold tracking-tight mb-2 ${kpi.alert ? 'text-danger' : 'text-text-primary'}`}>{kpi.value}</h3>
            <div className={`text-xs font-medium ${kpi.up ? 'text-success' : 'text-warning'}`}>
              {i === 0 ? 'Actualizado ahora' : i === 1 ? 'Requiere Atención' : 'Llegan Hoy'}
            </div>
          </div>
        ))}
      </div>

      {/* Main Inventory Area */}
      <div className="flex-1 enterprise-card flex flex-col p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-subtle bg-bg-surface flex-between">
          <div className="flex items-center gap-4">
            <div className="command-bar m-0">
              <Search size={16} className="text-text-tertiary" />
              <input
                type="text"
                placeholder="Buscar ingredientes, SKUs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <button
                className={`btn btn-sm btn-secondary ${showFilter ? 'border-accent-primary text-accent-primary' : ''}`}
                onClick={() => setShowFilter(v => !v)}
              >
                <Filter size={14} /> Filtros
              </button>
              {showFilter && (
                <div className="absolute top-full mt-2 left-0 z-30 bg-bg-surface border border-border-light rounded-xl p-3 shadow-xl space-y-2 min-w-[160px]">
                  {[['all','Todos'], ['optimal','Óptimo'], ['low','Bajo'], ['critical','Crítico']].map(([v,l]) => (
                    <button
                      key={v}
                      onClick={() => { setFilterStatus(v); setShowFilter(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus===v ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-secondary hover:bg-white/5'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-secondary" onClick={handleExport}>
              <Download size={14} /> Exportar CSV
            </button>
            <button className="btn btn-sm btn-primary" onClick={() => setShowAdd(true)}>
              <Plus size={14} /> Agregar Item
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-6 border-b border-border-subtle bg-bg-base pt-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab ? 'border-accent-primary text-text-primary' : 'border-transparent text-text-tertiary hover:text-text-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-bg-base">
          <table className="w-full text-left border-collapse">
            <thead className="bg-bg-surface sticky top-0 z-10 shadow-sm">
              <tr>
                {['SKU / ID','Nombre del Item','Categoría','Nivel de Stock','Costo Unitario','Acciones'].map(h => (
                  <th key={h} className="p-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider border-b border-border-light">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-border-subtle hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-sm font-mono text-text-secondary">{item.id}</td>
                  <td className="p-4 text-sm font-bold text-text-primary">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex-center">
                        <Package size={14} className="text-text-tertiary" />
                      </div>
                      {item.item}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">{item.category}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-bg-base rounded-lg border border-border-light p-0.5">
                        <button
                          onClick={() => adjustStock(item.id, -1)}
                          className="w-7 h-7 flex-center rounded hover:bg-white/10 text-text-secondary transition-colors"
                          title="Reducir stock"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-mono font-bold w-10 text-center">{item.stock}</span>
                        <button
                          onClick={() => adjustStock(item.id, +1)}
                          className="w-7 h-7 flex-center rounded hover:bg-white/10 text-text-secondary transition-colors"
                          title="Aumentar stock"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-xs text-text-tertiary">{item.unit}</span>
                      <span className={`badge ${item.status === 'critical' ? 'badge-danger' : item.status === 'low' ? 'badge-warning' : 'badge-success'}`}>
                        {item.status === 'critical' ? 'Crítico' : item.status === 'low' ? 'Bajo' : 'Óptimo'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-mono">{formatCurrency(item.cost)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditId(editId === item.id ? null : item.id)}
                        className="text-text-tertiary hover:text-white p-1 rounded hover:bg-white/10"
                        title="Opciones"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {editId === item.id && (
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-danger hover:text-white p-1 rounded hover:bg-danger/20 text-xs font-bold"
                          title="Eliminar"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-text-tertiary text-sm">No se encontraron items</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex-center"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="enterprise-card w-full max-w-md p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex-between mb-6">
                <h3 className="text-xl font-bold">Agregar Item</h3>
                <button onClick={() => setShowAdd(false)} className="text-text-tertiary hover:text-white p-1"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Nombre', key: 'item', type: 'text', placeholder: 'Ej: Carne Angus' },
                  { label: 'Stock Inicial', key: 'stock', type: 'number', placeholder: '0' },
                  { label: 'Costo Unitario ($)', key: 'cost', type: 'number', placeholder: '0' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs text-text-tertiary font-semibold uppercase tracking-wider mb-2 block">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={newItem[field.key]}
                      onChange={e => setNewItem(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full bg-bg-base border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-text-tertiary font-semibold uppercase tracking-wider mb-2 block">Categoría</label>
                  <select
                    value={newItem.category}
                    onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-bg-base border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-primary"
                  >
                    {['Carnes', 'Panadería', 'Lácteos', 'Despensa', 'Verduras', 'Bebidas', 'Empaques', 'Limpieza'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-tertiary font-semibold uppercase tracking-wider mb-2 block">Unidad</label>
                  <select
                    value={newItem.unit}
                    onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
                    className="w-full bg-bg-base border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-primary"
                  >
                    {['unidades','kg','g','litros','cajas','botellas','tajadas'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAdd(false)} className="btn btn-secondary flex-1">Cancelar</button>
                <button onClick={handleAddItem} className="btn btn-primary flex-1">
                  <Check size={16} /> Agregar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryModule;
