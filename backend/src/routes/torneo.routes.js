const express = require('express');
const router = express.Router();
const torneoController = require('../controllers/torneo.controller');

router.get('/grupos', torneoController.getGrupos);
router.get('/goleadores', torneoController.getGoleadores);

module.exports = router;
