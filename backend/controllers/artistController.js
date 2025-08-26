// backend/controllers/artistController.js

const Artist = require("../models/Artist");

// 1. Obtener perfil de artista
exports.getArtistProfile = (req, res) => {
  const userId = parseInt(req.params.id);
  const { id: requesterId, role: requesterRole } = req.user;

  // Solo admin o el mismo usuario pueden ver el perfil
  if (requesterRole !== "admin" && userId !== requesterId) {
    return res.status(403).json({ message: "No tienes permiso para ver este perfil." });
  }

  // Buscamos el perfil con callback
  Artist.findByUserId(userId, (err, profile) => {
    if (err) {
      console.error("Error al obtener perfil:", err);
      return res.status(500).json({ message: "Error del servidor." });
    }
    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }
    return res.status(200).json(profile);
  });
};

// 2. Actualizar perfil de artista
exports.updateArtistProfile = (req, res) => {
  const userId = parseInt(req.params.id);
  const requesterId = req.user.id;
  const requesterRole = req.user.role;
  const data = req.body;

  if (userId !== requesterId) {
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
    return res.status(200).json({ message: "Perfil de artista actualizado con éxito." });
  });
};

// 3. Obtener todos los perfiles (solo admin)
exports.findAll = (req, res) => {
  Artist.findAll((err, profiles) => {
    if (err) {
      console.error("Error al obtener todos los perfiles de artistas:", err);
      return res.status(500).json({ message: "Error interno del servidor al obtener los perfiles." });
    }
    return res.status(200).json(profiles);
  });
};