const db = require('./db'); // Conexión a la base de datos

const User = {
  // Buscar un usuario por nombre de usuario
  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]); // Retorna el primer usuario encontrado
    });
  },

  // Crear un nuevo usuario
  create: (username, password, role, callback) => {
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, password, role], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  }
};

module.exports = User;