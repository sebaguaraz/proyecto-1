const Logs = require("../models/Logs");
const Artist = require("../models/Artist");

// 1. Obtener perfil de artista
exports.getArtistProfile = async (req, res) => {
  const userId = parseInt(req.params.id); // se obtiene el id de la ruta
  const requesterId = req.user.id;
  const requesterRole = req.user.role;
  const requesterName = req.user.username;

  if (requesterRole !== "admin" && userId !== requesterId) {
    await Logs.create(requesterId, `${requesterName} Intento ver el perfil de artista con ID ${userId}`);
    return res.status(403).json({ message: "No tienes permiso para ver este perfil." });
  }

  try {
    const profile = await Artist.findByUserId(userId);
    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    await Logs.create(requesterId, `${requesterName} Obtuvo el perfil de artista con ID ${userId}`);
    return res.status(200).json(profile);
  } catch (err) {
    console.error("Error al obtener perfil:", err);
    return res.status(500).json({ message: "Error del servidor." });
  }
};

// 2. Actualizar perfil de artista
exports.updateArtistProfile = async (req, res) => {
  const userId = parseInt(req.params.id);
  const requesterId = req.user.id;
  const requesterName = req.user.username;
  const data = req.body;

  if (userId !== requesterId) {
    await Logs.create(requesterId, `${requesterName} Intento actualizar el perfil de artista con ID ${userId}`);
    return res.status(403).json({ message: "Acceso denegado. No tienes permiso para actualizar este perfil." });
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No se proporcionaron datos para actualizar el perfil." });
  }

  try {
    const result = await Artist.update(userId, data);
    if (!result) {
      return res.status(404).json({ message: "Perfil de artista no encontrado o no se realizaron cambios." });
    }

    await Logs.create(requesterId, `${requesterName} Actualizo el perfil de artista con ID ${userId}`);
    return res.status(200).json({ message: "Perfil de artista actualizado con éxito." });
  } catch (err) {
    console.error("Error al actualizar perfil de artista:", err);
    return res.status(500).json({ message: "Error interno del servidor al actualizar el perfil." });
  }
};

// 3. Obtener todos los perfiles (solo admin)
exports.findAll = async (req, res) => {
  try {
    const profiles = await Artist.findAll();
    await Logs.create(req.user.id, `${req.user.username} Obtuvo todos los perfiles de artistas`);
    return res.status(200).json(profiles);
  } catch (err) {
    console.error("Error al obtener todos los perfiles de artistas:", err);
    return res.status(500).json({ message: "Error interno del servidor al obtener los perfiles." });
  }
};