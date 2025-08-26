document.addEventListener('DOMContentLoaded', () => {

    const logoutButton = document.getElementById('logoutButton');
    const showArtistsButton = document.getElementById('showArtistsButton');
    const message = document.getElementById('message');
    const artistTable = document.getElementById('artistTable');
    const artistTableBody = document.getElementById('artistTableBody');

    // Verificar autenticación y rol
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('userRole');
    if (!token || userRole !== 'admin') {
        message.textContent = 'No tienes permisos para acceder a esta página. Redirigiendo...';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    const loadArtists = async () => {

        try {
            const response = await fetch(`/api/artists/all`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                }
            })


            if (!response.ok) {
                sessionStorage.removeItem("token")
                sessionStorage.removeItem("userRole")
                sessionStorage.removeItem("username")
                sessionStorage.removeItem("userId")
                message.textContent = 'No tienes permisos para acceder a esta página. Redirigiendo...';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
                return;

            }
            const artists = await response.json();

            displayArtists(artists);


        } catch (error) {
            console.error("Error de conexion al mostrar los artistas", error)

        }



    }


    const displayArtists = (artists) => {
        artistTableBody.textContent = "";
        if (artists.length === 0) {
            const rowMessage = document.createElement("tr");
            const messageCell = document.createElement("td");
            messageCell.textContent = "No hay artistas registrados";
            rowMessage.appendChild(messageCell);
            artistTableBody.appendChild(rowMessage);
        }
        
        artists.map((artist) => {
            const row = document.createElement("tr");

            const Id = document.createElement("td");
            Id.textContent = artist.user_id;
            
            // creo celda para la imagen
            const imgcell = document.createElement("td");
            const img_url = document.createElement("img");
            img_url.src = artist.photo_url || `https://via.placeholder.com/150`;
            img_url.alt = "Foto de perfil";
            img_url.style.borderRadius = "50px";
            img_url.width = "100px";
            imgcell.appendChild(img_url);
            
            
            const username = document.createElement("td");
            const contact_email = document.createElement("td");
            const phone_number = document.createElement("td");
            username.textContent = artist.username || "N/A";
            contact_email.textContent = artist.contact_email || "N/A";
            phone_number.textContent = artist.phone_number || "N/A";
            
            // Celda de acciones
            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = " delete-btn"
            deleteButton.setAttribute('data-id', artist.user_id);
            actionsCell.appendChild(deleteButton);
            
            // Agregar celdas a la fila
            row.appendChild(Id);
            row.appendChild(imgcell);
            row.appendChild(username);
            row.appendChild(contact_email);
            row.appendChild(phone_number);
            row.appendChild(actionsCell);

            artistTableBody.appendChild(row);
        })

        addActionListeners();

    }

    function addActionListeners() {
        const buttons = document.querySelectorAll('.delete-btn')
        for (const btn of buttons) {
            btn.addEventListener('click', (e) => {
                const artistId = e.target.getAttribute('data-id');
                deleteArtist(artistId);
            });
        }
    }

    const deleteArtist = async (artistId) => {

        try {
            const response = await fetch(`/api/users/${artistId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                console.error('Error al eliminar artista');
            }

            message.textContent = 'Artista eliminado correctamente';

            loadArtists();

        } catch (error) {
            console.error('Error al eliminar artista:', error);
            message.textContent = 'Error al eliminar el artista';
        }
    }


showArtistsButton.addEventListener("click", loadArtists)

logoutButton.addEventListener("click", () => {

        sessionStorage.removeItem("token")
        sessionStorage.removeItem("userRole")
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("userId")
        message.textContent = 'Saliendo del panel de moderación. Redirigiendo...';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

        return;

    })
})
