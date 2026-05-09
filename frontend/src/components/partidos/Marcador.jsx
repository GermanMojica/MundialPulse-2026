import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Marcador = ({ partido }) => {
  const { homeTeam, awayTeam, score, status, minute } = partido;
  const isLive = status === 'IN_PLAY' || status === 'PAUSED';

  return (
    <div className="bg-card rounded-2xl p-8 shadow-xl border border-white/5 mb-8 overflow-hidden relative">
      {isLive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-primary font-bold text-sm tracking-widest uppercase">
            {minute ? `${minute}'` : 'En Vivo'}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto mt-4">
        {/* Home Team */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 flex items-center justify-center p-4 mb-4 border border-white/10 shadow-inner">
            <img 
              src={homeTeam.crest} 
              alt={homeTeam.name} 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-text">{homeTeam.name}</h2>
          <span className="text-text-muted text-sm font-medium mt-1 uppercase tracking-tighter">{homeTeam.tla}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-6">
            <AnimatePresence mode="wait">
              <motion.span 
                key={score.fullTime.home}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl md:text-8xl font-black text-text tabular-nums"
              >
                {score.fullTime.home ?? 0}
              </motion.span>
            </AnimatePresence>
            
            <span className="text-4xl md:text-6xl font-black text-primary/30">-</span>
            
            <AnimatePresence mode="wait">
              <motion.span 
                key={score.fullTime.away}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl md:text-8xl font-black text-text tabular-nums"
              >
                {score.fullTime.away ?? 0}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="mt-4">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isLive ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-text-muted border border-white/10'
            }`}>
              {status === 'FINISHED' ? 'Finalizado' : status === 'TIMED' ? 'Programado' : 'En Juego'}
            </span>
          </div>
        </div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 flex items-center justify-center p-4 mb-4 border border-white/10 shadow-inner">
            <img 
              src={awayTeam.crest} 
              alt={awayTeam.name} 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-text">{awayTeam.name}</h2>
          <span className="text-text-muted text-sm font-medium mt-1 uppercase tracking-tighter">{awayTeam.tla}</span>
        </div>
      </div>
    </div>
  );
};
