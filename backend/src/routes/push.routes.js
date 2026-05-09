const express = require('express');
const router = express.Router();
const { subscribe } = require('../controllers/push.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/subscribe', verifyToken, subscribe);

module.exports = router;
