import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

/**
 * ConfirmModal - A premium glassmorphism styled confirmation dialog
 * Props:
 *  isOpen: boolean
 *  onClose: () => void
 *  onConfirm: (inputValue?: string) => void
 *  title: string
 *  message: string
 *  type: 'danger' | 'warning' | 'info' | 'success'
 *  requirePin?: boolean
 *  pinValue?: string
 *  confirmText?: string
 *  cancelText?: string
 */
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'warning', 
  requirePin = false, 
  pinValue = '',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [error, setError] = React.useState('');

  const config = {
    danger: { icon: ShieldAlert, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', shadow: 'shadow-danger/20' },
    warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', shadow: 'shadow-warning/20' },
    success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', shadow: 'shadow-success/20' },
    info: { icon: AlertCircle, color: 'text-info', bg: 'bg-info/10', border: 'border-info/20', shadow: 'shadow-info/20' },
  };

  const { icon: Icon, color, bg, border, shadow } = config[type];

  const handleConfirm = () => {
    if (requirePin) {
      if (inputValue === pinValue) {
        onConfirm(inputValue);
        setInputValue('');
        setError('');
      } else {
        setError('PIN Incorrecto');
      }
    } else {
      onConfirm();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`w-full max-w-md overflow-hidden bg-bg-surface border ${border} rounded-3xl shadow-2xl ${shadow}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-8">
              {/* Header Icon */}
              <div className={`w-16 h-16 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6`}>
                <Icon size={32} />
              </div>

              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-text-tertiary transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold text-text-primary mb-2">{title}</h3>
              <p className="text-text-secondary leading-relaxed mb-8">{message}</p>

              {requirePin && (
                <div className="mb-8">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-2 block">
                    Ingrese PIN de Autorización
                  </label>
                  <input
                    type="password"
                    autoFocus
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (error) setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                    placeholder="••••"
                    className={`w-full h-14 bg-bg-base border ${error ? 'border-danger' : 'border-border-light'} rounded-2xl px-6 text-2xl tracking-[10px] text-center font-bold focus:outline-none focus:border-accent-primary transition-all`}
                  />
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-danger font-bold mt-2 text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 h-14 rounded-2xl border border-border-light font-bold text-text-secondary hover:bg-white/5 transition-all"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 h-14 rounded-2xl font-bold text-white shadow-lg transition-all ${
                    type === 'danger' ? 'bg-danger hover:bg-danger/80 shadow-danger/20' :
                    type === 'warning' ? 'bg-warning hover:bg-warning/80 shadow-warning/20' :
                    'bg-accent-primary hover:bg-accent-primary/80 shadow-accent-primary/20'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
