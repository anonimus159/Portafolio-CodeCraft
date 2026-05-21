import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { formatCurrency } from '../utils/format';

const ProductCustomizer = ({ product, onConfirm, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const toggleModifier = (mod) => {
    setSelectedModifiers(prev => 
      prev.find(m => m.id === mod.id)
        ? prev.filter(m => m.id !== mod.id)
        : [...prev, mod]
    );
  };

  const totalPrice = (
    (selectedVariant ? selectedVariant.price : product.price) + 
    selectedModifiers.reduce((sum, m) => sum + m.price, 0)
  );

  const handleConfirm = () => {
    const customizedProduct = {
      ...product,
      price: totalPrice, // Unit price including options
      selectedVariant,
      selectedModifiers,
      quantity,
      displayName: `${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''}`,
      optionsSummary: selectedModifiers.map(m => m.name).join(', ')
    };
    onConfirm(customizedProduct);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-bg-surface border border-border-light rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex h-[500px]">
          {/* Left: Product Info */}
          <div className="w-1/3 bg-bg-base border-r border-border-light p-6 flex flex-col">
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-white/5">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-xs text-text-tertiary mb-auto">{product.description || 'Personaliza tu pedido a tu gusto.'}</p>
            
            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] text-text-tertiary font-bold uppercase mb-1">Precio Unitario</p>
              <p className="text-2xl font-black text-accent-primary mono-font">{formatCurrency(totalPrice)}</p>
            </div>
          </div>

          {/* Right: Customization Options */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-between p-6 border-b border-border-light">
              <h4 className="font-bold">Personalizar</h4>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-hide">
              {/* Variants (Sizes/Types) */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mb-4 block">Selecciona una Opción</label>
                  <div className="grid grid-cols-1 gap-2">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex-between p-4 rounded-xl border transition-all ${
                          selectedVariant?.id === v.id 
                            ? 'bg-accent-primary/10 border-accent-primary text-white' 
                            : 'bg-black/20 border-white/5 text-text-secondary hover:bg-white/5'
                        }`}
                      >
                        <span className="font-bold">{v.name}</span>
                        <span className="mono-font text-sm">{formatCurrency(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Modifiers (Add-ons) */}
              {product.modifiers && product.modifiers.length > 0 && (
                <div>
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mb-4 block">Adiciones / Modificadores</label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.modifiers.map(m => {
                      const isSelected = selectedModifiers.find(sm => sm.id === m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => toggleModifier(m)}
                          className={`flex-between p-3 rounded-xl border transition-all ${
                            isSelected 
                              ? 'bg-success/10 border-success/50 text-white' 
                              : 'bg-black/20 border-white/5 text-text-secondary hover:bg-white/5'
                          }`}
                        >
                          <span className="text-xs font-medium">{m.name}</span>
                          <span className="text-[10px] mono-font text-text-tertiary">{m.price > 0 ? `+${formatCurrency(m.price)}` : 'Gratis'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-bg-base border-t border-border-light flex items-center gap-6">
              <div className="flex items-center gap-4 bg-black/20 rounded-xl p-1 border border-white/5">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex-center rounded-lg hover:bg-white/5"><Minus size={18}/></button>
                <span className="w-8 text-center font-bold text-lg mono-font">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex-center rounded-lg hover:bg-white/5"><Plus size={18}/></button>
              </div>
              
              <button 
                onClick={handleConfirm}
                className="btn btn-lg btn-primary flex-1 shadow-glow gap-2"
              >
                Agregar al Ticket <Check size={20}/>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCustomizer;
