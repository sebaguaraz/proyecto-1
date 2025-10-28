document.addEventListener("DOMContentLoaded", async function () {

    const createEvent = document.getElementById("createEvent")
    const entry_mode = document.getElementById("entry_mode")
    const form_entry_mode = document.getElementById("form-entry_mode")
    const form_search_artistName = document.getElementById("search-form")
    const eventTableBody = document.getElementById("eventTableBody")

    const statusMessage = document.getElementById("status-message");

    const displayEvent = (event) => {

        eventTableBody.textContent = ""

        if (!Array.isArray(event) || event.length === 0) {
            const MessageRow = document.createElement("tr")
            const messageCell = document.createElement("td")
            messageCell.textContent = "No hay evento registrado"
            MessageRow.appendChild(messageCell)
            eventTableBody.appendChild(MessageRow)
            return

        }

        event.forEach(ev => {
            const EventRow = document.createElement("tr");
            const titleCell = document.createElement("td");
            const artistCell = document.createElement("td");
            const Entry_ModeCell = document.createElement("td");
            const DateCell = document.createElement("td");
            const TimeCell = document.createElement("td");
            const LocationCell = document.createElement("td");
            const PriceCell = document.createElement("td");
            const FlyerCell = document.createElement("td");

            titleCell.textContent = ev.title;
            artistCell.textContent = ev.name;
            Entry_ModeCell.textContent = ev.entry_mode;
            DateCell.textContent = ev.date;
            TimeCell.textContent = ev.time;
            LocationCell.textContent = ev.location;
            PriceCell.textContent = ev.price || "N/A";
            FlyerCell.textContent = ev.flyer_url || "N/A";

            EventRow.appendChild(titleCell);
            EventRow.appendChild(artistCell);
            EventRow.appendChild(Entry_ModeCell);
            EventRow.appendChild(DateCell);
            EventRow.appendChild(TimeCell);
            EventRow.appendChild(LocationCell);
            EventRow.appendChild(PriceCell);
            EventRow.appendChild(FlyerCell);

            eventTableBody.appendChild(EventRow);
        });

    }

    // modificar para poder ingresar el nombre del artista para encontrar el evento
    form_search_artistName.addEventListener('submit', async (event) => {

        event.preventDefault()
        const artistName = event.target.name_event.value

        if (!artistName) {
            alert("ingrese un Nombre valido")
            return
        }

        console.log(artistName)

        try {
            const response = await fetch(`/api/events/eventByArtist/${artistName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const event = await response.json()

            if (!event.ok) {
                statusMessage.textContent = event.message;
                statusMessage.style.color = "red";
                return;
            }

            statusMessage.textContent = "";


            // renderizado
            displayEvent(event)

        } catch (error) {
            console.error(error);
        }

    })


    form_entry_mode.addEventListener("submit", async (event) => {


        event.preventDefault()

        const entrada = Number(event.target.entry_mode.value)

        console.log(entrada)

        try {

            const response = await fetch(`/api/events/${entrada}`)

            const data = await response.json()

            if (!data.ok) {
                statusMessage.textContent = data.message
                statusMessage.style.color = "red"
                return
            }

            statusMessage.textContent = ""

            displayEvent(data)


        } catch (error) {
            console.error("Fallo al obtener el evento por modo de entrada", error)
        }


    })





















})