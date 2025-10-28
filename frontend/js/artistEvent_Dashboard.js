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
        alert("No tiene permiso para este panel ,Redirigiendo...")
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
                    // El cuerpo (body) que te estoy enviando ahora es un formato texto, es decir que estoy enviando un string, si es que envio un BODY, aca no lo hago
                    "Content-Type": "application/json",
                    // El token lo estoy enviando en el header
                    "Authorization": `Bearer ${token}`
                }


            })

            // accede al cuerpo llamado en ingles body y lo transforma en json en otras palabras lo convierte en un OBJETO
            const data = await response.json()

            if (!response.ok)
                throw new Error("Fallo en la peticion");
            console.log(data)

            displayEvents(data)


        } catch (error) {
            console.error(error)
        }
    }

    function displayEvents(data) {
        eventTableBody.innerHTML = "";

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

            titleCell.textContent = eventObject.title;
            dateCell.textContent = new Date(eventObject.date).toLocaleDateString();
            timeCell.textContent = eventObject.time;
            locationCell.textContent = eventObject.location;
            priceCell.textContent = `$ ${Number(eventObject.price)}`;
            flyerCell.textContent = eventObject.flyer;
            artistCell.textContent = eventObject.name;
            entry_modeCell.textContent = eventObject.entry_mode;

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

        alert("Usted ah Cerrado Sesión, Redirigiendo...")
        window.location.href = "index.html"

    })


    getEvents()

})