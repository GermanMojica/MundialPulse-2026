import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLivePartidos, getPartidos } from '../services/partidos.service';
import { PartidoCard } from '../components/partidos/PartidoCard';
import { TablaGrupos } from '../components/partidos/TablaGrupos';
import { TopGoleadores } from '../components/partidos/TopGoleadores';
import { Spinner, EmptyState } from '../components/ui';

export const Home = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const worldCupStart = new Date('2026-06-11T00:00:00Z').getTime();
    const calculateDays = () => {
      const now = new Date().getTime();
      const distance = worldCupStart - now;
      setDaysLeft(Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))));
    };
    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  const { data: liveMatches, isLoading: loadingLive } = useQuery({
    queryKey: ['partidos', 'live'],
    queryFn: getLivePartidos,
    refetchInterval: 30000,
  });

  const { data: todayMatches, isLoading: loadingToday } = useQuery({
    queryKey: ['partidos', 'today'],
    queryFn: () => getPartidos(new Date().toISOString().split('T')[0]),
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-surface border border-surface-2 p-8 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-bg z-0"></div>
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-text mb-4 tracking-tighter">
            MUNDIAL <span className="text-primary">2026</span>
          </h1>
          <div className="flex flex-col items-center bg-surface-2/80 backdrop-blur-sm border border-surface px-8 py-4 rounded-xl">
            <span className="text-4xl font-bold text-text tabular-nums">{daysLeft}</span>
            <span className="text-sm font-medium text-text-muted uppercase tracking-widest mt-1">Días para el inicio</span>
          </div>
        </div>
      </section>

      {/* En Vivo Ahora */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h2 className="text-2xl font-bold">En vivo ahora</h2>
        </div>
        {loadingLive ? (
          <Spinner />
        ) : liveMatches?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map(match => (
              <PartidoCard key={match.id} partido={match} />
            ))}
          </div>
        ) : (
          <p className="text-text-muted bg-surface-2 rounded-xl p-4 text-center border border-surface">
            No hay partidos en curso.
          </p>
        )}
      </section>

      {/* Partidos de Hoy */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Partidos de hoy</h2>
        {loadingToday ? (
          <Spinner />
        ) : todayMatches?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayMatches.map(match => (
              <PartidoCard key={match.id} partido={match} />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="Sin partidos programados" 
            description="Hoy no hay partidos del mundial." 
          />
        )}
      </section>

      {/* Grids Inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <TablaGrupos />
        </section>
        <section>
          <TopGoleadores />
        </section>
      </div>
    </div>
  );
};
