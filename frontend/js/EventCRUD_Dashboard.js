document.addEventListener("DOMContentLoaded", async () => {
    const logoutButton = document.getElementById("logoutButton");
    const artistName = document.getElementById("artistName");
    const eventTable = document.getElementById("eventTable");
    const eventTableBody = document.getElementById("eventTableBody");

    const Event_form = document.getElementById("editEventForm");
    const eventIdForm = document.getElementById("eventIdForm");

    const cancelEditButton = document.getElementById("cancelEditButton");


    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("userRole");
    const userId = sessionStorage.getItem("userId");


    if (!token || role !== "artist") {

        sessionStorage.removeItem("token")
        sessionStorage.removeItem("userRole")
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("userId")

        alert("No tiene permiso para este panel ,Redirigiendo...")
        window.location.href = "index.html"
        return
    }

    artistName.textContent = username;

    async function getEvents() {

        const ConfigObject = {
            method: "GET"
            , headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
        try {

            let response = await fetch(`/api/events/eventByArtist/${username}`, ConfigObject)


            if (response.status === 204) {
                showEvents([]);
                return;
            }

            let data = await response.json();
            showEvents(data);


        } catch (error) {
            console.error("Error en el servidor", error)
        }




    }


    function showEvents(data) {
        eventTableBody.textContent = "";

        if (data.length === 0) {
            const MessageRow = document.createElement("div")
            const messageCell = document.createElement("span")
            messageCell.classList.add("no-records-row");
            messageCell.textContent = "No hay eventos registrados";
            MessageRow.appendChild(messageCell);
            eventTableBody.appendChild(MessageRow);
            // Asegurarse de que el formulario de edición esté oculto cuando no hay eventos
            return;

        }
        data.forEach(event => {

            let row = document.createElement("div");
            row.classList.add("event-row");
            let tittleRow = document.createElement("h3");
            let artistRow = document.createElement("span");
            let entry_modeRow = document.createElement("div");
            let dateRow = document.createElement("div");
            let timeRow = document.createElement("div");
            let locationRow = document.createElement("div");
            let priceRow = document.createElement("div");
            let flyerRow = document.createElement("div");
            flyerRow.classList.add("flyer-cell");
            const flyerImg = document.createElement("img");
            flyerImg.classList.add("flyer-img");

            let button_edit = document.createElement("button");
            let button_delete = document.createElement("button");




            tittleRow.textContent = `Título: ${event.title || "N/A"}`;
            artistRow.textContent = `Artista: ${event.name || "N/A"}`;
            entry_modeRow.textContent = `Modo de entrada: ${event.entry_mode || "N/A"}`;
            dateRow.textContent = `Fecha: ${new Date(event.date).toLocaleDateString() || "N/A"}`;
            timeRow.textContent = `Hora: ${event.time || "N/A"}`;
            locationRow.textContent = `Ubicación: ${event.location || "N/A"}`;
            priceRow.textContent = `Precio: $${Number(event.price) || "N/A"}`;
            flyerImg.src = `${event.flyer_url || "N/A"}`;

            button_edit.textContent = "Editar";
            button_edit.className = "action-button edit-btn";
            button_edit.id = event.id;
            button_delete.textContent = "Eliminar";
            button_delete.className = "action-button delete-btn";
            button_delete.id = event.id;

            row.appendChild(flyerRow);
            flyerRow.appendChild(flyerImg);
            row.appendChild(tittleRow);
            row.appendChild(artistRow);
            row.appendChild(priceRow);
            row.appendChild(entry_modeRow);
            row.appendChild(locationRow);
            row.appendChild(dateRow);
            row.appendChild(timeRow);

            row.appendChild(button_edit);
            row.appendChild(button_delete);
            eventTableBody.appendChild(row);



            button_delete.addEventListener("click", (event) => deleteEvent(event));
            button_edit.addEventListener("click", (event) => showFormEditEvent(event));

        })
    }

    function showFormEditEvent(event) {

        // 1. Obtenemos el ID del botón que fue clickeado
        let id = event.target.id;

        if (!id) {
            console.error("No event ID provided");
            return;
        }

        // 3. Mostramos el formulario explícitamente
        if (Event_form) {
            Event_form.classList.remove("oculto");
            eventIdForm.textContent = `ID Evento: # ${id}`;

            Event_form.addEventListener("submit", (e) => handleFormSubmit(e, id));
        }

    }


    /**
     * Esta función se llama cuando se HACE SUBMIT en el formulario.
     * Su trabajo es recolectar los datos y llamar a 'updateEvent'.
     */
    async function handleFormSubmit(event, id) {

        // 1. ¡Evita que la página se recargue!
        event.preventDefault();

        // 2. Obtenemos los datos del formulario
        const form_data = new FormData(Event_form);
        const data = Object.fromEntries(form_data.entries());


        // 4. ¡Ahora sí! Llamamos a la función de actualización y esperamos su resultado
        await updateEvent(id, data);

    }


    // 4. ¡Ahora sí! Esta es la función de actualización
    async function updateEvent(id, data) {
        try {
            const ConfigObject = {
                method: "PUT",
                headers: {
                    // ¡MUY IMPORTANTE! Debes decirle al servidor que envías JSON
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data) // 'data' es un objeto, lo convertimos a string JSON
            };

            const response = await fetch(`/api/events/${id}`, ConfigObject);

            if (!response.ok) {
                // Intentamos leer el error del servidor para más detalles
                const errorData = await response.json();
                throw new Error(errorData.message || "Ocurrió un error al editar el evento");
            }

            alert("Evento editado con éxito");
            getEvents(); // Actualizamos la tabla con los nuevos datos

        } catch (error) {
            console.error("Error en el servidor", error);
            alert(error.message); // Mostramos un error más claro al usuario
        }
    }


    async function deleteEvent(event) {
        const id = event.target.id;

        if (!id) {
            console.error("No event ID provided");
            return;
        }

        try {
            const response = await fetch(`/api/events/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            // ✅ CORREGIDO: Maneja respuesta 204 para DELETE exitoso
            if (response.status === 204) {
                alert("Evento eliminado con éxito");
                await getEvents();
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "No tienes permisos para eliminar este evento.");
            }

            const data = await response.json();
            alert("Evento eliminado con éxito");
            await getEvents();

        } catch (error) {
            console.error("Error en el servidor", error);
            alert(error.message);
        }
    }

    cancelEditButton.addEventListener("click", () => {
        Event_form.classList.toggle("oculto");
        Event_form.reset();

    })

    logoutButton.addEventListener("click", function () {

        sessionStorage.removeItem("token")
        sessionStorage.removeItem("userRole")
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("userId")
        alert("Usted ah Cerrado Sesión, Redirigiendo...")
        window.location.href = "index.html"

    })


    getEvents();

});