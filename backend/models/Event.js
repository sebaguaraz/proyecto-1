const db = require("./db"); // Conexión a la base de datos

const Event = {
  // Aquí definiremos las funciones para crear, leer, actualizar y borrar eventos
  // Por ejemplo: create, findById, findAllByArtist, update, delete
  /**
   * Crea un nuevo evento en la base de datos.
   * @param {object} eventData - Objeto con los datos del evento.
   *   Ej: { artist_id, title, date, location, entry_mode, price, ticket_link, flyer }
   * @param {function} callback - Función a ejecutar tras la consulta (err, results).
   */
  create: (eventData, callback) => {
    // cadena sql para insertar un nuevo evento en la base de datos
    const query = `
      INSERT INTO events (
        artist_id, 
        title, 
        date, 
        location, 
        entry_mode, 
        price, 
        ticket_link, 
        flyer 
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // valores a insertar en la base de datos, se pasan como un array para evitar inyecciones SQL
    const values = [
      eventData.artist_id,
      eventData.title,
      eventData.date, // Asegúrate de que el formato sea 'YYYY-MM-DD HH:MM:SS'
      eventData.location,
      eventData.entry_mode,
      eventData.price,
      eventData.ticket_link,
      eventData.flyer
    ];
    db.query(query, values, (err, results) => {
      if (err) return callback(err, null);
      // results.insertId contiene el ID del evento recién creado
      callback(null, { id: results.insertId, ...eventData });
    });
  },

  /**
   * Busca un evento por su ID.
   * @param {number} id - ID del evento a buscar.
   * @param {function} callback - Función a ejecutar tras la consulta (err, event).
   */
  findById: (id, callback) => {
    const query = "SELECT * FROM events WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      // results es un array, devolvemos el primer elemento o null si no se encuentra
      callback(null, results.length > 0 ? results[0] : null);
    });
  },

  /**
   * Busca todos los eventos de un artista específico.
   * @param {number} artistId - ID del artista.
   * @param {function} callback - Función a ejecutar tras la consulta (err, events).
   */
  findAllByArtistId: (artistId, callback) => {
    const query = "SELECT * FROM events WHERE artist_id = ? ORDER BY date DESC"; // Ordenamos por fecha descendente
    db.query(query, [artistId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  /**
   * Busca todos los eventos (útil para una cartelera general o un administrador).
   * @param {function} callback - Función a ejecutar tras la consulta (err, events).
   */
  findAll: (callback) => {
    const query = "SELECT * FROM events ORDER BY date DESC"; // Ordenamos por fecha descendente
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  /**
   * Actualiza un evento existente.
   * @param {number} id - ID del evento a actualizar.
   * @param {object} dataToUpdate - Objeto con los campos a actualizar.
   * @param {function} callback - Función a ejecutar tras la consulta (err, results).
   */
  update: (id, dataToUpdate, callback) => {
    const query = "UPDATE events SET ? WHERE id = ?";
    db.query(query, [dataToUpdate, id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results); // results.affectedRows > 0 indica si se actualizó algo
    });
  },

  /**
   * Elimina un evento por su ID.
   * @param {number} id - ID del evento a eliminar.
   * @param {function} callback - Función a ejecutar tras la consulta (err, results).
   */
  delete: (id, callback) => {
    const query = "DELETE FROM events WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results); // results.affectedRows > 0 indica si se eliminó algo
    });
  }
};

module.exports = Event;