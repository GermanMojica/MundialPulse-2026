import { useEffect, useCallback, useState } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export const useSocket = (partidoId) => {
  const { socket, connected, joinRoom, leaveRoom, emit } = useSocketContext();
  const [lastEvent, setLastEvent] = useState(null);

  const handleGol = useCallback((data) => {
    setLastEvent({ type: 'gol', data });
    
    // Vibrar en móvil
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // Toast personalizado con Framer Motion
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.5 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 ${
          data.equipo === 'home' 
            ? 'bg-green-600 border-green-400' 
            : 'bg-blue-600 border-blue-400'
        } text-white`}
      >
        <span className="text-4xl animate-bounce">⚽</span>
        <div>
          <div className="font-black text-2xl leading-none">¡GOL!</div>
          <div className="text-sm font-bold opacity-90 mt-1">
            {data.equipo === 'home' ? 'Local' : 'Visitante'} • {data.minuto}'
          </div>
        </div>
        <div className="ml-4 text-3xl font-black tabular-nums border-l border-white/20 pl-4">
          {data.marcador.home} - {data.marcador.away}
        </div>
      </motion.div>
    ), { duration: 4000 });
  }, []);

  useEffect(() => {
    if (!socket || !connected || !partidoId) return;

    joinRoom(partidoId);

    // Suscribirse a eventos
    socket.on('partido:gol', handleGol);
    socket.on('partido:update', (data) => setLastEvent({ type: 'update', data }));
    socket.on('partido:evento', (data) => setLastEvent({ type: 'evento', data }));
    socket.on('partido:inicio', (data) => setLastEvent({ type: 'inicio', data }));
    socket.on('partido:final', (data) => setLastEvent({ type: 'final', data }));

    return () => {
      socket.off('partido:gol', handleGol);
      socket.off('partido:update');
      socket.off('partido:evento');
      socket.off('partido:inicio');
      socket.off('partido:final');
      leaveRoom(partidoId);
    };
  }, [socket, connected, partidoId, joinRoom, leaveRoom, handleGol]);

  const enviarMensaje = useCallback((texto) => {
    emit('chat:mensaje', { partidoId, texto });
  }, [emit, partidoId]);

  return {
    connected,
    lastEvent,
    enviarMensaje
  };
};
