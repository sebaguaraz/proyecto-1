const bcrypt = require("bcryptjs");   // Esto es como un "candado súper seguro" para guardar contraseñas.
const jwt = require("jsonwebtoken");  // Esto es como un "pasaporte especial" que te permite pasar.
const User = require("../models/User"); // Traemos las "reglas" de cómo son nuestros usuarios.
const Artist = require("../models/Artist") // Traemos las "reglas" de cómo son nuestros artistas.
const Role = require("../models/Role"); // <-- Corrección aquí

// --- RECETA 1: Para cuando alguien quiere REGISTRARSE (crear una cuenta nueva) ---
// 'req' es como el papelito con lo que la persona quiere registrar (usuario, contraseña).
// 'res' es como la respuesta que le damos a la persona (¡cuenta creada! o "ese usuario ya existe").
// Registro de usuario
exports.register = (req, res) => {
    const { username, password } = req.body; // Datos que vienen del formulario
    const nombreRol = "artist"; // El rol que queremos asignar por defecto

    
    const nombresProhibidos = ["Eminem", "Dua Lipa", "Catriel", "Paco Amoroso"];
    if (nombresProhibidos.includes(username)) {
        return res.status(403).json({ error: "Nombre de artista prohibido. Elige otro nombre." });
    }

    // 1. Verificar si el nombre de usuario ya existe
    User.findByUsername(username, (errorUsuario, usuarioExistente) => {
        if (errorUsuario) {
            return res.status(500).json({ error: "Error al buscar el usuario en la base de datos" });
        }

        if (usuarioExistente) {
            return res.status(400).json({ error: "Ese nombre de usuario ya está en uso" });
        }

        // 2. Buscar el rol 'artist' en la base de datos
        Role.findByName(nombreRol, (errorRol, rolEncontrado) => {
            if (errorRol) {
                return res.status(500).json({ error: "Error al buscar el rol en la base de datos" });
            }

            if (!rolEncontrado) {
                return res.status(500).json({ error: "El rol 'artist' no existe en la base de datos" });
            }

            const idRol = rolEncontrado.id;

            // 3. Crear el usuario con el rol obtenido
            User.create(username, password, idRol, (errorCreacionUsuario, resultadoUsuario) => {
                if (errorCreacionUsuario) {
                    return res.status(500).json({ error: "Error al crear el usuario" });
                }

                const idNuevoUsuario = resultadoUsuario.insertId;

                // 4. Crear el perfil de artista asociado al usuario
                Artist.create(idNuevoUsuario, username, (errorArtista) => {
                    if (errorArtista) {
                        return res.status(500).json({
                            error: "El usuario fue creado, pero hubo un error al crear su perfil de artista",
                        });
                    }

                    // ✅ Todo salió bien
                    return res.status(201).json({
                        message: "Registro exitoso: usuario y perfil de artista creados correctamente",
                    });
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
    const { username, password } = req.body;  // Sacamos username y password que envió el cliente en la petición

    try {
        User.findByUsername(username, async (err, user) => {  // Buscamos en la BD al usuario con ese username
            if (err) {
                // Si hubo error en la consulta, devolvemos error 500 (interno del servidor)
                console.error("Error al buscar usuario en login:", err);
                return res.status(500).json({ error: "Error interno del servidor." });
            }

            if (!user) {
                // Si no existe ese usuario, devolvemos error 400 (credenciales inválidas)
                return res.status(400).json({ error: "Credenciales inválidas" });
            }

            // Comparamos la contraseña enviada con la que está guardada (hash)
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                // Si no coinciden, devolvemos error 400
                return res.status(400).json({ error: "Credenciales inválidas" });
            }

            // Si todo bien, generamos un token JWT para autenticar al usuario
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },  // Datos que metemos en el token
                process.env.JWT_SECRET,   // Clave secreta para firmar el token
                { expiresIn: "1h" }     // Tiempo de expiración (2 minutos en este caso)
            );

            // Enviamos la respuesta con el token y datos básicos del usuario
            res.json({ token, role: user.role, userId: user.id, username: user.username });
        });
    } catch (error) {
        // Si algo falla fuera del callback, enviamos error 500
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