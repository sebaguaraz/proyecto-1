document.addEventListener('DOMContentLoaded', () => {

    const logoutButton = document.getElementById('logoutButton');
    const showArtistsButton = document.getElementById('showArtistsButton');
    const message = document.getElementById('message');
    const logTableBody = document.getElementById('logTableBody');
    const showLogsButton = document.getElementById('showLogsButton');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const artistTableBody = document.getElementById('artistTableBody');
    const cancelEditButton = document.getElementById('cancel-btn');
    const updateFormUser = document.getElementById('updateFormUser');
    const showEventsButton = document.getElementById('showEventsButton');
    const eventTableBody = document.getElementById('EventTableBody');

    const editEventForm = document.getElementById("editEventForm");


    // Verificar autenticación y rol
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('userRole');
    const username = sessionStorage.getItem('username');
    const userId = sessionStorage.getItem('userId');

    if (!token || userRole !== 'admin') {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userId");
        message.classList.add("message-error");
        message.textContent = 'No tiene permiso para este panel ,Redirigiendo...';
        setTimeout(() => {
            window.location.href = "index.html"

        }, 4000)
    }


    usernameDisplay.textContent = username;
    usernameDisplay.style.fontSize = "30px";
    usernameDisplay.style.fontWeight = "bold";

    const loadArtists = async () => {

        try {
            const response = await fetch(`/api/users/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })

            const users = await response.json(); // accede al cuerpo llamado en ingles body y lo transforma en json en otras palabras lo convierte en un OBJETO

            if (!response.ok) {
                sessionStorage.removeItem("token")
                sessionStorage.removeItem("userRole")
                sessionStorage.removeItem("username")
                sessionStorage.removeItem("userId")
                message.classList.add("message-error");
                message.textContent = `${users.message}, Redirigiendo...`;
                setTimeout(() => {
                    window.location.href = "index.html"
                }, 4000)
                return;

            }

            displayArtists(users);


        } catch (error) {
            console.error("Error de conexion al mostrar los artistas", error)

        }



    }


    const displayArtists = (users) => {
        artistTableBody.textContent = "";
        if (users.length === 0) {
            const rowMessage = document.createElement("tr");
            const messageCell = document.createElement("td");
            messageCell.textContent = "No hay usuarios registrados";
            rowMessage.appendChild(messageCell);
            artistTableBody.appendChild(rowMessage);
        }

        users.forEach(user => {
            const row = document.createElement("tr");

            const id = document.createElement("td");
            id.textContent = user.id || "N/A";

            const username = document.createElement("td");
            username.textContent = user.username || "N/A";

            const role = document.createElement("td");
            role.textContent = user.role_id || "N/A";

            // Celda de acciones
            const actionsCell = document.createElement('td');

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = "delete-btn";
            deleteButton.value = user.id;
            actionsCell.appendChild(deleteButton);


            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.className = "edit-btn";
            editButton.value = user.id;
            actionsCell.appendChild(editButton);



            // Agregar celdas a la fila
            row.appendChild(id);
            row.appendChild(username);
            row.appendChild(role);
            row.appendChild(actionsCell);
            artistTableBody.appendChild(row);



            addActionListeners(editButton, deleteButton);
        })

    }

    function addActionListeners(editButton, deleteButton) {

        editButton.addEventListener("click", (event) => handleFormSubmit(event));
        deleteButton.addEventListener("click", (event) => deleteUser(event));
    }

    const handleFormSubmit = (event) => {

        id = event.target.value;
        updateFormUser.classList.remove('oculto');

        const userIdForm = document.getElementById('userIdForm');
        userIdForm.textContent = `ID Usuario:  # ${id}`;

        updateFormUser.addEventListener("submit", (event) => updateUserSubmit(event, id));
    }

    cancelEditButton.addEventListener("click", () => {
        updateFormUser.reset();
        updateFormUser.classList.add("oculto");

    });



    async function updateUserSubmit(event, id) {
        event.preventDefault();

        const formData = new FormData(updateFormUser);
        const formObject = Object.fromEntries(formData);

        try {
            const objetInit = {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formObject)
            }

            const response = await fetch(`/api/users/${id}`, objetInit)
            console.log(response)

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                sessionStorage.removeItem("token")
                sessionStorage.removeItem("userRole")
                sessionStorage.removeItem("username")
                sessionStorage.removeItem("userId")
                message.classList.add("message-error");
                message.textContent = 'Error al actualizar el usuario. Redirigiendo...';
                setTimeout(() => {
                    window.location.href = "index.html"
                }, 4000)
                throw new Error(response.message);
            }

            message.classList.add("message-success");
            message.textContent = "Usuario actualizado correctamente";

            loadArtists();


        } catch (error) {
            console.error("error en el servidor", error)
            message.classList.add('message-error');
            message.textContent = 'Error al actualizar el usuario';
        }

    }




    const deleteUser = async (event) => {
        const id = event.target.value;

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                sessionStorage.removeItem("token")
                sessionStorage.removeItem("userRole")
                sessionStorage.removeItem("username")
                sessionStorage.removeItem("userId")
                message.classList.add("message-error");
                message.textContent = 'Error al eliminar el artista. Redirigiendo...';
                setTimeout(() => {
                    window.location.href = "index.html"
                }, 4000)
                return;
            }
            message.classList.add('message-success');
            message.textContent = `El usuario ha sido eliminado correctamente`;

            await loadArtists();

        } catch (error) {
            console.error('Error al eliminar artista:', error);
            message.classList.add('message-error');
            message.textContent = 'Error al eliminar el artista';
        }
    }


    showArtistsButton.addEventListener("click", loadArtists)

    const loadRegisters = async () => {
        try {
            const res = await fetch(`/api/actions/allRegisters`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                }
            })

            const logs = await res.json();

            if (!res.ok) {
                sessionStorage.removeItem("token")
                sessionStorage.removeItem("userRole")
                sessionStorage.removeItem("username")
                sessionStorage.removeItem("userId")
                message.classList.add("message-error");
                message.textContent = 'Error al mostrar los artistas. Redirigiendo...';
                setTimeout(() => {
                    window.location.href = "index.html"
                }, 4000)
                throw new Error(logs.message);
            }

            displayLogs(logs);

        } catch (error) {
            console.error(error);
        }

    }

    const displayLogs = (logs) => {

        logTableBody.textContent = "";

        if (logs.length === 0) {
            const rowMessage = document.createElement("tr");
            const messageCell = document.createElement("td");
            messageCell.textContent = "No hay registros de acciones";
            rowMessage.appendChild(messageCell);
            logTableBody.appendChild(rowMessage);

        }

        logs.forEach(log => {
            // row es la fila y td son las celdas
            const row = document.createElement("tr");
            const ID = document.createElement("td");
            const action = document.createElement("td");


            ID.textContent = log.user_id;
            action.textContent = log.action;

            row.appendChild(ID);
            row.appendChild(action);

            logTableBody.appendChild(row);
        })
    }

    showLogsButton.addEventListener("click", loadRegisters)


    showEventsButton.addEventListener("click", getAllEvents);

    async function getAllEvents() {
        try {
            const response = await fetch(`/api/events/allEvents`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })


            if (response.status === 204) {
                await showAllEvents([]);
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || "Error al obtener eventos";
                message.classList.add("message-error");
                message.textContent = errorMessage;
                return;
            }

            await showAllEvents(data);

        } catch (error) {
            console.error("Error en el servidor", error.message)
        }
    }

    async function showAllEvents(data) {
        eventTableBody.textContent = "";
        console.log(data);

        if (data.length === 0) {
            const rowMessage = document.createElement("tr");
            const messageCell = document.createElement("td");
            messageCell.textContent = "No hay eventos registrados";
            rowMessage.appendChild(messageCell);
            eventTableBody.appendChild(rowMessage);
            return;
        }

        data.forEach(event => {
            const row = document.createElement("tr");
            const id = document.createElement("td");
            const title = document.createElement("td");
            const artist_name = document.createElement("td");
            const entry_modes = document.createElement("td");
            const date = document.createElement("td");
            const time = document.createElement("td");
            const location = document.createElement("td");
            const price = document.createElement("td");
            // Celda de acciones
            const actionsCell = document.createElement('td');
            const actionDelete = document.createElement("td");
            const actionUpdate = document.createElement("td");

            id.textContent = `# ${event.id}` || "N/A";
            title.textContent = event.title || "N/A";
            artist_name.textContent = event.name || "N/A";
            entry_modes.textContent = event.entry_mode || "N/A";
            date.textContent = event.date || "N/A";
            time.textContent = event.time || "N/A";
            location.textContent = event.location || "N/A";
            price.textContent = event.price || "N/A";


            actionDelete.textContent = "Eliminar";
            actionDelete.className = "delete-btn";
            actionDelete.id = event.id;

            actionUpdate.textContent = "Actualizar";
            actionUpdate.className = "edit-btn";
            actionUpdate.id = event.id;


            row.appendChild(id);
            row.appendChild(title);
            row.appendChild(artist_name);
            row.appendChild(entry_modes);
            row.appendChild(date);
            row.appendChild(time);
            row.appendChild(location);
            row.appendChild(price);
            actionsCell.appendChild(actionDelete);
            actionsCell.appendChild(actionUpdate);
            row.appendChild(actionsCell);
            eventTableBody.appendChild(row);

            listenerButtonsEvents();
        })
    }

    function listenerButtonsEvents() {
        const buttonsDelete = document.querySelectorAll(".delete-btn");
        const buttonsEdit = document.querySelectorAll(".edit-btn");

        for (btnDelete of buttonsDelete) {
            btnDelete.addEventListener("click", (event) => deleteEvent(event));
        }

        for (btnEdit of buttonsEdit) {
            btnEdit.addEventListener("click", (event) => handlerSubmitEvent(event));
        }

    }



    async function deleteEvent(event) {

        id = event.target.id;
        try {
            const configObject = {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };

            const response = await fetch(`/api/events/${id}`, configObject);

            // Para DELETE exitoso, 204 significa "No Content" - éxito
            if (response.status === 204) {
                message.classList.add("message-success");
                message.textContent = `Se eliminó correctamente el evento con ID ${id}`;
                await getAllEvents();
                return;
            }

            // Si hay contenido, parsearlo
            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || "Error al eliminar evento";
                message.classList.add("message-error");
                message.textContent = errorMessage;
                return;
            }

            message.classList.add("message-success");
            message.textContent = `Se eliminó correctamente el evento con ID ${id}`;
            await getAllEvents();

        } catch (error) {
            console.log("error en el servidor", error.message);
            message.classList.add("message-error");
            message.textContent = "Error de conexión al eliminar evento";
        }

    }


    async function handlerSubmitEvent(event) {
        id = event.target.id;
        editEventForm.classList.remove("oculto");
        
        
        const eventIdForm = document.getElementById("eventIdForm");
        eventIdForm.textContent = `ID Evento # ${id}`;


        editEventForm.addEventListener("submit", (event) => updateEventSubmit(id, event));

    }



    async function updateEventSubmit(id, event) {
        event.preventDefault();

        // Ocultar el formulario inmediatamente al submit
        editEventForm.classList.add("oculto");

        const formdata = new FormData(editEventForm);
        const formObject = Object.fromEntries(formdata);

        const objetInit = {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObject)
        }

        try {
            const response = await fetch(`/api/events/${id}`, objetInit);
            
            // Para UPDATE exitoso, 204 significa "No Content" - éxito
            if (response.status === 204) {
                message.classList.add("message-success");
                message.textContent = `Evento no actualizado, sin cambios para el ID ${id}`;
                await getAllEvents();
                return;
            }

            const data = await response.json();
            
            if (!response.ok) {
                const errorMessage = data.message || "Error al actualizar evento";
                message.classList.add("message-error");
                message.textContent = errorMessage;
                return;
            }

            message.classList.add("message-success");
            message.textContent = `Evento actualizado correctamente`;
            await getAllEvents();

        } catch (error) {
            console.error("error al actualizar el evento:", error.message);
            message.classList.add("message-error");
            message.textContent = "Error de conexión al actualizar evento";
        }
    }




    // Agregar botón cancelar para formulario de eventos
    const cancelEventEditButton = document.getElementById('cancelEditButton');
    if (cancelEventEditButton) {
        cancelEventEditButton.addEventListener("click", () => {
            editEventForm.classList.add("oculto");
            editEventForm.reset();
        });
    }

    logoutButton.addEventListener("click", () => {

        sessionStorage.removeItem("token")
        sessionStorage.removeItem("userRole")
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("userId")
        message.classList.add("message-success");
        message.textContent = 'Saliendo del panel de moderación. Redirigiendo...';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 4000);

        return;

    })


})


// MODIFICAR EL PANEL DE ADMIN PARA PODER EDITAR AL USUARIO DEL SISTEMA Y DARLE PERMISO DE ADMIN/ARTISTA