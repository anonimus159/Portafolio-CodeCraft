import React, { useState } from 'react';
import { UserPlus, Search, Shield, ChefHat, UserCircle, MoreVertical, Plus, X, Check, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const STORAGE_KEY = 'fastpos_staff';

const INITIAL_STAFF = [
  { id: 1, name: 'Jean Pierre',    role: 'Chef Principal', department: 'Cocina',          status: 'En Turno',        img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean'  },
  { id: 2, name: 'Alex Peterson',  role: 'Mesero Líder',   department: 'Servicio',         status: 'En Turno',        img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'  },
  { id: 3, name: 'Maria Gonzalez', role: 'Sous Chef',      department: 'Cocina',           status: 'Fuera de Turno',  img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
  { id: 4, name: 'David Smith',    role: 'Cajero',         department: 'Servicio',         status: 'En Descanso',     img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: 5, name: 'Sarah Connor',   role: 'Gerente',        department: 'Administración',   status: 'En Turno',        img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
];

const STATUS_OPTIONS = ['En Turno', 'En Descanso', 'Fuera de Turno'];
const DEPT_OPTIONS   = ['Cocina', 'Servicio', 'Administración', 'Mantenimiento'];

const PERMISSIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tables',    label: 'Mapa Mesas' },
  { id: 'pos',       label: 'Vender/POS' },
  { id: 'kitchen',   label: 'Cocina KDS' },
  { id: 'cashier',   label: 'Caja/Pagos' },
  { id: 'inventory', label: 'Inventario' },
  { id: 'menu',      label: 'Menú/Carta' },
  { id: 'reports',   label: 'Reportes' },
  { id: 'users',     label: 'Personal' },
  { id: 'settings',  label: 'Ajustes' },
];

const emptyForm = { 
  name: '', role: '', department: 'Servicio', status: 'En Turno', 
  username: '', password: '', permissions: ['tables', 'pos'] 
};

const UsersModule = ({ staff = [], setStaff, currentUser, setCurrentUser }) => {
  const [search, setSearch]     = useState('');
  const [showAdd, setShowAdd]   = useState(false);
  const [menuId, setMenuId]     = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm]         = useState(emptyForm);

  const filtered = staff.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.role || !form.username || !form.password) return;
    const seed = form.name.replace(' ', '');
    setStaff(prev => [...prev, {
      id: Date.now(),
      ...form,
      img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
    }]);
    setForm(emptyForm);
    setShowAdd(false);
  };

  const handleEdit = (user) => {
    setEditUser(user.id);
    setForm({ 
      name: user.name, 
      role: user.role, 
      department: user.department, 
      status: user.status,
      username: user.username || '',
      password: user.password || '',
      permissions: user.permissions || []
    });
    setMenuId(null);
    setShowAdd(true);
  };

  const handleSaveEdit = () => {
    setStaff(prev => {
      const next = prev.map(u => u.id === editUser ? { ...u, ...form } : u);
      // Si el usuario editado es el mismo que está logueado, actualizamos su sesión actual
      if (currentUser?.id === editUser) {
        setCurrentUser({ ...currentUser, ...form });
      }
      return next;
    });
    setEditUser(null);
    setForm(emptyForm);
    setShowAdd(false);
  };

  const togglePermission = (id) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter(p => p !== id)
        : [...prev.permissions, id]
    }));
  };

  const handleDelete = (id) => {
    setStaff(prev => prev.filter(u => u.id !== id));
    setMenuId(null);
  };


  const handleStatusCycle = (id) => {
    setStaff(prev => prev.map(u => {
      if (u.id !== id) return u;
      const idx = STATUS_OPTIONS.indexOf(u.status);
      return { ...u, status: STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length] };
    }));
  };

  return (
    <div className="flex flex-col gap-6 pt-6 h-full" onClick={() => setMenuId(null)}>
      <div className="flex-between">
        <h2 className="text-xl font-bold text-text-primary">Gestión de Personal</h2>
        <div className="flex gap-3">
          <div className="command-bar m-0 w-[250px]">
            <Search size={16} className="text-text-tertiary" />
            <input
              type="text"
              placeholder="Buscar personal..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-md btn-primary" onClick={() => { setEditUser(null); setForm(emptyForm); setShowAdd(true); }}>
            <UserPlus size={16} /> Agregar Personal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map(user => (
            <motion.div
              layout
              key={user.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="enterprise-card p-6 flex flex-col group relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                  <img src={user.img} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="relative">
                  <button
                    className="text-text-tertiary hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setMenuId(menuId === user.id ? null : user.id)}
                  >
                    <MoreVertical size={18} />
                  </button>
                  {menuId === user.id && (
                    <div className="absolute right-0 top-8 z-30 bg-bg-surface border border-border-light rounded-xl p-2 shadow-xl min-w-[150px]">
                      <button onClick={() => handleEdit(user)} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/5 flex items-center gap-2 text-text-secondary hover:text-white">
                        <Edit2 size={14} /> Editar
                      </button>

                      <button onClick={() => handleDelete(user.id)} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-danger/10 flex items-center gap-2 text-danger">
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-1">{user.name}</h3>
              <p className="text-sm text-text-secondary flex items-center gap-1.5 mb-4">
                {user.department === 'Cocina' ? <ChefHat size={14} className="text-accent-primary" /> :
                 user.department === 'Administración' ? <Shield size={14} className="text-accent-secondary" /> :
                 <UserCircle size={14} className="text-info" />}
                {user.role} · {user.department}
              </p>

              <div className="flex flex-wrap gap-1 mb-6">
                {user.permissions?.slice(0, 4).map(p => (
                  <span key={p} className="text-[9px] uppercase font-bold tracking-tighter bg-white/5 px-1.5 py-0.5 rounded text-text-tertiary border border-white/5">{p}</span>
                ))}
                {user.permissions?.length > 4 && <span className="text-[9px] text-text-tertiary">+{user.permissions.length - 4}</span>}
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={() => handleStatusCycle(user.id)}
                  className={`w-full flex items-center justify-center gap-2 h-10 rounded-xl font-bold text-xs border transition-all ${
                    user.status === 'En Turno'    ? 'bg-success/10 border-success/30 text-success hover:bg-success/20' :
                    user.status === 'En Descanso' ? 'bg-warning/10 border-warning/30 text-warning hover:bg-warning/20' :
                    'bg-white/5 border-white/10 text-text-tertiary hover:bg-white/10'
                  }`}
                >
                  <RefreshCw size={14} className={user.status === 'En Turno' ? 'animate-spin-slow' : ''} />
                  {user.status === 'En Turno' ? 'EN TURNO' : user.status === 'En Descanso' ? 'EN DESCANSO' : 'FUERA DE TURNO'}
                </button>
                <div className="flex-between pt-2 border-t border-white/5">
                   <span className="text-[10px] text-text-tertiary font-mono">ID: EMP-{String(user.id).padStart(3,'0')}</span>
                   <button onClick={() => handleEdit(user)} className="text-[10px] font-bold text-accent-primary hover:underline uppercase tracking-widest">Ajustes</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Card */}
        <motion.div
          layout
          onClick={() => { setEditUser(null); setForm(emptyForm); setShowAdd(true); }}
          className="enterprise-card p-6 flex-center flex-col gap-4 border-dashed border-2 border-border-light hover:border-accent-primary/50 cursor-pointer transition-colors bg-transparent"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex-center text-text-tertiary hover:text-accent-primary transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-sm font-bold text-text-secondary">Invitar Miembro</span>
        </motion.div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex-center p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-surface border border-border-light rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto scroll-hide shadow-[0_0_100px_rgba(0,0,0,0.8)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{editUser ? 'Editar Miembro' : 'Agregar Personal'}</h3>
                  <p className="text-xs text-text-tertiary mt-1">Configure el perfil y los accesos del empleado</p>
                </div>
                <button onClick={() => setShowAdd(false)} className="text-text-tertiary hover:text-white p-1"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-accent-primary uppercase tracking-widest border-b border-white/5 pb-2">Información Básica</h4>
                  <div>
                    <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Nombre Completo</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-bg-base border border-border-light rounded-lg px-4 py-2 text-sm text-text-primary outline-none focus:border-accent-primary" placeholder="Ej: Jean Pierre" />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Cargo / Rol</label>
                    <input type="text" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full bg-bg-base border border-border-light rounded-lg px-4 py-2 text-sm text-text-primary outline-none focus:border-accent-primary" placeholder="Ej: Chef Principal" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Departamento</label>
                      <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="w-full bg-bg-base border border-border-light rounded-lg px-4 py-2 text-sm text-text-primary outline-none focus:border-accent-primary">
                        {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Estado Actual</label>
                      <div className="flex flex-col gap-2">
                        {STATUS_OPTIONS.map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setForm(p => ({ ...p, status: s }))}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-bold transition-all ${
                              form.status === s 
                                ? (s === 'En Turno' ? 'bg-success/10 border-success text-success' : 
                                   s === 'En Descanso' ? 'bg-warning/10 border-warning text-warning' : 
                                   'bg-white/10 border-white/20 text-white')
                                : 'bg-black/20 border-white/5 text-text-tertiary hover:bg-white/5'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              s === 'En Turno' ? 'bg-success' : 
                              s === 'En Descanso' ? 'bg-warning' : 
                              'bg-text-tertiary'
                            }`} />
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-accent-primary uppercase tracking-widest border-b border-white/5 pb-2 pt-4">Credenciales de Acceso</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Usuario</label>
                      <input type="text" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} className="w-full bg-bg-base border border-border-light rounded-lg px-4 py-2 text-sm text-text-primary outline-none focus:border-accent-primary" placeholder="usuario" />
                    </div>
                    <div>
                      <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2 block">Contraseña</label>
                      <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="w-full bg-bg-base border border-border-light rounded-lg px-4 py-2 text-sm text-text-primary outline-none focus:border-accent-primary" placeholder="••••" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-accent-primary uppercase tracking-widest border-b border-white/5 pb-2">Permisos del Sistema</h4>
                  <p className="text-[10px] text-text-tertiary leading-tight mb-4">Seleccione los módulos a los que este usuario tendrá acceso directo.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PERMISSIONS.map(perm => {
                      const active = form.permissions.includes(perm.id);
                      return (
                        <button
                          key={perm.id}
                          type="button"
                          onClick={() => togglePermission(perm.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${active ? 'bg-accent-primary/10 border-accent-primary/40 text-white' : 'bg-white/5 border-white/5 text-text-tertiary hover:bg-white/10'}`}
                        >
                          <div className={`w-4 h-4 rounded-md border flex-center flex-shrink-0 transition-colors ${active ? 'bg-accent-primary border-accent-primary' : 'bg-bg-base border-white/10'}`}>
                            {active && <Check size={10} className="text-white" strokeWidth={4} />}
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-tight">{perm.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-10 pt-6 border-t border-white/5">
                <button onClick={() => setShowAdd(false)} className="btn btn-secondary flex-1">Cancelar</button>
                <button onClick={editUser ? handleSaveEdit : handleAdd} className="btn btn-primary flex-1 shadow-glow h-12">
                  <Check size={16} /> {editUser ? 'Guardar Cambios' : 'Confirmar Registro'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersModule;
