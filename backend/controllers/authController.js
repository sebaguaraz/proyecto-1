const bcrypt = require("bcryptjs");  // Importa bcrypt para hashear contraseñas.
const jwt = require("jsonwebtoken");  // Importa jsonwebtoken para generar tokens JWT.
const User = require("../models/User");  // Importa el modelo de Usuario.

// Controlador para el registro de usuarios
// req es el objeto que contiene la información de la petición HTTP (por ejemplo, los datos enviados por el cliente).
// res es el objeto que se utiliza para enviar la respuesta HTTP al cliente.

exports.register = async (req, res) => {
  const { username, password } = req.body; // No recibir "role" desde el frontend
  const role = "artist"; // Rol fijo

  User.findByUsername(username, async (err, existingUser) => {
    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    User.create(username, password, role, (err, result) => { // Siempre "artist"
      if (err) return res.status(500).json({ error: "Error al registrar" });
      res.status(201).json({ message: "Artista registrado exitosamente" });
    });
  });
};

// Login (idéntico a Gaby, pero con rol en JWT)
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    User.findByUsername(username, async (err, user) => {
      if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Credenciales inválidas" });

      // Generar JWT (como Gaby, pero + rol)
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role }, // Payload
        process.env.JWT_SECRET, // Clave secreta (usa la misma que Gaby)
        { expiresIn: "1h" } // Expiración
      );

      res.json({ token, role: user.role }); // Enviar token y rol
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * Importa la librería bcryptjs y la asigna a la constante bcrypt.
bcryptjs se utiliza para hashear las contraseñas antes de almacenarlas en la base de datos y para comparar las contraseñas durante el inicio de sesión. Importante: Aunque el modelo ahora hashea la contraseña, bcrypt sigue siendo necesario aquí para la comparación en el login.



const jwt = require("jsonwebtoken");:
Importa la librería jsonwebtoken y la asigna a la constante jwt.
jsonwebtoken se utiliza para generar y verificar JSON Web Tokens (JWTs). Los JWTs se utilizan para la autenticación sin estado.
 
 */