const footballService = require('../services/football.service');

const getGrupos = async (req, res, next) => {
  try {
    const grupos = await footballService.getTablaGrupos();
    res.json(grupos);
  } catch (error) {
    next(error);
  }
};

const getGoleadores = async (req, res, next) => {
  try {
    const goleadores = await footballService.getGoleadores();
    res.json(goleadores);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGrupos,
  getGoleadores
};
