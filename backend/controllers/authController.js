const bcrypt = require("bcryptjs");   // Esto es como un "candado súper seguro" para guardar contraseñas.
const jwt = require("jsonwebtoken");  // Esto es como un "pasaporte especial" que te permite pasar.
const User = require("../models/User"); // Traemos las "reglas" de cómo son nuestros usuarios.
const Artist = require("../models/Artist") // Traemos las "reglas" de cómo son nuestros artistas.
const Role = require("../models/Role"); // <-- Corrección aquí

// --- RECETA 1: Para cuando alguien quiere REGISTRARSE (crear una cuenta nueva) ---
// 'req' es como el papelito con lo que la persona quiere registrar (usuario, contraseña).
// 'res' es como la respuesta que le damos a la persona (¡cuenta creada! o "ese usuario ya existe").
// Registro de usuario
exports.register = async (req, res) => {
    const { username, password } = req.body;
    const roleName = "artist";

    User.findByUsername(username, (err, existingUser) => {
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        Role.findByName(roleName, (err, role) => {
            if (err || !role) {
                return res.status(500).json({ error: "No se encontró el rol artist" });
            }
            const role_id = role.id;
            User.create(username, password, role_id, (err, result) => {
                if (err) {
                    console.error("Error al registrar usuario:", err);
                    return res.status(500).json({ error: "Error al registrar el usuario." });
                }
                const newUserId = result.insertId;

                // Creamos el perfil de artista
                Artist.create(newUserId, (artistErr, artistResult) => {
                    if (artistErr) {
                        console.error("Error al crear perfil de artista:", artistErr);
                        return res.status(500).json({ error: "Usuario registrado, pero hubo un error al crear su perfil de artista." });
                    }
                    res.status(201).json({ message: "Artista registrado exitosamente y perfil creado." });
                });
            });
        });
    });
};

// --- RECETA 2: Para cuando alguien quiere INICIAR SESIÓN (entrar a su cuenta) ---
// 'req' es el papelito con el usuario y contraseña para entrar.
// 'res' es la respuesta: "¡Bienvenido!" o "Contraseña incorrecta".
// Login (queda igual)
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        User.findByUsername(username, async (err, user) => {
            if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: "Credenciales inválidas" });

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );

            res.json({ token, role: user.role, userId: user.id, username: user.username });
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
};

/**
 * Nota para el programador (esto no es para el niño, jeje):
 *
 * bcryptjs: Es una librería que usamos para transformar las contraseñas en códigos secretos
 * (hashear) antes de guardarlas. Así, si alguien roba nuestra base de datos,
 * no podrá ver las contraseñas reales. También la usamos para verificar
 * si una contraseña escrita es la correcta sin tener que "deshacer" el código secreto.
 *
 * jsonwebtoken (jwt): Es una librería para crear y leer "pasaportes digitales" (JWTs).
 * Estos pasaportes nos ayudan a saber que un usuario ha iniciado sesión
 * y puede hacer cosas en nuestra aplicación sin tener que pedirle la
 * contraseña una y otra vez. Son seguros porque llevan un "sello secreto"
 * que solo el servidor puede verificar.
 */