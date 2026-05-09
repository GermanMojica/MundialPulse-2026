import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { savePrediccion } from '../../services/predicciones.service';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export const FormPrediccion = ({ partido, onSaved }) => {
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await savePrediccion({
        partidoId: partido.id,
        golesLocal,
        golesVisitante
      }, token);
      
      toast.success('¡Predicción guardada!');
      if (onSaved) onSaved();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const matchTime = new Date(partido.utcDate);
  const limitTime = new Date(matchTime.getTime() - (60 * 60 * 1000));
  const isExpired = new Date() > limitTime;

  if (isExpired) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
        <p className="text-red-500 text-xs font-bold uppercase">Predicciones cerradas para este partido</p>
      </div>
    );
  }

  const renderCrest = (team) => {
    if (!team.crest) return <span className="text-4xl mb-2">⚽</span>;
    if (team.crest.startsWith('http')) {
      return (
        <img 
          src={team.crest} 
          alt={team.name} 
          className="w-12 h-12 md:w-16 md:h-16 object-contain mb-4 drop-shadow-lg" 
        />
      );
    }
    return <div className="text-4xl mb-2">{team.crest}</div>;
  };

  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col h-full"
    >
      <div className="flex items-center justify-between gap-4 mb-6 flex-grow">
        {/* Team Local */}
        <div className="flex-1 flex flex-col items-center">
          {renderCrest(partido.homeTeam)}
          <span className="text-xs font-black text-text-muted uppercase text-center truncate w-full px-2" title={partido.homeTeam.name}>
            {partido.homeTeam.tla || partido.homeTeam.name}
          </span>
          <input 
            type="number"
            min="0"
            max="9"
            value={golesLocal}
            onChange={(e) => setGolesLocal(parseInt(e.target.value) || 0)}
            className="w-16 h-16 mt-4 bg-background border-2 border-white/10 rounded-xl text-center text-3xl font-black focus:border-primary transition-colors focus:outline-none"
          />
        </div>

        <div className="text-2xl font-black text-text-muted mt-8">:</div>

        {/* Team Away */}
        <div className="flex-1 flex flex-col items-center">
          {renderCrest(partido.awayTeam)}
          <span className="text-xs font-black text-text-muted uppercase text-center truncate w-full px-2" title={partido.awayTeam.name}>
            {partido.awayTeam.tla || partido.awayTeam.name}
          </span>
          <input 
            type="number"
            min="0"
            max="9"
            value={golesVisitante}
            onChange={(e) => setGolesVisitante(parseInt(e.target.value) || 0)}
            className="w-16 h-16 mt-4 bg-background border-2 border-white/10 rounded-xl text-center text-3xl font-black focus:border-primary transition-colors focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary text-background font-black rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? 'GUARDANDO...' : 'CONFIRMAR PREDICCIÓN'}
      </button>
      
      <p className="text-[10px] text-center text-text-muted mt-4 uppercase tracking-tighter">
        Puedes cambiar tu voto hasta 1 hora antes del partido
      </p>
    </motion.form>
  );
};
