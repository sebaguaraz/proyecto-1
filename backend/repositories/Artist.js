// backend/models/Artist.js
const db = require("./db"); // Importa la conexión a la base de datos.

class ArtistRepository {
    // Busca un perfil de artista por su ID de usuario.
    async findByUserId (userId) {
        const query = "SELECT * FROM artists WHERE user_id = ?";
        const [result] = await db.query(query, [userId]);
        return result[0] || null;
    };

    // Crea un perfil de artista vacío para un nuevo usuario.
    async create (userId, username) {
        const query = "INSERT INTO artists (user_id, username) VALUES (?, ?)";
        const [result] = await db.query(query, [userId, username]);
        return result
    };
    

    async update (userId, data) {
        
        try {

            const setClauses = [];
            const queryValues = [];
            
            for (const key of Object.keys(data)) {
                // Solo agregamos si el valor NO es undefined
                if (data[key] !== undefined) {
                setClauses.push(`${key} = ?`);
                queryValues.push(data[key]);
                }
            }            
            
            const query = `UPDATE artists SET ${setClauses.join(', ')} WHERE user_id = ?`;
            queryValues.push(userId);
        
            const [result] = await db.query(query, queryValues );
            
            return result.affectedRows > 0 ? result : null 



        } catch (error) {
            console.error('Error al actualizar el perfil del artista:', error);
        }




    };


    // Obtiene todos los perfiles de artistas (para administradores).
    async findAll () {
        const query = "SELECT * FROM artists";
        const [results] = await db.query(query);
        return results || [];
    };


    // Elimina el perfil de un artista por su ID de usuario.
    async deleteByUserId (userId) {
        const query = "DELETE FROM artists WHERE user_id = ?";
        const [result] = await db.query(query, [userId]);
        
        return result.affectedRows > 0 ? result : null 
    };

};

module.exports = new ArtistRepository();