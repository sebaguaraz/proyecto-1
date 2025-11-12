const ArtistService = require("../services/artistService");

// 1. Obtener perfil de artista
exports.getArtistProfile = async (req, res) => {
  const userId = parseInt(req.params.id);
  const requester = { requesterId: req.user.id, requesterRole: req.user.role, requesterName: req.user.username };

  try {
    const profile = await ArtistService.getArtistProfile(userId, requester);
    return res.status(200).json(profile);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : "Error interno del servidor.";
    return res.status(status).json({ message });
  }
};

// 2. Actualizar perfil de artista
exports.updateArtistProfile = async (req, res) => {
  const userId = parseInt(req.params.id);
  const requester = { requesterId: req.user.id, requesterName: req.user.username };
  const data = req.body;

  try {
    const result = await ArtistService.updateArtistProfile(userId, requester, data);
    return res.status(200).json(result);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : "Error interno del servidor al actualizar el perfil.";
    return res.status(status).json({ message });
  }
};

// 3. Obtener todos los perfiles (solo admin)
exports.findAll = async (req, res) => {
  const requester = { requesterId: req.user.id, requesterRole: req.user.role, requesterName: req.user.username };
  try {
    const profiles = await ArtistService.findAll(requester);
    return res.status(200).json(profiles);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : "Error interno del servidor al obtener los perfiles.";
    return res.status(status).json({ message });
  }
};