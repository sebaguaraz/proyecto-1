const ActionService = require("../services/actionService");

exports.findAll = async (req, res) => {
    try {
        const actions = await ActionService.findAll();
        return res.status(200).json(actions);
    } catch (err) {
        return res.status(500).json({ message: "Error al obtener las acciones." });
    }
};