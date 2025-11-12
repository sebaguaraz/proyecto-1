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
        eventTableBody.innerHTML = "";

        if (data.length === 0) {
            const MessageRow = document.createElement("tr")
            const messageCell = document.createElement("td")
            messageCell.textContent = "No hay eventos registrados"
            MessageRow.appendChild(messageCell)
            eventTableBody.appendChild(MessageRow)
            return;
        }

        data.forEach(eventObject => {
            const row = document.createElement("tr");
            const titleCell = document.createElement("td");
            const artistCell = document.createElement("td");
            const entry_modeCell = document.createElement("td");
            const dateCell = document.createElement("td");
            const timeCell = document.createElement("td");
            const locationCell = document.createElement("td");
            const priceCell = document.createElement("td");
            const flyerCell = document.createElement("td");

            titleCell.textContent = eventObject.title || "N/A";
            dateCell.textContent = eventObject.date ? new Date(eventObject.date).toLocaleDateString() : "N/A";
            timeCell.textContent = eventObject.time || "N/A";
            locationCell.textContent = eventObject.location || "N/A";
            priceCell.textContent = eventObject.price ? `$ ${Number(eventObject.price)}` : "N/A";
            flyerCell.textContent = eventObject.flyer_url || "N/A";
            artistCell.textContent = eventObject.name || "N/A";
            entry_modeCell.textContent = eventObject.entry_mode || "N/A";

            row.appendChild(titleCell);
            row.appendChild(artistCell);
            row.appendChild(entry_modeCell);
            row.appendChild(dateCell);
            row.appendChild(timeCell);
            row.appendChild(locationCell);
            row.appendChild(priceCell);
            row.appendChild(flyerCell);
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