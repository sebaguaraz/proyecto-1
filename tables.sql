-- Esquema de Base de Datos para Musicalendaria (Con ON DELETE CASCADE)

-- 1. Tabla 'roles'
-- Almacena los diferentes roles de usuario (administrador, artista, invitado).
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- Ej: 'administrador', 'artista', 'invitado'
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabla 'users'
-- Almacena la información de los usuarios y su rol.
-- Se relaciona con la tabla 'roles' mediante 'role_id'.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Almacenar hashes de contraseñas, no texto plano
    role_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT -- Generalmente RESTRICT o NO ACTION para roles, para no borrar un rol si hay usuarios asignados.
);

-- 3. Tabla 'artists'
-- Almacena la información personal de los artistas, incluyendo los enlaces a plataformas/redes sociales
-- directamente en esta tabla para simplificar.
CREATE TABLE artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE, -- Cada artista es un usuario único
    photo_url VARCHAR(255),       -- Enlace a Google Drive o similar
    contact_email VARCHAR(100),
    phone_number VARCHAR(50),
    website_url VARCHAR(255),     -- Sitio web o portfolio online
    bio TEXT,
    -- Enlaces a plataformas de streaming y redes sociales (simplificado)
    spotify_url VARCHAR(255),
    apple_music_url VARCHAR(255),
    tidal_url VARCHAR(255),
    youtube_music_url VARCHAR(255),
    youtube_channel_url VARCHAR(255), -- Canal de YouTube
    instagram_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Si borras un usuario, borra su registro de artista.
);

-- 4. Tabla 'events' (o 'calendar_events')
-- Almacena la información de las presentaciones en vivo de los artistas.
-- Es la base para la "cartelera".
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL, -- Un título para el evento (ej. "Show en La Trastienda")
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    entry_mode ENUM('gorra', 'gratuito', 'beneficio', 'arancelado') NOT NULL,
    price DECIMAL(10, 2),         -- Opcional, para modalidad 'arancelado'
    ticket_platform_url VARCHAR(255), -- Enlace a plataforma de venta de entradas online (opcional)
    flyer_url VARCHAR(255),       -- Enlace a Google Drive del flyer
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE -- Si borras un artista, borra todos sus eventos.
);

------------------------------------------------------------------------------------------------------------------------------------
