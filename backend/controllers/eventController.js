// El modelo 'Event' nos permitirá interactuar con la tabla 'events' de la base de datos.
const Event = require("../models/Event");
// El modelo 'Artist' lo usaremos para la lógica de creación y permisos de eventos.
const Artist = require("../models/Artist");

// --- FUNCIÓN PARA CREAR UN NUEVO EVENTO ---
exports.createEvent = (req, res) => {
  const eventData = req.body;
  const loggedInUser = req.user;

  // Validaciones básicas de campos obligatorios.
  if (!eventData.title || !eventData.date || !eventData.location || !eventData.entry_mode) {
    return res.status(400).json({ message: "Faltan campos obligatorios (título, fecha, lugar, modo de entrada)." });
  }

  // Lógica para crear el evento según el rol del usuario.
  if (loggedInUser.role === 'artist') {
    // Si es un artista, busca su perfil para obtener el artist_id.
    Artist.findByUserId(loggedInUser.id, (err, artistProfile) => {
      if (err) return res.status(500).json({ message: "Error al buscar el perfil del artista." });
      if (!artistProfile) return res.status(403).json({ message: "No tienes un perfil de artista para crear eventos." });
      
      // Prepara los datos del evento con el artist_id del perfil.
      const fullEventData = { ...eventData, artist_id: artistProfile.id };
      
      Event.create(fullEventData, (err, result) => {
        if (err) {
          console.error("Error al crear evento:", err);
          return res.status(500).json({ message: "Error al crear el evento." });
        }
        res.status(201).json({ message: "Evento creado con éxito", id: result.id });
      });
    });
  } else if (loggedInUser.role === 'admin') {
    // Si es admin, debe enviar el 'artist_id' en el cuerpo de la petición.
    if (!eventData.artist_id) {
      return res.status(400).json({ message: "Como admin, debes especificar el 'artist_id' para el evento." });
    }
    // Prepara los datos del evento con el artist_id proporcionado por el admin.
    const fullEventData = { ...eventData, artist_id: eventData.artist_id };

    Event.create(fullEventData, (err, result) => {
      if (err) {
        console.error("Error al crear evento:", err);
        return res.status(500).json({ message: "Error al crear el evento." });
      }
      res.status(201).json({ message: "Evento creado con éxito", id: result.id });
    });
  } else {
    return res.status(403).json({ message: "No tienes permisos para crear eventos." });
  }
};

// --- FUNCIÓN PARA OBTENER TODOS LOS EVENTOS ---
// Para la cartelera general de eventos.
exports.getAllEvents = (req, res) => {
  Event.findAll((err, events) => {
    if (err) return res.status(500).json({ message: "Error al obtener los eventos." });
    res.status(200).json(events);
  });
};

// --- FUNCIÓN PARA OBTENER UN EVENTO POR SU ID ---
exports.getEventById = (req, res) => {
  const { id } = req.params;

  Event.findById(id, (err, event) => {
    if (err) return res.status(500).json({ message: "Error al buscar el evento." });
    if (!event) return res.status(404).json({ message: "Evento no encontrado." });
    res.status(200).json(event);
  });
};

// --- FUNCIÓN PARA OBTENER TODOS LOS EVENTOS DE UN ARTISTA ESPECÍFICO ---
exports.getEventsByArtistId = (req, res) => {
  const { artistId } = req.params;

  // Obtiene todos los eventos para un artistId específico.
  Event.findAllByArtistId(artistId, (err, events) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener los eventos del artista." });
    }
    res.status(200).json(events);
  });
};

// --- FUNCIÓN PARA ACTUALIZAR UN EVENTO ---
exports.updateEvent = (req, res) => {
  const { id: eventId } = req.params;
  const dataToUpdate = req.body;
  const loggedInUser = req.user;

  // Primero, buscar el evento para verificar existencia y permisos.
  Event.findById(eventId, (err, event) => {
    if (err) return res.status(500).json({ message: "Error al buscar el evento para actualizar." });
    if (!event) return res.status(404).json({ message: "Evento no encontrado." });

    // Lógica de actualización según el rol.
    if (loggedInUser.role === 'admin') {
      // Un admin puede actualizar cualquier evento.
      Event.update(eventId, dataToUpdate, (err, result) => {
        if (err) return res.status(500).json({ message: "Error al actualizar el evento." });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Evento no encontrado o sin cambios." });
        res.status(200).json({ message: "Evento actualizado con éxito por admin." });
      });
    } else if (loggedInUser.role === 'artist') {
      // Un artista solo puede actualizar sus propios eventos.
      Artist.findByUserId(loggedInUser.id, (err, artistProfile) => {
        if (err) return res.status(500).json({ message: "Error al buscar el perfil del artista." });
        if (!artistProfile || artistProfile.id !== event.artist_id) {
          return res.status(403).json({ message: "No tienes permisos para actualizar este evento." });
        }
        Event.update(eventId, dataToUpdate, (err, result) => {
          if (err) return res.status(500).json({ message: "Error al actualizar el evento." });
          if (result.affectedRows === 0) return res.status(404).json({ message: "Evento no encontrado o sin cambios." });
          res.status(200).json({ message: "Evento actualizado con éxito por artista." });
        });
      });
    } else {
      return res.status(403).json({ message: "No tienes permisos para actualizar eventos." });
    }
  });
};

// --- FUNCIÓN PARA ELIMINAR UN EVENTO ---
exports.deleteEvent = (req, res) => {
  const { id: eventId } = req.params;
  const loggedInUser = req.user;

  // Buscar el evento para verificar existencia y permisos.
  Event.findById(eventId, (err, event) => {
    if (err) return res.status(500).json({ message: "Error al buscar el evento para eliminar." });
    if (!event) return res.status(404).json({ message: "Evento no encontrado." });

    // Lógica de eliminación según el rol.
    if (loggedInUser.role === 'admin') {
      Event.delete(eventId, (err, result) => {
        if (err) return res.status(500).json({ message: "Error al eliminar el evento." });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Evento no encontrado para eliminar." });
        res.status(200).json({ message: "Evento eliminado con éxito por admin." });
      });
    } else if (loggedInUser.role === 'artist') {
      Artist.findByUserId(loggedInUser.id, (err, artistProfile) => {
        if (err) return res.status(500).json({ message: "Error al buscar el perfil del artista." });
        if (!artistProfile || artistProfile.id !== event.artist_id) {
          return res.status(403).json({ message: "No tienes permisos para eliminar este evento." });
        }
        Event.delete(eventId, (err, result) => {
          if (err) return res.status(500).json({ message: "Error al eliminar el evento." });
          if (result.affectedRows === 0) return res.status(404).json({ message: "Evento no encontrado para eliminar." });
          res.status(200).json({ message: "Evento eliminado con éxito por artista." });
        });
      });
    } else {
      return res.status(403).json({ message: "No tienes permisos para eliminar eventos." });
    }
  });
};