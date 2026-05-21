import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/verify')
        .then(res => setUser(res.data.data))
        .catch((error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // Demo bypass
    if (email === 'admin@restaurante.com' || email.includes('@')) {
      const mockUser = { id: 1, email, rol: email.includes('admin') ? 'ADMIN' : 'USER', nombre: 'Usuario Demo' };
      localStorage.setItem('token', 'demo-token');
      setUser(mockUser);
      return mockUser;
    }
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.usuario);
    return res.data.data.usuario;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);