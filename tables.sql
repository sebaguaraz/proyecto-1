-- ============================================================================
-- MUSICAA - Script de Creación de Tablas
-- Base de datos: musica_systems
-- Descripción: Define todas las tablas necesarias para el sistema de gestión 
--              de eventos musicales y perfiles de artistas.
-- ============================================================================

-- Tabla: roles
-- Descripción: Define los roles disponibles en el sistema (admin, artist, etc.)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del rol',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre del rol (admin, artist)',
    description TEXT NULL COMMENT 'Descripción del rol',
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: users
-- Descripción: Almacena los datos de autenticación de los usuarios del sistema
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del usuario',
    username VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nombre de usuario (único)',
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña hasheada con bcryptjs',
    role_id INT NOT NULL COMMENT 'Referencia al rol del usuario',
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la cuenta',
    updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: artists
-- Descripción: Perfil extendido de artistas (datos adicionales más allá de users)
CREATE TABLE IF NOT EXISTS artists (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del perfil de artista',
    user_id INT NOT NULL UNIQUE COMMENT 'Referencia al usuario (relación 1:1)',
    username VARCHAR(255) NULL COMMENT 'Nombre de usuario (copia/caché)',
    bio TEXT NULL COMMENT 'Biografía corta del artista',
    photo_url VARCHAR(255) NULL COMMENT 'URL de la foto de perfil',
    contact_email VARCHAR(100) NULL COMMENT 'Email de contacto',
    phone_number VARCHAR(50) NULL COMMENT 'Número de teléfono',
    website_url VARCHAR(255) NULL COMMENT 'Sitio web personal',
    spotify_url VARCHAR(255) NULL COMMENT 'Enlace a Spotify',
    apple_music_url VARCHAR(255) NULL COMMENT 'Enlace a Apple Music',
    tidal_url VARCHAR(255) NULL COMMENT 'Enlace a Tidal',
    youtube_music_url VARCHAR(255) NULL COMMENT 'Enlace a YouTube Music',
    youtube_channel_url VARCHAR(255) NULL COMMENT 'Enlace al canal de YouTube',
    instagram_url VARCHAR(255) NULL COMMENT 'Perfil de Instagram',
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del perfil',
    updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: entry_modes
-- Descripción: Tipos de entrada/acceso a eventos (entrada libre, VIP, etc.)
CREATE TABLE IF NOT EXISTS entry_modes (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del modo de entrada',
    name VARCHAR(250) NOT NULL COMMENT 'Nombre del modo de entrada (Libre, VIP, Pago, etc.)',
    create_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    update_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: events
-- Descripción: Almacena la información de los eventos musicales
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del evento',
    artist_id INT NOT NULL COMMENT 'Artista creador del evento',
    entry_modes_id INT NOT NULL COMMENT 'Modo de entrada del evento',
    title VARCHAR(255) NOT NULL COMMENT 'Título o nombre del evento',
    date DATE NOT NULL COMMENT 'Fecha del evento',
    time TIME NULL COMMENT 'Hora del evento',
    location VARCHAR(255) NOT NULL COMMENT 'Ubicación/lugar del evento',
    price DECIMAL(10, 2) NULL COMMENT 'Precio de entrada (si es de pago)',
    flyer_url VARCHAR(255) NULL COMMENT 'URL del póster o flyer del evento',
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del evento',
    updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (entry_modes_id) REFERENCES entry_modes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX (artist_id),
    INDEX (entry_modes_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: logs
-- Descripción: Registra las acciones de los usuarios para auditoría
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del registro',
    user_id INT NOT NULL COMMENT 'Usuario que realizó la acción',
    action VARCHAR(250) NULL COMMENT 'Descripción de la acción realizada',
    updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha y hora de la acción',
    create_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INSERCIONES DE DATOS INICIALES
-- ============================================================================

-- Insertar roles por defecto
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador del sistema con acceso total'),
('artist', 'Músico o artista que puede crear y gestionar eventos');

-- Insertar modos de entrada por defecto
INSERT INTO entry_modes (name) VALUES
('gratuito'),
('gorra'),
('beneficio'),
('arancelado');

