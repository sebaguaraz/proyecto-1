document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evitar el envío tradicional del formulario

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');

            const username = usernameInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            try {
                const response = await fetch('/api/auth/register', { // Asegúrate que este endpoint coincida con tu backend
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message || '¡Registro exitoso! Ahora puedes iniciar sesión.');
                    window.location.href = 'index.html'; // Redirigir a la página de login
                } else {
                    alert(data.message || 'Error en el registro. Inténtalo de nuevo.');
                }
            } catch (error) {
                console.error('Error al intentar registrar:', error);
                alert('Ocurrió un error al intentar registrar. Por favor, revisa la consola.');
            }
        });
    } else {
        console.error("El formulario con id 'registerForm' no fue encontrado.");
    }
});