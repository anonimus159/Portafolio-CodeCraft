import { useState, useEffect } from 'react';
import api from '../services/api';
import { Truck, Plus, X, Phone, Mail, MapPin, Edit2, Trash2, Building, Save, Users } from 'lucide-react';

export default function Proveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editando, setEditando] = useState(null);

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = () => {
        api.proveedores.getAll()
            .then(data => setProveedores(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const guardar = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            nombre: formData.get('nombre'),
            telefono: formData.get('telefono'),
            email: formData.get('email'),
            direccion: formData.get('direccion')
        };

        try {
            if (editando) {
                await api.proveedores.update(editando.id, data);
            } else {
                await api.proveedores.create(data);
            }
            setModalOpen(false);
            setEditando(null);
            cargarProveedores();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const abrirEditar = (proveedor) => {
        setEditando(proveedor);
        setModalOpen(true);
    };

    const eliminar = async (id) => {
        if (!confirm('¿Eliminar este proveedor?')) return;
        try {
            await api.proveedores.delete(id);
            cargarProveedores();
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
                        <Truck className="w-8 h-8 text-cyan-600" /> Proveedores
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Administra el directorio de tus proveedores</p>
                </div>
                <button
                    onClick={() => { setEditando(null); setModalOpen(true); }}
                    className="tech-button px-6 py-3 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Nuevo Proveedor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 stagger-children">
                {proveedores.map(p => (
                    <div key={p.id} className="glass-card p-6 border-l-4 border-l-blue-500 hover:border-l-cyan-500 transition-colors animate-fade-in-up">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-md">
                                <Building className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => abrirEditar(p)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:text-cyan-600 hover:bg-cyan-50 transition-colors" title="Editar">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => eliminar(p.id)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Eliminar">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <h3 className="font-black text-xl text-slate-800 mb-4">{p.nombre}</h3>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-600 font-medium bg-white/40 p-2 rounded-xl border border-white/60">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <Phone className="w-4 h-4 text-cyan-600" />
                                </div>
                                <span className="text-sm">{p.telefono || 'Sin teléfono'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 font-medium bg-white/40 p-2 rounded-xl border border-white/60">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-sm truncate" title={p.email || ''}>{p.email || 'Sin correo'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 font-medium bg-white/40 p-2 rounded-xl border border-white/60">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <MapPin className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="text-sm truncate" title={p.direccion || ''}>{p.direccion || 'Sin dirección'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {proveedores.length === 0 && (
                <div className="text-center py-16 glass-panel rounded-3xl mt-8">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No hay proveedores</h3>
                    <p className="text-slate-500 font-medium">Aún no has registrado ningún proveedor en el sistema.</p>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in-up p-4">
                    <div className="glass-card w-full max-w-md modal-animate overflow-hidden border border-white/60 shadow-2xl">
                        <div className="p-6 bg-white/50 border-b border-white/60 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                                <Building className="w-6 h-6 text-cyan-600" />
                                {editando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                            </h2>
                            <button onClick={() => { setModalOpen(false); setEditando(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={guardar} className="p-6 bg-white/40 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre *</label>
                                <div className="relative">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input type="text" name="nombre" defaultValue={editando?.nombre} className="tech-input pl-12 font-bold text-slate-800" required placeholder="Nombre de la empresa" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input type="text" name="telefono" defaultValue={editando?.telefono} className="tech-input pl-12" placeholder="Número de contacto" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input type="email" name="email" defaultValue={editando?.email} className="tech-input pl-12" placeholder="correo@empresa.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Dirección</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input type="text" name="direccion" defaultValue={editando?.direccion} className="tech-input pl-12" placeholder="Ubicación física" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 tech-button py-3 flex items-center justify-center gap-2">
                                    <Save className="w-5 h-5" /> Guardar
                                </button>
                                <button type="button" onClick={() => { setModalOpen(false); setEditando(null); }} className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
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