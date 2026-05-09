const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error en login');
  return data;
};

export const register = async (username, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error en registro');
  return data;
};

export const getMe = async (token) => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error obteniendo usuario');
  return data;
};
