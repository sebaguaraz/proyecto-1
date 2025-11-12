const UserRepository = require("../repositories/User");
const RoleRepository = require("../repositories/Role");
const ArtistRepository = require("../repositories/Artist");
const LogsRepository = require("../repositories/Logs");

exports.getAllUsers = async () => {

    const users = await UserRepository.findAll();
    return users;

};

exports.getUserById = async (id) => {

    const user = await UserRepository.findById(id);
    if (!user) {
        throw { status: 404, message: "Usuario no encontrado" };
    }
    return { status: 200, data: user };

};

// Actualizar un usuario (protegido) POR EL ADMIN 
exports.updateUser = async (id, data, requesterId, requesterName) => {


    const roleExists = await RoleRepository.findById(data.role_id);
    if (!roleExists) {
        throw { status: 400, message: "El rol especificado no existe" };
    }

    const result = await UserRepository.update(id, data);
    if (!result) {
        throw { status: 404, message: "Usuario no encontrado para actualizar o sin cambios" };
    }

    const existingArtist = await ArtistRepository.findByUserId(id);
    if (!existingArtist) {
        const user = await UserRepository.findById(id);

        await ArtistRepository.create(id, user.username);
        await LogsRepository.create(requesterId, `${requesterName} cambió el rol de ${user.username} a artista y creó su perfil`);
    }

    await LogsRepository.create(requesterId, `${requesterName} actualizó el usuario con ID ${id}`);
    return { message: "Usuario actualizado con éxito" };


};

exports.deleteUser = async (id, requesterId, requesterName) => {


    const userExists = await UserRepository.findById(id);
    if (!userExists) {
        throw { status: 404, message: "Usuario no encontrado" };
    }

    // ✅ CORREGIDO: Crear el log ANTES de eliminar el usuario
    // para evitar problemas con restricciones de clave foránea
    await LogsRepository.create(requesterId, `${requesterName} Eliminó el usuario ${userExists.username} (ID: ${id})`);

    // ✅ CORREGIDO: Verificar que no se esté eliminando a sí mismo
    if (parseInt(id) === parseInt(requesterId)) {
        throw { status: 400, message: "No puedes eliminar tu propio usuario" };
    }

    const result = await UserRepository.delete(id);
    if (!result) {
        throw { status: 404, message: "Usuario no encontrado" };
    }

    return { message: "Usuario eliminado con éxito" };
};