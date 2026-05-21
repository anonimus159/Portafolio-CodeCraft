import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatPeso } from '../utils/format';
import { ShoppingCart, Plus, X, Calendar, User, Store, Package, ListOrdered, ClipboardList } from 'lucide-react';

export default function Compras() {
    const [compras, setCompras] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        Promise.all([
            api.compras.getAll(),
            api.proveedores.getAll(),
            api.productos.getAll({ activo: 'true' })
        ]).then(([comprasData, provData, prodData]) => {
            setCompras(comprasData);
            setProveedores(provData);
            setProductos(prodData);
        }).catch(err => console.error(err)).finally(() => setLoading(false));
    };

    const guardarCompra = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productosSeleccionados = [];

        const filas = e.target.querySelectorAll('#productos-compra tbody tr');
        filas.forEach(fila => {
            const prodId = fila.querySelector('[name="producto_id"]').value;
            const cantidad = parseInt(fila.querySelector('[name="cantidad"]').value);
            if (prodId && cantidad > 0) {
                productosSeleccionados.push({ producto_id: parseInt(prodId), cantidad });
            }
        });

        try {
            await api.compras.create({
                proveedor_id: parseInt(formData.get('proveedor_id')),
                productos: productosSeleccionados
            });
            setModalOpen(false);
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
                        <ShoppingCart className="w-8 h-8 text-cyan-600" /> Compras
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Gestiona el abastecimiento y compras a proveedores</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="tech-button px-6 py-3 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Nueva Compra
                </button>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden mt-8">
                <div className="p-6 bg-white/40 border-b border-white/60">
                    <h2 className="font-black text-slate-700 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-cyan-600" /> Historial de Compras
                    </h2>
                </div>

                {compras.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No hay compras</h3>
                        <p className="text-slate-500 font-medium">No se han registrado compras de inventario aún.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full">
                            <thead className="bg-white/50 border-b border-white/60">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Proveedor</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/40">
                                {compras.map((compra, index) => (
                                    <tr key={compra.id} className="hover:bg-white/60 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 30}ms` }}>
                                        <td className="px-6 py-4 font-bold text-slate-700">
                                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs border border-slate-200">
                                                #{compra.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {new Date(compra.fecha).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium ml-6">{new Date(compra.fecha).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Store className="w-4 h-4 text-emerald-500" />
                                                <span className="font-bold text-slate-800">{compra.proveedor_nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                    {compra.usuario_nombre?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{compra.usuario_nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                                {formatPeso(parseFloat(compra.total))}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in-up p-4">
                    <div className="glass-card w-full max-w-2xl modal-animate overflow-hidden border border-white/60 shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 bg-white/50 border-b border-white/60 flex items-center justify-between shrink-0">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                                <ShoppingCart className="w-6 h-6 text-cyan-600" /> Nueva Compra
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={guardarCompra} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 bg-white/40 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                        <Store className="w-4 h-4 text-emerald-500" /> Proveedor
                                    </label>
                                    <select name="proveedor_id" className="tech-input bg-white/50" required>
                                        <option value="">Seleccionar proveedor...</option>
                                        {proveedores.map(p => (
                                            <option key={p.id} value={p.id}>{p.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-cyan-600" /> Productos a comprar
                                    </label>
                                    <div className="glass-panel rounded-xl overflow-hidden">
                                        <table id="productos-compra" className="w-full">
                                            <thead className="bg-white/50 border-b border-white/60">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Producto</th>
                                                    <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider w-32">Cantidad</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/40">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <tr key={i} className="hover:bg-white/60 transition-colors">
                                                        <td className="px-4 py-2">
                                                            <div className="relative">
                                                                <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                                <select name="producto_id" className="tech-input py-2 pl-9 pr-3 text-sm bg-white/50">
                                                                    <option value="">Seleccionar...</option>
                                                                    {productos.map(p => (
                                                                        <option key={p.id} value={p.id}>{p.nombre} - {formatPeso(p.precio)}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input 
                                                                type="number" 
                                                                name="cantidad" 
                                                                min="1" 
                                                                defaultValue="" 
                                                                placeholder="0"
                                                                className="tech-input py-2 text-center text-sm font-bold text-slate-700" 
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/50 border-t border-white/60 flex gap-4 shrink-0">
                                <button type="submit" className="flex-1 tech-button py-3 flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-5 h-5" /> Registrar Compra
                                </button>
                                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                                    <X className="w-5 h-5" /> Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}