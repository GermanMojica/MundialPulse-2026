const prisma = require('../models/db');

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

const procesarPuntosPartido = async (partidoId, resultadoReal) => {
  try {
    // Obtener todas las predicciones para este partido que no han sido procesadas
    // (En este esquema no tenemos un flag 'procesada', así que lo ideal sería filtrar por las que no tienen puntos asignados aún o simplemente procesar todas)
    const predicciones = await prisma.prediccion.findMany({
      where: { partidoId }
    });

    for (const pred of predicciones) {
      const puntosObtenidos = calcularPuntos(pred, resultadoReal);
      
      if (puntosObtenidos > 0) {
        // Actualizar puntos del usuario
        await prisma.puntos.update({
          where: { userId: pred.userId },
          data: {
            total: { increment: puntosObtenidos },
            partidosAcertados: { increment: puntosObtenidos >= 2 ? 1 : 0 },
            resultadosExactos: { increment: puntosObtenidos === 5 ? 1 : 0 }
          }
        });
      }
    }
    
    console.log(`Puntos procesados para el partido ${partidoId}`);
  } catch (error) {
    console.error('Error procesando puntos:', error);
  }
};

module.exports = {
  calcularPuntos,
  procesarPuntosPartido
};
