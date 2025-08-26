document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    // Guardar token en sessionStorage
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('userRole', data.role);

    // Redirección basada en el rol
    if (data.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/dashboard.html';
    }
  } catch (error) {
    document.getElementById('error-message').textContent = error.message;
  }
});

// Verificar autenticación al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('token');
  if (token) {
    // Si ya está autenticado, redirigir según su rol
    const role = sessionStorage.getItem('userRole');
    window.location.href = role === 'admin' ? '/admin.html' : '/dashboard.html';
  }
});