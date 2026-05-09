import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPartidos } from '../services/partidos.service';
import { PartidoCard } from '../components/partidos/PartidoCard';
import { Spinner, EmptyState, Button } from '../components/ui';

export const Partidos = () => {
  const [dateFilter, setDateFilter] = useState('');
  
  const { data: partidos, isLoading, error } = useQuery({
    queryKey: ['partidos', dateFilter],
    queryFn: () => getPartidos(dateFilter),
    refetchInterval: 30000,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Partidos</h1>
        
        {/* Filtro de Fechas */}
        <div className="flex bg-surface-2 p-1 rounded-xl">
          <Button 
            variant={dateFilter === '' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setDateFilter('')}
            className="rounded-lg"
          >
            Todos
          </Button>
          <Button 
            variant={dateFilter === new Date().toISOString().split('T')[0] ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setDateFilter(new Date().toISOString().split('T')[0])}
            className="rounded-lg"
          >
            Hoy
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <EmptyState title="Error" description="Hubo un problema cargando los partidos." />
      ) : partidos?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {partidos.map(match => (
            <PartidoCard key={match.id} partido={match} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No hay partidos" 
          description="No se encontraron partidos para este filtro." 
        />
      )}
    </div>
  );
};
