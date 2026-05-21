import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatPeso } from '../utils/format';
import { Receipt, Plus, Trash2, Save, X, DollarSign, CheckCircle2, AlertCircle, Calendar, Tag, User, ClipboardList } from 'lucide-react';

export default function Gastos() {
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [notificacion, setNotificacion] = useState(null);

    useEffect(() => {
        cargarGastos();
    }, []);

    const cargarGastos = () => {
        api.gastos.getAll()
            .then(data => setGastos(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const mostrarNotificacion = (mensaje, tipo = 'success') => {
        setNotificacion({ mensaje, tipo });
        setTimeout(() => setNotificacion(null), 2500);
    };

    const guardar = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            await api.gastos.create({
                descripcion: formData.get('descripcion'),
                monto: parseFloat(formData.get('monto')),
                categoria: formData.get('categoria')
            });
            setModalOpen(false);
            mostrarNotificacion('Gasto registrado ✅');
            cargarGastos();
        } catch (err) {
            mostrarNotificacion('Error: ' + err.message, 'error');
        }
    };

    const eliminar = async (id) => {
        if (!confirm('¿Eliminar este gasto?')) return;
        try {
            await api.gastos.delete(id);
            mostrarNotificacion('Gasto eliminado ✅');
            cargarGastos();
        } catch (err) {
            mostrarNotificacion('Error: ' + err.message, 'error');
        }
    };

    const totalGastos = gastos.reduce((sum, g) => sum + parseFloat(g.monto), 0);

    const categoriasColors = {
        'Renta': 'from-purple-400 to-violet-500',
        'Servicios': 'from-blue-400 to-indigo-500',
        'Insumos': 'from-green-400 to-emerald-500',
        'Nómina': 'from-orange-400 to-amber-500',
        'Otros': 'from-gray-400 to-gray-500'
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full spinner"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Notification Toast */}
            {notificacion && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white transform transition-all duration-300 animate-slideIn ${
                    notificacion.tipo === 'error' ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-emerald-500 to-green-600'
                }`}>
                    {notificacion.tipo === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    <span className="font-bold">{notificacion.mensaje}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Receipt className="w-8 h-8 text-rose-500" /> Control de Gastos
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Gestiona los egresos operativos de tu negocio</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Registrar Gasto
                </button>
            </div>

            {/* Summary Card */}
            <div className="glass-card p-8 border-l-4 border-l-rose-500 bg-gradient-to-br from-rose-500 to-red-600 text-white relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <p className="text-rose-100 font-bold uppercase tracking-wider text-sm mb-1">Total de gastos registrados</p>
                        <p className="text-5xl font-black tracking-tight">{formatPeso(totalGastos)}</p>
                        <div className="flex items-center gap-2 mt-3 bg-white/20 inline-flex px-3 py-1 rounded-full backdrop-blur-sm">
                            <Receipt className="w-4 h-4 text-rose-100" />
                            <p className="text-sm text-rose-50 font-bold">{gastos.length} gastos en el historial</p>
                        </div>
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                        <DollarSign className="w-10 h-10 text-white" />
                    </div>
                </div>
            </div>

            {/* Gastos Table */}
            <div className="glass-panel rounded-3xl overflow-hidden mt-8">
                <div className="p-6 bg-white/40 border-b border-white/60">
                    <h2 className="font-black text-slate-700 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-cyan-600" /> Historial de gastos
                    </h2>
                </div>

                {gastos.length === 0 ? (
                    <div className="text-center py-16">
                        <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No hay gastos</h3>
                        <p className="text-slate-500 font-medium">Registra tus primeros gastos operativos</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full">
                            <thead className="bg-white/50 border-b border-white/60">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Descripción</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Categoría</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Monto</th>
                                    <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/40">
                                {gastos.map((gasto, index) => (
                                    <tr
                                        key={gasto.id}
                                        className="hover:bg-white/60 transition-all duration-200 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {new Date(gasto.fecha).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium ml-6">{new Date(gasto.fecha).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">{gasto.descripcion}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${categoriasColors[gasto.categoria] || 'from-slate-400 to-slate-500'} text-white shadow-sm`}>
                                                <Tag className="w-3 h-3" />
                                                {gasto.categoria || 'Otros'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                    {gasto.usuario_nombre?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{gasto.usuario_nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-lg font-black text-rose-600">{formatPeso(parseFloat(gasto.monto))}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => eliminar(gasto.id)}
                                                className="p-2.5 bg-white border border-rose-200 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-all shadow-sm active:scale-95 inline-flex items-center justify-center"
                                                title="Eliminar gasto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in-up">
                    <div className="glass-card w-full max-w-md modal-animate overflow-hidden border border-white/60 shadow-2xl">
                        <div className="p-6 bg-white/50 border-b border-white/60 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                                <Receipt className="w-6 h-6 text-rose-600" />
                                Registrar Gasto
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={guardar} className="p-6 bg-white/40 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Descripción *</label>
                                <div className="relative">
                                    <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="descripcion"
                                        className="tech-input pl-12"
                                        placeholder="Ej: Pago de luz"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Monto *</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="monto"
                                        step="0.01"
                                        className="tech-input pl-12 font-bold text-rose-600"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Categoría</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <select
                                        name="categoria"
                                        className="tech-input pl-12 bg-white/50"
                                    >
                                        <option value="">Sin categoría</option>
                                        <option value="Renta">🏠 Renta</option>
                                        <option value="Servicios">⚡ Servicios</option>
                                        <option value="Insumos">📦 Insumos</option>
                                        <option value="Nómina">👥 Nómina</option>
                                        <option value="Otros">📋 Otros</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white py-3 rounded-xl font-bold hover:from-rose-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" /> Guardar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <X className="w-5 h-5" /> Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}