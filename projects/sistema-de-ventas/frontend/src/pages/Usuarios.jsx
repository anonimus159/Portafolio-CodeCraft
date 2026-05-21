import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Shield, Mail, Lock, Edit2, Save, X, AlertTriangle, User } from 'lucide-react';

export default function Usuarios() {
    const { user } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editando, setEditando] = useState(null);

    useEffect(() => {
        if (user?.rol !== 'admin') {
            setLoading(false);
            return;
        }
        cargarUsuarios();
    }, [user]);

    const cargarUsuarios = () => {
        api.auth.me().then(() => {
            setUsuarios([{ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }]);
        }).catch(err => console.error(err)).finally(() => setLoading(false));
    };

    const guardar = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            if (editando) {
                // Editar usuario existente
            } else {
                await api.auth.register({
                    nombre: formData.get('nombre'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    rol: formData.get('rol')
                });
            }
            setModalOpen(false);
            setEditando(null);
            cargarUsuarios();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    if (user?.rol !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
                <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-12 h-12 text-rose-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Acceso Denegado</h2>
                <p className="text-slate-500 font-medium max-w-md text-center">
                    No tienes los permisos necesarios para acceder a la gestión de usuarios. Contacta a un administrador.
                </p>
            </div>
        );
    }

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
                        <Users className="w-8 h-8 text-cyan-600" /> Gestión de Usuarios
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Administra los accesos y roles del sistema</p>
                </div>
                <button
                    onClick={() => { setEditando(null); setModalOpen(true); }}
                    className="tech-button px-6 py-3 flex items-center gap-2"
                >
                    <UserPlus className="w-5 h-5" /> Nuevo Usuario
                </button>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden mt-8">
                <div className="p-6 bg-white/40 border-b border-white/60">
                    <h2 className="font-black text-slate-700 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-cyan-600" /> Cuentas Activas
                    </h2>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                        <thead className="bg-white/50 border-b border-white/60">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/40">
                            {usuarios.map((u, index) => (
                                <tr key={u.id} className="hover:bg-white/60 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                                                {u.nombre.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-black text-slate-800">{u.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium">{u.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${u.rol === 'admin' ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-blue-400 to-cyan-500'}`}>
                                            <Shield className="w-3 h-3" />
                                            {u.rol === 'admin' ? 'Administrador' : 'Cajero'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => { setEditando(u); setModalOpen(true); }} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-cyan-300 hover:text-cyan-600 transition-all shadow-sm active:scale-95 inline-flex items-center justify-center" title="Editar">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in-up p-4">
                    <div className="glass-card w-full max-w-md modal-animate overflow-hidden border border-white/60 shadow-2xl">
                        <div className="p-6 bg-white/50 border-b border-white/60 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                                <UserPlus className="w-6 h-6 text-cyan-600" />
                                {editando ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h2>
                            <button onClick={() => { setModalOpen(false); setEditando(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={guardar} className="p-6 bg-white/40 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input type="text" name="nombre" defaultValue={editando?.nombre} className="tech-input pl-12 font-bold text-slate-800" required placeholder="Nombre completo" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input type="email" name="email" defaultValue={editando?.email} className="tech-input pl-12" required placeholder="correo@ejemplo.com" />
                                </div>
                            </div>
                            {!editando && (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Contraseña *</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input type="password" name="password" className="tech-input pl-12" required placeholder="Mínimo 6 caracteres" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Rol *</label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <select name="rol" defaultValue={editando?.rol || 'cajero'} className="tech-input pl-12 bg-white/50">
                                                <option value="cajero">Cajero</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
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