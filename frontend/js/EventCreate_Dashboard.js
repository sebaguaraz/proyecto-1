document.addEventListener("DOMContentLoaded", async () => {
    const logoutButton = document.getElementById("logoutButton");
    const artistName = document.getElementById("artistName");
    const formData = document.getElementById("newEventForm");
    const cancelButton = document.getElementById("cancelButton");
    const price = document.getElementById("price");

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
    artistName.style.fontSize = "20px"
    artistName.style.fontWeight = "bold"

    const createEvent = async () => {

        valuePrice = price.value

        if (!valuePrice || isNaN(valuePrice) || valuePrice < 0) {
            alert("El precio debe ser un numero entero y mayor a 0")
            return
        }

        const ObjectForm = new FormData(formData);

        const dataform = Object.fromEntries(ObjectForm.entries());

        console.log(dataform)


        try {
            const ConfigObject = {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dataform)

            }

            const response = await fetch(`/api/events/`, ConfigObject)
            console.log(response)
            const data = await response.json();


            if (!response.ok)
                throw new Error("Fallo en la peticion");


            console.log(data)
            alert("Evento creado con exito!");
            window.location.href = "artistEvent_Dashboard.html";


        } catch (error) {
            console.error("Error en el servidor", error);
        }


    }



    formData.addEventListener("submit", (event) => {
        event.preventDefault();
        createEvent();
    })


    cancelButton.addEventListener("click", () => {
        formData.reset();
    })

    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("userId");

        alert("Usted ah Cerrado Sesión, Redirigiendo...")
        window.location.href = "index.html";
    })


})