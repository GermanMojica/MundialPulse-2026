import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoFootball, IoFlash, IoShieldCheckmark, IoHandRight } from 'react-icons/io5';
import { getPaisData } from '../../utils/paises-data';

const FiguritaModal = ({ figurita, isOpen, onClose }) => {
  if (!figurita || !isOpen) return null;

  const { nombre, posicion, rareza, paisCodigo, numero, fechaNac, altura, peso, equipo, imagen, stats } = figurita;
  const pData = getPaisData(paisCodigo);
  const colorBase = pData.colorPrimario || '#378ADD';

  // Stats por defecto si vienen vacías
  const s = stats || {
    partidos: 0,
    goles: 0,
    asistencias: 0,
    amarillas: 0,
    rojas: 0,
    pases: 0,
    atajadas: 0
  };

  const isGK = posicion?.toLowerCase().includes('goalkeeper') || posicion?.toLowerCase().includes('portero');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <IoClose size={24} />
          </button>

          {/* Header Visual */}
          <div className="h-32 relative overflow-hidden" style={{ backgroundColor: colorBase }}>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />
            
            <div className="absolute bottom-4 left-6 flex items-center gap-4">
              <span className="text-4xl">{pData.bandera}</span>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{nombre}</h2>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{equipo}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Player Main Info */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Posición</p>
                <p className="text-white font-bold text-sm">{posicion}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Altura / Peso</p>
                <p className="text-white font-bold text-sm">{altura} / {peso}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Rareza</p>
                <span className="text-primary font-black text-xs uppercase italic">{rareza}</span>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <IoFlash className="text-yellow-400" />
                  Estadísticas Temporada
                </h3>
                <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-1 rounded-full border border-white/5 uppercase font-bold">
                  World Cup Qualifiers / League
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Stat Cards */}
                <StatBox icon={<IoFootball />} label="Goles" value={s.goles} />
                <StatBox icon={<IoFlash />} label="Asistencias" value={s.asistencias} />
                <StatBox icon={<IoShieldCheckmark />} label="Partidos" value={s.partidos} />
                
                {isGK ? (
                  <StatBox icon={<IoHandRight />} label="Atajadas" value={s.atajadas} />
                ) : (
                  <StatBox icon={<IoFlash />} label="Efectividad" value={`${s.pases}%`} />
                )}
              </div>

              {/* Cards row */}
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-yellow-500">
                  <div className="w-3 h-4 bg-yellow-500 rounded-sm" />
                  <span className="text-xs font-black">{s.amarillas}</span>
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <div className="w-3 h-4 bg-red-500 rounded-sm" />
                  <span className="text-xs font-black">{s.rojas}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-600 font-black uppercase tracking-tighter leading-none">Cromo Nº</span>
                <span className="text-slate-400 font-black text-xl leading-none">#{numero}</span>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-tighter">Powered by</p>
                <p className="text-primary font-black italic text-sm leading-none">MundialPulse</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const StatBox = ({ icon, label, value }) => (
  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
    <div className="text-primary opacity-80">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-white font-black text-lg leading-none">{value}</p>
    </div>
  </div>
);

export default FiguritaModal;
