import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlbum } from '../../hooks/useAlbum';
import { useSocketContext } from '../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCash } from 'react-icons/io5';

const PuntosWidget = () => {
  const navigate = useNavigate();
  const { misPuntos } = useAlbum();
  const { data, refetch } = misPuntos;
  
  const [displayPoints, setDisplayPoints] = useState(0);
  const [actualPoints, setActualPoints] = useState(0);
  const [floatingPoints, setFloatingPoints] = useState([]);
  
  const { socket } = useSocketContext();

  useEffect(() => {
    if (data && data.puntos) {
      const balance = data.puntos.total - data.puntos.gastados;
      setActualPoints(balance);
      setDisplayPoints(balance);
    }
  }, [data]);

  // Count up animation
  useEffect(() => {
    if (displayPoints !== actualPoints) {
      const step = actualPoints > displayPoints ? 1 : -1;
      const diff = Math.abs(actualPoints - displayPoints);
      const delay = Math.max(10, 500 / diff); // animate over ~500ms
      
      const timer = setTimeout(() => {
        setDisplayPoints(prev => prev + step * Math.max(1, Math.floor(diff / 10)));
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [displayPoints, actualPoints]);

  useEffect(() => {
    if (!socket) return;

    const handlePuntos = (evento) => {
      refetch().then(res => {
        const newData = res.data;
        if (newData && newData.puntos) {
          const balance = newData.puntos.total - newData.puntos.gastados;
          setActualPoints(balance);
          
          const id = Date.now();
          setFloatingPoints(prev => [...prev, { id, amount: evento.puntosGanados }]);
          
          setTimeout(() => {
            setFloatingPoints(prev => prev.filter(p => p.id !== id));
          }, 2000);
        }
      });
    };

    socket.on('puntos:actualizados', handlePuntos);
    return () => {
      socket.off('puntos:actualizados', handlePuntos);
    };
  }, [socket, refetch]);

  if (!data || !data.puntos) return null;

  const formatPoints = (pts) => {
    return pts > 999 ? (pts / 1000).toFixed(1) + 'k' : pts;
  };

  const ptsToNextPack = 500 - (actualPoints % 500);

  return (
    <div 
      onClick={() => navigate('/album?tab=sobres')}
      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-yellow-500/30 rounded-full px-3 py-1.5 cursor-pointer transition-colors shadow-sm group relative"
    >
      <IoCash style={{ fontSize: '18px', color: '#EF9F27' }} />
      <span className="text-white font-bold text-sm">{formatPoints(displayPoints)}</span>
      
      {/* Floating Points */}
      <AnimatePresence>
        {floatingPoints.map(fp => (
          <motion.div
            key={fp.id}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`absolute top-0 left-1/2 -translate-x-1/2 font-bold text-sm ${fp.amount > 0 ? 'text-green-400' : 'text-red-400'} drop-shadow-md pointer-events-none z-50`}
          >
            {fp.amount > 0 ? '+' : ''}{fp.amount} pts
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Tooltip on hover */}
      <div className="absolute top-full right-0 mt-2 w-max bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
        <p className="text-sm text-white">
          <span className="font-bold">{actualPoints.toLocaleString()}</span> puntos · próximo sobre a {ptsToNextPack} pts
        </p>
      </div>
    </div>
  );
};

export default PuntosWidget;
