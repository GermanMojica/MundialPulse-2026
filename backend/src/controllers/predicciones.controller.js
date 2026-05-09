const getPredicciones = async (req, res, next) => {
  try {
    res.json({ message: 'Ruta de predicciones no implementada aún' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPredicciones
};
