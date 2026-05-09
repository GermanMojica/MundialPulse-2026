import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAlbum } from '../hooks/useAlbum';
import GridPaises from '../components/album/GridPaises';
import SobreModal from '../components/album/SobreModal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Album = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'album');
  const [modalSobreOpen, setModalSobreOpen] = useState(false);
  const [figuritasObtenidas, setFiguritasObtenidas] = useState([]);
  const [tipoSobre, setTipoSobre] = useState('basico');
  
  const { miAlbum, misPuntos, abrirSobre } = useAlbum();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleComprarSobre = async (tipo, costo) => {
    const balance = misPuntos.data?.puntos ? (misPuntos.data.puntos.total - misPuntos.data.puntos.gastados) : 0;
    if (balance < costo) {
      toast.error('No tienes suficientes puntos');
      return;
    }
    
    try {
      const res = await abrirSobre.mutateAsync(tipo);
      // El backend devuelve figuritasObtenidas, no figuritas
      setFiguritasObtenidas(res.figuritasObtenidas || []);
      setTipoSobre(tipo);
      setModalSobreOpen(true);
      toast.success(`Sobre ${tipo} abierto con éxito!`);
    } catch (error) {
      toast.error('Error al abrir el sobre');
    }
  };

  if (miAlbum.isLoading && misPuntos.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-yellow-500/30 border-t-yellow-500 animate-spin"></div>
        <p className="text-slate-400 text-sm">Cargando álbum...</p>
      </div>
    );
  }

  if (miAlbum.isError || misPuntos.isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <span className="text-5xl">⚠️</span>
        <h2 className="text-white font-bold text-xl">No se pudo cargar el álbum</h2>
        <p className="text-slate-400 text-sm">Verifica que el servidor esté activo y vuelve a intentarlo.</p>
        <button 
          onClick={() => { miAlbum.refetch(); misPuntos.refetch(); }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-24 max-w-4xl">
      <div className="flex flex-col items-center mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter uppercase italic">
            ÁLBUM <span className="text-primary drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">MundialPulse</span> <span className="text-yellow-400">2026</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">Colecciona la pasión del fútbol mundial</p>
        </motion.div>

        {miAlbum.data && (
          <div className="w-full max-w-md mt-8 px-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Progreso Global</span>
              <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {miAlbum.data.porcentajeGlobal}%
              </span>
            </div>
            <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden border border-slate-700/50 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${miAlbum.data.porcentajeGlobal}%` }}
                className={`h-full rounded-full ${miAlbum.data.porcentajeGlobal === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-primary to-green-400'} shadow-[0_0_10px_rgba(34,197,94,0.3)]`}
              />
            </div>
            <p className="text-center text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-tighter">
              {miAlbum.data.totalFiguritas.toLocaleString()} de {miAlbum.data.totalPosibles.toLocaleString()} figuritas obtenidas
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-1 mb-10 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl sticky top-20 z-40">
        {[
          { id: 'album', label: 'Mi Álbum', icon: '📖' },
          { id: 'sobres', label: 'Tienda', icon: '📦' },
          { id: 'puntos', label: 'Puntos', icon: '🪙' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab.id 
                ? 'text-white' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {/* MI ÁLBUM */}
        {activeTab === 'album' && (
          <GridPaises paises={miAlbum.data?.paises || []} />
        )}

        {/* TIENDA DE SOBRES */}
        {activeTab === 'sobres' && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-2">Tienda de sobres</h2>
            <p className="text-slate-300 mb-8">Tienes <span className="font-bold text-yellow-400">{misPuntos.data?.puntos ? (misPuntos.data.puntos.total - misPuntos.data.puntos.gastados) : 0}</span> puntos</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <SobreCard 
                tipo="Básico" 
                codigo="basico"
                precio={500} 
                cantidadFiguritas={5}
                puntosActuales={misPuntos.data?.puntos ? (misPuntos.data.puntos.total - misPuntos.data.puntos.gastados) : 0}
                onComprar={handleComprarSobre}
                color="blue"
                loading={abrirSobre.isPending}
              />
              <SobreCard 
                tipo="Premium" 
                codigo="premium"
                precio={1000} 
                cantidadFiguritas={10}
                puntosActuales={misPuntos.data?.puntos ? (misPuntos.data.puntos.total - misPuntos.data.puntos.gastados) : 0}
                onComprar={handleComprarSobre}
                color="purple"
                loading={abrirSobre.isPending}
              />
              <SobreCard 
                tipo="Leyenda" 
                codigo="leyenda"
                precio={2000} 
                cantidadFiguritas={15}
                puntosActuales={misPuntos.data?.puntos ? (misPuntos.data.puntos.total - misPuntos.data.puntos.gastados) : 0}
                onComprar={handleComprarSobre}
                color="yellow"
                loading={abrirSobre.isPending}
              />
            </div>
          </div>
        )}

        {/* MIS PUNTOS */}
        {activeTab === 'puntos' && (
          <div className="space-y-6 max-w-2xl mx-auto pb-10">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg text-center">
              <h2 className="text-slate-400 font-medium mb-2">Balance Disponible</h2>
              <div className="text-5xl font-black text-white flex items-center justify-center gap-3 drop-shadow">
                <span className="text-yellow-400">🪙</span>
                {misPuntos.data?.puntos ? (misPuntos.data.puntos.total - misPuntos.data.puntos.gastados) : 0}
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
                <h3 className="text-white font-bold">Historial de Transacciones</h3>
              </div>
              <div className="divide-y divide-slate-700/50 max-h-[400px] overflow-y-auto">
                {misPuntos.data?.transacciones?.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">No hay transacciones aún.</div>
                ) : (
                  misPuntos.data?.transacciones?.map(tx => {
                    const icon = tx.tipo?.includes('prediccion') ? '⚽' : tx.tipo === 'compra_sobre' ? '📦' : '🎁';
                    const diffTime = Math.abs(new Date() - new Date(tx.createdAt));
                    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                    const timeText = diffHours < 24 ? `hace ${diffHours} horas` : `hace ${Math.floor(diffHours/24)} días`;
                    
                    return (
                      <div key={tx.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-slate-700`}>
                            {icon}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{tx.descripcion}</p>
                            <p className="text-slate-500 text-xs">{timeText}</p>
                          </div>
                        </div>
                        <div className={`font-bold ${tx.cantidad > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.cantidad > 0 ? '+' : ''}{tx.cantidad}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <SobreModal 
        isOpen={modalSobreOpen} 
        onClose={() => setModalSobreOpen(false)} 
        figuritas={figuritasObtenidas}
        tipo={tipoSobre}
      />
    </div>
  );
};

const SobreCard = ({ tipo, codigo, precio, puntosActuales, onComprar, color, cantidadFiguritas, loading }) => {
  const puedeComprar = puntosActuales >= precio;

  const bgColors = {
    blue: 'from-blue-600 to-blue-800 border-blue-500',
    purple: 'from-purple-600 to-purple-800 border-purple-500',
    yellow: 'from-yellow-500 to-yellow-700 border-yellow-400'
  };

  const btnColors = {
    blue: 'bg-blue-500 hover:bg-blue-400',
    purple: 'bg-purple-500 hover:bg-purple-400',
    yellow: 'bg-yellow-400 hover:bg-yellow-300 text-slate-900'
  };

  return (
    <div className={`rounded-xl border-2 bg-gradient-to-br ${bgColors[color]} p-5 shadow-xl flex flex-col h-full ${!puedeComprar ? 'opacity-40 grayscale' : ''}`}>
      <div className="flex flex-col items-center flex-grow text-center">
        <span className="text-6xl mb-4 drop-shadow-md">📦</span>
        <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-1">Sobre {tipo}</h3>
        <p className="text-white/80 text-sm font-medium mb-6 flex-grow">{cantidadFiguritas} figuritas</p>
        
        <div className="w-full flex items-center justify-center gap-2 mb-4">
          <span className="text-yellow-400">🪙</span>
          <span className="text-white font-bold text-xl">{precio}</span>
        </div>

        <button
          onClick={() => onComprar(codigo, precio)}
          disabled={!puedeComprar || loading}
          className={`w-full py-2.5 rounded-lg font-bold transition-all shadow-md flex justify-center items-center gap-2 ${
            !puedeComprar 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600' 
              : `${btnColors[color]} text-white transform hover:scale-105 active:scale-95`
          }`}
        >
          {loading ? 'Comprando...' : 'Comprar'}
        </button>
      </div>
    </div>
  );
};

export default Album;
