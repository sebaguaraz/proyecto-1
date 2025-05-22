const User = require("../models/User");

// Listar todos los usuarios
exports.getAllUsers = (req, res) => {
  // Solo los administradores pueden listar todos los usuarios
  // La autorización de rol 'admin' ya fue hecha por el middleware authorize en la ruta.

  User.findAll((err, users) => {
    if (err) return res.status(500).json({ message: "Error al obtener usuarios" });

    // Ocultamos las contraseñas por seguridad
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPass } = user;
      return userWithoutPass;
    });

    // Enviamos la lista de usuarios (sin contraseñas) como respuesta
    res.status(200).json(usersWithoutPassword);
  });
};

// Obtener un usuario por ID
exports.getUserById = (req, res) => {
  const { id } = req.params; // Obtenemos el ID del usuario de los parámetros de la URL

  User.findById(id, (err, user) => {
    if (err) return res.status(500).json({ message: "Error al buscar el usuario" });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Autorización:
    // Los artistas solo pueden ver su propia información
    if (req.user.role === "artist" && req.user.id !== parseInt(id)) {
      // Si el usuario es un artista y está intentando ver la información de OTRO usuario, devolvemos un error 403
      return res.status(403).json({ message: "No tienes permiso para ver este usuario" });
    }

    // Si el usuario es un administrador O es el mismo artista que está viendo su perfil, permitimos el acceso
    const { password, ...userWithoutPass } = user; // Ocultamos la contraseña
    res.status(200).json(userWithoutPass); // Enviamos la información del usuario como respuesta
  });
};

exports.createUser = (req, res) => {
  // Solo los administradores pueden crear usuarios
  // La autorización de rol 'admin' ya fue hecha por el middleware authorize en la ruta.
  
  const { username, password, role } = req.body; // Obtenemos los datos del nuevo usuario del cuerpo de la petición

  // Validamos que se hayan proporcionado todos los datos necesarios
  if (!username || !password || !role) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  // Creamos el usuario en la base de datos
  User.create(username, password, role, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "El nombre de usuario ya existe." });
      }
      return res.status(500).json({ message: "Error al crear el usuario" });
    }
    res.status(201).json({ message: "Usuario creado con éxito", id: result.insertId }); // Enviamos una respuesta de éxito
  });
};

// Actualizar un usuario
exports.updateUser = (req, res) => {
  const { id } = req.params; // Obtenemos el ID del usuario a actualizar
  const data = req.body; // Obtenemos los datos de la actualización

  // Autorización:
  // Los artistas solo pueden actualizar su propia información
  if (req.user.role === "artist" && req.user.id !== parseInt(id)) {
    // Si el usuario es un artista y está intentando actualizar la información de OTRO usuario, devolvemos un error 403
    return res.status(403).json({ message: "No tienes permiso para actualizar este usuario" });
  }

  // Validamos que se hayan proporcionado datos para actualizar
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No se proporcionaron datos para actualizar." });
  }

  // Actualizamos el usuario en la base de datos
  User.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ message: "Error al actualizar el usuario" });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado para actualizar" });
    }
    res.status(200).json({ message: "Usuario actualizado con éxito" }); // Enviamos una respuesta de éxito
  });
};

// Eliminar un usuario
exports.deleteUser = (req, res) => {
  // Solo los administradores pueden eliminar usuarios
  // La autorización de rol 'admin' ya fue hecha por el middleware authorize en la ruta.
  
  const { id } = req.params; // Obtenemos el ID del usuario a eliminar

  // Eliminamos el usuario de la base de datos
  User.delete(id, (err, userExists) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar el usuario" });
    }
    if (!userExists) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado con éxito" }); // Enviamos una respuesta de éxito
  });
};