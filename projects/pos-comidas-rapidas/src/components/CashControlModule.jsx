import React, { useState, useMemo } from 'react';
import { 
  Banknote, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  TrendingUp, 
  Wallet,
  ArrowRight,
  Calculator,
  Lock,
  Unlock,
  ChevronRight,
  BarChart3,
  RefreshCw,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CashControlModule = ({ shifts, setShifts, activeShiftId, setActiveShiftId, orders, expenses = [], currentUser }) => {
  const [baseAmount, setBaseAmount] = useState('');
  const [reportedCash, setReportedCash] = useState('');
  const [view, setView] = useState('main'); // 'main', 'history'
  const [printShiftId, setPrintShiftId] = useState(null);

  const activeShift = useMemo(() => shifts.find(s => s.id === activeShiftId), [shifts, activeShiftId]);
  
  // Calculate current sales and expenses for active shift
  const currentShiftData = useMemo(() => {
    if (!activeShift) return { sales: { cash: 0, card: 0, digital: 0, total: 0 }, expenses: 0 };
    
    const shiftOrders = orders.filter(o => 
      o.status === 'completed' && 
      new Date(o.completedAt) > new Date(activeShift.startTime)
    );

    const sales = shiftOrders.reduce((acc, o) => {
      const method = o.paymentMethod?.toLowerCase() || 'efectivo';
      if (method.includes('tarjeta')) acc.card += o.total;
      else if (method.includes('transferencia')) acc.digital += o.total;
      else acc.cash += o.total;
      
      acc.total += o.total;
      return acc;
    }, { cash: 0, card: 0, digital: 0, total: 0 });

    const shiftExpenses = expenses.filter(e => 
      e.paymentMethod === 'Efectivo' && 
      new Date(e.date) > new Date(activeShift.startTime)
    ).reduce((sum, e) => sum + e.amount, 0);

    return { sales, expenses: shiftExpenses };
  }, [orders, expenses, activeShift]);

  const handleOpenShift = () => {
    if (!baseAmount || isNaN(baseAmount)) return;
    const newShift = {
      id: `SHIFT-${Date.now()}`,
      startTime: new Date().toISOString(),
      endTime: null,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      baseAmount: parseFloat(baseAmount),
      status: 'open',
      sales: { cash: 0, card: 0, digital: 0, total: 0 }
    };
    setShifts(prev => [newShift, ...prev]);
    setActiveShiftId(newShift.id);
    setBaseAmount('');
  };

  const handleCloseShift = () => {
    if (!reportedCash || isNaN(reportedCash)) return;
    
    const finalSales = currentShiftData.sales;
    const finalExpenses = currentShiftData.expenses;
    const expectedCash = activeShift.baseAmount + finalSales.cash - finalExpenses;
    const difference = parseFloat(reportedCash) - expectedCash;

    setShifts(prev => prev.map(s => s.id === activeShiftId ? {
      ...s,
      endTime: new Date().toISOString(),
      status: 'closed',
      sales: finalSales,
      shiftExpenses: finalExpenses,
      reportedCash: parseFloat(reportedCash),
      expectedCash,
      difference
    } : s));
    
    setPrintShiftId(activeShiftId);
    setActiveShiftId(null);
    setReportedCash('');
    
    // Allow React to render the printable area before triggering print
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const isAdmin = currentUser?.role === 'Gerente' || currentUser?.role === 'Administrador';

  return (
    <div className="flex flex-col gap-6 pt-6 h-full">
      <div className="flex-between print:hidden">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Control de Turnos y Caja</h2>
          <p className="text-xs text-text-tertiary mt-1">Gestión de aperturas, cierres y arqueos</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('main')}
            className={`btn btn-sm ${view === 'main' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Turno Actual
          </button>
          {isAdmin && (
            <button 
              onClick={() => setView('history')}
              className={`btn btn-sm ${view === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Historial de Arqueos
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'main' ? (
          <motion.div 
            key="main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col gap-6 print:hidden"
          >
            {!activeShift ? (
              /* --- OPEN SHIFT SCREEN --- */
              <div className="flex-1 flex-center">
                <div className="enterprise-card w-full max-w-md p-8 text-center shadow-[0_0_50px_rgba(234,88,12,0.1)]">
                  <div className="w-20 h-20 rounded-full bg-accent-primary/10 flex-center mx-auto mb-6">
                    <Unlock size={40} className="text-accent-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Apertura de Caja</h3>
                  <p className="text-text-tertiary mb-8">Ingresa el monto base (sencillo) para iniciar el turno.</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="text-left">
                      <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Base de Caja (Efectivo Inicial)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary font-bold">$</span>
                        <input 
                          type="number" 
                          value={baseAmount}
                          onChange={e => setBaseAmount(e.target.value)}
                          className="w-full bg-bg-base border border-border-light rounded-xl pl-8 pr-4 py-4 text-xl font-bold text-white outline-none focus:border-accent-primary transition-all"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleOpenShift}
                    disabled={!baseAmount || baseAmount <= 0}
                    className="btn btn-lg btn-primary w-full shadow-glow gap-3"
                  >
                    Abrir Turno Ahora <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ) : (
              /* --- ACTIVE SHIFT DASHBOARD --- */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Status Card */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="enterprise-card p-8 bg-gradient-to-br from-bg-surface to-bg-base">
                    <div className="flex-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex-center">
                          <Clock size={24} className="text-success" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold">Turno en Progreso</h4>
                          <p className="text-xs text-text-tertiary">Iniciado por {activeShift.cashierName} a las {new Date(activeShift.startTime).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <span className="badge badge-success animate-pulse">ACTIVO</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[10px] text-text-tertiary font-bold uppercase mb-1">Base Inicial</p>
                        <p className="text-xl font-bold mono-font">${activeShift.baseAmount.toLocaleString('es-CO')}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-success/5 border border-success/10">
                        <p className="text-[10px] text-success font-bold uppercase mb-1">Ventas (+)</p>
                        <p className="text-xl font-bold mono-font text-success">${currentShiftData.sales.cash.toLocaleString('es-CO')}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-danger/5 border border-danger/10">
                        <p className="text-[10px] text-danger font-bold uppercase mb-1">Gastos (-)</p>
                        <p className="text-xl font-bold mono-font text-danger">${currentShiftData.expenses.toLocaleString('es-CO')}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-accent-primary/5 border border-accent-primary/20">
                        <p className="text-[10px] text-accent-primary font-bold uppercase mb-1">Caja Esperada</p>
                        <p className="text-xl font-bold mono-font text-white">${(activeShift.baseAmount + currentShiftData.sales.cash - currentShiftData.expenses).toLocaleString('es-CO')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="enterprise-card p-6">
                      <h4 className="text-sm font-bold mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-info" /> Otros Medios de Pago</h4>
                      <div className="space-y-4">
                        <div className="flex-between p-3 rounded-xl bg-white/5">
                          <span className="text-sm text-text-secondary">Tarjetas</span>
                          <span className="font-bold mono-font">${currentShiftData.sales.card.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex-between p-3 rounded-xl bg-white/5">
                          <span className="text-sm text-text-secondary">Transferencias</span>
                          <span className="font-bold mono-font">${currentShiftData.sales.digital.toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="enterprise-card p-6 flex flex-col justify-center items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-info/10 flex-center mb-3">
                        <TrendingUp size={24} className="text-info" />
                      </div>
                      <h4 className="text-sm font-bold">Total Ventas Brutas</h4>
                      <p className="text-3xl font-black mt-2 text-gradient-primary">${currentShiftData.sales.total.toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                </div>

                {/* Close Shift Panel */}
                <div className="enterprise-card p-8 border-accent-primary/20 bg-bg-surface/50">
                  <div className="w-16 h-16 rounded-full bg-danger/10 flex-center mb-6">
                    <Lock size={32} className="text-danger" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cierre de Turno</h3>
                  <p className="text-xs text-text-tertiary mb-8">Cuenta el efectivo total en caja y regístralo aquí para realizar el arqueo.</p>
                  
                  <div className="space-y-4 mb-8 text-left">
                    <div>
                      <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Efectivo Físico en Caja</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary font-bold">$</span>
                        <input 
                          type="number" 
                          value={reportedCash}
                          onChange={e => setReportedCash(e.target.value)}
                          className="w-full bg-bg-base border border-border-light rounded-xl pl-8 pr-4 py-4 text-xl font-bold text-white outline-none focus:border-danger/50 transition-all"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCloseShift}
                    disabled={!reportedCash || reportedCash < 0}
                    className="btn btn-lg bg-danger hover:bg-danger/80 text-white w-full gap-3"
                  >
                    Finalizar Turno <Lock size={20} />
                  </button>
                  
                  <p className="text-[10px] text-text-tertiary text-center mt-6 uppercase tracking-widest font-bold">Acción irreversible</p>
                </div>

              </div>
            )}
          </motion.div>
        ) : (
          /* --- HISTORY VIEW (ADMIN ONLY) --- */
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-y-auto pr-2 space-y-4 print:hidden"
          >
            {shifts.filter(s => s.status === 'closed').map(shift => (
              <div key={shift.id} className="enterprise-card p-6 group hover:border-white/20 transition-all">
                <div className="flex-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex-center">
                      <History size={20} className="text-text-tertiary" />
                    </div>
                    <div>
                      <h4 className="font-bold">{shift.cashierName}</h4>
                      <p className="text-[10px] text-text-tertiary uppercase tracking-widest">{new Date(shift.startTime).toLocaleDateString()} · {new Date(shift.startTime).toLocaleTimeString()} - {new Date(shift.endTime).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <button 
                        onClick={() => { setPrintShiftId(shift.id); setTimeout(() => window.print(), 300); }}
                        className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-text-tertiary hover:text-white flex items-center gap-1 transition-colors"
                        title="Imprimir Ticket de Cierre"
                      >
                        <Printer size={10} /> Imprimir Z
                      </button>
                      <div className={`badge ${shift.difference === 0 ? 'badge-success' : shift.difference > 0 ? 'badge-info' : 'badge-danger'}`}>
                        {shift.difference === 0 ? 'CUADRE PERFECTO' : shift.difference > 0 ? 'SOBRANTE' : 'FALTANTE'}
                      </div>
                    </div>
                    <p className={`text-sm font-bold mt-1 ${shift.difference === 0 ? 'text-success' : shift.difference > 0 ? 'text-info' : 'text-danger'}`}>
                      {shift.difference > 0 ? '+' : ''}${shift.difference.toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[9px] text-text-tertiary font-bold uppercase mb-1">Base</p>
                    <p className="text-sm font-bold mono-font">${shift.baseAmount.toLocaleString('es-CO')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-tertiary font-bold uppercase mb-1">Ventas Efectivo</p>
                    <p className="text-sm font-bold mono-font">${shift.sales.cash.toLocaleString('es-CO')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-tertiary font-bold uppercase mb-1">Efectivo en Caja</p>
                    <p className="text-sm font-bold mono-font text-white">${shift.reportedCash.toLocaleString('es-CO')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-tertiary font-bold uppercase mb-1">Total Turno</p>
                    <p className="text-sm font-bold mono-font text-accent-primary">${shift.sales.total.toLocaleString('es-CO')}</p>
                  </div>
                </div>
              </div>
            ))}

            {shifts.filter(s => s.status === 'closed').length === 0 && (
              <div className="h-60 flex-center flex-col text-text-tertiary opacity-50">
                <BarChart3 size={48} className="mb-4" />
                <p className="font-bold">No hay cierres registrados aún</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PRINTABLE Z-REPORT --- */}
      {printShiftId && (
        <div id="printable-receipt" className="print-receipt-container">
          {(() => {
            const shiftToPrint = shifts.find(s => s.id === printShiftId);
            if (!shiftToPrint) return null;
            return (
              <div className="print-receipt-inner" style={{ fontFamily: 'monospace', width: '80mm', padding: '10px' }}>
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <h2 style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>REPORTE Z</h2>
                  <p style={{ margin: '2px 0', fontSize: '12px' }}>Cierre de Caja</p>
                  <p style={{ margin: '2px 0', fontSize: '10px' }}>{new Date().toLocaleString('es-CO')}</p>
                </div>
                
                <div style={{ borderBottom: '1px dashed black', paddingBottom: '10px', marginBottom: '10px', fontSize: '12px' }}>
                  <p style={{ margin: '2px 0' }}><strong>Turno:</strong> {shiftToPrint.id}</p>
                  <p style={{ margin: '2px 0' }}><strong>Cajero:</strong> {shiftToPrint.cashierName}</p>
                  <p style={{ margin: '2px 0' }}><strong>Apertura:</strong> {new Date(shiftToPrint.startTime).toLocaleTimeString()}</p>
                  <p style={{ margin: '2px 0' }}><strong>Cierre:</strong> {new Date(shiftToPrint.endTime).toLocaleTimeString()}</p>
                </div>

                <div style={{ marginBottom: '15px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Fondo de Caja:</span>
                    <span>${shiftToPrint.baseAmount.toLocaleString('es-CO')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Ventas Efectivo (+):</span>
                    <span>${shiftToPrint.sales.cash.toLocaleString('es-CO')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Gastos Efectivo (-):</span>
                    <span>${(shiftToPrint.shiftExpenses || 0).toLocaleString('es-CO')}</span>
                  </div>
                  <div style={{ borderTop: '1px solid black', margin: '4px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Efectivo Esperado:</span>
                    <span>${shiftToPrint.expectedCash.toLocaleString('es-CO')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Efectivo Reportado:</span>
                    <span>${shiftToPrint.reportedCash.toLocaleString('es-CO')}</span>
                  </div>
                  <div style={{ borderTop: '1px solid black', margin: '4px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Diferencia:</span>
                    <span>{shiftToPrint.difference > 0 ? '+' : ''}${shiftToPrint.difference.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed black', paddingTop: '10px', marginBottom: '15px', fontSize: '12px' }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>OTROS MEDIOS DE PAGO</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Tarjetas:</span>
                    <span>${shiftToPrint.sales.card.toLocaleString('es-CO')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Transferencias:</span>
                    <span>${shiftToPrint.sales.digital.toLocaleString('es-CO')}</span>
                  </div>
                  <div style={{ borderTop: '1px solid black', margin: '4px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Ventas Totales Brutas:</span>
                    <span>${shiftToPrint.sales.total.toLocaleString('es-CO')}</span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '10px' }}>
                  <p>*** Fin del Reporte ***</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default CashControlModule;
