import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext debe ser usado dentro de un SocketProvider');
  }
  return context;
};

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    // Inicializar socket con token si existe
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Socket conectado:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Socket desconectado');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Error de conexión socket:', error.message);
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  // Funciones de utilidad
  const joinRoom = useCallback((room) => {
    if (socket && connected) {
      socket.emit('join:partido', { partidoId: room });
    }
  }, [socket, connected]);

  const leaveRoom = useCallback((room) => {
    if (socket && connected) {
      socket.emit('leave:partido', { partidoId: room });
    }
  }, [socket, connected]);

  const emit = useCallback((event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  }, [socket, connected]);

  const value = {
    socket,
    connected,
    joinRoom,
    leaveRoom,
    emit
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
