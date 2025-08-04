# 📝 NotesApp - Aplicación de Notas

Una aplicación completa de notas desarrollada con Node.js, React (Vite), y MySQL que permite a los usuarios crear, organizar y compartir notas de texto.

## 🚀 Características

### Para Usuarios Anónimos:
- ✅ **Login**: Autenticación con email y contraseña
- ✅ **Registro**: Crear cuenta nueva
- ✅ **Ver notas públicas**: Acceso a notas públicas mediante URL

### Para Usuarios Registrados:
- ✅ **Dashboard**: Ver listado de notas (solo títulos)
- ✅ **Visualizar notas**: Ver contenido completo de las notas
- ✅ **Crear notas**: Título, contenido y categoría
- ✅ **Editar notas**: Modificar título, contenido y categoría
- ✅ **Eliminar notas**: Eliminar notas propias
- ✅ **Categorías**: Sistema de categorías fijas y personalizables
- ✅ **Notas públicas**: Marcar notas como públicas para compartir
- ✅ **Imágenes**: Asociar una imagen a cada nota
- ✅ **Gestión de categorías**: Crear, editar y eliminar categorías personalizadas

## 🛠️ Tecnologías Utilizadas

### Backend:
- **Node.js** con Express
- **MySQL** como base de datos
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **multer** para subida de archivos
- **express-validator** para validaciones

### Frontend:
- **React 18** con Vite
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **React Hot Toast** para notificaciones
- **CSS puro** para estilos

## 📦 Instalación

### Prerrequisitos:
- Node.js (v16 o superior)
- MySQL (v8 o superior)
- npm o yarn

### 1. Clonar el repositorio:
```bash
git clone https://github.com/danielbarreiroo/notes-app.git
cd notes-app
```

### 2. Instalar dependencias:
```bash
# Instalar dependencias del proyecto principal y subdirectorios
npm run install-all
```

### 3. Configurar la base de datos:

#### Crear base de datos MySQL:
```sql
CREATE DATABASE notes_app;
```

#### Configurar variables de entorno:
Crear archivo `backend/.env`:
```env
# Base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=notes_app
DB_PORT=3306

# JWT Secret
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024

# Puerto del servidor
PORT=5000

# Entorno
NODE_ENV=development
```

### 4. Ejecutar la aplicación:

#### Opción 1: Ejecutar todo junto (recomendado)
```bash
npm run dev
```

#### Opción 2: Ejecutar por separado
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 5. Acceder a la aplicación:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Test API**: http://localhost:5000/api/test

## 📁 Estructura del Proyecto

```
notes-app/
├── backend/                 # Servidor Node.js/Express
│   ├── config/
│   │   └── database.js     # Configuración de MySQL
│   ├── controllers/        # Controladores de rutas
│   │   ├── authController.js
│   │   ├── notesController.js
│   │   ├── categoriesController.js
│   │   └── publicController.js
│   ├── middleware/         # Middlewares
│   │   └── auth.js        # Autenticación JWT
│   ├── routes/            # Definición de rutas
│   │   ├── auth.js
│   │   ├── notes.js
│   │   ├── categories.js
│   │   └── public.js
│   ├── uploads/           # Archivos subidos
│   │   └── images/        # Imágenes de notas
│   ├── .env              # Variables de entorno
│   ├── package.json
│   └── server.js         # Archivo principal del servidor
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/       # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── pages/         # Páginas de la aplicación
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateNote.jsx
│   │   │   ├── EditNote.jsx
│   │   │   ├── ViewNote.jsx
│   │   │   ├── PublicNote.jsx
│   │   │   └── Categories.jsx
│   │   ├── services/      # Servicios API
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── init.sql          # Script de inicialización DB
├── package.json          # Configuración principal
└── README.md            # Este archivo
```

## 🔐 API Endpoints

### Autenticación:
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Notas:
- `GET /api/notes` - Obtener notas del usuario
- `GET /api/notes/:id` - Obtener nota específica
- `POST /api/notes` - Crear nueva nota
- `PUT /api/notes/:id` - Actualizar nota
- `DELETE /api/notes/:id` - Eliminar nota

### Categorías:
- `GET /api/categories` - Obtener categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Público:
- `GET /api/public/notes/:id` - Obtener nota pública

## 💾 Base de Datos

### Tablas:

#### `users`
- `id` (INT, PK, AUTO_INCREMENT)
- `email` (VARCHAR(255), UNIQUE)
- `password` (VARCHAR(255))
- `created_at` (TIMESTAMP)

#### `categories`
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR(100))
- `created_by` (INT, FK to users.id)
- `created_at` (TIMESTAMP)

#### `notes`
- `id` (INT, PK, AUTO_INCREMENT)
- `title` (VARCHAR(255))
- `content` (TEXT)
- `category_id` (INT, FK to categories.id)
- `user_id` (INT, FK to users.id)
- `is_public` (BOOLEAN)
- `image_path` (VARCHAR(255))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔒 Características de Seguridad

- **Autenticación JWT**: Tokens seguros para sesiones
- **Hash de contraseñas**: bcryptjs con salt rounds
- **Validación de datos**: Tanto en frontend como backend
- **Protección de rutas**: Middleware de autenticación
- **CORS configurado**: Para seguridad entre dominios
- **Helmet.js**: Headers de seguridad
- **Sanitización**: Validación y limpieza de inputs

## 📱 Características de UX/UI

- **Diseño responsive**: Funciona en móvil, tablet y desktop
- **Notificaciones**: Toast messages para feedback
- **Loading states**: Indicadores de carga
- **Navegación intuitiva**: Rutas claras y breadcrumbs
- **Confirmaciones**: Para acciones destructivas
- **Preview de imágenes**: Al subir archivos

## 🚀 Scripts Disponibles

```bash
# Instalar todas las dependencias
npm run install-all

# Ejecutar en modo desarrollo (backend + frontend)
npm run dev

# Solo backend
npm run server

# Solo frontend
npm run client

# Build para producción
npm run build
```

## 🌟 Funcionalidades Destacadas

### 1. **Sistema de Notas Completo**
- CRUD completo de notas
- Editor de texto 
- Soporte para imágenes
- Sistema de categorías

### 2. **Privacidad y Compartir**
- Notas privadas por defecto
- Opción de hacer notas públicas
- Enlaces únicos para compartir
- Control total sobre la privacidad

### 3. **Organización**
- Categorías predefinidas del sistema
- Categorías personalizables por usuario
- Filtros por tipo de nota
- Búsqueda y ordenamiento

### 4. **Experiencia de Usuario**
- Interface limpia e intuitiva
- Navegación fluida
- Responsive design
- Feedback inmediato

## 🔧 Personalización

### Agregar nuevas características:
1. **Backend**: Crear controlador en `controllers/`
2. **Rutas**: Definir en `routes/`
3. **Frontend**: Crear página en `pages/`
4. **API**: Agregar servicio en `services/api.js`

### Modificar estilos:
- CSS principal en `frontend/src/index.css`
- Componentes con estilos inline para máxima flexibilidad

## 🐛 Solución de Problemas