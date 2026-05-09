const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Ruta de usuarios no implementada aún' }));

module.exports = router;
