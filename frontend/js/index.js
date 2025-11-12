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
            const MessageRow = document.createElement("tr")
            const messageCell = document.createElement("td")
            messageCell.textContent = "No hay evento registrado"
            MessageRow.appendChild(messageCell)
            eventTableBody.appendChild(MessageRow)
            return;

        }

        event.forEach(ev => {
            const EventRow = document.createElement("tr");
            const idCell = document.createElement("td");
            const titleCell = document.createElement("td");
            const artistCell = document.createElement("td");
            // const artist_a = document.createElement("a");

            const Entry_ModeCell = document.createElement("td");
            const DateCell = document.createElement("td");
            const TimeCell = document.createElement("td");
            const LocationCell = document.createElement("td");
            const PriceCell = document.createElement("td");
            const FlyerCell = document.createElement("td");

            idCell.textContent = ev.id || "N/A";
            titleCell.textContent = ev.title;

            // artist_a.href = `/profileArtist/${ev.artist_id}`;
            // artist_a.textContent = ev.name;
            artistCell.textContent = ev.name;
            Entry_ModeCell.textContent = ev.entry_mode;
            DateCell.textContent = new Date(ev.date).toLocaleDateString();
            TimeCell.textContent = ev.time;
            LocationCell.textContent = ev.location;
            PriceCell.textContent = ev.price || "N/A";
            FlyerCell.textContent = ev.flyer_url || "N/A";
            

            EventRow.appendChild(idCell);
            EventRow.appendChild(titleCell);
            
            // artistCell.appendChild(artist_a);
            // EventRow.appendChild(artistCell);

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