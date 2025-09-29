const bcrypt = require("bcryptjs");   // Esto es como un "candado súper seguro" para guardar contraseñas.
const jwt = require("jsonwebtoken");  // Esto es como un "pasaporte especial" que te permite pasar.
const User = require("../models/User"); // Traemos las "reglas" de cómo son nuestros usuarios.
const Artist = require("../models/Artist") // Traemos las "reglas" de cómo son nuestros artistas.
const Role = require("../models/Role"); // <-- Corrección aquí
const Logs = require("../models/Logs");


exports.register = async (req, res) => {
    const { username, password } = req.body; // Datos que vienen del formulario
    const nombreRol = "artist"; // El rol que queremos asignar por defecto

    const nombresProhibidos = ["Eminem", "Dua Lipa", "Catriel", "Paco Amoroso"];
    if (nombresProhibidos.includes(username)) {
        return res.status(403).json({ error: "Nombre de artista prohibido. Elige otro nombre." });
    }

    // TRY/CATCH: los errores de "lógica de negocio" (como que el usuario ya exista o que el rol no exista) los manejo directamente con `return res.status(...)` porque son errores esperados que queremos comunicar al cliente de manera específica.
    // El bloque `catch` atrapa errores inesperados, como errores de conexión a la base de datos, errores de sintaxis, etc.

    try {
        const usuarioExistente = await User.findByUsername(username);
        if (usuarioExistente) {
            return res.status(400).json({ error: "Ese nombre de usuario ya está en uso" });
        }

        const rolEncontrado = await Role.findByName(nombreRol); // = { id: 1 } luego para acceder al id: rolEncontrado.id
        if (!rolEncontrado) {
            return res.status(500).json({ error: "El rol 'artist' no existe en la base de datos" });
        }

        const resultadoUsuario = await User.create(username, password, rolEncontrado.id);

        await Logs.create(resultadoUsuario.insertId, `${username} se ha registrado correctamente`);

        await Artist.create(resultadoUsuario.insertId, username);

        return res.status(201).json({
            message: "Registro exitoso: usuario y perfil de artista creados correctamente",
        });

    } catch (error) {
        console.error("Error inesperado en registro:", error);
        return res.status(500).json({ error: "Error interno del servidor durante el registro" });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;  // Sacamos username y password que envió el cliente en la petición
    try {
        const usuarioExistente = await User.findByUsername(username);
        if (!usuarioExistente) {
            return res.status(400).json({ error: "Credenciales inválidas" });
        }

        const isMatch = await bcrypt.compare(password, usuarioExistente.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            {
                id: usuarioExistente.id,
                username: usuarioExistente.username,
                role: usuarioExistente.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        await Logs.create(usuarioExistente.id, `${usuarioExistente.username} ha iniciado sesión`);
        
        return res.json({ token, role: usuarioExistente.role, userId: usuarioExistente.id, username: usuarioExistente.username });

    } catch (error) {
        // Errores del sistema (base de datos, etc.)
        console.error("Error inesperado en login:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
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