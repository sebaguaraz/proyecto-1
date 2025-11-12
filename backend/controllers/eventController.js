const EventService = require('../services/eventService');


// --- FUNCIÓN PARA CREAR UN NUEVO EVENTO ---
exports.createEvent = async (req, res) => {
  const eventData = req.body;
  const loggedInUser = req.user;// Obtiene el usuario autenticado desde la solicitud 

  try {

    const result = await EventService.createEvent(eventData, loggedInUser);
    return res.status(result.status).json(result.message);

  } catch (error) {
    const status = error && error.status ? error.status : 500;
    const message = error && error.message ? error.message : "Error interno del servidor al crear el evento.";
    return res.status(status).json({ message });
  }


};

// --- FUNCIÓN PARA OBTENER TODOS LOS EVENTOS ---
// Para la cartelera general de eventos.
exports.getAllEvents = async (req, res) => {
  try {

    const result = await EventService.getAllEvents();
    res.status(result.status).json(result.message);

  } catch (error) {

    console.error(error);
    const status = error && error.status ? error.status : 500;
    const message = error && error.message ? error.message : "Error interno del servidor al obtener los eventos.";
    return res.status(status).json({ message });

  }

};

// --- FUNCIÓN PARA OBTENER UN EVENTO POR SU ID ---
exports.getEventById = async (req, res) => {

  const { entrada } = req.params;

  try {

    const event = await EventService.getEventByEntryMode(entrada);
    return res.status(200).json(event);

  } catch (error) {

    console.error(error);
    const status = error && error.status ? error.status : 500;
    const message = error && error.message ? error.message : "Error interno del servidor al obtener el evento.";
    return res.status(status).json({ message });

  }

};

// --- FUNCIÓN PARA OBTENER TODOS LOS EVENTOS DE UN ARTISTA ESPECÍFICO ---
exports.getEventsByArtistName = async (req, res) => {

  try {

    const { artistName } = req.params;

    const events = await EventService.getEventsByArtistName(artistName);
    return res.status(events.status).json(events.message);

  } catch (error) {

    console.error(error);
    const status = error && error.status ? error.status : 500;
    const message = error && error.message ? error.message : "Error interno del servidor al obtener los eventos.";
    return res.status(status).json({ message });

  }

};

// --- FUNCIÓN PARA ACTUALIZAR UN EVENTO ---
exports.updateEvent = async (req, res) => {

  try {

    const { id } = req.params;
    const eventData = req.body;
    const loggedInUser = req.user;

    const result = await EventService.updateEvent(id, eventData, loggedInUser);
    return res.status(result.status).json(result.message);

  } catch (error) {
    console.error(error);
    const status = error && error.status ? error.status : 500;
    const message = error && error.message ? error.message : "Error interno del servidor al actualizar el evento.";
    return res.status(status).json({ message });
  }




};

// --- FUNCIÓN PARA ELIMINAR UN EVENTO ---
exports.deleteEvent = async (req, res) => {

  const { id } = req.params;
  const loggedInUser = req.user;

  try {

    const result = await EventService.deleteEvent(id, loggedInUser);
    return res.status(result.status).json(result.message);

  } catch (error) {
    console.error(error);
    const status = error && error.status ? error.status : 500;
    const message = error && error.message ? error.message : "Error interno del servidor al eliminar el evento.";
    return res.status(status).json({ message });
  }


};