import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FiguritaCard from './FiguritaCard';

const PackOpeningFC = ({ figuritas, tipo, onComplete }) => {
  const [fase, setFase] = useState('flare'); // flare -> tunnel -> walkout -> reveal
  
  // Determinar la mejor carta para el "Walkout"
  const bestCard = [...figuritas].sort((a, b) => {
    const rarezaMap = { 'legendaria': 4, 'épica': 3, 'rara': 2, 'común': 1 };
    return (rarezaMap[b.rareza?.toLowerCase()] || 1) - (rarezaMap[a.rareza?.toLowerCase()] || 1);
  })[0];

  const isLegendary = bestCard?.rareza?.toLowerCase() === 'legendaria';
  const isEpic = bestCard?.rareza?.toLowerCase().includes('épica') || bestCard?.rareza?.toLowerCase().includes('epica');

  useEffect(() => {
    const timer1 = setTimeout(() => setFase('tunnel'), 1500);
    const timer2 = setTimeout(() => {
      if (isLegendary || isEpic) {
        setFase('walkout');
      } else {
        onComplete();
      }
    }, 3500);

    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden touch-none">
      {/* Background Lights */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 opacity-40 blur-[100px] animate-pulse ${
          isLegendary ? 'bg-yellow-600' : isEpic ? 'bg-purple-800' : 'bg-blue-800'
        }`} />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <AnimatePresence mode="wait">
        {/* FASE 1: FLARE */}
        {fase === 'flare' && (
          <motion.div
            key="flare"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="relative flex flex-col items-center px-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                filter: ["brightness(1)", "brightness(2)", "brightness(1)"]
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-7xl md:text-9xl mb-6 drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]"
            >
              📦
            </motion.div>
            <h2 className="text-white text-xl md:text-3xl font-black italic uppercase tracking-[0.2em] text-center">
              Abriendo <span className="text-primary">{tipo}</span>
            </h2>
          </motion.div>
        )}

        {/* FASE 2: TUNNEL */}
        {fase === 'tunnel' && (
          <motion.div
            key="tunnel"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 3, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className={`w-full h-full border-[20px] md:border-[50px] rounded-full animate-ping opacity-30 ${
              isLegendary ? 'border-yellow-400' : 'border-blue-500'
            }`} />
          </motion.div>
        )}

        {/* FASE 3: WALKOUT */}
        {fase === 'walkout' && (
          <motion.div
            key="walkout"
            initial={{ y: 200, opacity: 0, scale: 0.7 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-4 md:gap-8 relative z-[400] w-full max-w-lg px-4"
          >
            {/* Glow Effect */}
            <div className={`absolute -inset-10 blur-[120px] opacity-50 rounded-full animate-pulse ${
              isLegendary ? 'bg-yellow-500' : 'bg-purple-600'
            }`} />
            
            {/* Player Card */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 scale-90 md:scale-125"
            >
              <FiguritaCard figurita={bestCard} obtenida={true} />
            </motion.div>

            {/* Player Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center relative z-10 mt-4 md:mt-10"
            >
              <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                {bestCard.nombre}
              </h1>
              <p className={`font-black text-lg md:text-2xl uppercase tracking-[0.3em] mt-2 ${
                isLegendary ? 'text-yellow-400' : 'text-purple-400'
              }`}>
                ¡{bestCard.rareza.toUpperCase()}!
              </p>
            </motion.div>

            {/* Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className="mt-6 md:mt-12 bg-white text-black font-black py-3 md:py-4 px-8 md:px-14 rounded-full hover:scale-110 active:scale-90 transition-all uppercase tracking-widest relative z-[500] cursor-pointer shadow-[0_15px_30px_rgba(255,255,255,0.2)] text-xs md:text-base"
            >
              Ver resto del sobre
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-[300] text-white/20 hover:text-white font-bold uppercase tracking-widest text-[10px] md:text-sm transition-colors py-2 px-4 border border-white/10 rounded-full backdrop-blur-sm"
      >
        Saltar Animación
      </button>
    </div>
  );
};

export default PackOpeningFC;
