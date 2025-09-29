const db = require("./db");

const Event = {
  // Aquí definiremos las funciones para crear, leer, actualizar y borrar eventos
  // Por ejemplo: create, findById, findAllByArtist, update, delete
  /**
   * Crea un nuevo evento en la base de datos.
   * @param {object} eventData - Objeto con los datos del evento.
   *   Ej: { artist_id, title, date, location, entry_mode, price, ticket_link, flyer }
   */
  async create (existingEvent) {
    // cadena sql para insertar un nuevo evento en la base de datos
    const query = `
      INSERT INTO events (
        artist_id,
        entry_modes_id, 
        title, 
        date,
        time, 
        location, 
        price, 
        flyer_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // valores a insertar en la base de datos, se pasan como un array para evitar inyecciones SQL
    const {
      artist_id,
      entry_mode_id,
      title,
      date, // Asegúrate de que el formato sea 'YYYY-MM-DD HH:MM:SS'
      time,
      location,
      price,
      flyer_url 
    } = existingEvent;
    const [result] = await db.query( query, [artist_id, entry_mode_id, title, date, time, location, price, flyer_url]);
    return result
  },

  /**
   * Busca un evento por su ID.
   * @param {number} id - ID del evento a buscar.
   * @param {function} callback - Función a ejecutar tras la consulta (err, event).
   */
  async findById (id) {
    const query = "SELECT * FROM events WHERE id = ?";
    const [results] = await db.query(query, [id]);
    return results[0] || null;
  },

  /**
   * Busca todos los eventos de un artista específico.
   * @param {number} artistId - ID del artista.
   * @param {function} callback - Función a ejecutar tras la consulta (err, events).
   */
  async findAllByArtistId (artistId) {
    const query = "SELECT * FROM events WHERE artist_id = ? ORDER BY date DESC";
    const [results] = await db.query(query, [artistId]);
    return results || [];
  },

  /**
   * Busca todos los eventos (útil para una cartelera general o un administrador).
   * @param {function} callback - Función a ejecutar tras la consulta (err, events).
   */
  async findAll () {
    const query = "SELECT * FROM events ORDER BY date DESC";
    const [results] = await db.query(query);
    return results || [];
  },

  /**
   * Actualiza un evento existente.
   * @param {number} id - ID del evento a actualizar.
   * @param {object} dataToUpdate - Objeto con los campos a actualizar.
   * @param {function} callback - Función a ejecutar tras la consulta (err, results).
   */
  async update (id, dataToUpdate) {
    const query = "UPDATE events SET ? WHERE id = ?";
    const [result] = await db.query(query, [dataToUpdate, id]);
    return result.affectedRows > 0 ? result : null;
  },

  /**
   * Elimina un evento por su ID.
   * @param {number} id - ID del evento a eliminar.
   * @param {function} callback - Función a ejecutar tras la consulta (err, results).
   */
  async delete (id) {
    const query = "DELETE FROM events WHERE id = ?";
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0 ? result : null;
  }
};

module.exports = Event;