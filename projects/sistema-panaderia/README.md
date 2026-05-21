# ============================================
# POS RESTAURANTE - DOCUMENTACIÓN
# ============================================

## Estructura del Proyecto

```
pos-restaurante/
├── backend/
│   ├── src/
│   │   ├── config/       # Configuración del servidor
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── db/           # Conexión a MySQL
│   │   ├── routes/       # Rutas API
│   │   └── index.js      # Entry point
│   ├── .env              # Variables de entorno
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/        # Vistas principales
│   │   ├── components/   # Componentes reutilizables
│   │   ├── context/      # Contextos React
│   │   ├── utils/        # Utilidades (API, impresión)
│   │   └── App.jsx       # Router principal
│   ├── index.html
│   └── package.json
├── database/
│   └── schema.sql        # Esquema MySQL
└── README.md
```

## Instalación

### 1. Base de datos
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Auth
- POST /api/auth/login - Login
- POST /api/auth/register - Registro
- GET /api/auth/verify - Verificar token

### Mesas
- GET /api/mesas - Listar mesas
- POST /api/mesas - Crear mesa
- PATCH /api/mesas/:id/estado - Cambiar estado

### Pedidos
- GET /api/pedidos/estado/:estado - Listar por estado
- GET /api/pedidos/cocina - Pedidos para cocina
- POST /api/pedidos/:id/producto - Agregar producto

### Cuadre
- GET /api/cuadre/activo/:usuario_id - Cuadre activo
- POST /api/cuadre/:id/ingreso - Agregar ingreso
- POST /api/cuadre/:id/gasto - Agregar gasto
- POST /api/cuadre/:id/cerrar - Cerrar cuadre

## Roles de Usuario
- admin: Acceso total
- cajero: Caja y cuadre
- mesero: Mesas y pedidos
- cocina: Solo KDS

## Impresión (QZ Tray)
Para activar la impresión automática:
1. Instalar QZ Tray desde https://qz.io
2. Configurar impresoras en el sistema
3. La integración está en src/utils/print.js