import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Wallet, 
  ArrowDownCircle, 
  Calendar, 
  Tag, 
  CreditCard, 
  Banknote, 
  Smartphone,
  Trash2,
  AlertTriangle,
  X,
  Check,
  Zap,
  Users,
  Home,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';

const EXPENSE_CATEGORIES = [
  { id: 'supplies', label: 'Insumos / Alimentos', icon: Tag, color: 'text-orange-400' },
  { id: 'services', label: 'Servicios Públicos', icon: Zap, color: 'text-blue-400' }, 
  { id: 'salaries', label: 'Sueldos / Adelantos', icon: Users, color: 'text-purple-400' }, 
  { id: 'rent', label: 'Arriendo', icon: Home, color: 'text-green-400' }, 
  { id: 'maintenance', label: 'Mantenimiento', icon: Wrench, color: 'text-yellow-400' }, 
  { id: 'other', label: 'Otros Gastos', icon: Plus, color: 'text-gray-400' },
];

const ExpensesModule = ({ expenses = [], setExpenses, currentUser, activeShiftId }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'supplies',
    paymentMethod: 'Efectivo',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddExpense = () => {
    if (!form.description || !form.amount) return;
    
    const newExpense = {
      id: `EXP-${Date.now()}`,
      ...form,
      amount: parseFloat(form.amount),
      registeredBy: currentUser.name,
      shiftId: activeShiftId // Link to current shift if any
    };

    setExpenses(prev => [newExpense, ...prev]);
    setForm({
      description: '',
      amount: '',
      category: 'supplies',
      paymentMethod: 'Efectivo',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAdd(false);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro de gasto?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const totalExpenses = useMemo(() => 
    expenses.reduce((sum, e) => sum + e.amount, 0), 
  [expenses]);

  return (
    <div className="flex flex-col gap-6 pt-6 h-full">
      <div className="flex-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Gestión de Gastos</h2>
          <p className="text-xs text-text-tertiary mt-1">Control de egresos y pagos operativos</p>
        </div>
        <div className="flex gap-3">
          <div className="command-bar m-0 w-[250px]">
            <Search size={16} className="text-text-tertiary" />
            <input
              type="text"
              placeholder="Buscar gasto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-md btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Registrar Gasto
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="enterprise-card p-6 bg-gradient-to-br from-danger/10 to-transparent border-danger/20">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex-center text-danger">
              <ArrowDownCircle size={24} />
            </div>
            <h4 className="text-sm font-bold text-text-secondary uppercase">Total Egresos</h4>
          </div>
          <p className="text-3xl font-black mono-font">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className="enterprise-card p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex-center text-info">
              <Calendar size={24} />
            </div>
            <h4 className="text-sm font-bold text-text-secondary uppercase">Gastos del Mes</h4>
          </div>
          <p className="text-2xl font-bold mono-font">{formatCurrency(totalExpenses)}</p>
        </div>

        <div className="enterprise-card p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex-center text-success">
              <Banknote size={24} />
            </div>
            <h4 className="text-sm font-bold text-text-secondary uppercase">Pagado en Efectivo</h4>
          </div>
          <p className="text-2xl font-bold mono-font">
            {formatCurrency(expenses.filter(e => e.paymentMethod === 'Efectivo').reduce((s, e) => s + e.amount, 0))}
          </p>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="flex-1 overflow-hidden enterprise-card p-0 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Fecha</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Descripción</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Categoría</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Medio</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">Monto</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-center w-20">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredExpenses.map(expense => {
                const category = EXPENSE_CATEGORIES.find(c => c.id === expense.category) || EXPENSE_CATEGORIES[5];
                return (
                  <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-sm text-text-secondary mono-font">{expense.date}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-text-primary">{expense.description}</p>
                      <p className="text-[10px] text-text-tertiary italic">Reg: {expense.registeredBy}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <category.icon size={14} className={category.color} />
                        <span className="text-xs font-medium text-text-secondary">{category.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase px-2 py-1 bg-white/5 rounded-md border border-white/5 text-text-tertiary">
                        {expense.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-danger mono-font">-{formatCurrency(expense.amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 text-text-tertiary hover:text-danger hover:bg-danger/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredExpenses.length === 0 && (
            <div className="py-20 flex-center flex-col text-text-tertiary opacity-50">
              <Wallet size={48} className="mb-4" />
              <p className="font-bold">No hay gastos registrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Gasto Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex-center p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-surface border border-border-light rounded-3xl w-full max-w-md p-8 shadow-[0_0_100px_rgba(225,29,72,0.15)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold">Nuevo Gasto</h3>
                  <p className="text-xs text-text-tertiary mt-1">Registra un egreso de dinero</p>
                </div>
                <button onClick={() => setShowAdd(false)} className="p-2 text-text-tertiary hover:text-white"><X size={24} /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Descripción del Gasto</label>
                  <input 
                    type="text" 
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent-primary transition-all"
                    placeholder="Ej: Pago de cilindros de gas"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Monto</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">$</span>
                      <input 
                        type="number" 
                        value={form.amount}
                        onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                        className="w-full bg-bg-base border border-border-light rounded-xl pl-7 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-accent-primary transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Fecha</label>
                    <input 
                      type="date" 
                      value={form.date}
                      onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Categoría</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPENSE_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setForm(p => ({ ...p, category: cat.id }))}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                          form.category === cat.id ? 'bg-accent-primary/10 border-accent-primary text-white' : 'bg-black/20 border-white/5 text-text-tertiary hover:bg-white/5'
                        }`}
                      >
                        <cat.icon size={14} />
                        <span className="text-[11px] font-bold uppercase">{cat.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Método de Pago</label>
                  <div className="flex gap-2">
                    {['Efectivo', 'Tarjeta', 'Transferencia'].map(m => (
                      <button
                        key={m}
                        onClick={() => setForm(p => ({ ...p, paymentMethod: m }))}
                        className={`flex-1 py-3 rounded-xl border text-[11px] font-bold transition-all ${
                          form.paymentMethod === m ? 'bg-white/10 border-white/20 text-white' : 'bg-black/20 border-white/5 text-text-tertiary hover:bg-white/5'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {form.paymentMethod === 'Efectivo' && activeShiftId && (
                  <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-danger flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-danger-bg-text leading-tight font-medium" style={{ color: 'var(--danger)' }}>
                      Este gasto se descontará automáticamente del efectivo esperado en el turno activo.
                    </p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleAddExpense}
                disabled={!form.description || !form.amount}
                className="btn btn-lg btn-primary w-full mt-8 shadow-glow gap-2"
              >
                <Check size={20} /> Confirmar Gasto
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpensesModule;
