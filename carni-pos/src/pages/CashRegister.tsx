import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Wallet, 
  CreditCard, 
  QrCode, 
  ArrowUpRight, 
  ArrowDownRight, 
  Lock, 
  Unlock, 
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

import { useStore } from '../store/useStore';

export const CashRegister = () => {
  const { cashRegister, transactions, openRegister, closeRegister } = useStore();
  const isOpen = cashRegister.isOpen;
  const [baseAmount, setBaseAmount] = useState(150000);
  const [showCloseModal, setShowCloseModal] = useState(false);
  
  const totals = {
    cash: isOpen ? cashRegister.baseAmount + transactions.filter(t => t.method === 'cash' && t.type === 'sale').reduce((sum, t) => sum + t.amount, 0) - transactions.filter(t => t.method === 'cash' && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) : 0,
    card: isOpen ? transactions.filter(t => t.method === 'card' && t.type === 'sale').reduce((sum, t) => sum + t.amount, 0) : 0,
    transfer: isOpen ? transactions.filter(t => t.method === 'transfer' && t.type === 'sale').reduce((sum, t) => sum + t.amount, 0) : 0,
  };
  
  const grandTotal = totals.cash + totals.card + totals.transfer;

  const handleOpenRegister = () => {
    openRegister(baseAmount);
    toast.success('Caja abierta exitosamente', {
      description: `Base inicial: $${baseAmount.toLocaleString()}`
    });
  };

  const handleCloseRegister = () => {
    closeRegister();
    setShowCloseModal(false);
    toast.success('Corte Z realizado', {
      description: 'Caja cerrada y reporte enviado a gerencia.'
    });
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)] min-h-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Caja y Transacciones</h1>
          <p className="text-muted-foreground mt-1">Apertura, cuadre de caja y registro de movimientos.</p>
        </div>
        
        {isOpen ? (
          <button 
            onClick={() => setShowCloseModal(true)}
            className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl border border-red-500/20 flex items-center gap-2 transition-all"
          >
            <Lock className="w-4 h-4" /> Cierre de Caja (Corte Z)
          </button>
        ) : (
          <div className="px-4 py-2 bg-muted/50 rounded-lg text-sm text-muted-foreground font-medium flex items-center gap-2">
            <Lock className="w-4 h-4" /> Caja Cerrada
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div 
            key="closed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="glass p-8 rounded-3xl border border-border w-full max-w-md text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Apertura de Turno</h2>
              <p className="text-muted-foreground mb-8">Por favor ingrese el monto base en efectivo para abrir la caja.</p>
              
              <div className="text-left mb-6">
                <label className="text-sm font-medium text-muted-foreground block mb-2">Efectivo Base (Fondo de Caja)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-bold">$</span>
                  <input 
                    type="number" 
                    value={baseAmount}
                    onChange={(e) => setBaseAmount(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl py-3 pl-8 pr-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleOpenRegister}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 flex justify-center items-center gap-2 transition-all"
              >
                <Unlock className="w-5 h-5" /> Iniciar Turno
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="open"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0"
          >
            {/* Left Panel: Stats */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <div className="glass p-6 rounded-2xl border border-border bg-card/50">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Total en Caja (Efectivo)</h3>
                <div className="text-4xl font-black text-foreground mb-2">${totals.cash.toLocaleString()}</div>
                <div className="text-sm text-green-500 font-medium flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" /> +${(totals.cash - cashRegister.baseAmount).toLocaleString()} hoy
                </div>
              </div>
              
              <div className="glass p-6 rounded-2xl border border-border flex-1 flex flex-col">
                <h3 className="text-sm font-medium text-muted-foreground mb-6">Desglose por Método</h3>
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Wallet className="w-4 h-4" /></div>
                      <span className="font-medium">Efectivo Total</span>
                    </div>
                    <span className="font-bold">${totals.cash.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><CreditCard className="w-4 h-4" /></div>
                      <span className="font-medium">Tarjetas (Datáfono)</span>
                    </div>
                    <span className="font-bold">${totals.card.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><QrCode className="w-4 h-4" /></div>
                      <span className="font-medium">Transferencias / QR</span>
                    </div>
                    <span className="font-bold">${totals.transfer.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Recaudo Total</span>
                    <span className="text-2xl font-black text-primary">${grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Transactions */}
            <div className="w-full lg:w-2/3 glass rounded-2xl border border-border flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-primary" /> Historial de Transacciones
                </h2>
                <button 
                  onClick={() => toast('Funcionalidad de egresos en desarrollo')}
                  className="text-xs font-bold text-primary px-3 py-1.5 bg-primary/10 rounded-lg"
                >
                  + Registrar Egreso
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-2">
                  {transactions.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">No hay transacciones hoy.</div>
                  ) : transactions.map((trx) => (
                    <div key={trx.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center border",
                          trx.type === 'sale' ? "bg-green-500/10 border-green-500/20 text-green-500" : 
                          trx.type === 'opening' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                        )}>
                          {trx.type === 'sale' ? <ArrowUpRight className="w-5 h-5" /> : 
                           trx.type === 'opening' ? <Unlock className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-sm">{trx.desc}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{trx.id}</span>
                            <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-foreground font-medium">
                              {trx.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={clsx(
                          "font-black text-lg",
                          trx.type === 'sale' || trx.type === 'opening' ? "text-foreground" : "text-red-500"
                        )}>
                          {trx.type === 'sale' || trx.type === 'opening' ? '+' : '-'}${trx.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase font-medium mt-1">
                          {trx.method === 'cash' ? 'Efectivo' : trx.method === 'card' ? 'Tarjeta' : trx.method === 'transfer' ? 'Nequi' : 'NA'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Register Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass w-full max-w-md p-6 rounded-3xl border border-border shadow-2xl relative"
          >
            <button 
              onClick={() => setShowCloseModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <Lock className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Cierre de Caja</h2>
                <p className="text-xs text-muted-foreground">Confirme los valores para el Corte Z</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background border border-border">
                <span className="text-muted-foreground">Efectivo Esperado</span>
                <span className="font-bold text-lg">${totals.cash.toLocaleString()}</span>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Efectivo Físico en Cajón</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-bold">$</span>
                  <input 
                    type="number" 
                    defaultValue={totals.cash}
                    className="w-full bg-background border border-primary/50 rounded-xl py-3 pl-8 pr-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Caja cuadrada (Diferencia: $0)
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCloseModal(false)}
                className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCloseRegister}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20"
              >
                Confirmar Cierre
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
