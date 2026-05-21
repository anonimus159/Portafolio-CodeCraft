import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronRight, ShoppingBag, Utensils, Coffee } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const ComboBuilder = ({ combo, products, onConfirm, onClose }) => {
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [selections, setSelections] = useState({});

  const currentSlot = combo.comboSlots[currentSlotIndex];
  
  const availableItems = useMemo(() => {
    return products.filter(p => p.category === currentSlot.category && !p.isCombo);
  }, [products, currentSlot]);

  const handleSelectItem = (item) => {
    const newSelections = { ...selections, [currentSlot.id]: item };
    setSelections(newSelections);
    
    if (currentSlotIndex < combo.comboSlots.length - 1) {
      setCurrentSlotIndex(currentSlotIndex + 1);
    }
  };

  const isComplete = Object.keys(selections).length === combo.comboSlots.length;

  const handleFinish = () => {
    if (!isComplete) return;
    
    const optionsSummary = Object.values(selections).map(s => s.name).join(' + ');
    onConfirm({
      ...combo,
      quantity: 1,
      selections,
      optionsSummary,
      displayName: `${combo.name} (${optionsSummary})`,
      cartId: `combo-${Date.now()}`
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-bg-surface border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex-between bg-bg-base/50">
          <div>
            <h3 className="text-xl font-bold">Configurar {combo.name}</h3>
            <p className="text-xs text-text-tertiary mt-1">Sigue los pasos para armar tu combo perfecto</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20}/></button>
        </div>

        {/* Progress Stepper */}
        <div className="px-8 py-4 bg-white/5 flex gap-2">
          {combo.comboSlots.map((slot, idx) => (
            <div 
              key={slot.id} 
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                idx < currentSlotIndex ? 'bg-success' :
                idx === currentSlotIndex ? 'bg-accent-primary shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.5)]' : 
                'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col">
          <div className="mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent-primary">Paso {currentSlotIndex + 1} de {combo.comboSlots.length}</span>
            <h4 className="text-2xl font-black text-white mt-1">Elige tu {currentSlot.name}</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableItems.map(item => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectItem(item)}
                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                  selections[currentSlot.id]?.id === item.id 
                    ? 'border-accent-primary bg-accent-primary/10' 
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="h-20 w-full mb-3 rounded-lg overflow-hidden grayscale-[0.5] group-hover:grayscale-0 transition-all">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <h5 className="text-sm font-bold leading-tight line-clamp-2">{item.name}</h5>
                {selections[currentSlot.id]?.id === item.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent-primary flex-center shadow-lg">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-bg-base/80 border-t border-white/10 flex-between">
          <div className="flex gap-2">
            {currentSlotIndex > 0 && (
              <button onClick={() => setCurrentSlotIndex(currentSlotIndex - 1)} className="btn btn-secondary px-6">
                Atrás
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Precio Combo</p>
              <p className="text-xl font-black text-white mono-font">{formatCurrency(combo.price)}</p>
            </div>
            <button 
              onClick={handleFinish}
              disabled={!isComplete}
              className="btn btn-accent px-10 h-14 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Combo <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ComboBuilder;
