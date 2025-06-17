-- Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS musica_systems;
USE musica_systems;

-- Tabla: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','artist') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla: artists
CREATE TABLE IF NOT EXISTS artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    photo_url VARCHAR(255),
    contact_email VARCHAR(100),
    phone_number VARCHAR(20),
    website_url VARCHAR(255),
    spotify_url VARCHAR(255),
    apple_music_url VARCHAR(255),
    tidal_url VARCHAR(255),
    youtube_music_url VARCHAR(255),
    youtube_channel_url VARCHAR(255),
    instagram_url VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ejemplo de usuario (la contraseña debe ir hasheada)
INSERT INTO users (username, password, role) VALUES
('admin', '$2b$10$hashdeejemplo1234567890', 'admin'),
('artista1', '$2b$10$hashdeejemplo0987654321', 'artist');