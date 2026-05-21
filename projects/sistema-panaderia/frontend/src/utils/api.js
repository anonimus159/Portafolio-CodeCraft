import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 12000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      error.friendlyMessage = 'No se pudo conectar con el servidor. Verifica que el backend este encendido.';
    } else if (error.response.status === 401) {
      error.friendlyMessage = error.response.data?.message || 'No autorizado. Revisa tus credenciales.';
    } else {
      error.friendlyMessage = error.response.data?.message || error.message || 'Ocurrio un error inesperado.';
    }
    return Promise.reject(error);
  }
);

export default api;
