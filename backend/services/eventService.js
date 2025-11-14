// El modelo 'Event' nos permitirá interactuar con la tabla 'events' de la base de datos.
const EventRepository = require("../repositories/Event");
// El modelo 'Artist' lo usaremos para la lógica de creación y permisos de eventos.
const ArtistRepository = require("../repositories/Artist");

const Entry_ModeRepository = require("../repositories/Entry_Mode");
const LogsRepository = require("../repositories/Logs");

// --- FUNCIÓN PARA CREAR UN NUEVO EVENTO ---
exports.createEvent = async (eventData, loggedInUser) => {

    if (!eventData.eventTitle || !eventData.eventDate || !eventData.location || !eventData.entryMode) {
        throw { status: 400, message: "Faltan campos obligatorios (título, fecha, lugar, modo de entrada)." };
    }

    // Lógica para crear el evento según el rol del usuario.
    if (loggedInUser.role !== 'artist') {
        throw { status: 403, message: "No tienes permisos para crear eventos." };

    }

    // Si es un artista, busca su perfil para obtener el artist_id.
    const artistProfile = await ArtistRepository.findByUserId(loggedInUser.id);

    if (!artistProfile) throw { status: 403, message: "No tienes un perfil de artista para crear eventos." };

    const entry_mode = await Entry_ModeRepository.findByName(eventData.entryMode);
    if (!entry_mode) {
        throw { status: 400, message: "Modo de entrada no válido." };
    }

    const existingEvent = {
        title: eventData.eventTitle,
        date: eventData.eventDate,
        time: eventData.eventTime,
        location: eventData.location,
        price: Number(eventData.price),
        flyer_url: eventData.flyerUrl,
        artist_id: artistProfile.id,
        entry_modes_id: entry_mode.id
    }
    console.log(existingEvent)
    await EventRepository.create(existingEvent);

    await LogsRepository.create(loggedInUser.id, `${loggedInUser.username} Creó un nuevo evento: ${eventData.eventTitle}`);

    return { message: "Evento creado con éxito" };




};

// --- FUNCIÓN PARA OBTENER TODOS LOS EVENTOS ---
// Para la cartelera general de eventos.
exports.getAllEvents = async () => {

    const events = await EventRepository.findAll();
    if (!events || events.length === 0) throw { status: 204, message: "No se encontraron eventos." };

    return { message: events };


};

// --- FUNCIÓN PARA OBTENER UN EVENTO POR SU ID ---
exports.getEventByEntryMode = async (entrada) => {

    if (!entrada || isNaN(entrada)) throw { status: 400, message: "Debe ingresar un id válido." }

    const event = await EventRepository.findByEntryMode(entrada);

    if (!event) throw { status: 404, message: "Evento no encontrado." };

    return event;

};

// --- FUNCIÓN PARA OBTENER TODOS LOS EVENTOS DE UN ARTISTA ESPECÍFICO ---
exports.getEventsByArtistName = async (artistName) => {


    if (!artistName) throw { status: 400, message: "El nombre del artista debe ser una cadena." }

    // Obtiene todos los eventos para un artistId específico.
    const events = await EventRepository.findAllByArtistName(artistName);

    if (!events || events.length === 0) throw { status: 204, message: [] };

    return { message: events };



};

// --- FUNCIÓN PARA ACTUALIZAR UN EVENTO ---
exports.updateEvent = async (id, eventData, loggedInUser) => {


    if (isNaN(id)) throw { status: 400, message: "El id del evento debe ser un número." }

    // Primero, buscar el evento para verificar existencia y permisos.
    const eventExists = await EventRepository.findById(id);

    if (!eventExists) throw { status: 204, message: "Evento no encontrado." };

    const entry_mode = await Entry_ModeRepository.findByName(eventData.entryMode);

    if (!entry_mode) {
        throw { status: 400, message: "Modo de entrada no válido." };
    }

    if (loggedInUser.role === 'admin') {

        const existingEvent = {
            title: eventData.eventTitle,
            date: eventData.eventDate,
            time: eventData.eventTime,
            location: eventData.location,
            price: Number(eventData.price),
            flyer_url: eventData.flyerUrl,
            artist_id: eventExists.artist_id,
            entry_modes_id: entry_mode.id
        }

        await LogsRepository.create(loggedInUser.id, `${loggedInUser.username} Actualizó el evento con id: ${id}`);

        const updateEvent = await EventRepository.update(id, existingEvent);

        return { message: updateEvent };

    } else if (loggedInUser.role === 'artist') {
        const artist = await ArtistRepository.findByUserId(loggedInUser.id);

        if (!artist) throw { status: 403, message: "No tienes un perfil de artista para actualizar eventos." };

        if (eventExists.artist_id !== artist.id) {
            throw { status: 403, message: "No tienes permisos para actualizar este evento." };
        }

        const existingEvent = {
            title: eventData.eventTitle,
            date: eventData.eventDate,
            time: eventData.eventTime,
            location: eventData.location,
            price: Number(eventData.price),
            flyer_url: eventData.flyerUrl,
            artist_id: artist.id,
            entry_modes_id: entry_mode.id
        }

        await LogsRepository.create(loggedInUser.id, `${loggedInUser.username} Actualizó el evento con id: ${id}`);


        const updateEvent = await EventRepository.update(id, existingEvent);

        return { message: updateEvent };

    } else {
        throw { status: 403, message: "No tienes permisos para actualizar eventos." };
    }



};

// --- FUNCIÓN PARA ELIMINAR UN EVENTO ---
exports.deleteEvent = async (id, loggedInUser) => {

    if (isNaN(id)) throw { status: 400, message: "El id del evento debe ser un número." }


    // Buscar el evento para verificar existencia y permisos.
    const event = await EventRepository.findById(id)

    if (!event) throw { status: 204, message: "Evento no encontrado." };

    // Log adicional para depuración: mostrar el objeto evento y sus propiedades

    if (loggedInUser.role === "artist") {

        const artist = await ArtistRepository.findByUserId(loggedInUser.id);

        if (!artist) throw { status: 403, message: "No tienes un perfil de artista para eliminar eventos." };


        if (Number(event.artist_id) !== Number(artist.id)) throw { status: 403, message: "No tienes permisos para eliminar este evento." };

        await EventRepository.delete(id);

        await LogsRepository.create(loggedInUser.id, `${loggedInUser.username} Eliminó el evento con id: ${id}`);

        return { message: "Evento eliminado con éxito." };

    } else if (loggedInUser.role === "admin") {

        await EventRepository.delete(id);

        await LogsRepository.create(loggedInUser.id, `${loggedInUser.username} Eliminó el evento con id: ${id}`);

        return { message: "Evento eliminado con éxito." };
    }




};