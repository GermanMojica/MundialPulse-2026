import React from 'react';

export const Timeline = ({ eventos }) => {
  if (!eventos || eventos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-muted bg-white/5 rounded-2xl border border-dashed border-white/10">
        <p className="text-lg">No hay eventos registrados aún</p>
      </div>
    );
  }

  const sortedEventos = [...eventos].sort((a, b) => b.minute - a.minute);

  const getEventIcon = (type) => {
    switch (type) {
      case 'GOAL': return '⚽';
      case 'YELLOW_CARD': return '🟨';
      case 'RED_CARD': return '🟥';
      case 'SUBSTITUTION': return '🔄';
      case 'PENALTY_MISSED': return '❌';
      default: return '📍';
    }
  };

  return (
    <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
      {sortedEventos.map((evento, index) => (
        <div key={index} className="relative group">
          {/* Icon Dot */}
          <div className={`absolute -left-8 w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs z-10 border-2 border-background shadow-lg ${
            evento.type === 'GOAL' ? 'bg-primary' : 'bg-white/10'
          }`}>
            {getEventIcon(evento.type)}
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5 transition-all hover:bg-white/[0.07] hover:translate-x-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-primary font-bold tabular-nums text-lg">{evento.minute}'</span>
              <span className="text-text font-bold">
                {evento.type === 'GOAL' ? '¡GOL!' : 
                 evento.type === 'YELLOW_CARD' ? 'Tarjeta Amarilla' :
                 evento.type === 'RED_CARD' ? 'Tarjeta Roja' :
                 evento.type === 'SUBSTITUTION' ? 'Cambio' : 'Penal Fallado'}
              </span>
            </div>
            
            <div className="text-text-muted">
              {evento.type === 'SUBSTITUTION' ? (
                <div className="flex flex-col">
                  <span className="text-green-400">Entra: {evento.playerIn}</span>
                  <span className="text-red-400">Sale: {evento.playerOut}</span>
                </div>
              ) : (
                <span className="text-text/90 font-medium">{evento.player} {evento.isPenalty ? '(P.)' : ''}</span>
              )}
            </div>
            
            <div className="mt-1 text-[10px] font-bold text-text-muted/50 uppercase tracking-widest">
              {evento.team}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
