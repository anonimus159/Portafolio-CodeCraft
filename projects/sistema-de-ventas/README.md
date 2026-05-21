# Sistema POS - Punto de Venta

Sistema completo de ventas e inventario para negocios pequeños como panaderías o tiendas.

## Tecnologías

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Autenticación:** JWT

## Estructura del proyecto

```
proyecto-pos/
├── backend/
│   ├── config/         # Configuración de base de datos
│   ├── controllers/    # Lógica de negocio
│   ├── middleware/     # Autenticación JWT
│   ├── routes/         # Rutas API
│   ├── scripts/        # Scripts SQL
│   ├── server.js       # Entrada principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/      # Vistas principales
│   │   ├── context/    # Estado global (Auth)
│   │   ├── hooks/      # Hooks personalizados
│   │   └── services/   # Llamadas API
│   └── package.json
└── README.md
```

---

## Instalación paso a paso

### 1. Requisitos previos

- Node.js 18+ instalado
- MySQL 8.0+ instalado y corriendo

### 2. Crear la base de datos MySQL

1. Abre MySQL (desde terminal, MySQL Workbench, o cualquier cliente):

```bash
mysql -u root -p
```

2. Crea la base de datos y ejecuta el script:

```sql
CREATE DATABASE pos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pos_db;

-- Luego ejecuta el contenido de backend/scripts/init.sql
```

O desde línea de comandos:

```bash
mysql -u root -p < backend/scripts/init.sql
```

### 3. Configurar el backend

```bash
cd backend
npm install
```

Edita `backend/config/config.js` si necesitas cambiar la configuración de MySQL:

```javascript
module.exports = {
    PORT: 3001,
    DB_HOST: 'localhost',
    DB_PORT: 3306,
    DB_USER: 'root',
    DB_PASSWORD: 'tu_password',
    DB_NAME: 'pos_db',
    JWT_SECRET: 'tu_secret_key',
    JWT_EXPIRES: '24h'
};
```

### 4. Configurar y ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: http://localhost:5173

### 5. Iniciar el backend

Desde otra terminal:

```bash
cd backend
npm start
```

El backend estará disponible en: http://localhost:3001

---

## Datos de prueba

El script `init.sql` incluye datos seed para que puedas probar el sistema inmediatamente.

### Usuario administrador
- **Email:** admin@pos.com
- **Contraseña:** admin123

### Usuario cajero
- **Email:** cajero@pos.com
- **Contraseña:** admin123

---

## Módulos del sistema

### 1. Dashboard
Resumen rápido con ventas del día, alertas de stock bajo, y accesos directos.

### 2. Punto de Venta (POS)
- Interfaz tipo caja registradora
- Búsqueda por nombre o código de barras
- Agregar productos al carrito
- Seleccionar método de pago
- Genera ticket imprimible

### 3. Inventario
- CRUD completo de productos
- Control de stock con alertas
- Búsqueda y filtros por categoría

### 4. Ventas
- Historial de todas las ventas
- Filtrar por fecha
- Ver e imprimir tickets

### 5. Compras
- Registrar compras a proveedores
- Aumenta automáticamente el stock

### 6. Proveedores
- CRUD de proveedores

### 7. Gastos
- Registrar gastos por categoría

### 8. Control de Caja
- Apertura y cierre de caja diario
- Historial de cajas

### 9. Reportes
- Ventas por período (día/semana/mes)
- Productos más vendidos
- Gráficos con Chart.js

### 10. Gestión de Usuarios (Admin)
- Crear nuevos usuarios
- Asignar roles (admin/cajero)

---

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Crear usuario (admin)
- `GET /api/auth/me` - Usuario actual

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/:id` - Ver producto
- `GET /api/productos/barras/:codigo` - Buscar por código
- `GET /api/productos/alertas` - Stock bajo
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Ventas
- `GET /api/ventas` - Listar ventas
- `GET /api/ventas/:id` - Ver venta con detalle
- `POST /api/ventas` - Crear venta

### Categorías
- `GET /api/categorias` - Listar categorías
- `POST /api/categorias` - Crear categoría
- `PUT /api/categorias/:id` - Actualizar categoría
- `DELETE /api/categorias/:id` - Eliminar categoría

### Proveedores
- `GET /api/proveedores` - Listar proveedores
- `POST /api/proveedores` - Crear proveedor
- `PUT /api/proveedores/:id` - Actualizar proveedor
- `DELETE /api/proveedores/:id` - Eliminar proveedor

### Compras
- `GET /api/compras` - Listar compras
- `POST /api/compras` - Registrar compra

### Gastos
- `GET /api/gastos` - Listar gastos
- `POST /api/gastos` - Registrar gasto
- `DELETE /api/gastos/:id` - Eliminar gasto

### Caja
- `GET /api/caja/abierta` - Caja abierta actual
- `POST /api/caja/apertura` - Abrir caja
- `POST /api/caja/cierre/:id` - Cerrar caja
- `GET /api/caja/historial` - Historial de cajas

### Reportes
- `GET /api/reportes/ventas?periodo=dia|semana|mes` - Ventas por período
- `GET /api/reportes/productos-mas-vendidos` - Top productos
- `GET /api/reportes/resumen` - Resumen general
- `GET /api/reportes/utilidad?inicio=&fin=` - Utilidad en período

---

## Funcionalidades principales

- **Venta rápida:** Busca productos por nombre o código de barras
- **Ticket imprimible:** Genera tickets en formato HTML para imprimir
- **Alertas de stock:** Notifica cuando el inventario está bajo
- **Reportes visuales:** Gráficos de ventas y productos
- **Control de caja:** Registra apertura y cierre diario
- **Múltiples roles:** Administrador y cajero con permisos distintos
- **Responsive:** Funciona en desktop y tablets

---

## Solución de problemas

### Error de conexión a MySQL
Verifica que MySQL esté corriendo y que los datos en `config.js` sean correctos.

### Puerto ocupado
Si el puerto 3001 o 5173 está en uso, cambia la configuración en:
- Backend: `backend/config/config.js` → `PORT`
- Frontend: `frontend/vite.config.js` → `server.port`

### Token expirado
El JWT expira en 24 horas. Cierra sesión y vuelve a iniciar.

---

## Escalabilidad

Este sistema está diseñado para ser simple pero escalable. Para expandirse可以考虑:

1. Agregar更多 tablas (inventario por almacén, múltiples tiendas)
2. Implementar WebSocket para actualización en tiempo real
3. Agregar exportación a PDF/Excel
4. Implementar sistema de pedidos en línea
5. Agregar integración con sistemas de contabilidad

---

¡Listo! El sistema está preparado para usarse.有任何问题? 📧