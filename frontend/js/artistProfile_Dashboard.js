

document.addEventListener("DOMContentLoaded", async () => {

    const logoutButton = document.getElementById("logout-button");

    const artistName = document.getElementById("artistName");
    const usernameDisplay = document.getElementById("usernameDisplay")
    // formulario
    const form_group = document.getElementById("artistProfileForm");
    // boton de links de enlaces
    const link_button = document.getElementById("toggle-links-button"); // Usar el nuevo ID del botón
    const social_urls_container = document.getElementById("social-urls-group"); // El nuevo contenedor de las URLs


    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("userRole");
    const userId = sessionStorage.getItem("userId");


    if (!token || role !== "artist") {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userId");    
        alert("No tiene permiso para este panel ,Redirigiendo...")
        window.location.href = "index.html";
        return;
    }

    artistName.textContent = username
    artistName.style.fontSize = "20px"
    artistName.style.fontWeight = "bold"
    usernameDisplay.textContent = username


    // La nueva función, usando toggle()
    function toggleSocialNetworks() {
        // Alterna la clase 'oculto'. Si está, la quita (muestra); si no está, la pone (oculta).
        social_urls_container.classList.toggle('oculto');

        // Opcional: Mejorar la UX cambiando el ícono o el texto del botón
        if (social_urls_container.classList.contains('oculto')) {
            link_button.textContent = 'Mostrar Enlaces a Redes Sociales';
        } else {
            link_button.textContent = 'Ocultar Enlaces a Redes Sociales';
            
        }
    }

    link_button.addEventListener("click", toggleSocialNetworks)




    form_group.addEventListener("submit", async (event) => {

        event.preventDefault();

        const phone_number = document.getElementById("phone_number")

        if (!Number(phone_number.value)) {
            alert("Por favor ingrese un numero de telefono valido")
            return
        }

        try {
            // invocamos al constructor de FormData y le pasamos el form e instanciamos un objeto de tipo FormData con las propiedades name y el value del formulario
            const formData = new FormData(form_group)

            // convertimos el objeto FormData en un objeto de JavaScript
            // el objeto FormData contiene las propiedades name y value
            const data = Object.fromEntries(formData.entries());

            const ConfigObject = {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
            const response = await fetch(`/api/artists/profile/${userId}`, ConfigObject);

            if (!response.ok) {
                throw new Error("error en la peticion");

            }

            const responseData = await response.json();

            console.log(responseData)
            alert("Perfil actualizado con exito");

        } catch (error) {
            console.error("error al actualizar el perfil:", error)
            alert("Hubo un error al actualizar el perfil. Por favor, intentelo de nuevo.");

        }

    })



    logoutButton.addEventListener("click", () => {

        sessionStorage.removeItem("token")
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("userRole")
        sessionStorage.removeItem("userId")

        alert("Usted ah Cerrado Sesión, Redirigiendo...")
        window.location.href = "index.html"
    })


})