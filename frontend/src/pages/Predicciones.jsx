import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getMisPredicciones, getRankingGlobal, crearLiga, unirseLiga, getRankingLiga } from '../services/predicciones.service';
import { getPartidos } from '../services/partidos.service';
import { FormPrediccion } from '../components/predicciones/FormPrediccion';
import { Spinner } from '../components/ui/Spinner';
import { toast } from 'react-hot-toast';

export const Predicciones = () => {
  const [activeTab, setActiveTab] = useState('predecir');
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  // Queries
  const { data: partidos = [], isLoading: loadingPartidos } = useQuery({
    queryKey: ['partidos', 'upcoming'],
    queryFn: () => getPartidos(), // Filtraremos por TIMED en el render
    select: (data) => data.filter(p => p.status === 'TIMED')
  });

  const { data: misPredicciones = [] } = useQuery({
    queryKey: ['mis-predicciones'],
    queryFn: () => getMisPredicciones(token),
    enabled: !!token
  });

  const { data: rankingGlobal = [] } = useQuery({
    queryKey: ['ranking-global'],
    queryFn: getRankingGlobal
  });

  const tabs = [
    { id: 'predecir', label: 'Predecir' },
    { id: 'mis-predicciones', label: 'Mis Predicciones' },
    { id: 'ranking', label: 'Ranking Global' },
    { id: 'liga', label: 'Mi Liga' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-black text-text mb-8 flex items-center gap-4">
        <span className="text-primary text-5xl">🔮</span> Predicciones
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-12 w-fit border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-background shadow-lg' 
                : 'text-text-muted hover:text-text hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'predecir' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingPartidos ? <Spinner /> : partidos.map(partido => (
                <FormPrediccion 
                  key={partido.id} 
                  partido={partido} 
                  onSaved={() => queryClient.invalidateQueries(['mis-predicciones'])}
                />
              ))}
            </div>
          )}

          {activeTab === 'mis-predicciones' && (
            <div className="space-y-4">
              {misPredicciones.map((pred, idx) => (
                <div key={idx} className="bg-card rounded-xl p-6 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-text-muted uppercase tabular-nums">
                      {new Date(pred.createdAt).toLocaleDateString()}
                    </span>
                    <div className="text-lg font-black text-text">
                      Partido ID: {pred.partidoId}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                      {pred.golesLocal} - {pred.golesVisitante}
                    </span>
                  </div>
                </div>
              ))}
              {misPredicciones.length === 0 && <p className="text-center text-text-muted py-12">No has realizado predicciones aún.</p>}
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="bg-card rounded-2xl border border-white/5 overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Pos</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Usuario</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase text-right">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rankingGlobal.map((item, idx) => (
                    <tr key={idx} className={idx < 3 ? 'bg-primary/5' : ''}>
                      <td className="px-6 py-4 font-black italic text-xl">#{idx + 1}</td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {item.user.username[0].toUpperCase()}
                        </div>
                        <span className="font-bold">{item.user.username}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-2xl text-primary">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'liga' && (
             <LigaSeccion />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const LigaSeccion = () => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await unirseLiga(codigo, token);
      toast.success('¡Te has unido a la liga!');
      queryClient.invalidateQueries(['mi-liga']);
    } catch (error) {
      toast.error('Código inválido');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await crearLiga(nombre, token);
      toast.success('¡Liga creada exitosamente!');
      queryClient.invalidateQueries(['mi-liga']);
    } catch (error) {
      toast.error('Error al crear liga');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-card rounded-2xl p-8 border border-white/5">
        <h3 className="text-xl font-bold mb-6">Crear Liga Privada</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nombre de la liga"
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button className="w-full py-3 bg-primary text-background font-bold rounded-xl">CREAR LIGA</button>
        </form>
      </div>

      <div className="bg-card rounded-2xl p-8 border border-white/5">
        <h3 className="text-xl font-bold mb-6">Unirse con Código</h3>
        <form onSubmit={handleJoin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Ej: XJ82KP"
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors text-center font-black tracking-widest uppercase"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-text font-bold rounded-xl border border-white/10">UNIRSE</button>
        </form>
      </div>
    </div>
  );
};
