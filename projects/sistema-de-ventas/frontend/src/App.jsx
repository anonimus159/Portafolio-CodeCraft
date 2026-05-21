import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';
import Compras from './pages/Compras';
import Proveedores from './pages/Proveedores';
import Gastos from './pages/Gastos';
import Caja from './pages/Caja';
import Cuadre from './pages/Cuadre';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';
import Ticket from './pages/Ticket';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <Layout>{children}</Layout>;
}

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
            <Route path="/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
            <Route path="/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
            <Route path="/ventas/:id/ticket" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />
            <Route path="/compras" element={<ProtectedRoute><Compras /></ProtectedRoute>} />
            <Route path="/proveedores" element={<ProtectedRoute><Proveedores /></ProtectedRoute>} />
            <Route path="/gastos" element={<ProtectedRoute><Gastos /></ProtectedRoute>} />
            <Route path="/caja" element={<ProtectedRoute><Caja /></ProtectedRoute>} />
            <Route path="/cuadre" element={<ProtectedRoute><Cuadre /></ProtectedRoute>} />
            <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter basename="/demos/sistema-de-ventas/">
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
