const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getMisPredicciones = async (token) => {
  const response = await fetch(`${API_URL}/predicciones/mis-predicciones`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Error al cargar tus predicciones');
  return response.json();
};

export const savePrediccion = async (data, token) => {
  const response = await fetch(`${API_URL}/predicciones`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al guardar la predicción');
  }
  return response.json();
};

export const getRankingGlobal = async () => {
  const response = await fetch(`${API_URL}/predicciones/ranking`);
  if (!response.ok) throw new Error('Error al cargar el ranking');
  return response.json();
};

export const crearLiga = async (nombre, token) => {
  const response = await fetch(`${API_URL}/ligas`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ nombre })
  });
  return response.json();
};

export const unirseLiga = async (codigo, token) => {
  const response = await fetch(`${API_URL}/ligas/unirse`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ codigo })
  });
  return response.json();
};

export const getRankingLiga = async (codigo, token) => {
  const response = await fetch(`${API_URL}/ligas/${codigo}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
