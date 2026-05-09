const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getPartidos = async (date) => {
  const query = date ? `?date=${date}` : '';
  const response = await fetch(`${API_URL}/partidos${query}`);
  if (!response.ok) throw new Error('Error al cargar los partidos');
  return response.json();
};

export const getLivePartidos = async () => {
  const response = await fetch(`${API_URL}/partidos/live`);
  if (!response.ok) throw new Error('Error al cargar los partidos en vivo');
  return response.json();
};

export const getPartidoById = async (id) => {
  const response = await fetch(`${API_URL}/partidos/${id}`);
  if (!response.ok) throw new Error('Error al cargar el partido');
  return response.json();
};

export const getGrupos = async () => {
  const response = await fetch(`${API_URL}/grupos`);
  if (!response.ok) throw new Error('Error al cargar grupos');
  return response.json();
};

export const getGoleadores = async () => {
  const response = await fetch(`${API_URL}/goleadores`);
  if (!response.ok) throw new Error('Error al cargar goleadores');
  return response.json();
};
