const express = require('express');
const router = express.Router();
const prediccionesController = require('../controllers/predicciones.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, prediccionesController.getPredicciones);

module.exports = router;
