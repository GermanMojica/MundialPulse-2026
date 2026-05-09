const footballService = require('../services/football.service');

// @desc    Get all partidos (with optional date)
// @route   GET /api/partidos
const getPartidos = async (req, res, next) => {
  try {
    const { date } = req.query;
    const partidos = await footballService.getPartidos(date);
    res.json(partidos);
  } catch (error) {
    next(error);
  }
};

// @desc    Get live partidos
// @route   GET /api/partidos/live
const getPartidosLive = async (req, res, next) => {
  try {
    // API uses current day to find live matches
    const date = new Date().toISOString().split('T')[0];
    const partidos = await footballService.getPartidos(date);
    const live = partidos.filter(p => p.status === 'IN_PLAY' || p.status === 'PAUSED');
    res.json(live);
  } catch (error) {
    next(error);
  }
};

// @desc    Get partido by ID
// @route   GET /api/partidos/:id
const getPartidoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const partido = await footballService.getPartidoById(id);
    res.json(partido);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPartidos,
  getPartidosLive,
  getPartidoById
};
