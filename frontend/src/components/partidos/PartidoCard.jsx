import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

export const PartidoCard = ({ partido }) => {
  const navigate = useNavigate();
  
  const { id, homeTeam, awayTeam, score, status, utcDate, minute } = partido;
  
  const isLive = status === 'IN_PLAY' || status === 'PAUSED';
  const isFinished = status === 'FINISHED';
  
  const timeFormatted = format(parseISO(utcDate), 'HH:mm');
  const dateFormatted = format(parseISO(utcDate), 'dd MMM');

  const getStatusBadge = () => {
    if (isLive) return <span className="text-xs font-bold text-red-500 animate-pulse">{minute ? `${minute}'` : 'EN VIVO'}</span>;
    if (isFinished) return <span className="text-xs font-bold text-text-muted">FT</span>;
    return <span className="text-xs font-bold text-blue-400">{timeFormatted}</span>;
  };

  return (
    <div 
      onClick={() => navigate(`/partidos/${id}`)}
      className="bg-surface border border-surface-2 hover:border-primary/50 transition-all rounded-xl p-4 cursor-pointer flex flex-col gap-3 group relative overflow-hidden"
    >
      {/* Live Glow Effect */}
      {isLive && (
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/20 blur-xl rounded-full"></div>
      )}

      {/* Header: Date & Status */}
      <div className="flex justify-between items-center border-b border-surface-2 pb-2">
        <span className="text-xs text-text-muted font-medium uppercase">{dateFormatted}</span>
        {getStatusBadge()}
      </div>

      {/* Teams & Score */}
      <div className="flex justify-between items-center flex-grow py-2">
        {/* Home */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <span className="text-3xl">{homeTeam.crest || '🏠'}</span>
          <span className="font-semibold text-sm text-center truncate w-full" title={homeTeam.name}>{homeTeam.tla || homeTeam.name}</span>
        </div>

        {/* Score / VS */}
        <div className="flex flex-col items-center justify-center w-1/3">
          {(isFinished || isLive) ? (
            <div className="text-2xl font-black tracking-widest text-text">
              {score?.fullTime?.home ?? 0} - {score?.fullTime?.away ?? 0}
            </div>
          ) : (
            <div className="text-lg font-bold text-text-muted">VS</div>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <span className="text-3xl">{awayTeam.crest || '✈️'}</span>
          <span className="font-semibold text-sm text-center truncate w-full" title={awayTeam.name}>{awayTeam.tla || awayTeam.name}</span>
        </div>
      </div>
    </div>
  );
};
