const db = require("./db");  // Importa la conexión a la base de datos.
const bcrypt = require("bcryptjs");  // Importa bcrypt para hashear contraseñas.


// El método query() devolverá un array de objetos si la consulta es una operación SELECT y hay filas que coinciden con los criterios de búsqueda. 
// 🎯 ¿QUÉ DEVUELVE db.query()?
// SIEMPRE devuelve un array con 2 elementos: [results, fields]

// results → Tus datos (lo que te interesa)
class UserRepository {
  // Busca un usuario por su username y trae también el nombre de su rol.
  async findByUsername(username) {
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

    const [results] = await db.query(query, [username]); // db.query devuelve un array con 2 elementos: [results, fields], results es un array con los resultados de la consulta
    return results[0] || null;
  };

  // Crea un usuario (hashea la contraseña antes de guardar)
  async create(username, plainPassword, role_id) {
    const saltRounds = 10; // Coste del hasheo (balance entre seguridad y rendimiento)
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const query = "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)";
    const [result] = await db.query(query, [username, hashedPassword, role_id]);
    return result;
  };

  // Listar todos los usuarios
  async findAll() {
    const query = `
    SELECT 
    users.id, 
    users.username, 
    roles.name as role_id
    FROM users 
    INNER JOIN roles ON users.role_id = roles.id`;  // Define la consulta para obtener todos los usuarios.
    const [results] = await db.query(query);
    return results || [];
  };

  // Buscar un usuario por ID
  async findById(id) {
    const query = "SELECT * FROM users WHERE id = ?";  // Define la consulta para buscar por ID.
    const [results] = await db.query(query, [id]);
    return results[0] || null;
  };

  // Actualizar un usuario (¡Hashea la contraseña si se proporciona!)
  async update(id, data) {
    // Verificar si se está enviando una nueva contraseña para actualizar
    if (data.password) {
      // Hashear la nueva contraseña antes de actualizar
      const saltRounds = 10;  // Define el número de rondas de sal.
      data.password = await bcrypt.hash(data.password, saltRounds);  // Hashea la contraseña.
    }

    const query = "UPDATE users SET ? WHERE id = ?";  // Define la consulta de actualización.
    const [result] = await db.query(query, [data, id]);

    return result.affectedRows > 0 ? result : null


  };

  async delete(id) {
    const query = "DELETE FROM users WHERE id = ?";  // Define la consulta de eliminación.
    const [result] = await db.query(query, [id]);

    return result.affectedRows > 0 ? result : null
  };
  
};

/* En resumen: Este archivo importa la conexión a la base de datos (db) y la herramienta para hashear contraseñas (bcrypt). Luego, define un objeto User que contendrá todas las operaciones específicas para la tabla users y lo exporta para que los controladores puedan usarlo.*/
module.exports = new UserRepository();  // Exporta el modelo User.