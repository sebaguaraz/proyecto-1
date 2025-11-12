const LogsRepository = require("../repositories/Logs");

// El service devuelve datos o lanza errores; no debe manejar la respuesta HTTP.
async function findAll() {
    // Dejar que el error suba al controller para mapear el status.
    const actions = await LogsRepository.findAll();
    return actions;

}
module.exports = { findAll };