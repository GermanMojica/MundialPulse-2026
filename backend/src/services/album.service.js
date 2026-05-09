const crypto = require('crypto');
const prisma = require('../models/db');

/**
 * Abre un sobre de figuritas para el usuario.
 * @param {string} userId - ID del usuario
 * @param {string} tipo - "basico" | "premium" | "leyenda"
 * @returns {Promise<{ figuritas: any[] }>} - Las figuritas obtenidas
 */
const abrirSobreAutomatico = async (userId, tipo) => {
  let numFiguritas = 5;
  if (tipo === 'premium') numFiguritas = 10;
  if (tipo === 'leyenda') numFiguritas = 15;

  const figuritasObtenidas = [];

  // Obtener IDs de figuritas por rareza para optimizar
  // Asumiendo que ya hay figuritas en la BD
  const [comunes, raras, epicas, legendarias] = await Promise.all([
    prisma.figurita.findMany({ where: { rareza: 'común' }, select: { id: true } }),
    prisma.figurita.findMany({ where: { rareza: 'rara' }, select: { id: true } }),
    prisma.figurita.findMany({ where: { rareza: 'épica' }, select: { id: true } }),
    prisma.figurita.findMany({ where: { rareza: 'legendaria' }, select: { id: true } })
  ]);

  const getRandomFigurita = (lista) => {
    if (lista.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * lista.length);
    return lista[randomIndex].id;
  };

  let tieneEstrella = false;

  for (let i = 0; i < numFiguritas; i++) {
    // Math.random() para rareza
    let r = Math.random();
    
    // Si es el último intento del sobre leyenda y no tiene estrella, forzar épica/legendaria
    if (tipo === 'leyenda' && i === numFiguritas - 1 && !tieneEstrella) {
      r = Math.random() * 0.10; // Forzar que sea < 0.10
    }

    // Sobre premium: modificar probabilidad ligeramente (ej. menos comunes)
    if (tipo === 'premium') {
      // 50% comun, 35% rara, 12% epica, 3% legendaria
      if (r < 0.03) r = 0.01;
      else if (r < 0.15) r = 0.05;
      else if (r < 0.50) r = 0.20;
      else r = 0.50;
    }

    let rarezaSeleccionada = 'común';
    let figuritaId = null;

    if (r <= 0.02 && legendarias.length > 0) {
      rarezaSeleccionada = 'legendaria';
      figuritaId = getRandomFigurita(legendarias);
      tieneEstrella = true;
    } else if (r <= 0.10 && epicas.length > 0) {
      rarezaSeleccionada = 'épica';
      figuritaId = getRandomFigurita(epicas);
      tieneEstrella = true;
    } else if (r <= 0.30 && raras.length > 0) {
      rarezaSeleccionada = 'rara';
      figuritaId = getRandomFigurita(raras);
    } else if (comunes.length > 0) {
      figuritaId = getRandomFigurita(comunes);
    }

    if (figuritaId) {
      figuritasObtenidas.push(figuritaId);
    }
  }

  // Ahora agregamos a la colección del usuario
  const resultadoFiguritas = [];

  for (const figuritaId of figuritasObtenidas) {
    // Buscar si ya la tiene
    const existente = await prisma.coleccionFiguritas.findUnique({
      where: {
        userId_figuritaId: { userId, figuritaId }
      }
    });

    let registro;
    let esRepetida = false;

    if (existente) {
      registro = await prisma.coleccionFiguritas.update({
        where: { id: existente.id },
        data: { cantidad: existente.cantidad + 1 }
      });
      esRepetida = true;
    } else {
      registro = await prisma.coleccionFiguritas.create({
        data: {
          userId,
          figuritaId,
          cantidad: 1
        }
      });
    }

    // Obtener detalles de la figurita para devolver
    const detalle = await prisma.figurita.findUnique({ where: { id: figuritaId } });
    resultadoFiguritas.push({
      ...detalle,
      esRepetida
    });
  }

  return { figuritas: resultadoFiguritas };
};

module.exports = {
  abrirSobreAutomatico
};
