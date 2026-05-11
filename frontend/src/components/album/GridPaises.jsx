import { useNavigate } from 'react-router-dom';
import { getPaisData } from '../../utils/paises-data';
import { motion } from 'framer-motion';

const GridPaises = ({ paises }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-24">
      {paises.map((paisData) => {
        const pData = getPaisData(paisData.paisCodigo || paisData.codigo, paisData.pais || paisData.nombre);
        const completado = paisData.porcentaje === 100;

        return (
          <motion.div
            key={paisData.paisCodigo || paisData.codigo}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => navigate(`/album/pais/${paisData.paisCodigo || paisData.codigo}`)}
            className="cursor-pointer rounded-2xl overflow-hidden flex flex-col p-4 relative transition-all duration-300 border border-slate-700/50 hover:border-slate-500/50 group"
            style={{ 
              background: `linear-gradient(135deg, ${pData.colorPrimario}22 0%, #0f172a 100%)`,
            }}
          >
            {/* Top Badge (Code) */}
            <div className="absolute top-2 right-3 text-[10px] font-black text-white/20 uppercase">
              {paisData.paisCodigo || paisData.codigo}
            </div>

            {/* Crest Container */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                {/* Glow Background */}
                <div 
                  className="absolute inset-0 blur-lg opacity-20 rounded-full"
                  style={{ backgroundColor: pData.colorPrimario }}
                />
                <img 
                  src={pData.escudo} 
                  alt={pData.nombre}
                  className="w-full h-full object-contain relative z-10 drop-shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="text-4xl hidden">{pData.bandera}</div>
              </div>
            </div>

            {/* Info */}
            <div className="text-center flex flex-col flex-1">
              <h3 className="text-white font-bold text-sm leading-tight mb-3 h-8 flex items-center justify-center px-1">
                {pData.nombre}
              </h3>
              
              <div className="mt-auto space-y-2">
                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${paisData.porcentaje}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${completado ? 'bg-green-500' : ''}`}
                    style={{ 
                      backgroundColor: !completado ? pData.colorPrimario : undefined,
                      boxShadow: completado ? '0 0 8px rgba(34, 197, 94, 0.5)' : `0 0 8px ${pData.colorPrimario}66`
                    }}
                  />
                </div>
                
                <div className="flex justify-between items-center px-0.5">
                  <span className={`text-[10px] font-bold ${completado ? 'text-green-400' : 'text-slate-400'}`}>
                    {paisData.totalObtenidas} / 23
                  </span>
                  <span className="text-[10px] font-black text-slate-500">
                    {paisData.porcentaje}%
                  </span>
                </div>
              </div>
            </div>

            {/* Glow effect on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: pData.colorPrimario }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default GridPaises;
