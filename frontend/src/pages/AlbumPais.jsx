import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlbumPais } from '../hooks/useAlbum';
import { getPaisData } from '../utils/paises-data';
import FiguritaCard from '../components/album/FiguritaCard';
import { FiArrowLeft } from 'react-icons/fi';
import { IoCart } from 'react-icons/io5';
import { motion } from 'framer-motion';

const AlbumPais = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { data: figuritasData, isLoading, error, refetch } = useAlbumPais(codigo);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#0a0a0f]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <p className="text-slate-400 text-sm animate-pulse">Cargando selección...</p>
      </div>
    );
  }

  if (error || !figuritasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4 bg-[#0a0a0f]">
        <span className="text-6xl">🏳️</span>
        <div>
          <h2 className="text-white font-black text-2xl uppercase tracking-tighter">Error al cargar país</h2>
          <p className="text-slate-500 text-sm mt-2">No pudimos encontrar los datos de este equipo.</p>
        </div>
        <button 
          onClick={() => navigate('/album')}
          className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-bold transition-all border border-white/5"
        >
          Volver al Álbum
        </button>
      </div>
    );
  }

  const figuritas = figuritasData.figuritas || [];
  const paisNombre = figuritasData.pais || codigo;
  const pData = getPaisData(codigo, paisNombre);

  const obtenidas = figuritas.filter(f => f.obtenida).length;
  const total = figuritas.length || 23;
  const porcentaje = Math.round((obtenidas / total) * 100);

  // Ordenar figuritas: por número siempre para que parezca un álbum real
  const sortedFiguritas = useMemo(() => {
    return [...figuritas].sort((a, b) => a.numero - b.numero);
  }, [figuritas]);

  return (
    <div className="min-h-screen pb-32 bg-[#0a0a0f]">
      {/* Header Visual Premium */}
      <div className="relative w-full overflow-hidden">
        {/* Background Blur Effect */}
        <div 
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{ backgroundColor: pData.colorPrimario }}
        />
        
        <div 
          className="relative px-6 py-12 md:py-16 border-b border-white/5 backdrop-blur-sm"
          style={{ 
            background: `linear-gradient(to bottom, ${pData.colorPrimario}11, transparent)`,
          }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.button 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => navigate('/album')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Volver al Álbum</span>
            </motion.button>

            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-900 border-4 border-white/10 shadow-2xl flex items-center justify-center text-7xl md:text-8xl drop-shadow-2xl"
              >
                {pData.bandera}
              </motion.div>

              <div className="flex-1 text-center md:text-left">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic italic">
                      {pData.nombre}
                    </h1>
                    
                    {/* Selector de País Rápido */}
                    <select 
                      className="bg-white/5 border border-white/10 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest outline-none focus:border-primary/50 transition-colors cursor-pointer"
                      value={codigo}
                      onChange={(e) => navigate(`/album/pais/${e.target.value}`)}
                    >
                      <option value={codigo} disabled>{pData.nombre}</option>
                      {/* Aquí idealmente mostraríamos todos los países, pero por ahora permitimos volver */}
                      <option value="">Seleccionar otro...</option>
                    </select>

                    <span className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/20 uppercase tracking-widest">
                      FIFA World Cup 2026
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
                    {pData.datoCurioso}
                  </p>
                </motion.div>

                {/* Progress Stats */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0"
                >
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Coleccionadas</p>
                    <p className="text-white font-black text-xl">{obtenidas} / {total}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Completado</p>
                    <p className="text-primary font-black text-xl">{porcentaje}%</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Figuritas Grid */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 justify-items-center">
          {sortedFiguritas.map((fig, idx) => (
            <motion.div
              key={fig.id || fig.numero}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <FiguritaCard 
                figurita={fig} 
                obtenida={fig.obtenida} 
                cantidad={fig.cantidad} 
              />
            </motion.div>
          ))}
        </div>
        
        {figuritas.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-500 font-medium">No hay figuritas disponibles para este país aún.</p>
          </div>
        )}
      </div>

      {/* Shop Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/album?tab=sobres')}
        className="fixed bottom-8 right-8 bg-primary hover:bg-primary-dark text-bg font-black py-4 px-8 rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] flex items-center gap-3 z-50 uppercase tracking-widest italic text-sm transition-all"
      >
        <IoCart size={20} />
        <span>Ir a la tienda</span>
      </motion.button>
    </div>
  );
};
export default AlbumPais;
