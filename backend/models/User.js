const db = require("./db");  // Importa la conexión a la base de datos.
const bcrypt = require("bcryptjs");  // Importa bcrypt para hashear contraseñas.

const User = {
  // Busca un usuario por su username y trae también el nombre de su rol.
  findByUsername: (username, callback) => {
    // Esta es la consulta final, 100% explícita.
    const query = `
      SELECT -- Selecciona TODAS las columnas de la tabla 'users'.
        users.id,
        users.username,
        users.password,
        users.role_id,
        users.created_at,
        roles.name AS role -- Y también selecciona la columna 'name' de la tabla 'roles', y la renombra como 'role'.
      FROM
        users -- La tabla principal de la consulta es 'users'.
      INNER JOIN
        roles ON users.role_id = roles.id -- La unimos con la tabla 'roles' donde el 'role_id' del usuario coincida con el 'id' del rol
      WHERE
        users.username = ?
      
        `;
    db.query(query, [username], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]); // Retorna el primer usuario encontrado o null
    });
  },

  // Crea un usuario (hashea la contraseña antes de guardar)
  create: (username, plainPassword, role_id, callback) => {
    const saltRounds = 10; // Coste del hasheo (balance entre seguridad y rendimiento)
    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
      if (err) return callback(err, null);
      
      const query = "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)";
      db.query(query, [username, hashedPassword, role_id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
      });
    });
  },

  // Listar todos los usuarios
  findAll: (callback) => {
    const query = "SELECT * FROM users";  // Define la consulta para obtener todos los usuarios.
    db.query(query, (err, results) => {  // Ejecuta la consulta.
      if (err) return callback(err, null);  // Maneja errores.
      callback(null, results);  // Retorna todos los usuarios.
    });
  },

  // Buscar un usuario por ID
  findById: (id, callback) => {
    const query = "SELECT * FROM users WHERE id = ?";  // Define la consulta para buscar por ID.
    db.query(query, [id], (err, results) => {  // Ejecuta la consulta.
      if (err) return callback(err, null);  // Maneja errores.
      callback(null, results[0]);  // Retorna el usuario encontrado.
    });
  },

  // Actualizar un usuario (¡Hashea la contraseña si se proporciona!)
  update: (id, data, callback) => {
    // Verificar si se está enviando una nueva contraseña para actualizar
    if (data.password) {
      // Hashear la nueva contraseña antes de actualizar
      const saltRounds = 10;  // Define el número de rondas de sal.
      data.password = bcrypt.hashSync(data.password, saltRounds);  // Hashea la contraseña.
    }

    const query = "UPDATE users SET ? WHERE id = ?";  // Define la consulta de actualización.
    db.query(query, [data, id], (err, results) => {  // Ejecuta la consulta.
      if (err) return callback(err, null);  // Maneja errores.
      // Verificar si se actualizó alguna fila para confirmar que el ID existía
      const userExists = results.affectedRows > 0;
      callback(null, results);  // Retorna el resultado de la actualización.
    });
  },

  delete: (id, callback) => {
    const query = "DELETE FROM users WHERE id = ?";  // Define la consulta de eliminación.
    db.query(query, [id], (err, results) => {  // Ejecuta la consulta.
      if (err) {
        return callback(err, null);  // Maneja errores.
      }
      const userExists = results.affectedRows > 0;
      callback(null, userExists);  // Retorna el resultado de la eliminación.
    });
  },
};

/* En resumen: Este archivo importa la conexión a la base de datos (db) y la herramienta para hashear contraseñas (bcrypt). Luego, define un objeto User que contendrá todas las operaciones específicas para la tabla users y lo exporta para que los controladores puedan usarlo.*/
module.exports = User;  // Exporta el modelo User.