import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

const LoginScreen = ({ staff, onLogin, settings }) => {
  const [mode, setMode] = useState('user'); // 'user' or 'admin'
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Demo bypass
    if (user === 'admin' && pass === 'admin') {
        const admin = staff.find(s => s.role === 'Gerente' || s.role === 'Administrador') || staff[0];
        onLogin(admin, true);
        return;
    }

    if (mode === 'admin') {
      if (user === 'admin' && pass === settings.masterPin) {
        // Find first manager or just the first staff
        const admin = staff.find(s => s.role === 'Gerente' || s.role === 'Administrador') || staff[0];
        onLogin(admin, true);
      } else {
        setError('PIN Maestro Incorrecto');
      }
      return;
    }

    const found = staff.find(s => s.username === user && s.password === pass);
    if (found) {
      onLogin(found, found.role === 'Gerente' || found.role === 'Administrador');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-bg-base flex-center p-4">
      <div className="app-bg" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md enterprise-card p-10 flex flex-col items-center text-center relative overflow-visible"
      >
        <div className="w-20 h-20 rounded-2xl bg-accent-primary flex-center shadow-glow mb-8 -mt-20">
          <Utensils size={40} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-black mb-2">FastPOS Enterprise</h1>
        <p className="text-text-tertiary text-sm mb-8">Software de Gestión para Restaurantes</p>

        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-full mb-6">
          <button 
            type="button"
            onClick={() => { setMode('user'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'user' ? 'bg-white text-black shadow-lg' : 'text-text-tertiary hover:text-white'}`}
          >
            Operador
          </button>
          <button 
            type="button"
            onClick={() => { setMode('admin'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'admin' ? 'bg-white text-black shadow-lg' : 'text-text-tertiary hover:text-white'}`}
          >
            Administrador
          </button>
        </div>

        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-200 mb-4 text-left">
          <p className="font-semibold mb-1 text-blue-100">Credenciales de Demo (Admin):</p>
          <p>Usuario: <b>admin</b></p>
          <p>Contraseña: <b>admin</b></p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Usuario</label>
            <input 
              type="text" value={user} onChange={e => setUser(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none transition-all"
              placeholder={mode === 'admin' ? 'admin' : 'Tu usuario'}
              required
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">
              {mode === 'admin' ? 'PIN Maestro' : 'Contraseña'}
            </label>
            <input 
              type="password" 
              value={pass} onChange={e => setPass(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none transition-all mono-font"
              placeholder="••••"
              required
            />
          </div>

          {error && <p className="text-xs text-danger font-bold mt-2 animate-pulse">{error}</p>}

          <button type="submit" className="w-full btn btn-accent h-12 shadow-glow font-bold mt-4">
            Ingresar al Sistema
          </button>
        </form>

        <div className="mt-6 bg-accent-primary/10 border border-accent-primary/20 p-3 rounded-xl w-full text-center">
          <p className="text-accent-primary text-[10px] font-bold uppercase tracking-widest mb-1">Cuentas de Demostración</p>
          <div className="flex justify-center gap-4 text-xs">
            <span className="text-text-tertiary">Usr: <b className="text-white">admin</b></span>
            <span className="text-text-tertiary">Clave: <b className="text-white">admin</b></span>
          </div>
        </div>

        <p className="text-[10px] text-text-tertiary mt-8 uppercase font-medium tracking-tighter">
          v2.4.0 • Enterprise Edition • {settings.restaurantName || 'FastPOS'}
        </p>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
