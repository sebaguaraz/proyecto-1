const LogsRepository = require("../repositories/Logs");
const ArtistRepository = require("../repositories/Artist");

// El service se encarga de la lógica y devuelve datos o lanza errores con {status, message}
async function getArtistProfile(userId, requester) {
    const { requesterId, requesterRole, requesterName } = requester;

    if (requesterRole !== "admin" || userId !== requesterId) {
        throw { status: 403, message: "No tienes permiso para ver este perfil." };
    }

    const profile = await ArtistRepository.findByUserId(userId);
    if (!profile) {
        throw { status: 404, message: "Perfil no encontrado." };
    }

    await LogsRepository.create(requesterId, `${requesterName} Obtuvo el perfil de artista con ID ${userId}`);
    return profile;
}

async function updateArtistProfile(userId, requester, data) {
    const { requesterId, requesterName } = requester;

    if (userId !== requesterId) {
        throw { status: 403, message: "Acceso denegado. No tienes permiso para actualizar este perfil." };
    }

    if (Object.keys(data).length === 0) {
        throw { status: 400, message: "No se proporcionaron datos para actualizar el perfil." };
    }

    const result = await ArtistRepository.update(userId, data);
    if (!result) {
        throw { status: 404, message: "Perfil de artista no encontrado o no se realizaron cambios." };
    }

    await LogsRepository.create(requesterId, `${requesterName} Actualizó el perfil de artista con ID ${userId}`);
    return { message: "Perfil de artista actualizado con éxito." };
}

async function findAll(requester) {
    const {requesterId, requesterRole, requesterName} = requester;

    if (requesterRole !== "admin") {
        throw { status: 403, message: "Acceso denegado. Solo administradores pueden ver todos los perfiles." };
    }

    const profiles = await ArtistRepository.findAll();
    await LogsRepository.create(requesterId, `${requesterName} Obtuvo todos los perfiles de artistas`);
    return profiles;
}

module.exports = {
    getArtistProfile,
    updateArtistProfile,
    findAll,
};