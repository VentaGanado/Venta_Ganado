# GanadoBoy - Backend API

API REST para plataforma de venta de ganado bovino en Boyacá.

## Tecnologías
- Node.js + Express + TypeScript
- MySQL 8.0
- JWT Authentication
- Multer (archivos locales)

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Crear base de datos
mysql -u root -p < database/schema.sql

# Modo desarrollo
npm run dev

# Build producción
npm run build
npm start
```

## Endpoints Principales

### Autenticación
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

### Usuarios
- GET /api/usuarios/:id
- PUT /api/usuarios/:id
- GET /api/usuarios/:id/reputacion

### Bovinos
- GET /api/bovinos
- POST /api/bovinos
- GET /api/bovinos/:id
- PUT /api/bovinos/:id
- DELETE /api/bovinos/:id
- POST /api/bovinos/:id/fotos
- POST /api/bovinos/:id/sanitario
- POST /api/bovinos/:id/reproductivo

### Publicaciones
- GET /api/publicaciones (con filtros)
- POST /api/publicaciones
- GET /api/publicaciones/:id
- PUT /api/publicaciones/:id
- DELETE /api/publicaciones/:id

### Mensajería
- GET /api/conversaciones
- GET /api/conversaciones/:id/mensajes
- POST /api/conversaciones/:id/mensajes
- GET /api/mensajes/nuevos (polling)

### Transacciones
- POST /api/transacciones
- PUT /api/transacciones/:id/confirmar
- GET /api/transacciones/mis-ventas
- GET /api/transacciones/mis-compras

### Calificaciones
- POST /api/calificaciones
- GET /api/usuarios/:id/calificaciones

## Despliegue
Ver documentación en `docs/deployment.md`

## Licencia
MIT