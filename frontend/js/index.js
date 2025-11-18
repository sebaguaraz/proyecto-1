document.addEventListener("DOMContentLoaded", async function () {

    const createEvent = document.getElementById("createEvent")
    const entry_mode = document.getElementById("entry_mode")
    const form_entry_mode = document.getElementById("form-entry_mode")
    const form_search_artistName = document.getElementById("search-form")
    const eventTableBody = document.getElementById("eventTableBody")

    const statusMessage = document.getElementById("status-message");

    const displayEvent = (event) => {

        eventTableBody.textContent = ""

        if (event.length === 0) {
            const MessageRow = document.createElement("div")
            const messageCell = document.createElement("span")
            messageCell.textContent = "No hay evento registrado"
            messageCell.classList.add("total")
            MessageRow.appendChild(messageCell)
            eventTableBody.appendChild(MessageRow)
            return;

        }

        event.forEach(ev => {
            const EventRow = document.createElement("div");
            EventRow.classList.add("event-row");
            const FlyerCell = document.createElement("div");
            FlyerCell.classList.add("flyer-cell");
            const flyer_img = document.createElement("img");
            flyer_img.classList.add("flyer-img");

            const idCell = document.createElement("span");
            const titleCell = document.createElement("h3");
            const artistCell = document.createElement("span");
            
            const PriceCell = document.createElement("div");
            const Entry_ModeCell = document.createElement("div");

            const LocationCell = document.createElement("div");
            const DateCell = document.createElement("div");
            const TimeCell = document.createElement("div");

            flyer_img.src = ev.flyer_url || "";
            idCell.textContent = `ID: # ${ev.id || "N/A"}`;
            titleCell.textContent = `Título: ${ev.title}`;
            artistCell.textContent = `Artista: ${ev.name}`;
            PriceCell.textContent = `Precio: $ ${ev.price || "N/A"}`;
            Entry_ModeCell.textContent = `Modo de entrada: ${ev.entry_mode}`;
            LocationCell.textContent = `Ubicación: ${ev.location}`;
            DateCell.textContent = `Fecha: ${new Date(ev.date).toLocaleDateString()}`;
            TimeCell.textContent = `Hora: ${ev.time}` || "N/A";

            
            
            // artistCell.appendChild(artist_a);
            // EventRow.appendChild(artistCell);
            
            EventRow.appendChild(TimeCell);
            EventRow.appendChild(DateCell);
            EventRow.appendChild(LocationCell);
            EventRow.appendChild(Entry_ModeCell);
            EventRow.appendChild(PriceCell);
            EventRow.appendChild(artistCell);
            EventRow.appendChild(titleCell);
            EventRow.appendChild(idCell);
            FlyerCell.appendChild(flyer_img);
            EventRow.appendChild(FlyerCell);
            
            eventTableBody.appendChild(EventRow);
        });

    }

    // modificar para poder ingresar el nombre del artista para encontrar el evento
    form_search_artistName.addEventListener('submit', async (event) => {

        event.preventDefault()
        const artistName = event.target.name_event.value
        console.log(artistName)

        if (!artistName) {
            alert("ingrese un Nombre valido")
            return
        }


        try {
            const response = await fetch(`/api/events/eventByArtist/${artistName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.status === 204) {
                await displayEvent([])
                return;
            }

            const event = await response.json()

            if (!response.ok) {
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

            const response = await fetch(`/api/events/${entrada}`, {method: "GET"})

            if(response.status === 204){
                await displayEvent([])
                return;
            }
            const event = await response.json()
            
            if (!response.ok) {
                statusMessage.textContent = event.message
                statusMessage.style.color = "red"
                return
            }

            statusMessage.textContent = ""

            displayEvent(event)


        } catch (error) {
            console.error("Fallo al obtener el evento por modo de entrada", error)
        }


    })


    const showAllEvents = async () => {

        try {
            const response = await fetch(`/api/events/allEvents`, {method:"GET"});
            
            if (response.status === 204) {
                await displayEvent([]);
                return;
            }

            const event = await response.json();

            if(!response.ok){
                statusMessage.textContent = event.message
                statusMessage.style.color = "red"
                return
            }

            statusMessage.textContent = ""

            displayEvent(event);
        } catch (error) {
            console.error("Fallo al obtener todos los eventos", error)
        }

    }       



    showAllEvents();

})