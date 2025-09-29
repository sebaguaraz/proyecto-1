const User = require("../models/User");
const Logs = require("../models/Logs");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar el usuario" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (req.user.role === "artist" && req.user.id !== parseInt(id)) {
    return res.status(403).json({ message: "No tienes permiso para actualizar este usuario" });
  }

  try {
    const result = await User.update(id, data);
    if (!result) {
      return res.status(404).json({ message: "Usuario no encontrado para actualizar o sin cambios" });
    }
    res.status(200).json({ message: "Usuario actualizado con éxito" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const requesterId = req.user.id;
  const requesterName = req.user.username;

  try {
    const userExists = await User.findById(id);
    if (!userExists) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const result = await User.delete(id);
    if (!result) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await Logs.create(requesterId, `${requesterName} Elimino el usuario con ID ${id}`);
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};