import React from 'react';
import { motion } from 'framer-motion';
import { getPaisData } from '../../utils/paises-data';

const FiguritaCard = ({ figurita, obtenida = false, cantidad = 0 }) => {
  const { nombre, posicion, rareza, paisCodigo, numero, fechaNac, altura, peso, equipo, imagen } = figurita;
  const pData = getPaisData(paisCodigo);

  // ESTADO: NO OBTENIDA (Silueta estilo álbum físico)
  if (!obtenida) {
    return (
      <div 
        className="group relative flex flex-col items-center justify-center rounded-sm overflow-hidden"
        style={{ 
          width: '110px', 
          height: '150px', 
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px_10px]" />
        
        {/* Silhouette / Number */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-2 border border-white/5">
            <span className="text-slate-600 text-3xl">👤</span>
          </div>
          <span className="text-slate-500 font-black text-xl tracking-tighter uppercase">{paisCodigo}</span>
          <span className="text-slate-400 font-black text-2xl tracking-tighter">{numero}</span>
        </div>

        {/* Diagonal Ribbon (Optional) */}
        <div className="absolute top-2 left-2 bg-slate-700/50 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-500 uppercase tracking-widest">
          Faltante
        </div>
      </div>
    );
  }

  // ESTADO: OBTENIDA (Cromos estilo Panini)
  const rarezaNormalized = rareza?.toLowerCase() || 'común';
  const isEspecial = rarezaNormalized.includes('rara') || rarezaNormalized.includes('épica') || rarezaNormalized.includes('legendaria');
  
  // Colores dinámicos
  const colorBase = pData.colorPrimario || '#378ADD';

  return (
    <motion.div 
      whileHover={{ scale: 1.05, zIndex: 40 }}
      className={`relative flex flex-col rounded-sm overflow-hidden shadow-2xl group ${isEspecial ? 'sticker-especial' : ''}`}
      style={{ 
        width: '120px', 
        height: '165px', 
        backgroundColor: '#fff',
        border: isEspecial ? '3px solid #ffd700' : '2px solid #ddd',
        padding: '2px'
      }}
    >
      {/* Glossy Overlay (Cromo) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none z-20" />
      
      {/* Header: Logo & Flag */}
      <div className="bg-slate-50 h-8 flex items-center justify-between px-1.5 border-b border-slate-200">
        <div className="flex flex-col items-start">
          <span className="text-[6px] font-black leading-none text-slate-400 uppercase tracking-tighter">MUNDIAL</span>
          <span className="text-[8px] font-black leading-none text-primary italic">PULSE</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs">{pData.bandera}</span>
          <span className="text-[10px] font-black text-slate-800">{paisCodigo}</span>
        </div>
      </div>

      {/* Player Image Area */}
      <div className="relative flex-1 bg-slate-100 overflow-hidden">
        {/* Placeholder para imagen del jugador */}
        {imagen ? (
          <img src={imagen} alt={nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-200 to-slate-300">
            <span className="text-5xl opacity-40 grayscale">{pData.bandera}</span>
          </div>
        )}
        
        {/* Rareza Badge */}
        {isEspecial && (
          <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[6px] font-black px-1 py-0.5 rounded shadow-sm uppercase italic">
            {rarezaNormalized}
          </div>
        )}

        {/* Sticker Number */}
        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded backdrop-blur-sm">
          {numero}
        </div>
      </div>

      {/* Footer Info Area */}
      <div className="p-1 flex flex-col gap-0.5" style={{ backgroundColor: colorBase }}>
        {/* Player Name */}
        <div className="bg-white/90 px-1 py-0.5 rounded-sm">
          <p className="text-[9px] font-black text-slate-900 uppercase truncate text-center">
            {nombre || "NOMBRE JUGADOR"}
          </p>
        </div>

        {/* Physical Stats */}
        <div className="flex justify-between items-center text-[7px] font-bold text-white px-0.5">
          <span>{fechaNac || '01-01-2000'}</span>
          <div className="flex gap-1">
            <span>{altura || '1.80m'}</span>
            <span>{peso || '75kg'}</span>
          </div>
        </div>

        {/* Club Team */}
        <div className="flex items-center justify-between gap-1 px-0.5 mt-0.5">
          <p className="text-[7px] font-black text-white/90 truncate uppercase flex-1">
            {equipo || "Club Fútbol"}
          </p>
          <span className="text-[6px] bg-black/20 text-white px-1 rounded uppercase font-bold">
            {posicion || 'JUG'}
          </span>
        </div>
      </div>

      {/* Duplicate Counter */}
      {cantidad > 1 && (
        <div className="absolute top-10 right-1 bg-red-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-white z-30">
          {cantidad}
        </div>
      )}
    </motion.div>
  );
};

export default FiguritaCard;
