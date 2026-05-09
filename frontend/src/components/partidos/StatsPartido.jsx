import React from 'react';
import { motion } from 'framer-motion';

export const StatsPartido = ({ stats }) => {
  const StatBar = ({ label, home, away, suffix = '' }) => {
    const total = (home || 0) + (away || 0);
    const homePercent = total === 0 ? 50 : (home / total) * 100;
    const awayPercent = total === 0 ? 50 : (away / total) * 100;

    return (
      <div className="mb-8 last:mb-0">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xl font-black text-text tabular-nums">{home}{suffix}</span>
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{label}</span>
          <span className="text-xl font-black text-text tabular-nums">{away}{suffix}</span>
        </div>
        <div className="h-2.5 flex rounded-full overflow-hidden bg-white/5 border border-white/10 p-[1px]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${homePercent}%` }}
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-l-full"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${awayPercent}%` }}
            className="h-full bg-gradient-to-l from-text-muted/40 to-text-muted/20 rounded-r-full"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-2xl p-8 border border-white/5 shadow-xl">
      <h3 className="text-lg font-bold text-text mb-10 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        Estadísticas de Juego
      </h3>
      
      <div className="space-y-4">
        <StatBar label="Posesión" home={stats.possession.home} away={stats.possession.away} suffix="%" />
        <StatBar label="Tiros Totales" home={stats.shots.home} away={stats.shots.away} />
        <StatBar label="Tiros a Puerta" home={stats.shotsOnTarget.home} away={stats.shotsOnTarget.away} />
        <StatBar label="Pases Completados" home={stats.passes.home} away={stats.passes.away} />
        <StatBar label="Córners" home={stats.corners.home} away={stats.corners.away} />
        <StatBar label="Faltas" home={stats.fouls.home} away={stats.fouls.away} />
      </div>
    </div>
  );
};
