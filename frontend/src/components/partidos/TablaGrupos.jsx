import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGrupos } from '../../services/partidos.service';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { motion, AnimatePresence } from 'framer-motion';

export const TablaGrupos = () => {
  const [selectedGroup, setSelectedGroup] = useState(0);

  const { data: standings, isLoading, error } = useQuery({
    queryKey: ['grupos'],
    queryFn: getGrupos,
    staleTime: 300000, // 5 min
  });

  if (isLoading) return <Card className="flex items-center justify-center p-12"><Spinner /></Card>;
  
  if (error || !standings || standings.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Tabla de Grupos</h3>
        <div className="text-text-muted text-center py-8">
          No hay datos de grupos disponibles.
        </div>
      </Card>
    );
  }

  const currentGroup = standings[selectedGroup];

  return (
    <Card className="p-6 h-full flex flex-col border border-white/5 bg-gradient-to-br from-surface to-surface-2 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-text">Tabla de Grupos</h3>
        
        <select 
          value={selectedGroup} 
          onChange={(e) => setSelectedGroup(parseInt(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-primary transition-colors cursor-pointer"
        >
          {standings.map((group, idx) => (
            <option key={group.group} value={idx} className="bg-surface text-text">
              {group.group.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-text-muted border-b border-white/5 font-bold uppercase text-[10px] tracking-widest">
              <th className="pb-3 px-2">Pos</th>
              <th className="pb-3">Equipo</th>
              <th className="pb-3 text-center">PJ</th>
              <th className="pb-3 text-center">G</th>
              <th className="pb-3 text-center">E</th>
              <th className="pb-3 text-center">P</th>
              <th className="pb-3 text-center">GD</th>
              <th className="pb-3 text-center font-black text-primary">Pts</th>
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody 
              key={currentGroup.group}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentGroup.table.map((row) => (
                <tr key={row.team.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-3 px-2 font-bold text-text-muted">{row.position}</td>
                  <td className="py-3 flex items-center gap-3">
                    <img 
                      src={row.team.crest} 
                      alt={row.team.name} 
                      className="w-6 h-6 object-contain drop-shadow-sm group-hover:scale-110 transition-transform" 
                    />
                    <span className="font-bold text-text truncate max-w-[120px]">{row.team.tla || row.team.name}</span>
                  </td>
                  <td className="py-3 text-center text-text-muted font-medium">{row.playedGames}</td>
                  <td className="py-3 text-center text-text-muted font-medium">{row.won}</td>
                  <td className="py-3 text-center text-text-muted font-medium">{row.draw}</td>
                  <td className="py-3 text-center text-text-muted font-medium">{row.lost}</td>
                  <td className="py-3 text-center text-text-muted font-medium">{row.goalDifference}</td>
                  <td className="py-3 text-center font-black text-primary">{row.points}</td>
                </tr>
              ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-[10px] text-text-muted font-bold uppercase tracking-tighter">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div> Clasifica
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div> Eliminado
        </div>
      </div>
    </Card>
  );
};
