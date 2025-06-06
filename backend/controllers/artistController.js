// backend/controllers/artistController.js

// Importamos el modelo 'Artist'. Este modelo es como el "puente" que nos permite
// interactuar (leer, guardar, actualizar) con la tabla 'artists' en la base de datos.
const Artist = require("../models/Artist");

// --- FUNCIONES (Métodos) DEL CONTROLADOR ---

// 1. Función para OBTENER (leer) el perfil de un artista específico.
// Esta función se activará cuando una petición GET llegue a la ruta correspondiente.
// 'req' es el objeto de la petición (lo que el cliente envía).
// 'res' es el objeto de la respuesta (lo que nosotros enviaremos al cliente).
exports.getArtistProfile = (req, res) => {
    // req.params.id: Captura el valor del ID que viene en la URL.
    // Por ejemplo, si la URL es /api/artists/profile/123, 'userId' será "123".
    // Esto representa el ID del USUARIO cuyo perfil de artista se solicita.
    const userId = req.params.id;

    // req.user: Esta información fue añadida por nuestro middleware 'protect' (authMiddleware.js).
    // Contiene los datos (id, username, role) del USUARIO que está LOGUEADO y haciendo la petición.
    const requesterId = req.user.id;      // El ID del usuario autenticado.
    const requesterRole = req.user.role;  // El rol (ej. 'admin', 'artist') del usuario autenticado.

    // --- Lógica de AUTORIZACIÓN (Seguridad) ---
    // Esta es una buena práctica para asegurar que solo usuarios autorizados accedan a la información.
    // Las reglas son:
    // 1. Un ARTISTA solo puede ver SU PROPIO perfil (userId debe ser igual a requesterId).
    // 2. Un ADMINISTRADOR puede ver CUALQUIER perfil de artista (no importa el userId, si el rol es 'admin').
    // 'parseInt(userId)' convierte el ID de la URL a un número, ya que 'req.params.id' es una cadena de texto.
    if (requesterRole !== "admin" && parseInt(userId) !== requesterId) {
        // Si las condiciones no se cumplen, significa que el usuario no tiene permiso.
        // Se envía un código de estado 403 (Forbidden - Prohibido) y un mensaje.
        return res.status(403).json({ message: "Acceso denegado. No tienes permiso para ver este perfil." });
    }

    // Si la verificación de seguridad pasa (el usuario tiene permiso):
    // Llamamos a la función 'findByUserId' del modelo 'Artist'.
    // Esta función va a la base de datos y busca el perfil de artista asociado a ese 'userId'.
    Artist.findByUserId(userId, (err, profile) => {
        // 'err' capturará cualquier error de la base de datos.
        if (err) {
            // Si hay un error, lo mostramos en la consola del servidor (para depuración).
            console.error("Error al obtener el perfil del artista:", err);
            // Y enviamos un error 500 (Internal Server Error) al cliente.
            return res.status(500).json({ message: "Error interno del servidor al obtener el perfil." });
        }
        // Si 'profile' es null o undefined, significa que no se encontró un perfil para ese ID.
        // Esto podría pasar si el registro del artista no creó el perfil correctamente, aunque ya lo manejamos.
        if (!profile) {
            // Se envía un código 404 (Not Found - No Encontrado) y un mensaje.
            return res.status(404).json({ message: "Perfil de artista no encontrado para este usuario." });
        }

        // Si todo está bien, se encontró el perfil:
        // Se envía un código 200 (OK) y los datos del perfil del artista en formato JSON.
        res.status(200).json(profile);
    });
};

// 2. Función para ACTUALIZAR el perfil de un artista específico.
exports.updateArtistProfile = (req, res) => {
    const userId = req.params.id;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;
    const data = req.body;

    if (requesterRole !== "admin" && parseInt(userId) !== requesterId) {
        return res.status(403).json({ message: "Acceso denegado. No tienes permiso para actualizar este perfil." });
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: "No se proporcionaron datos para actualizar el perfil." });
    }

    Artist.update(userId, data, (err, result) => {
        if (err) {
            console.error("Error al actualizar perfil de artista:", err);
            return res.status(500).json({ message: "Error interno del servidor al actualizar el perfil." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Perfil de artista no encontrado o no se realizaron cambios." });
        }

        // ***** CAMBIO AQUÍ PARA SIMPLIFICAR: SOLO devolvemos el mensaje *****
        res.status(200).json({ message: "Perfil de artista actualizado con éxito." });
        // ******************************************************************
    });
};

// 3. Función para OBTENER TODOS los perfiles de artistas.
// Esta función está diseñada principalmente para ser usada por un administrador
// para ver una lista de todos los artistas registrados.
// La ruta que use esta función DEBE estar protegida con el middleware 'authorize(["admin"])'
// para que solo los administradores puedan acceder.
exports.findAll = (req, res) => {
    // Llama a la función 'findAll' de nuestro modelo 'Artist'.
    // Esta función no necesita parámetros porque busca todos los registros.
    Artist.findAll((err, profiles) => {
        // 'err' capturará cualquier error de la base de datos.
        if (err) {
            console.error("Error al obtener todos los perfiles de artistas:", err);
            return res.status(500).json({ message: "Error interno del servidor al obtener los perfiles." });
        }
        // Si todo está bien, enviamos la lista completa de perfiles de artistas (un array de objetos).
        res.status(200).json(profiles);
    });
};