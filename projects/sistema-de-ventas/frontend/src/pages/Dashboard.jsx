import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPeso } from '../utils/format';
import { LayoutDashboard, MonitorPlay, Package, ArrowDownToLine, FileText, AlertTriangle, Users, BarChart, Clock, CreditCard, ChevronRight, CheckSquare } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [resumen, setResumen] = useState(null);
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.reportes.resumen(),
            api.productos.getAlertas()
        ]).then(([resumenData, alertasData]) => {
            setResumen(resumenData);
            setAlertas(alertasData);
        }).catch(err => console.error(err)).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full spinner"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">C</span>
                </div>
            </div>
        </div>
    );

    const statCards = [
        { label: 'Ventas hoy', value: resumen?.ventas_hoy?.total || 0, ventas: resumen?.ventas_hoy?.ventas || 0, color: 'green', icon: CreditCard, gradient: 'from-blue-400 to-cyan-500' },
        { label: 'Ventas del mes', value: resumen?.ventas_mes?.total || 0, ventas: resumen?.ventas_mes?.ventas || 0, color: 'blue', icon: BarChart, gradient: 'from-cyan-400 to-teal-400' },
        { label: 'Gastos del mes', value: resumen?.gastos_mes?.total || 0, color: 'red', icon: FileText, gradient: 'from-sky-400 to-blue-500' },
        { label: 'Alertas inventario', value: resumen?.alertas_stock || 0, color: 'orange', icon: AlertTriangle, gradient: 'from-indigo-400 to-blue-600' }
    ];

    const quickAccess = [
        { to: '/pos', bg: 'bg-gradient-to-br from-cyan-500 to-blue-600', hover: 'hover:from-cyan-600 hover:to-blue-700', icon: MonitorPlay, label: 'Punto de Venta' },
        { to: '/inventario', bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', hover: 'hover:from-blue-600 hover:to-indigo-700', icon: Package, label: 'Productos' },
        { to: '/compras', bg: 'bg-gradient-to-br from-sky-500 to-cyan-600', hover: 'hover:from-sky-600 hover:to-cyan-700', icon: ArrowDownToLine, label: 'Entradas' },
        { to: '/reportes', bg: 'bg-gradient-to-br from-indigo-500 to-purple-600', hover: 'hover:from-indigo-600 hover:to-purple-700', icon: BarChart, label: 'Reportes' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        Bienvenido, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{user?.nombre}</span>
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Panel de control de Papelería</p>
                </div>
                <div className="text-right hidden sm:block glass-panel px-5 py-3 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fecha actual</p>
                    <p className="font-bold text-slate-700">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-xl p-6 text-white shadow-lg card-hover animate-fade-in-up`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-5 rounded-full -ml-8 -mb-8"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold opacity-90">{card.label}</p>
                                <span className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                    <card.icon className="w-6 h-6 text-white" />
                                </span>
                            </div>
                            <p className="text-3xl font-bold mt-2">{formatPeso(card.value)}</p>
                            {card.ventas !== undefined && (
                                <p className="text-xs opacity-80 mt-1">{card.ventas} ventas</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Access & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Access */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-blue-500" /> Accesos Rápidos
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {quickAccess.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                className={`${item.bg} ${item.hover} text-white p-5 rounded-2xl text-center transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_15px_rgba(6,182,212,0.2)]`}
                            >
                                <item.icon className="w-8 h-8 mx-auto mb-3 animate-float" style={{ animationDelay: `${index * 0.2}s` }} />
                                <p className="font-bold text-sm tracking-wide">{item.label}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Alerts */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" /> Alertas de Inventario
                        {alertas.length > 0 && (
                            <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm animate-bounce-in">
                                {alertas.length}
                            </span>
                        )}
                    </h2>
                    {alertas.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-100">
                                <CheckSquare className="w-8 h-8 text-green-500" />
                            </div>
                            <p className="text-slate-500 font-medium">Todo bajo control. No hay alertas.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {alertas.slice(0, 5).map((producto, index) => (
                                <div
                                    key={producto.id}
                                    className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-red-100/50 hover:bg-white transition-all shadow-sm group animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center border border-red-100 group-hover:bg-red-100 transition-colors">
                                            <Package className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{producto.nombre}</p>
                                            <p className="text-xs text-gray-400">{producto.codigo_barras}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-red-600 font-bold text-lg">{producto.stock}</p>
                                        <p className="text-xs text-gray-400">min: {producto.stock_minimo}</p>
                                    </div>
                                </div>
                            ))}
                            {alertas.length > 5 && (
                                <Link
                                    to="/inventario"
                                    className="block text-center text-blue-500 hover:text-blue-600 text-sm font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    Ver todas las {alertas.length} alertas →
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-indigo-500" /> Resumen Operativo
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-5 bg-white/60 rounded-2xl hover:bg-blue-50/80 transition-colors border border-slate-100 shadow-sm">
                        <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Productos</p>
                        <p className="font-black text-2xl text-slate-800">15</p>
                    </div>
                    <div className="p-5 bg-white/60 rounded-2xl hover:bg-cyan-50/80 transition-colors border border-slate-100 shadow-sm">
                        <Users className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Clientes</p>
                        <p className="font-black text-2xl text-slate-800">3</p>
                    </div>
                    <div className="p-5 bg-white/60 rounded-2xl hover:bg-indigo-50/80 transition-colors border border-slate-100 shadow-sm">
                        <MonitorPlay className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Equipos</p>
                        <p className="font-black text-2xl text-slate-800">3</p>
                    </div>
                    <div className="p-5 bg-white/60 rounded-2xl hover:bg-purple-50/80 transition-colors border border-slate-100 shadow-sm">
                        <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ventas del mes</p>
                        <p className="font-black text-2xl text-slate-800">{resumen?.ventas_mes?.ventas || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}