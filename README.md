**MUSICAA**

Resumen
- Proyecto fullstack (backend + frontend estático) para gestión de artistas y eventos.
- Objetivo: permitir que artistas creen y administren eventos, y que administradores gestionen usuarios, roles y logs.

Por qué lo hice (qué resolví)
- Implementé autenticación basada en JWT para rutas protegidas y control de permisos por roles (`admin`, `artist`).
- Diseñé endpoints REST para CRUD de eventos, gestión de usuarios y perfiles de artistas.
- Añadí un sistema de logs para auditar acciones importantes (creación/edición/eliminación).

Tecnologías
- Backend: Node.js, Express.
- Base de datos: MySQL (driver `mysql2` con pool). Dependencia `sequelize` presente pero la lógica actual usa consultas con `mysql2`.
- Autenticación: `bcryptjs` (hash de contraseñas) y `jsonwebtoken` (JWT).
- Frontend: HTML estático, CSS y JavaScript (fetch API).
- Utilidades: `dotenv` para configuración, `cors` para CORS, `nodemon` para desarrollo.

Estructura principal
- `server.js` — punto de entrada y servidor estático para `frontend/`.
- `routes/` — definiciones de rutas por recurso.
- `controllers/` — reciben solicitudes y responden (mapeo HTTP → service).
- `services/` — lógica de negocio y validaciones (manejadores principales).
- `repositories/` — acceso a la base de datos (consultas SQL).
- `middlewares/` — `authMiddleware.js` para proteger rutas y verificar roles.
- `frontend/` — páginas HTML, CSS y `js/` con la lógica de cliente.

Características destacadas
- Roles y permisos: rutas protegidas por `protect` y `authorize`.
- Buen patrón de separación (controllers → services → repositories).
- Manejo de contraseñas seguro (hash con bcrypt) y tokens JWT con expiración.
- Uso de pool de conexiones para evitar fugas y mejorar rendimiento.

Instalación (local)

Requisitos previos
- Node.js (v16+ recomendado)
- MySQL (local o contenedor)

Pasos
1) Clonar el repositorio

```bash
git clone <tu-repo>
cd MUSICAA/backend
```

2) Instalar dependencias del backend

```bash
npm install
```

3) Crear la base de datos y usuario (ejemplo MySQL)

Conéctate a MySQL y ejecuta:

```sql
CREATE DATABASE musica_systems;
CREATE USER 'ticket123'@'localhost' IDENTIFIED BY 'ticket123';
GRANT ALL PRIVILEGES ON musica_systems.* TO 'ticket123'@'localhost';
FLUSH PRIVILEGES;
```

También puedes ejecutar el archivo `tables.sql` en la raíz del proyecto para crear las tablas necesarias.

4) Crear archivo `.env` en `backend/` con estas variables (ejemplo):

```
PORT=3000
DB_HOST=localhost
DB_USER=ticket123
DB_PASSWORD=ticket123
DB_NAME=musica_systems
JWT_SECRET=tu_clave_secreta_segura
```

5) Levantar el servidor (desarrollo)

```bash
npm run dev
```

El servidor por defecto estará en `http://localhost:3000` y sirve el frontend estático desde la carpeta `frontend/`.

Frontend
- Al ejecutar el backend el frontend queda disponible en la raíz: `http://localhost:3000/index.html` (u otras páginas en `frontend/`).

Endpoints útiles (resumen)
- POST `/api/auth/register` — registrar (crea usuario y perfil de artista por defecto).
- POST `/api/auth/login` — login; devuelve `{ token, role, userId, username }`.
- GET/POST/PUT/DELETE en `/api/events` — CRUD de eventos (autenticado para creación/edición/eliminación).
- Rutas de usuarios y artistas protegidas para `admin` o `artist` según corresponda.

Uso de autenticación en frontend
- Incluye el header `Authorization: Bearer <token>` en solicitudes protegidas.

Buenas prácticas y seguridad
- No subir `.env` al repositorio. Usa variables de entorno en despliegue.
- En producción restringe CORS (en `server.js` ahora está abierto con `app.use(cors())`).
- Usa una clave JWT fuerte y considera expiraciones y refresh tokens si es necesario.
- Evitar devolver campos sensibles (como `password`) en respuestas API: ejemplo en `services/userService.js` se recomienda filtrar el `password` antes de responder.

Notas para desarrolladores
- Código relevante:
	- servidor: `server.js`
	- middleware auth: `middlewares/authMiddleware.js`
	- lógica: `services/*.js`
	- consultas SQL: `repositories/*.js`
- El patrón controller → service → repository facilita pruebas unitarias y modularidad.

Pruebas rápidas
- Registra un usuario: POST `/api/auth/register` con `{ "username": "miUser", "password": "miPass" }`.
- Loguea: POST `/api/auth/login` y copia el token para usar en `Authorization`.
