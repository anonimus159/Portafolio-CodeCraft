import React, { useState, useMemo } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Phone, MapPin, Mail, ChevronRight, X, Check, Star, ShoppingBag, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomersModule = ({ customers = [], setCustomers }) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    notes: ''
  });

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
  }, [customers, search]);

  const handleAddCustomer = () => {
    if (!customerForm.name || !customerForm.phone) return;
    const newCustomer = {
      ...customerForm,
      id: Date.now(),
      totalSpent: 0,
      orderCount: 0,
      lastVisit: new Date().toISOString()
    };
    setCustomers([newCustomer, ...customers]);
    resetForm();
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer.id);
    setCustomerForm({ ...customer });
    setShowAddModal(true);
  };

  const handleSaveEdit = () => {
    setCustomers(customers.map(c => c.id === editingCustomer ? { ...customerForm } : c));
    resetForm();
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const resetForm = () => {
    setCustomerForm({ name: '', phone: '', address: '', email: '', notes: '' });
    setEditingCustomer(null);
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-6 pt-6 h-full">
      {/* Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold">Gestión de Clientes (CRM)</h2>
          <p className="text-xs text-text-tertiary mt-1">Administra la base de datos de clientes frecuentes y domicilios</p>
        </div>

        <div className="flex gap-3">
          <div className="command-bar m-0 w-[280px]">
            <Search size={16} className="text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o teléfono..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary shadow-glow gap-2">
            <Plus size={16} /> Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-2 scroll-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredCustomers.map((customer, i) => (
              <motion.div
                key={customer.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                className="enterprise-card p-6 flex flex-col group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                  <button onClick={() => handleEditCustomer(customer)} className="w-8 h-8 rounded-lg bg-white/10 flex-center text-text-tertiary hover:text-white hover:bg-white/20">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteCustomer(customer.id)} className="w-8 h-8 rounded-lg bg-danger/10 flex-center text-danger hover:bg-danger/20">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 flex-center text-accent-primary text-xl font-black">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg truncate w-40">{customer.name}</h3>
                    <p className="text-xs text-text-tertiary flex items-center gap-1">
                      <Phone size={10} /> {customer.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {customer.address && (
                    <div className="flex items-start gap-2 text-xs text-text-tertiary">
                      <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{customer.address}</span>
                    </div>
                  )}
                  {customer.email && (
                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                      <Mail size={12} className="flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Pedidos</p>
                    <p className="text-xs font-black text-white">{customer.orderCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Puntos</p>
                    <p className="text-xs font-black text-success">{customer.points || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Total</p>
                    <p className="text-xs font-black text-accent-primary mono-font">${(customer.totalSpent || 0).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex-center bg-black/60 backdrop-blur-md p-4"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-surface border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/5 flex-between bg-bg-base/50">
                <h3 className="text-xl font-bold">{editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                <button onClick={resetForm} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Nombre Completo</label>
                    <input type="text" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm" placeholder="Juan Perez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Teléfono / WhatsApp</label>
                    <input type="text" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm mono-font" placeholder="300 000 0000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Dirección Principal (Domicilios)</label>
                  <input type="text" value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})}
                    className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm" placeholder="Calle 123 #45-67, Edificio X" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Correo Electrónico (Opcional)</label>
                  <input type="email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})}
                    className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm" placeholder="cliente@ejemplo.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Notas / Preferencias</label>
                  <textarea value={customerForm.notes} onChange={e => setCustomerForm({...customerForm, notes: e.target.value})}
                    className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm h-24 resize-none" placeholder="Alergias, gustos, etc." />
                </div>

                <div className="pt-6 flex gap-4">
                  <button onClick={resetForm} className="btn btn-secondary flex-1">Cancelar</button>
                  <button onClick={editingCustomer ? handleSaveEdit : handleAddCustomer} className="btn btn-accent flex-1 shadow-glow gap-2">
                    <Check size={18} /> {editingCustomer ? 'Guardar Cambios' : 'Registrar Cliente'}
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

export default CustomersModule;
