import React, { useState, useMemo } from 'react';
import { Truck, Search, Plus, Trash2, Phone, Mail, MapPin, ChevronRight, X, Check, FileText, DollarSign, Calendar, TrendingUp, AlertCircle, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';

const SuppliersModule = ({ inventory = [], setInventory }) => {
  const [activeTab, setActiveTab] = useState('suppliers'); // suppliers | purchases
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('fastpos_suppliers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Distribuidora Carnica S.A.', phone: '310 111 2222', contact: 'Roberto', category: 'Carnes' },
      { id: 2, name: 'Panificadora Central', phone: '320 444 5555', contact: 'Lucia', category: 'Panadería' }
    ];
  });

  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem('fastpos_purchases');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchaseForm, setPurchaseForm] = useState({
    supplierId: '',
    date: new Date().toISOString().split('T')[0],
    items: [], // { ingredientId, name, quantity, cost }
    total: 0,
    status: 'paid'
  });

  const [newPurchaseItem, setNewPurchaseItem] = useState({ ingredientId: '', quantity: '', cost: '' });

  // Persistence
  React.useEffect(() => {
    localStorage.setItem('fastpos_suppliers', JSON.stringify(suppliers));
    localStorage.setItem('fastpos_purchases', JSON.stringify(purchases));
  }, [suppliers, purchases]);

  const handleAddPurchase = () => {
    if (!purchaseForm.supplierId || purchaseForm.items.length === 0) return;
    
    const newPurchase = { ...purchaseForm, id: `PUR-${Date.now()}` };
    setPurchases([newPurchase, ...purchases]);
    
    // Update inventory stock and costs
    setInventory(prev => prev.map(inv => {
      const pItem = purchaseForm.items.find(i => i.ingredientId === inv.id);
      if (pItem) {
        return { 
          ...inv, 
          stock: inv.stock + parseFloat(pItem.quantity),
          cost: parseFloat(pItem.cost) // Update cost based on last purchase
        };
      }
      return inv;
    }));

    resetPurchaseForm();
  };

  const resetPurchaseForm = () => {
    setPurchaseForm({ supplierId: '', date: new Date().toISOString().split('T')[0], items: [], total: 0, status: 'paid' });
    setNewPurchaseItem({ ingredientId: '', quantity: '', cost: '' });
    setShowAddPurchase(false);
  };

  return (
    <div className="flex flex-col gap-6 pt-6 h-full">
      {/* Header Tabs */}
      <div className="flex-between flex-wrap gap-4">
        <div className="flex gap-1 bg-bg-surface p-1 rounded-xl border border-white/5">
          {['suppliers', 'purchases'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                activeTab === tab ? 'bg-accent-primary text-white shadow-glow' : 'text-text-tertiary hover:text-white'
              }`}
            >
              {tab === 'suppliers' ? 'Proveedores' : 'Facturas de Compra'}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => activeTab === 'suppliers' ? setShowAddSupplier(true) : setShowAddPurchase(true)} 
          className="btn btn-primary shadow-glow gap-2"
        >
          <Plus size={16} /> {activeTab === 'suppliers' ? 'Nuevo Proveedor' : 'Registrar Compra'}
        </button>
      </div>

      {activeTab === 'suppliers' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="enterprise-card p-6 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex-center text-accent-secondary"><Truck size={24}/></div>
                <div className="flex-1">
                  <h3 className="font-bold">{s.name}</h3>
                  <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">{s.category}</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-text-tertiary"><Phone size={12}/> {s.phone}</div>
                <div className="flex items-center gap-2 text-xs text-text-tertiary"><Check size={12} className="text-success"/> Contacto: {s.contact}</div>
              </div>
              <button className="w-full btn btn-secondary btn-sm opacity-50 cursor-not-allowed">Ver Estado de Cuenta</button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 scroll-hide">
          <div className="enterprise-card p-0 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-base text-[10px] font-black uppercase tracking-widest text-text-tertiary border-b border-white/5">
                  <th className="px-6 py-4">ID Factura</th>
                  <th className="px-6 py-4">Proveedor</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {purchases.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 text-xs font-black mono-font text-accent-primary">{p.id}</td>
                    <td className="px-6 py-4 text-xs font-bold">{suppliers.find(s=>s.id == p.supplierId)?.name || 'Desconocido'}</td>
                    <td className="px-6 py-4 text-xs text-text-tertiary">{p.date}</td>
                    <td className="px-6 py-4 text-xs text-text-secondary">{p.items.length} insumos</td>
                    <td className="px-6 py-4 text-right text-sm font-black mono-font text-white">{formatCurrency(p.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {purchases.length === 0 && (
              <div className="py-20 text-center opacity-30">
                <FileText size={48} className="mx-auto mb-4" />
                <p>No hay facturas de compra registradas aún.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Purchase Modal */}
      <AnimatePresence>
        {showAddPurchase && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex-center bg-black/60 backdrop-blur-md p-4"
            onClick={resetPurchaseForm}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-surface border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/5 bg-bg-base/50 flex-between">
                <h3 className="text-xl font-bold">Registrar Compra / Factura</h3>
                <button onClick={resetPurchaseForm} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-8 space-y-6 overflow-y-auto flex-1 scroll-hide">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase">Proveedor</label>
                    <select value={purchaseForm.supplierId} onChange={e => setPurchaseForm({...purchaseForm, supplierId: e.target.value})}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm">
                      <option value="" className="bg-bg-base text-white">Seleccionar...</option>
                      {suppliers.map(s => <option key={s.id} value={s.id} className="bg-bg-base text-white">{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase">Fecha de Factura</label>
                    <input type="date" value={purchaseForm.date} onChange={e => setPurchaseForm({...purchaseForm, date: e.target.value})}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] text-accent-primary font-bold uppercase tracking-widest block">Añadir Insumos al Inventario</label>
                  <div className="flex gap-2">
                    <select 
                      value={newPurchaseItem.ingredientId}
                      onChange={e => setNewPurchaseItem({...newPurchaseItem, ingredientId: e.target.value})}
                      className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                    >
                      <option value="" className="bg-bg-base text-white">Elegir insumo...</option>
                      {inventory.map(inv => <option key={inv.id} value={inv.id} className="bg-bg-base text-white">{inv.item} ({inv.unit})</option>)}
                    </select>
                    <input type="number" placeholder="Cant." value={newPurchaseItem.quantity} onChange={e => setNewPurchaseItem({...newPurchaseItem, quantity: e.target.value})}
                      className="w-20 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white mono-font" />
                    <input type="number" placeholder="$ Costo Unit." value={newPurchaseItem.cost} onChange={e => setNewPurchaseItem({...newPurchaseItem, cost: e.target.value})}
                      className="w-28 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white mono-font" />
                    <button 
                      onClick={() => {
                        if (!newPurchaseItem.ingredientId || !newPurchaseItem.quantity || !newPurchaseItem.cost) return;
                        const inv = inventory.find(i => i.id === newPurchaseItem.ingredientId);
                        const newItem = { ...newPurchaseItem, name: inv.item };
                        const newItems = [...purchaseForm.items, newItem];
                        setPurchaseForm({ 
                          ...purchaseForm, 
                          items: newItems,
                          total: newItems.reduce((acc, i) => acc + (parseFloat(i.quantity) * parseFloat(i.cost)), 0)
                        });
                        setNewPurchaseItem({ ingredientId: '', quantity: '', cost: '' });
                      }}
                      className="w-11 h-11 rounded-xl bg-accent-primary text-white flex-center hover:shadow-glow"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {purchaseForm.items.map((item, idx) => (
                    <div key={idx} className="flex-between p-3 bg-white/5 border border-white/5 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        <span className="text-[10px] text-text-tertiary">{item.quantity} unidades x {formatCurrency(item.cost)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black mono-font text-accent-primary">{formatCurrency(item.quantity * item.cost)}</span>
                        <button onClick={() => {
                          const newItems = purchaseForm.items.filter((_, i) => i !== idx);
                          setPurchaseForm({ ...purchaseForm, items: newItems, total: newItems.reduce((acc, i) => acc + (parseFloat(i.quantity) * parseFloat(i.cost)), 0) });
                        }} className="text-text-tertiary hover:text-danger"><X size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-bg-base/80 border-t border-white/10 flex-between">
                <div>
                  <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Total de Compra</p>
                  <p className="text-2xl font-black text-white mono-font">{formatCurrency(purchaseForm.total)}</p>
                </div>
                <button onClick={handleAddPurchase} className="btn btn-accent px-10 h-14 shadow-glow gap-2">
                  <Check size={20} /> Confirmar Factura
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuppliersModule;
