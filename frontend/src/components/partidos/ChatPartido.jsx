import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';

export const ChatPartido = ({ partidoId }) => {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [espectadores, setEspectadores] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const { socket } = useSocketContext();
  const scrollRef = useRef(null);

  // Auto-scroll al fondo
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes]);

  useEffect(() => {
    if (!socket) return;

    const handleNuevoMensaje = (msg) => {
      setMensajes(prev => [...prev.slice(-49), msg]); // Mantener últimos 50
    };

    const handleEspectadores = (count) => {
      setEspectadores(count);
    };

    socket.on('chat:nuevo-mensaje', handleNuevoMensaje);
    socket.on('chat:espectadores', handleEspectadores);

    return () => {
      socket.off('chat:nuevo-mensaje', handleNuevoMensaje);
      socket.off('chat:espectadores', handleEspectadores);
    };
  }, [socket]);

  const enviarMensaje = (e) => {
    e?.preventDefault();
    if (!nuevoMensaje.trim() || !isAuthenticated) return;

    socket.emit('chat:mensaje', {
      partidoId,
      texto: nuevoMensaje.trim().substring(0, 200)
    });

    setNuevoMensaje('');
  };

  const enviarReaccion = (emoji) => {
    if (!isAuthenticated) return;
    socket.emit('chat:mensaje', {
      partidoId,
      texto: emoji
    });
  };

  const reacciones = ['⚽', '🔥', '😮', '👏', '👎', '🏆'];

  return (
    <div className="flex flex-col h-[500px] bg-card rounded-2xl border border-white/5 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-text flex items-center gap-2">
          <span className="text-primary">●</span> Chat en Vivo
        </h3>
        <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {espectadores > 0 ? `${espectadores} viendo ahora` : 'Conectando...'}
        </div>
      </div>

      {/* Messages List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
      >
        {mensajes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale">
            <span className="text-4xl mb-2">💬</span>
            <p className="text-sm">¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {mensajes.map((msg, idx) => {
              const isOwn = msg.userId === user?.id;
              const isEmoji = reacciones.includes(msg.texto);

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[85%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar Initial */}
                    {!isOwn && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 shrink-0">
                        {msg.username?.substring(0, 2).toUpperCase() || 'AN'}
                      </div>
                    )}
                    
                    {/* Bubble */}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isEmoji ? 'text-4xl bg-transparent !p-0' :
                      isOwn 
                        ? 'bg-primary text-background font-medium rounded-br-none' 
                        : 'bg-white/5 text-text border border-white/5 rounded-bl-none'
                    }`}>
                      {msg.texto}
                    </div>
                  </div>
                  {!isEmoji && (
                    <span className="text-[10px] text-text-muted mt-1 px-1">
                      {msg.username || 'Anónimo'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Footer / Input */}
      <div className="p-4 bg-white/5 border-t border-white/5 space-y-3">
        {/* Quick Reactions */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {reacciones.map(emoji => (
            <button
              key={emoji}
              onClick={() => enviarReaccion(emoji)}
              disabled={!isAuthenticated}
              className="text-xl hover:scale-125 transition-transform disabled:opacity-30 disabled:grayscale"
            >
              {emoji}
            </button>
          ))}
        </div>

        {isAuthenticated ? (
          <form onSubmit={enviarMensaje} className="flex gap-2">
            <input 
              type="text"
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
              maxLength={200}
              className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              type="submit"
              disabled={!nuevoMensaje.trim()}
              className="p-2 bg-primary text-background rounded-xl disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        ) : (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
            <p className="text-xs text-primary font-bold">Inicia sesión para participar en el chat</p>
          </div>
        )}
      </div>
    </div>
  );
};
