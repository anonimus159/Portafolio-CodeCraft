import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatPeso } from '../utils/format';
import { Calculator, DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Save, RefreshCw, FileText, CheckCircle2, ClipboardList, Info, Eye, History } from 'lucide-react';

export default function Cuadre() {
    const [formulario, setFormulario] = useState({
        ventas_efectivo: '',
        ventas_tarjeta: '',
        ventas_transferencia: '',
        gastos: '',
        deudas_cobradas: '',
        deudas_pendientes: '',
        monto_inicial: '',
        observaciones: ''
    });
    const [resumen, setResumen] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        setLoading(true);
        Promise.all([
            api.cuadres.getResumen(),
            api.cuadres.getAll()
        ]).then(([resumenData, historialData]) => {
            setResumen(resumenData);
            setHistorial(historialData);

            // Pre-llenar con los valores del resumen
            setFormulario(prev => ({
                ...prev,
                ventas_efectivo: resumenData.ventas?.ventas_efectivo || '',
                ventas_tarjeta: resumenData.ventas?.ventas_tarjeta || '',
                ventas_transferencia: resumenData.ventas?.ventas_transferencia || '',
                gastos: resumenData.gastos || '',
                monto_inicial: resumenData.monto_inicial || ''
            }));
        }).catch(err => console.error(err)).finally(() => setLoading(false));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario(prev => ({ ...prev, [name]: value }));
    };

    const calcularTotales = () => {
        const ventasEfec = parseFloat(formulario.ventas_efectivo) || 0;
        const ventasTarjeta = parseFloat(formulario.ventas_tarjeta) || 0;
        const ventasTransfer = parseFloat(formulario.ventas_transferencia) || 0;
        const gastos = parseFloat(formulario.gastos) || 0;
        const deudasCobradas = parseFloat(formulario.deudas_cobradas) || 0;
        const montoInicial = parseFloat(formulario.monto_inicial) || 0;

        const totalVentas = ventasEfec + ventasTarjeta + ventasTransfer;
        const totalIngresos = totalVentas + deudasCobradas + montoInicial;
        const totalEgresos = gastos;
        const diferencia = totalIngresos - totalEgresos;

        return { totalVentas, totalIngresos, totalEgresos, diferencia };
    };

    const totales = calcularTotales();

    const guardarCuadre = async () => {
        setGuardando(true);
        try {
            await api.cuadres.create({
                ...formulario,
                ventas_efectivo: parseFloat(formulario.ventas_efectivo) || 0,
                ventas_tarjeta: parseFloat(formulario.ventas_tarjeta) || 0,
                ventas_transferencia: parseFloat(formulario.ventas_transferencia) || 0,
                gastos: parseFloat(formulario.gastos) || 0,
                deudas_cobradas: parseFloat(formulario.deudas_cobradas) || 0,
                deudas_pendientes: parseFloat(formulario.deudas_pendientes) || 0,
                monto_inicial: parseFloat(formulario.monto_inicial) || 0
            });
            alert('Cuadre guardado correctamente');
            cargarDatos();
            // Reset formulario
            setFormulario({
                ventas_efectivo: '',
                ventas_tarjeta: '',
                ventas_transferencia: '',
                gastos: '',
                deudas_cobradas: '',
                deudas_pendientes: '',
                monto_inicial: '',
                observaciones: ''
            });
        } catch (err) {
            alert('Error al guardar: ' + err.message);
        } finally {
            setGuardando(false);
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
                        <Calculator className="w-8 h-8 text-cyan-600" /> Cuadre de Caja
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Realiza el cierre y cuadre de tu jornada de ventas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna izquierda - Entradas */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Ventas */}
                    <div className="glass-card p-6 border-l-4 border-l-emerald-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                        <h2 className="text-lg font-black text-slate-700 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" /> Ventas del día
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-emerald-500" /> Efectivo
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        name="ventas_efectivo"
                                        value={formulario.ventas_efectivo}
                                        onChange={handleChange}
                                        className="tech-input pl-10"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-blue-500" /> Tarjeta
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        name="ventas_tarjeta"
                                        value={formulario.ventas_tarjeta}
                                        onChange={handleChange}
                                        className="tech-input pl-10"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-indigo-500" /> Transferencia
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        name="ventas_transferencia"
                                        value={formulario.ventas_transferencia}
                                        onChange={handleChange}
                                        className="tech-input pl-10"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Total Ventas Registradas:</span>
                            <span className="text-xl font-black text-emerald-600">{formatPeso(totales.totalVentas)}</span>
                        </div>
                    </div>

                    {/* Egresos */}
                    <div className="glass-card p-6 border-l-4 border-l-rose-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                        <h2 className="text-lg font-black text-slate-700 mb-6 flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-rose-500" /> Egresos y Base
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-rose-500" /> Gastos del día
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        name="gastos"
                                        value={formulario.gastos}
                                        onChange={handleChange}
                                        className="tech-input pl-10 border-rose-200 focus:ring-rose-500"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-amber-500" /> Monto inicial en caja
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        name="monto_inicial"
                                        value={formulario.monto_inicial}
                                        onChange={handleChange}
                                        className="tech-input pl-10 border-amber-200 focus:ring-amber-500"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deudas */}
                    <div className="glass-card p-6 border-l-4 border-l-blue-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                        <h2 className="text-lg font-black text-slate-700 mb-6 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-blue-500" /> Deudas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Deudas cobradas
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        name="deudas_cobradas"
                                        value={formulario.deudas_cobradas}
                                        onChange={handleChange}
                                        className="tech-input pl-10"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-rose-500" /> Deudas pendientes (Créditos)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        name="deudas_pendientes"
                                        value={formulario.deudas_pendientes}
                                        onChange={handleChange}
                                        className="tech-input pl-10"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="glass-card p-6 border-l-4 border-l-slate-400">
                        <h2 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-slate-500" /> Observaciones
                        </h2>
                        <textarea
                            name="observaciones"
                            value={formulario.observaciones}
                            onChange={handleChange}
                            className="tech-input w-full min-h-[100px] resize-y"
                            rows="3"
                            placeholder="Notas adicionales sobre el cuadre, faltantes o sobrantes..."
                        />
                    </div>
                </div>

                {/* Columna derecha - Resumen y botones */}
                <div className="space-y-6">
                    {/* Resumen */}
                    <div className="glass-card p-6 sticky top-6">
                        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 pb-4 border-b border-slate-200">
                            <Calculator className="w-6 h-6 text-cyan-600" /> Resumen
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2">
                                <span className="font-bold text-slate-500">Total Ventas</span>
                                <span className="font-bold text-slate-800">{formatPeso(totales.totalVentas)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="font-bold text-slate-500">+ Deudas cobradas</span>
                                <span className="font-bold text-slate-800">{formatPeso(parseFloat(formulario.deudas_cobradas) || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="font-bold text-slate-500">+ Monto inicial</span>
                                <span className="font-bold text-slate-800">{formatPeso(parseFloat(formulario.monto_inicial) || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 bg-cyan-50/50 -mx-6 px-6 border-y border-cyan-100">
                                <span className="font-black text-cyan-800 uppercase tracking-wider text-sm">Total Ingresos</span>
                                <span className="font-black text-cyan-600 text-lg">{formatPeso(totales.totalIngresos)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="font-bold text-slate-500">- Gastos</span>
                                <span className="font-bold text-rose-600">{formatPeso(totales.totalEgresos)}</span>
                            </div>
                            
                            <div className={`flex justify-between items-center p-4 mt-6 rounded-2xl border ${totales.diferencia >= 0 ? 'bg-emerald-50 border-emerald-200 shadow-emerald-500/10' : 'bg-rose-50 border-rose-200 shadow-rose-500/10'} shadow-lg`}>
                                <span className="font-black text-slate-700 uppercase tracking-wider">Efectivo Total</span>
                                <span className={`text-2xl font-black ${totales.diferencia >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {formatPeso(totales.diferencia)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            <button
                                onClick={guardarCuadre}
                                disabled={guardando}
                                className="w-full tech-button py-4 flex items-center justify-center gap-2 text-lg"
                            >
                                {guardando ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
                                {guardando ? 'Guardando...' : 'Guardar Cuadre'}
                            </button>

                            <button
                                onClick={cargarDatos}
                                className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4" /> Actualizar datos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historial de cuadres */}
            <div className="mt-12">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                    <History className="w-7 h-7 text-cyan-600" /> Historial de Cuadres
                </h2>
                <div className="glass-panel rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full">
                            <thead className="bg-white/50 border-b border-white/60">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Ventas</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Gastos</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Ingresos</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Total Efectivo</th>
                                    <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/40">
                                {historial.map((cuadre, index) => (
                                    <tr key={cuadre.id} className="hover:bg-white/60 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 30}ms` }}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-700">{new Date(cuadre.fecha).toLocaleDateString()}</div>
                                            <div className="text-xs text-slate-500 font-medium">{new Date(cuadre.fecha).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                    {cuadre.usuario_nombre?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{cuadre.usuario_nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-700">{formatPeso(parseFloat(cuadre.total_ventas))}</td>
                                        <td className="px-6 py-4 text-right font-bold text-rose-500">{formatPeso(parseFloat(cuadre.gastos))}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-700">{formatPeso(parseFloat(cuadre.total_ingresos))}</td>
                                        <td className={`px-6 py-4 text-right font-black ${parseFloat(cuadre.diferencia) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {formatPeso(parseFloat(cuadre.diferencia))}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 transition-all shadow-sm active:scale-95 inline-flex items-center justify-center" title="Ver detalles">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {historial.length === 0 && (
                            <div className="text-center py-16">
                                <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No hay cuadres</h3>
                                <p className="text-slate-500 font-medium">Aún no se han registrado cuadres de caja.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}