document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    function mostrarMensaje(mensaje, tipo = 'danger') {
        loginMessage.textContent = mensaje;
        loginMessage.className = `alert alert-${tipo} mt-3`;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            loginMessage.textContent = '';
            loginMessage.className = 'mt-3';

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !password) {
                mostrarMensaje('Por favor, ingresa usuario y contraseña.', 'danger');
                return;
            }

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: username, password: password }),
                });

                const data = await response.json();

                if (response.ok) {
                    mostrarMensaje(data.message || '¡Login exitoso! Redirigiendo...', 'success');

                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('userRole', data.role);
                    sessionStorage.setItem('username', data.username);
                    sessionStorage.setItem('userId', data.userId);

                    setTimeout(() => {
                        if (data.role === 'artist') {
                            window.location.href = 'artistEvent_Dashboard.html';
                        } else if(data.role === 'admin'){
                            window.location.href = 'adminDashboard.html';
                        }
                    }, 1500);

                } else {
                    mostrarMensaje(data.error || 'Error en el login. Verifica tus credenciales.', 'danger');
                }
            } catch (error) {
                console.error('Error al intentar iniciar sesión:', error);
                mostrarMensaje('Ocurrió un error de conexión. Intenta más tarde.', 'danger');
            }
        });
    }
});
