// El modelo 'Event' nos permitirá interactuar con la tabla 'events' de la base de datos.
const Event = require("../models/Event");
// El modelo 'Artist' lo usaremos para la lógica de creación y permisos de eventos.
const Artist = require("../models/Artist");

const Entry_Mode = require("../models/Entry_Mode")

// --- FUNCIÓN PARA CREAR UN NUEVO EVENTO ---
exports.createEvent = async (req, res) => {
  const eventData = req.body;
  const loggedInUser = req.user;// Obtiene el usuario autenticado desde la solicitud 

  try {

    if (!eventData.title || !eventData.date || !eventData.location || !eventData.entry_mode) {
      return res.status(400).json({ message: "Faltan campos obligatorios (título, fecha, lugar, modo de entrada)." });
    }

    // Lógica para crear el evento según el rol del usuario.
    if (loggedInUser.role !== 'artist') {

      return res.status(403).json({ message: "No tienes permisos para crear eventos." });


    }

    // Si es un artista, busca su perfil para obtener el artist_id.
    const artistProfile = await Artist.findByUserId(loggedInUser.id);

    if (!artistProfile) return res.status(403).json({ message: "No tienes un perfil de artista para crear eventos." });

    const entry_mode = await Entry_Mode.findByName(eventData.entry_mode);
    if (!entry_mode) {
      return res.status(400).json({ message: "Modo de entrada no válido." });
    }

    const existingEvent = {
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      price: eventData.price,
      flyer_url: eventData.flyer_url,
      artist_id: artistProfile.id,        
      entry_mode_id: entry_mode.id
    }
    await Event.create(existingEvent);

    res.status(201).json({ message: "Evento creado con éxito" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor al crear el evento." });
  }


};

// --- FUNCIÓN PARA OBTENER TODOS LOS EVENTOS ---
// Para la cartelera general de eventos.
exports.getAllEvents = async (req, res) => {
  try {

    const events = await Event.findAll();
    if (!events || events.length === 0) return res.status(404).json({ message: "No se encontraron eventos." });

    res.status(200).json(events);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor al obtener los eventos." });

  }

};

// --- FUNCIÓN PARA OBTENER UN EVENTO POR SU ID ---
exports.getEventById = async (req, res) => {

  const { id } = req.params;

  try {
    if(isNaN(id)) return res.status(400).json({message: "El id del evento debe ser un número."})
    
      const event = await Event.findById(id);

    if (!event) return res.status(404).json({ message: "Evento no encontrado." });

    res.status(200).json(event);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor al obtener el evento." });

  }

};

// --- FUNCIÓN PARA OBTENER TODOS LOS EVENTOS DE UN ARTISTA ESPECÍFICO ---
exports.getEventsByArtistId = async (req, res) => {

  try {

    const { artistId } = req.params;

    if(isNaN(artistId)) return res.status(400).json({message: "El id del artista debe ser un número."})


    // Obtiene todos los eventos para un artistId específico.
    const events = await Event.findAllByArtistId(artistId);

    if (!events || events.length === 0) return res.status(404).json({ message: "No se encontraron eventos para este artista." });

    res.status(200).json(events);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor al obtener los eventos." });

  }

};

// --- FUNCIÓN PARA ACTUALIZAR UN EVENTO ---
exports.updateEvent = async (req, res) => {

  try {

    const { id } = req.params;
    const dataToUpdate = req.body;
    const loggedInUser = req.user;

    if(isNaN(id)) return res.status(400).json({message: "El id del evento debe ser un número."})

    // Primero, buscar el evento para verificar existencia y permisos.
    const eventExists = await Event.findById(id);

    if (!eventExists) return res.status(404).json({ message: "Evento no encontrado." });


    if (loggedInUser.role === 'admin') {

      const updateEvent = await Event.update(id, dataToUpdate);
      return res.status(200).json(updateEvent);

    } else if (loggedInUser.role === 'artist') {
      const artist = await Artist.findByUserId(loggedInUser.id);

      if (!artist) return res.status(403).json({ message: "No tienes un perfil de artista para actualizar eventos." });

      if (eventExists.artist_id !== artist.id) {
        return res.status(403).json({ message: "No tienes permisos para actualizar este evento." });
      }
      const updateEvent = await Event.update(id, dataToUpdate);
      return res.status(200).json(updateEvent);

    } else {
      return res.status(403).json({ message: "No tienes permisos para actualizar eventos." });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar el evento." });
  }




};

// --- FUNCIÓN PARA ELIMINAR UN EVENTO ---
exports.deleteEvent = async (req, res) => {
  
      const { id } = req.params;
      const loggedInUser = req.user;

  try {

    if(isNaN(id)) return res.status(400).json({message: "El id del evento debe ser un número."})


    // Buscar el evento para verificar existencia y permisos.
    const event = await Event.findById(id)

    if (!event) return res.status(404).json({ message: "Evento no encontrado." });

    if (loggedInUser.role === "artist") {

      const artist = await Artist.findByUserId(loggedInUser.id);

      if (!artist) return res.status(403).json({ message: "No tienes un perfil de artista para eliminar eventos." });

      if (event.artist_id !== artist.id) return res.status(403).json({ message: "No tienes permisos para eliminar este evento." });

      await Event.delete(id);

      return res.status(200).json({ message: "Evento eliminado con éxito." });
    } else if (loggedInUser.role === "admin") {

      await Event.delete(id);

      return res.status(200).json({ message: "Evento eliminado con éxito." });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor al eliminar el evento." });
  }


};