const db = require("./db"); // Conexión a la base de datos

const Artist = {
  // Crear un nuevo artista
  create: (data, callback) => {
    const query = `
      INSERT INTO artists (user_id, name, photo, email, phone, website, spotify, apple_music, tidal, youtube_music, youtube, instagram)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.user_id,       // Relación con el usuario
      data.name,          // Nombre del artista
      data.photo,         // Enlace a la foto
      data.email,         // Correo electrónico
      data.phone,         // Teléfono
      data.website,       // Sitio web o portfolio
      data.spotify,       // Enlace a Spotify
      data.apple_music,   // Enlace a Apple Music
      data.tidal,         // Enlace a Tidal
      data.youtube_music, // Enlace a YouTube Music
      data.youtube,       // Enlace al canal de YouTube
      data.instagram,     // Enlace a Instagram
    ];
    db.query(query, values, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // Obtener todos los artistas
  findAll: (callback) => {
    const query = `
      SELECT a.*, u.username, u.role
      FROM artists a
      JOIN users u ON a.user_id = u.id
    `;
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },


  // Actualizar un artista
  update: (id, data, callback) => {
    const query = "UPDATE artists SET ? WHERE id = ?";
    db.query(query, [data, id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    const query = "DELETE FROM artists WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        // Si hay un error en la consulta, lo devolvemos
        return callback(err, null);
      }
      // Verificamos si se eliminó alguna fila
      const artistExists = results.affectedRows > 0;
      callback(null, artistExists); // true si se eliminó, false si no
    });
  },


  // Buscar un artista por user_id (EXISTENTE Y CORRECTA)
  findByUserId: (user_id, callback) => {
    const query = "SELECT * FROM artists WHERE user_id = ?";
    db.query(query, [user_id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]); // Retorna el primer artista encontrado o null si no existe
    });
  },

  // --- ¡AÑADIR ESTA FUNCIÓN! ---
  // Buscar un artista por su propio ID (el ID de la tabla artists)
  findById: (id, callback) => {
    const query = "SELECT * FROM artists WHERE id = ?"; // Busca por la columna 'id'
    db.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      // results es un array. Devolvemos el primer elemento o null si no se encontró.
      callback(null, results.length > 0 ? results[0] : null);
    });
  },
  
};

module.exports = Artist;