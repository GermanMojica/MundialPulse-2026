import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const hasToken = () => !!localStorage.getItem('token');

export const useAlbum = () => {
  const queryClient = useQueryClient();

  const miAlbumQuery = useQuery({
    queryKey: ['mi-album'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/album/mi-album`, getHeaders());
      return data;
    },
    enabled: hasToken(),
    retry: 1,
  });

  const misPuntosQuery = useQuery({
    queryKey: ['mis-puntos'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/album/mis-puntos`, getHeaders());
      return data;
    },
    enabled: hasToken(),
    refetchInterval: 60000,
    retry: 1,
  });

  const abrirSobreMutation = useMutation({
    mutationFn: async (tipo) => {
      const { data } = await axios.post(`${API_URL}/album/abrir-sobre`, { tipo }, getHeaders());
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mi-album'] });
      queryClient.invalidateQueries({ queryKey: ['mis-puntos'] });
      queryClient.invalidateQueries({ queryKey: ['album-pais'] });
    }
  });

  return {
    miAlbum: miAlbumQuery,
    misPuntos: misPuntosQuery,
    abrirSobre: abrirSobreMutation
  };
};

export const useAlbumPais = (codigo) => {
  return useQuery({
    queryKey: ['album-pais', codigo],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/album/pais/${codigo}`, getHeaders());
      return data;
    },
    enabled: !!codigo && hasToken(),
    retry: 1,
  });
};
