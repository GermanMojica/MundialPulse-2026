const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const albumController = require('../controllers/album.controller');

// Todas las rutas de álbum requieren autenticación
router.use(verifyToken);

router.get('/mi-album', albumController.getMiAlbum);
router.get('/pais/:codigo', albumController.getPaisFiguritas);
router.post('/abrir-sobre', albumController.abrirSobre);
router.get('/mis-puntos', albumController.getMisPuntos);

module.exports = router;
