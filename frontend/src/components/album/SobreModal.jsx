import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FiguritaCard from './FiguritaCard';

const SobreModal = ({ isOpen, onClose, figuritas, tipo = 'basico' }) => {
  const [fase, setFase] = useState('cerrado'); // cerrado -> abriendo -> revelando -> resumen
  const [figuritasMostradas, setFiguritasMostradas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setFase('cerrado');
      setFiguritasMostradas([]);
      
      // Auto-iniciar la apertura
      setTimeout(() => {
        handleAbrir();
      }, 500);
    }
  }, [isOpen]);

  const reproducirDing = () => {
    if (window.AudioContext || window.webkitAudioContext) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {
        // Ignorar si el navegador bloquea el audio
      }
    }
  };

  const handleAbrir = () => {
    if (fase !== 'cerrado') return;
    setFase('abriendo');
    
    const targetFiguritas = Array.isArray(figuritas) ? figuritas : [];
    
    // Vibración por 2 segundos
    setTimeout(() => {
      setFase('revelando');
      
      if (targetFiguritas.length === 0) {
        setFase('resumen');
        return;
      }

      // Aparecen una a una con 200ms delay
      targetFiguritas.forEach((fig, index) => {
        setTimeout(() => {
          reproducirDing();
          setFiguritasMostradas(prev => {
            const next = [...prev, fig];
            if (next.length === targetFiguritas.length) {
              setTimeout(() => setFase('resumen'), 1000);
            }
            return next;
          });
        }, index * 200);
      });
    }, 2000);
  };

  const handleIrAlbum = () => {
    onClose();
    navigate('/album');
  };

  if (!isOpen) return null;

  // Asegurarnos de que siempre tengamos un array
  const safeFiguritas = Array.isArray(figuritas) ? figuritas : [];

  const getSobreColor = () => {
    if (tipo === 'leyenda') return 'from-[#B3781A] to-[#EF9F27] border-[#FAC775]';
    if (tipo === 'premium') return 'from-[#4D45A1] to-[#7F77DD] border-[#9B95ED]';
    return 'from-[#1A5C9E] to-[#378ADD] border-[#5E9BE6]';
  };

  const isEspecial = (rareza) => {
    const r = rareza?.toLowerCase() || '';
    return r.includes('legendaria') || r.includes('épica') || r.includes('epica');
  };

  // Calcular resumen usando la propiedad esNueva que viene del backend
  const nuevas = safeFiguritas.filter(f => f.esNueva).length;
  const repetidas = safeFiguritas.length - nuevas;

  return <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 overflow-y-auto"
      style={{ 
        background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.98) 100%)',
        backdropFilter: 'blur(12px)' 
      }}
    >
      <div className="w-full max-w-5xl flex flex-col items-center min-h-full py-10 relative">
        {/* Botón Cerrar (Solo en resumen) */}
        {fase === 'resumen' && (
          <button 
            onClick={onClose}
            className="absolute top-0 right-0 p-2 text-white/50 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}

        {/* FASE 1: Sobre cerrado o vibrando */}
        <AnimatePresence>
          {(fase === 'cerrado' || fase === 'abriendo') && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotate: fase === 'abriendo' ? [-3, 3, -3, 3, 0] : 0,
                  y: [0, -10, 0]
                }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                transition={{ 
                  rotate: { duration: 0.1, repeat: fase === 'abriendo' ? Infinity : 0 },
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className={`w-64 h-80 rounded-2xl border-[4px] bg-gradient-to-br ${getSobreColor()} shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden`}
              >
                {/* Decoration */}
                <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)]" />
                
                <div className="z-10 text-center">
                  <motion.div
                    animate={fase === 'abriendo' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-7xl mb-4 drop-shadow-2xl"
                  >
                    📦
                  </motion.div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic drop-shadow-lg">
                    SOBRE<br/>
                    <span className="text-yellow-400">{tipo}</span>
                  </h2>
                </div>
              </motion.div>
              
              {fase === 'abriendo' && (
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-white/80 mt-10 text-xl font-black italic uppercase tracking-widest animate-pulse"
                >
                  Abriendo sobre...
                </motion.p>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* FASE 2 y 3: Revelando figuritas y Resumen */}
        {(fase === 'revelando' || fase === 'resumen') && (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl px-4">
              <AnimatePresence>
                {figuritasMostradas.map((fig, idx) => (
                  <motion.div
                    key={`${fig.id || idx}-${idx}`}
                    initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotateY: 0
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                    }}
                  >
                    <FiguritaCard figurita={{...fig}} obtenida={true} cantidad={fig.cantidad || 1} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* FASE 3: Botón y resumen */}
            {fase === 'resumen' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 flex flex-col items-center bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl"
              >
                <div className="flex gap-4 mb-6">
                  <div className="text-center px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
                    <p className="text-green-400 text-2xl font-black">{nuevas}</p>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Nuevas</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                    <p className="text-yellow-400 text-2xl font-black">{repetidas}</p>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Repetidas</p>
                  </div>
                </div>

                <button
                  onClick={handleIrAlbum}
                  className="bg-primary hover:bg-primary-dark text-bg font-black py-4 px-10 rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest italic"
                >
                  Ver en mi álbum
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>;
};

export default SobreModal;
