document.addEventListener("DOMContentLoaded", async () => {
    const logoutButton = document.getElementById("logoutButton");
    const artistName = document.getElementById("artistName");
    const eventTable = document.getElementById("eventTable");
    const eventTableBody = document.getElementById("eventTableBody");

    const Event_form = document.getElementById("editEventForm");


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

    artistName.textContent = username

    async function getEvents() {

        const ConfigObject = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,

            }
        }
        try {

            let response = await fetch(`/api/events/eventByArtist/${username}`, ConfigObject)

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



            button_delete.addEventListener("click", deleteEvent);
            button_edit.addEventListener("click", showFormEditEvent);
            


        })
    }

    function showFormEditEvent(event) {

        // 1. Obtenemos el ID del botón que fue clickeado
        let id = event.target.id;

        if (!id) {
            console.error("No event ID provided");
            return;
        }

        // 2. ¡EL PASO CLAVE! Guardamos el ID en el formulario
        // 'handleFormSubmit' podrá leer esto después
        Event_form.dataset.editingId = id;

        // 3. Mostramos el formulario
        Event_form.classList.remove("oculto"); // Usar 'remove' es más seguro que 'toggle'

        // ¡Ya no leemos FormData aquí!
        // Eso se hará en 'handleFormSubmit'
    }

    
    /**
     * Esta función se llama cuando se HACE SUBMIT en el formulario.
     * Su trabajo es recolectar los datos y llamar a 'updateEvent'.
     */
    async function handleFormSubmit(event) {

        // 1. ¡Evita que la página se recargue!
        event.preventDefault();

        // 2. Obtenemos los datos del formulario
        const form_data = new FormData(Event_form);
        const data = Object.fromEntries(form_data.entries());
        
        // 3. Recuperamos el ID que guardamos en el formulario
        const id = Event_form.dataset.editingId;

        if (!id) {
            console.error("Error: No se encontró ID en el formulario al intentar guardar.");
            return;
        }

        // 4. ¡Ahora sí! Llamamos a la función de actualización y esperamos su resultado
        const success = await updateEvent(id, data);
        
        // 5. Si la actualización fue exitosa, ocultamos el formulario
        if (success) {
            Event_form.classList.add("oculto");
            delete Event_form.dataset.editingId; // Limpiamos el ID para la próxima vez
        }
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
            return true; // Devolvemos true para indicar éxito

        } catch (error) {
            console.error("Error en el servidor", error);
            alert(error.message); // Mostramos un error más claro al usuario
            return false; // Devolvemos false para indicar fallo
        }
    }
    

    // 6. Este es el listener que une todo.
    // Escucha el evento 'submit' EN EL FORMULARIO y llama a 'handleFormSubmit'.
    Event_form.addEventListener("submit", handleFormSubmit);
    
    
    
    
    

    async function deleteEvent(event) {
        let id = event.target.id;

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

            if (!response.ok) {
                throw new Error("No tienes permisos para eliminar este evento.");
            }

            getEvents();
            Event_form.classList.add("oculto"); // Ocultamos el formulario

        } catch (error) {
            console.error("Error en el servidor", error);
        }
    }















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