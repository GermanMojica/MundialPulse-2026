const prisma = require('../models/db');
const footballService = require('../services/football.service');

// @desc    Guardar una predicción
// @route   POST /api/predicciones
const savePrediccion = async (req, res, next) => {
  try {
    const { partidoId, golesLocal, golesVisitante } = req.body;
    const userId = req.user.id;

    // Verificar si el partido ya empezó (Cerrar 1 hora antes como pide el usuario)
    const partido = await footballService.getPartidoById(partidoId);
    const matchTime = new Date(partido.utcDate);
    const now = new Date();
    const limit = new Date(matchTime.getTime() - (60 * 60 * 1000));

    if (now > limit) {
      return res.status(400).json({ message: 'Las predicciones cierran 1 hora antes del partido' });
    }

    // Upsert predicción
    const prediccion = await prisma.prediccion.upsert({
      where: {
        // Necesitaríamos un índice único por [userId, partidoId] en Prisma para que esto funcione bien
        // Por ahora buscamos y creamos/actualizamos manualmente
        id: (await prisma.prediccion.findFirst({ where: { userId, partidoId } }))?.id || 'new-uuid'
      },
      update: { golesLocal, golesVisitante },
      create: { userId, partidoId, golesLocal, golesVisitante }
    });

    res.status(201).json(prediccion);
  } catch (error) {
    next(error);
  }
};

// @desc    Mis predicciones
// @route   GET /api/predicciones/mis-predicciones
const getMisPredicciones = async (req, res, next) => {
  try {
    const predicciones = await prisma.prediccion.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(predicciones);
  } catch (error) {
    next(error);
  }
};

// @desc    Ranking Global
// @route   GET /api/predicciones/ranking
const getRankingGlobal = async (req, res, next) => {
  try {
    const ranking = await prisma.puntos.findMany({
      take: 20,
      orderBy: { total: 'desc' },
      include: {
        user: {
          select: { username: true, avatar: true }
        }
      }
    });
    res.json(ranking);
  } catch (error) {
    next(error);
  }
};

// @desc    Crear liga privada
// @route   POST /api/ligas
const crearLiga = async (req, res, next) => {
  try {
    const { nombre } = req.body;
    const creadorId = req.user.id;

    // Generar código único de 6 letras
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();

    const liga = await prisma.ligaPrivada.create({
      data: {
        nombre,
        codigo,
        creadorId,
        miembros: {
          connect: { id: creadorId }
        }
      }
    });

    res.status(201).json(liga);
  } catch (error) {
    next(error);
  }
};

// @desc    Unirse a liga
// @route   POST /api/ligas/unirse
const unirseLiga = async (req, res, next) => {
  try {
    const { codigo } = req.body;
    const userId = req.user.id;

    const liga = await prisma.ligaPrivada.update({
      where: { codigo: codigo.toUpperCase() },
      data: {
        miembros: {
          connect: { id: userId }
        }
      }
    });

    res.json(liga);
  } catch (error) {
    res.status(404).json({ message: 'Código de liga inválido' });
  }
};

// @desc    Ranking de la liga
// @route   GET /api/ligas/:codigo
const getRankingLiga = async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const liga = await prisma.ligaPrivada.findUnique({
      where: { codigo: codigo.toUpperCase() },
      include: {
        miembros: {
          include: {
            puntos: true
          }
        }
      }
    });

    if (!liga) return res.status(404).json({ message: 'Liga no encontrada' });

    const ranking = liga.miembros.map(m => ({
      username: m.username,
      avatar: m.avatar,
      total: m.puntos?.total || 0
    })).sort((a, b) => b.total - a.total);

    res.json({ nombre: liga.nombre, codigo: liga.codigo, ranking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  savePrediccion,
  getMisPredicciones,
  getRankingGlobal,
  crearLiga,
  unirseLiga,
  getRankingLiga
};
