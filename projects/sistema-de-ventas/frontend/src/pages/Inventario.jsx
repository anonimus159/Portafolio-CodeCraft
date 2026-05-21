import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatPeso } from '../utils/format';
import { Package, Search, Plus, AlertTriangle, CheckCircle2, AlertCircle, Edit, Trash2, Box, Info } from 'lucide-react';

export default function Inventario() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [filtro, setFiltro] = useState({ categoria: '', busqueda: '', soloAlertas: false });
    const [notificacion, setNotificacion] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        Promise.all([
            api.productos.getAll(),
            api.categorias.getAll()
        ]).then(([prodData, catData]) => {
            setProductos(prodData);
            setCategorias(catData);
        }).catch(err => console.error(err)).finally(() => setLoading(false));
    };

    const mostrarNotificacion = (mensaje, tipo = 'success') => {
        setNotificacion({ mensaje, tipo });
        setTimeout(() => setNotificacion(null), 2500);
    };

    const productosFiltrados = productos.filter(p => {
        if (filtro.categoria && p.categoria_id !== parseInt(filtro.categoria)) return false;
        if (filtro.busqueda && !p.nombre.toLowerCase().includes(filtro.busqueda.toLowerCase())) return false;
        if (filtro.soloAlertas && p.stock > p.stock_minimo) return false;
        return true;
    });

    const abrirModal = (producto = null) => {
        setProductoEditando(producto);
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setProductoEditando(null);
    };

    const guardarProducto = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            precio: parseFloat(formData.get('precio')),
            stock: parseInt(formData.get('stock')),
            stock_minimo: parseInt(formData.get('stock_minimo')),
            codigo_barras: formData.get('codigo_barras'),
            categoria_id: formData.get('categoria_id') || null
        };

        try {
            if (productoEditando) {
                await api.productos.update(productoEditando.id, data);
                mostrarNotificacion('Producto actualizado ✅');
            } else {
                await api.productos.create(data);
                mostrarNotificacion('Producto creado ✅');
            }
            cerrarModal();
            cargarDatos();
        } catch (err) {
            mostrarNotificacion('Error: ' + err.message, 'error');
        }
    };

    const eliminarProducto = async (id) => {
        if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
        try {
            await api.productos.delete(id);
            mostrarNotificacion('Producto eliminado ✅');
            cargarDatos();
        } catch (err) {
            mostrarNotificacion('Error: ' + err.message, 'error');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full spinner"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xl">📦</span>
                </div>
            </div>
        </div>
    );

    const totalProductos = productos.length;
    const productosAlerta = productos.filter(p => p.stock <= p.stock_minimo).length;
    const totalValor = productos.reduce((sum, p) => sum + (parseFloat(p.precio) * p.stock), 0);

    return (
        <div className="space-y-6">
            {/* Notification Toast */}
            {notificacion && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 text-white transform transition-all duration-300 animate-slideIn backdrop-blur-md border ${
                    notificacion.tipo === 'error' ? 'bg-rose-500/90 border-rose-400' : 'bg-cyan-600/90 border-cyan-400'
                }`}>
                    {notificacion.tipo === 'error' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                    <span className="font-bold tracking-wide">{notificacion.mensaje}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Package className="w-8 h-8 text-cyan-600" /> Productos y Servicios
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Gestiona tu inventario y servicios</p>
                </div>
                <button
                    onClick={() => abrirModal()}
                    className="tech-button px-6 py-3.5 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Producto</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                <div className="glass-card p-6 border-l-4 border-l-blue-500 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total productos</p>
                            <p className="text-4xl font-black text-slate-800 mt-1">{totalProductos}</p>
                        </div>
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
                            <Box className="w-7 h-7 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-amber-500 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Con stock bajo</p>
                            <p className="text-4xl font-black text-amber-600 mt-1">{productosAlerta}</p>
                        </div>
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-inner">
                            <AlertTriangle className="w-7 h-7 text-amber-500" />
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-cyan-500 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Valor total inventario</p>
                            <p className="text-3xl font-black text-cyan-600 mt-1">{formatPeso(totalValor)}</p>
                        </div>
                        <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center border border-cyan-100 shadow-inner">
                            <span className="text-2xl font-black text-cyan-600">$</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            value={filtro.busqueda}
                            onChange={(e) => setFiltro({ ...filtro, busqueda: e.target.value })}
                            placeholder="Buscar producto..."
                            className="tech-input pl-12"
                        />
                    </div>
                    <select
                        value={filtro.categoria}
                        onChange={(e) => setFiltro({ ...filtro, categoria: e.target.value })}
                        className="tech-input w-48"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                    <label className="flex items-center gap-3 px-5 py-2.5 bg-white/60 border border-slate-200 rounded-xl cursor-pointer hover:bg-white hover:border-cyan-300 transition-all">
                        <input
                            type="checkbox"
                            checked={filtro.soloAlertas}
                            onChange={(e) => setFiltro({ ...filtro, soloAlertas: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm font-bold text-slate-700">Solo alertas</span>
                    </label>
                </div>
            </div>

            {/* Products Table */}
            <div className="glass-panel rounded-3xl overflow-hidden">
                <div className="p-6 bg-white/40 border-b border-white/60 flex justify-between items-center">
                    <h2 className="font-bold text-slate-700 flex items-center gap-2">
                        <Info className="w-5 h-5 text-cyan-600" />
                        <span>Mostrando {productosFiltrados.length} productos</span>
                    </h2>
                </div>

                {productosFiltrados.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No hay productos</h3>
                        <p className="text-slate-500 font-medium">Comienza agregando tu primer producto</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full">
                            <thead className="bg-white/50 border-b border-white/60">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Código</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Categoría</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/40">
                                {productosFiltrados.map((producto, index) => (
                                    <tr
                                        key={producto.id}
                                        className="hover:bg-white/60 transition-all duration-200 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{producto.nombre}</p>
                                                    <p className="text-sm text-slate-500 font-medium">{producto.descripcion}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-mono text-slate-600 font-bold border border-slate-200">
                                                {producto.codigo_barras || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold border border-cyan-100 uppercase tracking-wide">
                                                {producto.categoria_nombre || 'Sin categoría'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                                {formatPeso(parseFloat(producto.precio))}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                                                producto.stock <= producto.stock_minimo
                                                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                                                    : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                            }`}>
                                                {producto.stock <= producto.stock_minimo && <AlertTriangle className="w-3.5 h-3.5" />}
                                                {producto.stock} uds
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => abrirModal(producto)}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => eliminarProducto(producto.id)}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all shadow-sm active:scale-95"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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
                    <div className="glass-card w-full max-w-md modal-animate overflow-hidden border border-white/60">
                        <div className="p-6 bg-white/50 border-b border-white/60 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                                {productoEditando ? <Edit className="w-6 h-6 text-cyan-600" /> : <Plus className="w-6 h-6 text-cyan-600" />}
                                {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                        </div>
                        <form onSubmit={guardarProducto} className="p-6 space-y-4 bg-white/40">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    defaultValue={productoEditando?.nombre}
                                    className="tech-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Descripción</label>
                                <input
                                    type="text"
                                    name="descripcion"
                                    defaultValue={productoEditando?.descripcion}
                                    className="tech-input"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Precio *</label>
                                    <input
                                        type="number"
                                        name="precio"
                                        step="0.01"
                                        defaultValue={productoEditando?.precio}
                                        className="tech-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Stock *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        defaultValue={productoEditando?.stock}
                                        className="tech-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Stock mínimo</label>
                                    <input
                                        type="number"
                                        name="stock_minimo"
                                        defaultValue={productoEditando?.stock_minimo}
                                        className="tech-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Código barras</label>
                                    <input
                                        type="text"
                                        name="codigo_barras"
                                        defaultValue={productoEditando?.codigo_barras}
                                        className="tech-input"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Categoría</label>
                                <select
                                    name="categoria_id"
                                    defaultValue={productoEditando?.categoria_id}
                                    className="tech-input"
                                >
                                    <option value="">Sin categoría</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 tech-button py-3 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" /> Guardar
                                </button>
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    Cancelar
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