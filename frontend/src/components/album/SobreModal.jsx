import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FiguritaCard from './FiguritaCard';
import PackOpeningFC from './PackOpeningFC';

const SobreModal = ({ isOpen, onClose, figuritas, tipo = 'basico' }) => {
  const [fase, setFase] = useState('cinematica'); // cinematica -> resumen
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setFase('cinematica');
    }
  }, [isOpen]);

  const handleIrAlbum = () => {
    onClose();
    navigate('/album');
  };

  if (!isOpen) return null;

  const safeFiguritas = Array.isArray(figuritas) ? figuritas : [];
  const nuevas = safeFiguritas.filter(f => f.esNueva).length;
  const repetidas = safeFiguritas.length - nuevas;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start p-4 overflow-y-auto bg-slate-950/95 backdrop-blur-xl scrollbar-hide py-10 md:py-20">
      {fase === 'cinematica' ? (
        <PackOpeningFC 
          figuritas={safeFiguritas} 
          tipo={tipo} 
          onComplete={() => setFase('resumen')} 
        />
      ) : (
        <div className="w-full max-w-6xl flex flex-col items-center relative">
          {/* Header Resumen */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
              CONTENIDO DEL <span className="text-primary">SOBRE</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2">
              {safeFiguritas.length} figuritas nuevas añadidas
            </p>
          </motion.div>

          <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 max-w-6xl px-2 md:px-4">
              {safeFiguritas.map((fig, idx) => (
                <motion.div
                  key={`${fig.id || idx}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex justify-center"
                >
                  <FiguritaCard figurita={{...fig}} obtenida={true} cantidad={fig.cantidad || 1} />
                </motion.div>
              ))}
            </div>

            {/* Resumen Final */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-16 flex flex-col items-center bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md"
            >
              <div className="flex gap-4 mb-8 w-full">
                <div className="flex-1 text-center px-4 py-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <p className="text-green-400 text-3xl font-black">{nuevas}</p>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Nuevas</p>
                </div>
                <div className="flex-1 text-center px-4 py-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                  <p className="text-yellow-400 text-3xl font-black">{repetidas}</p>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Repetidas</p>
                </div>
              </div>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={onClose}
                  className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest italic"
                >
                  Abrir otro sobre
                </button>
                <button
                  onClick={handleIrAlbum}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest italic border border-white/5"
                >
                  Ver en mi álbum
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SobreModal;
