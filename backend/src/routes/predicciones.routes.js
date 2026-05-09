const express = require('express');
const router = express.Router();
const { savePrediccion, getMisPredicciones, getRankingGlobal } = require('../controllers/predicciones.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, savePrediccion);
router.get('/mis-predicciones', verifyToken, getMisPredicciones);
router.get('/ranking', getRankingGlobal);

module.exports = router;
