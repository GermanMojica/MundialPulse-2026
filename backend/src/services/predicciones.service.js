const prisma = require('../models/db');
const { calcularPuntosPrediccionInterna } = require('../controllers/album.controller');

/**
 * Calcula los puntos para una predicción basada en el resultado real.
 * Reglas:
 * - Resultado exacto: 5 pts
 * - Ganador/Empate correcto: 2 pts
 * - Diferencia de goles correcta: +1 pt
 */
const calcularPuntos = (prediccion, resultadoReal) => {
  const { golesLocal: pL, golesVisitante: pV } = prediccion;
  const { home: rL, away: rV } = resultadoReal;

  // 1. Resultado Exacto
  if (pL === rL && pV === rV) {
    return 5;
  }

  let puntos = 0;
  const pGanador = pL > pV ? 'H' : pL < pV ? 'A' : 'D';
  const rGanador = rL > rV ? 'H' : rL < rV ? 'A' : 'D';

  // 2. Ganador/Empate correcto
  if (pGanador === rGanador) {
    puntos += 2;
    
    // 3. Diferencia de goles correcta (solo si no es empate, ya que empate con misma diferencia es resultado exacto)
    const pDiff = pL - pV;
    const rDiff = rL - rV;
    if (pDiff === rDiff) {
      puntos += 1;
    }
  }

  return puntos;
};

const procesarPuntosPartido = async (partidoId, resultadoReal, io) => {
  try {
    const { home, away } = resultadoReal;
    await calcularPuntosPrediccionInterna(partidoId, home, away, io);
    console.log(`Puntos procesados para el partido ${partidoId}`);
  } catch (error) {
    console.error('Error procesando puntos:', error);
  }
};

module.exports = {
  calcularPuntos,
  procesarPuntosPartido
};
