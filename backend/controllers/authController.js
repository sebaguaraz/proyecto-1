const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Corrección: Importar correctamente el modelo User

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Verificar si el usuario ya existe
    User.findByUsername(username, async (err, existingUser) => {
      if (err) return res.status(500).json({ message: "Error en el servidor" });
      if (existingUser) return res.status(400).json({ message: "Usuario ya existe" });

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el usuario
      User.create(username, hashedPassword, role, (err, result) => {
        if (err) return res.status(500).json({ message: "Error al crear el usuario" });
        res.status(201).json({ message: "Usuario registrado con éxito" });
      });

    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar el usuario por nombre de usuario
    User.findByUsername(username, async (err, user) => {
      if (err) return res.status(500).json({ message: "Error en el servidor" });
      if (!user) return res.status(400).json({ message: "Credenciales incorrectas" });

      // Comparar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Credenciales incorrectas" });

      // Generar el token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET, // Usar clave secreta desde .env
        { expiresIn: "3h" }
      );

      res.status(200).json({
        message: "Login exitoso",
        token,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};