import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatPeso } from '../utils/format';
import { Wallet, Lock, Unlock, Clock, DollarSign, TrendingUp, History, Info, X } from 'lucide-react';

export default function Caja() {
    const [caja, setCaja] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [montoInicial, setMontoInicial] = useState(0);
    const [montoCierre, setMontoCierre] = useState(0);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        Promise.all([
            api.caja.getAbierta(),
            api.caja.historial()
        ]).then(([cajaData, historialData]) => {
            setCaja(cajaData);
            setHistorial(historialData);
        }).catch(err => console.error(err)).finally(() => setLoading(false));
    };

    const abrirCaja = async () => {
        try {
            await api.caja.apertura({ monto_inicial: montoInicial });
            setModalOpen(false);
            setMontoInicial(0);
            cargarDatos();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const cerrarCaja = async () => {
        if (!caja) return;
        try {
            await api.caja.cierre(caja.id, { monto_final: montoCierre });
            setModalOpen(false);
            setMontoCierre(0);
            cargarDatos();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full spinner"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-cyan-600" /> Control de Caja
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Gestiona las aperturas y cierres de tu caja</p>
                </div>
            </div>

            <div className="glass-card p-8 animate-fade-in-up border-l-4 border-l-cyan-500">
                {caja ? (
                    <div>
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                            <h2 className="text-xl font-black text-slate-700 flex items-center gap-2">
                                <Unlock className="w-6 h-6 text-emerald-500" /> Estado actual
                            </h2>
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Abierta
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Apertura</p>
                                    <p className="font-bold text-slate-800">{new Date(caja.fecha_apertura).toLocaleTimeString()}</p>
                                    <p className="text-xs text-slate-500 font-medium">{new Date(caja.fecha_apertura).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Monto inicial</p>
                                    <p className="text-xl font-black text-slate-800">{formatPeso(parseFloat(caja.monto_inicial))}</p>
                                </div>
                            </div>
                            <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Ventas del día</p>
                                    <p className="text-xl font-black text-emerald-600">{formatPeso(parseFloat(caja.ventas_dia || 0))}</p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-5 rounded-2xl border border-blue-400 shadow-lg shadow-blue-500/20 flex items-center gap-4 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-cyan-100 uppercase tracking-wider mb-1">Total estimado</p>
                                    <p className="text-2xl font-black text-white">{formatPeso(parseFloat(caja.monto_inicial) + parseFloat(caja.ventas_dia || 0))}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => { setMontoCierre(parseFloat(caja.monto_inicial) + parseFloat(caja.ventas_dia || 0)); setModalOpen(true); }}
                                className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95"
                            >
                                <Lock className="w-5 h-5" /> Cerrar Caja
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-300">
                            <Lock className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-black text-slate-700 mb-2">No hay caja abierta</h3>
                        <p className="text-slate-500 font-medium mb-6">Debes abrir una caja para comenzar a registrar ventas.</p>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="tech-button px-8 py-3 inline-flex items-center gap-2"
                        >
                            <Unlock className="w-5 h-5" /> Abrir Caja Ahora
                        </button>
                    </div>
                )}
            </div>

            <h2 className="text-xl font-black text-slate-700 mb-4 flex items-center gap-2 mt-8">
                <History className="w-6 h-6 text-cyan-600" /> Historial de Caja
            </h2>
            <div className="glass-panel rounded-3xl overflow-hidden">
                <div className="p-6 bg-white/40 border-b border-white/60">
                    <h2 className="font-bold text-slate-700 flex items-center gap-2">
                        <Info className="w-5 h-5 text-cyan-600" /> Registro de los últimos cierres
                    </h2>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                        <thead className="bg-white/50 border-b border-white/60">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Fecha apertura</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Inicial</th>
                                <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Final</th>
                                <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/40">
                            {historial.map((h, i) => (
                                <tr key={h.id} className="hover:bg-white/60 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-700">{new Date(h.fecha_apertura).toLocaleDateString()}</div>
                                        <div className="text-xs text-slate-500 font-medium">{new Date(h.fecha_apertura).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                                {h.usuario_nombre?.charAt(0) || 'U'}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{h.usuario_nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-600">
                                        {formatPeso(parseFloat(h.monto_inicial))}
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                        {h.monto_final ? formatPeso(parseFloat(h.monto_final)) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${h.estado === 'abierta' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                            {h.estado === 'abierta' ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> : <Lock className="w-3 h-3" />}
                                            <span className="capitalize">{h.estado}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in-up">
                    <div className="glass-card w-full max-w-sm modal-animate overflow-hidden border border-white/60 shadow-2xl">
                        <div className="p-6 bg-white/50 border-b border-white/60 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                                {caja ? <Lock className="w-6 h-6 text-rose-600" /> : <Unlock className="w-6 h-6 text-emerald-600" />}
                                {caja ? 'Cerrar Caja' : 'Abrir Caja'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 bg-white/40 space-y-6">
                            {caja ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Monto final en caja</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={montoCierre}
                                                onChange={(e) => setMontoCierre(parseFloat(e.target.value) || 0)}
                                                className="tech-input pl-12 text-lg font-black text-slate-800"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 font-medium">Ingresa el efectivo total contado en caja.</p>
                                    </div>
                                    <button onClick={cerrarCaja} className="w-full bg-gradient-to-r from-rose-500 to-red-600 text-white py-3 rounded-xl font-bold hover:from-rose-600 hover:to-red-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                                        <Lock className="w-5 h-5" /> Confirmar Cierre
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Monto inicial de apertura</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={montoInicial}
                                                onChange={(e) => setMontoInicial(parseFloat(e.target.value) || 0)}
                                                className="tech-input pl-12 text-lg font-black text-slate-800"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 font-medium">Efectivo base disponible para dar vueltos.</p>
                                    </div>
                                    <button onClick={abrirCaja} className="w-full tech-button py-3 flex items-center justify-center gap-2">
                                        <Unlock className="w-5 h-5" /> Confirmar Apertura
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}