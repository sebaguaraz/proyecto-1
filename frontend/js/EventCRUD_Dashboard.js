document.addEventListener("DOMContentLoaded", async () => {
    const logoutButton = document.getElementById("logoutButton");
    const artistName = document.getElementById("artistName");
    const eventTable = document.getElementById("eventTable");
    const eventTableBody = document.getElementById("eventTableBody");

    const Event_form = document.getElementById("editEventForm");

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
            const MessageRow = document.createElement("tr")
            const messageCell = document.createElement("td")
            messageCell.textContent = "No hay eventos registrados"
            MessageRow.appendChild(messageCell)
            eventTableBody.appendChild(MessageRow)
            // Asegurarse de que el formulario de edición esté oculto cuando no hay eventos
            if (Event_form) Event_form.classList.add("oculto");
            return

        }
        data.forEach(event => {

            let tr = document.createElement("tr");
            let tittleRow = document.createElement("th");
            let artistRow = document.createElement("th");
            let entry_modeRow = document.createElement("th");
            let dateRow = document.createElement("th");
            let timeRow = document.createElement("th");
            let locationRow = document.createElement("th");
            let priceRow = document.createElement("th");
            let flyerRow = document.createElement("th");

            let button_editRow = document.createElement("th");
            let button_deleteRow = document.createElement("th");

            let button_edit = document.createElement("button");
            let button_delete = document.createElement("button");




            tittleRow.textContent = event.title;
            artistRow.textContent = event.name;
            entry_modeRow.textContent = event.entry_mode;
            dateRow.textContent = new Date(event.date).toLocaleDateString();
            timeRow.textContent = event.time;
            locationRow.textContent = event.location;
            priceRow.textContent = `$ ${Number(event.price)}`;
            flyerRow.textContent = event.flyer_url;

            button_edit.textContent = "Editar";
            button_edit.className = "action-button edit-btn";
            button_edit.id = event.id;
            button_delete.textContent = "Eliminar";
            button_delete.className = "action-button delete-btn";
            button_delete.id = event.id;

            tr.appendChild(tittleRow);
            tr.appendChild(artistRow);
            tr.appendChild(entry_modeRow);
            tr.appendChild(dateRow);
            tr.appendChild(timeRow);
            tr.appendChild(locationRow);
            tr.appendChild(priceRow);
            tr.appendChild(flyerRow);

            button_editRow.appendChild(button_edit);
            button_deleteRow.appendChild(button_delete);

            tr.appendChild(button_editRow);
            tr.appendChild(button_deleteRow);
            eventTableBody.appendChild(tr);



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
            // Reemplazamos el handler anterior para evitar listeners duplicados
            Event_form.onsubmit = (e) => handleFormSubmit(e, id);
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