const express = require('express');
const router = express.Router();
const partidosController = require('../controllers/partidos.controller');

router.get('/', partidosController.getPartidos);
router.get('/live', partidosController.getPartidosLive);
router.get('/:id', partidosController.getPartidoById);

module.exports = router;
