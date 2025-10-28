# 🐮 GanadoBoy - Plataforma de Venta de Ganado Bovino

Sistema completo de gestión y comercialización de ganado bovino en Boyacá, Colombia. Incluye registro de bovinos, marketplace con filtros avanzados, gestión de publicaciones y sistema de autenticación seguro.

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Completa](#-instalación-completa)
- [Configuración del Backend](#%EF%B8%8F-configuración-del-backend)
- [Configuración del Frontend](#-configuración-del-frontend)
- [Ejecución del Proyecto](#-ejecución-del-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Características del Marketplace](#-características-del-marketplace)
- [Solución de Problemas](#-solución-de-problemas)
- [Despliegue en Producción](#-despliegue-en-producción)

---

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Registro e inicio de sesión con JWT
- Tokens de actualización (refresh tokens)
- Protección de rutas con middleware
- Gestión de sesiones seguras

### 🐂 Gestión de Bovinos
- Registro completo de información del animal
- Historial sanitario y reproductivo
- Carga de fotografías
- Filtrado por múltiples criterios

### 🛒 Marketplace
- **Para Vendedores:**
  - Publicar bovinos en el marketplace
  - Activar/Desactivar publicaciones
  - Editar información de publicaciones
  - Gestionar publicaciones activas
  - Eliminar publicaciones

- **Para Compradores:**
  - Búsqueda avanzada por texto (título, descripción, raza)
  - Filtros por: raza, sexo, edad, peso, precio, ubicación
  - Ordenamiento por precio y fecha
  - Paginación personalizable
  - Vista detallada con información completa
  - Contacto directo por WhatsApp

### 📊 Sistema de Transacciones
- Registro de ventas
- Historial de compras
- Estados de transacción (pendiente, confirmada, cancelada)

---

## 🛠 Tecnologías Utilizadas

### Backend
- **Node.js** v18+ con **Express.js** v5
- **TypeScript** para tipado estático
- **MySQL 8.0** como base de datos
- **JWT** para autenticación
- **bcrypt** para encriptación de contraseñas
- **Multer** para manejo de archivos
- **Winston** para logging
- **Zod** para validación de datos
- **Helmet** y **CORS** para seguridad

### Frontend
- **React 19** con **TypeScript**
- **Vite** como build tool
- **React Router** v7 para navegación
- **Zustand** para gestión de estado
- **Axios** para peticiones HTTP
- **TailwindCSS v4** para estilos

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** v18 o superior
   - Descarga desde: https://nodejs.org/
   - Verifica con: `node --version`

2. **MySQL 8.0** o superior
   - Descarga desde: https://dev.mysql.com/downloads/mysql/
   - Verifica con: `mysql --version`

3. **Git** (opcional, para clonar el repositorio)
   - Descarga desde: https://git-scm.com/

4. **Editor de código** (recomendado: VS Code)

---

## 🚀 Instalación Completa

### 1. Clonar o Descargar el Proyecto

```powershell
# Si usas Git
git clone https://github.com/VentaGanado/Venta_Ganado.git
cd Venta_Ganado

# O descarga el ZIP y extráelo
```

### 2. Configurar la Base de Datos

#### a) Iniciar MySQL
```powershell
# Inicia el servicio de MySQL (Windows)
net start MySQL80

# Accede a MySQL
mysql -u root -p
```

#### b) Crear la Base de Datos y Tablas
```powershell
# Desde la carpeta raíz del proyecto
cd backend

# Ejecutar el esquema (Windows PowerShell)
Get-Content .\database\schema_min.sql | mysql -u root -p

# En Git Bash o Linux/Mac
mysql -u root -p < database/schema_min.sql
```

#### c) (Opcional) Insertar Datos de Prueba
```powershell
# Cargar datos de prueba para desarrollo
Get-Content .\database\test_data.sql | mysql -u root -p

# En Git Bash o Linux/Mac
mysql -u root -p < database/test_data.sql
```

### 3. Instalar Dependencias

#### Backend
```powershell
cd backend
npm install
```

#### Frontend
```powershell
cd ../frontend
npm install
```

---

## ⚙️ Configuración del Backend

### 1. Crear el Archivo de Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/`:

```powershell
cd backend
New-Item .env -ItemType File
```

### 2. Configurar Variables de Entorno

Edita el archivo `backend/.env` con el siguiente contenido:

```env
# Configuración del Servidor
NODE_ENV=development
PORT=3000

# Configuración de Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=ganado_bovino

# Configuración JWT (cambia estos valores en producción)
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion
JWT_REFRESH_SECRET=tu_clave_refresh_super_secreta_cambiala_en_produccion
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Configuración de Multer (almacenamiento de archivos)
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

> ⚠️ **IMPORTANTE**: Cambia los valores de `JWT_SECRET` y `JWT_REFRESH_SECRET` por claves seguras únicas. En producción, usa valores fuertes y mantenlos secretos.

### 3. Crear Carpetas Necesarias

```powershell
# Desde la carpeta backend
New-Item -ItemType Directory -Force -Path uploads
New-Item -ItemType Directory -Force -Path logs
```

---

## 🎨 Configuración del Frontend

### 1. Crear el Archivo de Variables de Entorno

Crea un archivo `.env` en la carpeta `frontend/`:

```powershell
cd frontend
New-Item .env -ItemType File
```

### 2. Configurar Variables de Entorno

Edita el archivo `frontend/.env`:

```env
# URL del Backend API
VITE_API_URL=http://localhost:3000/api
```

> 📝 **Nota**: Si cambias el puerto del backend, actualiza esta URL.

---

## ▶️ Ejecución del Proyecto

### Modo Desarrollo (Recomendado)

Necesitas **dos terminales** abiertas simultáneamente:

#### Terminal 1 - Backend
```powershell
cd backend
npm run dev
```

Este comando inicia el servidor Node.js con recarga automática (hot-reload). Verás un mensaje confirmando la conexión a MySQL y el puerto donde está corriendo (por defecto 3000).

#### Terminal 2 - Frontend  
```powershell
cd frontend
npm start
```

Este comando inicia el servidor de desarrollo de Vite y **abre automáticamente el navegador** en http://localhost:5173. Si prefieres abrir el navegador manualmente, usa `npm run dev` en su lugar.

> 💡 **Nota**: Si el puerto 5173 está ocupado, Vite cambiará automáticamente al siguiente disponible (5174, 5175, etc.).

---
---

### Modo Producción

Para compilar y ejecutar la versión optimizada de producción:

#### Backend
```powershell
cd backend
npm run build    # Compila TypeScript a JavaScript
npm start        # Inicia el servidor en modo producción
```

El servidor de producción usa los archivos compilados en la carpeta `dist/`.

#### Frontend
```powershell
cd frontend
npm run build    # Compila y optimiza para producción
npm run preview  # Previsualiza el build localmente
npm run start    # Inicia el front en modo producción
```

El build de producción genera archivos optimizados en la carpeta `dist/`.

---

### Acceso a la Aplicación

Una vez ejecutados los comandos, accede a:
- **Frontend**: http://localhost:5173 (modo desarrollo) o el puerto mostrado en la terminal
- **Backend API**: http://localhost:3000

---

## 📂 Estructura del Proyecto

```
Venta_Ganado/
│
├── backend/                      # Servidor Node.js + Express
│   ├── database/                 # Scripts de base de datos
│   │   ├── schema_min.sql        # Esquema de la BD
│   │   └── test_data.sql         # Datos de prueba
│   │
│   ├── src/
│   │   ├── config/               # Configuraciones
│   │   │   ├── database.ts       # Conexión MySQL
│   │   │   ├── jwt.ts            # Configuración JWT
│   │   │   └── multer.ts         # Configuración archivos
│   │   │
│   │   ├── controllers/          # Controladores
│   │   │   ├── auth.controller.ts
│   │   │   ├── bovino.controller.ts
│   │   │   └── marketplace.controller.ts
│   │   │
│   │   ├── services/             # Lógica de negocio
│   │   │   ├── auth.service.ts
│   │   │   ├── bovino.service.ts
│   │   │   └── marketplace.service.ts
│   │   │
│   │   ├── middlewares/          # Middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── routes/               # Rutas de la API
│   │   │   ├── auth.routes.ts
│   │   │   ├── bovino.routes.ts
│   │   │   └── marketplace.routes.ts
│   │   │
│   │   ├── models/               # Modelos de datos
│   │   ├── types/                # Tipos TypeScript
│   │   ├── utils/                # Utilidades
│   │   ├── app.ts                # Configuración Express
│   │   └── server.ts             # Servidor HTTP
│   │
│   ├── uploads/                  # Archivos subidos
│   ├── logs/                     # Logs del servidor
│   ├── .env                      # Variables de entorno
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── frontend/                     # Aplicación React
│   ├── src/
│   │   ├── api/                  # Cliente API
│   │   │   ├── axios.config.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── bovino.api.ts
│   │   │   └── marketplace.api.ts
│   │   │
│   │   ├── components/           # Componentes React
│   │   │   ├── auth/
│   │   │   ├── bovino/
│   │   │   ├── marketplace/
│   │   │   ├── layout/
│   │   │   └── common/
│   │   │
│   │   ├── pages/                # Páginas
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── bovinos/
│   │   │   └── marketplace/
│   │   │
│   │   ├── hooks/                # Custom hooks
│   │   ├── store/                # Estado global (Zustand)
│   │   ├── types/                # Tipos TypeScript
│   │   ├── styles/               # Estilos CSS
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/                   # Archivos estáticos
│   ├── .env                      # Variables de entorno
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.cjs
│   └── tsconfig.json
│
└── README.md                     # Este archivo
```

---

## 🔌 Endpoints de la API

### Autenticación (`/api/auth`)
```
POST   /api/auth/register        # Registrar usuario
POST   /api/auth/login           # Iniciar sesión
POST   /api/auth/refresh         # Renovar token
POST   /api/auth/logout          # Cerrar sesión
```

### Bovinos (`/api/bovinos`)
```
GET    /api/bovinos              # Listar bovinos del usuario
POST   /api/bovinos              # Crear nuevo bovino
GET    /api/bovinos/:id          # Obtener bovino específico
PUT    /api/bovinos/:id          # Actualizar bovino
DELETE /api/bovinos/:id          # Eliminar bovino
POST   /api/bovinos/:id/fotos    # Subir foto del bovino
```

### Marketplace (`/api/publicaciones`)
```
GET    /api/publicaciones        # Listar publicaciones (con filtros)
POST   /api/publicaciones        # Crear publicación
GET    /api/publicaciones/:id    # Ver detalles de publicación
PUT    /api/publicaciones/:id    # Actualizar publicación
DELETE /api/publicaciones/:id    # Eliminar publicación
```

#### Parámetros de Filtrado en GET `/api/publicaciones`
```
?busqueda=texto          # Búsqueda por título/descripción/raza
&raza=Holstein           # Filtrar por raza
&sexo=M                  # Filtrar por sexo (M/F)
&edad_min=12             # Edad mínima en meses
&edad_max=60             # Edad máxima en meses
&peso_min=200            # Peso mínimo en kg
&peso_max=800            # Peso máximo en kg
&precio_min=1000000      # Precio mínimo
&precio_max=5000000      # Precio máximo
&municipio=Tunja         # Filtrar por municipio
&ordenar=precio_asc      # Ordenar (precio_asc|precio_desc|reciente|antiguo)
&pagina=1                # Número de página
&limite=12               # Resultados por página
```

---

## 🛍️ Características del Marketplace

### Flujo de Uso para Vendedores

1. **Registrar un Bovino**
   - Ir a "Mis Bovinos"
   - Completar formulario con información del animal
   - Subir fotografías

2. **Publicar en el Marketplace**
   - Seleccionar el bovino registrado
   - Establecer precio
   - Escribir descripción atractiva
   - Activar publicación

3. **Gestionar Publicaciones**
   - Ver estado de publicaciones activas
   - Editar precio o descripción
   - Desactivar/Reactivar publicaciones
   - Recibir contactos de compradores

### Flujo de Uso para Compradores

1. **Explorar el Marketplace**
   - Acceder desde el menú "Marketplace"
   - Ver todas las publicaciones activas

2. **Buscar y Filtrar**
   - Usar barra de búsqueda para texto libre
   - Aplicar filtros avanzados:
     - Tipo de raza
     - Sexo del animal
     - Rango de edad
     - Rango de peso
     - Presupuesto (precio)
     - Ubicación

3. **Ver Detalles**
   - Click en cualquier publicación
   - Ver información completa del bovino
   - Ver datos del vendedor
   - Verificar estado sanitario

4. **Contactar al Vendedor**
   - Botón de WhatsApp directo
   - Negociar precio y detalles
   - Coordinar visita o transacción

---

## 🔧 Solución de Problemas

### Error: "TS6133: 'X' is declared but its value is never read"

**Causa:**
- TypeScript detecta variables o funciones declaradas que no se están usando en el código.
- El proyecto tiene la configuración `noUnusedLocals: true` en `tsconfig.app.json`.

**Solución:**
```powershell
# Opción 1: Comentar la función no usada (recomendado para funcionalidad futura)
# En el archivo del error, comenta la función con // TODO

# Opción 2: Eliminar la función si no se necesita

# Opción 3: Desactivar temporalmente la verificación (no recomendado)
# En tsconfig.app.json, cambiar "noUnusedLocals": false
```

**Ejemplo de corrección en `DetalleBovino.tsx`:**
```typescript
// TODO: Implementar formulario para agregar registros reproductivos
// const handleAddReproductivo = async (data: Partial<RegistroReproductivo>) => {
//   await bovinoApi.addReproductivo(parseInt(id!), data);
//   await fetchData();
// };
```

### Error: "Cannot connect to MySQL"

**Causas comunes:**
- MySQL no está ejecutándose
- Credenciales incorrectas en `.env`
- Base de datos no creada

**Solución:**
```powershell
# Verificar que MySQL está corriendo
net start MySQL80

# Verificar credenciales
mysql -u root -p

# Recrear base de datos
cd backend
Get-Content .\database\schema_min.sql | mysql -u root -p
```

### Error: "Port 3000 already in use"

**Solución:**
```powershell
# Cambiar el puerto en backend/.env
PORT=3001

# O matar el proceso que usa el puerto
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: "JWT malformed" o "Invalid token"

**Solución:**
- Cierra sesión y vuelve a iniciar sesión
- Limpia el localStorage del navegador (F12 > Application > Local Storage > Clear)
- Verifica que `JWT_SECRET` sea el mismo en backend

### Los estilos de TailwindCSS no se aplican

**Solución:**
```powershell
cd frontend

# Verificar que el archivo globals.css tiene:
# @import "tailwindcss";

# Reinstalar dependencias
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### Error: "Cannot find module" en Backend

**Solución:**
```powershell
cd backend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
npm run build
```

### Frontend no se conecta al Backend

**Solución:**
1. Verifica que el backend esté corriendo: http://localhost:3000
2. Verifica `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
3. Reinicia el servidor de Vite
4. Verifica la configuración de CORS en `backend/src/app.ts`

---

## 🚀 Despliegue en Producción

### Backend (Vercel, Railway, Render, etc.)

1. **Configurar Variables de Entorno**
   - Todas las variables del archivo `.env`
   - Usar base de datos MySQL en la nube (ej: PlanetScale, AWS RDS)

2. **Script de Build**
   ```json
   "scripts": {
     "build": "tsc",
     "start": "node dist/server.js"
   }
   ```

3. **Configurar `vercel.json` (si usas Vercel)**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/server.js"
       }
     ]
   }
   ```

### Frontend (Vercel, Netlify, etc.)

1. **Configurar Variable de Entorno**
   ```
   VITE_API_URL=https://tu-backend.vercel.app/api
   ```

2. **Script de Build**
   ```json
   "scripts": {
     "build": "tsc -b && vite build"
   }
   ```

3. **Configurar Redirecciones (Netlify)**
   Crear `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Base de Datos en Producción

**Opciones recomendadas:**
- **PlanetScale**: MySQL serverless
- **AWS RDS**: MySQL gestionado
- **Google Cloud SQL**: MySQL en GCP
- **Azure Database for MySQL**

**Pasos:**
1. Crear instancia de MySQL
2. Ejecutar `schema_min.sql`
3. Actualizar variables `DB_*` en el servidor

---

## 📝 Notas Adicionales

### Seguridad

- ✅ Usa HTTPS en producción
- ✅ Cambia los valores de `JWT_SECRET` y `JWT_REFRESH_SECRET`
- ✅ Implementa rate limiting (ya incluido con `express-rate-limit`)
- ✅ Mantén las dependencias actualizadas
- ✅ No commits el archivo `.env` al repositorio

### Mantenimiento

- Logs del backend en `backend/logs/`
- Backup regular de la base de datos
- Monitoreo de errores en producción

### Contribuciones

Si deseas contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👥 Autores

Proyecto desarrollado para la gestión de ganado bovino en Boyacá, Colombia.

---

## 📞 Soporte

Si tienes problemas con la instalación o ejecución:
1. Revisa la sección de [Solución de Problemas](#-solución-de-problemas)
2. Verifica que cumples todos los [Requisitos Previos](#-requisitos-previos)
3. Asegúrate de seguir todos los pasos de [Instalación](#-instalación-completa)

---

**¡Feliz desarrollo! 🚀🐮**
