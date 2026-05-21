import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './components/ui/ConfirmDialog';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Mesas from './pages/Mesas';
import PedidoDetail from './pages/PedidoDetail';
import Cocina from './pages/Cocina';
import Caja from './pages/Caja';
import Inventario from './pages/Inventario';
import Recetas from './pages/Recetas';
import CuadreCaja from './pages/CuadreCaja';
import Reportes from './pages/Reportes';
import Sidebar from './components/Sidebar';

/* ── Guards ─────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="pos-spinner pos-spinner-lg" style={{ margin: '0 auto 16px' }} />
        <p style={{ fontSize: 13, color: '#52525b' }}>Cargando sistema...</p>
      </div>
    </div>
  );
}

function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user)   return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh', background: '#09090b' }}>
        {/* Top bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: 'rgba(9,9,11,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '0 32px',
          height: 54,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 8,
        }}>
          <div style={{ fontSize: 12, color: '#52525b' }}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        {/* Content */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 32px 40px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

function AuthGate({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user)    return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthGate><Login /></AuthGate>} />
      <Route path="/"           element={<DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/mesas"      element={<DashboardLayout><Mesas /></DashboardLayout>} />
      <Route path="/mesa/:id"   element={<DashboardLayout><PedidoDetail /></DashboardLayout>} />
      <Route path="/cocina"     element={<DashboardLayout><Cocina /></DashboardLayout>} />
      <Route path="/caja"       element={<DashboardLayout><Caja /></DashboardLayout>} />
      <Route path="/inventario" element={<DashboardLayout><Inventario /></DashboardLayout>} />
      <Route path="/recetas"    element={<DashboardLayout><Recetas /></DashboardLayout>} />
      <Route path="/cuadre"     element={<DashboardLayout><CuadreCaja /></DashboardLayout>} />
      <Route path="/reportes"   element={<DashboardLayout><Reportes /></DashboardLayout>} />
      <Route path="*"           element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/demos/sistema-panaderia/">
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <AppRoutes />
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
