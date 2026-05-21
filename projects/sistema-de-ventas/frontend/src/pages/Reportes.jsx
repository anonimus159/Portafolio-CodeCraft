import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import api from '../services/api';
import { formatPeso } from '../utils/format';
import { BarChart3, TrendingUp, DollarSign, Package, Calendar, Activity, Info } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

export default function Reportes() {
    const [periodo, setPeriodo] = useState('semana');
    const [ventasData, setVentasData] = useState(null);
    const [productosData, setProductosData] = useState([]);
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, [periodo]);

    const cargarDatos = () => {
        setLoading(true);
        Promise.all([
            api.reportes.ventas(periodo),
            api.reportes.productosMasVendidos(),
            api.reportes.resumen()
        ]).then(([ventas, productos, resumenData]) => {
            setVentasData(ventas);
            setProductosData(productos);
            setResumen(resumenData);
        }).catch(err => console.error(err)).finally(() => setLoading(false));
    };

    const ventasChartData = {
        labels: ventasData?.detalle?.map(v => new Date(v.fecha).toLocaleDateString()) || [],
        datasets: [{
            label: 'Ventas ($)',
            data: ventasData?.detalle?.map(v => parseFloat(v.total)) || [],
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            borderColor: 'rgba(6, 182, 212, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgba(6, 182, 212, 1)',
        }]
    };

    const productosChartData = {
        labels: productosData.map(p => p.nombre),
        datasets: [{
            label: 'Cantidad vendida',
            data: productosData.map(p => p.cantidad_vendida),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 6,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { position: 'top', labels: { font: { family: "'Outfit', sans-serif" } } } 
        },
        scales: { 
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
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
                        <BarChart3 className="w-8 h-8 text-cyan-600" /> Reportes y Estadísticas
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Analiza el rendimiento de tu negocio</p>
                </div>
                <div className="flex items-center gap-3 bg-white/60 p-2 rounded-xl border border-white">
                    <Calendar className="w-5 h-5 text-slate-400 ml-2" />
                    <select
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-slate-700 font-bold py-2 pr-8 pl-2 outline-none cursor-pointer"
                    >
                        <option value="dia">Hoy</option>
                        <option value="semana">Última semana</option>
                        <option value="mes">Último mes</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                <div className="glass-card p-6 border-l-4 border-l-cyan-500 animate-fade-in-up">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ingresos {periodo === 'dia' ? 'hoy' : periodo === 'semana' ? 'esta semana' : 'este mes'}</p>
                            <p className="text-4xl font-black text-slate-800 mt-1">{formatPeso(parseFloat(ventasData?.resumen?.ingreso_total || 0))}</p>
                        </div>
                        <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center border border-cyan-100 shadow-inner">
                            <TrendingUp className="w-7 h-7 text-cyan-600" />
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-blue-500 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total de Ventas</p>
                            <p className="text-4xl font-black text-blue-600 mt-1">{ventasData?.resumen?.total_ventas || 0}</p>
                        </div>
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
                            <Activity className="w-7 h-7 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-rose-500 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Gastos del mes</p>
                            <p className="text-4xl font-black text-rose-600 mt-1">{formatPeso(parseFloat(resumen?.gastos_mes?.total || 0))}</p>
                        </div>
                        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shadow-inner">
                            <DollarSign className="w-7 h-7 text-rose-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl">
                    <h2 className="text-lg font-black text-slate-700 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-600" /> Ventas por día
                    </h2>
                    {ventasData?.detalle?.length > 0 ? (
                        <div className="h-72">
                            <Line data={ventasChartData} options={chartOptions} />
                        </div>
                    ) : (
                        <div className="h-72 flex flex-col items-center justify-center text-slate-400">
                            <Activity className="w-12 h-12 mb-3 opacity-20" />
                            <p className="font-medium">No hay datos para mostrar</p>
                        </div>
                    )}
                </div>

                <div className="glass-panel p-6 rounded-3xl">
                    <h2 className="text-lg font-black text-slate-700 mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" /> Productos más vendidos
                    </h2>
                    {productosData.length > 0 ? (
                        <div className="h-72">
                            <Bar data={productosChartData} options={chartOptions} />
                        </div>
                    ) : (
                        <div className="h-72 flex flex-col items-center justify-center text-slate-400">
                            <Package className="w-12 h-12 mb-3 opacity-20" />
                            <p className="font-medium">No hay datos para mostrar</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden mt-6">
                <div className="p-6 bg-white/40 border-b border-white/60">
                    <h2 className="font-black text-slate-700 flex items-center gap-2">
                        <Info className="w-5 h-5 text-cyan-600" /> Top 10 Productos más vendidos
                    </h2>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                        <thead className="bg-white/50 border-b border-white/60">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Código</th>
                                <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Cantidad</th>
                                <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/40">
                            {productosData.map((p, i) => (
                                <tr key={i} className="hover:bg-white/60 transition-all duration-200">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <span className="font-bold text-slate-800">{p.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-mono text-slate-600 font-bold border border-slate-200">
                                            {p.codigo_barras || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-100">
                                            {p.cantidad_vendida} uds
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                            {formatPeso(parseFloat(p.total_vendido))}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {productosData.length === 0 && (
                        <div className="text-center py-12 text-slate-500 font-medium">No hay datos de productos</div>
                    )}
                </div>
            </div>
        </div>
    );
}