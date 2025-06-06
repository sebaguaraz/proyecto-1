// backend/models/Artist.js
const db = require("./db"); // Importa la conexión a la base de datos.
// const { update } = require("./User"); // ¡Esta línea no se usa! Puedes eliminarla o comentarla.

const Artist = {
    // Busca un perfil de artista por su ID de usuario.
    findByUserId: (userId, callback) => {
        const query = "SELECT * FROM artists WHERE user_id = ?";
        db.query(query, [userId], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0]); // Retorna el primer perfil encontrado.
        });
    },

    // Crea un perfil de artista vacío para un nuevo usuario.
    create: (userId, callback) => {
        const query = "INSERT INTO artists (user_id) VALUES (?)";
        db.query(query, [userId], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result); // Retorna el resultado de la inserción.
        });
    },
    
    update: (userId, data, callback) => {
        const setClauses = [];
        const queryValues = [];
        for (const key of Object.keys(data)) {
            setClauses.push(`${key} = ?`);
            queryValues.push(data[key]);
        }
        if (setClauses.length === 0) {
            return callback(new Error("No se proporcionaron campos para actualizar el perfil del artista."), null);
        }
        const query = `UPDATE artists SET ${setClauses.join(', ')} WHERE user_id = ?`;
        queryValues.push(userId);

        db.query(query, queryValues, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results); // <-- Esto es lo que debe devolver tu Artist.update
        });
    },
    // Obtiene todos los perfiles de artistas (para administradores).
    findAll: (callback) => {
        const query = "SELECT * FROM artists";
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    // Elimina el perfil de un artista por su ID de usuario.
    deleteByUserId: (userId, callback) => {
        const query = "DELETE FROM artists WHERE user_id = ?";
        db.query(query, [userId], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.affectedRows > 0); // Retorna true si se eliminó una fila.
        });
    },
};

module.exports = Artist;