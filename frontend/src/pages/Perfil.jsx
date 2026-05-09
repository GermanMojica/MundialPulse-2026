import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAlbum } from '../hooks/useAlbum';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoFootball, IoTrophy, IoBook, IoCash, IoLogOut, IoPerson } from 'react-icons/io5';

const Perfil = () => {
  const { user, logout } = useAuth();
  const { miAlbum, misPuntos } = useAlbum();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const puntosTotales = misPuntos.data?.puntos?.total || 0;
  const puntosGastados = misPuntos.data?.puntos?.gastados || 0;
  const puntosDisponibles = puntosTotales - puntosGastados;
  const figuritas = miAlbum.data?.totalFiguritas || 0;
  const progreso = miAlbum.data?.porcentajeGlobal || 0;
  const transacciones = misPuntos.data?.transacciones || [];

  const initials = user?.username?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="max-w-2xl mx-auto pb-24 pt-2">
      {/* Header tarjeta de perfil */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{ background: 'linear-gradient(135deg, #1a1a36 0%, #0f172a 100%)', border: '1px solid rgba(99,102,241,0.3)' }}
      >
        {/* Decoración fondo */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-green-500/10 blur-2xl pointer-events-none" />

        <div className="relative p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-indigo-500/30 border-2 border-indigo-400/40">
            {user?.avatar
              ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              : initials
            }
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-black text-white tracking-tight">{user?.username}</h1>
            <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 font-medium">
                ⚽ Hincha Mundial 2026
              </span>
            </div>
          </div>

          {/* Botón cerrar sesión */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-lg transition-all"
          >
            <IoLogOut size={16} />
            Salir
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <StatCard icon={<IoCash className="text-yellow-400" size={22} />} label="Puntos" value={puntosDisponibles.toLocaleString()} color="yellow" />
        <StatCard icon={<IoBook className="text-blue-400" size={22} />} label="Figuritas" value={figuritas} color="blue" />
        <StatCard icon={<IoTrophy className="text-purple-400" size={22} />} label="Progreso" value={`${progreso}%`} color="purple" />
      </motion.div>

      {/* Barra progreso álbum */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold flex items-center gap-2">
            <IoBook className="text-blue-400" /> Álbum Mundial 2026
          </span>
          <span className="text-slate-400 text-sm">{figuritas} / 1,104</span>
        </div>
        <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progreso}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className={`h-full rounded-full ${progreso === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-slate-500 text-xs">Inicio</span>
          <span className={`text-xs font-bold ${progreso === 100 ? 'text-green-400' : 'text-blue-400'}`}>{progreso}% completado</span>
        </div>
      </motion.div>

      {/* Balance de puntos */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 mb-6"
      >
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <IoCash className="text-yellow-400" /> Balance de Puntos
        </h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <p className="text-green-400 text-xl font-black">+{puntosTotales.toLocaleString()}</p>
            <p className="text-slate-500 text-xs mt-1">Ganados</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <p className="text-yellow-400 text-xl font-black">{puntosDisponibles.toLocaleString()}</p>
            <p className="text-slate-500 text-xs mt-1">Disponibles</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <p className="text-red-400 text-xl font-black">-{puntosGastados.toLocaleString()}</p>
            <p className="text-slate-500 text-xs mt-1">Gastados</p>
          </div>
        </div>
      </motion.div>

      {/* Historial reciente */}
      {transacciones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-700">
            <h2 className="text-white font-semibold">Actividad Reciente</h2>
          </div>
          <div className="divide-y divide-slate-700/50 max-h-72 overflow-y-auto">
            {transacciones.slice(0, 10).map(tx => {
              const icon = tx.tipo?.includes('prediccion') ? '⚽' : tx.tipo === 'compra_sobre' ? '📦' : '🎁';
              const diffTime = Math.abs(new Date() - new Date(tx.createdAt));
              const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
              const timeText = diffHours < 1 ? 'hace menos de 1 hora' : diffHours < 24 ? `hace ${diffHours} horas` : `hace ${Math.floor(diffHours / 24)} días`;

              return (
                <div key={tx.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-lg">{icon}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{tx.descripcion}</p>
                      <p className="text-slate-500 text-xs">{timeText}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${tx.cantidad > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.cantidad > 0 ? '+' : ''}{tx.cantidad}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    yellow: 'bg-yellow-500/10 border-yellow-500/20',
    blue: 'bg-blue-500/10 border-blue-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
  };
  return (
    <div className={`rounded-xl border p-4 text-center ${colors[color]}`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-white font-black text-lg leading-tight">{value}</p>
      <p className="text-slate-500 text-xs mt-1">{label}</p>
    </div>
  );
};

export default Perfil;
