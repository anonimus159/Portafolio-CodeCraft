# 🍽️ SISTEMA POS RESTAURANTE - MEJORAS IMPLEMENTADAS

## 📋 ÍNDICE

1. [Resumen de Mejoras](#resumen-de-mejoras)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Características Implementadas](#características-implementadas)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Uso del Sistema](#uso-del-sistema)

---

## 🎯 RESUMEN DE MEJORAS

Se ha transformado el sistema POS existente en una aplicación profesional y moderna con las siguientes mejoras:

### ✨ Frontend
- ✅ **TailwindCSS** - Sistema de diseño moderno y responsive
- ✅ **Framer Motion** - Animaciones fluidas en todas las transiciones
- ✅ **Lucide React** - Íconos modernos y consistentes
- ✅ **Recharts** - Gráficas interactivas para reportes
- ✅ **Modo Oscuro** - Toggle para cambiar entre tema claro/oscuro
- ✅ **Diseño Responsive** - Funciona en tablets y desktops

### 🎨 Módulos Mejorados

| Módulo | Mejoras |
|--------|---------|
| **Mesas** | Grid visual, totales en tiempo real, crear/unir mesas |
| **Pedidos** | Imágenes de productos, notas, impresión automática |
| **Cocina (KDS)** | Interfaz moderna, filtros, notificaciones sonoras |
| **Caja** | Diseño visual mejorado, múltiples métodos de pago |
| **Inventario** | Dashboard, alertas visuales, historial de movimientos |
| **Recetas** | Interfaz visual, cálculo de costos, gestión de ingredientes |
| **Reportes** | Gráficas (barras, pastel, líneas), métricas en tiempo real |
| **Cuadre de Caja** | Múltiples tipos de ingreso, resumen visual mejorado |

---

## 📦 REQUISITOS PREVIOS

### Backend
- Node.js >= 16.x
- MySQL >= 8.0 (opcional, el sistema usa JSON por defecto)

### Frontend
- Node.js >= 16.x
- Navegador moderno (Chrome, Firefox, Edge)

---

## 🚀 INSTALACIÓN

### 1. Clonar/Descargar el Proyecto

```bash
cd "D:\INFORMACION\Downloads\sistema panaderia"
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

**Paquetes instalados:**
- `multer` - Manejo de uploads de imágenes
- `@anthropic-ai/sdk` - (Opcional) Para funcionalidades AI futuras

### 3. Instalar Dependencias del Frontend

```bash
cd ../frontend
npm install
```

**Paquetes instalados:**
- `tailwindcss` - Framework de CSS
- `framer-motion` - Librería de animaciones
- `lucide-react` - Íconos
- `recharts` - Gráficas
- `autoprefixer` - PostCSS plugin

### 4. Configurar Base de Datos (Opcional)

Si desea usar MySQL en lugar de JSON:

```bash
# Ejecutar el schema en MySQL
mysql -u root -p < database/schema_actualizado.sql
```

### 5. Iniciar el Sistema

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
El servidor correrá en `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
La aplicación correrá en `http://localhost:5173`

---

## 🎨 CARACTERÍSTICAS IMPLEMENTADAS

### 1. 🍽️ Módulo de Mesas Mejorado

- **Grid Visual**: Las mesas se muestran en un grid con colores por estado
  - 🟢 Verde = Libre
  - 🟡 Ámbar = Ocupada
  - 🔴 Rojo = Por pagar

- **Totales en Tiempo Real**: Cada mesa muestra el total consumido
- **Crear Mesas**: Modal para agregar nuevas mesas dinámicamente
- **Unir Mesas**: Funcionalidad para combinar mesas y transferir pedidos

### 2. 🧾 Pedidos + Impresión Automática

- **Imágenes de Productos**: Los productos muestran imágenes o íconos
- **Notas Especiales**: Modal para agregar notas (ej: "sin cebolla")
- **Impresión QZ Tray**: 
  - Tickets separados para cocina y barra
  - Formato profesional con encabezado y pie
  - Se imprime automáticamente al agregar productos

**Formato de Ticket:**
```
╔══════════════════════════════════════════╗
║         RESTAURANTE XYZ                  ║
╚══════════════════════════════════════════╝

Mesa: 5
Pedido #: 123
Hora: 12:30

🍳 COCINA
2x Hamburguesa Clásica
   → sin cebolla

🍸 BARRA
1x Gaseosa
```

### 3. 📦 Inventario Interactivo

- **Dashboard de Stats**: Total items, alertas, valor total
- **Alertas Visuales**: 
  - 🔴 Rojo = Stock crítico (≤ mínimo)
  - 🟡 Ámbar = Advertencia (≤ 1.5x mínimo)
  - 🟢 Verde = Stock normal

- **Movimientos**: Entradas y salidas con historial
- **Búsqueda y Filtros**: Filtrar por nombre y estado de stock

### 4. 🛒 Productos con Imágenes

- **Upload de Imágenes**: Endpoint para subir imágenes (multipart/form-data)
- **Rutas de Imágenes**: Se guardan en `/uploads/productos/`
- **Visualización**: Imágenes en grid de productos y modal de pedidos

### 5. 🧑‍🍳 Recetas Visuales

- **Interfaz Visual**: Cards para cada producto con estado de receta
- **Cálculo de Costos**: Muestra el costo total de ingredientes
- **Gestión de Ingredientes**: Agregar/eliminar ingredientes fácilmente
- **Filtros**: Mostrar solo productos sin receta

### 6. 📊 Reportes con Gráficas

**Gráficas Implementadas:**

| Gráfica | Tipo | Datos |
|---------|------|-------|
| Ventas Semanales | Líneas | Total $ y transacciones por día |
| Productos Más Vendidos | Barras | Cantidad y total por producto |
| Métodos de Pago | Pastel | Distribución por método |

**Métricas en Dashboard:**
- Ventas del día
- Transacciones
- Ticket promedio
- Estado de inventario

### 7. 💰 Cuadre de Caja Mejorado

- **Múltiples Tipos de Ingreso**:
  - Ventas
  - Banco
  - Tarjeta
  - Otros

- **Resumen Visual**: Stats de ingresos, gastos y resultado
- **Cierre con Arqueo**: Comparar dinero físico vs sistema

### 8. 🎨 Diseño UI/UX

**Mejoras Generales:**
- ✅ Animaciones suaves con Framer Motion
- ✅ Íconos consistentes con Lucide React
- ✅ Cards con sombras y bordes redondeados
- ✅ Transiciones en hover y click
- ✅ Botones grandes tipo táctil
- ✅ Modo oscuro con toggle

**Paleta de Colores:**
```css
--primary: #2563eb  (Azul)
--success: #22c55e  (Verde)
--warning: #f59e0b  (Ámbar)
--danger: #ef4444   (Rojo)
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
sistema-panaderia/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración de BD
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── routes/          # Endpoints API
│   │   ├── middleware/      # Upload, auth
│   │   ├── services/        # Servicios (printer)
│   │   ├── db/              # Conexión JSON/MySQL
│   │   └── index.js         # Entry point
│   ├── uploads/             # Imágenes de productos
│   ├── data/                # Archivos JSON (si usa JSON)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Sidebar, etc.
│   │   ├── pages/           # Vistas principales
│   │   ├── context/         # AuthContext
│   │   ├── utils/           # API helpers
│   │   ├── index.css        # Tailwind + estilos
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
└── database/
    ├── schema.sql           # Schema original
    └── schema_actualizado.sql  # Schema completo con vistas
```

---

## 🖥️ USO DEL SISTEMA

### Flujo Principal

1. **Iniciar Sesión**
   - Email: `admin@restaurante.com`
   - Password: `admin123` (o la configurada)

2. **Crear Pedido desde Mesas**
   - Ir a `Mesas` en el sidebar
   - Click en mesa libre → Crea pedido automáticamente
   - Agregar productos desde el panel derecho
   - Los productos se imprimen en cocina automáticamente

3. **Gestionar Cocina (KDS)**
   - Ir a `Cocina (KDS)` en el sidebar
   - Ver pedidos pendientes por estado
   - Cambiar estados: Pendiente → En Preparación → Listo

4. **Cerrar Cuenta en Caja**
   - Ir a `Caja`
   - Seleccionar pedido por pagar
   - Click en `Pagar` → Seleccionar método → Confirmar

5. **Gestionar Inventario**
   - Ir a `Inventario`
   - Ver alertas de stock bajo
   - Registrar entradas/salidas
   - Ver historial de movimientos

6. **Crear Recetas**
   - Ir a `Recetas`
   - Seleccionar producto sin receta
   - Agregar ingredientes con cantidades
   - Ver costo total de la receta

7. **Ver Reportes**
   - Ir a `Reportes`
   - Seleccionar fecha para ventas diarias
   - Ver gráficas de ventas, productos y métodos de pago

---

## 🔧 ENDPOINTS API PRINCIPALES

### Mesas
```
GET    /api/mesas              - Listar mesas
POST   /api/mesas              - Crear mesa
POST   /api/mesas/unir         - Unir dos mesas
PATCH  /api/mesas/:id/estado   - Cambiar estado
```

### Pedidos
```
POST   /api/pedidos                    - Crear pedido
POST   /api/pedidos/:id/producto       - Agregar producto (imprime automático)
GET    /api/pedidos/cocina             - Pedidos para KDS
POST   /api/pedidos/:id/facturar       - Facturar pedido
```

### Inventario
```
GET    /api/inventario           - Listar items
GET    /api/inventario/alertas   - Items con stock bajo
POST   /api/inventario           - Crear item
PATCH  /api/inventario/:id/cantidad  - Ajustar cantidad (entrada/salida)
```

### Reportes
```
GET  /api/reportes/ventas/diarias     - Ventas del día
GET  /api/reportes/ventas/productos   - Productos más vendidos
GET  /api/reportes/ventas/metodo-pago - Por método de pago
GET  /api/reportes/ventas/semanales   - Últimos 7 días
```

---

## 🎯 PRÓXIMOS PASOS (OPCIONALES)

1. **Configurar QZ Tray** para impresión real
   - Instalar QZ Tray en el equipo
   - Configurar impresoras de cocina y barra

2. **Migrar a MySQL**
   - Ejecutar `schema_actualizado.sql`
   - Actualizar controllers para usar MySQL en lugar de JSON

3. **Agregar Autenticación con Roles**
   - El sistema ya tiene AuthContext pero se puede expandir

4. **Implementar Notificaciones Push**
   - Para nuevos pedidos en cocina

5. **Agregar Modo Offline**
   - Service Worker para funcionamiento sin conexión

---

## 📞 SOPORTE

Para dudas o problemas, revisar los logs en:
- Backend: Consola donde corre `npm run dev`
- Frontend: Consola del navegador (F12)

---

**Versión del Sistema:** 2.0.0  
**Última Actualización:** 2026-04-30
