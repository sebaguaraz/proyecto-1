const bcrypt = require("bcryptjs");   // Esto es como un "candado súper seguro" para guardar contraseñas.
const jwt = require("jsonwebtoken");  // Esto es como un "pasaporte especial" que te permite pasar.
const User = require("../models/User"); // Traemos las "reglas" de cómo son nuestros usuarios.
const Artist = require("../models/Artist") // Traemos las "reglas" de cómo son nuestros artistas.

// --- RECETA 1: Para cuando alguien quiere REGISTRARSE (crear una cuenta nueva) ---
// 'req' es como el papelito con lo que la persona quiere registrar (usuario, contraseña).
// 'res' es como la respuesta que le damos a la persona (¡cuenta creada! o "ese usuario ya existe").
exports.register = async (req, res) => {
    // Sacamos del papelito el nombre de usuario y la contraseña que la persona escribió.
    const { username, password } = req.body;
    // Por ahora, todos los que se registran son "artistas".
    const role = "artist";

    // Paso 1: Preguntamos a nuestra lista de usuarios: "¿Ya existe alguien con este nombre de usuario?"
    User.findByUsername(username, async (err, existingUser) => {
        // Si encontramos a alguien con ese nombre...
        if (existingUser) {
            // ...le decimos: "¡Ojo! Ese nombre ya está tomado."
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        // Paso 2: Si el nombre está libre, creamos el usuario en nuestra lista general de usuarios.
        // Usamos nuestro "candado súper seguro" para guardar la contraseña de forma secreta.
        User.create(username, password, role, (err, result) => {
            // Si algo sale mal al crear el usuario...
            if (err) {
                console.error("Error al registrar usuario:", err); // Le decimos al programador qué pasó.
                return res.status(500).json({ error: "Error al registrar el usuario." }); // Le decimos al usuario que hubo un problema.
            }

            // Conseguimos el número de identificación (ID) del usuario que acabamos de crear.
            const newUserId = result.insertId;

            // Paso 3: ¡ESPECIAL PARA ARTISTAS! Si el nuevo usuario es un artista...
            if (role === "artist") {
                // ...creamos también una "ficha de artista vacía" para él en la sección de artistas.
                Artist.create(newUserId, (artistErr, artistResult) => {
                    // Si algo sale mal al crear la ficha de artista...
                    if (artistErr) {
                        console.error("Error al crear perfil de artista:", artistErr); // Le decimos al programador.
                        return res.status(500).json({ error: "Usuario registrado, pero hubo un error al crear su perfil de artista." }); // Le avisamos al usuario.
                    }
                    // ¡Si todo sale bien! Le decimos al usuario: "¡Felicidades! Tu cuenta de artista y tu ficha ya están listas."
                    res.status(201).json({ message: "Artista registrado exitosamente y perfil creado." });
                });
            } else {
                // Si en el futuro tuviéramos otros tipos de usuarios (no artistas), les diríamos:
                res.status(201).json({ message: "Usuario registrado exitosamente" });
            }
        });
    });
};

// --- RECETA 2: Para cuando alguien quiere INICIAR SESIÓN (entrar a su cuenta) ---
// 'req' es el papelito con el usuario y contraseña para entrar.
// 'res' es la respuesta: "¡Bienvenido!" o "Contraseña incorrecta".
exports.login = async (req, res) => {
    // Sacamos el nombre de usuario y la contraseña del papelito.
    const { username, password } = req.body;

    try {
        // Buscamos al usuario en nuestra lista general.
        User.findByUsername(username, async (err, user) => {
            // Si no encontramos al usuario...
            if (!user) return res.status(400).json({ error: "Credenciales inválidas" }); // Le decimos: "Usuario o contraseña incorrectos".

            // Comparamos la contraseña que escribió con la contraseña secreta que tenemos guardada (con el "candado súper seguro").
            const isMatch = await bcrypt.compare(password, user.password);
            // Si las contraseñas no coinciden...
            if (!isMatch) return res.status(400).json({ error: "Credenciales inválidas" }); // Le decimos: "Usuario o contraseña incorrectos".

            // Si el usuario y contraseña son correctos, le damos su "pasaporte especial" (el token JWT).
            // Este pasaporte tiene información sobre él (su ID, su nombre, y que es un artista).
            // También le ponemos una fecha de vencimiento (2 horas).
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role }, // Esto es lo que lleva el pasaporte por dentro.
                process.env.JWT_SECRET, // Es como el sello secreto que solo nuestro servidor conoce.
                { expiresIn: "2h" } // El pasaporte vale por 2 horas.
            );

            // Le damos al usuario el pasaporte, y también le decimos su rol, su ID y su nombre.
            // Esto es para que la página sepa quién es y a dónde mandarlo sin tener que "leer" el pasaporte completo.
            res.json({ token, role: user.role, userId: user.id, username: user.username }); // ¡Esto es lo que enviamos al frontend!
        });
    } catch (error) { // Si algo muy grave pasa en nuestro servidor (ej. se rompe algo)...
        res.status(500).json({ error: "Error en el servidor" }); // Le decimos al usuario que hay un problema en nuestro lado.
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