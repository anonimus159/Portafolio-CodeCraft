import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatPeso } from '../utils/format';
import { MonitorPlay, Search, Package, ShoppingCart, X, Plus, Minus, CreditCard, Banknote, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';

export default function POS() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [loading, setLoading] = useState(true);
    const [notificacion, setNotificacion] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        Promise.all([
            api.productos.getAll({ activo: 'true' }),
            api.categorias.getAll()
        ]).then(([prodData, catData]) => {
            setProductos(prodData);
            setCategorias(catData);
        }).catch(err => console.error(err)).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const mostrarNotificacion = (mensaje, tipo = 'success') => {
        setNotificacion({ mensaje, tipo });
        setTimeout(() => setNotificacion(null), 2000);
    };

    const productosFiltrados = productos.filter(p => {
        const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            (p.codigo_barras && p.codigo_barras.includes(busqueda));
        const matchCategoria = !categoriaSeleccionada || p.categoria_id === parseInt(categoriaSeleccionada);
        return matchBusqueda && matchCategoria;
    });

    const agregarAlCarrito = (producto) => {
        const existente = carrito.find(item => item.producto_id === producto.id);
        if (existente) {
            setCarrito(carrito.map(item =>
                item.producto_id === producto.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCarrito([...carrito, {
                producto_id: producto.id,
                nombre: producto.nombre,
                precio: parseFloat(producto.precio),
                cantidad: 1
            }]);
        }
        mostrarNotificacion(`${producto.nombre} añadido`);
    };

    const actualizarCantidad = (producto_id, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            setCarrito(carrito.filter(item => item.producto_id !== producto_id));
        } else {
            setCarrito(carrito.map(item =>
                item.producto_id === producto_id ? { ...item, cantidad: nuevaCantidad } : item
            ));
        }
    };

    const eliminarDelCarrito = (producto_id) => {
        setCarrito(carrito.filter(item => item.producto_id !== producto_id));
    };

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    const procesarVenta = async () => {
        if (carrito.length === 0) return;

        try {
            const result = await api.ventas.create({
                productos: carrito.map(item => ({
                    producto_id: item.producto_id,
                    cantidad: item.cantidad
                })),
                metodo_pago: metodoPago
            });

            setCarrito([]);
            mostrarNotificacion('¡Venta procesada con éxito! 🎉');
            setTimeout(() => navigate(`/ventas/${result.id}/ticket`), 1500);
        } catch (err) {
            mostrarNotificacion('Error: ' + err.message, 'error');
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && busqueda.length > 0) {
            try {
                const producto = await api.productos.getByBarras(busqueda);
                agregarAlCarrito(producto);
                setBusqueda('');
            } catch {
                mostrarNotificacion('Producto no encontrado', 'error');
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full spinner"></div>
        </div>
    );

    const metodosPago = [
        { value: 'efectivo', label: '💵 Efectivo', color: 'from-green-400 to-emerald-500' },
        { value: 'tarjeta', label: '💳 Tarjeta', color: 'from-blue-400 to-indigo-500' },
        { value: 'transferencia', label: '📱 Transferencia', color: 'from-purple-400 to-violet-500' }
    ];

    return (
        <div className="flex gap-6 h-screen relative">
            {/* Notification Toast */}
            {notificacion && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 text-white transform transition-all duration-300 animate-slideIn backdrop-blur-md border ${
                    notificacion.tipo === 'error' ? 'bg-rose-500/90 border-rose-400' : 'bg-cyan-600/90 border-cyan-400'
                }`}>
                    {notificacion.tipo === 'error' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                    <span className="font-bold tracking-wide">{notificacion.mensaje}</span>
                </div>
            )}

            {/* Panel izquierdo - Productos */}
            <div className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden">
                <div className="p-6 bg-white/40 border-b border-white/60">
                    <h2 className="text-2xl font-black text-slate-800 mb-5 flex items-center gap-3 tracking-tight">
                        <MonitorPlay className="w-7 h-7 text-cyan-600" /> Productos y Servicios
                    </h2>
                    <div className="flex gap-4 mb-5">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Buscar por nombre o código..."
                                className="tech-input pl-12 py-3"
                            />
                        </div>
                        <select
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                            className="tech-input w-48 py-3"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        <button
                            onClick={() => setCategoriaSeleccionada('')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                categoriaSeleccionada === '' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30' : 'bg-white/60 text-slate-600 hover:bg-white hover:text-cyan-600 border border-white'
                            }`}
                        >
                            Todos
                        </button>
                        {categorias.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategoriaSeleccionada(cat.id.toString())}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    categoriaSeleccionada === cat.id.toString() ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30' : 'bg-white/60 text-slate-600 hover:bg-white hover:text-cyan-600 border border-white'
                                }`}
                            >
                                {cat.nombre}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-transparent custom-scrollbar">
                    <div className="grid grid-cols-3 gap-4">
                        {productosFiltrados.map(producto => (
                            <button
                                key={producto.id}
                                onClick={() => agregarAlCarrito(producto)}
                                className="bg-white/60 backdrop-blur-sm border border-white rounded-2xl p-5 text-left hover:shadow-[0_8px_30px_rgb(6,182,212,0.12)] hover:border-cyan-300 hover:bg-white/90 hover:-translate-y-1 transition-all duration-300 active:scale-95 group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 group-hover:scale-110 group-hover:bg-cyan-100 transition-all">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${
                                        producto.stock > producto.stock_minimo ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                        {producto.stock} uds
                                    </span>
                                </div>
                                <p className="font-bold text-slate-700 text-sm mb-2 line-clamp-2 leading-snug">{producto.nombre}</p>
                                <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                    {formatPeso(parseFloat(producto.precio))}
                                </p>
                            </button>
                        ))}
                    </div>
                    {productosFiltrados.length === 0 && (
                        <div className="text-center py-20">
                            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium text-lg">No se encontraron productos con esos filtros</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Panel derecho - Carrito */}
            <div className="w-[420px] glass-panel rounded-3xl flex flex-col overflow-hidden">
                <div className="p-6 bg-white/40 border-b border-white/60">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center justify-between tracking-tight">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-7 h-7 text-cyan-600" /> Venta Actual
                        </div>
                        {carrito.length > 0 && (
                            <span className="bg-cyan-600 text-white text-sm px-3 py-1 rounded-xl font-bold shadow-sm">
                                {carrito.reduce((sum, item) => sum + item.cantidad, 0)} items
                            </span>
                        )}
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {carrito.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="w-10 h-10 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-bold text-lg">Carrito vacío</p>
                            <p className="text-sm text-slate-400 mt-1 font-medium">Añade productos para comenzar</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {carrito.map(item => (
                                <div
                                    key={item.producto_id}
                                    className="bg-white/80 border border-slate-100 p-4 rounded-2xl hover:shadow-[0_4px_15px_rgba(6,182,212,0.08)] transition-all animate-fade-in-up"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <p className="font-bold text-slate-700 leading-tight pr-4">{item.nombre}</p>
                                        <button
                                            onClick={() => eliminarDelCarrito(item.producto_id)}
                                            className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition-colors flex-shrink-0"
                                        ><X className="w-4 h-4" /></button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                                            <button
                                                onClick={() => actualizarCantidad(item.producto_id, item.cantidad - 1)}
                                                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-slate-600 hover:text-cyan-600 shadow-sm transition-colors active:scale-90"
                                            ><Minus className="w-4 h-4" /></button>
                                            <span className="w-10 text-center font-black text-slate-700">{item.cantidad}</span>
                                            <button
                                                onClick={() => actualizarCantidad(item.producto_id, item.cantidad + 1)}
                                                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-slate-600 hover:text-cyan-600 shadow-sm transition-colors active:scale-90"
                                            ><Plus className="w-4 h-4" /></button>
                                        </div>
                                        <p className="font-black text-cyan-600 text-lg">{formatPeso(item.precio * item.cantidad)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white/60 border-t border-white/80">
                    {/* Método de pago */}
                    <div className="mb-5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Método de pago</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setMetodoPago('efectivo')}
                                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                                    metodoPago === 'efectivo'
                                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-600 ring-offset-2'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-cyan-300'
                                }`}
                            ><Banknote className="w-5 h-5" /> Efectivo</button>
                            <button
                                onClick={() => setMetodoPago('tarjeta')}
                                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                                    metodoPago === 'tarjeta'
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-300'
                                }`}
                            ><CreditCard className="w-5 h-5" /> Tarjeta</button>
                            <button
                                onClick={() => setMetodoPago('transferencia')}
                                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                                    metodoPago === 'transferencia'
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-600 ring-offset-2'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-300'
                                }`}
                            ><Smartphone className="w-5 h-5" /> Transfer</button>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center text-xl font-bold mb-5 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100">
                        <span className="text-slate-700">Total a Pagar:</span>
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                            {formatPeso(total)}
                        </span>
                    </div>

                    {/* Botón Cobrar */}
                    <button
                        onClick={procesarVenta}
                        disabled={carrito.length === 0}
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                            carrito.length === 0
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'tech-button text-white'
                        }`}
                    >
                        <ShoppingCart className="w-6 h-6" />
                        <span>Procesar Venta</span>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}