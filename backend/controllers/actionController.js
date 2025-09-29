const Logs = require("../models/Logs");

exports.findAll = async (req, res) => {
    try {
        const actions = await Logs.findAll();
        res.status(200).json(actions);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener las acciones." });
    }
};