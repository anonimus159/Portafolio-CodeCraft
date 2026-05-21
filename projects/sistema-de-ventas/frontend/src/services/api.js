const API_URL = '/api';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            // Obtener el texto primero para verificar si hay contenido
            const responseText = await response.text();

            // Si la respuesta está vacía, lanzar error
            if (!responseText || responseText.trim() === '') {
                console.error('[API] Respuesta vacía del servidor:', response.status, endpoint);
                throw new Error('Respuesta vacía del servidor');
            }

            // Parsear el JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('[API] Error al parsear JSON:', parseError);
                console.error('[API] Respuesta recibida:', responseText.substring(0, 200));
                throw new Error('Error al procesar la respuesta del servidor');
            }

            // Verificar código de estado HTTP
            if (!response.ok) {
                throw new Error(data.error || data.message || `Error HTTP: ${response.status}`);
            }

            return data;
        } catch (error) {
            // Re-lanzar el error para que lo maneje el componente
            throw error;
        }
    },

    auth: {
        login: (email, password) => api.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
        register: (data) => api.request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        me: () => api.request('/auth/me')
    },

    productos: {
        getAll: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return api.request(`/productos${query ? `?${query}` : ''}`);
        },
        getById: (id) => api.request(`/productos/${id}`),
        getByBarras: (codigo) => api.request(`/productos/barras/${codigo}`),
        getAlertas: () => api.request('/productos/alertas'),
        create: (data) => api.request('/productos', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => api.request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => api.request(`/productos/${id}`, { method: 'DELETE' })
    },

    categorias: {
        getAll: () => api.request('/categorias'),
        create: (data) => api.request('/categorias', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => api.request(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => api.request(`/categorias/${id}`, { method: 'DELETE' })
    },

    ventas: {
        getAll: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return api.request(`/ventas${query ? `?${query}` : ''}`);
        },
        getById: (id) => api.request(`/ventas/${id}`),
        getByFecha: (fecha) => api.request(`/ventas/dia/${fecha}`),
        create: (data) => api.request('/ventas', { method: 'POST', body: JSON.stringify(data) })
    },

    proveedores: {
        getAll: () => api.request('/proveedores'),
        getById: (id) => api.request(`/proveedores/${id}`),
        create: (data) => api.request('/proveedores', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => api.request(`/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => api.request(`/proveedores/${id}`, { method: 'DELETE' })
    },

    compras: {
        getAll: () => api.request('/compras'),
        getById: (id) => api.request(`/compras/${id}`),
        create: (data) => api.request('/compras', { method: 'POST', body: JSON.stringify(data) })
    },

    gastos: {
        getAll: () => api.request('/gastos'),
        create: (data) => api.request('/gastos', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id) => api.request(`/gastos/${id}`, { method: 'DELETE' })
    },

    caja: {
        getAbierta: () => api.request('/caja/abierta'),
        apertura: (data) => api.request('/caja/apertura', { method: 'POST', body: JSON.stringify(data) }),
        cierre: (id, data) => api.request(`/caja/cierre/${id}`, { method: 'POST', body: JSON.stringify(data) }),
        historial: () => api.request('/caja/historial')
    },

    reportes: {
        ventas: (periodo) => api.request(`/reportes/ventas?periodo=${periodo}`),
        productosMasVendidos: () => api.request('/reportes/productos-mas-vendidos'),
        resumen: () => api.request('/reportes/resumen'),
        utilidad: (inicio, fin) => api.request(`/reportes/utilidad?inicio=${inicio}&fin=${fin}`)
    },

    cuadres: {
        getAll: () => api.request('/cuadres'),
        getById: (id) => api.request(`/cuadres/${id}`),
        getByFecha: (fecha) => api.request(`/cuadres/fecha/${fecha}`),
        getResumen: () => api.request('/cuadres/resumen'),
        create: (data) => api.request('/cuadres', { method: 'POST', body: JSON.stringify(data) })
    }
};

import './mock.js';
export default api;