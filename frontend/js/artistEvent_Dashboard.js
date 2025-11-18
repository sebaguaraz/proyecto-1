document.addEventListener("DOMContentLoaded", async () => {

    const logoutButton = document.getElementById("logoutButton")
    const artistName = document.getElementById("artistName")
    const eventTable = document.getElementById("eventTable")
    const eventTableBody = document.getElementById("eventTableBody")

    const token = sessionStorage.getItem("token")
    const role = sessionStorage.getItem("userRole")
    const userId = sessionStorage.getItem("userId")
    const username = sessionStorage.getItem("username")

    if (!token || role !== "artist") {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userId");
        alert("No tiene permiso para este panel. Redirigiendo...")
        window.location.href = "index.html"
        return
    }

    artistName.textContent = username
    artistName.style.fontSize = "20px"
    artistName.style.fontWeight = "bold"

    async function getEvents() {
        try {
            const response = await fetch(`/api/events/eventByArtist/${username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            // ✅ BIEN: Maneja respuesta 204 correctamente
            if (response.status === 204) {
                displayEvents([]);
                return;
            }

            const data = await response.json()

            if (!response.ok) {
                console.error("Error al obtener eventos:", data.message || "Fallo en la petición");
                return;
            }

            console.log(data)
            displayEvents(data)

        } catch (error) {
            console.error("Error de conexión:", error)
        }
    }

    function displayEvents(data) {
        eventTableBody.textContent = "";

        if (data.length === 0) {
            const MessageRow = document.createElement("div")
            const messageCell = document.createElement("span")
            messageCell.classList.add("no-records-row")
            messageCell.textContent = "No hay eventos registrados"
            MessageRow.appendChild(messageCell)
            eventTableBody.appendChild(MessageRow)
            return;
        }

        data.forEach(eventObject => {
            const row = document.createElement("div");
            row.classList.add("event-row");
            const titleCell = document.createElement("h3");
            const artistCell = document.createElement("span");
            const entry_modeCell = document.createElement("div");
            const dateCell = document.createElement("div");
            const timeCell = document.createElement("div");
            const locationCell = document.createElement("div");
            const priceCell = document.createElement("div");
            const flyerCell = document.createElement("div");
            flyerCell.classList.add("flyer-cell");
            const flyerImg = document.createElement("img");
            flyerImg.classList.add("flyer-img");

            titleCell.textContent = `Título: ${eventObject.title || "N/A"}`;
            dateCell.textContent = `Fecha: ${new Date(eventObject.date).toLocaleDateString() || "N/A"}`;
            timeCell.textContent = `Hora: ${eventObject.time || "N/A"}`;
            locationCell.textContent = `Ubicación: ${eventObject.location || "N/A"}`;
            priceCell.textContent = `Precio: $ ${Number(eventObject.price) || "N/A"}`;
            flyerImg.src = eventObject.flyer_url || "";
            artistCell.textContent = `Artista: ${eventObject.name || "N/A"}`;
            entry_modeCell.textContent = `Modo de entrada: ${eventObject.entry_mode || "N/A"}`;
            
            row.appendChild(flyerCell);
            flyerCell.appendChild(flyerImg);
            row.appendChild(titleCell);
            row.appendChild(artistCell);
            row.appendChild(priceCell);
            row.appendChild(entry_modeCell);
            row.appendChild(locationCell);
            row.appendChild(dateCell);
            row.appendChild(timeCell);
            eventTableBody.appendChild(row);
        });
    }

    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("userRole")
        sessionStorage.removeItem("userId")
        sessionStorage.removeItem("username")

        alert("Sesión cerrada correctamente. Redirigiendo...")
        window.location.href = "index.html"
    })

    getEvents()

})