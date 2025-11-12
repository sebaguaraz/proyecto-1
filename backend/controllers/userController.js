const UserService = require("../services/userService");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserService.getUserById(id);
    res.status(user.status).json(user.data);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : "Error al buscar el usuario";
    res.status(status).json({ message });
  }
};

// Actualizar un usuario (protegido) POR EL ADMIN 
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const requesterId = req.user.id;
  const requesterName = req.user.username;

  try {

    const result = await UserService.updateUser(id, data, requesterId, requesterName);
    res.status(200).json(result);

  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : "Error al actualizar el usuario";
    res.status(status).json({ message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const requesterId = req.user.id;
  const requesterName = req.user.username;

  try {

    const result = await UserService.deleteUser(id, requesterId, requesterName);
    res.status(200).json(result);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : "Error al eliminar el usuario";
    res.status(status).json({ message });
  }
};