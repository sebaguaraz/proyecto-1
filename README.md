# 🎵 MUSICAA - Plataforma de Gestión de Eventos Musicales

## 📋 Descripción del Proyecto

MUSICAA es una aplicación web full-stack diseñada para la gestión integral de eventos musicales, conectando artistas con su audiencia de manera eficiente. La plataforma permite a los artistas crear, editar y gestionar sus eventos, mientras que los administradores pueden moderar el contenido y los usuarios.

## 🏗️ Arquitectura

### Frontend
- **HTML5, CSS3, JavaScript Vanilla** - Interfaz de usuario responsiva
- **Bootstrap 4.5.2** - Framework CSS para diseño moderno
- **Múltiples Dashboards Especializados** - Panel de artista y administrador

### Backend
- **Node.js** - Entorno de ejecución JavaScript
- **Express.js 5.1.0** - Framework web minimalista
- **MySQL 3.14.5** - Base de datos relacional
- **Sequelize 6.37.7** - ORM para manejo de datos
- **JWT (JSON Web Tokens)** - Autenticación segura
- **bcryptjs 3.0.2** - Encriptación de contraseñas

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- Registro y login de usuarios
- Encriptación segura de contraseñas con bcryptjs
- Autenticación JWT para sesiones persistentes
- Gestión de roles (Artista/Administrador)

### 👨‍🎨 Panel de Artista
- **Gestión de Perfil Personal**
  - Biografía profesional
  - Enlaces a redes sociales (Spotify, Instagram, YouTube, etc.)
  - Información de contacto
  - Foto de perfil

- **Gestión de Eventos**
  - Crear nuevos eventos con detalles completos
  - Editar eventos existentes
  - Visualizar eventos programados
  - Gestión de modos de entrada (Gratuito, Gorra, Beneficio, Arancelado)

### 🛠️ Panel de Administrador
- **Moderación de Usuarios**
  - Visualizar todos los usuarios registrados
  - Cambiar roles de usuario (Artist/Admin)
  - Gestión de cuentas

- **Gestión de Eventos**
  - Ver todos los eventos de la plataforma
  - Editar eventos de cualquier artista
  - Moderación de contenido

- **Sistema de Logs**
  - Registro de acciones realizadas
  - Auditoría de actividades

### 🎯 Funcionalidades Generales
- **Búsqueda y Filtrado**
  - Búsqueda por nombre de artista
  - Filtrado por modo de entrada
  - Interfaz intuitiva de búsqueda

- **Gestión de Eventos**
  - Eventos con fecha, hora y ubicación
  - Soporte para imágenes promocionales (flyers)
  - Gestión flexible de precios
  - Modos de entrada variados

## 💾 Estructura de Base de Datos

### Entidades Principales
- **Users** - Usuarios del sistema con roles
- **Artists** - Perfiles de artistas con información extendida
- **Events** - Eventos musicales con detalles completos
- **Entry_Mode** - Categorías de modos de entrada
- **Roles** - Sistema de roles de usuario
- **Logs** - Registro de acciones del sistema

## 🛠️ Tecnologías y Herramientas

### Backend Stack
- Node.js & Express.js
- MySQL con Sequelize ORM
- JWT para autenticación
- bcryptjs para seguridad
- CORS para comunicación frontend-backend
- dotenv para variables de entorno

### Frontend Stack
- HTML5 semántico
- CSS3 con Flexbox/Grid
- JavaScript ES6+ (Vanilla)
- Bootstrap 4.5.2
- Fetch API para comunicación con backend

### Dependencias Principales
```json
{
  "express": "5.1.0",
  "mysql2": "^3.14.5",
  "sequelize": "6.37.7",
  "jsonwebtoken": "9.0.2",
  "bcryptjs": "3.0.2",
  "cors": "2.8.5",
  "dotenv": "16.5.0"
}
```

## 📁 Estructura del Proyecto

```
MUSICAA/
├── backend/
│   ├── controllers/       # Controladores de la API
│   ├── middlewares/       # Middlewares personalizados
│   ├── repositories/      # Acceso a datos
│   ├── routes/           # Definición de rutas
│   ├── services/         # Lógica de negocio
│   ├── server.js         # Servidor principal
│   └── package.json      # Dependencias backend
├── frontend/
│   ├── css/             # Estilos CSS
│   ├── img/             # Recursos gráficos
│   ├── js/              # JavaScript del frontend
│   ├── *.html           # Páginas HTML
│   └── index.html       # Página principal
└── README.md
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18+)
- MySQL Server (versión 8.0+)
- Navegador web moderno
- Git (opcional)

### Arquitectura de Ejecución
⚠️ **IMPORTANTE**: Este proyecto NO se "compila" en el sentido tradicional. Es una aplicación Node.js que se ejecuta directamente con el runtime de JavaScript.

### Pasos de Instalación

#### 1. **Clonar el repositorio**
**Opción A: Con Script SQL Completo (Recomendado)**
```bash
# 1. Crear la base de datos
mysql -u root -p -e "CREATE DATABASE musica_systems;"

# 2. Ejecutar el script completo (crea todas las tablas y datos iniciales)
mysql -u root -p musica_systems < tables.sql
```

**Opción B: Solo creación manual de base de datos**
```bash
git clone [URL_DEL_REPOSITORIO]
cd MUSICAA
```

#### 2. **Configurar Base de Datos MySQL**
```sql
-- Conectar a MySQL y ejecutar:
CREATE DATABASE musica_systems;
```

#### 3. **Configurar Backend**
```bash
cd backend
npm install
```

#### 4. **Configurar Variables de Entorno**
Crear archivo `.env` en la carpeta backend:
```env
PORT=3000
DB_HOST=localhost
DB_USER=ticket123
DB_PASSWORD=ticket123
DB_NAME=musica_systems
JWT_SECRET=tu_clave_secreta_segura
```

#### 5. **Ejecutar el Proyecto**
```bash
# Desde la carpeta backend
npm run dev
```

#### 6. **Acceder a la Aplicación**
- **Frontend**: `http://localhost:3000` (se sirve automáticamente desde Express)
- **Backend API**: `http://localhost:3000/api`

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión  
- `GET /api/auth/profile` - Obtener perfil del usuario (requiere autenticación)

### Gestión de Usuarios
- `GET /api/users` - Listar todos los usuarios (Admin)
- `PUT /api/users/:id/role` - Cambiar rol de usuario (Admin)

### Gestión de Artistas
- `GET /api/artists/profile` - Obtener perfil del artista
- `PUT /api/artists/profile` - Actualizar perfil del artista
- `GET /api/artists/events` - Obtener eventos del artista autenticado

### Gestión de Eventos
- `GET /api/events` - Listar todos los eventos
- `POST /api/events` - Crear nuevo evento (Artista/Admin)
- `PUT /api/events/:id` - Actualizar evento (Propietario/Admin)
- `DELETE /api/events/:id` - Eliminar evento (Propietario/Admin)

### Sistema de Logs
- `GET /api/actions` - Ver registros de acciones del sistema (Admin)

## 🔄 Flujo de Ejecución

1. **Backend**: Servidor Express ejecuta `server.js`
2. **Base de Datos**: Sequelize se conecta a MySQL usando configuración del `.env`
3. **Frontend**: Los archivos HTML/CSS/JS se sirven estáticamente desde Express
4. **Comunicación**: Frontend hace requests AJAX a `/api/*` endpoints
5. **Autenticación**: JWT tokens se almacenan en localStorage del navegador

## 🚨 Configuración de Base de Datos

El proyecto utiliza **Sequelize ORM** con MySQL. La conexión se establece automáticamente al iniciar el servidor usando las credenciales del archivo `.env`.

**Estructura de tablas esperada** (gestionada por Sequelize):
- `users` - Usuarios del sistema
- `artists` - Perfiles de artistas
- `events` - Eventos musicales
- `entry_modes` - Categorías de modos de entrada
- `roles` - Roles del sistema
- `logs` - Registro de acciones

## 🎨 Interfaces de Usuario

### Página Principal
- Landing page con eventos destacados
- Sistema de búsqueda y filtrado
- Diseño responsivo y moderno

### Dashboards Especializados
- **Dashboard de Artista**: Gestión completa de perfil y eventos
- **Dashboard de Administrador**: Moderación y control total
- **Formularios Intuitivos**: Creación y edición simplificada

## 🔒 Seguridad Implementada

- **Encriptación de Contraseñas**: bcryptjs con salt rounds
- **Autenticación JWT**: Tokens seguros para sesiones
- **Validación de Datos**: Validación tanto frontend como backend
- **CORS Configurado**: Control de acceso entre dominios
- **Sanitización**: Prevención de inyección SQL con Sequelize

## 🌟 Características Destacadas

- **Arquitectura MVC**: Separación clara de responsabilidades
- **RESTful API**: Diseño de API estándar y escalable
- **Responsive Design**: Compatible con dispositivos móviles
- **Gestión de Estados**: Manejo eficiente de sesiones y datos
- **Sistema de Roles**: Control granular de permisos
- **Auditoría**: Logging completo de acciones

## 🚀 Funcionalidades Futuras

- Sistema de notificaciones en tiempo real
- Chat integrado entre artistas y fans
- Sistema de calificaciones y reseñas
- Integración con pasarelas de pago
- App móvil nativa
- Analytics y reportes avanzados

## 💡 Tecnologías Aprendidas

- **Desarrollo Full-Stack**: Frontend + Backend integrado
- **Base de Datos Relacionales**: MySQL y modelado de datos
- **APIs REST**: Diseño y implementación
- **Autenticación y Autorización**: JWT y roles
- **Seguridad Web**: Encriptación y validación
- **Arquitectura de Software**: Patrones MVC y modularización
- **Sequelize ORM**: Manejo avanzado de bases de datos
- **Express.js**: Desarrollo de servidores web
- **JavaScript Moderno**: ES6+, async/await, fetch API


## 🎯 Puntos Clave para Entrevistas

- **Desarrollo completo end-to-end**: Desde diseño de base de datos hasta interfaz de usuario
- **Manejo de autenticación JWT**: Implementación de sistema de login seguro
- **Arquitectura modular**: Separación clara entre capas (controllers, services, repositories)
- **Responsive design**: Interfaz adaptable a diferentes dispositivos
- **Sistema de roles**: Implementación de permisos granular
- **APIs RESTful**: Diseño de endpoints siguiendo estándares
- **ORM Sequelize**: Manejo avanzado de bases de datos relacionales