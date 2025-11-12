const bcrypt = require("bcryptjs");   // Esto es como un "candado súper seguro" para guardar contraseñas.
const jwt = require("jsonwebtoken");  // Esto es como un "pasaporte especial" que te permite pasar.
const UserRepository = require("../repositories/User"); // Traemos las "reglas" de cómo son nuestros usuarios.
const ArtistRepository = require("../repositories/Artist") // Traemos las "reglas" de cómo son nuestros artistas.
const RoleRepository = require("../repositories/Role"); // <-- Corrección aquí
const LogsRepository = require("../repositories/Logs");


exports.register = async (username, password) => {
    const nombreRol = "artist"; // El rol que queremos asignar por defecto

    const nombresProhibidos = ["Eminem", "Dua Lipa", "Catriel", "Paco Amoroso"];
    if (nombresProhibidos.includes(username)) {
        throw { status: 403, message: "Nombre de artista prohibido. Elige otro nombre." };

    }

    const usuarioExistente = await UserRepository.findByUsername(username);
    if (usuarioExistente) {
        throw { status: 400, message: "Ese nombre de usuario ya está en uso" };
    }

    const rolEncontrado = await RoleRepository.findByName(nombreRol); // = { id: 1 } luego para acceder al id: rolEncontrado.id
    if (!rolEncontrado) {
        throw { status: 500, message: "El rol 'artist' no existe en la base de datos" };
    }

    const resultadoUsuario = await UserRepository.create(username, password, rolEncontrado.id);

    await LogsRepository.create(resultadoUsuario.insertId, `${username} se ha registrado al sistema`);

    await ArtistRepository.create(resultadoUsuario.insertId, username);

    return { status: 201, message: "Registro exitoso: usuario y perfil de artista creados correctamente" };
};


exports.login = async (username, password) => {

    const usuarioExistente = await UserRepository.findByUsername(username);
    if (!usuarioExistente) {
        throw { status: 400, message: "Credenciales inválidas" };
    }

    const isMatch = await bcrypt.compare(password, usuarioExistente.password);
    if (!isMatch) {
        throw { status: 400, message: "Credenciales inválidas" };
    }

    const token = jwt.sign(
        {
            id: usuarioExistente.id,
            username: usuarioExistente.username,
            role: usuarioExistente.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30min" }
    )

    return { token, role: usuarioExistente.role, userId: usuarioExistente.id, username: usuarioExistente.username };


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