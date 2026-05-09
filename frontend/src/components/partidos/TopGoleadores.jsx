import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGoleadores } from '../../services/partidos.service';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { motion } from 'framer-motion';

export const TopGoleadores = () => {
  const { data: scorers, isLoading, error } = useQuery({
    queryKey: ['goleadores'],
    queryFn: getGoleadores,
    staleTime: 300000,
  });

  if (isLoading) return <Card className="flex items-center justify-center p-12"><Spinner /></Card>;

  if (error || !scorers || scorers.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Top Goleadores</h3>
        <div className="text-text-muted text-center py-8">No hay datos disponibles.</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full flex flex-col border border-white/5 bg-gradient-to-br from-surface to-surface-2 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-text">Botín de Oro</h3>
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">En Vivo</span>
      </div>

      <div className="space-y-4">
        {scorers.slice(0, 5).map((item, idx) => (
          <motion.div 
            key={item.player.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-black text-xs text-text-muted border border-white/10 group-hover:text-primary transition-colors">
                {idx + 1}
              </div>
              <div>
                <h4 className="font-bold text-sm text-text">{item.player.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <img src={item.team.crest} alt={item.team.name} className="w-4 h-4 object-contain" />
                  <span className="text-[10px] text-text-muted font-bold uppercase">{item.team.name}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-primary tabular-nums">{item.goals}</div>
              <div className="text-[9px] text-text-muted font-bold uppercase tracking-tighter">Goles</div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text hover:bg-white/5 transition-all">
        Ver Tabla Completa
      </button>
    </Card>
  );
};
