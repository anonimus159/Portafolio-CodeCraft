import React, { useState } from 'react';
import { Tag, Plus, Trash2, Calendar, Clock, Percent, DollarSign, Check, X, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PromotionsModule = ({ promotions = [], setPromotions }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [promoForm, setPromoForm] = useState({
    name: '',
    type: 'percentage', // percentage, fixed, 2x1
    value: '',
    minPurchase: '0',
    active: true,
    days: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'],
    code: ''
  });

  const handleAddPromo = () => {
    if (!promoForm.name) return;
    setPromotions([...promotions, { ...promoForm, id: Date.now() }]);
    resetForm();
  };

  const toggleDay = (day) => {
    const newDays = promoForm.days.includes(day)
      ? promoForm.days.filter(d => d !== day)
      : [...promoForm.days, day];
    setPromoForm({ ...promoForm, days: newDays });
  };

  const resetForm = () => {
    setPromoForm({
      name: '', type: 'percentage', value: '', minPurchase: '0', active: true,
      days: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'], code: ''
    });
    setShowAddModal(false);
  };

  const deletePromo = (id) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 pt-6 h-full">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h2 className="text-xl font-bold">Promociones y Ofertas</h2>
          <p className="text-xs text-text-tertiary mt-1">Configura descuentos automáticos y campañas de marketing</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary shadow-glow gap-2">
          <Plus size={16} /> Nueva Promoción
        </button>
      </div>

      {/* Promo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo, i) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`enterprise-card p-6 border-l-4 ${promo.active ? 'border-accent-primary' : 'border-text-tertiary opacity-60'}`}
          >
            <div className="flex-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex-center ${promo.active ? 'bg-accent-primary/10 text-accent-primary' : 'bg-white/5 text-text-tertiary'}`}>
                {promo.type === 'percentage' ? <Percent size={20} /> : promo.type === 'fixed' ? <DollarSign size={20} /> : <Zap size={20} />}
              </div>
              <button onClick={() => deletePromo(promo.id)} className="p-2 text-text-tertiary hover:text-danger transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            <h3 className="font-bold text-lg mb-1">{promo.name}</h3>
            <p className="text-xs text-text-tertiary mb-4">
              {promo.type === 'percentage' ? `${promo.value}% de descuento` : promo.type === 'fixed' ? `$${promo.value} de descuento` : 'Promoción 2x1'}
              {promo.minPurchase > 0 && ` en compras mayores a $${parseInt(promo.minPurchase).toLocaleString()}`}
            </p>

            <div className="flex flex-wrap gap-1 mb-6">
              {['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'].map(d => (
                <span key={d} className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${promo.days.includes(d) ? 'bg-accent-primary/20 text-accent-primary' : 'bg-white/5 text-text-tertiary'}`}>
                  {d}
                </span>
              ))}
            </div>

            <div className="flex-between pt-4 border-t border-white/5">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${promo.active ? 'text-success' : 'text-text-tertiary'}`}>
                {promo.active ? 'Activa ahora' : 'Pausada'}
              </span>
              {promo.code && (
                <span className="bg-bg-base border border-dashed border-accent-primary/30 px-3 py-1 rounded text-xs font-black text-accent-primary mono-font">
                  {promo.code}
                </span>
              )}
            </div>
          </motion.div>
        ))}
        {promotions.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-30">
            <Tag size={48} className="mx-auto mb-4" />
            <p>No hay promociones activas. Crea una para incentivar las ventas.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
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
                <div className="flex items-center gap-3">
                  <Sparkles className="text-accent-primary" size={20} />
                  <h3 className="text-xl font-bold">Configurar Promoción</h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase">Nombre de la Campaña</label>
                  <input type="text" value={promoForm.name} onChange={e => setPromoForm({...promoForm, name: e.target.value})}
                    className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm" placeholder="Ej: Martes de Locura" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase">Tipo de Descuento</label>
                    <select value={promoForm.type} onChange={e => setPromoForm({...promoForm, type: e.target.value})}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm">
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Valor Fijo ($)</option>
                      <option value="2x1">Promoción 2x1</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase">Valor del Descuento</label>
                    <input type="number" value={promoForm.value} onChange={e => setPromoForm({...promoForm, value: e.target.value})}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm mono-font" placeholder="Ej: 10" disabled={promoForm.type === '2x1'} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase">Compra Mínima ($)</label>
                    <input type="number" value={promoForm.minPurchase} onChange={e => setPromoForm({...promoForm, minPurchase: e.target.value})}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm mono-font" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase">Código Cupón (Opcional)</label>
                    <input type="text" value={promoForm.code} onChange={e => setPromoForm({...promoForm, code: e.target.value})}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm uppercase font-black" placeholder="PROMO10" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase">Días de Aplicación</label>
                  <div className="flex gap-2">
                    {['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'].map(d => (
                      <button
                        key={d}
                        onClick={() => toggleDay(d)}
                        className={`flex-1 h-10 rounded-lg text-[10px] font-black uppercase transition-all ${
                          promoForm.days.includes(d) ? 'bg-accent-primary text-white shadow-glow' : 'bg-white/5 text-text-tertiary border border-white/5'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button onClick={resetForm} className="btn btn-secondary flex-1">Cancelar</button>
                  <button onClick={handleAddPromo} className="btn btn-accent flex-1 shadow-glow gap-2">
                    <Check size={18} /> Crear Promoción
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

export default PromotionsModule;
