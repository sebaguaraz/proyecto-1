const Artist = require("../models/Artist");
const User = require("../models/User");

// --- PASO 1: Lista de nombres que NO queremos ---
// Creamos una lista (un array) con los nombres de artistas que no están permitidos.
// Usamos minúsculas para que no importe si escriben "Eminem" o "eminem".
const FORBIDDEN_ARTIST_NAMES = [
  "eminem",
  "dua lipa",
  "catriel",
  "paco amoroso",
];

// --- PASO 2: Función ayudante para chequear el nombre ---
// Esta función nos dirá si un nombre está en la lista prohibida o no.
function isNameForbidden(name) {
  // Primero, vemos si nos dieron un nombre. Si no hay nombre, no está prohibido.
  if (!name) return false;
  // Quitamos espacios al inicio y al final (trim), lo ponemos todo en minúsculas (toLowerCase)
  // y vemos si la lista de nombres prohibidos (FORBIDDEN_ARTIST_NAMES) incluye este nombre.
  // Devuelve 'true' si está prohibido, 'false' si no lo está.
  return FORBIDDEN_ARTIST_NAMES.includes(name.trim().toLowerCase());
}

// --- Listar todos los artistas (Sin cambios aquí) ---
exports.getAllArtists = (req, res) => {
  Artist.findAll((err, artists) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener los artistas" });
    }
    res.status(200).json(artists);
  });
};


// --- Obtener un artista por su ID (Sin cambios aquí) ---
// ¡OJO! Esta función usa Artist.findById. Asegúrate de que tu modelo 'artist.js'
// tenga una función llamada 'findById' que busque un artista por su ID de artista.
// Si no la tiene, esta parte dará error.

exports.getArtistById = (req, res) => {
  const { id } = req.params; // Agarramos el ID que viene en la URL (ej: /api/artists/5)
  Artist.findById(id, (err, artist) => { // Buscamos al artista con ese ID
    if (err) return res.status(500).json({ message: "Error al buscar el artista" });
    if (!artist) return res.status(404).json({ message: "Artista no encontrado" }); // Si no lo encontramos, avisamos.
    res.status(200).json(artist); // Si lo encontramos, lo devolvemos.
  });
};


// --- Crear un nuevo artista ---

exports.createArtist = (req, res) => {
    const data = req.body;
    const loggedInUser = req.user; // Usuario que hace la petición

    // --- VALIDACIÓN DE NOMBRE PROHIBIDO (igual que antes) ---
    if (isNameForbidden(data.name)) {
        return res.status(400).json({ message: `El nombre de artista '${data.name}' no está permitido.` });
    }
    // --- FIN VALIDACIÓN ---

    let targetUserId; // ID del usuario al que se asociará el artista

    // --- Determinar para quién se crea el perfil ---
    if (loggedInUser.role === 'artist') {
        // Si es un artista, SÓLO puede crear un perfil para sí mismo.
        targetUserId = loggedInUser.id;
        // El user_id del body será ignorado al construir artistData si el rol es 'artist'
    } else if (loggedInUser.role === 'admin') {
        // Si es admin, DEBE especificar para qué usuario es (viene en data.user_id)
        if (!data.user_id) {
            return res.status(400).json({ message: "Admin debe especificar el user_id del artista." });
        }
        targetUserId = data.user_id;
    } else {
        // Rol desconocido o no permitido para crear
        return res.status(403).json({ message: "Rol no autorizado para crear artista." });
    }

    // --- Validaciones sobre el targetUserId ---
    // 1. Validar que el usuario (targetUserId) exista y tenga rol 'artist'
    User.findById(targetUserId, (err, user) => {
        if (err) return res.status(500).json({ message: "Error al buscar el usuario asociado" });
        if (!user) return res.status(404).json({ message: "Usuario asociado no encontrado" });
        if (user.role !== "artist") {
            return res.status(400).json({ message: "El usuario asociado no tiene el rol de artista" });
        }

        // 2. Validar que ese usuario (targetUserId) no tenga ya un artista asociado
        Artist.findByUserId(targetUserId, (err, existingArtist) => {
            if (err) return res.status(500).json({ message: "Error al verificar si el usuario ya tiene artista" });
            if (existingArtist) {
                return res.status(400).json({ message: "Este usuario ya tiene un perfil de artista asociado" });
            }

            // --- Si todo está bien, preparar datos y crear ---
            // Asegurarse que el user_id correcto esté en los datos a guardar
            const artistData = {
                ...data, // Copia todos los datos del body (name, photo, email, etc.)
                user_id: targetUserId // Establece el user_id correcto
            };

            Artist.create(artistData, (err, result) => {
                if (err) return res.status(500).json({ message: "Error al crear el artista" });
                res.status(201).json({ message: "Artista creado con éxito", id: result.insertId });
            });
        });
    });
};


// --- Actualizar un artista ---
exports.updateArtist = (req, res) => {
  // Agarramos el ID del artista que quieren cambiar, viene en la URL (ej: /api/artists/5)
  const { id } = req.params;
  // Agarramos los nuevos datos que nos mandaron en el cuerpo (body).
  const data = req.body;
  // Agarramos la información del usuario que está haciendo este pedido (viene del middleware 'protect').
  // Aquí sabemos su ID y su ROL (si es 'admin' o 'artist').
  const loggedInUser = req.user;

  // --- PASO 4: Validar el nombre OTRA VEZ (si lo están cambiando) ---
  // Chequeamos si nos mandaron un nuevo nombre ('data.name' existe).
  // Y SI nos mandaron un nombre, usamos 'isNameForbidden' para ver si es prohibido.
  if (data.name && isNameForbidden(data.name)) {
    // Si mandaron un nombre Y está prohibido...
    // Devolvemos un error 400 y un mensaje. ¡No seguimos!
    return res.status(400).json({ message: `El nombre de artista '${data.name}' no está permitido.` });
  }
  // --- FIN VALIDACIÓN DE NOMBRE ---

  // --- PASO 5: Verificar si el usuario TIENE PERMISO para cambiar este artista ---
  // Necesitamos saber a quién pertenece el artista que quieren cambiar.
  Artist.findById(id, (err, artist) => { // Buscamos al artista por su ID.
    // Si hay un error buscando en la base de datos...
    if (err) return res.status(500).json({ message: "Error al buscar el artista para actualizar" });
    // Si no encontramos un artista con ese ID...
    if (!artist) return res.status(404).json({ message: "Artista no encontrado" });

    // Ahora que tenemos al artista ('artist'), podemos ver quién es su dueño ('artist.user_id').
    // Y tenemos al usuario que está logueado ('loggedInUser').

    // Preguntamos: ¿El usuario logueado es un artista Y es el dueño de este perfil?
    // Comparamos el rol del logueado y su ID con el user_id guardado en el artista.
    const isOwner = loggedInUser.role === 'artist' && artist.user_id === loggedInUser.id;
    // Preguntamos: ¿El usuario logueado es un administrador?
    const isAdmin = loggedInUser.role === 'admin';

    // Si el usuario NO es el dueño Y TAMPOCO es administrador...
    if (!isOwner && !isAdmin) {
      // ...¡Entonces no tiene permiso! Devolvemos un error 403 (Forbidden).
      return res.status(403).json({ message: "No autorizado para actualizar este artista" });
    }

    // Ahora sí, le pedimos al modelo que actualice el artista con los datos nuevos.
    Artist.update(id, data, (err, result) => {
      if (err) return res.status(500).json({ message: "Error al actualizar el artista" });
      // 'result.affectedRows' nos dice cuántas filas se cambiaron. Si es 0, puede que el ID no existiera
      // o que los datos enviados fueran iguales a los que ya estaban.
      if (result.affectedRows === 0) {
          // Ya comprobamos que el artista existía antes, así que probablemente no hubo cambios.
          // O el artista no fue encontrado (aunque ya lo verificamos).
          // Para ser consistentes, si no afectó filas, podría ser un 404 implícito.
          return res.status(404).json({ message: "Artista no encontrado o sin cambios para actualizar." });
      }
      // Devolvemos un mensaje de éxito.
      res.status(200).json({ message: "Artista actualizado con éxito" });
    });
  });
};

// --- Eliminar un artista ---
exports.deleteArtist = (req, res) => {
  // Agarramos el ID del artista que quieren borrar, viene de la URL (ej: /api/artists/5).
  const { id } = req.params;
  // Agarramos la información del usuario logueado (quién está pidiendo borrar).
  const loggedInUser = req.user;

  // --- PASO 7: Verificar si tiene PERMISO para borrar (igual que en actualizar) ---
  // Necesitamos saber quién es el dueño del artista que quieren borrar.
  Artist.findById(id, (err, artist) => { // Buscamos al artista por su ID.
    // Si hay error buscando...
    if (err) return res.status(500).json({ message: "Error al buscar el artista para eliminar" });
    // MUY IMPORTANTE: Si NO encontramos al artista Y NO hubo error de base de datos...
    if (!artist && !err) {
        // ...devolvemos un 404 (Not Found) porque no existe ese artista para borrar.
        return res.status(404).json({ message: "Artista no encontrado" });
    }
    // Si hubo un error O sí encontramos al artista, seguimos...

    // Preguntamos: ¿El usuario logueado es artista Y es el dueño? (¡Cuidado! 'artist' podría ser null si hubo error antes)
    const isOwner = loggedInUser.role === 'artist' && artist && artist.user_id === loggedInUser.id;
    // Preguntamos: ¿El usuario logueado es admin?
    const isAdmin = loggedInUser.role === 'admin';

    // Si NO es el dueño Y TAMPOCO es admin...
    if (!isOwner && !isAdmin) {
      // ...¡No tiene permiso! Devolvemos error 403 (Forbidden).
      return res.status(403).json({ message: "No autorizado para eliminar este artista" });
    }

    // --- PASO 8: Si llegó aquí, ¡SÍ tiene permiso! Procedemos a eliminar ---
    Artist.delete(id, (err, result) => { 
      if (err) {
        return res.status(500).json({ message: "Error al eliminar el artista" });
      }
      // Si affectedRows es 0, el artista no se encontró (aunque ya lo verificamos).
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Artista no encontrado para eliminar." });
      }
      // Si todo salió bien, devolvemos mensaje de éxito.
      res.status(200).json({ message: "Artista eliminado con éxito" });
    });
  });
};
