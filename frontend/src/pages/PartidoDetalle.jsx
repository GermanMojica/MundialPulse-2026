import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getPartidoById } from '../services/partidos.service';
import { Marcador } from '../components/partidos/Marcador';
import { Timeline } from '../components/partidos/Timeline';
import { StatsPartido } from '../components/partidos/StatsPartido';
import { ChatPartido } from '../components/partidos/ChatPartido';
import { useSocket } from '../hooks/useSocket';
import { Spinner } from '../components/ui/Spinner';
import { toast } from 'react-hot-toast';

export const PartidoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('resumen');
  
  const { data: partido, isLoading, error } = useQuery({
    queryKey: ['partido', id],
    queryFn: () => getPartidoById(id),
  });

  // Manejador de eventos de socket
  const handleSocketEvent = useCallback((type, data) => {
    console.log(`Socket Event [${type}]:`, data);
    
    // Actualizar cache de React Query directamente
    queryClient.setQueryData(['partido', id], (oldData) => {
      if (!oldData) return data;
      // Merge data or just replace if it's a full update
      return { ...oldData, ...data };
    });

    if (type === 'gol') {
      toast.success(`¡GOL! ${data.lastScorer || ''}`, {
        icon: '⚽',
        duration: 5000,
      });
    }
  }, [id, queryClient]);

  // Suscribirse al socket del partido
  useSocket(`partido-${id}`, handleSocketEvent);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
      <p className="mt-4 text-text-muted animate-pulse">Cargando detalles del partido...</p>
    </div>
  );

  if (error || !partido) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-text mb-2">Error al cargar el partido</h2>
      <p className="text-text-muted mb-6">No pudimos encontrar los datos que buscabas.</p>
      <button 
        onClick={() => navigate('/partidos')}
        className="px-6 py-2 bg-primary text-background font-bold rounded-lg hover:opacity-90 transition-opacity"
      >
        Volver a Partidos
      </button>
    </div>
  );

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'estadisticas', label: 'Estadísticas' },
    { id: 'predicciones', label: 'Predicciones' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Volver
      </button>

      {/* Marcador Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Marcador partido={partido} />
      </motion.div>

      {/* Navegación por Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-8 w-fit border border-white/5">
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

      {/* Contenido de Tabs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'resumen' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <Timeline eventos={partido.eventos || []} />
              </div>
              <div className="lg:col-span-4 space-y-6">
                <ChatPartido partidoId={id} />
                
                <div className="bg-card rounded-2xl p-6 border border-white/5">
                  <h4 className="font-bold text-text mb-4">Información del Encuentro</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Estadio</span>
                      <span className="text-text font-medium">{partido.venue || 'Por definir'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Competición</span>
                      <span className="text-text font-medium">Copa del Mundo 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Árbitro</span>
                      <span className="text-text font-medium">{partido.referee || 'Por asignar'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'estadisticas' && (
            <div className="max-w-3xl mx-auto">
              <StatsPartido stats={partido.stats || {
                possession: { home: 50, away: 50 },
                shots: { home: 0, away: 0 },
                shotsOnTarget: { home: 0, away: 0 },
                passes: { home: 0, away: 0 },
                corners: { home: 0, away: 0 },
                fouls: { home: 0, away: 0 }
              }} />
            </div>
          )}

          {activeTab === 'predicciones' && (
            <div className="bg-card rounded-2xl p-12 border border-white/5 text-center">
              <div className="text-5xl mb-6">🔮</div>
              <h3 className="text-2xl font-bold text-text mb-4">¿Quién ganará?</h3>
              <p className="text-text-muted mb-8 max-w-md mx-auto">
                Realiza tu predicción antes del pitido inicial para ganar puntos y subir en el ranking.
              </p>
              <div className="flex justify-center gap-4">
                <button className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold border border-white/10 transition-all">
                  Local
                </button>
                <button className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold border border-white/10 transition-all">
                  Empate
                </button>
                <button className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold border border-white/10 transition-all">
                  Visitante
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
