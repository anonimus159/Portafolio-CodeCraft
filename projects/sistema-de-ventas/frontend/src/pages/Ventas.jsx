import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatPeso } from '../utils/format';
import { ShoppingCart, Calendar, X, FileText, CheckCircle2, Ticket, BarChart3, Info } from 'lucide-react';

export default function Ventas() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroFecha, setFiltroFecha] = useState('');
    const [notificacion, setNotificacion] = useState(null);

    useEffect(() => {
        cargarVentas();
    }, [filtroFecha]);

    const cargarVentas = () => {
        const params = filtroFecha ? { fecha: filtroFecha } : {};
        api.ventas.getAll(params)
            .then(data => setVentas(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const mostrarNotificacion = (mensaje) => {
        setNotificacion(mensaje);
        setTimeout(() => setNotificacion(null), 2000);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full spinner"></div>
        </div>
    );

    const metodoColores = {
        efectivo: { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200', text: 'text-emerald-700', label: '💵' },
        tarjeta: { bg: 'bg-blue-50 text-blue-700 border border-blue-200', text: 'text-blue-700', label: '💳' },
        transferencia: { bg: 'bg-indigo-50 text-indigo-700 border border-indigo-200', text: 'text-indigo-700', label: '📱' }
    };

    return (
        <div className="space-y-6">
            {/* Notification Toast */}
            {notificacion && (
                <div className="fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 text-white transform transition-all duration-300 animate-slideIn backdrop-blur-md border bg-cyan-600/90 border-cyan-400">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold tracking-wide">{notificacion}</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-cyan-600" /> Historial de Ventas
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Gestiona y consulta todas tus ventas</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/pos"
                        className="tech-button px-6 py-3.5 flex items-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Nueva Venta</span>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <label className="text-sm text-slate-500 font-bold uppercase tracking-wider">Filtrar por fecha:</label>
                    </div>
                    <input
                        type="date"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                        className="tech-input max-w-[200px]"
                    />
                    {filtroFecha && (
                        <button
                            onClick={() => setFiltroFecha('')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-1 border border-transparent hover:border-blue-100"
                        >
                            <X className="w-4 h-4" /> Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* Sales Table */}
            <div className="glass-panel rounded-3xl overflow-hidden">
                <div className="p-6 bg-white/40 border-b border-white/60">
                    <h2 className="font-bold text-slate-700 flex items-center gap-2">
                        <Info className="w-5 h-5 text-cyan-600" />
                        <span>Total de ventas: {ventas.length}</span>
                    </h2>
                </div>

                {ventas.length === 0 ? (
                    <div className="text-center py-20">
                        <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No hay ventas</h3>
                        <p className="text-slate-500 font-medium">Aún no se han registrado ventas</p>
                        <Link
                            to="/pos"
                            className="inline-block mt-6 tech-button px-6 py-3"
                        >
                            Realizar primera venta
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full">
                            <thead className="bg-white/50 border-b border-white/60">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Método</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/40">
                                {ventas.map((venta, index) => (
                                    <tr
                                        key={venta.id}
                                        className="hover:bg-white/60 transition-all duration-200 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-800">#{venta.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-700">{new Date(venta.fecha).toLocaleDateString('es-CO')}</div>
                                            <div className="text-xs text-slate-400 font-medium">{new Date(venta.fecha).toLocaleTimeString('es-CO')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                    {venta.usuario_nombre?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{venta.usuario_nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                            {venta.cliente_nombre || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${metodoColores[venta.metodo_pago]?.bg || 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                <span>{metodoColores[venta.metodo_pago]?.label || '💴'}</span>
                                                <span className="capitalize">{venta.metodo_pago}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                                {formatPeso(parseFloat(venta.total))}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                to={`/ventas/${venta.id}/ticket`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 transition-all text-sm font-bold shadow-sm active:scale-95"
                                                onClick={() => mostrarNotificacion('Ticket cargado')}
                                            >
                                                <Ticket className="w-4 h-4" />
                                                <span>Ver ticket</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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