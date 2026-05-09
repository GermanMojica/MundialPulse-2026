const express = require('express');
const router = express.Router();
const { crearLiga, unirseLiga, getRankingLiga } = require('../controllers/predicciones.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, crearLiga);
router.post('/unirse', verifyToken, unirseLiga);
router.get('/:codigo', verifyToken, getRankingLiga);

module.exports = router;
