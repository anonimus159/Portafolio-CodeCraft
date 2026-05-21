import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, CheckCircle, Info } from 'lucide-react';

const ConfirmContext = createContext(null);

const STYLES = {
  danger:  { icon: Trash2,         color: '#f87171', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)',  btnBg: 'rgba(239,68,68,0.2)',  btnBorder: 'rgba(239,68,68,0.4)',  btnColor: '#fca5a5' },
  warning: { icon: AlertTriangle,  color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', btnBg: 'rgba(245,158,11,0.2)', btnBorder: 'rgba(245,158,11,0.4)', btnColor: '#fde68a' },
  info:    { icon: CheckCircle,    color: '#60a5fa', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', btnBg: 'rgba(59,130,246,0.2)', btnBorder: 'rgba(59,130,246,0.4)', btnColor: '#bfdbfe' },
};

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);

  const confirm = useCallback(({ title = '¿Estás seguro?', message = 'Esta acción no se puede deshacer.', confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', type = 'danger' } = {}) => {
    return new Promise(resolve => setState({ title, message, confirmLabel, cancelLabel, type, resolve }));
  }, []);

  const done = (val) => { state?.resolve(val); setState(null); };

  const s    = STYLES[state?.type] || STYLES.danger;
  const Icon = s.icon;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {state && (
          <div
            onClick={() => done(false)}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', zIndex:9998, display:'flex', alignItems:'center', justifyContent:'center', padding:16, fontFamily:'Inter,system-ui,sans-serif' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1,   y: 0  }}
              exit={{    opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type:'spring', stiffness:380, damping:26 }}
              onClick={e => e.stopPropagation()}
              style={{ width:'100%', maxWidth:360, background:'#111113', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, boxShadow:'0 24px 60px rgba(0,0,0,0.8)', overflow:'hidden' }}
            >
              {/* Header */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'20px 20px 14px' }}>
                <div style={{ width:40, height:40, borderRadius:12, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon style={{ width:18, height:18, color:s.color }} />
                </div>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontSize:15, fontWeight:700, color:'#fafafa', margin:'0 0 5px' }}>{state.title}</h3>
                  <p  style={{ fontSize:13, color:'#71717a', margin:0, lineHeight:1.5 }}>{state.message}</p>
                </div>
                <button onClick={() => done(false)}
                  style={{ flexShrink:0, background:'none', border:'none', cursor:'pointer', color:'#52525b', padding:4, display:'flex', borderRadius:8 }}
                  onMouseEnter={e => e.currentTarget.style.color='#a1a1aa'}
                  onMouseLeave={e => e.currentTarget.style.color='#52525b'}>
                  <X style={{ width:15, height:15 }} />
                </button>
              </div>
              {/* Actions */}
              <div style={{ display:'flex', gap:8, padding:'4px 20px 20px' }}>
                <button onClick={() => done(false)}
                  style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'#a1a1aa', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.color='#fafafa'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#a1a1aa'; }}>
                  {state.cancelLabel}
                </button>
                <button onClick={() => done(true)}
                  style={{ flex:1, padding:'10px', borderRadius:10, border:`1px solid ${s.btnBorder}`, background:s.btnBg, color:s.btnColor, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                  {state.confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside ConfirmProvider');
  return ctx;
}
