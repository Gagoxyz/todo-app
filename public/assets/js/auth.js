const API_URL = '/api/auth';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value;

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = 'dashboard.html';
  } else {
    alert(data.msg || 'Error al iniciar sesión');
  }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value;
  const confirmPassword = e.target.confirmPassword.value;

  if (!username || !password || !confirmPassword) {
    return alert('Todos los campos son obligatorios');
  }

  if (password !== confirmPassword) {
    return alert('Las contraseñas no coinciden');
  }

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, confirmPassword })
  });

  const data = await res.json();

  if (res.ok) {
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    e.target.reset();
  } else {
    alert(data.msg || 'Error al registrarse');
  }
});

