import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Croissant, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const fill = (e, p) => { setEmail(e); setPassword(p); };

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Left — Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12"
        style={{ width: 440, background: '#0e0e10', borderRight: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>
            <Croissant style={{ width: 22, height: 22, color: '#0c0a00' }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fafafa' }}>POS Panadería</div>
            <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600, letterSpacing: '0.04em' }}>Sistema de Gestión</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 38, fontWeight: 800, color: '#fafafa', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Gestiona tu negocio<br />
            <span style={{ color: '#f59e0b' }}>con precisión</span>
          </div>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.7, maxWidth: 320 }}>
            Control total de mesas, pedidos, cocina, inventario y reportes en un solo lugar.
          </p>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🍞', text: 'Gestión de pedidos en tiempo real' },
              { icon: '📊', text: 'Reportes y análisis de ventas' },
              { icon: '📦', text: 'Control de inventario automático' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 18 }}>{f.icon}</span>
                <span style={{ fontSize: 13, color: '#a1a1aa' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#3f3f46' }}>© {new Date().getFullYear()} POS Panadería</div>
      </div>

      {/* Right — Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-10">
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>
              <Croissant style={{ width: 24, height: 24, color: '#0c0a00' }} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#fafafa' }}>POS Panadería</div>
              <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>Sistema de Gestión</div>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 6 }}>Bienvenido de vuelta</h1>
            <p style={{ fontSize: 14, color: '#71717a' }}>Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ padding: '12px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
                >
                  <AlertCircle style={{ width: 16, height: 16, color: '#f87171', flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#fca5a5', margin: 0 }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="pos-label">Correo Electrónico</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#52525b', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="usuario@panaderia.com"
                  className="pos-input"
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="pos-label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#52525b', pointerEvents: 'none' }} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pos-input"
                  style={{ paddingLeft: 38, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', padding: 0, display: 'flex' }}
                >
                  {showPwd ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pos-btn pos-btn-primary pos-btn-lg"
              style={{ width: '100%', marginTop: 6, justifyContent: 'center', gap: 10 }}
            >
              {loading ? (
                <div className="pos-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 11, color: '#52525b', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Cuentas de Demostración</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { rol: 'Admin',  email: 'admin@restaurante.com',  pass: 'admin123' },
                { rol: 'Cajero', email: 'carlos@restaurante.com', pass: 'carlos123' },
                { rol: 'Mesero', email: 'maria@restaurante.com',  pass: 'maria123' },
                { rol: 'Cocina', email: 'juan@restaurante.com',   pass: 'juan123'  },
              ].map(d => (
                <button
                  key={d.rol}
                  type="button"
                  onClick={() => fill(d.email, d.pass)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.07)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', marginBottom: 2 }}>{d.rol}</div>
                  <div style={{ fontSize: 10, color: '#52525b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.email}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
