import React from 'react';
import { Card } from '../ui/Card';

export const TopGoleadores = () => {
  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Top Goleadores</h3>
      <div className="text-text-muted text-center py-8">
        Aún no hay goleadores registrados.
      </div>
    </Card>
  );
};
