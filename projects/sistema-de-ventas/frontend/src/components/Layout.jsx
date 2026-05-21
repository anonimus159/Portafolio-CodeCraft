import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, MonitorPlay, Package, ShoppingCart, ArrowDownToLine, Users, FileText, Wallet, CheckSquare, BarChart, BookOpen } from 'lucide-react';

const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pos', label: 'Punto de Venta', icon: MonitorPlay },
    { path: '/inventario', label: 'Productos', icon: Package },
    { path: '/ventas', label: 'Ventas', icon: ShoppingCart },
    { path: '/compras', label: 'Entradas', icon: ArrowDownToLine },
    { path: '/proveedores', label: 'Proveedores', icon: Users },
    { path: '/gastos', label: 'Gastos', icon: FileText },
    { path: '/caja', label: 'Caja', icon: Wallet },
    { path: '/cuadre', label: 'Cuadre', icon: CheckSquare },
    { path: '/reportes', label: 'Reportes', icon: BarChart },
];

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user?.rol === 'admin';

    return (
        <div className="min-h-screen flex bg-transparent">
            {/* Sidebar */}
            <aside className="w-64 glass-panel border-r border-white/50 flex flex-col z-20 shadow-[4px_0_24px_rgba(6,182,212,0.05)]">
                {/* Header */}
                <div className="p-5 border-b border-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-800 tracking-tight">Papelería</h1>
                            <p className="text-xs text-slate-500 font-medium">Sistema POS</p>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <p className="text-sm font-bold text-slate-700">{user?.nombre}</p>
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                            user?.rol === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                            {user?.rol === 'admin' ? '👑 Administrador' : '👤 Cajero'}
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {menuItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden relative ${
                                    isActive
                                        ? 'text-blue-700 bg-blue-50/80 shadow-[0_4px_15px_rgba(6,182,212,0.1)]'
                                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50/50'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-cyan-50/50 border-l-4 border-cyan-500 z-0"></div>
                                )}
                                <item.icon className={`w-5 h-5 flex-shrink-0 z-10 transition-colors duration-300 ${isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-cyan-500'}`} />
                                <span className="font-bold text-sm z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                    {isAdmin && (
                        <Link
                            to="/usuarios"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden relative ${
                                location.pathname === '/usuarios'
                                    ? 'text-blue-700 bg-blue-50/80 shadow-[0_4px_15px_rgba(6,182,212,0.1)]'
                                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50/50'
                            }`}
                        >
                            {location.pathname === '/usuarios' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-cyan-50/50 border-l-4 border-cyan-500 z-0"></div>
                            )}
                            <Users className={`w-5 h-5 flex-shrink-0 z-10 transition-colors duration-300 ${location.pathname === '/usuarios' ? 'text-cyan-600' : 'text-slate-400 group-hover:text-cyan-500'}`} />
                            <span className="font-bold text-sm z-10">Usuarios</span>
                        </Link>
                    )}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200/50 bg-white/30 backdrop-blur-md">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 px-4 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        Cerrar Sesión
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                        © 2024 Papelería - Sistema POS
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto relative z-10">
                <div className="animate-fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
}