import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const META = {
  success: { color: '#4ade80', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   bar: '#22c55e', icon: CheckCircle  },
  error:   { color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   bar: '#ef4444', icon: XCircle      },
  warning: { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  bar: '#f59e0b', icon: AlertTriangle },
  info:    { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)',  bar: '#3b82f6', icon: Info          },
};

function ToastItem({ toast, onRemove }) {
  const m    = META[toast.type] || META.info;
  const Icon = m.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48, scale: 0.92 }}
      animate={{ opacity: 1, x: 0,  scale: 1    }}
      exit={{    opacity: 0, x: 48, scale: 0.92, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      style={{
        position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 10,
        width: 300, maxWidth: 'calc(100vw - 2rem)',
        background: '#111113', border: `1px solid ${m.border}`,
        borderRadius: 12, padding: '12px 14px', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Left bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: m.bar, borderRadius: '12px 0 0 12px' }} />
      {/* Icon */}
      <div style={{ flexShrink: 0, marginLeft: 4, marginTop: 1 }}>
        <Icon style={{ width: 16, height: 16, color: m.color }} />
      </div>
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title   && <p style={{ fontSize: 13, fontWeight: 700, color: m.color, margin: 0, lineHeight: 1.4 }}>{toast.title}</p>}
        {toast.message && <p style={{ fontSize: 12, color: '#71717a', margin: toast.title ? '3px 0 0' : 0, lineHeight: 1.5 }}>{toast.message}</p>}
      </div>
      {/* Close */}
      <button onClick={() => onRemove(toast.id)}
        style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: '#52525b', display: 'flex', borderRadius: 6, transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
        onMouseLeave={e => e.currentTarget.style.color = '#52525b'}>
        <X style={{ width: 13, height: 13 }} />
      </button>
      {/* Progress bar */}
      <motion.div
        style={{ position: 'absolute', bottom: 0, left: 0, height: 2, background: m.bar, opacity: 0.4 }}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const remove = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);
  const add    = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++counter.current;
    setToasts(p => [...p.slice(-4), { id, type, title, message, duration }]);
    setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  const toast = {
    success: (title, message, opts) => add({ type: 'success', title, message, ...opts }),
    error:   (title, message, opts) => add({ type: 'error',   title, message, ...opts }),
    warning: (title, message, opts) => add({ type: 'warning', title, message, ...opts }),
    info:    (title, message, opts) => add({ type: 'info',    title, message, ...opts }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} style={{ pointerEvents: 'auto' }}>
              <ToastItem toast={t} onRemove={remove} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
